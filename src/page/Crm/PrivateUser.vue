<template>
  <div id="PrivateUser" style="width:100%;">
    <div class="main-hd">
      <div class="hd-title">私海用户</div>
    </div>
    <div class="main-card">
      <div class="grid-content bg-purple">
        <el-card class="box-card">
          <div class="card-content">
            <el-row :gutter="30" class="row-padding" style="width:100%;">
              <el-col :span="6">
                <div class="top topOne"></div>
                <div class="bom">
                  <div class="title">180天</div>
                  <div class="con">您的套餐剩余时间</div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="top topTwo"></div>
                <div class="bom">
                  <div class="title">180天</div>
                  <div class="con">您的套餐剩余时间</div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="top topThree"></div>
                <div class="bom">
                  <div class="title">180天</div>
                  <div class="con">您的套餐剩余时间</div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="list-box">
                  <el-button class="list" @click="singleImport = true">导入单个信息</el-button>
                  <el-button class="list" @click="batchImport = true">批量导入信息</el-button>
                  <el-button class="list" @click="toPublicUser" disabled="">前往公海拉取</el-button>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </div>
    </div>
    <div class="top-btnGroup">
      <el-form ref="topBtnGroupForm" :inline="true" :model="topBtnGroupForm">
        <el-form-item label="客户信息：" style="margin-bottom:0;">
          <el-input v-model="topBtnGroupForm.name" placeholder="请输入客户信息" style="width:190px;" maxlength="11" clearable></el-input>
        </el-form-item>
        <!-- <el-form-item label="意向" style="margin-bottom:0;">
          <el-select v-model="topBtnGroupForm.selectVal" placeholder="请选择意向"  style="width:190px;" clearable>
            <el-option
              v-for="item in topBtnGroupForm.options"
              :key="item.value"
              :label="item.value"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="添加时间：" style="margin-bottom:0;">
          <el-date-picker
            v-model="topBtnGroupForm.startTime"
            type="datetime"
            placeholder="开始日期"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="-" style="margin-bottom:0;">
          <el-date-picker
            v-model="topBtnGroupForm.endTime"
            type="datetime"
            placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item> -->
        <el-button type="primary" @click="topBtnSearch">搜索</el-button>
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
          label="客户信息"
          width="120">
          <template slot-scope="scope">
            <div class="cell">{{ scope.row.CUS_TELEPHONE }}</div>
            <div class="cell">{{ scope.row.CUS_NAME }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="callLevel"
          label="意向"
          width="120">
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="handleVisit(scope.$index, scope.row)" disabled>拜访</el-button>
            <el-button
              type="text"
              @click="plan = true;" disabled="">计划</el-button>
            <el-button
              type="text"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="tempName"
          label="拨打模板">
        </el-table-column>
        <el-table-column
          prop="callTime"
          label="添加时间">
        </el-table-column>
        <!-- <el-table-column label="添加时间">
          <template v-if="scope.row.CREATE_TIME" slot-scope="scope">{{scope.row.CREATE_TIME}}</template>
        </el-table-column> -->
        <el-table-column
          label="历史累计通话次数">
          <template slot-scope="scope">
            <div class="cell">
                {{ scope.row.historyCallCount }}
                <!-- <el-button  type="text" style="margin-left:10px">查看</el-button> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column
        label="最近拜访"
        prop="visit">
          <!-- <template v-if="scope.row.CREATER_TIME" slot-scope="scope">{{formatDate(scope.row.CREATER_TIME)}}</template> -->
        </el-table-column>
        <el-table-column
          prop="CUS_OWN"
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
      <el-form ref="form" :inline="true" :model="form">
        <el-button type="danger" @click="batchAddShow">批量加入计划</el-button>
        <!-- <el-button type="info" @click="batchCancle" disabled>批量取消计划</el-button> -->
        <el-button type="primary" @click="batchPublic" disabled>批量开放到公海</el-button>
        <el-button type="danger" @click="batchDelete">批量删除</el-button>
      </el-form>
    </div>
    <!-- 批量加入计划-弹窗 -->
    <el-dialog class="dialog yy" title="拨号计划" :visible.sync="batchAdd" width="500px">
      <el-form :model="batchAddForm">
        <el-form-item label="计划名称：">
          <el-input v-model="batchAddForm.name" placeholder="请输入计划名称" style="width:300px;" maxlength="30" clearable></el-input>
        </el-form-item>
        <el-form-item label="模板选择：">
          <el-select v-model="batchAddForm.selectVal" placeholder="请选择模板" style="width:300px;" clearable>
            <el-option v-for='item in batchAddForm.templete' :label='item.TEMP_TITLE' :key='item.TEMP_SEQ' :value='item.TEMP_SEQ'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主叫号码：">
          <el-checkbox :indeterminate="batchAddForm.isIndeterminate" v-model="batchAddForm.checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <el-checkbox-group v-model="batchAddForm.checkedTel" @change="handleCheckedTelChange">
            <el-checkbox v-for="(item,index) in batchAddForm.telArr" :label="item.simNum" :key="String(index)" :value='item.simMachintCorde' style="width:150px;">{{item.simNum}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="计划生效时间：">
          <el-date-picker
            v-model="batchAddForm.startTime"
            type="date"
            placeholder="开始日期"
            value-format="yyyy-MM-dd"
            style="width:300px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="允许拨打时间段：">
          <!-- <el-time-picker
            is-range
            v-model="batchAddForm.timePickerData['arr'+index]"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            value-format="HH:mm:ss"
            style="width:226px;float:left">
          </el-time-picker> -->
          <el-time-picker
            v-model="batchAddForm.startTime1"
            placeholder="开始时间"
            value-format="HH:mm:ss"
            style="width:138px;float:left">
          </el-time-picker>
          <span style="padding: 0 10px;float:left">-</span>
          <el-time-picker
            v-model="batchAddForm.endTime1"
            placeholder="结束时间"
            value-format="HH:mm:ss"
            style="width:138px;float:left">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="允许拨打时间段：">
          <el-time-picker
            v-model="batchAddForm.startTime2"
            placeholder="开始时间"
            value-format="HH:mm:ss"
            style="width:138px;float:left">
          </el-time-picker>
          <span style="padding: 0 10px;float:left">-</span>
          <el-time-picker
            v-model="batchAddForm.endTime2"
            placeholder="结束时间"
            value-format="HH:mm:ss"
            style="width:138px;float:left">
          </el-time-picker>
        </el-form-item>
        <!-- <el-form-item width="120px">
          <label for="">排除休息时间：</label>
          <el-checkbox v-model="checkbox" label="12：00~14:00" name="type" style="width:150px;"></el-checkbox>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="batchAdd = false">取消</el-button>
        <el-button type="primary" @click="batchAddConfirm">确定</el-button>
      </div>
    </el-dialog>
    <!-- 导入单个信息-弹窗 -->
    <el-dialog class="batch-add-dialog" title="单个信息导入" :visible.sync="singleImport" width="400px">
      <el-form :model="singleImportForm">
        <el-form-item label="客户电话：">
          <el-input v-model="singleImportForm.phone" placeholder="请输入客户电话" style="width:250px;" maxlength="11" clearable></el-input>
        </el-form-item>
        <el-form-item label="客户姓名：">
          <el-input v-model="singleImportForm.name" placeholder="请输入客户姓名" style="width:250px;" maxlength="30" clearable></el-input>
        </el-form-item>
        <!-- <el-form-item label=" " style="margin-left:90px;">
          <el-checkbox v-model="singleImportForm.checked" label="同时加入计划" name="type" style="width:170px;"></el-checkbox>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="singleImport = false">取 消</el-button>
        <el-button type="primary" @click="singleImportConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 批量导入信息-弹窗 -->
    <el-dialog class="dialog batch-import-dialog" title="批量信息导入" :visible.sync="batchImport" width="400px">
      <div class="batch-import-title">请下载模板后将批量导入的客户信息填写完成后批量上传</div>
      <el-upload
        class="upload-demo"
        ref="upload"
        :action="uploadUrl"
        :on-preview="cc"
        :on-remove="dd"
        :on-success = "uploadSuccess"
        :on-error = "uploadError"
        :auto-upload="false">
        <el-button class="el-btn" slot="trigger" size="small" style="margin:15px 0;">上传文件</el-button>
      </el-upload>
      <a class="el-btn download" :href="downloadUrl">客户端模板下载</a>
      <!-- <el-checkbox label="去前缀+86" name="type" style="width:300px;"></el-checkbox>
      <el-checkbox label="同时加入计划" name="type" style="width:300px;"></el-checkbox> -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="batchImport = false">取 消</el-button>
        <el-button type="primary" @click="batchImport = false;yyf()">确定</el-button>
      </div>
    </el-dialog>
     <!-- 拨号计划-弹窗 -->
    <el-dialog class="dialog" title="拨号计划" :visible.sync="plan" width="500px">
      <el-form :model="batchAddForm">
        <el-form-item label="计划名称：">
          <el-input v-model="batchAddForm.name" style="width:350px;"></el-input>
        </el-form-item>
        <el-form-item label="模板选择：">
          <el-select v-model="batchAddForm.selectVal" placeholder="" style="width:350px;">
            <el-option v-for='item in batchAddForm.templete' :label='item.TEMP_TITLE' :key='item.TEMP_SEQ' :value='item.TEMP_SEQ'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主叫号码：">
          <el-checkbox :indeterminate="batchAddForm.isIndeterminate" v-model="batchAddForm.checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <el-checkbox-group v-model="batchAddForm.checkedTel" @change="handleCheckedTelChange">
            <el-checkbox v-for="item in batchAddForm.telArr" :label="item.simNum" :key="item.simNum" :value='item.simMachintCorde' style="width:180px;">{{item.simNum}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="计划时间：">
          <el-date-picker
            v-model="batchAddForm.dateArr"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width:370px">
          </el-date-picker>
        </el-form-item>
        <el-form-item width="120px">
          <label for="">排除休息时间：</label>
          <el-checkbox v-model="checkbox" label="12：00~14:00" name="type" style="width:150px;"></el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="plan = false">取消</el-button>
        <el-button type="primary" @click="plan = false;">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { baseUrl, Ajax } from "../../assets/api/api";
import { formatDate } from "../../assets/js/format";
import { isPoneAvailable } from "../../util/validate";
import axios from "axios";
export default {
  data() {
    return {
      uploadUrl: baseUrl + "/customer/putExcleData/",
      downloadUrl: baseUrl + "/customer/execleTemplate",
      isRange: false,
      topBtnGroupForm: {
        //表格上部分按钮组
        name: "",
        startTime: "",
        endTime: "",
        selectVal: "",
        options: [
          {
            value: 'A',
          },
          {
            value: 'B'
          },
          {
            value: 'C',
          },
          {
            value: 'D',
          },
          {
            value: 'E',
          },
          {
            value: 'F',
          }
        ]
      },
      batchAddForm: {
        //批量加入计划弹窗
        name: "",
        templete: [],
        selectVal: "",
        telArr: [],
        telOptions: [],
        checkedTel: [],
        checkAll: false,
        isIndeterminate: true,
        startTime: '',
        dateArr: "",
        startTime1: '',
        startTime2: '',
        endTime1: '',
        endTime2: '',
      },
      singleImportForm: {
        //单个信息导入弹窗
        name: "",
        phone: "",
        checked: false
      },
      checked: false,
      tableCount: 0,
      currentPage: 1,
      pageSize: 10,
      batchAdd: false,
      singleImport: false,
      batchImport: false,
      plan: false,
      planShow: false,
      checkbox: 1,
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      value2: "",
      value: "",
      value6: "",
      tableData: []
    };
  },
  created() {
    let mercSeq = sessionStorage.getItem("mercSeq");
    this.uploadUrl = this.uploadUrl + mercSeq;
    // 批量加入计划
    // 模板选择
    Ajax("/speechtemplate/getTemplateByMerchant", "post").then(res => {
      if (res.status == 0) {
        this.batchAddForm.templete = res.dataInfo;
      } else {
        // this.$message({
        //     type: 'error',
        //     message: '批量加入计划-模板选择数据加载有误'
        // });
      }
    });
    // 主叫号码
    Ajax("/sim/getSimNumByMerchant", "post").then(res => {
      if (res.status == 0) {
        this.batchAddForm.telArr = res.dataInfo;
        for (let i = 0; i < res.dataInfo.length; i++) {
          this.batchAddForm.telOptions.push(res.dataInfo[i].simNum);
        }
      } else {
        // this.$message({
        //     type: 'error',
        //     message: '批量加入计划-模板选择数据加载有误'
        // });
      }
    });
  },
  mounted() {
    this.tableInit();
  },
  methods: {
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
    batchAddShow() {
      let selectionData = this.$refs.multipleTable.selection;
      if (selectionData.length > 0) {
        this.batchAdd = true;
      } else {
        this.$message({
          type: "error",
          message: "请选择至少一条需要批量加入计划的数据"
        });
      }
    },
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.tableInit(this.currentPage);
    },
    formatDate(time) {
      if(time){
        var date = new Date(time);
        return formatDate(date, "yyyy-MM-dd hh:mm:ss");
      }else{
        return ''
      }

    },
    tableInit(page) {
      let that = this;
      let paramsForm = {
        page: page,
        size: this.pageSize,
        customerInfo: this.topBtnGroupForm.name,
        intention: this.topBtnGroupForm.selectVal,
        stateTime: this.topBtnGroupForm.startTime,
        endTime: this.topBtnGroupForm.endTime
      };
      Ajax("/customer", "get", paramsForm).then(res => {
        if (res.status == 0) {
          this.tableCount = res.count;
          res.dataInfo.forEach(function(ele, index) {
              ele.visit = "暂无拜访";
              if (ele.callTime !== "") {
                 let date = new Date(ele.callTime);
                 ele.callTime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
              }
          })
          this.tableData = res.dataInfo;
        } else {
        }
      })
      .catch(err => {
          console.log(err);
      });
    },
    handleCurrentChange(val) {
      this.tableInit(val);
    },
    handleDelete(index, row) {
      this.$confirm("是否确定删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          //确定
          let cusIds = []; //客户编号
          cusIds.push(row.CUS_SEQ);
          let params = new URLSearchParams();
          params.append("cusIds", cusIds);
          axios.post(baseUrl + "/customer/deleteCustomer", params).then(res => {
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
        })
        .catch(() => {
          //取消
        });
    },
    cc(response, file, fileList) {
      console.log(response);
      console.log(file);
      console.log(fileList);
    },
    dd(err, file, fileList) {
      console.log(err);
      console.log(file);
      console.log(fileList);
    },
    uploadSuccess() {
      this.$message({
        type: "success",
        message: "上传成功"
      });
      this.tableInit(this.currentPage);
    },
    uploadError() {
      this.$message({
        type: "error",
        message: "上传失败"
      });
    },
    yyf() {
      this.$refs.upload.submit();
      //  this.$refs.upload.clearFiles();
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
    batchAddConfirm() {
      let startTime1 = this.batchAddForm.startTime1;
      let startTime2 = this.batchAddForm.startTime2;
      let endTime1 = this.batchAddForm.endTime1;
      let endTime2 = this.batchAddForm.endTime2;
      if (this.batchAddForm.name) {
        if (this.batchAddForm.selectVal) {
          if (this.batchAddForm.checkedTel.length > 0) {
            if (this.batchAddForm.startTime) {
              if((startTime1&&endTime1)||(startTime2&&endTime2)){
                let templateId = this.batchAddForm.selectVal; //模板ID
                let templateName = "";
                this.batchAddForm.templete.map(function(currentValue) {
                  if (templateId == currentValue.TEMP_SEQ) {
                    templateName = currentValue.TEMP_TITLE;
                  }
                });
                let planName = this.batchAddForm.name; //计划名称
                let masterCallNum = this.batchAddForm.checkedTel; //主叫号码
                let statePlanTime = this.batchAddForm.startTime; //任务开始时间
                let cusIds = []; //客户编号

                let selectionData = this.$refs.multipleTable.selection;
                for (let i = 0; i < selectionData.length; i++) {
                  cusIds.push(selectionData[i].CUS_SEQ);
                }
                if(cusIds.length<this.batchAddForm.checkedTel.length){
                  console.log('cusIds.length:'+cusIds.length);
                  console.log('this.batchAddForm.checkedTel.length:'+this.batchAddForm.checkedTel.length);
                  this.$message({
                    type: "error",
                    message: "批量假如计划号码数不能超过主叫号码数量"
                  });
                }else{
                  let allowCallBeginTimeSlot = [];
                  allowCallBeginTimeSlot.push(startTime1);
                  allowCallBeginTimeSlot.push(startTime2);
                  let allowCallEndTimeSlot = [];
                  allowCallEndTimeSlot.push(endTime1);
                  allowCallEndTimeSlot.push(endTime2);
                  let params = new URLSearchParams();
                  params.append("templateId", templateId);
                  params.append("planName", planName);
                  params.append("masterCallNum", masterCallNum);
                  params.append("statePlanTime", statePlanTime);
                  params.append("cusIds", cusIds);
                  params.append("templateName", templateName);
                  params.append("allowCallBeginTimeSlot", allowCallBeginTimeSlot);
                  params.append("allowCallEndTimeSlot", allowCallEndTimeSlot);
                  axios.post(baseUrl + "/customer/batchAddPlan", params).then(res => {
                    if (res.data.status == 0) {
                      this.$message({
                        type: "success",
                        message: res.data.errorMsg
                      });
                      this.batchAdd = false;
                    } else {
                      this.$message({
                        type: "error",
                        message: res.data.errorMsg
                      });
                    }
                  }).catch(err => {
                    console.log(err);
                  });
                }
              }else{
                this.$message({
                  type: "error",
                  message: "请至少选择一组完整的允许拨打时间段"
                });
              }
            } else {
              this.$message({
                type: "error",
                message: "请选择计划生效时间"
              });
            }
          } else {
            this.$message({
              type: "error",
              message: "请选择主叫号码"
            });
          }
        } else {
          this.$message({
            type: "error",
            message: "请选择模板"
          });
        }
      } else {
        this.$message({
          type: "error",
          message: "请输入计划名称"
        });
      }
    },
    batchCancle() {
      let selectionData = this.$refs.multipleTable.selection;
      console.log(selectionData);
      if (selectionData.length == 0) {
        this.$message({
          type: "error",
          message: "请选择需取消计划的行"
        });
      } else {
        let templateId = []; //模板Id
        let telNum = []; //主叫号码
        for (let i = 0; i < selectionData.length; i++) {
          templateId.push(selectionData[i].TASK_SEQ);
          telNum.push(selectionData[i].CUS_TELEPHONE);
        }
        let params = new URLSearchParams();
        params.append("templateId", templateId);
        params.append("telNum", telNum);
        axios
          .post(baseUrl + "/customer/batchCancelPlan", params)
          .then(res => {
            if (res.data.status == 0) {
              this.$message({
                type: "success",
                message: res.data.errorMsg
              });
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
      this.$confirm("是否确定批量开放到公海？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          //确定
        let selectionData = this.$refs.multipleTable.selection;
        if (selectionData.length == 0) {
          this.$message({
            type: "error",
            message: "请至少选择一项需要批量开放到公海的数据"
          });
        } else {
          let cusIds = []; //客户编号
          for (let i = 0; i < selectionData.length; i++) {
            cusIds.push(selectionData[i].CUS_SEQ);
          }
          let params = new URLSearchParams();
          params.append("cusIds", cusIds);
          axios.post(baseUrl + "/customer/dataStatus", params).then(res => {
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
      }).catch(() => {
        //取消
      });
    },
    batchDelete() {
      this.$confirm("是否确定批量删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          //确定
        let selectionData = this.$refs.multipleTable.selection;
        if (selectionData.length == 0) {
          this.$message({
            type: "error",
            message: "请选择需要批量删除的数据"
          });
        } else {
          let cusIds = []; //客户编号
          for (let i = 0; i < selectionData.length; i++) {
            cusIds.push(selectionData[i].CUS_SEQ);
          }
          let params = new URLSearchParams();
          params.append("cusIds", cusIds);
          axios.post(baseUrl + "/customer/deleteCustomer", params).then(res => {
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
          }).catch(err => {
            console.log(err);
          });
        }
      }).catch(() => {
        //取消
      });
    },
    topBtnSearch() {
      this.currentPage = 1;
      let that = this;
      let paramsForm = {
        customerInfo: this.topBtnGroupForm.name,
        intention: this.topBtnGroupForm.selectVal,
        stateTime: this.topBtnGroupForm.startTime,
        endTime: this.topBtnGroupForm.endTime,
        size:this.pageSize,
        page:this.currentPage
      };
      this.tableInit(this.currentPage);
    },
    toPublicUser() {
      this.$router.push("/PublicUser");
    },
    singleImportConfirm() {
      let userName = this.singleImportForm.name;
      let userPhone = this.singleImportForm.phone;
      if (userPhone) {
        if (isPoneAvailable(userPhone)) {
          if (userName) {
            let paramsForm = {
              userName: userName,
              userPhone: userPhone
            };
            Ajax("/customer/addSoloCustomerInfo", "post", paramsForm).then(
              res => {
                if (res.status == 0) {
                  this.$message({
                    type: "success",
                    message: res.errorMsg
                  });
                  this.tableInit(this.currentPage);
                  this.singleImportForm = {
                    name: "",
                    phone: "",
                    checked: false
                  };
                  this.singleImport = false;
                } else {
                  this.$message({
                    type: "error",
                    message: res.errorMsg
                  });
                }
              }
            );
          } else {
            this.$message({
              type: "error",
              message: "请输入客户姓名"
            });
          }
        } else {
          this.$message({
            type: "error",
            message: "请输入正确格式手机号"
          });
        }
      } else {
        this.$message({
          type: "error",
          message: "请输入客户号码"
        });
      }
    }
  }
};
</script>
