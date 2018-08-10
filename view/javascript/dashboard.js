$(function () {

  initLaydate();

 //获取所有章节数
  getAllChapter();

});

function getRate() {
var myChart = echarts.init(document.getElementById('chart-dom'));

option = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            crossStyle: {
                color: '#999'
            }
        }
    },
    toolbox: {
        show:false,
        feature: {
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar']},
            restore: {show: true},
            saveAsImage: {show: true}
        }
    },
    grid:{
        left:'5%',
        right:'5%',
        bottom:'15%'

    },
    legend: {
        data:['总观次数','付费人数','平均分布']
    },
    xAxis: [
        {
            type: 'category',
            data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
            axisPointer: {
                type: 'shadow'
            }
        }
    ],
    yAxis: [
        {
            type: 'value',
            name: '总观看次数',
            min: 0,
            max: 250,
            interval: 50,
            axisLabel: {
                formatter: '{value}'
            }
        },
        {
            type: 'value',
            name: '百分比',
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
                formatter: '{value} '
            }
        }
    ],
    series: [
        {
            name:'总观次数',
            type:'bar',
            data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
        },
        {
            name:'付费人数',
            type:'bar',
            data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
        },
        {
            name:'平均分布',
            type:'bar',
            yAxisIndex: 1,
            data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
        }
    ]
};
 myChart.setOption(option);
}




//获取所有章节
function getAllChapter() {
     $.ajax({
       type: "GET",
       // url: "http://localhost:5000/todos",
       url:host+"/todos",
       // data: {"data_start":"20180520","data_end":"20180525","code":"1202"},
       data:"",
         // cache:false,
        // data:{
        // "date_start":"20180519",
        // "date_end":"20180525",
        // "code":"1202"
        // },

        // 请求发送之前（发送请求前可修改XMLHttpRequest对象的函数，如添加自定义HTTP头。）。
        beforeSend:function(XMLHttpRequest){
              XMLHttpRequest.setRequestHeader("If-Modified-Since","0");
              XMLHttpRequest.setRequestHeader("Cache-Control","no-cache");
              $('#shclProgress').show();
               progressLoading();
        },

       success: function(data){
             getAllCapter(data.chapter,data.chapter_sk);
           //默认加载所有视频列表
             chaptervideoLists();

            //获取所有章节表格数据
             getAllCaptertableList();
          },
          // 请求完成后的回调函数 (请求成功或失败之后均调用)
        complete:function(XMLHttpRequest,textStatus){
            $('#shclProgress').hide();

        },
      // timeout: 15000,
      error: function (error) {
           alert('查询错误，请检查日期是否输入正确。')
           console.log(error)
      }
    });
}

//获取指定章节
function getoptionChapter(school,subject) {
    getAllCaptertableList();//选定学科和学段的情况
    if(school == 0){
        var sub=document.getElementById("school");
        var index = sub.selectedIndex; // 选中索引
        var albumid= sub.options[index].value;//要的值
        var res = {"school":albumid,"subject":subject};
        //根据学科改变视频列表
        getSubjectList(subject);
    }
    if(subject == 0){
        var sub=document.getElementById("selects");
        var index = sub.selectedIndex; // 选中索引
        var albumid= sub.options[index].value;//要的值
        var res = {"school":school,"subject":albumid};
         //根据学段改变视频列表
        getStageList(school);

    }

    res = JSON.stringify(res);
      console.log('获取指定章节请求的数据为：',res)
    $.ajax({
       type: "POST",
       // url: "http://localhost:5000/todos",
       url:host+"/todos",
       data:res,
        // cache:false,
          // 请求发送之前（发送请求前可修改XMLHttpRequest对象的函数，如添加自定义HTTP头。）。
        beforeSend:function(XMLHttpRequest){
           XMLHttpRequest.setRequestHeader("If-Modified-Since","0");
           XMLHttpRequest.setRequestHeader("Cache-Control","no-cache");
           $('#shclProgress').show();
            progressLoading();
        },
       success: function(data){
           getAllCapter(data.chapter,data.chapter_sk);
          },
         // 请求完成后的回调函数 (请求成功或失败之后均调用)
        complete:function(XMLHttpRequest,textStatus){
            $('#shclProgress').hide();

        },
      // timeout: 15000,
      error: function (error) {
           alert('报错啦')
           console.log(error)
      }
    });
}

//默认选择全部章节
function getAllCapter(data,chapter_sk) {

    $("#chapter").empty();
    for(var i = -1;i < data.length;i++){
        if(i == -1){
            $("#chapter").append("<option value=''>全部</option>");
            continue;
        }
       $("#chapter").append("<option value='"+chapter_sk[i]+"'>"+data[i]+"</option>");
     }
}

//默认选择所章节列表---按学段/学科--查询全部的情况
function getAllCaptertableList() {
    /* var stage_id = "";
     var subject_id = "";*/
           //获取学段的值
        var stageId=document.getElementById("school");
        var stageIndex = stageId.selectedIndex; // 选中索引
        var stageAlbumid= stageId.options[stageIndex].value;//要的值


        //获取学科的值
        var subjectId=document.getElementById("selects");
        var subjectIndex = subjectId.selectedIndex; // 选中索引
        var subjectAlbumid= subjectId.options[subjectIndex].value;//要的值


     //获取相应时间
     var start_date = $('#input1').val();
     var start_end = $('#input2').val();
     start_date = start_date.split('-');
     start_end = start_end.split('-');
     var date_satrt = '';
     var date_end = '';
     for(var s = 0;s < start_date.length;s++){
         date_satrt+=start_date[s];
         date_end+=start_end[s];

     }
     var res = {"date_start":date_satrt,"date_end":date_end,"stage_id":stageAlbumid,"subject_id":subjectAlbumid};
     res = JSON.stringify(res);

    chageChapterList(res);
}




//获取章节中视频列表
function chaptervideoLists() {
     //获取选择的章节
     var sel_chapter=document.getElementById("chapter");
     var sel_seIndex = sel_chapter.selectedIndex; // 选中索引
     var sel_value= sel_chapter.options[sel_seIndex].value;//要的值

     //获取相应时间
     var start_date = $('#input1').val();
     var start_end = $('#input2').val();
     start_date = start_date.split('-');
     start_end = start_end.split('-');
     var date_satrt = '';
     var date_end = '';
     for(var s = 0;s < start_date.length;s++){
         date_satrt+=start_date[s];
         date_end+=start_end[s];

     }


     var res = {"date_start":date_satrt,"date_end":date_end,"chapter_code":sel_value};
     res = JSON.stringify(res);
     $.ajax({
       type: "POST",
       //url: "http://127.0.0.1:5000/list",
         url:host+"/list",
       data:res,
         // cache:false,
           // 请求发送之前（发送请求前可修改XMLHttpRequest对象的函数，如添加自定义HTTP头。）。
        beforeSend:function(XMLHttpRequest){
           XMLHttpRequest.setRequestHeader("If-Modified-Since","0");
           XMLHttpRequest.setRequestHeader("Cache-Control","no-cache");
           $('#shclProgress').show();
            progressLoading();
        },
       success: function(data){
           var video_list = data.video_list;
           changeVideoLiist(video_list);
          },
          // 请求完成后的回调函数 (请求成功或失败之后均调用)
        complete:function(XMLHttpRequest,textStatus){
            $('#shclProgress').hide();

        },
      // timeout: 15000,
      error: function (error) {
           alert('报错啦')
           console.log(error)
      }
    });
}

//根据学科改变视频列表
function getSubjectList(opt) {
    var subject_id = "";
    if(opt == "数学"){
        subject_id = "1";
    }
    if(opt == "物理"){
        subject_id = "2";
    }
     //获取相应时间
     var start_date = $('#input1').val();
     var start_end = $('#input2').val();
     start_date = start_date.split('-');
     start_end = start_end.split('-');
     var date_satrt = '';
     var date_end = '';
     for(var s = 0;s < start_date.length;s++){
         date_satrt+=start_date[s];
         date_end+=start_end[s];

     }
     //添加学科的查询条件
     var stageId=document.getElementById("school");
        var stageIndex = stageId.selectedIndex; // 选中索引
        var stageAlbumid= stageId.options[stageIndex].value;//要的值


      var res = {"date_start":date_satrt,"date_end":date_end,"subject_id":subject_id,"stage_id":stageAlbumid};

      res = JSON.stringify(res);
     //改变中间学段列表
     getAllCaptertableList();

     $.ajax({
       type: "POST",
       // url: "http://127.0.0.1:5000/subject_video_list",
         url:host+"/subject_video_list",
       data:res,
         // cache:false,
           // 请求发送之前（发送请求前可修改XMLHttpRequest对象的函数，如添加自定义HTTP头。）。
        beforeSend:function(XMLHttpRequest){
           XMLHttpRequest.setRequestHeader("If-Modified-Since","0");
           XMLHttpRequest.setRequestHeader("Cache-Control","no-cache");
           $('#shclProgress').show();
            progressLoading();
        },
       success: function(data){
           var subject_video_list = data.subject_video_list;
           changeVideoLiist(subject_video_list);
          },
          // 请求完成后的回调函数 (请求成功或失败之后均调用)
        complete:function(XMLHttpRequest,textStatus){
            $('#shclProgress').hide();

        },
      // timeout: 15000,
      error: function (error) {
           alert('报错啦')
           console.log(error)
      }
    });

}


//根据学段改变视频列表
function getStageList(opt) {
     // console.log('学科选择的数：',opt);
    var stage_id = "";
    if(opt == "小学"){
        stage_id = "1";
    }
    if(opt == "初中"){
        stage_id = "2";
    }
    if(opt == "高中"){
        stage_id = "3";
    }
     //获取相应时间
     var start_date = $('#input1').val();
     var start_end = $('#input2').val();
     start_date = start_date.split('-');
     start_end = start_end.split('-');
     var date_satrt = '';
     var date_end = '';
     for(var s = 0;s < start_date.length;s++){
         date_satrt+=start_date[s];
         date_end+=start_end[s];

     }
     //获取学科的值
        var subjectId=document.getElementById("selects");
        var subjectIndex = subjectId.selectedIndex; // 选中索引
        var subjectAlbumid= subjectId.options[subjectIndex].value;//要的值

      var res = {"date_start":date_satrt,"date_end":date_end,"stage_id":stage_id,"subject_id":subjectAlbumid};
     res = JSON.stringify(res);
   // chageChapterList(res);//查询章节表格数据
     $.ajax({
       type: "POST",
       // url: "http://127.0.0.1:5000/stage_video_list",
       url:host+"/stage_video_list",
       data:res,
         // cache:false,
           // 请求发送之前（发送请求前可修改XMLHttpRequest对象的函数，如添加自定义HTTP头。）。
        beforeSend:function(XMLHttpRequest){
           XMLHttpRequest.setRequestHeader("If-Modified-Since","0");
           XMLHttpRequest.setRequestHeader("Cache-Control","no-cache");
           $('#shclProgress').show();
            progressLoading();
        },
       success: function(data){
           var stage_video_list = data.stage_video_list;
           changeVideoLiist(stage_video_list);
          },
          // 请求完成后的回调函数 (请求成功或失败之后均调用)
        complete:function(XMLHttpRequest,textStatus){
            $('#shclProgress').hide();

        },
      // timeout: 15000,
      error: function (error) {
           alert('报错啦')
           console.log(error)
      }
    });
}


//改变视频列表
function changeVideoLiist(data) {
     //改变视频列表
    var videoId = [];//视频id
    var videoName = [];//视频名
    var chapterBigName = [];//所属大节名
    var chapterSmallName = [];//所属小节名
    var watchCount = [];//总观看次数
    var watchRzCount = [];//认真观看次数
    var watchRate = [];//认真观看率
    var profeInter = [];//专项进入次数
    var profeCount = [];//专项通过次数
    var profeRate = [];//专项通过率
    var watchFinish = [];//观看完成次数
    var finishRate = [];//完播率
    var charteVideo = [];//付费视频
    var dateArr = [];//日期
    //execise为专项进入人数
  // var videoList = data.video_list;
  var videoList = data;
  for(var i = 0;i<videoList.length;i++){
      for(var j = 0;j<videoList[i].length;j++){
          if(j == 0){
             videoId.push(videoList[i][j]);
          }
          if(j == 1){
              videoName.push(videoList[i][j]);
          }
          if(j == 2){
              chapterBigName.push(videoList[i][j]);
          }
          if(j == 3){
              chapterSmallName.push(videoList[i][j]);
          }

          if(j == 4){
              var watchC = parseInt(videoList[i][j]);
               // 判断为undefined/NaN/null/的情况
              if(isNaN(watchC) || watchC==null || watchC== undefined){
                  watchC = 0;
              }
              watchCount.push(watchC)
          }

          if(j == 5){
               var watchR = parseInt(videoList[i][j]);
               // 判断为undefined/NaN/null/的情况
              if(isNaN(watchR) || watchR==null || watchR== undefined){
                  watchR = 0;
              }
              watchRzCount.push(watchR);
          }
          if(j == 6){
                var watchP = parseInt(videoList[i][j]);
               // 判断为undefined/NaN/null/的情况
              if(isNaN(watchP) || watchP==null || watchP== undefined){
                  watchP = 0;
              }
              profeInter.push(watchP);
          }
          if(j == 7){
                var watchPC = parseInt(videoList[i][j]);
               // 判断为undefined/NaN/null/的情况
              if(isNaN(watchPC) || watchPC==null || watchPC== undefined){
                  watchPC = 0;
              }
              profeCount.push(watchPC);
          }
          if(j == 8){
                var watchFn = parseInt(videoList[i][j]);
               // 判断为undefined/NaN/null/的情况
              if(isNaN(watchFn) || watchFn==null || watchFn== undefined){
                  watchFn = 0;
              }
              watchFinish.push(watchFn);
          }

           if(j == 9){
                var cV = videoList[i][j];
               // 判断为undefined/NaN/null/的情况
              if(cV==null || cV== undefined){
                  cV = 0;
              }
              charteVideo.push(cV);
          }


           if(j == 10){
                var dat = videoList[i][j];
               // 判断为undefined/NaN/null/的情况
              if(dat==null || dat== undefined){
                  dat = 0;
              }
              dateArr.push(dat);
          }

      }
  }

//计算总观看次数
  var watchVideoAll = 0;
  for(var wa = 0;wa<watchCount.length;wa++){
      watchVideoAll += watchCount[wa];
  }
  var Thousands1 = toThousands(watchVideoAll);
  $('#videAllCount').text(Thousands1);
//计算认真观看次数
     var watchRzVideoAll = 0;
  for(var rz = 0;rz<watchRzCount.length;rz++){
      watchRzVideoAll += watchRzCount[rz];
  }
  var Thousands2 = toThousands(watchRzVideoAll);
  $('#rzAllCount').text(Thousands2);
//计算进入专项次数
       var watchZxVideoAll = 0;
  for(var zx = 0;zx<profeInter.length;zx++){
      watchZxVideoAll += profeInter[zx];
  }
   var Thousands3 = toThousands(watchZxVideoAll);
  $('#zxInterCount').text(Thousands3);

//计算进入专项通过次数
   var watchTgVideoAll = 0;
  for(var tg = 0;tg<profeCount.length;tg++){
      watchTgVideoAll += profeCount[tg];
  }
  var Thousands4 = toThousands(watchTgVideoAll);
  $('#passAllCount').text(Thousands4);


//付费视频的付费次数
    var charges = 0;

 for(var cg = 0;cg<charteVideo.length;cg++){
     if(charteVideo[cg]){
         charges +=  watchCount[cg];
     }
  }

 $('.chargeVideo').eq(0).text(toThousands(charges));//总观看付费次数

 //认真观看付费次数
 var chargesRz = 0;
 for(var rz = 0;rz<charteVideo.length;rz++){
     if(charteVideo[rz]){
         chargesRz +=  watchRzCount[rz];
     }
  }
 $('.chargeVideo').eq(1).text(toThousands(chargesRz));//认真观看付费次数

 //专项进入付费次数
     var chargesZx = 0;
 for(var zx = 0;zx<charteVideo.length;zx++){
     if(charteVideo[zx]){
         chargesZx +=  profeInter[zx];
     }
  }
 $('.chargeVideo').eq(2).text(toThousands(chargesZx));//专项进入观看付费次数

  //专项通过付费次数
        var chargesF = 0;
 for(var ff = 0;ff<charteVideo.length;ff++){
     if(charteVideo[ff]){
         chargesF +=  profeCount[ff];
     }
  }
 $('.chargeVideo').eq(3).text(toThousands(chargesF));//专项通过付费次数




 //认真观看率--全部
    var rzWatch = parseFloat(watchRzVideoAll/watchVideoAll).toFixed(2);
    if(isNaN(rzWatch)){
        rzWatch = 0
    }

    $('#rZrate').text(rzWatch);

 //认真观看率付费视频
    var rzChargeRate = parseFloat(chargesRz/charges).toFixed(2);
     if(isNaN(rzChargeRate)){
        rzChargeRate = 0
    }
    $('#rZWhatchRate').text(rzChargeRate);




 //总次数付费率
    var allPercentRate = parseFloat(charges/watchVideoAll).toFixed(2);
     if(isNaN(allPercentRate)){
        allPercentRate = 0
    }
    $('#allP1').text(allPercentRate);
 // 认真观看次数付费率
    var allRzPercentRate = parseFloat(chargesRz/watchRzVideoAll).toFixed(2);
     if(isNaN(allRzPercentRate)){
        allRzPercentRate = 0
    }
    $('#allP2').text(allRzPercentRate);
 // 专项进入总次数
    var centerPercentRate = parseFloat(chargesZx/watchZxVideoAll).toFixed(2);
    if(isNaN(centerPercentRate)){centerPercentRate = 0}
    $('#centerRate').text(centerPercentRate);
 // 通过的总次数
   var centerTgPercentRate = parseFloat(chargesF/watchTgVideoAll).toFixed(2);
    if(isNaN(centerTgPercentRate)){centerTgPercentRate = 0}
    $('#TgRate').text(centerTgPercentRate);

//计算认真观看率
    for(var m = 0;m < watchCount.length;m++){
      var totalRate = parseFloat(watchRzCount[m]/watchCount[m]).toFixed(2);
         // 判断为undefined/NaN/null/的情况
          if(isNaN(totalRate) || totalRate==null || totalRate== undefined){
              totalRate = 0;
          }
        watchRate.push(totalRate)
    }
//计算专项通过率
    var passTimes = 0;
    for(var sp = 0;sp < profeInter.length;sp++){
        passTimes = parseFloat(profeCount[sp]/profeInter[sp]).toFixed(2);
        // 判断为undefined/NaN/null/的情况
         if(isNaN(passTimes) || passTimes==null || passTimes== undefined){
              passTimes = 0;
          }
        profeRate.push(passTimes);
    }

//计算完播率
   var finished = 0;
    for(var fs = 0;fs < watchFinish.length;fs++){
        finished = parseFloat(watchFinish[fs]/watchCount[fs]).toFixed(2);
         // 判断为undefined/NaN/null/的情况
         if(isNaN(finished) || finished==null || finished== undefined){
              finished = 0;
          }

          finishRate.push(finished);
    }



    if ($('#example').hasClass('dataTable')) {
        var oldTable = $('#example').dataTable();
        oldTable.fnClearTable(); //清空一下table
        oldTable.fnDestroy(); //还原初始化了的dataTable
        $('#example').empty();
    }
   $('#example').empty();
   $("#example").append("" +
          " <thead>" +
          " <tr>" +
          "<th width='10%'>视频id</th>" +
          "<th width='10%'>视频名称</th>" +
          "<th width='10%'>所属大节名</th>" +
          "<th width='10%'>小节名</th>" +
          "<th width='10%'>观看次数</th>" +
          "<th width='10%'>认真观看次数(观看时长大于70%)</th>" +
          "<th width='10%'>认真观看率</th>" +
          "<th width='10%'>完播率</th>" +
          "<th width='10%'>专项进入次数</th>" +
          "<th width='10%'>专项通过次数</th>" +
          "<th width='10%'>专项通过率 </th>" +
          "<th width='10%'>日期 </th>" +
          "</tr>" +
          "</thead>"
           );


 for(var t1 = 0;t1<videoId.length;t1++){
         $("#example").append("" +
          "<tr>" +
          "<td style='text-align: left'>"+videoId[t1]+"</td>"+
          "<td style='text-align: left'>"+videoName[t1]+"</td>"+
          "<td style='text-align: left'>"+chapterBigName[t1]+"</td>"+
          "<td style='text-align: left'>"+chapterSmallName[t1]+"</td>"+
          "<td>"+watchCount[t1]+"</td>"+
          "<td>"+watchRzCount[t1]+"</td>"+
          "<td>"+watchRate[t1]+"</td>"+
          "<td>"+finishRate[t1]+"</td>"+
          "<td>"+profeInter[t1]+"</td>"+
          "<td>"+profeCount[t1]+"</td>"+
          "<td>"+profeRate[t1]+"</td>"+
          "<td>"+dateArr[t1]+"</td>"+
          "</tr>" +
          "");
  }


   if(typeof(table1) != 'undefined'){
     table1 = undefined;
   }

   var table1 = $('#example').DataTable({
             dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excel',//使用 excel扩展
                    text: '导出excel',// 显示文字
                    exportOptions: {
                        //自定义导出选项
                        //如：可自定义导出那些列，那些行
                        //TODO...
                    }
                }
            ],
            // "sPaginationType": "full_numbers"
            "bStateSave": false, //保存状态到cookie
            "bLengthChange": false, //改变每页显示数据数量
            "bPaginate": true, //翻页功能
            "retrieve": true,
            "destroy": true,
            "bFilter": false, //过滤功能
            "bSort": true, //排序功能
            "bInfo": false,//页脚信息
            "bAutoWidth": true,//自动宽度
            "aaSorting": [[1, "asc"]],
            "iDisplayLength":50,
            "oLanguage": {
                "sLengthMenu": "每页显示 _MENU_ 条记录",
                "sZeroRecords": "抱歉， 没有找到",
                "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
                "sInfoEmpty": "没有数据",
                "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": "前一页",
                    "sNext": "后一页",
                    "sLast": "尾页"
                },
                "sZeroRecords": "没有检索到数据",
                "sProcessing": "<img src='./loading.gif' />"
            },

            "order": [[ 3, "asc" ]],
             //隐藏列
            "columnDefs": [
              {
                "targets":[0],
                "visible": false,
                "searchable": false
              },
                 {
                "targets":[11],
                "visible": false,
                "searchable": false
              }
            ],


            //使用ajax，在服务器端整理数据
            /* "bProcessing": true,
            "bServerSide": true,
            "sPaginationType": "full_numbers",

            "sAjaxSource": "./server_processing.php",
            /!*如果加上下面这段内容，则使用post方式传递数据
            "fnServerData": function ( sSource, aoData, fnCallback ) {
            $.ajax( {
            "dataType": 'json',
            "type": "POST",
            "url": sSource,
            "data": aoData,
            "success": fnCallback
            } );
            }*!/
            "oLanguage": {
            "sUrl": "cn.txt"
            },
            "aoColumns": [
            { "sName": "platform" },
            { "sName": "version" },
            { "sName": "engine" },
            { "sName": "browser" },
            { "sName": "grade" }
            ]//$_GET['sColumns']将接收到aoColumns传递数据*/

            //数据排序,数据排序
            //

        });
   $('#example tbody').on( 'click', 'tr', function (event) {
        var getFirstLine = table1.row(this).data();
        var index1 = getFirstLine[0];
         //    跳转到详情页
        var index = index1;//获取视频代号
        var vName = getFirstLine[1];//视频名称
        var startDates = $('#input1').val();
        var endDates = $('#input2').val();
        var watchCountL = getFirstLine[4];
        var url = "../view/detail.html?index="+index+'&'+startDates+'&'+endDates+'&'+watchCountL+'&'+vName;
        window.open(url,"_blank");
  });


}


//查询章节表格数据
function chageChapterList(res) {
     $.ajax({
       type: "POST",
       // url: "http://127.0.0.1:5000/stage_video_list",
       url:host+"/charpter_middle_list",
       data:res,
         // cache:false,
           // 请求发送之前（发送请求前可修改XMLHttpRequest对象的函数，如添加自定义HTTP头。）。
        beforeSend:function(XMLHttpRequest){
           XMLHttpRequest.setRequestHeader("If-Modified-Since","0");
           XMLHttpRequest.setRequestHeader("Cache-Control","no-cache");
           $('#shclProgress').show();
            progressLoading();
        },
       success: function(data){
            changeChapteraList(data);
          },
          // 请求完成后的回调函数 (请求成功或失败之后均调用)
        complete:function(XMLHttpRequest,textStatus){
            $('#shclProgress').hide();

        },
      // timeout: 15000,
      error: function (error) {
           alert('报错啦')
           console.log(error)
      }
    });
}

//改变章节真实列表数据
function changeChapteraList(data) {
    var chapterName = data.chapter_name//章节名
    var watchCnt = data.watch_cnt //观看次数
    var rzCnt = data.rz_cnt //认真观看次数
    var rzRate = data.rz_rate //认真观看率
    var fnRate = data.fn_rate //完播率
    var zxCnt = data.zx_cnt //专项次数
    var tgCnt = data.tg_cnt //专项通过次数
    var zxRate = data.zx_rate //专项通过率
    var date = data.day //添加日期

    if ($('#example2').hasClass('dataTable')) {
        var oldTable = $('#example2').dataTable();
        oldTable.fnClearTable(); //清空一下table
        oldTable.fnDestroy(); //还原初始化了的dataTable
        $('#example2').empty();
    }
   $('#example2').empty();
   $("#example2").append("" +
          " <thead>" +
          " <tr>" +
          "<th width='10%'>章节名称</th>" +
          "<th width='10%'>观看次数</th>" +
          "<th width='10%'>认真观看次数(观看时长大于70%)</th>" +
          "<th width='10%'>认真观看率</th>" +
          "<th width='10%'>完播率</th>" +
          "<th width='10%'>专项进入次数</th>" +
          "<th width='10%'>专项通过次数</th>" +
          "<th width='10%'>专项通过率 </th>" +
          "<th width='10%'>日期 </th>" +
          "</tr>" +
          "</thead>"
           );

 for(var t1 = 0;t1<chapterName.length;t1++){
         $("#example2").append("" +
          "<tr>" +
          "<td style='text-align: left'>"+chapterName[t1]+"</td>"+
          "<td>"+watchCnt[t1]+"</td>"+
          "<td>"+rzCnt[t1]+"</td>"+
          "<td>"+rzRate[t1]+"</td>"+
          "<td>"+fnRate[t1]+"</td>"+
          "<td>"+zxCnt[t1]+"</td>"+
          "<td>"+tgCnt[t1]+"</td>"+
          "<td>"+zxRate[t1]+"</td>"+
          "<td>"+date[t1]+"</td>"+
          "</tr>" +
          "");
  }
    //初始化学段对应的章节
   $('#example2').DataTable({
         dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excel',//使用 excel扩展
                    text: '导出excel',// 显示文字
                    'className': 'btn btn-primary', //按钮的class样式
                    exportOptions: {
                        //自定义导出选项
                        //如：可自定义导出那些列，那些行
                        //TODO...
                    }
                }
            ],
       "aoColumnDefs": [
                    { "sType": "numeric-comma", "aTargets": [0] },    //指定列号使用自定义排序
            {
                "targets":[8],
                "visible": false,
                "searchable": false
              }
                ],
        // "sPaginationType": "full_numbers"
        "bStateSave": false, //保存状态到cookie
        "bLengthChange": false, //改变每页显示数据数量
        "bPaginate": true, //翻页功能
        "retrieve": true,
        "destroy": true,
        "bFilter": false, //过滤功能
       // "bSort": true, //排序功能
        "bInfo": false,//页脚信息
        "bAutoWidth": true,//自动宽度
        //"aaSorting": [[1, "asc"]],
        "iDisplayLength":10,
        "oLanguage": {
            "sLengthMenu": "每页显示 _MENU_ 条记录",
            "sZeroRecords": "抱歉， 没有找到",
            "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
            "sInfoEmpty": "没有数据",
            "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
            "oPaginate": {
                "sFirst": "首页",
                "sPrevious": "前一页",
                "sNext": "后一页",
                "sLast": "尾页"
            },
            "sZeroRecords": "没有检索到数据",
            "sProcessing": "<img src='./loading.gif' />"
        },
            //隐藏列
            "columnDefs": [
              {
                "targets":[7],
                "visible": false,
                "searchable": false
              }
            ],

        // "aLengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]] //定义每页显示数据数量
        //控制排序,说明：第一列点击按默认情况排序，第二列点击已顺序排列，第三列点击一次倒序，二三次顺序，第四五列点击不实现排序
        /*"aoColumns": [
           null,
           { "asSorting": [ "asc" ] },
           { "asSorting": [ "desc", "asc", "asc" ] },
           { "asSorting": [ ] },
           { "asSorting": [ ] }
        ]*/
        //指定某一列不排序
        // "aoColumnDefs": [{"bSortable": false, "aTargets": [0]}],
        // "order": [[ 3, "desc" ]]
        //"order": [[ 0, "asc" ]],
         //隐藏列
        // "columnDefs": [
        //   {
        //     "targets":[0],
        //     "visible": false,
        //     "searchable": false
        //   }
        // ],


        //使用ajax，在服务器端整理数据
        /* "bProcessing": true,
        "bServerSide": true,
        "sPaginationType": "full_numbers",

        "sAjaxSource": "./server_processing.php",
        /!*如果加上下面这段内容，则使用post方式传递数据
        "fnServerData": function ( sSource, aoData, fnCallback ) {
        $.ajax( {
        "dataType": 'json',
        "type": "POST",
        "url": sSource,
        "data": aoData,
        "success": fnCallback
        } );
        }*!/
        "oLanguage": {
        "sUrl": "cn.txt"
        },
        "aoColumns": [
        { "sName": "platform" },
        { "sName": "version" },
        { "sName": "engine" },
        { "sName": "browser" },
        { "sName": "grade" }
        ]//$_GET['sColumns']将接收到aoColumns传递数据*/

        //数据排序,数据排序
        //

    });
}



//点击查询按钮
$('.query').click(function () {
    chaptervideoLists();
     //改变中间学段列表
     getAllCaptertableList();
     //改变视频列表
     changeVideolistForQuery();
});

//点击查询改变视频列表
function changeVideolistForQuery() {
            //获取学段的值
        var stageId=document.getElementById("school");
        var stageIndex = stageId.selectedIndex; // 选中索引
        var stageAlbumid= stageId.options[stageIndex].value;//要的值


        //获取学科的值
        var subjectId=document.getElementById("selects");
        var subjectIndex = subjectId.selectedIndex; // 选中索引
        var subjectAlbumid= subjectId.options[subjectIndex].value;//要的值


     //获取相应时间
     var start_date = $('#input1').val();
     var start_end = $('#input2').val();
     start_date = start_date.split('-');
     start_end = start_end.split('-');
     var date_satrt = '';
     var date_end = '';
     for(var s = 0;s < start_date.length;s++){
         date_satrt+=start_date[s];
         date_end+=start_end[s];

     }
     var res = {"date_start":date_satrt,"date_end":date_end,"stage_id":stageAlbumid,"subject_id":subjectAlbumid};
     res = JSON.stringify(res);
        $.ajax({
       type: "POST",
       // url: "http://127.0.0.1:5000/subject_video_list",
         url:host+"/subject_video_list",
       data:res,
            // cache:false,
           // 请求发送之前（发送请求前可修改XMLHttpRequest对象的函数，如添加自定义HTTP头。）。
        beforeSend:function(XMLHttpRequest){
           XMLHttpRequest.setRequestHeader("If-Modified-Since","0");
           XMLHttpRequest.setRequestHeader("Cache-Control","no-cache");
           $('#shclProgress').show();
            progressLoading();
        },
       success: function(data){
           var subject_video_list = data.subject_video_list;
           changeVideoLiist(subject_video_list);
          },
          // 请求完成后的回调函数 (请求成功或失败之后均调用)
        complete:function(XMLHttpRequest,textStatus){
            $('#shclProgress').hide();

        },
      // timeout: 15000,
      error: function (error) {
           alert('报错啦')
           console.log(error)
      }
    });

}


//千分位分隔符
function toThousands(num) {
    var result = [ ], counter = 0;
    num = (num || 0).toString().split('');
    for (var i = num.length - 1; i >= 0; i--) {
        counter++;
        result.unshift(num[i]);
        if (!(counter % 3) && i != 0) { result.unshift(','); }
    }
    return result.join('');
}

//进度加载
function progressLoading() {
       $('#shclProgress').shCircleLoader({color: "#3e4b5c",fontSize:15});
    var i = 0;
    $('#shclProgress').shCircleLoader('progress', '加载中');
   /* setInterval(function() {
        $('#shclProgress').shCircleLoader('progress', i + '%');
        if (++i > 100) i = 0;
    }, 100);*/
}


//school,subject,chapter
function getVideoList() {

    //获取选择的学科
     var se=document.getElementById("selects");
     var seIndex = se.selectedIndex; // 选中索引
     var seAlbumid= se.options[seIndex].value;//要的值
    //设置默认情况下为初中数学
    /* if(seAlbumid == ""){
         schAlbumid = "数学";
     }*/

    //获取选择的学段
     var sch=document.getElementById("school");
     var schIndex = sch.selectedIndex; // 选中索引
     var schAlbumid= sch.options[schIndex].value;//要的值
     //设置默认情况下为初中数学
    /* if(schAlbumid == ""){
         schAlbumid = "初中";
     }*/

    //获取选择的章节
    var sub=document.getElementById("chapter");
    var index = sub.selectedIndex; // 选中索引
    // var albumid= sub.options[index].value;//要的值
    var charpterText= sub.options[index].text;//获取文本
    if(charpterText == "全部"){
        charpterText=""
    }

    var specialCounts = 0;
    var passCounts = 0;


    var res = {"school":schAlbumid,"subject":seAlbumid,"chapter":charpterText};
    res = JSON.stringify(res);
    $.ajax({
       type: "POST",
       // url: "http://localhost:5000/list",
       url:host+"/list",
       data:res,
        cache:false,
          // 请求发送之前（发送请求前可修改XMLHttpRequest对象的函数，如添加自定义HTTP头。）。
        beforeSend:function(XMLHttpRequest){
           XMLHttpRequest.setRequestHeader("If-Modified-Since","0");
           XMLHttpRequest.setRequestHeader("Cache-Control","no-cache");
           $('#shclProgress').show();
            progressLoading();
        },
       success: function(data){

           getVideolists(data)
          },
         // 请求完成后的回调函数 (请求成功或失败之后均调用)
        complete:function(XMLHttpRequest,textStatus){
             $('#shclProgress').hide();

        },
      // timeout: 15000,
      error: function (error) {
           alert('报错啦')
           console.log(error)
      }
    });
}

function getVideolists(data) {
    //改变视频列表
    var videoId = [];//视频id
    var chapterBigName = [];//所属大节名
    var chapterSmallName = [];//所属小节名
    var videoName = [];//视频名
    var watchCount = [];//总观看人数
    var watchRzCount = [];//认真观看人数
    var watchRate = [];//认真观看率
    var profeCount = [];//专项通过人数
    var profeRate = [];//专项通过率
    //execise为专项进入人数
  var videoList = data.video_list;
  for(var i = 0;i<videoList.length;i++){
      for(var j = 0;j<videoList[i].length;j++){
          if(j == 1){
              chapterBigName.push(videoList[i][j])
          }
          if(j == 2){
              chapterSmallName.push(videoList[i][j])
          }
          if(j == 3){
              videoName.push(videoList[i][j])
          }
          if(j == 4){
              watchCount.push(videoList[i][j])
          }
          if(j == 5){
             videoId.push(videoList[i][j])
          }
          if(j == 6){
              watchRzCount.push(videoList[i][j])
          }

      }
  }



//计算认真观看率
    for(var m = 0;m < watchCount.length;m++){
      var totalRate = parseFloat(watchRzCount[m]/watchCount[m]).toFixed(2)
        watchRate.push(totalRate)
    }


    if ($('#example').hasClass('dataTable')) {
        var oldTable = $('#example').dataTable();
        oldTable.fnClearTable(); //清空一下table
        oldTable.fnDestroy(); //还原初始化了的dataTable
        $('#example').empty();
    }
   $('#example').empty();
   $("#example").append("" +
          " <thead>" +
          " <tr>" +
          "<th>视频id</th>" +
          "<th>所属大节名</th>" +
          "<th>小节名</th>" +
          "<th>视频名称</th>" +
          "<th>观看次数</th>" +
          "<th>认真观看率</th>" +
          "<th>专项进入次数</th>" +
          "<th>专项通过率 </th>" +
          "</tr>" +
          "</thead>"
           );
 for(var t1 = 0;t1<videoId.length;t1++){
         $("#example").append("" +
          "<tr>" +
          "<td>"+videoId[t1]+"</td>"+
          "<td>"+chapterBigName[t1]+"</td>"+
          "<td>"+chapterSmallName[t1]+"</td>"+
          "<td>"+videoName[t1]+"</td>"+
          "<td>"+watchCount[t1]+"</td>"+
          "<td>"+watchRate[t1]+"</td>"+
          "<td>1</td>"+
          "<td>2</td>"+
          "</tr>" +
          "");
  }


   if(typeof(table1) != 'undefined'){
     table1 = undefined;
   }

   var table1 = $('#example').DataTable({
            "serverSide": false,//分页，取数据等等的都放到服务端去. true为后台分页，每次点击分页时会请求后台数据，false为前台分页
            dom: 'Bfrtip',
        	buttons: [ {
            	"extend": 'excelHtml5',
                "ext":'导出excel',
                 'className': 'btn btn-primary',
                exportOptions: {
                //自定义导出选项
                //如：可自定义导出那些列，那些行
                //TODO...
            }
                // customize: function( xlsx ) {
                	// var sheet = xlsx.xl.worksheets['sheet1.xml'];
                	// $('row c[r^="C"]', sheet).attr( 's', '2' );
            	// }
             } ],

            // "sPaginationType": "full_numbers"
            "bStateSave": false, //保存状态到cookie
            "bLengthChange": false, //改变每页显示数据数量
            "bPaginate": true, //翻页功能
            "retrieve": true,
            "destroy": true,
            "bFilter": false, //过滤功能
            "bSort": true, //排序功能
            "bInfo": false,//页脚信息
            "bAutoWidth": true,//自动宽度
            "aaSorting": [[1, "asc"]],
            "oLanguage": {
                "sLengthMenu": "每页显示 _MENU_ 条记录",
                "sZeroRecords": "抱歉， 没有找到",
                "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
                "sInfoEmpty": "没有数据",
                "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": "前一页",
                    "sNext": "后一页",
                    "sLast": "尾页"
                },
                "sZeroRecords": "没有检索到数据",
                "sProcessing": "<img src='./loading.gif' />"
            },
            // "aLengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]] //定义每页显示数据数量
            //控制排序,说明：第一列点击按默认情况排序，第二列点击已顺序排列，第三列点击一次倒序，二三次顺序，第四五列点击不实现排序
            /*"aoColumns": [
               null,
               { "asSorting": [ "asc" ] },
               { "asSorting": [ "desc", "asc", "asc" ] },
               { "asSorting": [ ] },
               { "asSorting": [ ] }
            ]*/
            //指定某一列不排序
            "aoColumnDefs": [{"bSortable": false, "aTargets": [0, 2, 4]}]

            //使用ajax，在服务器端整理数据
            /* "bProcessing": true,
            "bServerSide": true,
            "sPaginationType": "full_numbers",

            "sAjaxSource": "./server_processing.php",
            /!*如果加上下面这段内容，则使用post方式传递数据
            "fnServerData": function ( sSource, aoData, fnCallback ) {
            $.ajax( {
            "dataType": 'json',
            "type": "POST",
            "url": sSource,
            "data": aoData,
            "success": fnCallback
            } );
            }*!/
            "oLanguage": {
            "sUrl": "cn.txt"
            },
            "aoColumns": [
            { "sName": "platform" },
            { "sName": "version" },
            { "sName": "engine" },
            { "sName": "browser" },
            { "sName": "grade" }
            ]//$_GET['sColumns']将接收到aoColumns传递数据*/

            //数据排序,数据排序
            //

        });
   $('#example tbody').on( 'click', 'tr', function (event) {
        var getFirstLine = table1.row(this).data();
        var index1 = getFirstLine[0];
  });




}


//获取专项练习观看人数
/*function get_execise(school,subject,chapter) {
    var res1 = {"school":school,"subject":subject,"chapter":chapter};
    res1 = JSON.stringify(res1);

   var result = [];
   var specialCount = [];//专项次数
    var passCount = [];//通过次数
    $.ajax({
       type: "POST",
       url: "http://localhost:5000/execise",
       data:res1,
       async : false,
       success: function(data){
           console.log("获取到的专项人数列表为：",data);

           var exeLists = data.execise_list;
           if(specialCount.length != 0){
               specialCount = [];
           }
             if(passCount.length != 0){
               passCount = [];
           }
           //获取专项次数
           //获取通过次数
           for(var n = 0;n < exeLists.length;n++){
               for(var l = 0;l < exeLists[n].length;l++){
                   if(l == 2){
                      specialCount.push(exeLists[n][l])
                   }
                   if(l == 3){
                       passCount.push(exeLists[n][l])
                   }
               }
           }

          },

      // timeout: 15000,
      error: function (error) {
           alert('报错啦')
           console.log(error)
      }
    });
    result.push(specialCount);
    result.push(passCount);
    return result;
}*/



//初始化时间选择
/*
function initLaydate() {

      //获取昨天的日期
    var day1 = new Date();
        day1.setTime(day1.getTime()-24*60*60*1000);
     var yesterday = day1.getFullYear()+"-" + (day1.getMonth()+1) + "-" + day1.getDate();

     var start = {
       elem: '#input1', //id为star的输入框
       format: 'YYYY-MM-DD',
       // max: laydate.now(), //最大日期
       min:'2017-1-1',
       max: yesterday, //最大日期
       istime: true,
       istoday: false,
       trigger: 'click', //采用click弹出
         range: true,
       done: function (value, date) {
         if(value !== ''){
             date.month = date.month-1;
             endDate.config.min = date;
         }

    /!*    end.config.min = {
            year: date.year,
            month: date.month - 1,
            date: date.date,
            // hours: date.hours,
            // minutes: date.minutes,
            // seconds: date.seconds
        }; //开始日选好后，重置结束日的最小日期
        end.config.value = {
            year: date.year,
            month: date.month - 1,
            date: date.date,
            // hours: date.hours,
            // minutes: date.minutes,
            // seconds: date.seconds
        }; //将结束日的初始值设定为开始日
        //计算时间差
        if ($("#input2").val()){
            var s=new Date(value);
            var e=new Date($("#input2").val());
            var time=(e.getTime()-s.getTime())/1000/60/60/24+1;
            //$("#leaveDuration").val(time);
        }*!/
    }

      /!* choose: function(datas){
        var now = new Date(laydate.now().replace("-", "/")); //当前日期的date格式
        var add=new Date(datas.replace("-", "/")); //选择的日期
        add= new Date(add.getTime() + 30*24*60*60*1000); //在选择的日期+30天
        if((now.getMonth() + 1)<(add.getMonth() + 1)){ //如果当前月份小于选择月份
            end.max = laydate.now();  //结束日的最大日期为当前日期
        }else if ((now.getMonth() + 1)==(add.getMonth() + 1) &&  now.getDate()<add.getDate()) {
            end.max = laydate.now();//月份相同且当前日小于选择日
        }
        else {
            add=add.getFullYear() + "-" + (add.getMonth() + 1) + "-"+ add.getDate();//转换日期格式
            end.max = add;//结束日的最大日期为选择的日期+30天
        }
        end.min = datas;//开始日选好后，重置结束日的最小日期
      }*!/
    };


     var end = {
      elem: '#input2',
      format: 'YYYY-MM-DD',
      // max: laydate.now(),
      min:'2017-1-1',
      max:yesterday,
      // istime: true,
      // istoday: false,
      // range: true,
      done: function (value, date) {

          if(value !== ''){
              date.month = date.month-1;
              startDate.config.max = date;
          }
          /!* start.config.max = {
                year: date.year
                , month: date.month - 1
                , date: date.date
            }*!/
       /!* start.config.max = {
            year: date.year,
            month: date.month - 1,
            date: date.date,
            // hours: date.hours,
            // minutes: date.minutes,
            // seconds: date.seconds
        }; //结束日选好后，重置开始日的最大日期
        //计算时间差
        if ($("#input1").val()){
            var e=new Date(value);
            var s=new Date($("#input1").val());
            var time=(e.getTime()-s.getTime())/1000/60/60/24+1;
            //$("#leaveDuration").val(time);
        }*!/
    }

    /!*  choose: function(datas){
        var min=new Date(datas.replace("-", "/"));
        min= new Date(min.getTime() - 30*24*60*60*1000); //在日期-30天。

        //获取昨天的日期
          /!*var day1 = new Date();
          day1.setTime(day1.getTime()-24*60*60*1000);
          var s1 = day1.getFullYear()+"-" + (day1.getMonth()+1) + "-" + day1.getDate();*!/
        min=min.getFullYear() + "-" + (min.getMonth() + 1) + "-"+ min.getDate();
        start.max = datas; //结束日选好后，重置开始日的最大日期
        start.min = min;
      }*!/
    };
    laydate(start);
    laydate(end);
}

*/

function initLaydate() {
  //获取昨天的日期
        var day1 = new Date();
        day1.setTime(day1.getTime()-24*60*60*1000);
        var yesterday = day1.getFullYear()+"-" + (day1.getMonth()+1) + "-" + day1.getDate();

        var cartimeDate = laydate.render({
            elem: '#input1', //用车时间
            min:'2017-1-1',
            max: yesterday //最大日期
            // ,type: 'datetime'
            // ,format: 'yyyy-MM-dd'
            ,done:function(value, date){
                returntimeDate.config.min=getDateArray(date);//重点
            }
        });

        var returntimeDate = laydate.render({
            elem: '#input2', //预计回车时间
                min:'2017-1-1',
                max:yesterday
            // ,type: 'datetime'
            // ,format: 'yyyy-MM-dd'
            ,done:function(value, date){
                cartimeDate.config.max=getDateArray(date);//重点
            }
        });

        function getDateArray(date){//获取时间数组
            var darray={};
            darray.year=date.year;
            darray.month=date.month - 1;
            var day=date.date;
            if(date.hours == 23 && date.minutes == 59 && date.seconds == 59){
                day = day + 1;
            }else{
                darray.hours = date.hours;
                darray.minutes = date.minutes;
                darray.seconds = date.seconds;
            }
            darray.date=day;
            return darray;
        }

}



//默认时间
//昨天的时间
var yest = new Date();
yest.setTime(yest.getTime()-24*60*60*1000);
var yesterday = yest.getFullYear()+"-" + Appendzero(yest.getMonth()+1) + "-" + Appendzero(yest.getDate());
//补0操作
function Appendzero(obj) {
        if(obj<10) return "0" +""+ obj;
        else return obj;
    }
//获取前一个月时间
Date.prototype.format = function(format) {
 var o = {
  "M+" : this.getMonth() + 1, // month
  "d+" : this.getDate(), // day
  "h+" : this.getHours(), // hour
  "m+" : this.getMinutes(), // minute
  "s+" : this.getSeconds(), // second
  "q+" : Math.floor((this.getMonth() + 3) / 3), // quarter
  "S" : this.getMilliseconds()
 // millisecond
 }
 if (/(y+)/.test(format))
  format = format.replace(RegExp.$1, (this.getFullYear() + "")
    .substr(4 - RegExp.$1.length));
 for ( var k in o)
  if (new RegExp("(" + k + ")").test(format))
   format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
     : ("00" + o[k]).substr(("" + o[k]).length));
 return format;
}
var begin=new Date();
// begin.setTime(begin.getTime()-24*60*60*1000);
// var begin_yesterday = begin.getFullYear()+"-" + (begin.getMonth()+1) + "-" + begin.getDate();

var end=new Date();
new Date(begin.setMonth((new Date().getMonth()-1)));
var begintime= begin.format("yyyy-MM-dd");
/*
  begin.setTime(begin.getTime()-24*60*60*1000);
var yesterday1 = begin.getFullYear()+"-" + (begin.getMonth()+1) + "-" + begin.getDate();
*/

var endtime=end.format("yyyy-MM-dd");
$('#input1').val(begintime);
$('#input2').val(yesterday);


//时间范围限制
 function getDateArray(date){//获取时间数组
            var darray={};
            darray.year=date.year;
            darray.month=date.month - 1;
            var day=date.date;
            if(date.hours == 23 && date.minutes == 59 && date.seconds == 59){
                day = day + 1;
            }else{
                darray.hours = date.hours;
                darray.minutes = date.minutes;
                darray.seconds = date.seconds;
            }
            darray.date=day;
            return darray;
        }


