<template>
  <div id="ProList" style="width:100%;">
    <div class="main-hd">
      <div class="hd-title">计划列表</div>
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
              <el-col :span="6">
                <div class="list-box">
                  <el-button class="list" @click="singleImport = true">导入单个信息</el-button>
                  <el-button class="list" @click="batchImport = true">批量导入信息</el-button>
                  <el-button class="list" @click="toPrivateUser">前往私海定制</el-button>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </div>
    </div>
    <div class="top-btnGroup">
      <el-form ref="form" :inline="true" :model="form">
        <el-form-item label="计划编号：" style="margin-bottom:0;">
          <el-input v-model="topBtnGroupForm.num" placeholder="请输入计划编号" maxlength="30" style="width:150px;" clearable></el-input>
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
        <el-form-item label="计划时间：" style="margin-bottom:0;">
          <el-date-picker
            v-model="topBtnGroupForm.startTime"
            type="date"
            placeholder="开始日期"
            value-format="yyyy-MM-dd"
            clearable>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="-" style="margin-bottom:0;">
          <el-date-picker
            v-model="topBtnGroupForm.endTime"
            type="date"
            placeholder="结束日期"
            value-format="yyyy-MM-dd"
            clearable>
          </el-date-picker>
        </el-form-item>
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
          prop="taskSeq"
          label="计划编号">
        </el-table-column>
        <el-table-column
          prop="taskRemark"
          label="计划名称">
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">{{trStatus(scope.row.status)}}</template>
        </el-table-column>
        <!-- <el-table-column
          prop="num"
          label="A标签数量">
        </el-table-column> -->
        <el-table-column
          prop="taskDetailCount"
          label="总拨号数量">
        </el-table-column>
        <el-table-column
          prop="taskNotexecute"
          label="剩余拨号数量">
        </el-table-column>
        <el-table-column
          prop="tempName"
          label="拨打模板">
        </el-table-column>
        <el-table-column
          prop="taskBegin"
          label="计划时间">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              v-show="scope.row.tempSeq>0?true:false"
              @click="handleCheck(scope.$index, scope.row)">查看</el-button>
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
  </div>
  
</template>

<script>
import { baseUrl, Ajax } from "../../assets/api/api";
import { isPoneAvailable } from "../../util/validate";
export default {
  data() {
    return {
      uploadUrl: baseUrl + "/customer/putExcleData/",
      downloadUrl: baseUrl + "/customer/execleTemplate",
      topBtnGroupForm: {
        //表格上部分按钮组
        num: "",
        startTime: "",
        endTime: "",
        selectVal: "",
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
        ]
      },
      singleImport: false,
      singleImportForm: {
        //单个信息导入弹窗
        name: "",
        phone: "",
        checked: false
      },
      batchImport: false,
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
      value: "",
      value6: "",
      tableData: [],
      tableCount: 0,
      pageSize: 10,
      currentPage: 1
    };
  },
  created() {
    let mercSeq = sessionStorage.getItem("mercSeq");
    this.uploadUrl = this.uploadUrl + mercSeq;
  },
  mounted() {
    this.tableInit();
  },
  methods: {
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.tableInit(this.currentPage);
    },
    tableInit(page) {
      let that = this;
      let paramsForm = {
        page: page,
        size: this.pageSize,
        taskSeq: this.topBtnGroupForm.num,
        status: this.topBtnGroupForm.selectVal,
        stateTime: this.topBtnGroupForm.startTime,
        endTime: this.topBtnGroupForm.endTime
      };
      Ajax("/callTask/queryTaskInfoList", "post", paramsForm).then(res => {
        if (res.status == 0) {
          this.tableCount = res.count;
          this.tableData = res.dataInfo;
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
      this.$router.push("/privateUser");
    },
    handleCheck(index, row) {
      sessionStorage.setItem("taskSeq", row.taskSeq);
      this.$router.push("/planDetail");
    },
    handleCurrentChange(val) {
      this.tableInit(val);
    },
    topBtnSearch() {
      let that = this;
      let paramsForm = {
        taskSeq: this.topBtnGroupForm.num,
        status: this.topBtnGroupForm.selectVal,
        stateTime: this.topBtnGroupForm.startTime,
        endTime: this.topBtnGroupForm.endTime
      };
      this.currentPage = 1;
      this.tableInit(this.currentPage);
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
    }
  }
};
</script>