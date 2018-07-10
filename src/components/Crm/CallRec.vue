<template>
  <div id="CallRec" style="width:100%;">
    <div class="main-hd">
      <div class="hd-title">通话记录</div>
    </div>
    <div class="top-btnGroup">
      <el-form ref="form" :inline="true" :model="topBtnGroupForm">
        <el-form-item label="客户信息：" style="margin-bottom:0;">
          <el-input v-model="topBtnGroupForm.info" clearable style="width:150px;"></el-input>
        </el-form-item>
        <el-form-item label="意向" style="margin-bottom:0;">
          <el-select v-model="topBtnGroupForm.selectVal" placeholder="请选择"  style="width:150px;" clearable>
            <el-option
              v-for="item in topBtnGroupForm.options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="拨打时间：" style="margin-bottom:0;">
          <el-date-picker
            v-model="topBtnGroupForm.startTime"
            type="datetime"
            placeholder="开始日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            clearable
            style="width:190px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="至" style="margin-bottom:0;">
          <el-date-picker
            v-model="topBtnGroupForm.endTime"
            type="datetime"
            placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            clearable
            style="width:190px">
          </el-date-picker>
        </el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button type="primary" disabled>导出</el-button>
      </el-form>
    </div>
    <div class="main-table">
      <el-table
        :data="tableData"
        stripe
        style="width: 100%">
        <el-table-column
          prop="calledTel"
          label="客户信息">
        </el-table-column>
        <el-table-column
          prop="callLevel"
          label="意向">
        </el-table-column>
        <el-table-column
          prop="intentionRemark"
          label="意向说明">
        </el-table-column>
        <el-table-column
          prop="taskName"
          label="使用模板">
        </el-table-column>
        <el-table-column
          prop="callTime"
          label="拨打时间">
        </el-table-column>
        <el-table-column
          prop="callingTel"
          label="主叫号码">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="text"
              @click="callRec = true;getCallRec(scope.$index, scope.row)">通话记录</el-button>
            <el-button
              size="mini"
              type="text"
              disabled>导出</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="10"
        layout="total, prev, pager, next"
        :total="tableCount">
      </el-pagination>
    </div>
    <!-- 通话记录-弹窗 -->
    <el-dialog class="batch-add-dialog" title="" :visible.sync="callRec" width="640px">
      <div class="header">
        <ul>
          <li>
            <span>主叫号码：</span><span>{{callRecForm.callingTel}}</span>
          </li>
          <li>
            <span>被叫号码：</span><span>{{callRecForm.calledTel}}</span>
          </li>
          <li>
            <span>呼叫日期：</span><span>{{callRecForm.callTime}}</span>
          </li>
          <li>
            <span>呼叫模板：</span><span>{{callRecForm.taskName}}</span>
          </li>
          <li>
            <span>通话时长：</span><span>{{formatTime(callRecForm.callEndTime - callRecForm.callTime)}}</span>
          </li>
          <li>
            <span>意向评估：</span><span>{{callRecForm.callLevel}}</span>
          </li>
        </ul>
      </div>
      <div class="main-dialog">
        <ul>
          <template v-for="item in voiceData">
              <li class="right" :key="item.callLogIndex" v-if="item.callType==1">
                <p class="date">{{formatDate(item.createTime)}}</p>
                <div class="flexbox">
                  <div class="content">{{item.callText}}</div>
                  <div class="icon"></div>
                </div>
              </li>
              <li class="left" :key="item.callLogIndex" v-if="item.callType==2">
                <p class="date">{{formatDate(item.createTime)}}</p>
                <div class="flexbox">
                  <div class="icon"></div>
                  <div class="content">{{item.callText}}</div>
                </div>
              </li>
          </template>
        </ul>
         <div class="last">
            <span>客户主动挂断电话</span>
          </div>
      </div>
      <div class="remark-box">
        <div class="left">
          <span style="color:#333">备注：命中关键词：</span>
           <template v-for="(item,index) in keyWordArr">
             <span :key="index">{{item}}</span>;
           </template>
        </div>
        <div class="right"><el-button class="btn" type="primary" disabled>导出文字对话</el-button></div>
      </div>
      <div class="audio">
        <audio :src="audioUrl" controls="controls">
         Your browser does not support the audio element.
        </audio>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {commonAjax} from "../../api/api";
  import {formatDate} from '../../../static/js/format';
  export default {
    data() {
      return {
        keyWordArr:[],
        topBtnGroupForm:{//表格上部分按钮组
          info: '',
          startTime: '',
          endTime: '',
          selectVal: '',
          options:[{
            value: 'A',
          },{
            value: 'B',
          },{
            value: 'C',
          },{
            value: 'D',
          },{
            value: 'E',
          },{
            value: 'F',
          }]
        },
        tableCount: 0,
        currentPage: 1,
        callRec: false,
        callRecForm:{//单个信息导入弹窗
          num1: '',
          num2: '',
          date: '',
          template: '',
          time: '',
          level: ''
        },
        audioUrl: '',
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        value: '',
        value6: '',
        tableData: [],
        voiceData:[]
      };
    },
    mounted(){
      this.tableInit();
    },
    methods: {
      tableInit(page){
        let that = this;
        let paramsForm = {
          page: page,
          size: 10
        }
        commonAjax('/callTaskDetail/queryCallRecord', 'post',paramsForm).then(res => {
          if (res.resultCode  == 0) {
            if (res.dataInfo.length > 0) {
              that.tableCount = res.count;
              let tableData = res.dataInfo;
              tableData.map(function(currentValue,index){
                if(currentValue.callTime){
                  tableData[index].callTime = that.formatDate(currentValue.callTime);
                }
              })
              this.tableData = tableData;
            } else {
              this.$message({
                  type: 'error',
                  message: '表格数据初始化有误'
              });
            }
          } else {
            this.$message({
                type: 'error',
                message: '表格数据初始化有误'
            });
          }
        });
      },
      search(){
        console.log(this.topBtnGroupForm);
        let that = this;
        let customerInfo = this.topBtnGroupForm.info;
        let callLevel = this.topBtnGroupForm.selectVal;
        let startTime = this.topBtnGroupForm.startTime;
        let endTime = this.topBtnGroupForm.endTime;
        let paramsForm = {
          customerInfo: customerInfo,
          status: status,
          callLevel: callLevel,
          startTime: startTime,
          endTime: endTime
        }
        commonAjax('/callTaskDetail/queryCallRecord', 'post',paramsForm).then(res => {
          if (res.resultCode  == 0) {
            that.tableCount = res.count;
            let tableData = res.dataInfo;
            tableData.map(function(currentValue,index){
              if(currentValue.callTime){
                tableData[index].callTime = that.formatDate(currentValue.callTime);
              }
            })
            that.tableData = tableData;
          } else {
            this.$message({
                type: 'error',
                message: '数据搜索有误'
            });
          }
        });
      },
      formatDate(time) {
          var date = new Date(time);
          return formatDate(date, "yyyy-MM-dd hh:mm:ss");
      },
      formatTime(time) {
          var date = new Date(time);
          return formatDate(date, "hh:mm:ss");
      },
      handleCurrentChange(val) {
        this.tableInit(val);
      },
      getCallRec(index,row){
        let that = this;
        let paramsForm = {
          detailSeq: row.detailSeq
          // detailSeq: 143

        }
        commonAjax('/callTaskDetail/queryCallRecord', 'post',paramsForm).then(res => {
          if (res.resultCode  == 0) {
            that.callRecForm = res.dataInfo[0];
            that.audioUrl = res.dataInfo[0].filePath;
          } else {
            this.$message({
                type: 'error',
                message: 'queryCallRecord数据有误'
            });
          }
        });

        commonAjax('/callTaskDetail/callDetailInfoList', 'post',paramsForm).then(res => {
          if (res.resultCode  == 0) {
            that.voiceData = res.dataInfo;
            let arr = [];
            res.dataInfo.map(function(currentValue,index){
              if(currentValue.callRemark){
                arr.push(currentValue.callRemark);
              }
            })
            that.keyWordArr = arr;
          } else {
            this.$message({
                type: 'error',
                message: 'callDetailInfoList数据有误'
            });
          }
        });
      }
    }
  };
</script>

<style lang="scss">
  #CallRec{
    display: flex;
    flex-direction: column;
    .main-hd{
      background-color: #fff;
      padding: 0 20px;
      position: relative;
    }

    .hd-title {
      height: 60px;
      line-height: 60px;
      color: #3399ff;
      font-size: 22px;
    }

    .top-btnGroup{
      padding: 20px 20px;
      background-color: #fff;
      margin: 14px 0;
    }

    .main-table{
      flex: 1;
    }

    // .el-dialog__header{
    //   border-bottom: 1px solid #E4E7ED;
    // }
    .cell{
      text-align: center;
    }
     .pagination{
      text-align: center;
      padding: 10px 0;
      background-color: #fff;
    }

    .batch-add-dialog{
      .el-dialog__body{
        padding: 0 0 20px;
      }
      .header{
        width: 100%;
        margin: 0 auto;
        padding: 0 100px 20px;
        border-bottom: 1px solid #E4E7ED;
        background-color: #fff;
        ul{
          width: 100%;
          height: 100%;
          padding: 0 20px;
          display: flex;
          flex-wrap: wrap;
          margin-left: 20px;
        }
        li{
          width: 50%;
          height: 30px;
          line-height: 30px;
        }
      }
      .main-dialog{
        max-height: 400px;
        min-height: 320px;
        padding: 0 30px;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        display: flex;
        flex-direction: column;
        &::-webkit-scrollbar {
            display: none;
        }
        .last{
          width: 100%;
          text-align: center;
          span{
            display: block;
            width: 150px;
            height: 30px;
            margin: 0 auto;
            line-height: 30px;
            border-radius: 20px;
            background-color: lightblue;
            color: #606266;
          }
        }
        ul{
          flex: 1;
          padding: 30px 0;
          &:after{
            content: '\20';
            display: block;
            clear: both;
          }
        }
        li{
          width: 302px;
          height: 80px;
          margin-bottom: 20px;
        }
        .icon{
          width: 40px;
          height: 40px;
          background-color: #efefef;
          border-radius: 50%;
        }
        .content{
          flex: 1;
          padding: 0 20px;
          border: 1px solid #ccc;
          border-radius: 20px;
          height: 36px;
          line-height: 36px;
          position: relative;
          top: 2px;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          cursor: pointer;
        }
        .left{
          float: left;
          .date{
            text-align: left;
            height: 34px;
            line-height: 34px;
          }
          .flexbox{
            height: 40px;
            margin-top: 6px;
            display: flex;
          }
          .content{
            margin-left: 10px;
            background-color: #409EFF;
            border-color: #409EFF;
            color: #fff;
          }
          .icon{
            background: #efefef url(/static/images/voice-user.png) no-repeat center /32px auto;
          }
        }
        .right{
          float: right;
          .date{
            text-align: right;
            height: 26px;
            line-height: 26px;
          }
          .flexbox{
            height: 40px;
            margin-top: 14px;
            display: flex;
          }
          .content{
            margin-right: 10px;
            text-align: right;
          }
          .icon{
            background: #efefef url(/static/images/voice-robot.png) no-repeat center /32px auto;
          }
        }
      }
      .remark-box{
        margin: 20px 0 10px;
        padding: 10px 20px;
        display: flex;
        min-height: 32px;
        .left{
          flex: 1;
          margin-right: 20px;
        }
        .right{
          height: 32px;
        }
      }
      .audio{
        text-align: center;
        audio{
          display: inline-block;
        }
      }
    }
    
  }
</style>

