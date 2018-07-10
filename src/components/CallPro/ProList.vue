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
          <el-input v-model="topBtnGroupForm.num" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态" style="margin-bottom:0;">
          <el-select v-model="topBtnGroupForm.selectVal" placeholder="请选择"  style="width:150px;" clearable>
            <el-option
              v-for="item in topBtnGroupForm.options"
              :key="item.value"
              :label="item.value"
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
            clearable>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="-" style="margin-bottom:0;">
          <el-date-picker
            v-model="topBtnGroupForm.endTime"
            type="datetime"
            placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
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
        <el-table-column
          prop="status"
          label="状态">
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
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="10"
        layout="total, prev, pager, next"
        :total="tableCount">
      </el-pagination>
    </div>
    <!-- 导入单个信息-弹窗 -->
    <el-dialog class="batch-add-dialog" title="单个信息导入" :visible.sync="singleImport" width="400px">
      <el-form :model="singleImportForm">
        <el-form-item label="客户电话：">
          <el-input v-model="singleImportForm.phone" style="width:250px;" clearable></el-input>
        </el-form-item>
        <el-form-item label="客户姓名：">
          <el-input v-model="singleImportForm.name" style="width:250px;" clearable></el-input>
        </el-form-item>
        <el-form-item label=" " style="margin-left:90px;">
          <el-checkbox v-model="singleImportForm.checked" label="同时加入计划" name="type" style="width:170px;"></el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="singleImport = false">取 消</el-button>
        <el-button type="primary" @click="singleImport = false;singleImportConfirm()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 批量导入信息-弹窗 -->
    <el-dialog class="dialog batch-import-dialog" title="批量信息导入" :visible.sync="batchImport" width="400px">
      <div class="batch-import-title">请下载模板后将批量导入的客户信息填写完成后批量上传</div>
      <el-upload
        class="upload-demo"
        ref="upload"
        action="http://192.168.1.251:9001/merchant.call/customer/putExcleData"
        :on-preview="cc"
        :on-remove="dd"
        :on-success = "uploadSuccess"
        :on-error = "uploadError"
        :auto-upload="false">
        <el-button class="el-btn" slot="trigger" size="small" style="margin:15px 0;">上传文件</el-button>
      </el-upload>
      <a class="el-btn download" href="http://192.168.1.251:9001/merchant.call/customer/execleTemplate">客户端模板下载</a>  
      <el-checkbox label="去前缀+86" name="type" style="width:300px;"></el-checkbox>
      <el-checkbox label="同时加入计划" name="type" style="width:300px;"></el-checkbox>
      <div slot="footer" class="dialog-footer">
        <el-button @click="batchImport = false">取 消</el-button>
        <el-button type="primary" @click="batchImport = false;yyf()">确定</el-button>
      </div>
    </el-dialog>
  </div>
  
</template>

<script>
import {commonAjax} from "../../api/api";
  export default {
    data() {
      return {
        topBtnGroupForm:{//表格上部分按钮组
          num: '',
          startTime: '',
          endTime: '',
          selectVal: '',
          options: [{
            value: '计划执行中',
          }, {
            value: '计划取消 ',
          }, {
            value: '计划完成',
          }, {
            value: '计划失败',
          }],
        },
        singleImport:false,
        singleImportForm:{//单个信息导入弹窗
          name: '',
          phone: '',
          checked: false
        },
        batchImport:false,
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
        tableData: [{
          "taskSeq": '',//计划编号
          "taskRemark": '',//计划名称
          "status": '', //状态
          "taskDetailCount": '', //总拨号数量
          "taskNotexecute": '', //剩余拨号数量
          "tempName": '', //模版名称
          "taskBegin": '', //计划开始时间

          "taskCreateTime": '', //创建时间
          "taskCreator": '', //创建人
          "taskEnd": '', //计划结束时间
          "tempSeq": '', //模版编号
          "mercName": '', //商户名称
          "mercSeq": '', //商户编号
        }],
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
    created(){
      // commonAjax('/callTask/queryTaskInfoList', 'post').then(res => {
      //   if (res.resultCode  == 0) {
           
      //   } else {
      //     this.$message({
      //         type: 'error',
      //         message: '批量加入计划-模板选择数据加载有误'
      //     });
      //   }
      // });
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
        commonAjax('/callTask/queryTaskInfoList', 'post',paramsForm).then(res => {
          if (res.resultCode  == 0) {
            that.tableCount = res.count;
          } else {
            this.$message({
                type: 'error',
                message: '表格数据初始化有误'
            });
          }
          if (res.dataInfo.length > 0) {
            that.tableCount = res.count;
            // that.tableData = res.dataInfo;
            let tableData = res.dataInfo;
            tableData.map(function(currentValue,index){
              if(currentValue.status == 0){
                tableData[index].status = '计划完成';
              }else if(currentValue.status == 1){
                tableData[index].status = '计划执行中';
              }else if(currentValue.status == 2){
                tableData[index].status = '计划取消';
              }else if(currentValue.status == 3){
                tableData[index].status = '计划失败';
              }else{
                tableData[index].status = '';
              }
            })
            this.tableData = tableData;
          } else {
            this.$message({
                type: 'error',
                message: '表格数据初始化有误'
            });
          }
        });
      },
      toPrivateUser(){
        this.$router.push('/privateUser');
      },
      handleCheck(index,row){
        sessionStorage.setItem('taskSeq',row.taskSeq);
        this.$router.push('/planDetail');
      },
      handleCurrentChange(val) {
        this.tableInit(val);
      },
      topBtnSearch(){
        let that = this;
        let paramsForm = {
          taskSeq: this.topBtnGroupForm.num,
          status: this.topBtnGroupForm.selectVal,
          stateTime: this.topBtnGroupForm.startTime,
          endTime: this.topBtnGroupForm.endTime,
        }
        commonAjax('/callTask/queryTaskInfoList', 'post',paramsForm).then(res => {
          if (res.dataInfo.length > 0) {
            that.tableCount = res.count;
            let tableData = res.dataInfo;
            tableData.map(function(currentValue,index){
              if(currentValue.status == 0){
                tableData[index].status = '计划完成';
              }else if(currentValue.status == 1){
                tableData[index].status = '计划执行中';
              }else if(currentValue.status == 2){
                tableData[index].status = '计划取消';
              }else if(currentValue.status == 3){
                tableData[index].status = '计划失败';
              }else{
                tableData[index].status = '';
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
      singleImportConfirm(){
        console.log(this.singleImportForm)
        let userName = this.singleImportForm.name;
        let userPhone = this.singleImportForm.phone;
        if(userPhone){
          if(userName){
            let paramsForm = {
              userName: userPhone,
              userPhone: userPhone
            }
            commonAjax('/customer/addSoloCustomerInfo', 'post',paramsForm).then(res => {
              if (res.resultCode == 0) {
                  this.$message({
                      type: 'success',
                      message: res.resultMsg
                  });
                  this.singleImportForm = {
                                            name: '',
                                            phone: '',
                                            checked: false
                                          };
              } else {
                  this.$message({
                      type: 'error',
                      message: res.resultMsg
                  });
              }
          });
          }else{
            this.$message({
              type: 'error',
              message: '请输入客户姓名'
            });
          }
        }else{
          this.$message({
              type: 'error',
              message: '请输入客户号码'
          });
        }
      },
      cc(response, file, fileList){
        console.log(response);
        console.log(file)
        console.log(fileList);
        
      },
      dd(err, file, fileList){
        console.log(err);
        console.log(file)
        console.log(fileList);
      },
      uploadSuccess(){
        this.$message({
            type: 'success',
            message: '上传成功'
        });
      },
      uploadError(){
        this.$message({
            type: 'error',
            message: '上传失败'
        });
      },
      yyf(){
         this.$refs.upload.submit();
        //  this.$refs.upload.clearFiles();
      },
    }
  };
</script>

<style lang="scss">
  #ProList{
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
    .pagination{
      text-align: center;
      padding: 10px 0;
      background-color: #fff;
    }
    .el-dialog__header{
      border-bottom: 1px solid #E4E7ED;
    }
    .cell{
      text-align: center;
    }
    .dialog{
      .el-form-item__label{
        width: 90px;
      }
      .el-checkbox-group{
        margin-left: 90px;
      }
      .el-checkbox+.el-checkbox {
          margin-left: 0;
      }
      &.batch-import-dialog{
        .el-dialog__body{
          padding: 10px 20px 10px;
        }
        .el-btn{
          width: 100%;
          font-size: 16px;
          &.download{
            text-align: center;
            display: block;
            color: #409EFF;
            background: 0 0;
            padding-left: 0;
            padding-right: 0;
            padding: 9px 15px;
            border-radius: 3px;
            font-size: 16px;
          }
        }

        .batch-import-title{
          color: #909399;
          text-align: center;
        }

      }
    }
    .el-upload{
      width:100%;
    }
  }
</style>

