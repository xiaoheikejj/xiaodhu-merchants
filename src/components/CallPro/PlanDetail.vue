<template>
  <div id="PlanDetail" style="width:100%;">
    <div class="main-hd">
      <div class="hd-title">计划详情</div>
    </div>
    <div class="main-card">
      <div class="grid-content bg-purple">
        <el-card class="box-card">
          <div class="card-content">
            <el-row :gutter="30" class="row-padding" style="width:100%;">
              <el-col :span="6">
                <div class="top topOne"></div>
                <div class="bom">
                  <div class="title">2</div>
                  <div class="con">执行中计划</div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="top topTwo"></div>
                <div class="bom">
                  <div class="title">50</div>
                  <div class="con">已完成任务</div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="top topThree"></div>
                <div class="bom">
                  <div class="title">5</div>
                  <div class="con">A标签数量</div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </div>
    </div>
    <div class="top-btnGroup">
      <el-form ref="form" :inline="true" :model="form">
        <el-form-item label="客户信息：" style="margin-bottom:0;">
          <el-input v-model="topBtnGroupForm.info" style="width:150px;" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态" style="margin-bottom:0;">
          <el-select v-model="topBtnGroupForm.selectVal" placeholder="请选择"  style="width:150px;" clearable>
            <el-option
              v-for="item in topBtnGroupForm.options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="意向" style="margin-bottom:0;">
          <el-select v-model="topBtnGroupForm.selectVal1" placeholder="请选择"  style="width:120px;" clearable>
            <el-option
              v-for="item in topBtnGroupForm.options1"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计划时间：" style="margin-bottom:0;">
          <el-date-picker
            v-model="topBtnGroupForm.startTime"
            type="datetime"
            placeholder="开始日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            clearable
            style="width:190px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="-" style="margin-bottom:0;">
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
        ref="multipleTable"
        :data="tableData"
        stripe
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="calledTel"
          label="客户信息">
        </el-table-column>
        <el-table-column
          prop="calledStatus"
          label="状态">
        </el-table-column>
        <el-table-column
          prop="callLevel"
          label="意向">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div style="text-align:center;">
              <el-button
                size="mini"
                type="text"
                @click="singleImport = true;getRec(scope.$index, scope.row)" :disabled="scope.row.calledStatus!='计划完成'">通话记录</el-button>
            </div>
            <div style="text-align:center;">
               <el-button
                size="mini"
                type="text"
                @click="handleDelete2(scope.$index, scope.row)" disabled>拜访</el-button>
              <el-button
                size="mini"
                type="text"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="taskName"
          label="拨打模板">
        </el-table-column>
        <el-table-column
          prop="callEndTime"
          label="最后计划时间">
        </el-table-column>
        <el-table-column
          prop="taskName"
          label="计划名称">
        </el-table-column>
        <el-table-column
          label="历史累计通话次数">
          <template slot-scope="scope">
            <div class="cell">{{ scope.row.callCount }}<el-button @click="checkAlert = true;getCheckAlert(scope.$index, scope.row)" v-show="scope.row.callCount>0?true:false" type="text" style="margin-left:10px">查看</el-button></div>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="template"
          label="最近拜访">
        </el-table-column> -->
        <el-table-column
          prop="creator"
          label="所属者">
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
    <div class="bom-btnGroup">
      <el-form ref="form" :inline="true" :model="form">
        <el-button type="info" @click="batchCancle">批量取消计划</el-button>
        <el-button type="primary" @click="batchPublic">批量开放到公海</el-button>
        <el-button type="danger" @click="batchDelete">批量删除</el-button>
      </el-form>
    </div>
    <!-- 查看通话记录-弹窗 -->
    <el-dialog class="batch-add-dialog" title="" :visible.sync="checkAlert" width="640px">
      <div class="header">
        <ul>
          <li>
            <span>主叫号码：</span><span>{{checkAlertForm.callingTel}}</span>
          </li>
          <li>
            <span>被叫号码：</span><span>{{checkAlertForm.calledTel}}</span>
          </li>
          <li>
            <span>呼叫日期：</span><span>{{checkAlertForm.callTime}}</span>
          </li>
          <li>
            <span>呼叫模板：</span><span>{{checkAlertForm.taskName}}</span>
          </li>
          <li>
            <span>通话时长：</span><span>{{formatTime(checkAlertForm.callEndTime - checkAlertForm.callTime)}}</span>
          </li>
          <li>
            <span>意向评估：</span><span>{{checkAlertForm.callLevel}}</span>
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
    <!-- 查看通话记录1-弹窗 -->
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
          <template v-for="item in voiceData1">
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
           <template v-for="(item,index) in keyWordArr1">
             <span :key="index">{{item}}</span>;
           </template>
        </div>
        <div class="right"><el-button class="btn" type="primary" disabled>导出文字对话</el-button></div>
      </div>
      <div class="audio">
        <audio :src="audioUrl1" controls="controls">
         Your browser does not support the audio element.
        </audio>
      </div>
    </el-dialog>
    <!-- 通话记录-弹窗 -->
    <el-dialog class="dialog1" title="历史通话" :visible.sync="singleImport" width="620px">
      <div class="main-table">
        <el-table
          ref="multipleTable"
          :data="tableData1"
          stripe
          style="width: 100%">
          <el-table-column
            prop="callTime"
            label="时间">
          </el-table-column>
          <el-table-column
            prop="callLevel"
            label="意向">
          </el-table-column>
          <el-table-column
            prop="creator"
            label="操作人">
          </el-table-column>
          <el-table-column label="操作">
          <template slot-scope="scope">
              <el-button size="mini" type="text" @click="callRec = true;getCallRec(scope.$index, scope.row)">查看通话记录</el-button>
          </template>
        </el-table-column>
        </el-table>
      </div>
      <div class="footer">
        <div class="pagination">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="10"
            layout="total, prev, pager, next"
            :total="tableCount">
          </el-pagination>
        </div>  
      </div> 
    </el-dialog>
  </div>
</template>

<script>
import {commonAjax} from "../../api/api";
import {formatDate} from '../../../static/js/format';
import axios from 'axios';
  export default {
    data() {
      return {
        keyWordArr:[],
        keyWordArr1:[],
        checkAlert: false,
        callRec: false,
        singleImport: false,
        checkAlertForm:{//单个信息导入弹窗
          num1: '',
          num2: '',
          date: '',
          template: '',
          time: '',
          level: ''
        },
        callRecForm:{//单个信息导入弹窗
          num1: '',
          num2: '',
          date: '',
          template: '',
          time: '',
          level: ''
        },
        voiceData:[],
        voiceData1:[],
        audioUrl: '',
        audioUrl1: '',
        singleImportForm:{
          name: '',
          phone: '',
          checked: false
        },
        topBtnGroupForm:{//表格上部分按钮组
          info: '',
          startTime: '',
          endTime: '',
          selectVal: '',
          selectVal1: '',
          options: [ {
            value: 0,
            label: '计划完成'
          },{
            label: '计划执行中',
            value: 1
          }, {
            value: 2,
            label: '计划取消'
          }, {
            value: 3,
            label: '计划失败'
          }],
          options1:[{
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
        checkbox:false,
          options: [
            {
              value: '计划执行中'
            }, {
              value: '计划取消 '
            }, {
              value: '计划完成'
            }, {
              value: '计划失败'
            }
          ],
          order: [
            {
              value: 'A'
            }, {
              value: 'B '
            }, {
              value: 'C'
            }, {
              value: 'D'
            },{
              value: 'E'
            }, {
              value: 'F '
            }
          ],
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
        tableData1: [],
        tableCount: 0,
        currentPage: 1,
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
      };
    },
    mounted(){
      this.tableInit();
    },
    methods: {
      tableInit(page){
        let that = this;
        let taskSeq = sessionStorage.getItem('taskSeq');
        let paramsForm = {
          page: page,
          size: 10,
          taskSeq: taskSeq
        }
        commonAjax('/callTaskDetail/taskDetailInfo', 'post',paramsForm).then(res => {
          if (res.resultCode  == 0) {
            if (res.dataInfo.length > 0) {
              that.tableCount = res.count;
              let tableData = res.dataInfo;
              tableData.map(function(currentValue,index){
                if(currentValue.calledStatus == 0){
                  tableData[index].calledStatus = '计划完成';
                }else if(currentValue.calledStatus == 1){
                  tableData[index].calledStatus = '计划执行中';
                }else if(currentValue.calledStatus == 2){
                  tableData[index].calledStatus = '计划取消';
                }else if(currentValue.calledStatus == 3){
                  tableData[index].calledStatus = '计划失败';
                }else{
                  tableData[index].calledStatus = '';
                }
              })
              this.tableData = tableData;
            } 
          }else {
              this.$message({
                  type: 'error',
                  message: '表格数据初始化有误'
              });
            }
        });
      },
      toPrivateUser(){
        this.$router.push('/PrivateUser');
      },
      handleCurrentChange(val) {
        this.tableInit(val);
      },
      batchCancle(){
        let selectionData = this.$refs.multipleTable.selection;
        if(selectionData.length==0){
          this.$message({
              type: 'error',
              message: '请选择需要批量开放到公海的数据'
          });
        }else{
          let detailSeq = [];//客户编号
          for(let i=0;i<selectionData.length;i++){
            detailSeq.push(selectionData[i].detailSeq);
          }
          let params = new URLSearchParams();
          params.append('detailSeq', detailSeq);
          axios.post('http://192.168.1.251:9001/merchant.call/callTaskDetail/batchCancelPlan', params, ).then(res => {
              if (res.data.resultCode == 0) {
                  this.$message({
                      type: 'success',
                      message: res.data.resultMsg
                  });
                  this.tableInit(this.currentPage);
              } else{
                this.$message({
                      type: 'error',
                      message: res.data.resultMsg
                  });
              };
          }).catch(err => {
              console.log(err);
          })
        }
      },
      batchPublic(){
        let selectionData = this.$refs.multipleTable.selection;
        if(selectionData.length==0){
          this.$message({
              type: 'error',
              message: '请选择需要批量开放到公海的数据'
          });
        }else{
          let detailSeq = [];//客户编号
          for(let i=0;i<selectionData.length;i++){
            detailSeq.push(selectionData[i].detailSeq);
          }
          let params = new URLSearchParams();
          params.append('detailSeq', detailSeq);
          axios.post('http://192.168.1.251:9001/merchant.call/callTaskDetail/batchOpenToCommunal', params, ).then(res => {
              if (res.data.resultCode == 0) {
                  this.$message({
                      type: 'success',
                      message: res.data.resultMsg
                  });
                  this.tableInit(this.currentPage);
              } else{
                this.$message({
                      type: 'error',
                      message: res.data.resultMsg
                  });
              };
          }).catch(err => {
              console.log(err);
          })
        }
      },
      handleDelete(index,row){
        let detailSeq = [];
        detailSeq.push(row.detailSeq);
        let params = new URLSearchParams();
          params.append('detailSeq', detailSeq);
          axios.post('http://192.168.1.251:9001/merchant.call/callTaskDetail/batchDel', params, ).then(res => {
            if (res.data.resultCode == 0) {
                this.$message({
                    type: 'success',
                    message: res.data.resultMsg
                });
                this.tableInit(this.currentPage);
            } else{
              this.$message({
                    type: 'error',
                    message: res.data.resultMsg
                });
            };
        }).catch(err => {
            console.log(err);
        })
      },
      batchDelete(){
        let selectionData = this.$refs.multipleTable.selection;
        if(selectionData.length==0){
          this.$message({
              type: 'error',
              message: '请选择需要批量开放到公海的数据'
          });
        }else{
          let detailSeq = [];//客户编号
          for(let i=0;i<selectionData.length;i++){
            detailSeq.push(selectionData[i].detailSeq);
          }
          let params = new URLSearchParams();
          params.append('detailSeq', detailSeq);
          axios.post('http://192.168.1.251:9001/merchant.call/callTaskDetail/batchDel', params, ).then(res => {
              if (res.data.resultCode == 0) {
                  this.$message({
                      type: 'success',
                      message: res.data.resultMsg
                  });
                  this.tableInit(this.currentPage);
              } else{
                this.$message({
                      type: 'error',
                      message: res.data.resultMsg
                  });
              };
          }).catch(err => {
              console.log(err);
          })
        }
      },
      handleCheckAllChange(val) {
        this.batchAddForm.checkedTel = val ? this.batchAddForm.telOptions : [];
        this.batchAddForm.isIndeterminate = false;
      },
      handleCheckedTelChange(value) {
        let checkedCount = value.length;
        this.batchAddForm.checkAll = checkedCount === this.batchAddForm.telArr.length;
        this.batchAddForm.isIndeterminate = checkedCount > 0 && checkedCount < this.batchAddForm.telArr.length;
      },
      search(){
        let that = this;
        let customerInfo = this.topBtnGroupForm.info;
        let status = this.topBtnGroupForm.selectVal;
        let callLevel = this.topBtnGroupForm.selectVal1;
        let startTime = this.topBtnGroupForm.startTime;
        let endTime = this.topBtnGroupForm.endTime;
        let taskSeq = sessionStorage.getItem('taskSeq');
        let paramsForm = {
          customerInfo: customerInfo,
          status: status,
          callLevel: callLevel,
          startTime: startTime,
          endTime: endTime,
          taskSeq: taskSeq
        }
        commonAjax('/callTaskDetail/taskDetailInfo', 'post',paramsForm).then(res => {
          if (res.resultCode  == 0) {
            that.tableCount = res.count;
            let tableData = res.dataInfo;
            tableData.map(function(currentValue,index){
              if(currentValue.calledStatus == 0){
                tableData[index].calledStatus = '计划完成';
              }else if(currentValue.calledStatus == 1){
                tableData[index].calledStatus = '计划执行中';
              }else if(currentValue.calledStatus == 2){
                tableData[index].calledStatus = '计划取消';
              }else if(currentValue.calledStatus == 3){
                tableData[index].calledStatus = '计划失败';
              }else{
                tableData[index].calledStatus = '';
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
      getCheckAlert(index,row){
        let that = this;
        let paramsForm = {
          detailSeq: row.detailSeq
          // detailSeq: 143

        }
        commonAjax('/callTaskDetail/queryCallRecord', 'post',paramsForm).then(res => {
          if (res.resultCode  == 0) {
            that.checkAlertForm = res.dataInfo[0];
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
            that.audioUrl1 = res.dataInfo[0].filePath;
          } else {
            this.$message({
                type: 'error',
                message: 'queryCallRecord数据有误'
            });
          }
        });

        commonAjax('/callTaskDetail/callDetailInfoList', 'post',paramsForm).then(res => {
          if (res.resultCode  == 0) {
            that.voiceData1 = res.dataInfo;
            let arr = [];
            res.dataInfo.map(function(currentValue,index){
              if(currentValue.callRemark){
                arr.push(currentValue.callRemark);
              }
            })
            that.keyWordArr1 = arr;
          } else {
            this.$message({
                type: 'error',
                message: 'callDetailInfoList数据有误'
            });
          }
        });
      },
      getRec(index,row){
        let that = this;
        let paramsForm = {
          phoneNum: row.calledTel
        }
        commonAjax('/callTaskDetail/queryHistory', 'post',paramsForm).then(res => {
          if (res.resultCode  == 0) {
            console.log(res);
            that.tableCount1 = res.count;
            let tableData = res.dataInfo;
              tableData.map(function(currentValue,index){
                 if(currentValue.callTime){
                    tableData[index].callTime = that.formatDate(currentValue.callTime);
                  }
              })
              this.tableData1 = tableData;
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
  #PlanDetail{
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
    .main-card{
      margin-top: 14px;
    }

    .card-content {
      .el-col {
        height: 148px;
      }

      .list-box{
        height: 148px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .el-button+.el-button{
          margin-left: 0;
        }
      }

      .list{
        height: 36px;
        line-height: 36px;
        text-align: center;
        color: #909399;
        border: 1px solid #E4E7ED;
        background-color: #f2f6fc;
        padding: 0;
        font-size: 16px;
      }
      .top {
        height: 50px;
      }
      .topOne{
        background: #E4E7ED url(/static/images/icon_project.png) no-repeat center /26px auto;
      }
      .topTwo{
        background: #E4E7ED url(/static/images/icon_task.png) no-repeat center /26px auto;
      }
      .topThree{
        background: #E4E7ED url(/static/images/icon_label.png) no-repeat center /26px auto;
      }
      .bom {
        height: 98px;
        background-color: #f2f6fc;
        text-align: center;
        line-height: 30px;
        padding: 21px 0;
        .title{
          font-weight: bold;
          font-size: 20px;
        }
        .con{
          color: #909399;
        }
      }
    }

    .top-btnGroup{
      padding: 20px 20px;
      background-color: #fff;
      margin: 14px 0;
      .el-input__inner{
        line-height: 32px;
      }
    }
    .main-table{
      flex: 1;
    }
    .cell{
      text-align: center;
    }
    .pagination{
      text-align: center;
      padding: 10px 0;
      background-color: #fff;
    }

    .bom-btnGroup{
      padding: 0 20px 20px;
      background-color: #fff;
    }

    .el-dialog__header{
      border-bottom: 1px solid #E4E7ED;
    }
    .batch-add-dialog{
      .el-dialog__header{
        border-bottom: 0; 
      }
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
    .dialog1{
      .el-dialog__body{
        padding: 10px 0 0;
      }
      .footer{
        // border-top: 1px solid #E4E7ED
      }
    }
  }
</style>

