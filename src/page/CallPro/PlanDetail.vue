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
      <el-form ref="form" :inline="true" :model="topBtnGroupForm">
        <el-form-item label="客户信息：" style="margin-bottom:0;">
          <el-input v-model="topBtnGroupForm.info" placeholder="请输入客户信息" style="width:150px;" maxlength="30" clearable></el-input>
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
          <el-select v-model="topBtnGroupForm.selectVal1" placeholder="请选择"  style="width:150px;" clearable>
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
            type="date"
            placeholder="开始日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            clearable
            style="width:190px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="-" style="margin-bottom:0;">
          <el-date-picker
            v-model="topBtnGroupForm.endTime"
            type="date"
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
        <el-table-column label="状态">
          <template slot-scope="scope">{{trStatus(scope.row.calledStatus)}}</template>
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
                @click="checkAlert = true;getRec(scope.$index, scope.row)" :disabled="scope.row.calledStatus!=3&&scope.row.calledStatus!=4">通话记录</el-button>
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
          prop="tempName"
          label="拨打模板">
        </el-table-column>
        <el-table-column
          label="呼叫时间">
          <template slot-scope="scope">
            <span v-if="scope.row.callTime">{{ formatDate(Number(scope.row.callTime)) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="taskName"
          label="计划名称">
        </el-table-column>
        <el-table-column
          label="历史累计通话次数">
          <template slot-scope="scope">
            <div class="cell">{{ scope.row.callCount }}<el-button @click="singleImport = true;getCheckAlert(scope.$index, scope.row)" v-show="scope.row.callCount>0?true:false" type="text" style="margin-left:10px">查看</el-button></div>
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
    <div class="bom-btnGroup">
      <el-form ref="form" :inline="true">
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
            <span>呼叫日期：</span><span>{{formatDate(checkAlertForm.callTime)}}</span>
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
                  <el-tooltip :content="item.callText" placement="bottom" effect="light">
                    <div class="content">{{item.callText}}</div>
                  </el-tooltip>
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
          <template v-for="(item,index) in voiceData1">
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
                  <el-tooltip :content="item.callText" placement="bottom" effect="light">
                    <div class="content">{{item.callText}}</div>
                  </el-tooltip>
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
          <span>备注：命中关键词：</span>
           <template v-for="(item,index) in keyWordArr1">
             <span :key="index">{{item}}</span>;
           </template>
        </div>
        <div class="right"><el-button class="btn" type="primary" disabled>导出文字对话</el-button></div>
      </div>
      <div class="audio">
        <audio v-if="audioUrl1" :src="audioUrl1" controls="controls">
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
            @current-change="handleCurrentChange1"
            :current-page.sync="currentPage1"
            :page-size="10"
            layout="total, prev, pager, next"
            :total="tableCount1">
          </el-pagination>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { baseUrl, Ajax } from "../../assets/api/api";
import { formatDate } from "../../assets/js/format";
import axios from "axios";
export default {
  data() {
    return {
      keyWordArr: [],
      keyWordArr1: [],
      checkAlert: false,
      callRec: false,
      singleImport: false,
      checkAlertForm: {
        //单个信息导入弹窗
        num1: "",
        num2: "",
        date: "",
        template: "",
        time: "",
        level: ""
      },
      callRecForm: {
        //单个信息导入弹窗
        num1: "",
        num2: "",
        date: "",
        template: "",
        time: "",
        level: ""
      },
      voiceData: [],
      voiceData1: [],
      audioUrl: "",
      audioUrl1: "",
      singleImportForm: {
        name: "",
        phone: "",
        checked: false
      },
      topBtnGroupForm: {
        //表格上部分按钮组
        info: "",
        startTime: "",
        endTime: "",
        selectVal: "",
        selectVal1: "",
        options: [
          {
            value: 0,
            label: "等待执行"
          },
          {
            label: "执行中",
            value: 1
          },
          {
            value: 2,
            label: "取消计划"
          },
          {
            value: 3,
            label: "计划完成"
          },
          {
            value: 4,
            label: "呼叫失败"
          }
        ],
        options1: [
          {
            value: "A"
          },
          {
            value: "B"
          },
          {
            value: "C"
          },
          {
            value: "D"
          },
          {
            value: "E"
          },
          {
            value: "F"
          }
        ]
      },
      checkbox: false,
      tableData: [],
      tableData1: [],
      tableCount: 0,
      tableCount1:0,
      pageSize: 10,
      currentPage: 1,
      currentPage1: 1,
      rowCalledTel: '',
      rowDetailSeq: ''
    };
  },
  mounted() {
    this.tableInit();
  },
  methods: {
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.tableInit(this.currentPage)
    },
    tableInit(page) {
      let that = this;
      let taskSeq = sessionStorage.getItem("taskSeq");
      let customerInfo = this.topBtnGroupForm.info;
      let status = this.topBtnGroupForm.selectVal;
      let callLevel = this.topBtnGroupForm.selectVal1;
      let startTime = this.topBtnGroupForm.startTime;
      let endTime = this.topBtnGroupForm.endTime;
      let paramsForm = {
        page: page,
        size: this.pageSize,
        taskSeq: taskSeq,
        customerInfo: customerInfo,
        status: status,
        callLevel: callLevel,
        startTime: startTime,
        endTime: endTime,
      };
      Ajax("/callTaskDetail/taskDetailInfo", "post", paramsForm).then(res => {
        if (res.status == 0) {
          that.tableCount = res.count;
          this.tableData =  res.dataInfo;
        } else {
          // this.$message({
          //   type: "error",
          //   message: "表格数据初始化有误"
          // });
        }
      });
    },
    trStatus(status) {
      if (status == 0) {
        return "等待执行";
      } else if (status == 1) {
        return "执行中";
      } else if (status == 2) {
        return "取消计划";
      } else if (status == 3) {
        return "计划完成";
      } else if (status == 4) {
        return "呼叫失败";
      }
    },
    toPrivateUser() {
      this.$router.push("/PrivateUser");
    },
    handleCurrentChange(val) {
      this.tableInit(val);
    },
    handleCurrentChange1(val) {
      this.currentPage1 = val;
      let that = this;
      let paramsForm = {
        phoneNum: this.rowCalledTel,
        page: this.currentPage1
      };
      Ajax("/callTaskDetail/queryHistory", "post", paramsForm).then(res => {
        if (res.status == 0) {
          this.tableCount1 = res.count;
          let tableData = res.dataInfo;
          tableData.map(function(currentValue, index) {
            if (currentValue.callTime) {
              tableData[index].callTime = that.formatDate(
                currentValue.callTime
              );
            }
          });
          this.tableData1 = tableData;
        } else {
          // this.$message({
          //   type: "error",
          //   message: "callDetailInfoList数据有误"
          // });
        }
      });
    },
    batchCancle() {
      let selectionData = this.$refs.multipleTable.selection;
      if (selectionData.length == 0) {
        this.$message({
          type: "error",
          message: "请至少选择一项需要批量取消计划的数据"
        });
      } else {
        let detailSeq = []; //客户编号
        for (let i = 0; i < selectionData.length; i++) {
          detailSeq.push(selectionData[i].detailSeq);
        }
        let params = new URLSearchParams();
        params.append("detailSeq", detailSeq);
        axios.post(baseUrl + "/callTaskDetail/batchCancelPlan", params).then(res => {
          if (res.data.status == 0) {
            this.$message({
              type: "success",
              message: res.data.errorMsg
            });
            this.tableInit(this.currentPage);
          } else {
            this.$message({
              type: "error",
              message: res.data.errorMsg
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
      }
    },
    batchPublic() {
      let selectionData = this.$refs.multipleTable.selection;
      if (selectionData.length == 0) {
        this.$message({
          type: "error",
          message: "请至少选择需要批量开放到公海的数据"
        });
      } else {
        let detailSeq = []; //客户编号
        for (let i = 0; i < selectionData.length; i++) {
          detailSeq.push(selectionData[i].detailSeq);
        }
        let params = new URLSearchParams();
        params.append("detailSeq", detailSeq);
        axios
          .post(baseUrl + "/callTaskDetail/batchOpenToCommunal", params)
          .then(res => {
            if (res.data.status == 0) {
              this.$message({
                type: "success",
                message: res.data.errorMsg
              });
              this.tableInit(this.currentPage);
            } else {
              this.$message({
                type: "error",
                message: res.data.errorMsg
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    handleDelete(index, row) {
      let detailSeq = [];
      detailSeq.push(row.detailSeq);
      let params = new URLSearchParams();
      params.append("detailSeq", detailSeq);
      axios
        .post(baseUrl + "/callTaskDetail/batchDel", params)
        .then(res => {
          if (res.data.status == 0) {
            this.$message({
              type: "success",
              message: res.data.errorMsg
            });
            this.tableInit(this.currentPage);
          } else {
            this.$message({
              type: "error",
              message: res.data.errorMsg
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    batchDelete() {
      let selectionData = this.$refs.multipleTable.selection;
      if (selectionData.length == 0) {
        this.$message({
          type: "error",
          message: "请至少选择一项需要批量删除的数据"
        });
      } else {
        let detailSeq = []; //客户编号
        for (let i = 0; i < selectionData.length; i++) {
          detailSeq.push(selectionData[i].detailSeq);
        }
        let params = new URLSearchParams();
        params.append("detailSeq", detailSeq);
        axios.post(baseUrl + "/callTaskDetail/batchDel", params).then(res => {
          if (res.data.status == 0) {
            this.$message({
              type: "success",
              message: res.data.errorMsg
            });
            this.tableInit(this.currentPage);
          } else {
            this.$message({
              type: "error",
              message: res.data.errorMsg
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
      }
    },
    handleCheckAllChange(val) {
      this.batchAddForm.checkedTel = val ? this.batchAddForm.telOptions : [];
      this.batchAddForm.isIndeterminate = false;
    },
    handleCheckedTelChange(value) {
      let checkedCount = value.length;
      this.batchAddForm.checkAll =
        checkedCount === this.batchAddForm.telArr.length;
      this.batchAddForm.isIndeterminate =
        checkedCount > 0 && checkedCount < this.batchAddForm.telArr.length;
    },
    search() {
      let that = this;
      let customerInfo = this.topBtnGroupForm.info;
      let status = this.topBtnGroupForm.selectVal;
      let callLevel = this.topBtnGroupForm.selectVal1;
      let startTime = this.topBtnGroupForm.startTime;
      let endTime = this.topBtnGroupForm.endTime;
      let taskSeq = sessionStorage.getItem("taskSeq");
      let paramsForm = {
        customerInfo: customerInfo,
        status: status,
        callLevel: callLevel,
        startTime: startTime,
        endTime: endTime,
        taskSeq: taskSeq
      };
      Ajax("/callTaskDetail/taskDetailInfo", "post", paramsForm).then(res => {
        if (res.status == 0) {
          this.tableCount = res.count;
          this.currentPage = 1;
          this.tableData = res.dataInfo;
        } else {
          this.$message({
            type: "error",
            message: "数据搜索有误"
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
    getCheckAlert(index, row) {
      if(row){
        this.rowCalledTel = row.calledTel;
      }
      let that = this;
      let paramsForm = {
        phoneNum: this.rowCalledTel,
      };
      Ajax("/callTaskDetail/queryHistory", "post", paramsForm).then(res => {
        if (res.status == 0) {
          this.tableCount1 = res.count;
          let tableData = res.dataInfo;
          tableData.map(function(currentValue, index) {
            if (currentValue.callTime) {
              tableData[index].callTime = that.formatDate(
                currentValue.callTime
              );
            }
          });
          this.tableData1 = tableData;
          console.log(this.tableData1);
        } else {
          // this.$message({
          //   type: "error",
          //   message: "callDetailInfoList数据有误"
          // });
        }
      });

    },
    getCallRec(index, row) {
      let that = this;
      let paramsForm = {
        detailSeq: row.detailSeq
        // detailSeq: 143
      };
      Ajax("/callTaskDetail/queryCallRecord", "post", paramsForm).then(res => {
        if (res.status == 0) {
          that.callRecForm = res.dataInfo[0];
          that.audioUrl1 = res.dataInfo[0].filePath;
        } else {
          // this.$message({
          //   type: "error",
          //   message: "queryCallRecord数据有误"
          // });
        }
      });

      Ajax("/callTaskDetail/callDetailInfoList", "post", paramsForm).then(
        res => {
          if (res.status == 0) {
            that.voiceData1 = res.dataInfo;
            let arr = [];
            res.dataInfo.map(function(currentValue, index) {
              if (currentValue.callRemark) {
                arr.push(currentValue.callRemark);
              }
            });
            that.keyWordArr1 = arr;
          } else {
            this.$message({
              type: "error",
              message: "callDetailInfoList数据有误"
            });
          }
        }
      );
    },
    getRec(index, row) {
      let that = this;
      if(row){
        this.rowDetailSeq = row.detailSeq;
      }
      let paramsForm = {
        detailSeq:  this.rowDetailSeq
        // detailSeq: 143
      };
      Ajax("/callTaskDetail/queryCallRecord", "post", paramsForm).then(res => {
        if (res.status == 0) {
          that.checkAlertForm = res.dataInfo[0];
          that.audioUrl = res.dataInfo[0].filePath;
        } else {
          // this.$message({
          //   type: "error",
          //   message: "queryCallRecord数据有误"
          // });
        }
      });

      Ajax("/callTaskDetail/callDetailInfoList", "post", paramsForm).then(
        res => {
          if (res.status == 0) {
            that.voiceData = res.dataInfo;
            let arr = [];
            res.dataInfo.map(function(currentValue, index) {
              if (currentValue.callRemark) {
                arr.push(currentValue.callRemark);
              }
            });
            that.keyWordArr = arr;
          } else {
            // this.$message({
            //   type: "error",
            //   message: "callDetailInfoList数据有误"
            // });
          }
        }
      );
    }
  }
};
</script>
