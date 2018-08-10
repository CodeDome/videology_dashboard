$(function(){

  //日期初始化
    /* laydate.render({
        elem:'#video_name1'
    })
     laydate.render({
        elem:'#video_name2'
    })*/
 initLaydate();

  //initData();
  initDataExit();

  //初始化暂停数据
 // pauseAnalysis();
    initDatapause();
     initDataVideo();
//交互题
//     interactionAnalysis();
    createTableI();
});
 //拿到参数
var param = window.location.href.split("=")[1];
var codeParam = param.split("&")[0];//得到视频id
var startTime = param.split("&")[1];
var endTime = param.split("&")[2];
var watchCountLs = param.split("&")[3];
var videoNames = decodeURI(param.split("&")[4]);
$('#video_name1').val(startTime);//更新起始时间
$('#video_name2').val(endTime);//更新结束时间

//初始化数据 --- 作废
function initData() {
    var videoSk = codeParam;
     //获取日期
    var input1 = $('#video_name1').val();
    var input2 = $('#video_name2').val();

    input1 = input1.replace(/-/g,"");
    input2 = input2.replace(/-/g,"");

    if((input1 == '') || (input1 == '')){
        input1 = '20180520';
        input2 = '20180525';
    }

      var data1 = {"date_start":input1,"date_end":input2,"code":videoSk}

     data0 = JSON.stringify(data1);



    //获取播放时长数据
   $.ajax({
       type: "POST",
       // url: "http://localhost:5000/video_list",
       url:host+"/video_list",
       data:data0,
       // cache:false,
        // 请求发送之前（发送请求前可修改XMLHttpRequest对象的函数，如添加自定义HTTP头。）。
        beforeSend:function(XMLHttpRequest){
           XMLHttpRequest.setRequestHeader("If-Modified-Since","0");
           XMLHttpRequest.setRequestHeader("Cache-Control","no-cache");
           $('#shclProgress').show();
            progressLoading();
        },
       success: function(data){
           //获取视频播放时长
           // getVideoDuration(data);
           //获取播放时长次数
           // getVideoTimes(data);
           //子分布图
           // getMainSub(0.1,data)
           // getSubVideoDuration(data)
          },
     // 请求完成后的回调函数 (请求成功或失败之后均调用)
        complete:function(XMLHttpRequest,textStatus){
            $('#shclProgress').hide();

        },
      // timeout: 15000,
      error: function (error) {
           console.log(error)
      }
    });
//日期初始化
  /*   laydate.render({
        elem:'#video_name1'
    })
     laydate.render({
        elem:'#video_name2'
    })*/
//获取30s退出时间的数据
//getThirtyExit(data0);
//getThirtyExitP(data0);
}



//更新初始化数据 ---退出时间
function initDataExit() {
    var videoSk = codeParam;
     //获取日期
    var input1 = $('#video_name1').val();
    var input2 = $('#video_name2').val();

    input1 = input1.replace(/-/g,"");
    input2 = input2.replace(/-/g,"");

    if((input1 == '') || (input1 == '')){
        input1 = '20180520';
        input2 = '20180525';
    }

    var data1 = {"date_start":input1,"date_end":input2,"code":videoSk}

     data0 = JSON.stringify(data1);



    //获取30s退出时间的数据
    //getThirtyExit(data0);
    getThirtyExitP(data0);
}


//更新初始化数据 ---视频观看次数
function initDataVideo() {
    var videoSk = codeParam;
     //获取日期
    var input1 = $('#video_name1').val();
    var input2 = $('#video_name2').val();

    input1 = input1.replace(/-/g,"");
    input2 = input2.replace(/-/g,"");

    if((input1 == '') || (input1 == '')){
        input1 = '20180520';
        input2 = '20180525';
    }

    var data1 = {"date_start":input1,"date_end":input2,"code":videoSk}

     data0 = JSON.stringify(data1);



       //获取播放时长数据
   $.ajax({
       type: "POST",
       // url: "http://localhost:5000/video_list",
       // url:host+"/video_list",
       url:host+"/video_watch_new_list",
       data:data0,
       // cache:false,
        // 请求发送之前（发送请求前可修改XMLHttpRequest对象的函数，如添加自定义HTTP头。）。
        beforeSend:function(XMLHttpRequest){
           XMLHttpRequest.setRequestHeader("If-Modified-Since","0");
           XMLHttpRequest.setRequestHeader("Cache-Control","no-cache");
           $('#shclProgress').show();
            progressLoading();
        },
       success: function(data){
            //视频观看次数
           getVideoDuration(data);

          },
     // 请求完成后的回调函数 (请求成功或失败之后均调用)
        complete:function(XMLHttpRequest,textStatus){
            $('#shclProgress').hide();

        },
      // timeout: 15000,
      error: function (error) {
           console.log(error)
      }
    });



    //获取30s退出时间的数据
    //getThirtyExit(data0);
    //getThirtyExitP(data0);

    //视频观看次数
   // getVideoDuration(data0);
}


//更新初始化数据 ---暂停分布次数
function initDatapause() {
     var videoSk = codeParam;
     //获取日期
    var input1 = $('#video_name1').val();
    var input2 = $('#video_name2').val();

    input1 = input1.replace(/-/g,"");
    input2 = input2.replace(/-/g,"");

    if((input1 == '') || (input1 == '')){
        input1 = '20180520';
        input2 = '20180525';
    }

    var data1 = {"date_start":input1,"date_end":input2,"code":videoSk}

     data0 = JSON.stringify(data1);
      //获取暂停数据
   $.ajax({
       type: "POST",
       // url: "http://localhost:5000/video_list",
       url:host+"/pause_video_thirty_list",
       data:data0,
       // cache:false,
        // 请求发送之前（发送请求前可修改XMLHttpRequest对象的函数，如添加自定义HTTP头。）。
        beforeSend:function(XMLHttpRequest){
           XMLHttpRequest.setRequestHeader("If-Modified-Since","0");
           XMLHttpRequest.setRequestHeader("Cache-Control","no-cache");
           $('#shclProgress').show();
            progressLoading();
        },
       success: function(data){

            pauseAnalysis(data);
          },
     // 请求完成后的回调函数 (请求成功或失败之后均调用)
        complete:function(XMLHttpRequest,textStatus){
            $('#shclProgress').hide();

        },
      // timeout: 15000,
      error: function (error) {
           console.log(error)
      }
    });
}



//更新详情页时间选择

$('#btn').click(function () {
    //获取视频的值
   /* var video_value = document.getElementById('selects');
    var index = video_value.selectedIndex;
    var albumid = video_value.options[index].value;*/
     //拿到参数
    // var param = window.location.href.split("=")[1];//得到视频id
    // console.log('获取到的参数为：',param);
    var albumid = codeParam;
    //获取日期
    var input1 = $('#video_name1').val();
    var input2 = $('#video_name2').val();

    input1 = input1.replace(/-/g,"");
    input2 = input2.replace(/-/g,"");

    if((input1 == '') || (input1 == '')){
        input1 = '20180520';
        input2 = '20180525';
    }


    var data1 = {"date_start":input1,"date_end":input2,"code":albumid}
    /* console.log('data:',data);
    console.log('input1:',input1);
    console.log('input2:',input2);*/
     data0 = JSON.stringify(data1);

   var data = {"date_start":"20180519", "date_end":"20180525", "code":"1202"}
   data = JSON.stringify(data);



//    30s退出的时间数据
    getThirtyExitP(data0)

//  暂停30s的数据
    initDatapause();

// 交互题数据
    createTableI();

//观看次数
    initDataVideo();
})


var myChart1 = echarts.init(document.getElementById('main'));
function getVideoDuration(data){

/*var yData = null;
yData = data.rate_y;
//计算观看总次数
var cacCount = 0;
for(var ca = 0;ca < yData.length;ca++){
    cacCount += yData[ca];
}


option = {
    title: {
        text: '观看总次数：'+cacCount+'次',
        top:'2%',
        left:'center',
        //left:'2%',
        textStyle: {
            fontSize:15,
            fontWeight: 'normal',
          fontStyle: 'normal',
          fontFamily:'微软雅黑'
        }
    },
    color: ['#3398DB'],
    tooltip : {
           /!* enterable:true,
            //alwaysShowContent:true,
            hideDelay:100,
            backgroundColor: 'rgba(255,255,255,1)',//背景颜色（此时为默认色）
            borderRadius: 5,//边框圆角
            padding: 14,    // [5, 10, 15, 20] 内边距
            textStyle:{
                color:'#000'
            },
            position: function (point, params, dom, rect, size) {
                $(dom).html('<div  id="desd" style = "width:200px;height:100px;background: cadetblue">来啦</div>')
                // console.log('元素名称为：',$('#aa').text())
                 // $(dom).html('<div class="tip"><span>技能块名称名称</span><small>掌握程度：<b>90%</b></small></div><ul class="list"><li><span>技能点的名字撒旦萨达四大神兽</span><b class="star"></b><b class="star"></b><b class="star"></b><b></b><b></b><a href="#">测试</a> </li><li><span>技能点的名字</span><b></b><b></b><b></b><b></b><b></b><a href="#">测试</a></li><li><span>技能点的名字</span><b></b><b></b><b></b><b></b><b></b><a href="#">测试</a></li><li><span>技能点的名字</span><b></b><b></b><b></b><b></b><b></b><a href="#">测试</a></li></ul><ul class="courseWare"><li><span>课件一的名称</span><small>学习时长：<i>8h</i></small><a href="#">学习</a></li><li><span>课件一的名称</span><small>学习时长：<i>8h</i></small><a href="#">学习</a></li></ul><button class="courseBtn">课程测试</button>')
                 // console.log($('.tip').text())
                // getSubVideoDuration($('#aa'))
                var myChart3 = echarts.init($('#desd'));
            }*!/
        formatter: function (params) {
            // console.log('返回结果：',params);
            var res = "<div>"+'频次'+':'+params.value+'<br>'+'占比'+':'+params.name+"</div>"
            // return res
           /!* var res = "<div id='sub'>测试</div>";
            $('#sub').append($('.test'));
*!/
            return res;
         },
       /!* trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }*!/
    },
    grid: {
        left: '3%',
        right: '15%',
        bottom: '3%',
        top:'18%',
        containLabel: true
    },
    xAxis : [
        {
            splitLine:{show: false},//去除网格线
            name:'观看时长比率',
            type : 'category',
           // boundaryGap: ['20%', '20%'],
            //min:0.0,
            //max:13,
            //interval:0.2,
             data : ['0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7','0.8','0.9','≥1.0'],
            //data : ['0.0','0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7','0.8','0.9','1.0'],
            axisLabel :{
                   interval:2
                    },
            // data:xData,

            axisTick: {
                alignWithLabel: true
            },
             splitArea : {show : false}//保留网格区域
        }
    ],
    yAxis : [
        {
            splitLine:{show: false},//去除网格线
            name:'观看次数',
            type : 'value',
            //max:100,
            splitArea : {show : false}//保留网格区域
        }
    ],
    series : [
        {
            name:'观看次数',
            type:'bar',
            barWidth: '90%',

            // data:[10, 52, 200, 334, 390, 330, 220]
            data:yData
        }
    ]
};*/

var xData = data.watch_time;
var yData = null;

yData = data.watch_times;
var exit_counts = data.all_times;
var cacCount = exit_counts
/*option = {
    title: {
        text: '退出总次数：'+cacCount+'次',
        top:'2%',
        left:'center',
        //left:'2%',
        textStyle: {
            fontSize:15,
            fontWeight: 'normal',
          fontStyle: 'normal',
          fontFamily:'微软雅黑'
        }
    },
    color: ['#3398DB'],
    tooltip : {
        formatter: function (params) {
                // console.log('返回结果：',params);
                var res = "<div>"+'退出次数'+':'+params.value+'<br>'+'退出时间'+':'+params.name+'s'+"</div>"

                // console.log('元素为：',res)

                return res


         }
        /!*trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }*!/
    },
    grid: {
        left: '3%',
        right: '15%',
        bottom: '3%',
        top:'18%',
        containLabel: true
    },
    xAxis : [
        {
            splitLine:{show: false},//去除网格线
            name:'退出时间(s)',
            type : 'category',
           // boundaryGap: ['20%', '20%'],
            //min:0.0,
            //max:13,
            //interval:0.2,
            // data:[60,120,180,240,300,360,420,480,540,600],
            data:xData,
            //data : ['0.0','0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7','0.8','0.9','1.0'],
            axisLabel :{
                   interval:0
                    },
            // data:xData,

            axisTick: {
                alignWithLabel: true
            },
             splitArea : {show : false}//保留网格区域
        }
    ],
    yAxis : [
        {
            splitLine:{show: false},//去除网格线
            name:'退出次数',
            type : 'value',
            //max:100,
            splitArea : {show : false}//保留网格区域
        }
    ],
    series : [
        {
            name:'退出次数',
            type:'bar',
            barWidth: '90%',

            // data:[10, 52, 200, 334, 390, 330, 220]
            data:yData
        }
    ]
};*/

option = {
    title: {
        text: '观看总次数：'+cacCount+'次',
        top:'2%',
        left:'center',
        //left:'2%',
        textStyle: {
            fontSize:15,
            fontWeight: 'normal',
          fontStyle: 'normal',
          fontFamily:'微软雅黑'
        }
    },
    color: ['#3398DB'],
    tooltip : {
           /* enterable:true,
            //alwaysShowContent:true,
            hideDelay:100,
            backgroundColor: 'rgba(255,255,255,1)',//背景颜色（此时为默认色）
            borderRadius: 5,//边框圆角
            padding: 14,    // [5, 10, 15, 20] 内边距
            textStyle:{
                color:'#000'
            },
            position: function (point, params, dom, rect, size) {
                $(dom).html('<div  id="desd" style = "width:200px;height:100px;background: cadetblue">来啦</div>')
                // console.log('元素名称为：',$('#aa').text())
                 // $(dom).html('<div class="tip"><span>技能块名称名称</span><small>掌握程度：<b>90%</b></small></div><ul class="list"><li><span>技能点的名字撒旦萨达四大神兽</span><b class="star"></b><b class="star"></b><b class="star"></b><b></b><b></b><a href="#">测试</a> </li><li><span>技能点的名字</span><b></b><b></b><b></b><b></b><b></b><a href="#">测试</a></li><li><span>技能点的名字</span><b></b><b></b><b></b><b></b><b></b><a href="#">测试</a></li><li><span>技能点的名字</span><b></b><b></b><b></b><b></b><b></b><a href="#">测试</a></li></ul><ul class="courseWare"><li><span>课件一的名称</span><small>学习时长：<i>8h</i></small><a href="#">学习</a></li><li><span>课件一的名称</span><small>学习时长：<i>8h</i></small><a href="#">学习</a></li></ul><button class="courseBtn">课程测试</button>')
                 // console.log($('.tip').text())
                // getSubVideoDuration($('#aa'))
                var myChart3 = echarts.init($('#desd'));
            }*/
        formatter: function (params) {
            // console.log('返回结果：',params);
            var res = "<div>"+'频次'+':'+params.value+'<br>'+'占比'+':'+params.name+"</div>"
            // return res
           /* var res = "<div id='sub'>测试</div>";
            $('#sub').append($('.test'));
*/
            return res;
         },
       /* trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }*/
    },
    grid: {
        left: '3%',
        right: '15%',
        bottom: '3%',
        top:'18%',
        containLabel: true
    },
    xAxis : [
        {
            splitLine:{show: false},//去除网格线
            name:'观看时长比率',
            type : 'category',
           // boundaryGap: ['20%', '20%'],
            //min:0.0,
            //max:13,
            //interval:0.2,
             data : ['0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7','0.8','0.9','1.0','≥1.0'],
            //data : ['0.0','0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7','0.8','0.9','1.0'],
            axisLabel :{
                   interval:1
                    },
            // data:xData,

            axisTick: {
                alignWithLabel: true
            },
             splitArea : {show : false}//保留网格区域
        }
    ],
    yAxis : [
        {
            splitLine:{show: false},//去除网格线
            name:'观看次数',
            type : 'value',
            //max:100,
            splitArea : {show : false}//保留网格区域
        }
    ],
    series : [
        {
            name:'观看次数',
            type:'bar',
            barWidth: '90%',

            // data:[10, 52, 200, 334, 390, 330, 220]
            data:yData
        }
    ]
};

myChart1.setOption(option);

myChart1.on('click', function (params) {
    // 控制台打印数据的名称
    // console.log(params.name);
    //getMainSub(params.name,data);
    getMainSub1(params.name,data);
    //显示提示框
    e('modal').style.display='block';
    e('cover').style.display='block';
    stopBubble(event);
    document.onclick=function(){
      e('modal').style.display='none';
      e('cover').style.display='none';
　　　　　　　document.onclick=null;　
    }
});

}

var myChart2 = echarts.init(document.getElementById('main_sub'));
function getMainSub(name,data) {

    if(name == '≥1.0'){
        name = 1.0;
    }
    var x_datas = data.three_time_data.exit_time;
    var y_datas = data.three_time_data.exit_times;

    for(var i in y_datas){

       if(name == (parseInt(i)*0.1).toFixed(1)){
        var res_y = y_datas[i];
        var res_x = x_datas[i];
      }
    }

   var x_data = res_x;
   var y_data = res_y;
   var max =Math.max.apply(Math, y_data);
   //计算次数
   var cacSubCount = 0;
   for(var ca = 0;ca < y_data.length;ca++){
       cacSubCount += y_data[ca];
   }



option = {
        title: {
            text: '观看时长详情分布' + ' ' + '观看次数：' + cacSubCount + '',
            top:'2%',
            left:'2%',
            textStyle: {
                fontSize:15,
                fontWeight: 'normal',
              fontStyle: 'normal',
              fontFamily:'微软雅黑'
            }
        },
        color: ['#3398DB'],
        tooltip : {
            formatter: function (params) {

                var res = "<div>" + '次数' + ':' + params.value + '<br>' + '占比' + ':' + params.name + "</div>";
                return res
            }


        },
        grid: {
            left: '3%',
            right: '15%',
            bottom: '3%',
            top:'18%',
            containLabel: true
        },
        xAxis : [
            {
                splitLine:{show: false},//去除网格线
                name:'观看时长比率',
                type : 'category',
               // boundaryGap: ['20%', '20%'],
                //min:0.0,
                //max:13,
                //interval:0.2,
                //data:[60,120,180,240,300,360,420,480,540,600],
                //data : ['0.0','0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7','0.8','0.9','1.0'],
                data:x_data,
                axisLabel :{
                       interval:0
                        },
                // data:xData,

                axisTick: {
                    alignWithLabel: true
                },
                 splitArea : {show : false}//保留网格区域
            }
        ],
        yAxis : [
            {
                splitLine:{show: false},//去除网格线
                name:'观看次数',
                type : 'value',
                // max:max,
                //min:0,
                splitArea : {show : false}//保留网格区域
            }
        ],
        series : [
            {
                name:'观看时长',
                type:'bar',
                barWidth: '90%',

                // data:[10, 52, 200, 334, 390, 330, 220]
                data:y_data
            }
        ]
    };
    myChart2.setOption(option);
}

//观看次数子图
function getMainSub1(name,data) {
    var x_datas = data.one_list.exit_time;
    var y_datas = data.one_list.exit_times;
    var index = 0;
    if(name == '≥1.0'){
        index = 10;
    }else {
        index = parseInt(name*10-1);
    }

    var x_data = x_datas[index];
    var y_data = y_datas[index];

    //计算总次数
    var counts = 0;
    for(var i = 0;i<y_data.length;i++){
        counts += y_data[i];
    }

     subWatchEchart(x_data,y_data,counts);

     //判断是大于100%的情况并将拿到传入的值转化为需查询的参数


}
function subWatchEchart(x_data,y_data,all_count) {
    var cacSubCount = all_count;
    var x_data = x_data;
    var y_data = y_data;
    option = {
        title: {
            text: '观看时长详情分布' + ' ' + '观看次数：' + cacSubCount + '',
            top:'2%',
            left:'2%',
            bottom:'5%',
            textStyle: {
                fontSize:15,
                fontWeight: 'normal',
              fontStyle: 'normal',
              fontFamily:'微软雅黑'
            }
        },
        color: ['#3398DB'],
        tooltip : {
            formatter: function (params) {

                var res = "<div>" + '次数' + ':' + params.value + '<br>' + '占比' + ':' + params.name + "</div>";
                return res
            }


        },
        grid: {
            left: '3%',
            right: '15%',
            bottom: '3%',
            top:'18%',
            containLabel: true
        },
        xAxis : [
            {
                splitLine:{show: false},//去除网格线
                name:'观看时长比率',
                type : 'category',
               // boundaryGap: ['20%', '20%'],
                //min:0.0,
                //max:13,
                //interval:0.2,
                //data:[60,120,180,240,300,360,420,480,540,600],
                //data : ['0.0','0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7','0.8','0.9','1.0'],
                data:x_data,
                axisLabel :{
                       interval:0
                        },


                axisTick: {
                    alignWithLabel: true
                },
                 splitArea : {show : false}//保留网格区域
            }
        ],
        yAxis : [
            {
                splitLine:{show: false},//去除网格线
                name:'观看次数',
                type : 'value',
                //max:max,
                //min:0,
                splitArea : {show : false}//保留网格区域
            }
        ],
        series : [
            {
                name:'观看时长',
                type:'bar',
                barWidth: '90%',

                // data:[10, 52, 200, 334, 390, 330, 220]
                data:y_data
            }
        ]
    };
myChart2.setOption(option);
}


//退出时间子图
var myChartSub2 = echarts.init(document.getElementById('main_sub2'));

function getMainSub2(name,data) {
    var nameInt = parseInt(name);
    var index = parseInt(nameInt/30 - 1);
    var x_datas =  data.three_list.exit_time;
    var y_datas =  data.three_list.exit_times;


    var x_data = x_datas[index];
    var y_data = y_datas[index];
     //计算总次数
    var counts = 0;
    for(var i = 0;i<y_data.length;i++){
        counts += y_data[i];
    }

    subEchart(x_data,y_data,counts);






}

function subEchart(x_data,y_data,counts) {

    var x_data = x_data;
    var y_data = y_data;
    var cacSubCount = counts;




    option = {
        title: {
            // text: '观看时长详情分布' + '    ' + '范围：['+ a + '~' + b + ']' + '   ' + '观看次数：' + cacSubCount + '',
            text: '退出观看次数详情分布图' + '    ' + '观看次数：' + cacSubCount + '',
            top:'2%',
            left:'2%',
            textStyle: {
                fontSize:15,
                fontWeight: 'normal',
              fontStyle: 'normal',
              fontFamily:'微软雅黑'
            }
        },
        color: ['#3398DB'],
        tooltip : {
            formatter: function (params) {

                var res = "<div>" + '退出次数' + ':' + params.value + '<br>' + '退出时间' + ':' + params.name + 's'+"</div>";
                return res
            }


        },
        grid: {
            left: '3%',
            right: '15%',
            bottom: '3%',
            top:'18%',
            containLabel: true
        },
        xAxis : [
            {
                splitLine:{show: false},//去除网格线
                name:'退出时间(s)',
                type : 'category',
               // boundaryGap: ['20%', '20%'],
                //min:0.0,
                //max:13,
                //interval:0.2,
                //data:[60,120,180,240,300,360,420,480,540,600],
                //data : ['0.0','0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7','0.8','0.9','1.0'],
                data:x_data,
                axisLabel :{
                       interval:0
                        },
                // data:xData,

                axisTick: {
                    alignWithLabel: true
                },
                 splitArea : {show : false}//保留网格区域
            }
        ],
        yAxis : [
            {
                splitLine:{show: false},//去除网格线
                name:'退出次数',
                type : 'value',
                //max:max,
                //min:0,
                splitArea : {show : false}//保留网格区域
            }
        ],
        series : [
            {
                name:'退出时间',
                type:'bar',
                barWidth: '90%',

                // data:[10, 52, 200, 334, 390, 330, 220]
                data:y_data
            }
        ]
    };
myChartSub2.setOption(option);
}

//数组查找包含关系
function isInArray(arr,value){
    for(var i = 0; i < arr.length; i++){
        if(value === arr[i]){
            return true;
        }
    }
    return false;
}

/**
*删除数组指定下标或指定对象
*/
Array.prototype.remove=function(obj){
for(var i =0;i <this.length;i++){
var temp = this[i];
if(!isNaN(obj)){
temp=i;
}
if(temp == obj){
for(var j = i;j <this.length;j++){
this[j]=this[j+1];
}
this.length = this.length-1;
}
}
}


function getSubVideoDuration(dom1,data){
     console.log('dom is:',dom1)
// var yData = data.times_list;
var myChart = echarts.init(dom1);

}


//获取30s退出数据列表 GET
function getThirtyExit() {
    $.ajax({
       type: "GET",
       // url: "http://127.0.0.1:5000/exit_list",
       url:host+"/exit_list",
       data: '',
        // cache:false,
            // 请求发送之前（发送请求前可修改XMLHttpRequest对象的函数，如添加自定义HTTP头。）。
        beforeSend:function(XMLHttpRequest){
           XMLHttpRequest.setRequestHeader("If-Modified-Since","0");
           XMLHttpRequest.setRequestHeader("Cache-Control","no-cache");
           $('#shclProgress').show();
            progressLoading();
        },
       success: function(data){

            getVideoTimes(data);
            //getMainSub2(30,data)

          },
         // 请求完成后的回调函数 (请求成功或失败之后均调用)
        complete:function(XMLHttpRequest,textStatus){
            $('#shclProgress').hide();

        },
      // timeout: 15000,
      error: function (error) {
           console.log(error)
      }
    });
}

//获取30s退出数据列表 POST
function getThirtyExitP(data0) {
    $.ajax({
       type: "POST",
       // url: "http://127.0.0.1:5000/exit_list",
       // url:host+"/exit_list",
       url:host+"/exit_all_new_list",
       data: data0,
        // cache:false,
            // 请求发送之前（发送请求前可修改XMLHttpRequest对象的函数，如添加自定义HTTP头。）。
        beforeSend:function(XMLHttpRequest){
           XMLHttpRequest.setRequestHeader("If-Modified-Since","0");
           XMLHttpRequest.setRequestHeader("Cache-Control","no-cache");
           $('#shclProgress').show();
            progressLoading();
        },
       success: function(data){

            getVideoTimes(data);
            //getMainSub2(30,data)
            var x = data.three_list.three_all_x;
           var y = data.three_list.three_all_y;
           exitThreeSubEcharts(x,y);//退出3s详细图
          },
         // 请求完成后的回调函数 (请求成功或失败之后均调用)
        complete:function(XMLHttpRequest,textStatus){
            $('#shclProgress').hide();

        },
      // timeout: 15000,
      error: function (error) {
           console.log(error)
      }
    });
}

//获取3s退出数据列表
function getThreeExit() {
    var result = 0;
    $.ajax({
       type: "GET",
       // url: "http://127.0.0.1:5000/exit_three_list",
       url:host+"/exit_three_list",
       data: '',
        // cache:false,
       // async : false,
            // 请求发送之前（发送请求前可修改XMLHttpRequest对象的函数，如添加自定义HTTP头。）。
        beforeSend:function(XMLHttpRequest){
           XMLHttpRequest.setRequestHeader("If-Modified-Since","0");
           XMLHttpRequest.setRequestHeader("Cache-Control","no-cache");
           $('#shclProgress').show();
            progressLoading();
        },
       success: function(data){
            result = data;
            //getMainSub2(30,data)
          },
         // 请求完成后的回调函数 (请求成功或失败之后均调用)
        complete:function(XMLHttpRequest,textStatus){
            $('#shclProgress').hide();

        },
      // timeout: 15000,
      error: function (error) {
           console.log(error)
      }
    });
    //return result;
}


var myChart3 = echarts.init(document.getElementById('main2'));
function getVideoTimes(data){
var xData = data.exit_time;
    //xData[0] = [9,12,15,18,21,24,27,30];
var yData = null;

yData = data.exit_times;
var exit_counts = data.all_times;
var cacCount = exit_counts
option = {
    title: {
        text: '退出总次数：'+cacCount+'次',
        top:'2%',
        left:'center',
        //left:'2%',
        textStyle: {
            fontSize:15,
            fontWeight: 'normal',
          fontStyle: 'normal',
          fontFamily:'微软雅黑'
        }
    },

    color: ['#3398DB'],
    tooltip : {
        formatter: function (params) {
                // console.log('返回结果：',params);
                var res = "<div>"+'退出次数'+':'+params.value+'<br>'+'退出时间'+':'+params.name+'s'+"</div>"

                // console.log('元素为：',res)

                return res


         }
        /*trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }*/
    },
    grid: {
        left: '3%',
        right: '15%',
        bottom: '3%',
        top:'18%',
        containLabel: true
    },
    xAxis : [
        {
            splitLine:{show: false},//去除网格线
            name:'退出时间(s)',
            type : 'category',
           // boundaryGap: ['20%', '20%'],
            //min:0.0,
            //max:13,
            //interval:0.2,
            // data:[60,120,180,240,300,360,420,480,540,600],
            data:xData,
            //data : ['0.0','0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7','0.8','0.9','1.0'],
            axisLabel :{
                   interval:0,
                /*    formatter:function(value)
                               {

                                        return value.split("").join("\n");


                               }*/
                  rotate:-70
                    },

            /*axisLabel: {
               interval:0,
               rotate:40
            },  */
            // data:xData,

            axisTick: {
                alignWithLabel: true
            },
             splitArea : {show : false}//保留网格区域
        }
    ],
    yAxis : [
        {
            splitLine:{show: false},//去除网格线
            name:'退出次数',
            type : 'value',
            //max:100,
            splitArea : {show : false}//保留网格区域
        }
    ],
    series : [
        {
            name:'退出次数',
            type:'bar',
            barWidth: '90%',

            // data:[10, 52, 200, 334, 390, 330, 220]
            data:yData
        }
    ]
};
myChart3.setOption(option);
myChart3.on('click', function (params) {
    // 控制台打印数据的名称
    // console.log(params.name);
     getMainSub2(params.name,data);
    //显示提示框
    e('modal2').style.display='block';
    e('cover').style.display='block';
    stopBubble(event);
    document.onclick=function(){
      e('modal2').style.display='none';
      e('cover').style.display='none';
　　　　　　　document.onclick=null;　
    }
});
}

//修改视频名称
$('#videoName').text(videoNames);





//用于遮罩层操作
function e(obj){return document.getElementById(obj)}
    /*e('open').onclick=function(event){
    e('modal').style.display='block';
    e('cover').style.display='block';
    stopBubble(event);
    document.onclick=function(){
      e('modal').style.display='none';
      e('cover').style.display='none';
　　　　　　　document.onclick=null;　
    }
  }*/
  e('modal').onclick=function(event){
    //只阻止了向上冒泡，而没有阻止向下捕获，所以点击con的内部对象时，仍然可以执行这个函数
    stopBubble(event);
  }
  e('modal2').onclick=function(event){
    //只阻止了向上冒泡，而没有阻止向下捕获，所以点击con的内部对象时，仍然可以执行这个函数
    stopBubble(event);
  }
  //阻止冒泡函数
  function stopBubble(e){
    if(e && e.stopPropagation){
      e.stopPropagation();  //w3c
    }else{
      window.event.cancelBubble=true; //IE
    }
  }


//关闭窗口
$('#close1').click(function () {
    $(this).parent().hide();
    e('cover').style.display='none';
})
//关闭窗口
$('#close2').click(function () {
    $(this).parent().hide();
    e('cover').style.display='none';
})
//关闭窗口
$('#close3').click(function () {
    $(this).parent().hide();
    e('cover').style.display='none';
})

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


//初始化时间选择
/*function initLaydate() {
      //获取昨天的日期
    var day1 = new Date();
        day1.setTime(day1.getTime()-24*60*60*1000);
     var yesterday = day1.getFullYear()+"-" + (day1.getMonth()+1) + "-" + day1.getDate();

     var start = {
       elem: '#video_name1', //id为star的输入框
       format: 'YYYY-MM-DD',
       // max: laydate.now(), //最大日期
       min:'2017-1-1',
       max: yesterday, //最大日期
       istime: true,
       istoday: false,
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
      elem: '#video_name2',
      format: 'YYYY-MM-DD',
      // max: laydate.now(),
      min:'2017-1-1',
      max:yesterday,
      istime: true,
      istoday: false,
      /!*choose: function(datas){
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
}*/

function initLaydate() {
  //获取昨天的日期
        var day1 = new Date();
        day1.setTime(day1.getTime()-24*60*60*1000);
        var yesterday = day1.getFullYear()+"-" + (day1.getMonth()+1) + "-" + day1.getDate();

        var cartimeDate = laydate.render({
            elem: '#video_name1', //用车时间
            min:'2017-1-1',
            max: yesterday //最大日期
            // ,type: 'datetime'
            // ,format: 'yyyy-MM-dd'
            ,done:function(value, date){
                returntimeDate.config.min=getDateArray(date);//重点
            }
        });

        var returntimeDate = laydate.render({
            elem: '#video_name2', //预计回车时间
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


//暂停数据分布图
var pauseId = document.getElementById('main3');
function pauseAnalysis(data) {
   var pauseInit = echarts.init(pauseId);
   var x_data = data.pause_time;
   var y_data = data.pause_times;
   var exit_counts = data.all_times;
   var cacCount = exit_counts
     var x = data.three_list.all_pause_three_x;
     var y = data.three_list.all_pause_three_times_y;

     pauseThreeSubEcharts(x,y);
   option = {
       title: {
        text: '暂停总次数：'+cacCount+'次',
        top:'2%',
        left:'center',
        //left:'2%',
        textStyle: {
            fontSize:15,
            fontWeight: 'normal',
          fontStyle: 'normal',
          fontFamily:'微软雅黑'
        }
    },
    color: ['#3398DB'],
    tooltip : {
       formatter: function (params) {
                // console.log('返回结果：',params);
                var res = "<div>"+'暂停次数'+':'+params.value+'<br>'+'暂停时间'+':'+params.name+'s'+"</div>"

                // console.log('元素为：',res)

                return res


         }
    },
    grid: {
        left: '3%',
        right: '15%',
        bottom: '3%',
        top:'18%',
        containLabel: true
    },
    xAxis : [
        {
            splitLine:{show: false},//去除网格线
            name:'暂停时间(s)',
            type : 'category',
            data : x_data,
           axisLabel :{
                   interval:0,
                /*    formatter:function(value)
                               {

                                        return value.split("").join("\n");


                               }*/
                  rotate:-70
                    },
            axisTick: {
                alignWithLabel: true
            },
             splitArea : {show : false}//保留网格区域
        }
    ],
    yAxis : [
        {
            splitLine:{show: false},//去除网格线
            name:'暂停次数',
            type : 'value',
            splitArea : {show : false}//保留网格区域
        }
    ],
    series : [
        {
            name:'暂停次数',
            type:'bar',
            barWidth: '90%',
            data:y_data
        }
    ]
};
   pauseInit.setOption(option);
   pauseInit.on('click', function (params) {
    // 控制台打印数据的名称
    // console.log(params.name);
     pauseSub(params.name,data,params.value);
    //显示提示框
    e('modal3').style.display='block';
    e('cover').style.display='block';
    stopBubble(event);
    document.onclick=function(){
      e('modal3').style.display='none';
      e('cover').style.display='none';
　　　　　　　document.onclick=null;　
    }
});
}

//暂停数据子分布图
var pauseChartSub = echarts.init(document.getElementById('main_sub3'));
function pauseSub(name,data,cacSubCount) {
    // console.log('暂停子图接收到的数据name为：',name);
    // console.log('暂停子图接收到的数据data为：',data);
    //获取暂停3s的数据
    var pausethreeData = data.three_list;
    var x_datas = pausethreeData.exit_time;
    var y_datas = pausethreeData.exit_times;

    var index = parseInt(name)/30 - 1;//查找对应的索引值
    console.log('转换后的索引值为：',index);
    x_data = x_datas[index];
    y_data = y_datas[index];
    var cacSubCount =  cacSubCount;
    option = {
        title: {
            // text: '观看时长详情分布' + '    ' + '范围：['+ a + '~' + b + ']' + '   ' + '观看次数：' + cacSubCount + '',
            text: '暂停次数详情分布图' + '    ' + '暂停次数：' + cacSubCount + '',
            top:'2%',
            left:'2%',
            textStyle: {
                fontSize:15,
                fontWeight: 'normal',
              fontStyle: 'normal',
              fontFamily:'微软雅黑'
            }
        },
        color: ['#3398DB'],
        tooltip : {
            formatter: function (params) {
                // console.log('返回结果：',params);
                // var res = "<div>"+'频次'+':'+params.value+'<br>'+'时长'+':'+params.name+'s'+"</div>"

                // console.log('元素为：',res)
                var res = "<div>" + '暂停次数' + ':' + params.value + '<br>' + '暂停时间' + ':' + params.name + 's'+"</div>";
                return res
            }
            //
            //  },
            // trigger: 'axis',
            // axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            //     type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            // }

        },
        grid: {
            left: '3%',
            right: '15%',
            bottom: '3%',
            top:'18%',
            containLabel: true
        },
        xAxis : [
            {
                splitLine:{show: false},//去除网格线
                name:'暂停时间(s)',
                type : 'category',
               // boundaryGap: ['20%', '20%'],
                //min:0.0,
                //max:13,
                //interval:0.2,
                //data:[60,120,180,240,300,360,420,480,540,600],
                //data : ['0.0','0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7','0.8','0.9','1.0'],
                data:x_data,
                axisLabel :{
                       interval:0
                        },
                // data:xData,

                axisTick: {
                    alignWithLabel: true
                },
                 splitArea : {show : false}//保留网格区域
            }
        ],
        yAxis : [
            {
                splitLine:{show: false},//去除网格线
                name:'暂停次数',
                type : 'value',
                //max:max,
                //min:0,
                splitArea : {show : false}//保留网格区域
            }
        ],
        series : [
            {
                name:'退出时间',
                type:'bar',
                barWidth: '90%',

                // data:[10, 52, 200, 334, 390, 330, 220]
                data:y_data
            }
        ]
    };

    pauseChartSub.setOption(option);
}

//交互题数据
var div1=document.getElementById("scroll");
function createTableI() {
 var videoSk = codeParam;
     //获取日期
    var input1 = $('#video_name1').val();
    var input2 = $('#video_name2').val();

    input1 = input1.replace(/-/g,"");
    input2 = input2.replace(/-/g,"");

    if((input1 == '') || (input1 == '')){
        input1 = '20180520';
        input2 = '20180525';
    }


    var data1 = {"date_start":input1,"date_end":input2,"sk":videoSk}

     data0 = JSON.stringify(data1);
     $.ajax({
       type: "POST",
       url:host+"/interaction_list",
       data: data0,
            // 请求发送之前（发送请求前可修改XMLHttpRequest对象的函数，如添加自定义HTTP头。）。
        beforeSend:function(XMLHttpRequest){
           XMLHttpRequest.setRequestHeader("If-Modified-Since","0");
           XMLHttpRequest.setRequestHeader("Cache-Control","no-cache");
           $('#shclProgress').show();
            progressLoading();
        },
       success: function(data){

            // var tNum = data.num;//题号
            var tNum = data.t_num;//参考对应题号
            var tAnser = data.t_anser;//答案
            var tMarker = data.t_maker;//答案标记
            var tCNT = data.t_cnt;//答题次数


        //    查找列最大值
           var columnMax = [];
           for(var k = 0;k<tAnser.length;k++){
               columnMax.push(tAnser[k].length);
           }
           var colMax = columnMax[0];
                for (var col = 0; col < columnMax.length - 1; col++) {
                colMax = colMax < columnMax[col+1] ? columnMax[col+1] : colMax
            }

        //查找列宽度平均值
           var avg = ((100/(colMax+1))).toFixed(2);

        var tab="<table id='tableD' border='1' bordercolor='blue'>";
        //循环行
           var index = 0;
           var flag = 0;
           var flag2 = 0;
           for(var i=0;i<tNum.length*2;i++) {

            if(i%2 == 0){
                 tab+="<tr>";
                 tab+="<td style='width:"+avg+"%'>"+"第"+tNum[index]+"题"+"</td>";
                 for(var f = 0;f < tAnser[flag].length;f++){
                     tab+="<td style='width:"+avg+"%'>"+tAnser[flag][f]+"</td>";

                 }
                  if(tAnser[flag].length < colMax){
                         var distance = colMax-tAnser[flag].length;
                         for(var gap = 0; gap < distance;gap++){
                              tab+="<td style='width:"+avg+"%'></td>";
                          }

                     }
                 flag++;
               /*  tab+="<td>A</td>";
                 tab+="<td>B</td>";
                 tab+="<td>C</td>";
                 tab+="<td>D</td>";*/
                 tab+="</tr>";

            }else {
                 tab+="<tr>";
                  tab+="<td style='width: "+avg+"%'></td>";
                 for(var f1 = 0;f1 < tCNT[flag2].length;f1++){
                     //如果有两个值为ture和false的情况
                     if(tMarker[flag2][f1].length == 2){

                          if(tMarker[flag2][f1][1] == true){
                             tab+="<td style='color: red;width:"+avg+"%'>"+tCNT[flag2][f1]+"</td>";
                         }else {
                             tab+="<td style='width:"+avg+"%'>"+tCNT[flag2][f1]+"</td>";
                         }
                     }
                     else
                     {
                         if(tMarker[flag2][f1] == "true"){
                         tab+="<td style='color: red;width:"+avg+"%'>"+tCNT[flag2][f1]+"</td>";
                         }else {
                             tab+="<td style='width:"+avg+"%'>"+tCNT[flag2][f1]+"</td>";
                         }
                     }


                 }
                  if(tCNT[flag2].length < colMax){
                         var distance2 = colMax-tCNT[flag2].length;
                         for(var gap2 = 0; gap2 < distance2;gap2++){
                              tab+="<td style='width:"+avg+"%'></td>";
                          }
                    }
                /* tab+="<td></td>";
                 tab+="<td>50</td>";
                 tab+="<td>100</td>";
                 tab+="<td>200</td>";
                 tab+="<td>300</td>";*/
                 index++;
                 flag2++;
                 tab+="</tr>";
            }

        }
           tab+="</table>"
           div1.innerHTML=tab;




           //筛选每一题的答案和次数

          /* var resultAll = [];//最终的结果
           for(var t = 0;t < tNum.length;t++){
               var result = [];
               for(var t1 = 0;t1 < yNum.length;t1++){
                   var tag =  [];
                   if(tNum[t] == yNum[t1]){
                       tag.push(tAnser[t1]);
                       tag.push(tMarker[t1]);
                       tag.push(tCNT[t1]);
                   }
                   if(tag.length != 0){
                       result.push(tag);
                   }

               }
               resultAll.push(result);
           }*/
         // console.log('得到交互数据的结果为：',resultAll);
          /* if(resultAll.length == 0){
           div1.innerHTML = "sorry,没有找到相应的习题";
           div1.style.display = 'flex';
           div1.style.justifyContent = 'center';
           div1.style.alignItems = 'center';
        }else
            {

           div1.style.display = 'flex';
           div1.style.justifyContent = 'flex-start';
           div1.style.alignItems = 'flex-start';
        var tab="<table id='tableD' border='1' bordercolor='blue'>";
        //循环行
           var index = 0;
           var flag = 0;
           var flag2 = 0;
           for(var i=0;i<data.num.length*2;i++) {

            if(i%2 == 0){
                 tab+="<tr>";
                 tab+="<td style='width: 20%'>"+"第"+(tNum[index]+1)+"题"+"</td>";
                  console.log('循环的结果为：',flag);
                 for(var f = 0;f < resultAll[flag].length;f++){
                     tab+="<td style='width: 20%'>"+resultAll[flag][f][0]+"</td>";

                 }
                  if(resultAll[flag].length < 4){
                         var distance = 4-resultAll[flag].length;
                         for(var gap = 0; gap < distance;gap++){
                              tab+="<td style='width: 20%'></td>";
                          }

                     }
                 flag++;
               /!*  tab+="<td>A</td>";
                 tab+="<td>B</td>";
                 tab+="<td>C</td>";
                 tab+="<td>D</td>";*!/
                 tab+="</tr>";

            }else {
                 tab+="<tr>";
                  tab+="<td style='width: 25%'></td>";
                 for(var f1 = 0;f1 < resultAll[flag2].length;f1++){
                     if(resultAll[flag2][f1][1] == "true"){
                         tab+="<td style='color: red;width: 20%'>"+resultAll[flag2][f1][2]+"</td>";
                     }else {
                         tab+="<td style='width: 20%'>"+resultAll[flag2][f1][2]+"</td>";
                     }

                 }
                  if(resultAll[flag2].length < 4){
                         var distance2 = 4-resultAll[flag2].length;
                         for(var gap2 = 0; gap2 < distance2;gap2++){
                              tab+="<td style='width: 20%'></td>";
                          }
                    }
                /!* tab+="<td></td>";
                 tab+="<td>50</td>";
                 tab+="<td>100</td>";
                 tab+="<td>200</td>";
                 tab+="<td>300</td>";*!/
                 index++;
                 flag2++;
                 tab+="</tr>";
            }

        }
           tab+="</table>"
           div1.innerHTML=tab;
         }*/
          },
         // 请求完成后的回调函数 (请求成功或失败之后均调用)
        complete:function(XMLHttpRequest,textStatus){
            $('#shclProgress').hide();

        },
      // timeout: 15000,
      error: function (error) {
           console.log(error)
      }
    });



}



//3s退出后折线图和曲线图

var exitThreeSub = echarts.init(document.getElementById('all_three_main'));
function exitThreeSubEcharts(x,y) {

    exitThreeSubEchartsLine(x,y)

    x_data = x;
    y_data = y;
     var count1 = 0;
    for(var i1 = 0;i1<y_data.length;i1++){
        count1 += y_data[i1]
    }
    var cacSubCount =  count1;
    option = {
        title: {
            // text: '观看时长详情分布' + '    ' + '范围：['+ a + '~' + b + ']' + '   ' + '观看次数：' + cacSubCount + '',
            text: '退出次数详情分布图' + '    ' + '退出次数：' + cacSubCount + '',
            top:'2%',
            left:'2%',
            textStyle: {
                fontSize:15,
                fontWeight: 'normal',
              fontStyle: 'normal',
              fontFamily:'微软雅黑'
            }
        },
        color: ['#3398DB'],
        tooltip : {
            formatter: function (params) {

                var res = "<div>" + '退出次数' + ':' + params.value + '<br>' + '退出时间' + ':' + params.name + 's'+"</div>";
                return res
            }
        },
        grid: {
            left: '2%',
            right: '7%',
            bottom: '3%',
            top:'18%',
            containLabel: true
        },
        xAxis : [
            {
                splitLine:{show: false},//去除网格线
                name:'暂停时间(s)',
                type : 'category',
               // boundaryGap: ['20%', '20%'],
                //min:0.0,
                //max:13,
                //interval:0.2,
                //data:[60,120,180,240,300,360,420,480,540,600],
                //data : ['0.0','0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7','0.8','0.9','1.0'],
                data:x_data,
                axisLabel :{
                       interval:3
                        },
                // data:xData,

                axisTick: {
                    alignWithLabel: true
                },
                 splitArea : {show : false}//保留网格区域
            }
        ],
        yAxis : [
            {
                splitLine:{show: false},//去除网格线
                name:'退出次数',
                type : 'value',
                //max:max,
                //min:0,
                splitArea : {show : false}//保留网格区域
            }
        ],
        series : [
            {
                name:'退出时间',
                type:'bar',
                barWidth: '90%',

                // data:[10, 52, 200, 334, 390, 330, 220]
                data:y_data
            }
        ]
    };

    exitThreeSub.setOption(option);
}



var exitThreeSubLine = echarts.init(document.getElementById('all_three_main1'));
function exitThreeSubEchartsLine(x,y) {

    x_data = x;
    y_data = y;
    var count = 0;
    for(var i = 0;i<y_data.length;i++){
        count += y_data[i]
    }
    var cacSubCount =  count;
    option = {
        title: {
            // text: '观看时长详情分布' + '    ' + '范围：['+ a + '~' + b + ']' + '   ' + '观看次数：' + cacSubCount + '',
            text: '退出次数详情分布图' + '    ' + '退出次数：' + cacSubCount + '',
            top:'2%',
            left:'2%',
            textStyle: {
                fontSize:15,
                fontWeight: 'normal',
              fontStyle: 'normal',
              fontFamily:'微软雅黑'
            }
        },
        color: ['#3398DB'],
        tooltip : {
            formatter: function (params) {
                // console.log('返回结果：',params);
                // var res = "<div>"+'频次'+':'+params.value+'<br>'+'时长'+':'+params.name+'s'+"</div>"

                // console.log('元素为：',res)
                var res = "<div>" + '退出次数' + ':' + params.value + '<br>' + '退出时间' + ':' + params.name + 's'+"</div>";
                return res
            }
            //
            //  },
            // trigger: 'axis',
            // axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            //     type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            // }

        },
        grid: {
            left: '2%',
            right: '7%',
            bottom: '10%',
            top:'18%',
            containLabel: true
        },
         dataZoom: [
        {
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            start: 0,
            end: 100,
            bottom: 5,
            height:25

        }],
        xAxis : [
            {
                splitLine:{show: false},//去除网格线
                name:'退出时间(s)',
                type : 'category',
               // boundaryGap: ['20%', '20%'],
                //min:0.0,
                //max:13,
                //interval:0.2,
                //data:[60,120,180,240,300,360,420,480,540,600],
                //data : ['0.0','0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7','0.8','0.9','1.0'],
                data:x_data,

                axisLabel :{
                     /*  interval:1,
                       rotate:-40*/
                        },
                // data:xData,

                axisTick: {
                    alignWithLabel: true
                },
                 splitArea : {show : false}//保留网格区域
            }
        ],
        yAxis : [
            {
                splitLine:{show: false},//去除网格线
                name:'退出次数',
                type : 'value',
                //max:max,
                //min:0,
                splitArea : {show : false}//保留网格区域
            }
        ],
        series : [
            {
                name:'退出时间',
                type:'line',
                barWidth: '90%',

                // data:[10, 52, 200, 334, 390, 330, 220]
                data:y_data
            }
        ]
    };

    exitThreeSubLine.setOption(option);
}

//3s暂停的折线图和曲线图
var pauseThreeSub = echarts.init(document.getElementById('all_pause_three_main'));
function pauseThreeSubEcharts(x,y) {

    pauseThreeSubEchartsLine(x,y)

    x_data = x;
    y_data = y;
     var count1 = 0;
    for(var i1 = 0;i1<y_data.length;i1++){
        count1 += y_data[i1]
    }
    var cacSubCount =  count1;
    option = {
        title: {
            // text: '观看时长详情分布' + '    ' + '范围：['+ a + '~' + b + ']' + '   ' + '观看次数：' + cacSubCount + '',
            text: '暂停次数详情分布图' + '    ' + '暂停次数：' + cacSubCount + '',
            top:'2%',
            left:'2%',
            textStyle: {
                fontSize:15,
                fontWeight: 'normal',
              fontStyle: 'normal',
              fontFamily:'微软雅黑'
            }
        },
        color: ['#3398DB'],
        tooltip : {
            formatter: function (params) {
                // console.log('返回结果：',params);
                // var res = "<div>"+'频次'+':'+params.value+'<br>'+'时长'+':'+params.name+'s'+"</div>"

                // console.log('元素为：',res)
                var res = "<div>" + '暂停次数' + ':' + params.value + '<br>' + '暂停时间' + ':' + params.name + 's'+"</div>";
                return res
            }
            //
            //  },
            // trigger: 'axis',
            // axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            //     type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            // }

        },
        grid: {
            left: '2%',
            right: '7%',
            bottom: '3%',
            top:'18%',
            containLabel: true
        },
        xAxis : [
            {
                splitLine:{show: false},//去除网格线
                name:'暂停时间(s)',
                type : 'category',
               // boundaryGap: ['20%', '20%'],
                //min:0.0,
                //max:13,
                //interval:0.2,
                //data:[60,120,180,240,300,360,420,480,540,600],
                //data : ['0.0','0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7','0.8','0.9','1.0'],
                data:x_data,
                axisLabel :{
                       interval:3
                        },
                // data:xData,

                axisTick: {
                    alignWithLabel: true
                },
                 splitArea : {show : false}//保留网格区域
            }
        ],
        yAxis : [
            {
                splitLine:{show: false},//去除网格线
                name:'暂停次数',
                type : 'value',
                //max:max,
                //min:0,
                splitArea : {show : false}//保留网格区域
            }
        ],
        series : [
            {
                name:'暂停时间',
                type:'bar',
                barWidth: '90%',

                // data:[10, 52, 200, 334, 390, 330, 220]
                data:y_data
            }
        ]
    };

    pauseThreeSub.setOption(option);
}

var pauseThreeSubLine = echarts.init(document.getElementById('all_pause_three_main1'));
function pauseThreeSubEchartsLine(x,y) {

    x_data = x;
    y_data = y;
    var count = 0;
    for(var i = 0;i<y_data.length;i++){
        count += y_data[i]
    }
    var cacSubCount =  count;
    option = {
        title: {
            // text: '观看时长详情分布' + '    ' + '范围：['+ a + '~' + b + ']' + '   ' + '观看次数：' + cacSubCount + '',
            text: '暂停次数详情分布图' + '    ' + '暂停次数：' + cacSubCount + '',
            top:'2%',
            left:'2%',
            textStyle: {
                fontSize:15,
                fontWeight: 'normal',
              fontStyle: 'normal',
              fontFamily:'微软雅黑'
            }
        },
        color: ['#3398DB'],
        tooltip : {
            formatter: function (params) {
                // console.log('返回结果：',params);
                // var res = "<div>"+'频次'+':'+params.value+'<br>'+'时长'+':'+params.name+'s'+"</div>"

                // console.log('元素为：',res)
                var res = "<div>" + '暂停次数' + ':' + params.value + '<br>' + '暂停时间' + ':' + params.name + 's'+"</div>";
                return res
            }
            //
            //  },
            // trigger: 'axis',
            // axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            //     type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            // }

        },
        grid: {
            left: '2%',
            right: '7%',
            bottom: '10%',
            // bottom: '3%',
            top:'18%',
            containLabel: true
        },
        xAxis : [
            {
                splitLine:{show: false},//去除网格线
                name:'暂停时间(s)',
                type : 'category',
               // boundaryGap: ['20%', '20%'],
                //min:0.0,
                //max:13,
                //interval:0.2,
                //data:[60,120,180,240,300,360,420,480,540,600],
                //data : ['0.0','0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7','0.8','0.9','1.0'],
                data:x_data,
                axisLabel :{
                     /*  interval:3,

                       rotate:-40*/
                        },
                // data:xData,

                axisTick: {
                    alignWithLabel: true
                },
                 splitArea : {show : false}//保留网格区域
            }
        ],
        yAxis : [
            {
                splitLine:{show: false},//去除网格线
                name:'暂停次数',
                type : 'value',
                //max:max,
                //min:0,
                splitArea : {show : false}//保留网格区域
            }
        ],
         dataZoom: [
        {
            // type: 'inside',
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            start: 0,
            end: 100,
            bottom: 5,
            height:25
        }],
        series : [
            {
                name:'暂停时间',
                type:'line',
                barWidth: '90%',

                // data:[10, 52, 200, 334, 390, 330, 220]
                data:y_data
            }
        ]
    };

    pauseThreeSubLine.setOption(option);
}




