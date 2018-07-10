<template>
  <div id="CallRec" style="width:100%;">
    <div class="main-hd">
      <div class="hd-title">通话记录</div>
    </div>
    <div class="top-btnGroup">
      <el-form ref="form" :inline="true" :model="topBtnGroupForm">
        <el-form-item label="客户信息：" style="margin-bottom:0;">
          <el-input v-model="topBtnGroupForm.info" placeholder="请输入客户信息" clearable style="width:190px;"  maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="意向" style="margin-bottom:0;">
          <el-select v-model="topBtnGroupForm.selectVal" placeholder="请选择意向"  style="width:190px;" clearable>
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
        background
        v-show="tableCount!=0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[10, 50, 100, 500, 1000]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
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
            <span>呼叫日期：</span><span>{{formatDate(callRecForm.callTime)}}</span>
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
          <template v-for="(item,index) in voiceData">
              <li class="right" :key="String(index)" v-if="item.callType==1">
                <p class="date">{{formatDate(item.createTime)}}</p>
                <div class="flexbox">
                  <el-tooltip :content="item.callText" placement="bottom" effect="light">
                    <div class="content">{{item.callText}}</div>
                  </el-tooltip>
                  <div class="icon"></div>
                </div>
              </li>
              <li class="left" :key="String(index)" v-if="item.callType==2">
                <p class="date">{{formatDate(item.createTime)}}</p>
                <div class="flexbox">
                  <div class="icon"></div>
                  <!-- <div class="audioChild">
                      <audio :src="item.callFilePath" controls="controls"></audio>
                  </div> -->
                  <el-tooltip :content="item.callText" placement="bottom" effect="light">
                    <div class="content">{{item.callText}}</div>
                  </el-tooltip>
                </div>
              </li>
          </template>
        </ul>
        <div v-if="voiceData.length>0" class="last">
          <span>客户主动挂断电话</span>
        </div>
      </div>
      <div class="remark-box">
        <div class="left">
          <span>备注：命中关键词：</span>
           <template v-for="(item,index) in keyWordArr">
             <span :key="index">{{item}}</span>;
           </template>
        </div>
        <div class="right"><el-button class="btn" type="primary" disabled>导出文字对话</el-button></div>
      </div>
      <div class="audio">
        <audio v-if="audioUrl" :src="audioUrl" controls="controls">
          Your browser does not support the audio element.
        </audio>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {baseUrl,Ajax} from "../../assets/api/api";
  import {formatDate} from "../../assets/js/format";
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
        pageSize: 10,
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
      handleSizeChange(val) {
        this.currentPage = 1;
        this.pageSize = val;
        this.tableInit(this.currentPage)
      },
      tableInit(page){
        let that = this;
        let customerInfo = this.topBtnGroupForm.info;
        let callLevel = this.topBtnGroupForm.selectVal;
        let startTime = this.topBtnGroupForm.startTime;
        let endTime = this.topBtnGroupForm.endTime;
        let paramsForm = {
          page: page,
          size: this.pageSize,
          customerInfo: customerInfo,
          status: status,
          callLevel: callLevel,
          startTime: startTime,
          endTime: endTime
        }
        Ajax('/callTaskDetail/queryCallRecord', 'post',paramsForm).then(res => {
          if (res.status  == 0) {
              that.tableCount = res.count;
              let tableData = res.dataInfo;
              tableData.map(function(currentValue,index){
                if(currentValue.callTime){
                  tableData[index].callTime = that.formatDate(currentValue.callTime);
                }
              })
              this.tableData = tableData;
          } else {

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
        Ajax('/callTaskDetail/queryCallRecord', 'post',paramsForm).then(res => {
          if (res.status  == 0) {
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
        Ajax('/callTaskDetail/queryCallRecord', 'post',paramsForm).then(res => {
          if (res.status  == 0) {
            this.callRecForm = res.dataInfo[0];
            this.audioUrl = res.dataInfo[0].filePath;
          } else {
            // this.$message({
            //     type: 'error',
            //     message: 'queryCallRecord数据有误'
            // });
          }
        });

        Ajax('/callTaskDetail/callDetailInfoList', 'post',paramsForm).then(res => {
          if (res.status  == 0) {
            this.voiceData = res.dataInfo;
            let arr = [];
            res.dataInfo.map(function(currentValue,index){
              if(currentValue.callRemark){
                arr.push(currentValue.callRemark);
              }
            })
            this.keyWordArr = arr;
          } else {
            // this.$message({
            //     type: 'error',
            //     message: 'callDetailInfoList数据有误'
            // });
          }
        });
        },
    }
  };
</script>
