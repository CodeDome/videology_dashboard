'''
  该模模块用于取数计算逻辑
'''
import csv
from flask import Flask,request
from flask_restful import reqparse, abort, Api, Resource
from flask_cors import CORS
#import operator
#from backup import data_list as ls
#from impala.dbapi import connect
#import pandas as pd
import json
import link_hive as lh
import math
import re


'''从hive库实时查询'''

#获取学科
'''
res = re.discipline()
res_list = []#学科列表
for item in range(len(res)):
    res_list.append(res[item][0])
'''
#获取所有章节（初中/高中/小学的全部科目）
def get_all_chapters():
    res = lh.get_all_chapter()
    chapters_len = len(res)
    chapters_list = []
    chapters_sk = []
    for i in range(chapters_len):
        chapters_list.append(res[i][0])
        chapters_sk.append(res[i][1])
    RESULT = {
        "chapter": chapters_list,
        "chapter_sk": chapters_sk
    }
    return RESULT


#获取人教版所有数章节数据
def get_middle_school_chapter(school,subject):
    res = lh.middle_school_mathematics(school,subject)
    chapter_len = len(res)
    chapter_list = []
    chapters_sk = []
    for i in range(chapter_len):
        chapter_list.append(res[i][0])
        chapters_sk.append(res[i][1])

    # res = get_middle_school_chapter('初中','数学')
    RESULT = {
        "chapter": chapter_list,
        "chapter_sk": chapters_sk
    }
    return RESULT

#根据学科获取视频列表
def get_subject_video_list(subject_id,stage_id,date_start,date_end):
    res = lh.subject_video_list(subject_id=subject_id,stage_id=stage_id,date_start=date_start,date_end=date_end)
   # print('根据学科获取视频列表:处理数据后返回',res)
    RESULT = {
        "subject_video_list": res
    }
    return RESULT

#根据学段获取视频列表
def get_stage_video_list(stage_id,subject_id,date_start, date_end):
    res = lh.stage_video_list(stage_id=stage_id,subject_id=subject_id,date_start=date_start, date_end=date_end)
    #print('根据学段获取视频列表:', res)
    RESULT = {
        "stage_video_list": res
    }
    return RESULT



#根据章节id获取视频列表
def get_video_list(chapter_code,date_start,date_end):
    res = lh.chapter_video_list(chapter_code=chapter_code, date_start=date_start, date_end=date_end)
   # print('返回的所有视频结果测试：',res)
    video_len = len(res)
    # r_len = len(res[0]) #单个视频表长度
    video_list = []
    for i in range(video_len):
        #video_list[i] = list(res[i]) #转化为字典类型
          video_list.append(list(res[i]))

    RESULT = {
        "video_list": video_list
    }
    return RESULT

#获取专项练习的数据
def get_execise_list(school,subject,chapter):

    res = lh.execise(school=school,subject=subject,chapter=chapter)
    execise_len = len(res)
    # r_len = len(res[0]) #单个视频表长度
    execise_list = []
    for i in range(execise_len):
        #video_list[i] = list(res[i]) #转化为字典类型
        execise_list.append(list(res[i]))

    RESULT = {
        "execise_list": execise_list
    }
    return RESULT

#单个视频的详情计算--观看占1%的比率---新版
def queryPercentOneResult(date_start,date_end,code,groupCode):
    res = lh.getPercentOneData(code, date_start, date_end, groupCode)
   # print('观看占1%的数据：', res)
    exit_time = []  # x轴退出时间列表
    exit_times = []  # y轴退出次数列表
    data_len = len(res)
    for i in range(data_len):
        exit_time.append(res[i][0])
        exit_times.append(res[i][1])

        # 计算3s总次数
    three_all_count = 0
    for ty in range(len(exit_times)):
        three_all_count += exit_times[ty]
    #print('观看占1%总次数 is：', three_all_count)

    RESULT = {
        "exit_time": exit_time,
        "exit_times": exit_times,
        "all_times": three_all_count
    }
    return RESULT


#单个视频的详情计算--观看占10%的比率---新版
def queryPercentTenResult(date_start,date_end,code):
    res = lh.getPercentTenData(date_start, date_end,code)
   # print('观看占10%的数据：', res)
    exit_time = []  # x轴退出时间列表
    exit_times = []  # y轴退出次数列表
    data_len = len(res)
    for i in range(data_len):
        exit_time.append(res[i][0])
        exit_times.append(res[i][1])

    exit_times = exit_times[0:11]
    # 获取最大值
    result_max = max(exit_time)
    #print('最大值', result_max)
    # 查找出没有数据的时间点然后补位

    g_index = 0
    x_list = []
    d_count = 0  # 用于对比参考变量
    d_counts = []  # 用于对比参考列表
    for group in range(int(result_max)):
        g_index += 1 * 0.1
        x_list.append(round(g_index,2))
        d_counts.append(group)

    #print('用于对比参考列表', d_counts)
    #print('x轴秒数', x_list)

    # 对比没有次数的时间段补0
    times_list_g = d_counts  # y轴次数列表

    for tim in range(len(times_list_g)):
        if times_list_g[tim] not in exit_time:
            times_list_g[tim] = -1
    #print('times_list_g is：', times_list_g)
    # 取y轴的次数

    for cs in range(len(times_list_g)):
        if times_list_g[cs] == -1:
            exit_times.insert(cs, 0)
    #print('exit_times is：', exit_times)

    y_times_list = exit_times

    # 计算30s总次数
    thirty_all_count = 0
    for ty in range(len(exit_times)):
        thirty_all_count += exit_times[ty]
    #print('总次数 is：', thirty_all_count)
    RESULT = {
        "exit_time": x_list,
        "exit_times": y_times_list,
        "all_times": thirty_all_count,
        "reference_list": d_counts
    }
    return RESULT




#单个视频的详情计算--观看占1%的比率---废弃
def queryPercentOne(date_start,date_end,code):
    res = lh.getData(date_start, date_end, code)
   # print('退出1%的数据：', res)
    exit_time = []  # 退出3s时间
    exit_times = []  # 退出次数
    exit_time_x = []  # 标注全局x坐标值
    for i in range(len(res)):
        exit_time.append(res[i][0])
        exit_time_x.append(res[i][1])
        exit_times.append(res[i][2])

    # 获取到分组值
    results1 = []
    noRepeat1 = list(set(exit_time_x))
    for ne in range(len(noRepeat1)):
        index_1 = 0  # 用于累计次数

        for ne1 in range(len(exit_time_x)):
            if noRepeat1[ne] == exit_time_x[ne1]:
                index_1 += exit_times[ne1]

        results1.append(index_1)

    result_max1 = max(noRepeat1)

    g_index1 = 0
    x_list1 = []  # 获取到30s横坐标的列表
    for group1 in range(int(result_max1)):
        g_index1 += 1
        x_list1.append(g_index1)
    #print('list1 is:',x_list1)
    # 过滤重复出现的时间点
    results = []
    noRepeat = list(set(exit_time))
    for n in range(len(noRepeat)):
        index = 0  # 用于累计次数

        for n1 in range(len(exit_time)):
            if noRepeat[n] == exit_time[n1]:
                index += exit_times[n1]

        results.append(index)

    # 获取最大值
    result_max = max(noRepeat)

    # 按顺序分组
    g_index = 0
    x_list = []
    d_count = 0  # 用于对比参考变量
    d_counts = []  # 用于对比参考列表
    for group in range(int(result_max)):
        g_index = round(0.01*(group+1),3)
        d_count += 1
        x_list.append(g_index)
        d_counts.append(d_count)

    # 对比没有次数的时间段补0
    times_list_g = d_counts  # y轴次数列表

    for tim in range(len(times_list_g)):
        if times_list_g[tim] not in noRepeat:
            times_list_g[tim] = 0

    # 取y轴的次数
    y_times_list = []
    for cs in range(len(times_list_g)):
        if times_list_g[cs] == 0:
            results.insert(cs, 0)
    y_times_list = results
    y_times_list = y_times_list[0:len(y_times_list) - 1]

    # 截取分段
    f = 10
    group_x_list = [x_list[i:i + f] for i in range(0, len(x_list), f)]
    group_y_list = [y_times_list[i:i + f] for i in range(0, len(y_times_list), f)]
    group_x_list = group_x_list[0:len(group_x_list)]
    group_y_list = group_y_list[0:len(group_y_list)]

    # 构造对应字典
    x_g = {}
    y_g = {}
    # x_grop = [30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360, 390, 420, 450]
    x_grop = x_list1
    for k in range(len(x_grop)):
        x_g[x_grop[k]] = group_y_list[k]
        y_g[x_grop[k]] = group_x_list[k]
    # print(type(x_g))
   # print('转化为json对象：', json.dumps(x_g))
    RESULT = {
        "exit_time": y_g,
        "exit_times": x_g,
        "exit_all_times": exit_times
        # "exit_time": x_list,
        # "exit_times": y_times_list
    }
    return RESULT


#单个视频的详情计算--观看占10%的比率---废弃
def queryResult(date_start,date_end,code):
    res = lh.getData(date_start, date_end, code)
    #print('退出10%的数据：', res)
    exit_time = []  # 退出时间
    exit_times = []  # 退出次数
    for i in range(len(res)):
        exit_time.append(res[i][1])
        exit_times.append(res[i][2])

    # print('退出时间次数列表：',exit_times)

    # 过滤重复出现的时间点
    results = []
    noRepeat = list(set(exit_time))
    for n in range(len(noRepeat)):
        index = 0  # 用于累计次数

        for n1 in range(len(exit_time)):
            if noRepeat[n] == exit_time[n1]:
                index += exit_times[n1]

        results.append(index)

    # 获取最大值
    result_max = max(noRepeat)

    # 按顺序分组
    g_index = 0
    x_list = []
    d_count = 0  # 用于对比参考变量
    d_counts = []  # 用于对比参考列表
    for group in range(int(result_max)):
        g_index = round(0.1*(group+1),2)
        d_count += 1
        x_list.append(g_index)
        d_counts.append(d_count)

    # 对比没有次数的时间段补0
    times_list_g = d_counts  # y轴次数列表

    for tim in range(len(times_list_g)):
        if times_list_g[tim] not in noRepeat:
            times_list_g[tim] = 0

    # 取y轴的次数
    y_times_list = []
    for cs in range(len(times_list_g)):
        if times_list_g[cs] == 0:
            results.insert(cs, 0)
    y_times_list = results
    y_times_list = y_times_list[0:len(y_times_list) - 1]

    # 获取1%的数据 get_three_exit_list
    threeData = queryPercentOne(date_start, date_end, code)

    # 计算10%总次数
    thirty_all_count = 0
    for ty in range(len(exit_times)):
        thirty_all_count += exit_times[ty]

    RESULT = {
        "exit_time": x_list,
        "exit_times": y_times_list,
        "three_time_data": threeData,
        "exit_all_times": thirty_all_count
    }
    return RESULT




#退出30s的数据 ---新版
def get_thirty_exit_lists(code,dateStart,dateEnd):
    res = lh.getThirtyExitData(code, dateStart, dateEnd)
   # print('退出30s的数据：', res)
    lessThanTree = less_than_times(code,dateStart,dateEnd) #小于前9s的数据
   # print('小于前9s的数据：', lessThanTree)
    exit_time = [] #x轴退出时间列表
    exit_times = [] #y轴退出次数列表
    data_len = len(res)
    for i in range(data_len):
        exit_time.append(res[i][0])
        exit_times.append(res[i][1])
     # 获取最大值
    result_max = max(exit_time)
   # print('最大值', result_max)
    #查找出没有数据的时间点然后补位

    g_index = 0
    x_list = []
    d_count = 0  # 用于对比参考变量
    d_counts = []  # 用于对比参考列表
    for group in range(int(result_max)+1):
        g_index += 1 * 30
        x_list.append(g_index)
        d_counts.append(group)

    #print('用于对比参考列表',d_counts)
    #print('x轴秒数',x_list)

    # 对比没有次数的时间段补0
    times_list_g = d_counts  # y轴次数列表

    for tim in range(len(times_list_g)):
        if times_list_g[tim] not in exit_time:
            times_list_g[tim] = -1
    #print('times_list_g is：', times_list_g)
    # 取y轴的次数

    for cs in range(len(times_list_g)):
        if times_list_g[cs] == -1:
            exit_times.insert(cs, 0)
   # print('exit_times is：',exit_times)

    y_times_list = exit_times
    y_times_list[0] = y_times_list[0] - lessThanTree

    # 计算30s总次数
    thirty_all_count = 0
    for ty in range(len(exit_times)):
        thirty_all_count += exit_times[ty]
   # print('总次数 is：', thirty_all_count)
    RESULT = {
        "exit_time":x_list,
        "exit_times":y_times_list,
        "all_times":thirty_all_count,
        "reference_list":d_counts,
        "lessThanTree":lessThanTree
    }
    return RESULT

#退出3s的数据 ---新版
def get_three_exit_lists(code,dateStart,dateEnd,groupCode):
    res = lh.getThreeExitAllCount(code, dateStart, dateEnd, groupCode)
    #print('退出3s的数据：', res)
    exit_time = []  # x轴退出时间列表
    exit_times = []  # y轴退出次数列表
    data_len = len(res)
    for i in range(data_len):
        exit_time.append(res[i][0])
        exit_times.append(res[i][1])

        # 计算3s总次数
    three_all_count = 0
    for ty in range(len(exit_times)):
        three_all_count += exit_times[ty]
    #print('3s总次数 is：', three_all_count)

    RESULT = {
        "exit_time": exit_time,
        "exit_times": exit_times,
        "all_times": three_all_count
    }
    return RESULT


#小于3s的数据
def less_than_times(code,dateStart,dateEnd):
    res = lh.lessThanThree(code,dateStart,dateEnd)
    #print('小于9s的数据：', res)
    threeTimes = [] #存储小于9s的次数
    for i in range(len(res)):
        threeTimes.append(res[i][1])
    #求和
    sums = 0
    for sum in range(len(threeTimes)):
        sums += threeTimes[sum]
    #print('小于9s的数据的和：', sums)
    return sums



#获取3s退出的数据列表---废弃
def get_three_exit_list(code,dateStart,dateEnd):

    res = lh.getExitData(code, dateStart, dateEnd)
    #print('退出3s的数据：',res)
    exit_time = [] # 退出3s时间
    exit_times = []  # 退出次数
    exit_time_x = [] #标注全局x坐标值
    for i in range(len(res)):
        exit_time.append(res[i][0])
        exit_time_x.append(res[i][1])
        exit_times.append(res[i][2])

    #获取到分组值
    results1 = []
    noRepeat1 = list(set(exit_time_x))
    for ne in range(len(noRepeat1)):
        index_1 = 0  # 用于累计次数

        for ne1 in range(len(exit_time_x)):
            if noRepeat1[ne] == exit_time_x[ne1]:
                index_1 += exit_times[ne1]

        results1.append(index_1)

    result_max1 = max(noRepeat1)

    g_index1 = 0
    x_list1 = [] #获取到30s横坐标的列表
    for group1 in range(int(result_max1)):
        g_index1 += 1 * 30
        x_list1.append(g_index1)



    # 过滤重复出现的时间点
    results = []
    noRepeat = list(set(exit_time))
    for n in range(len(noRepeat)):
        index = 0  # 用于累计次数

        for n1 in range(len(exit_time)):
            if noRepeat[n] == exit_time[n1]:
                index += exit_times[n1]

        results.append(index)

    # 获取最大值
    result_max = max(noRepeat)

    # 按顺序分组
    g_index = 0
    x_list = []
    d_count = 0  # 用于对比参考变量
    d_counts = []  # 用于对比参考列表
    for group in range(int(result_max)):
        g_index += 1 * 3
        d_count += 1
        x_list.append(g_index)
        d_counts.append(d_count)

    # 对比没有次数的时间段补0
    times_list_g = d_counts  # y轴次数列表

    for tim in range(len(times_list_g)):
        if times_list_g[tim] not in noRepeat:
            times_list_g[tim] = 0

    # 取y轴的次数
    y_times_list = []
    for cs in range(len(times_list_g)):
        if times_list_g[cs] == 0:
            results.insert(cs, 0)
    y_times_list = results
    y_times_list = y_times_list[0:len(y_times_list) - 1]

    # 截取分段
    f = 10
    group_x_list = [x_list[i:i + f] for i in range(0, len(x_list), f)]
    group_y_list = [y_times_list[i:i + f] for i in range(0, len(y_times_list), f)]
    group_x_list = group_x_list[0:len(group_x_list)]
    group_y_list = group_y_list[0:len(group_y_list)]

    # 构造对应字典
    x_g = {}
    y_g = {}
    # x_grop = [30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360, 390, 420, 450]
    x_grop = x_list1
    for k in range(len(x_grop)):
        x_g[x_grop[k]] = group_y_list[k]
        y_g[x_grop[k]] = group_x_list[k]
    # print(type(x_g))
    #print('转化为json对象：', json.dumps(x_g))
    RESULT = {
        "exit_time": y_g,
        "exit_times": x_g,
        "exit_all_times":exit_times
        # "exit_time": x_list,
        # "exit_times": y_times_list
    }
    return RESULT

#获取30s退出的数据列表---废弃
def get_thirty_exit_list(code,dateStart,dateEnd):
    res = lh.getExitData(code, dateStart, dateEnd)
    #print('退出30s的数据：', res)
    exit_time = []  # 退出时间
    exit_times = []  # 退出次数
    for i in range(len(res)):
        exit_time.append(res[i][1])
        exit_times.append(res[i][2])


    # print('退出时间次数列表：',exit_times)


    #过滤重复出现的时间点
    results = []
    noRepeat = list(set(exit_time))
    for n in range(len(noRepeat)):
        index = 0  # 用于累计次数


        for n1 in range(len(exit_time)):
            if noRepeat[n] == exit_time[n1]:
                index += exit_times[n1]


        results.append(index)

     #获取最大值
    result_max = max(noRepeat)

    #按顺序分组
    g_index = 0
    x_list = []
    d_count = 0 #用于对比参考变量
    d_counts = [] #用于对比参考列表
    for group in range(int(result_max)):
        g_index+=1*30
        d_count+=1
        x_list.append(g_index)
        d_counts.append(d_count)



    #对比没有次数的时间段补0
    times_list_g = d_counts #y轴次数列表

    for tim in range(len(times_list_g)):
       if times_list_g[tim] not in noRepeat:
           times_list_g[tim] = 0

    #取y轴的次数
    y_times_list = []
    for cs in range(len(times_list_g)):
           if times_list_g[cs] == 0:
               results.insert(cs,0)
    y_times_list = results
    y_times_list = y_times_list[0:len(y_times_list)-1]

    #获取3s的数据 get_three_exit_list
    threeData = get_three_exit_list(code,dateStart,dateEnd)

    #计算30s总次数
    thirty_all_count = 0
    for ty in range(len(exit_times)):
        thirty_all_count += exit_times[ty]

    RESULT = {
        "exit_time": x_list,
        "exit_times": y_times_list,
        "three_time_data":threeData,
        "exit_all_times":thirty_all_count
    }
    return RESULT

#获取30s退出的数据列表(备用)
def get_exit_list(code,dateStart,dateEnd):
    res = lh.getExitData(code,dateStart,dateEnd)
   # print('30s退出的数据列表为：', res)
    small_chapter_name = res[0][1] #小节名
    video_all_len = res[0][2] #视频总长度
    exit_time = [] #退出时间
    exit_times = [] #退出次数
    #定义视屏的阈值
    max_r = video_all_len / 30
    max_temp = round(max_r,2)
    max_time = math.ceil(max_temp) #取到阈值

    for i in range(len(res)):
        if res[i][4] < 0 or res[i][4] > max_time:
            continue
        else:
            exit_time.append(res[i][4])
            exit_times.append(res[i][5])
    #print('exit_time is:',exit_time)
    #print('exit_times is:',exit_times)
    #获取与各时长段的次数
    every_times = []

    results = []
   # print([i for i, x in enumerate(exit_time) if x == '0'])
    for m in range(len(exit_time)-1):
        every_times.append([exit_time[m],exit_times[m]])
    #print('分段累加的次数为：',every_times)

    #过滤重复出现的时间点
    noRepeat = list(set(exit_time))
    for n in range(len(noRepeat)):
        index = 0  # 用于累计次数
        for n1 in range(len(exit_time)):
            if noRepeat[n] == exit_time[n1]:
                index += exit_times[n1]
        results.append(index)

   # print('results列表为：',results)



    RESULT = {
        "small_chapter_name": small_chapter_name,
        "exit_time":noRepeat,
        "exit_times":results
    }
    return RESULT


#暂停数据
def get_video_pause_thirty(dateStart,dateEnd,code):
    res = lh.videoPause(dateStart,dateEnd,code)
    pauseThirty = [] #暂停30是的数据列表
    pauseThree = [] #暂停3s的数据列表
    pauseThirtyCnt = [] #暂停30s观看次数

    #将数据存入数组
    for i in range(len(res)):
        pauseThree.append(res[i][0])
        pauseThirty.append(res[i][1])
        pauseThirtyCnt.append(res[i][2])

    #查找30s数据最大值，去重，排序后得到
    thirtyNoRepeat = list(set(pauseThirty)) #去重，排序
    thirtyMax = max(thirtyNoRepeat) #查找最大值

    #计算暂停30s的数
    thirtyResultCnt = [] #记录各个范围的次数结果
    for f in range(len(thirtyNoRepeat)):
        index = 0 #用于累计次数
        for j in range(len(pauseThirty)):
            if thirtyNoRepeat[f] == pauseThirty[j]:
                index += pauseThirtyCnt[j]
        thirtyResultCnt.append(index)

    #以最大值为准计算参考列表
    th_index = 0 #用于时间转换的索引
    x_list = [] #x轴数据（参考数据）
    th_count = 0 #用于对比的参考变量
    th_counts = [] #用于对比的参考列表
    #真实横坐标0表示30s
    for s in range(int(thirtyMax)+1):
        th_index += 30
        x_list.append(th_index)

    for m in range(int(thirtyMax)):
        # th_index+=30
        # x_list.append(th_index)
        th_counts.append(th_count)
        th_count += 1

    #对比没有次数的时间段补0
    y_cnt_list = th_counts #y轴对应次数列表
    for n in range(len(y_cnt_list)):
        if y_cnt_list[n] not in thirtyNoRepeat:
            y_cnt_list[n] = -1
    #print('横坐标数据为：', y_cnt_list)
    # 取y轴的次数
    y_cnt_lists = [] #y轴的次数列表
    for p in range(len(y_cnt_list)):
        if y_cnt_list[p] == -1:
            thirtyResultCnt.insert(p,0)

    y_times_list = thirtyResultCnt #将y轴次数结果集赋值给返回值变量

    #计算30s总次数
    thirty_all_count = 0
    for k in range(len(pauseThirtyCnt)):
        thirty_all_count += pauseThirtyCnt[k]
    #print('暂停30s总次数为：',thirty_all_count)
    threeResult = get_video_pause_three(dateStart,dateEnd,code)

    RESULT = {
        "pause_time": x_list,
        "pause_times": y_times_list,
        "all_times": thirty_all_count,
        "three_list": threeResult
    }
    return RESULT

#暂停3s的的数据
def get_video_pause_three(dateStart,dateEnd,code):
    res = lh.videoPause(dateStart,dateEnd,code)
    #pauseThirty = [] #暂停30是的数据列表
    pauseThree = [] #暂停3s的数据列表
   # pauseThirtyCnt = [] #暂停30s观看次数
    pauseThreeCnt = [] #暂停3s观看次数

    #将数据存入数组
    for i in range(len(res)):
        pauseThree.append(res[i][0])
       # pauseThirty.append(res[i][1])
       # pauseThirtyCnt.append(res[i][2])
        pauseThreeCnt.append(res[i][2])

    #查找3s数据最大值，去重，排序后得到
    threeNoRepeat = list(set(pauseThree)) #去重，排序
    threeMax = max(threeNoRepeat) #查找最大值

    #计算暂停30s的数
    threeResultCnt = [] #记录各个范围的次数结果
    for f in range(len(threeNoRepeat)):
        index = 0 #用于累计次数
        for j in range(len(pauseThree)):
            if threeNoRepeat[f] == pauseThree[j]:
                index += pauseThreeCnt[j]
        threeResultCnt.append(index)

    #以最大值为准计算参考列表
    th_index = 0 #用于时间转换的索引
    x_list = [] #x轴数据（参考数据）
    th_count = 0 #用于对比的参考变量
    th_counts = [] #用于对比的参考列表

    #补充子x轴坐标的值
    for m1 in range(int(threeMax)+6):
        th_index += 1 * 3
        x_list.append(th_index)

    for m in range(int(threeMax)):
        # th_index += 1 * 3
        #th_index = 3*m
        th_count += 1
        # x_list.append(th_index)
        th_counts.append(th_count)

    #对比没有次数的时间段补0
    y_cnt_list = th_counts #y轴对应次数列表
    for n in range(len(y_cnt_list)):
        if y_cnt_list[n] not in threeNoRepeat:
            y_cnt_list[n] = -1

    # 取y轴的次数
    y_cnt_lists = [] #y轴的次数列表
    for p in range(len(y_cnt_list)):
        if y_cnt_list[p] == -1:
            threeResultCnt.insert(p,0)

    y_times_list = threeResultCnt #将y轴次数结果集赋值给返回值变量

    #暂停3s不截取的数据
    all_pause_three_x = x_list
    all_pause_three_times_y = y_times_list

    #将暂停3s的截取分段
    all_len = 10
    group_x_list = [x_list[c:c + all_len] for c in range(0, len(x_list), all_len)]
    group_y_list = [y_times_list[v:v + all_len] for v in range(0, len(y_times_list), all_len)]

   # print('分段后的结果为：',group_y_list)
    RESULT = {
        "exit_time": group_x_list,
        "exit_times": group_y_list,
        "all_pause_three_x":all_pause_three_x,
        "all_pause_three_times_y":all_pause_three_times_y
    }
    return RESULT


#章节表格列表数据---根据学段查询
def get_chapter_table_list(stdId,subId,dateStart,dateEnd):
    res = lh.charpterMiddleList(stdId,subId,dateStart,dateEnd)
    chapterName = []#章节名
    watchCnt = [] #观看次数
    rzCnt = [] #认真观看次数
    rzRate = [] #认真观看率
    fnCnt = [] #完播次数
    fnRate = [] #完播率
    zxCnt = [] #专项次数
    tgCnt = [] #专项通过次数
    zxRate = [] #专项通过率
    day = []  #添加时间
    for i in range(len(res)):
        chapterName.append(res[i][0])
        watchCnt.append(res[i][1])
        rzCnt.append(res[i][2])
        fnCnt.append(res[i][3])
        zxCnt.append(res[i][4])
        tgCnt.append(res[i][5])
        day.append(res[i][7])
    #计算认真观看率/完播率/专项通过率
    for j in range(len(watchCnt)):
        # if watchCnt[j] == 0 or zxCnt[j] == 0:
        #     rzRes = 0
        #     fnRes = 0
        #     zxRes = 0
        # else:
        #     rzRes = round((int(rzCnt[j]) / int(watchCnt[j])),2)
        #     fnRes = round((int(fnCnt[j]) / int(watchCnt[j])), 2)
        #     zxRes = round((int(tgCnt[j]) / int(zxCnt[j])), 2)
        # rzRate.append(rzRes)
        # fnRate.append(fnRes)
        # zxRate.append(zxRes)
        if watchCnt[j] != 0:
            rzRes = round((int(rzCnt[j]) / int(watchCnt[j])), 2)
            fnRes = round((int(fnCnt[j]) / int(watchCnt[j])), 2)
            rzRate.append(rzRes)
            fnRate.append(fnRes)
        else:
            rzRate.append(0)
            fnRate.append(0)

        if zxCnt[j] != 0:
            zxRes = round((int(tgCnt[j]) / int(zxCnt[j])), 2)
            zxRate.append(zxRes)
        else:
            zxRate.append(0)


    RESULT = {
        "chapter_name": chapterName,
        "watch_cnt": watchCnt,
        "rz_cnt": rzCnt,
        "rz_rate": rzRate,
        "fn_rate": fnRate,
        "zx_cnt": zxCnt,
        "tg_cnt": tgCnt,
        "zx_rate": zxRate,
        "day":day
    }
    return RESULT

#章节表格列表数据---根据学科查询
def get_chapter_table_list_for_subject(subId,dateStart,dateEnd):
    res = lh.charpterSubMiddleList(subId,dateStart,dateEnd)
    chapterName = []#章节名
    watchCnt = [] #观看次数
    rzCnt = [] #认真观看次数
    rzRate = [] #认真观看率
    fnCnt = [] #完播次数
    fnRate = [] #完播率
    zxCnt = [] #专项次数
    tgCnt = [] #专项通过次数
    zxRate = [] #专项通过率
    for i in range(len(res)):
        chapterName.append(res[i][0])
        watchCnt.append(res[i][1])
        rzCnt.append(res[i][2])
        fnCnt.append(res[i][3])
        zxCnt.append(res[i][4])
        tgCnt.append(res[i][5])

    #计算认真观看率/完播率/专项通过率
    for j in range(len(watchCnt)):
        # if watchCnt[j] == 0 or zxCnt[j] == 0:
        #     rzRes = 0
        #     fnRes = 0
        #     zxRes = 0
        # else:
        if watchCnt[j] != 0:
           rzRes = round((int(rzCnt[j])/int(watchCnt[j])),2)
           fnRes = round((int(fnCnt[j]) / int(watchCnt[j])), 2)
           rzRate.append(rzRes)
           fnRate.append(fnRes)
        else:
            rzRate.append(0)
            fnRate.append(0)

        if zxCnt[j] != 0:
           zxRes = round((int(tgCnt[j]) / int(zxCnt[j])), 2)
           zxRate.append(zxRes)
        else:
            zxRate.append(0)


    RESULT = {
        "chapter_name": chapterName,
        "watch_cnt": watchCnt,
        "rz_cnt": rzCnt,
        "rz_rate": rzRate,
        "fn_rate": fnRate,
        "zx_cnt": zxCnt,
        "tg_cnt": tgCnt,
        "zx_rate": zxRate
    }
    return RESULT




#交互题数据表格
def get_interaction_table_list(sk,dateStart,dateEnd):
    res = lh.interactionData(sk,dateStart,dateEnd)

    print('交互数据为：',res)
    if len(res) > 0:
        interactiveId = [] #交互题id
        interactiveAnswer = [] #交互题答案啊
        interactiveCorrect = [] #交互题正确与否
        interactiveCnt = [] #交互次数

        for i in range(len(res)):
            interactiveId.append(res[i][0])
            interactiveAnswer.append(res[i][1])
            interactiveCorrect.append(res[i][2])
            interactiveCnt.append(res[i][3])

        #将交互题id去重找出题号
            interactiveIdNoRepeat = list(set(interactiveId))


        #确定题号
        t_num = 0
        t_num_all = [] #题号
        for j in range(len(interactiveIdNoRepeat)):
            t_num += 1
            t_num_all.append(t_num)

        #去重答案用作参考使用
        answerNoRepeat = list(set(interactiveAnswer))
        answerNoRepeat = (lambda x: (x.sort(), x)[1])(answerNoRepeat)
       # answerNoRepeat = list(set(interactiveAnswer))
        print('*******', answerNoRepeat)

        #确定相同题号对应的答案和次数
        all_cnt = [] #各答案次数
        all_marker = [] #各答案标记
        all_correct = [] #正确与否

        for m in range(len(interactiveIdNoRepeat)):
            all_cnt_sub = []
            all_marker_sub = []
            all_correct_sub = []
            for m1 in range(len(answerNoRepeat)):
                index_tmp1 = 0
                all_marker_sub_temp = []
                all_correct_temp = []
                for f in range(len(interactiveAnswer)):
                    if (interactiveIdNoRepeat[m] == interactiveId[f]) and (answerNoRepeat[m1] == interactiveAnswer[f]):
                        index_tmp1 += interactiveCnt[f]
                        all_marker_sub_temp.append(interactiveAnswer[f])
                        all_correct_temp.append(interactiveCorrect[f])

                all_cnt_sub.append(index_tmp1)
                all_marker_sub.append(all_marker_sub_temp)
                all_correct_sub.append(all_correct_temp)
            all_cnt.append(all_cnt_sub)
            all_marker.append(all_marker_sub)
            all_correct.append(all_correct_sub)

        # print('对应答案的次数为：', len(all_cnt))
        # print('对应答案的次数为：', all_cnt)
        # print('对应答案为：', len(all_marker))
        # print('对应答案为：', all_marker)
        # print('对应答案的标记为：',len(all_correct))
        # print('对应答案的标记为：',all_correct)
        # #
        # print('对应答案为111111111111：', all_marker[0])
        # print('对应答案为1111111111112：', all_marker[0][1])
        #将答案去重
        all_marker_no_repeat = []
        all_correct_no_repeat = []
        for n in range(len(all_marker)):
            all_marker_no_repeat_sub = []
            all_correct_no_repeat_sub = []
            for n1 in range(len(all_marker[n])):
                answerNoRepeatSub = list(set(all_marker[n][n1]))
                correctNoRepeatSub = list(set(all_correct[n][n1]))
                all_marker_no_repeat_sub.append(answerNoRepeatSub)
                all_correct_no_repeat_sub.append(correctNoRepeatSub)
            all_marker_no_repeat.append(all_marker_no_repeat_sub)
            all_correct_no_repeat.append(all_correct_no_repeat_sub)




        # print('对应答案为111111111111：', all_marker_no_repeat)
        # print('对应答案为222222222222：', all_correct_no_repeat)

        #处理为空的情况
        print('所以答案的数据为：',all_marker_no_repeat)
        print('所以答案的标记数据为：',all_correct_no_repeat)
        print('所以答案的次数数据为：',all_cnt)
        #去掉答案为空的列表[]
        all_marker_no_repeat_new = []
        all_correct_no_repeat_new = []
        all_cnt_new = []
        for gap in range(len(all_marker_no_repeat)):
            all_marker_no_repeat_new_sub = []
            all_correct_no_repeat_new_sub = []
            # all_cnt_new_sub = []
            for gap1 in range(len(all_marker_no_repeat[gap])):
                if len(all_marker_no_repeat[gap][gap1]) != 0:
                    all_marker_no_repeat_new_sub.append(all_marker_no_repeat[gap][gap1])
                    all_correct_no_repeat_new_sub.append(all_correct_no_repeat[gap][gap1])
                    # all_cnt_new_sub.append(all_cnt[gap][gap1])
            all_marker_no_repeat_new.append(all_marker_no_repeat_new_sub)
            all_correct_no_repeat_new.append(all_correct_no_repeat_new_sub)
            # all_cnt_new.append(all_cnt_new_sub)
        print('所以答案的数据为--new：', all_marker_no_repeat_new)
        print('所以标记的数据为--new：', all_correct_no_repeat_new)

        # 去掉次数为0的列表

        for os in range(len(all_cnt)):
            all_cnt_new_sub = []
            for os1 in range(len(all_cnt[os])):
                if all_cnt[os][os1] != 0:
                    all_cnt_new_sub.append(all_cnt[os][os1])

            all_cnt_new.append(all_cnt_new_sub)

        print('所以次数的数据为--new：', all_cnt_new)
        #将答案标记去重









        #------------暂时注释---start
        # if len(res) != 0:
        #     #print('交互数据为：',res)
        #     #遍历返回结果去除字符串两边括号并转化为列表--按天分组
        #     list_container = []
        #     for i in range(len(res)):
        #         t1 = res[i][0].replace('[', '')
        #         t2 = t1.replace(']', '')
        #         list_container.append(t2.split(','))
        #
        #     #去除空格
        #     list_container_new = []
        #     list_container_sub = []
        #     for j in range(len(list_container)):
        #        # list_container_sub = []
        #         for j1 in range(len(list_container[j])):
        #             trim = list_container[j][j1].strip()
        #             list_container_sub.append(trim)
        #        # list_container_new.append(list_container_sub)
        #
        #     #题号
        #     list_container_sub.sort(key=lambda x: x.split('_')[0])  # 将字符串按指定元素排序
        #     #print('所有题号：', list_container_sub)
        #
        #     #将题分类
        #
        #     t_num = [] #初始题号
        #     cnt_init = [] #初始次数
        #     anser_init = [] #初始答案
        #     marker_init = [] #初始标记
        #     for d in range(len(list_container_sub)):
        #         index = int(list_container_sub[d].split('_')[0])
        #         anserInit = list_container_sub[d].split('_')[1]
        #         markerInit = list_container_sub[d].split('_')[2]
        #         cntInit = int(list_container_sub[d].split('_')[3])
        #         anser_init.append(anserInit)
        #         cnt_init.append(cntInit)
        #         t_num.append(index)
        #         marker_init.append(markerInit)
        #
        #     # 获取题号
        #     title_num = list(set(t_num))
        #
        #     #获取答案
        #     anser_n =(lambda x:(x.sort(),x)[1])(list(set(anser_init)))
        #
        #     #获取次数
        #
        #     all_cnt = [] #各答案次数
        #     all_marker = [] #各答案标记
        #     for f in range(len(title_num)):
        #         all_cnt_sub = []
        #         all_marker_sub = []
        #         for f1 in range(len(anser_n)):
        #             index_tmp1 = 0
        #             all_marker_sub_temp = []
        #             for f2 in range(len(t_num)):
        #
        #                 if (title_num[f] == t_num[f2]) and (anser_n[f1] == anser_init[f2]):
        #
        #                    index_tmp1 += cnt_init[f2]
        #                    all_marker_sub_temp.append([marker_init[f2],anser_init[f2]])
        #             all_cnt_sub.append(index_tmp1)
        #             all_marker_sub.append(all_marker_sub_temp)
        #         all_cnt.append(all_cnt_sub)
        #         all_marker.append(all_marker_sub)
        #
        #     print('获取各答案的次数：', all_cnt)
        #     print('获取各答案标记的次数：', all_marker)
        #     # print('初始化题号：',res)
        #
        #     # ansers = "".join((lambda x:(x.sort(),x)[1])(list(set(anser_init))))
        #     # print('初始化答案：',list(ansers))
        #     #
        #     # # 获取题号
        #     # title_num = list(set(res))
        #     #
        #     # #获取次数
        #     # cnt_all = []
        #     # for t in range(len(title_num)):
        #     #     num_index = [] #题号组
        #     #     for t1 in range(len(res)):
        #     #         if title_num[t] == res[t1]:
        #     #            # for f in range(len(ansers)):
        #     #            index_cnt = 0
        #     #                 #for f1 in range(len(anser_init)):
        #     #            #if ansers[f] == anser_init[f1]:
        #     #            index_cnt += cnt_init[t1]
        #     #            num_index.append(index_cnt)
        #     #     cnt_all.append(cnt_all)
        #
        #    # print('对应答案的次数为：', num_index)
        #
        #
        #     # print('初始化标记：',marker_init)
        #     # print('初始化次数：',cnt_init)
        #
        #
        #
        #     #计算次数
        #
        #
        #     #查找答案
        #
        #
        #
        #     #
        #     # t_num = [] #题号
        #     # t_anser = [] #取答案
        #     # t_maker = [] #是否标红
        #     # t_cnt = [] #取次数
        #     # t_index = 0
        #     # for n in range(len(list_container_sub)):
        #     #     t_index = list_container_sub[n].split('_')
        #     #     t_num.append(int(t_index[0])) #取题号
        #     #     t_anser.append(t_index[1])
        #     #     t_maker.append(t_index[2])
        #     #     t_cnt.append(int(t_index[3]))
        #     #
        #     # noRepeat = list(set(t_num)) #得到去重后的题号
        #    # print('去重的题号：', noRepeat)
        # else:
        #     noRepeat = t_num = t_anser = t_maker = t_cnt = 0

        # ------------暂时注释---end
        #print('转化为列表：',list_container_new)


        #
        # if len(res) != 0:
        #     result = res[0][0]
        #     reResult = re.findall('\[(.*)\]', result)
        #     strRes = reResult[0].split(',')
        #     #s = re.findall('^0.*',strRes[i])
        #     trimStr = []
        #     for i in range(len(strRes)):
        #         trimSpace = strRes[i].strip()
        #         trimStr.append(trimSpace)
        #
        #     trimStr.sort(key=lambda x: x.split('_')[1]) #将字符串按指定元素排序
        #     #确定题号数量
        #    # print('有多少题：', trimStr)
        #     t_num = [] #题号
        #     t_anser = [] #取答案
        #     t_maker = [] #是否标红
        #     t_cnt = [] #取次数
        #     t_index = 0
        #     for n in range(len(trimStr)):
        #         t_index = trimStr[n].split('_')
        #         t_num.append(int(t_index[0])) #取题号
        #         t_anser.append(t_index[1])
        #         t_maker.append(t_index[2])
        #         t_cnt.append(int(t_index[3]))
        #
        #     noRepeat = list(set(t_num)) #得到去重后的题号
        #    # print('去重的题号：', noRepeat)
        # else:
        #     noRepeat = t_num = t_anser = t_maker = t_cnt = 0
        #



            #以题号开头的字符串分类
            # var = 0 #表示传入的题号
            # s1 = []
            # s2 = [] #分好类的题
            # for r in range(len(noRepeat)):
            #     for j in range(len(trimStr)):
            #         print('打印r的值：',r)
            #         s = re.search(r'^'+str(r)+'.*', trimStr[j])
            #         if s != None:
            #             s1.append(s.group())
            #         #    continue
            #         #s1.append(s)
            #     s2.append(s1)
            # print('分组后的列表：',s2)
        interactiveId = []  # 交互题id
        interactiveAnswer = []  # 交互题答案啊
        interactiveCorrect = []  # 交互题正确与否
        interactiveCnt = []  # 交互次数

        for i in range(len(res)):
            interactiveId.append(res[i][0])
            interactiveAnswer.append(res[i][1])
            interactiveCorrect.append(res[i][2])
            interactiveCnt.append(res[i][3])

            # 将交互题id去重找出题号
            interactiveIdNoRepeat = list(set(interactiveId))

        # 确定题号
        t_num = 0
        t_num_all = []  # 题号
        for j in range(len(interactiveIdNoRepeat)):
            t_num += 1
            t_num_all.append(t_num)

        # 去重答案用作参考使用
        answerNoRepeat = list(set(interactiveAnswer))
        answerNoRepeat = (lambda x: (x.sort(), x)[1])(answerNoRepeat)
        # answerNoRepeat = list(set(interactiveAnswer))
        print('*******', answerNoRepeat)

        # 确定相同题号对应的答案和次数
        all_cnt = []  # 各答案次数
        all_marker = []  # 各答案标记
        all_correct = []  # 正确与否

        for m in range(len(interactiveIdNoRepeat)):
            all_cnt_sub = []
            all_marker_sub = []
            all_correct_sub = []
            for m1 in range(len(answerNoRepeat)):
                index_tmp1 = 0
                all_marker_sub_temp = []
                all_correct_temp = []
                for f in range(len(interactiveAnswer)):
                    if (interactiveIdNoRepeat[m] == interactiveId[f]) and (answerNoRepeat[m1] == interactiveAnswer[f]):
                        index_tmp1 += interactiveCnt[f]
                        all_marker_sub_temp.append(interactiveAnswer[f])
                        all_correct_temp.append(interactiveCorrect[f])

                all_cnt_sub.append(index_tmp1)
                all_marker_sub.append(all_marker_sub_temp)
                all_correct_sub.append(all_correct_temp)
            all_cnt.append(all_cnt_sub)
            all_marker.append(all_marker_sub)
            all_correct.append(all_correct_sub)

        # print('对应答案的次数为：', len(all_cnt))
        # print('对应答案的次数为：', all_cnt)
        # print('对应答案为：', len(all_marker))
        # print('对应答案为：', all_marker)
        # print('对应答案的标记为：',len(all_correct))
        # print('对应答案的标记为：',all_correct)
        # #
        # print('对应答案为111111111111：', all_marker[0])
        # print('对应答案为1111111111112：', all_marker[0][1])
        # 将答案去重
        all_marker_no_repeat = []
        all_correct_no_repeat = []
        for n in range(len(all_marker)):
            all_marker_no_repeat_sub = []
            all_correct_no_repeat_sub = []
            for n1 in range(len(all_marker[n])):
                answerNoRepeatSub = list(set(all_marker[n][n1]))
                correctNoRepeatSub = list(set(all_correct[n][n1]))
                all_marker_no_repeat_sub.append(answerNoRepeatSub)
                all_correct_no_repeat_sub.append(correctNoRepeatSub)
            all_marker_no_repeat.append(all_marker_no_repeat_sub)
            all_correct_no_repeat.append(all_correct_no_repeat_sub)

        # print('对应答案为111111111111：', all_marker_no_repeat)
        # print('对应答案为222222222222：', all_correct_no_repeat)

        # 处理为空的情况
        print('所以答案的数据为：', all_marker_no_repeat)
        print('所以答案的标记数据为：', all_correct_no_repeat)
        print('所以答案的次数数据为：', all_cnt)
        # 去掉答案为空的列表[]
        all_marker_no_repeat_new = []
        all_correct_no_repeat_new = []
        all_cnt_new = []
        for gap in range(len(all_marker_no_repeat)):
            all_marker_no_repeat_new_sub = []
            all_correct_no_repeat_new_sub = []
            # all_cnt_new_sub = []
            for gap1 in range(len(all_marker_no_repeat[gap])):
                if len(all_marker_no_repeat[gap][gap1]) != 0:
                    all_marker_no_repeat_new_sub.append(all_marker_no_repeat[gap][gap1])
                    all_correct_no_repeat_new_sub.append(all_correct_no_repeat[gap][gap1])
                    # all_cnt_new_sub.append(all_cnt[gap][gap1])
            all_marker_no_repeat_new.append(all_marker_no_repeat_new_sub)
            all_correct_no_repeat_new.append(all_correct_no_repeat_new_sub)
            # all_cnt_new.append(all_cnt_new_sub)
        print('所以答案的数据为--new：', all_marker_no_repeat_new)
        print('所以标记的数据为--new：', all_correct_no_repeat_new)

        # 去掉次数为0的列表

        for os in range(len(all_cnt)):
            all_cnt_new_sub = []
            for os1 in range(len(all_cnt[os])):
                if all_cnt[os][os1] != 0:
                    all_cnt_new_sub.append(all_cnt[os][os1])

            all_cnt_new.append(all_cnt_new_sub)

        print('所以次数的数据为--new：', all_cnt_new)
        # 将答案标记去重

        # ------------暂时注释---start
        # if len(res) != 0:
        #     #print('交互数据为：',res)
        #     #遍历返回结果去除字符串两边括号并转化为列表--按天分组
        #     list_container = []
        #     for i in range(len(res)):
        #         t1 = res[i][0].replace('[', '')
        #         t2 = t1.replace(']', '')
        #         list_container.append(t2.split(','))
        #
        #     #去除空格
        #     list_container_new = []
        #     list_container_sub = []
        #     for j in range(len(list_container)):
        #        # list_container_sub = []
        #         for j1 in range(len(list_container[j])):
        #             trim = list_container[j][j1].strip()
        #             list_container_sub.append(trim)
        #        # list_container_new.append(list_container_sub)
        #
        #     #题号
        #     list_container_sub.sort(key=lambda x: x.split('_')[0])  # 将字符串按指定元素排序
        #     #print('所有题号：', list_container_sub)
        #
        #     #将题分类
        #
        #     t_num = [] #初始题号
        #     cnt_init = [] #初始次数
        #     anser_init = [] #初始答案
        #     marker_init = [] #初始标记
        #     for d in range(len(list_container_sub)):
        #         index = int(list_container_sub[d].split('_')[0])
        #         anserInit = list_container_sub[d].split('_')[1]
        #         markerInit = list_container_sub[d].split('_')[2]
        #         cntInit = int(list_container_sub[d].split('_')[3])
        #         anser_init.append(anserInit)
        #         cnt_init.append(cntInit)
        #         t_num.append(index)
        #         marker_init.append(markerInit)
        #
        #     # 获取题号
        #     title_num = list(set(t_num))
        #
        #     #获取答案
        #     anser_n =(lambda x:(x.sort(),x)[1])(list(set(anser_init)))
        #
        #     #获取次数
        #
        #     all_cnt = [] #各答案次数
        #     all_marker = [] #各答案标记
        #     for f in range(len(title_num)):
        #         all_cnt_sub = []
        #         all_marker_sub = []
        #         for f1 in range(len(anser_n)):
        #             index_tmp1 = 0
        #             all_marker_sub_temp = []
        #             for f2 in range(len(t_num)):
        #
        #                 if (title_num[f] == t_num[f2]) and (anser_n[f1] == anser_init[f2]):
        #
        #                    index_tmp1 += cnt_init[f2]
        #                    all_marker_sub_temp.append([marker_init[f2],anser_init[f2]])
        #             all_cnt_sub.append(index_tmp1)
        #             all_marker_sub.append(all_marker_sub_temp)
        #         all_cnt.append(all_cnt_sub)
        #         all_marker.append(all_marker_sub)
        #
        #     print('获取各答案的次数：', all_cnt)
        #     print('获取各答案标记的次数：', all_marker)
        #     # print('初始化题号：',res)
        #
        #     # ansers = "".join((lambda x:(x.sort(),x)[1])(list(set(anser_init))))
        #     # print('初始化答案：',list(ansers))
        #     #
        #     # # 获取题号
        #     # title_num = list(set(res))
        #     #
        #     # #获取次数
        #     # cnt_all = []
        #     # for t in range(len(title_num)):
        #     #     num_index = [] #题号组
        #     #     for t1 in range(len(res)):
        #     #         if title_num[t] == res[t1]:
        #     #            # for f in range(len(ansers)):
        #     #            index_cnt = 0
        #     #                 #for f1 in range(len(anser_init)):
        #     #            #if ansers[f] == anser_init[f1]:
        #     #            index_cnt += cnt_init[t1]
        #     #            num_index.append(index_cnt)
        #     #     cnt_all.append(cnt_all)
        #
        #    # print('对应答案的次数为：', num_index)
        #
        #
        #     # print('初始化标记：',marker_init)
        #     # print('初始化次数：',cnt_init)
        #
        #
        #
        #     #计算次数
        #
        #
        #     #查找答案
        #
        #
        #
        #     #
        #     # t_num = [] #题号
        #     # t_anser = [] #取答案
        #     # t_maker = [] #是否标红
        #     # t_cnt = [] #取次数
        #     # t_index = 0
        #     # for n in range(len(list_container_sub)):
        #     #     t_index = list_container_sub[n].split('_')
        #     #     t_num.append(int(t_index[0])) #取题号
        #     #     t_anser.append(t_index[1])
        #     #     t_maker.append(t_index[2])
        #     #     t_cnt.append(int(t_index[3]))
        #     #
        #     # noRepeat = list(set(t_num)) #得到去重后的题号
        #    # print('去重的题号：', noRepeat)
        # else:
        #     noRepeat = t_num = t_anser = t_maker = t_cnt = 0

        # ------------暂时注释---end
        # print('转化为列表：',list_container_new)

        #
        # if len(res) != 0:
        #     result = res[0][0]
        #     reResult = re.findall('\[(.*)\]', result)
        #     strRes = reResult[0].split(',')
        #     #s = re.findall('^0.*',strRes[i])
        #     trimStr = []
        #     for i in range(len(strRes)):
        #         trimSpace = strRes[i].strip()
        #         trimStr.append(trimSpace)
        #
        #     trimStr.sort(key=lambda x: x.split('_')[1]) #将字符串按指定元素排序
        #     #确定题号数量
        #    # print('有多少题：', trimStr)
        #     t_num = [] #题号
        #     t_anser = [] #取答案
        #     t_maker = [] #是否标红
        #     t_cnt = [] #取次数
        #     t_index = 0
        #     for n in range(len(trimStr)):
        #         t_index = trimStr[n].split('_')
        #         t_num.append(int(t_index[0])) #取题号
        #         t_anser.append(t_index[1])
        #         t_maker.append(t_index[2])
        #         t_cnt.append(int(t_index[3]))
        #
        #     noRepeat = list(set(t_num)) #得到去重后的题号
        #    # print('去重的题号：', noRepeat)
        # else:
        #     noRepeat = t_num = t_anser = t_maker = t_cnt = 0
        #

        # 以题号开头的字符串分类
        # var = 0 #表示传入的题号
        # s1 = []
        # s2 = [] #分好类的题
        # for r in range(len(noRepeat)):
        #     for j in range(len(trimStr)):
        #         print('打印r的值：',r)
        #         s = re.search(r'^'+str(r)+'.*', trimStr[j])
        #         if s != None:
        #             s1.append(s.group())
        #         #    continue
        #         #s1.append(s)
        #     s2.append(s1)
        # print('分组后的列表：',s2)
    else:
        t_num_all = []
        all_marker_no_repeat_new = []
        all_correct_no_repeat_new = []
        all_cnt_new = []
        
    RESULT = {

        "t_num":t_num_all,
        "t_anser":all_marker_no_repeat_new,
        "t_maker":all_correct_no_repeat_new,
        "t_cnt":all_cnt_new
    }
    return RESULT





#重构观看视频的数据
def get_video_watch_percent_ten(date_start,date_end,code):
    res = lh.getVideoWatchData(date_start,date_end,code)
    pauseThirty = []  # 暂停30是的数据列表
    pauseThree = []  # 暂停3s的数据列表
    pauseThirtyCnt = []  # 暂停30s观看次数

    # 将数据存入数组
    for i in range(len(res)):
        pauseThree.append(res[i][0])
        pauseThirty.append(res[i][1])
        pauseThirtyCnt.append(res[i][2])

    # 查找30s数据最大值，去重，排序后得到
    thirtyNoRepeat = list(set(pauseThirty))  # 去重，排序
    thirtyMax = max(thirtyNoRepeat)  # 查找最大值

    # 计算暂停30s的数
    thirtyResultCnt = []  # 记录各个范围的次数结果
    for f in range(len(thirtyNoRepeat)):
        index = 0  # 用于累计次数
        for j in range(len(pauseThirty)):
            if thirtyNoRepeat[f] == pauseThirty[j]:
                index += pauseThirtyCnt[j]
        thirtyResultCnt.append(index)

    # 以最大值为准计算参考列表
    th_index = 0  # 用于时间转换的索引
    x_list = []  # x轴数据（参考数据）
    th_count = 0  # 用于对比的参考变量
    th_counts = []  # 用于对比的参考列表
    # 真实横坐标0表示30s
    for s in range(int(thirtyMax)):
        th_index += 1*0.1
        x_list.append(round(th_index,2))

    for m in range(int(thirtyMax)):
        # th_index+=30
        # x_list.append(th_index)
        th_counts.append(th_count)
        th_count += 1

    # 对比没有次数的时间段补0
    y_cnt_list = th_counts  # y轴对应次数列表
    for n in range(len(y_cnt_list)):
        if y_cnt_list[n] not in thirtyNoRepeat:
            y_cnt_list[n] = -1
    #print('横坐标数据为：', y_cnt_list)
    # 取y轴的次数
    y_cnt_lists = []  # y轴的次数列表
    for p in range(len(y_cnt_list)):
        if y_cnt_list[p] == -1:
            thirtyResultCnt.insert(p, 0)

    y_times_list = thirtyResultCnt  # 将y轴次数结果集赋值给返回值变量

    # 计算30s总次数
    thirty_all_count = 0
    for k in range(len(pauseThirtyCnt)):
        thirty_all_count += pauseThirtyCnt[k]
    #print('观看10%总次数为：', thirty_all_count)
    threeResult = get_video_watch_percent_one(res)

    #补充>=1的数
    x_list.append("≥1.0")
    RESULT = {
        "watch_time": x_list,
        "watch_times": y_times_list,
        "all_times": thirty_all_count,
        "one_list": threeResult
    }
    return RESULT

#重构观看视频为1%的数据
def get_video_watch_percent_one(res):
    #res = lh.getVideoWatchData(date_start,date_end,code)
    # pauseThirty = [] #暂停30是的数据列表
    pauseThree = []  # 暂停3s的数据列表
    # pauseThirtyCnt = [] #暂停30s观看次数
    pauseThreeCnt = []  # 暂停3s观看次数

    # 将数据存入数组
    for i in range(len(res)):
        pauseThree.append(res[i][0])
        # pauseThirty.append(res[i][1])
        # pauseThirtyCnt.append(res[i][2])
        pauseThreeCnt.append(res[i][2])

    # 查找3s数据最大值，去重，排序后得到
    threeNoRepeat = list(set(pauseThree))  # 去重，排序
    threeMax = max(threeNoRepeat)  # 查找最大值


    # 计算暂停30s的数
    threeResultCnt = []  # 记录各个范围的次数结果
    for f in range(len(threeNoRepeat)):

        index = 0  # 用于累计次数
        for j in range(len(pauseThree)):
            if threeNoRepeat[f] == pauseThree[j]:
                index += pauseThreeCnt[j]
        threeResultCnt.append(index)

    # 以最大值为准计算参考列表
    th_index = 0  # 用于时间转换的索引
    x_list = []  # x轴数据（参考数据）
    th_count = 0  # 用于对比的参考变量
    th_counts = []  # 用于对比的参考列表

    # 补充子x轴坐标的值
    for m1 in range(int(threeMax)):
        th_index =  round(0.01*(m1+1),3)
        x_list.append(th_index)

    for m in range(int(threeMax)):
        # th_index += 1 * 3
        # th_index = 3*m
        th_counts.append(th_count)
        th_count += 1
        # x_list.append(th_index)


    # 对比没有次数的时间段补0
    y_cnt_list = th_counts  # y轴对应次数列表

    for n in range(len(y_cnt_list)):
        if y_cnt_list[n] not in threeNoRepeat:
            y_cnt_list[n] = -1

    # 取y轴的次数
    y_cnt_lists = []  # y轴的次数列表
    for p in range(len(y_cnt_list)):
        if y_cnt_list[p] == -1:
            threeResultCnt.insert(p, 0)

    y_times_list = threeResultCnt  # 将y轴次数结果集赋值给返回值变量

    # 将暂停3s的截取分段
    all_len = 10
    group_x_list = [x_list[c:c + all_len] for c in range(0, len(x_list), all_len)]
    group_y_list = [y_times_list[v:v + all_len] for v in range(0, len(y_times_list), all_len)]

    #print('观看1%分段后的结果为：', group_y_list)

    #添加>1.0的坐标
    group_x_list.append(["≥1.0"])
    RESULT = {
        "exit_time": group_x_list,
        "exit_times": group_y_list,
    }
    return RESULT


#重构退出次数的数据
def get_exit_all_list(code,dateStart,dateEnd):
    res = lh.getExitAllData(code,dateStart,dateEnd)
    pauseThirty = []  # 暂停30是的数据列表
    pauseThree = []  # 暂停3s的数据列表
    pauseThirtyCnt = []  # 暂停30s观看次数

    # 将数据存入数组
    for i in range(len(res)):
        pauseThree.append(res[i][0])
        pauseThirty.append(res[i][1])
        pauseThirtyCnt.append(res[i][2])
   # print('重构退出30s总次数为aaaaaaaaaaaa：', pauseThirtyCnt)
    # 查找30s数据最大值，去重，排序后得到
    thirtyNoRepeat = list(set(pauseThirty))  # 去重，排序
    thirtyMax = max(thirtyNoRepeat)  # 查找最大值
    #print('重构退出30s总次数为teeeeeeeeeeeee：', thirtyNoRepeat)
   # print('重构退出30s总次数为pauseThirtyooooooooooo：', pauseThirty)

    # 计算暂停30s的数
    thirtyResultCnt = []  # 记录各个范围的次数结果
    for f in range(len(thirtyNoRepeat)):
        index = 0  # 用于累计次数
        for j in range(len(pauseThirty)):
            if thirtyNoRepeat[f] == pauseThirty[j]:
                index += pauseThirtyCnt[j]
                #print('调试数据：', index)
        thirtyResultCnt.append(index)
    #print('重构退出30s总次数为thirtyResultCnt：', thirtyResultCnt)
    # 以最大值为准计算参考列表
    th_index = 0  # 用于时间转换的索引
    x_list = []  # x轴数据（参考数据）
    th_count = 0  # 用于对比的参考变量
    th_counts = []  # 用于对比的参考列表
    # 真实横坐标0表示30s
    for s in range(int(thirtyMax) + 1):
        th_index += 30
        x_list.append(th_index)

    for m in range(int(thirtyMax)):
        # th_index+=30
        # x_list.append(th_index)
        th_counts.append(th_count)
        th_count += 1

    # 对比没有次数的时间段补0
    y_cnt_list = th_counts  # y轴对应次数列表
    for n in range(len(y_cnt_list)):
        if y_cnt_list[n] not in thirtyNoRepeat:
            y_cnt_list[n] = -1
   # print('横坐标数据为：', y_cnt_list)
    # 取y轴的次数
    y_cnt_lists = []  # y轴的次数列表
    for p in range(len(y_cnt_list)):
        if y_cnt_list[p] == -1:
            thirtyResultCnt.insert(p, 0)

    y_times_list = thirtyResultCnt  # 将y轴次数结果集赋值给返回值变量


    # 计算30s总次数
    thirty_all_count = 0
    for k in range(len(pauseThirtyCnt)):
        thirty_all_count += pauseThirtyCnt[k]
    #print('重构退出30s总次数为：', thirty_all_count)
    #print('重构退出30s总次数为y_times_list：', y_times_list)
    threeResult = get_exit_three_list(res)

    RESULT = {
        "exit_time": x_list,
        "exit_times": y_times_list,
        "all_times": thirty_all_count,
        "three_list": threeResult
    }
    return RESULT


#重构退出3s的数据
def get_exit_three_list(res):
    # res = lh.getExitAllData(code,dateStart,dateEnd)
    # pauseThirty = [] #暂停30是的数据列表
    pauseThree = []  # 暂停3s的数据列表
    # pauseThirtyCnt = [] #暂停30s观看次数
    pauseThreeCnt = []  # 暂停3s观看次数

    # 将数据存入数组
    for i in range(len(res)):
        pauseThree.append(res[i][0])
        # pauseThirty.append(res[i][1])
        # pauseThirtyCnt.append(res[i][2])
        pauseThreeCnt.append(res[i][2])

   # print('y轴的次数为pauseThree：', pauseThree)
    # 查找3s数据最大值，去重，排序后得到
    threeNoRepeat = sorted(list(set(pauseThree)))  # 去重，排序

   # print('y轴的次数为threeNoRepeat1111：', threeNoRepeat)

    threeMax = max(threeNoRepeat)  # 查找最大值
    #print('y轴的次数为threeNoRepeat：', threeMax)
    # 计算暂停30s的数
    threeResultCnt = []  # 记录各个范围的次数结果
    for f in range(len(threeNoRepeat)):
        index = 0  # 用于累计次数
        for j in range(len(pauseThree)):
            if threeNoRepeat[f] == pauseThree[j]:
                index += pauseThreeCnt[j]
        threeResultCnt.append(index)
   # print('y轴的次数为threeResultCnt：', threeResultCnt)
    #print('y轴的次数为pauseThreeCnt：', pauseThreeCnt)
    # 以最大值为准计算参考列表
    th_index = 3  # 用于时间转换的索引
    x_list = []  # x轴数据（参考数据）
    th_count = 2  # 用于对比的参考变量
    th_counts = []  # 用于对比的参考列表

    # 补充子x轴坐标的值
    for m1 in range(int(threeMax)-1):
        th_index = (m1*3)+9
        x_list.append(th_index)

    for m in range(int(threeMax)-1):
        # th_index += 1 * 3
        # th_index = 3*m
        th_counts.append(th_count)
        th_count += 1
        # x_list.append(th_index)

    #print('y轴的次数为0：', th_counts)
    # 对比没有次数的时间段补0
    y_cnt_list = th_counts  # y轴对应次数列表
    for n in range(len(y_cnt_list)):
        if y_cnt_list[n] not in threeNoRepeat:
            y_cnt_list[n] = -1
    #print('y轴的次数为1：', y_cnt_list)
    # 取y轴的次数
    y_cnt_lists = []  # y轴的次数列表
    for p in range(len(y_cnt_list)):
        if y_cnt_list[p] == -1:
            threeResultCnt.insert(p, 0)

    y_times_list = threeResultCnt  # 将y轴次数结果集赋值给返回值变量




   # print('y轴的次数为：',y_times_list)

    # 截取9～30的数据
    zeroToNine = x_list[0:8]
    zeroToNineTimes = y_times_list[0:8]
   # print('截取前9位的数据为：',zeroToNine)
   # print('截取前9位的数据次数为：',zeroToNineTimes)

    # 将暂停3s的截取分段
    all_len = 10
    group_x_list = [x_list[c:c + all_len] for c in range(8, len(x_list), all_len)]
    group_y_list = [y_times_list[v:v + all_len] for v in range(8, len(y_times_list), all_len)]

    #组合成新数组
    new_group_x_list = []
    new_group_y_list = []
    new_group_x_list.append(zeroToNine)
    new_group_y_list.append(zeroToNineTimes)
    for k in range(len(group_x_list)):
        new_group_x_list.append(group_x_list[k])

    for k1 in range(len(group_y_list)):
        new_group_y_list.append(group_y_list[k1])

   # print('对应的x坐标值为：',new_group_x_list)
   # print('对应的y坐标值为：',new_group_y_list)

    #print('退出3s的结果为：', group_y_list)
    print("退出3s横坐标的数为:", len(x_list))
    print("退出3s纵坐标的数为:", len(y_times_list))
    RESULT = {
        "exit_time": new_group_x_list,
        "exit_times": new_group_y_list,
        "three_all_x":x_list,
        "three_all_y":y_times_list,
    }
    return RESULT




'''提供Restful API'''
app = Flask(__name__)
api = Api(app)
CORS(app,resources = r'/*')




#查询选定学段和学科章节（人教版）
class TodoList(Resource):
    def get(self):
        RESULT = get_all_chapters()
        return RESULT, 200

    def post(self):
        json_data = request.get_json(force=True)
        res = get_middle_school_chapter(school=json_data['school'],subject=json_data['subject'])
        CONST = res
        return CONST, 200

#查询章节的所有视频
class TodoChapterList(Resource):
    def post(self):
        json_data = request.get_json(force=True)
        res = get_video_list(chapter_code=json_data['chapter_code'],date_start=json_data['date_start'],date_end=json_data['date_end'])
        CONST = res
        return CONST, 200


#根据学科获取视频列表
class TodoSubjectVideoList(Resource):
    def post(self):
        json_data = request.get_json(force=True)
        #print('根据学科获取到的请求参数为：',json_data)
        res = get_subject_video_list(subject_id=json_data['subject_id'],stage_id=json_data['stage_id'],date_start=json_data['date_start'],date_end=json_data['date_end'])
        CONST = res
        return CONST, 200

#根据学段获取视频列表
class TodoStageVideoList(Resource):
    def post(self):
        json_data = request.get_json(force=True)
        res = get_stage_video_list(stage_id=json_data['stage_id'],subject_id=json_data['subject_id'],date_start=json_data['date_start'],date_end=json_data['date_end'])
        CONST = res
        return CONST, 200



#查询专项练习的数据
class TodoExeciseList(Resource):
    def post(self):
        json_data = request.get_json(force=True)
        #print('数据列表为：',json_data)
        res = get_execise_list(school=json_data['school'],subject=json_data['subject'],chapter=json_data['chapter'])
        CONST = res
       # print('返回的结果为：', CONST)
        return CONST, 200

#操作视频观看时长---10%
parser = reqparse.RequestParser()
parser.add_argument('task')
class VideoWatchLen(Resource):
    def get(self):
        #默认传参
        RESULT = queryPercentTenResult(date_start='20180520',date_end='20180523',code='1202')
        return RESULT


    def post(self):
        json_data = request.get_json(force=True)
        res = queryPercentTenResult(date_start=json_data['date_start'],date_end=json_data['date_end'],code=json_data['code'])
        CONST = res
        #return json_data, 200
        return CONST, 200


#操作视频观看时长---1%
class VideoWatchPercentOne(Resource):
    def get(self):
        #默认传参
        RESULT = queryPercentOneResult(date_start='20180520',date_end='20180523',code='1202',groupCode='0')
        return RESULT


    def post(self):
        json_data = request.get_json(force=True)
        res = queryPercentOneResult(date_start=json_data['date_start'],date_end=json_data['date_end'],code=json_data['code'],groupCode=json_data['groupCode'])
        CONST = res
        #return json_data, 200
        return CONST, 200


#30s退出的数据列表为
class ExitList(Resource):
    def get(self):
        RESULT =  get_thirty_exit_lists(code='1127',dateStart='20180501',dateEnd='20180530')
        return RESULT
    def post(self):
        json_data = request.get_json(force=True)
        res = get_thirty_exit_lists(dateStart=json_data['date_start'], dateEnd=json_data['date_end'], code=json_data['code'])
        CONST = res
        # return json_data, 200
        return CONST, 200

#3s退出的数据列表为
class ExitTreeList(Resource):
    def get(self):
        RESULT =  get_three_exit_lists(code='1127',dateStart='20180501',dateEnd='20180530',groupCode= '1')
        return RESULT
    def post(self):
        json_data = request.get_json(force=True)
        res = get_three_exit_lists(dateStart=json_data['date_start'], dateEnd=json_data['date_end'], code=json_data['code'],groupCode=json_data['groupCode'])
        CONST = res
        # return json_data, 200
        return CONST, 200

#暂停30s数据
class PauseThirtyList(Resource):
    def post(self):
        json_data = request.get_json(force=True)
        res = get_video_pause_thirty(dateStart=json_data['date_start'], dateEnd=json_data['date_end'],
                                   code=json_data['code'])
        CONST = res
        # return json_data, 200
        return CONST, 200

#章节表格列表数据--根据学段
class ChapterMiddleList(Resource):
    def post(self):
        json_data = request.get_json(force=True)
        res = get_chapter_table_list(dateStart=json_data['date_start'], dateEnd=json_data['date_end'],
                                     stdId=json_data['stage_id'],subId=json_data['subject_id'])
        CONST = res
        # return json_data, 200
        return CONST, 200

#章节表格列表数据---根据学科
class ChapterMiddleForSubjectList(Resource):
    def post(self):
        json_data = request.get_json(force=True)
        res = get_chapter_table_list_for_subject(dateStart=json_data['date_start'], dateEnd=json_data['date_end'],
                                                 subId=json_data['subject_id'])
        CONST = res
        # return json_data, 200
        return CONST, 200

#查询交互数据列表
class InteractionMiddleList(Resource):
    def post(self):
        json_data = request.get_json(force=True)
        res = get_interaction_table_list(dateStart=json_data['date_start'], dateEnd=json_data['date_end'],
                                   sk=json_data['sk'])
        CONST = res
        # return json_data, 200
        return CONST, 200

#重构视频观看时长的数据列表
class WatchVideoPercentTenList(Resource):
    def post(self):
        json_data = request.get_json(force=True)
        res = get_video_watch_percent_ten(date_start=json_data['date_start'], date_end=json_data['date_end'],
                                   code=json_data['code'])
        CONST = res
        # return json_data, 200
        return CONST, 200

#重构退出的数据列表
class ExitAllDataList(Resource):
    def post(self):
        json_data = request.get_json(force=True)
        res = get_exit_all_list(dateStart=json_data['date_start'], dateEnd=json_data['date_end'],
                                code=json_data['code'])
        CONST = res
        return CONST, 200


# 设置路由
api.add_resource(TodoList, '/todos')
api.add_resource(TodoChapterList, '/list')
api.add_resource(TodoExeciseList, '/execise')
api.add_resource(VideoWatchLen, '/video_list')
api.add_resource(VideoWatchPercentOne, '/video_per_one_list')
api.add_resource(ExitList, '/exit_list')
api.add_resource(ExitTreeList, '/exit_three_list')
api.add_resource(TodoSubjectVideoList, '/subject_video_list')
api.add_resource(TodoStageVideoList, '/stage_video_list')
api.add_resource(PauseThirtyList, '/pause_video_thirty_list')
api.add_resource(ChapterMiddleList, '/charpter_middle_list')
api.add_resource(InteractionMiddleList, '/interaction_list')
api.add_resource(WatchVideoPercentTenList, '/video_watch_new_list')
api.add_resource(ExitAllDataList, '/exit_all_new_list')
api.add_resource(ChapterMiddleForSubjectList, '/subject_middle_list')

if __name__ == '__main__':
    app.run(debug=True)