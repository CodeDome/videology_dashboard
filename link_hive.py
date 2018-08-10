import psycopg2


#连接和关闭数据库
def get_df(sql):
    data_result = None
    with psycopg2.connect(database="videology", user="master", password="postgres", host="10.8.8.111", port="5432") as conn:
        with conn.cursor() as cur:
            cur.execute(sql)
            data_result = cur.fetchall()
    return data_result



'''
# 获取学科数据
def discipline():
    cur = conn.cursor()
    cur.execute("SELECT distinct subject_name from dw_dev.dim_term  WHERE subject_name != 'unavailable'")
    #cur.fetchone()
    data_list=cur.fetchall()
    #data_list是一个元组
    return data_list

# 获取总人数/认真观看人数/认真观看率数据
def get_all_count():
    cur1 = conn.cursor()
    cur1.execute("SELECT distinct subject_name from dw_dev.dim_term  WHERE subject_name != 'unavailable'")
    # cur.fetchone()
    data_list = cur1.fetchall()
'''

#查询（初中/高中/小学）所有章节包括物理和数学
# try:
def get_all_chapter():
    sql = '''
            SELECT chapter_name,chapter_sk,subject_name, CAST(split_part(chapter_name, '-', 1) as INT) chatper_num from dim_topic 
            WHERE chapter_name IS NOT NULL 
            ORDER BY chatper_num ASC
          '''
    # cur = conn.cursor()
    # cur.execute(sql)
    # data_list = cur.fetchall()
    # print('所有章节包括章节ID查询：', data_list)
    data_list = get_df(sql)
    #conn.close()
    return data_list

#查询选定学段和学科章节（人教版）
def middle_school_mathematics(school,subject):
    #学科判断
    if school == "1":
        school = '小学'
    elif school == "2":
        school = '初中'
    elif school == "3":
          school = '高中'


    if subject == "1":
        subject = '数学'
    elif subject == "2":
        subject = '物理'

    if school == 0:
        school = ''
    if subject == 0:
        subject = ''

    #如果选择了科目为全部和学段为全部
    if school == '' and subject == '':
        sql = '''
                SELECT chapter_name,chapter_sk,subject_name, CAST(split_part(chapter_name, '-', 1) as INT) chatper_num from dim_topic 
                WHERE chapter_name IS NOT NULL 
                ORDER BY chatper_num ASC
              '''
    #如果选择的科目为全部
    elif subject == '':
        sql = '''
                SELECT chapter_name,chapter_sk,subject_name,CAST(split_part(chapter_name, '-', 1) as INT) chatper_num  from dim_topic 
                WHERE stage_name = ''' + "\'" + school + "\'" + ''' and chapter_name IS NOT NULL 
                ORDER BY chatper_num ASC
              '''
    #如果选择的学段为全部
    elif school == '':
        sql = '''
                SELECT chapter_name,chapter_sk,subject_name,CAST(split_part(chapter_name, '-', 1) as INT) chatper_num from dim_topic 
                WHERE subject_name = ''' + "\'"+ subject +"\'" + ''' and chapter_name IS NOT NULL
                ORDER BY chatper_num ASC
              '''
    else:
        sql = '''
                SELECT chapter_name,chapter_sk,subject_name, CAST(split_part(chapter_name, '-', 1) as INT) chatper_num  from dim_topic 
                WHERE stage_name = ''' + "\'"+school  + "\'"+'''  and subject_name = ''' + "\'"+ subject +"\'" + ''' and chapter_name IS NOT NULL 
                ORDER BY chatper_num ASC
              '''
    # cur2 = conn.cursor()
    # #cur2.execute("SELECT DISTINCT chapter_name from dw_dev.dim_topic WHERE stage_name = '初中' and subject_name = '数学'AND publisher_name = '人教版' order by chapter_name ASC")
    # cur2.execute(sql)
    # data_list = cur2.fetchall()
    # print('所有章节包括章节ID查询：',data_list)
    #conn.close()
    data_list = get_df(sql)
    return data_list

#根据学科查询视频列表
def subject_video_list(subject_id,stage_id,date_start,date_end):
    if stage_id == "小学":
        stage_id = '1'
    elif stage_id == "初中":
        stage_id = '2'
    elif stage_id == "高中":
        stage_id = '3'

    if subject_id == "数学":
        subject_id = '1'
    elif subject_id == "物理":
        subject_id = '2'

    if stage_id == 0:
        stage_id = ''
    if subject_id == 0:
        subject_id = ''

    if subject_id == "" and stage_id == "":
        sql = '''
                SELECT video_sk,video_name,section_name,subsection_name,
                sum(video_cnt) GK_cishu,sum(careful_video_cnt) RZ_cishu,sum(ex_cnt) ZX_cishu,sum(ex_fin_cnt) WC_cishu,sum(finish_video_cnt) FS_cishu,is_charge_video, CONCAT(min(day),'-', max(day)) as day
                from videology_main_list
                WHERE day BETWEEN '''+date_start+''' and '''+date_end+'''
                GROUP BY video_sk,video_name,section_name,subsection_name,subject_id,stage_id,chapter_sk,is_charge_video
                order by subject_id,stage_id,section_name,subsection_name
        
              '''
    elif subject_id != "" and stage_id == "":
        sql = '''
                SELECT video_sk,video_name,section_name,subsection_name,
                sum(video_cnt) GK_cishu,sum(careful_video_cnt) RZ_cishu,sum(ex_cnt) ZX_cishu,sum(ex_fin_cnt) WC_cishu,sum(finish_video_cnt) FS_cishu,is_charge_video, CONCAT(min(day),'-', max(day)) as day
                from videology_main_list
                WHERE day BETWEEN '''+date_start+''' and '''+date_end+''' and subject_id = '''+subject_id+'''
                GROUP BY video_sk,video_name,section_name,subsection_name,subject_id,stage_id,chapter_sk,is_charge_video
                order by subject_id,stage_id,section_name,subsection_name
              '''
    elif subject_id == "" and stage_id != "":
        sql = '''
                SELECT video_sk,video_name,section_name,subsection_name,
                sum(video_cnt) GK_cishu,sum(careful_video_cnt) RZ_cishu,sum(ex_cnt) ZX_cishu,sum(ex_fin_cnt) WC_cishu,sum(finish_video_cnt) FS_cishu,is_charge_video, CONCAT(min(day),'-', max(day)) as day
                from videology_main_list
                WHERE day BETWEEN '''+date_start+''' and '''+date_end+''' and stage_id = '''+stage_id+'''
                GROUP BY video_sk,video_name,section_name,subsection_name,subject_id,stage_id,chapter_sk,is_charge_video
                order by subject_id,stage_id,section_name,subsection_name
              '''
    else:
        sql = '''
                SELECT video_sk,video_name,section_name,subsection_name,
                sum(video_cnt) GK_cishu,sum(careful_video_cnt) RZ_cishu,sum(ex_cnt) ZX_cishu,sum(ex_fin_cnt) WC_cishu,sum(finish_video_cnt) FS_cishu,is_charge_video, CONCAT(min(day),'-', max(day)) as day
                from videology_main_list
                WHERE day BETWEEN '''+date_start+''' and '''+date_end+''' and subject_id = '''+subject_id+''' and stage_id = '''+stage_id+'''
                GROUP BY video_sk,video_name,section_name,subsection_name,subject_id,stage_id,chapter_sk,is_charge_video
                order by subject_id,stage_id,section_name,subsection_name

              '''
    # cur2 = conn.cursor()
    # # cur2.execute("SELECT DISTINCT chapter_name from dw_dev.dim_topic WHERE stage_name = '初中' and subject_name = '数学'AND publisher_name = '人教版' order by chapter_name ASC")
    # cur2.execute(sql)
    # data_list = cur2.fetchall()
    # print('根据学科查询视频列表：数据库返回', data_list)
    data_list = get_df(sql)
    return data_list

#根据学段查询视频列表
def stage_video_list(stage_id,subject_id,date_start, date_end):
    if stage_id == "小学":
        stage_id = '1'
    elif stage_id == "初中":
        stage_id = '2'
    elif stage_id == "高中":
        stage_id = '3'

    if subject_id == "数学":
        subject_id = '1'
    elif subject_id == "物理":
        subject_id = '2'

    if stage_id == 0:
        stage_id = ''
    if subject_id == 0:
        subject_id = ''

    if stage_id == "" and subject_id == "":
        sql = '''
                SELECT video_sk,video_name,section_name,subsection_name,
                sum(video_cnt) GK_cishu,sum(careful_video_cnt) RZ_cishu,sum(ex_cnt) ZX_cishu,sum(ex_fin_cnt) WC_cishu,sum(finish_video_cnt) FS_cishu,is_charge_video, CONCAT(min(day),'-', max(day)) as day
                from videology_main_list
                WHERE day BETWEEN '''+date_start+''' and '''+date_end+'''
                GROUP BY video_sk,video_name,section_name,subsection_name,subject_id,stage_id,chapter_sk,is_charge_video
                order by subject_id,stage_id,section_name,subsection_name
              '''
    elif stage_id != "" and subject_id == "":
        sql = '''
                SELECT video_sk,video_name,section_name,subsection_name,
                sum(video_cnt) GK_cishu,sum(careful_video_cnt) RZ_cishu,sum(ex_cnt) ZX_cishu,sum(ex_fin_cnt) WC_cishu,sum(finish_video_cnt) FS_cishu,is_charge_video, CONCAT(min(day),'-', max(day)) as day
                from videology_main_list
                WHERE day BETWEEN ''' + date_start + ''' and ''' + date_end + ''' and stage_id = ''' + stage_id + '''
                GROUP BY video_sk,video_name,section_name,subsection_name,subject_id,stage_id,chapter_sk,is_charge_video
                order by subject_id,stage_id,section_name,subsection_name
              '''
    elif stage_id == "" and subject_id != "":
        sql = '''
                 SELECT video_sk,video_name,section_name,subsection_name,
                 sum(video_cnt) GK_cishu,sum(careful_video_cnt) RZ_cishu,sum(ex_cnt) ZX_cishu,sum(ex_fin_cnt) WC_cishu,sum(finish_video_cnt) FS_cishu,is_charge_video, CONCAT(min(day),'-', max(day)) as day
                 from videology_main_list
                 WHERE day BETWEEN ''' + date_start + ''' and ''' + date_end + ''' and subject_id = ''' + subject_id + '''
                 GROUP BY video_sk,video_name,section_name,subsection_name,subject_id,stage_id,chapter_sk,is_charge_video
                 order by subject_id,stage_id,section_name,subsection_name
               '''
    else:
        sql = '''
                SELECT video_sk,video_name,section_name,subsection_name,
                sum(video_cnt) GK_cishu,sum(careful_video_cnt) RZ_cishu,sum(ex_cnt) ZX_cishu,sum(ex_fin_cnt) WC_cishu,sum(finish_video_cnt) FS_cishu,is_charge_video, CONCAT(min(day),'-', max(day)) as day
                from videology_main_list
                WHERE day BETWEEN '''+date_start+''' and '''+date_end+''' and stage_id = '''+stage_id+''' and subject_id = ''' + subject_id + '''
                GROUP BY video_sk,video_name,section_name,subsection_name,subject_id,stage_id,chapter_sk,is_charge_video
                order by subject_id,stage_id,section_name,subsection_name
              '''
    # cur2 = conn.cursor()
    # # cur2.execute("SELECT DISTINCT chapter_name from dw_dev.dim_topic WHERE stage_name = '初中' and subject_name = '数学'AND publisher_name = '人教版' order by chapter_name ASC")
    # cur2.execute(sql)
    # data_list = cur2.fetchall()
    # print('根据学段查询视频列表：', data_list)
    data_list = get_df(sql)
    return data_list


#查询相关章节视频列表
def chapter_video_list(chapter_code,date_start,date_end):
    #查询章节代号为空的情况
    if chapter_code == "":
        #print('查询章节代号为空的情况')
        sql = '''
                SELECT video_sk,video_name,section_name,subsection_name,
                sum(video_cnt) GK_cishu,sum(careful_video_cnt) RZ_cishu,sum(ex_cnt) ZX_cishu,sum(ex_fin_cnt) WC_cishu,sum(finish_video_cnt) FS_cishu,is_charge_video,CONCAT(min(day),'-', max(day)) as day
                from videology_main_list
                WHERE day BETWEEN '''+date_start+''' and '''+date_end+'''
                GROUP BY video_sk,video_name,section_name,subsection_name,subject_id,stage_id,chapter_sk,is_charge_video
                order by subject_id,stage_id,section_name,subsection_name
             '''

    else:
        # 查询章节代号不为空的情况
      #print('查询章节代号不为空的情况')
      sql = '''
                SELECT video_sk,video_name,section_name,subsection_name,
                sum(video_cnt) GK_cishu,sum(careful_video_cnt) RZ_cishu,sum(ex_cnt) ZX_cishu,sum(ex_fin_cnt) WC_cishu,sum(finish_video_cnt) FS_cishu,is_charge_video,CONCAT(min(day),'-', max(day)) as day
                from videology_main_list
                WHERE day BETWEEN '''+date_start+''' and '''+date_end+''' and chapter_sk = '''+chapter_code+'''
                GROUP BY video_sk,video_name,section_name,subsection_name,subject_id,stage_id,chapter_sk,is_charge_video
                order by subject_id,stage_id,section_name,subsection_name
            '''
    # cur = conn.cursor()
    # # cur2.execute("SELECT DISTINCT chapter_name from dw_dev.dim_topic WHERE stage_name = '初中' and subject_name = '数学'AND publisher_name = '人教版' order by chapter_name ASC")
    # cur.execute(sql)
    # data_list = cur.fetchall()
    # print('章节对应章节列表：', data_list)
    data_list = get_df(sql)
    return data_list


#查询专项进入人数
def execise(school,subject,chapter):
    # 查询学段，学科，章节都为全部的情况
    if school == "" and subject == "" and chapter == "":
        sql = '''
                select subsection_name,t4.name,count(t2.user_sk) ZX_cishu,count(if(t2.is_finish= true,t2.user_sk,null))TG_cishu
                from(SELECT t1.*, t2.topic_id
                from dw_dev.dim_topic t1
                INNER JOIN dw_dev.change_topic_id t2
                ON t1.topic_sk = t2.topic_sk
                where publisher_name= '人教版') t1
                
                inner join (select exercise_id ,test_id,user_sk,is_finish from dw_dev.fact_user_exercise 
                where exercise_type = '专项练习' and day BETWEEN 20180501 AND 20180507 )t2
                on t1.topic_id = t2.test_id
                
                INNER JOIN dw_dev.bridge_video_topic t3
                on t1.topic_sk=t3.topic_sk
                
                inner join dw_dev.dim_video t4
                on t3.video_sk = t4.video_sk
                
                --inner join (SELECT video_sk,user_sk from dw_dev.fact_user_watch_video
                --WHERE video_type_level1 = 'course' AND day BETWEEN 20180501 AND 20180507) t4
                --on t3.video_sk = t4.video_sk
                
                group by subsection_name,t4.name
                order by subsection_name
              '''
    # 查询学段为全部，学科，章节选定的情况
    elif school == "" and subject != "" and chapter != "":
        #print('查询学段为全部，学科，章节选定的情况')
        sql = '''
                select subsection_name,t4.name,count(t2.user_sk) ZX_cishu,count(if(t2.is_finish= true,t2.user_sk,null))TG_cishu
                from(SELECT t1.*, t2.topic_id
                from dw_dev.dim_topic t1
                INNER JOIN dw_dev.change_topic_id t2
                ON t1.topic_sk = t2.topic_sk
                where publisher_name= '人教版' and chapter_name = ''' + '\"' + chapter + '\"' + '''and subject_name = ''' + '\"' + subject + '\"' + ''') t1
                
                inner join (select exercise_id ,test_id,user_sk,is_finish from dw_dev.fact_user_exercise 
                where exercise_type = '专项练习' and day BETWEEN 20180501 AND 20180507 )t2
                on t1.topic_id = t2.test_id
                
                INNER JOIN dw_dev.bridge_video_topic t3
                on t1.topic_sk=t3.topic_sk
                
                inner join dw_dev.dim_video t4
                on t3.video_sk = t4.video_sk
                
                --inner join (SELECT video_sk,user_sk from dw_dev.fact_user_watch_video
                --WHERE video_type_level1 = 'course' AND day BETWEEN 20180501 AND 20180507) t4
                --on t3.video_sk = t4.video_sk
                
                group by subsection_name,t4.name
                order by subsection_name
              '''
    # 查询学段，学科为全部，章节选定的情况
    elif school != "" and subject == "" and chapter != "":
        #print('查询学段，学科为全部，章节选定的情况')
        sql = '''
                select subsection_name,t4.name,count(t2.user_sk) ZX_cishu,count(if(t2.is_finish= true,t2.user_sk,null))TG_cishu
                from(SELECT t1.*, t2.topic_id
                from dw_dev.dim_topic t1
                INNER JOIN dw_dev.change_topic_id t2
                ON t1.topic_sk = t2.topic_sk
                where publisher_name= '人教版' and stage_name = ''' + '\"' + school + '\"' + ''' and chapter_name = ''' + '\"' + chapter + '\"' + ''') t1
                
                inner join (select exercise_id ,test_id,user_sk,is_finish from dw_dev.fact_user_exercise 
                where exercise_type = '专项练习' and day BETWEEN 20180501 AND 20180507 )t2
                on t1.topic_id = t2.test_id
                
                INNER JOIN dw_dev.bridge_video_topic t3
                on t1.topic_sk=t3.topic_sk
                
                inner join dw_dev.dim_video t4
                on t3.video_sk = t4.video_sk
                
                --inner join (SELECT video_sk,user_sk from dw_dev.fact_user_watch_video
                --WHERE video_type_level1 = 'course' AND day BETWEEN 20180501 AND 20180507) t4
                --on t3.video_sk = t4.video_sk
                
                group by subsection_name,t4.name
                order by subsection_name
              '''
    # 查询学段选定的情况，学科选定的情况，章节为全部的情况
    elif school != "" and subject != "" and chapter == "":
        #print('查询学段选定的情况，学科选定的情况，章节为全部的情况')
        sql = '''
                select subsection_name,t4.name,count(t2.user_sk) ZX_cishu,count(if(t2.is_finish= true,t2.user_sk,null))TG_cishu
                from(SELECT t1.*, t2.topic_id
                from dw_dev.dim_topic t1
                INNER JOIN dw_dev.change_topic_id t2
                ON t1.topic_sk = t2.topic_sk
                where publisher_name= '人教版' and  stage_name = ''' + '\"' + school + '\"' + ''' and subject_name = ''' + '\"' + subject + '\"' + ''') t1
                
                inner join (select exercise_id ,test_id,user_sk,is_finish from dw_dev.fact_user_exercise 
                where exercise_type = '专项练习' and day BETWEEN 20180501 AND 20180507 )t2
                on t1.topic_id = t2.test_id
                
                INNER JOIN dw_dev.bridge_video_topic t3
                on t1.topic_sk=t3.topic_sk
                
                inner join dw_dev.dim_video t4
                on t3.video_sk = t4.video_sk
                
                --inner join (SELECT video_sk,user_sk from dw_dev.fact_user_watch_video
                --WHERE video_type_level1 = 'course' AND day BETWEEN 20180501 AND 20180507) t4
                --on t3.video_sk = t4.video_sk
                
                group by subsection_name,t4.name
                order by subsection_name
              '''
    elif school == "" and subject == "" and chapter != "":
        sql = '''
                select subsection_name,t4.name,count(t2.user_sk) ZX_cishu,count(if(t2.is_finish= true,t2.user_sk,null))TG_cishu
                from(SELECT t1.*, t2.topic_id
                from dw_dev.dim_topic t1
                INNER JOIN dw_dev.change_topic_id t2
                ON t1.topic_sk = t2.topic_sk
                where publisher_name= '人教版'  and chapter_name = ''' + '\"' + chapter + '\"' + ''') t1
                
                inner join (select exercise_id ,test_id,user_sk,is_finish from dw_dev.fact_user_exercise 
                where exercise_type = '专项练习' and day BETWEEN 20180501 AND 20180507 )t2
                on t1.topic_id = t2.test_id
                
                INNER JOIN dw_dev.bridge_video_topic t3
                on t1.topic_sk=t3.topic_sk
                
                inner join dw_dev.dim_video t4
                on t3.video_sk = t4.video_sk
                
                --inner join (SELECT video_sk,user_sk from dw_dev.fact_user_watch_video
                --WHERE video_type_level1 = 'course' AND day BETWEEN 20180501 AND 20180507) t4
                --on t3.video_sk = t4.video_sk
                
                group by subsection_name,t4.name
                order by subsection_name
              '''
    else:
       # print('都为选定的情况')
        sql = '''
                select subsection_name,t4.name,count(t2.user_sk) ZX_cishu,count(if(t2.is_finish= true,t2.user_sk,null))TG_cishu
                from(SELECT t1.*, t2.topic_id
                from dw_dev.dim_topic t1
                INNER JOIN dw_dev.change_topic_id t2
                ON t1.topic_sk = t2.topic_sk
                where publisher_name= '人教版' and stage_name = ''' + '\"' + school + '\"' + ''' and chapter_name = ''' + '\"' + chapter + '\"' + '''and subject_name = ''' + '\"' + subject + '\"' + ''') t1
                
                inner join (select exercise_id ,test_id,user_sk,is_finish from dw_dev.fact_user_exercise 
                where exercise_type = '专项练习' and day BETWEEN 20180501 AND 20180507 )t2
                on t1.topic_id = t2.test_id
                
                INNER JOIN dw_dev.bridge_video_topic t3
                on t1.topic_sk=t3.topic_sk
                
                inner join dw_dev.dim_video t4
                on t3.video_sk = t4.video_sk
                
                --inner join (SELECT video_sk,user_sk from dw_dev.fact_user_watch_video
                --WHERE video_type_level1 = 'course' AND day BETWEEN 20180501 AND 20180507) t4
                --on t3.video_sk = t4.video_sk
                
                group by subsection_name,t4.name
                order by subsection_name
              '''

    # cur = conn.cursor()
    # # cur2.execute("SELECT DISTINCT chapter_name from dw_dev.dim_topic WHERE stage_name = '初中' and subject_name = '数学'AND publisher_name = '人教版' order by chapter_name ASC")
    # cur.execute(sql)
    # data_list = cur.fetchall()
    # print('专项数据列表为：',data_list)
    data_list = get_df(sql)
    return data_list


#查询单个视频的观看次数---10%
def getPercentTenData(date_start,date_end,code):
    #print('查询单个视频按10%观看视频比例....')
    sql = '''
           select watch_ten_percent,sum(watch_cnt) from videology_watch_video_list where video_sk = '''+code+''' and day BETWEEN '''+date_start+''' and '''+date_end+'''
           GROUP BY watch_ten_percent
          '''
    # cur = conn.cursor()
    # # cur2.execute("SELECT DISTINCT chapter_name from dw_dev.dim_topic WHERE stage_name = '初中' and subject_name = '数学'AND publisher_name = '人教版' order by chapter_name ASC")
    # cur.execute(sql)
    # data_list = cur.fetchall()
    # print('观看时长为10%或者1%的数据为：',data_list)
    data_list = get_df(sql)
    return data_list


#查询单个视频的观看次数---1%
def getPercentOneData(code,date_start,date_end,groupCode):
    #print('查询单个视频按1%观看视频比例....')
    sql = '''
           select watch_one_percent,sum(watch_cnt) from videology_watch_video_list where video_sk = '''+code+''' and day BETWEEN '''+date_start+''' and '''+date_end+'''
           and watch_ten_percent = '''+groupCode+''' GROUP BY watch_one_percent
          '''
    # cur = conn.cursor()
    # # cur2.execute("SELECT DISTINCT chapter_name from dw_dev.dim_topic WHERE stage_name = '初中' and subject_name = '数学'AND publisher_name = '人教版' order by chapter_name ASC")
    # cur.execute(sql)
    # data_list = cur.fetchall()
    # print('观看时长为1%的数据为：',data_list)
    data_list = get_df(sql)
    return data_list


#查询单个视频按30退出的次数 ----总次数--x轴
def getThirtyExitData(code,dateStart,dateEnd):
    #print('查询单个视频按30s退出的次数....')
    sql = '''
            select exit_thirty_period,sum(exit_cnt) from videology_video_exit_list where video_sk = '''+code+''' and day BETWEEN '''+dateStart+''' and '''+dateEnd+'''
            GROUP BY exit_thirty_period
          '''
    # cur = conn.cursor()
    # # cur2.execute("SELECT DISTINCT chapter_name from dw_dev.dim_topic WHERE stage_name = '初中' and subject_name = '数学'AND publisher_name = '人教版' order by chapter_name ASC")
    # cur.execute(sql)
    # data_list = cur.fetchall()
    data_list = get_df(sql)
    return data_list

#查询单个视频按30退出的总次数 ---30s退出的总次数
def getThirtyExitAllCount(code,dateStart,dateEnd):
   # print('30s退出的总次数....')
    sql = '''
            select sum(exit_cnt) from videology_video_exit_list where video_sk = '''+code+''' and day BETWEEN '''+dateStart+''' and '''+dateEnd+'''

          '''
    # cur = conn.cursor()
    # # cur2.execute("SELECT DISTINCT chapter_name from dw_dev.dim_topic WHERE stage_name = '初中' and subject_name = '数学'AND publisher_name = '人教版' order by chapter_name ASC")
    # cur.execute(sql)
    # data_list = cur.fetchall()
    data_list = get_df(sql)
    return data_list




#查询单个视频按3退出的次数 ---单个3s退出的次数
def getThreeExitAllCount(code,dateStart,dateEnd,groupCode):
    #print('查询单个视频按3s退出的次数....')
    sql = '''
           select exit_three_period,sum(exit_cnt) from videology_video_exit_list where video_sk = '''+code+''' and day BETWEEN '''+dateStart+''' and '''+dateEnd+'''
           and exit_thirty_period = '''+groupCode+''' and exit_three_period >= 3 GROUP BY exit_three_period
          '''
    # cur = conn.cursor()
    # # cur2.execute("SELECT DISTINCT chapter_name from dw_dev.dim_topic WHERE stage_name = '初中' and subject_name = '数学'AND publisher_name = '人教版' order by chapter_name ASC")
    # cur.execute(sql)
    # data_list = cur.fetchall()
    data_list = get_df(sql)
    return data_list


#查询小于前9s的数据
def lessThanThree(code,dateStart,dateEnd):
    sql = '''
           select exit_three_period,sum(exit_cnt) from videology_video_exit_list where video_sk = '''+code+''' and day BETWEEN '''+dateStart+''' and '''+dateEnd+'''
           and exit_thirty_period = 0 and exit_three_period < 3 GROUP BY exit_three_period
            
          '''
    # cur = conn.cursor()
    # # cur2.execute("SELECT DISTINCT chapter_name from dw_dev.dim_topic WHERE stage_name = '初中' and subject_name = '数学'AND publisher_name = '人教版' order by chapter_name ASC")
    # cur.execute(sql)
    # data_list = cur.fetchall()
    data_list = get_df(sql)
    return data_list


#暂停数据
def videoPause(dateStart,dateEnd,code):
    sql = '''
            SELECT pause_three_period, pause_thirty_period,sum(pause_cnt) FROM videology_video_pause_list 
            WHERE day BETWEEN '''+dateStart+''' AND '''+dateEnd+''' and video_sk = '''+code+'''
            GROUP BY pause_three_period,video_sk,pause_thirty_period
          '''
    # cur = conn.cursor()
    # # cur2.execute("SELECT DISTINCT chapter_name from dw_dev.dim_topic WHERE stage_name = '初中' and subject_name = '数学'AND publisher_name = '人教版' order by chapter_name ASC")
    # cur.execute(sql)
    # data_list = cur.fetchall()
    data_list = get_df(sql)
    return data_list


#根据学段查询章节列表---中间表格
def charpterMiddleList(stdId,subId,dateStart,dateEnd):
    # if stdId == "小学":
    #     school = '1'
    # elif stdId == "初中":
    #     school = '2'
    # elif stdId == "高中":
    #     school = '3'

    if stdId == "小学":
        stdId = '1'
    elif stdId == "初中":
        stdId = '2'
    elif stdId == "高中":
        stdId = '3'

    if subId == "数学":
        subId = '1'
    elif subId == "物理":
        subId = '2'

    if stdId == 0:
        stdId = ''
    if subId == 0:
        subId = ''

    if stdId == "" and subId == "":
        sql = '''
                SELECT chapter_name,sum(video_cnt) GK_cishu,sum(careful_video_cnt) RZ_cishu,sum(finish_video_cnt) FN_cishu,sum(ex_cnt) ZX_cishu,sum(ex_fin_cnt) TG_cishu,CAST(split_part(chapter_name, '-', 1) as INT) chatper_num, CONCAT(min(day),'-', max(day)) as day
                FROM videology_main_list 
                WHERE day BETWEEN '''+dateStart+''' AND '''+dateEnd+''' 
                GROUP BY chapter_name,stage_id,subject_id
                ORDER BY subject_id,chatper_num ASC
              '''
    elif subId == "" and stdId != "":
        sql = '''
                SELECT chapter_name,sum(video_cnt) GK_cishu,sum(careful_video_cnt) RZ_cishu,sum(finish_video_cnt) FN_cishu,sum(ex_cnt) ZX_cishu,sum(ex_fin_cnt) TG_cishu,CAST(split_part(chapter_name, '-', 1) as INT) chatper_num, CONCAT(min(day),'-', max(day)) as day
                FROM videology_main_list 
                WHERE stage_id = '''+stdId+''' AND day BETWEEN '''+dateStart+''' AND '''+dateEnd+''' 
                GROUP BY chapter_name,stage_id,subject_id
                ORDER BY subject_id,chatper_num ASC
              '''
    elif subId != "" and stdId == "":
        sql = '''
                SELECT chapter_name,sum(video_cnt) GK_cishu,sum(careful_video_cnt) RZ_cishu,sum(finish_video_cnt) FN_cishu,sum(ex_cnt) ZX_cishu,sum(ex_fin_cnt) TG_cishu,CAST(split_part(chapter_name, '-', 1) as INT) chatper_num, CONCAT(min(day),'-', max(day)) as day
                FROM videology_main_list 
                WHERE subject_id = '''+subId+''' AND day BETWEEN '''+dateStart+''' AND '''+dateEnd+''' 
                GROUP BY chapter_name,stage_id,subject_id
                ORDER BY subject_id,chatper_num ASC
              '''
    else:
        sql = '''
                SELECT chapter_name,sum(video_cnt) GK_cishu,sum(careful_video_cnt) RZ_cishu,sum(finish_video_cnt) FN_cishu,sum(ex_cnt) ZX_cishu,sum(ex_fin_cnt) TG_cishu,CAST(split_part(chapter_name, '-', 1) as INT) chatper_num, CONCAT(min(day),'-', max(day)) as day
                FROM videology_main_list 
                WHERE stage_id = '''+stdId+''' and subject_id = '''+subId+''' AND day BETWEEN '''+dateStart+''' AND '''+dateEnd+''' 
                GROUP BY chapter_name,stage_id,subject_id
                ORDER BY subject_id,chatper_num ASC
              '''
    # cur = conn.cursor()
    # # cur2.execute("SELECT DISTINCT chapter_name from dw_dev.dim_topic WHERE stage_name = '初中' and subject_name = '数学'AND publisher_name = '人教版' order by chapter_name ASC")
    # cur.execute(sql)
    # data_list = cur.fetchall()
    data_list = get_df(sql)
    return data_list


#根据学科查询章节列表---中间表格
def charpterSubMiddleList(subId,dateStart,dateEnd):

    if subId == "":
        sql = '''
                SELECT chapter_name,sum(video_cnt) GK_cishu,sum(careful_video_cnt) RZ_cishu,sum(finish_video_cnt) FN_cishu,sum(ex_cnt) ZX_cishu,sum(ex_fin_cnt) TG_cishu,CAST(split_part(chapter_name, '-', 1) as INT) chatper_num
                FROM videology_main_list 
                WHERE day BETWEEN '''+dateStart+''' AND '''+dateEnd+''' 
                GROUP BY chapter_name,stage_id,subject_id
                ORDER BY subject_id,chatper_num ASC
              '''
    else:
        sql = '''
                SELECT chapter_name,sum(video_cnt) GK_cishu,sum(careful_video_cnt) RZ_cishu,sum(finish_video_cnt) FN_cishu,sum(ex_cnt) ZX_cishu,sum(ex_fin_cnt) TG_cishu,CAST(split_part(chapter_name, '-', 1) as INT) chatper_num
                FROM videology_main_list 
                WHERE subject_id = '''+subId+''' AND day BETWEEN '''+dateStart+''' AND '''+dateEnd+''' 
                GROUP BY chapter_name,stage_id,subject_id
                ORDER BY subject_id,chatper_num ASC
              '''
    # cur = conn.cursor()
    # # cur2.execute("SELECT DISTINCT chapter_name from dw_dev.dim_topic WHERE stage_name = '初中' and subject_name = '数学'AND publisher_name = '人教版' order by chapter_name ASC")
    # cur.execute(sql)
    # data_list = cur.fetchall()
    data_list = get_df(sql)
    return data_list



#交互题数据
def interactionData(sk,dateStart,dateEnd):
    sql = '''
            SELECT  interaction_id, interaction_answer, interaction_correct, 
            answer_cnt
            FROM videology_video_interaction_list
            where video_sk = '''+sk+''' and day between '''+dateStart+''' and '''+dateEnd+''' order by interaction_answer
          '''
    # cur = conn.cursor()
    # cur.execute(sql)
    # data_list = cur.fetchall()
    # print('交互题数据为：',data_list)
    data_list = get_df(sql)
    return data_list



#重构观看次数部分代码
def getVideoWatchData(date_start,date_end,code):
    sql = '''
              SELECT  watch_one_percent,watch_ten_percent,sum(watch_cnt) WH_cishu
              FROM public.videology_watch_video_list 
              where day between '''+date_start+''' and '''+date_end+''' and video_sk = '''+code+'''
              GROUP BY watch_one_percent,watch_ten_percent,video_sk; 
          '''
    # cur = conn.cursor()
    # cur.execute(sql)
    # data_list = cur.fetchall()
    data_list = get_df(sql)
    return data_list

#重构退出次数部分代码
def getExitAllData(code,dateStart,dateEnd):
    sql = '''
               select exit_three_period,exit_thirty_period,sum(exit_cnt) from videology_video_exit_list
               where day between '''+dateStart+''' and '''+dateEnd+''' and video_sk = '''+code+'''  and exit_three_period >= 2 
               GROUP BY exit_three_period,exit_thirty_period
          '''
    # cur = conn.cursor()
    # cur.execute(sql)
    # data_list = cur.fetchall()
    # print('查询到的退出数据为：',data_list)
    data_list = get_df(sql)
    return data_list
# finally:
#     conn.close();#关闭连接