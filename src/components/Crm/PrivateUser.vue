<template>
  <div class="main-wrap" style="width:100%;">
    <div class="main-hd">
      <div class="hd-title">私海用户</div>
    </div>
    <div class="main-card">
      <div class="grid-content bg-purple">
        <el-card class="box-card">
          <div class="card-content">
            <el-row :gutter="30" class="row-padding" style="width:100%;">
              <el-col :span="6">
                <div class="top"></div>
                <div class="bom">
                  <div class="title">180天</div>
                  <div class="con">您的套餐剩余时间</div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="top"></div>
                <div class="bom">
                  <div class="title">180天</div>
                  <div class="con">您的套餐剩余时间</div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="top"></div>
                <div class="bom">
                  <div class="title">180天</div>
                  <div class="con">您的套餐剩余时间</div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="list-box">
                  <el-button class="list" @click="singleImport = true">导入单个信息</el-button>
                  <el-button class="list" @click="batchImport = true">批量导入信息</el-button>
                  <el-button class="list" @click="toPublicUser">前往公海拉取</el-button>
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
          <el-input v-model="topBtnGroupForm.name" style="width:150px;"></el-input>
        </el-form-item>
        <el-form-item label="状态" style="margin-bottom:0;">
          <el-select v-model="topBtnGroupForm.selectVal" placeholder="请选择"  style="width:150px;">
            <el-option
              v-for="item in topBtnGroupForm.options"
              :key="item.value"
              :label="item.label"
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
          prop="CUS_WITH"
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
              @click="plan = true;">计划</el-button>
            <el-button
              type="text"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="TASK_NAME"
          label="拨打模板">
        </el-table-column> -->
        <!-- <el-table-column
          prop="CUS_LAST_CALL"
          label="最后计划时间">
        </el-table-column> -->
        <el-table-column
          prop="ENTER_TIME"
          label="添加时间">
        </el-table-column>
        <el-table-column
          label="历史累计通话次数">
          <template slot-scope="scope">
            <div class="cell">{{ scope.row.CALL_COUNT }}<el-button v-show="scope.row.CALL_COUNT>0?true:false" type="text" style="margin-left:10px">查看</el-button></div>
          </template>
        </el-table-column>
        <el-table-column
          prop="CREATER_TIME"
          label="最近拜访">
        </el-table-column>
        <el-table-column
          prop="CUS_OWN"
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
        <el-button type="primary" @click="batchAdd = true">批量加入计划</el-button>
        <el-button type="info" @click="batchCancle" disabled>批量取消计划</el-button>
        <el-button type="primary" @click="batchPublic">批量开放到公海</el-button>
        <el-button type="danger" @click="batchDelete">批量删除</el-button>
      </el-form>
    </div>
    <!-- 批量加入计划-弹窗 -->
    <el-dialog class="dialog" title="拨号计划" :visible.sync="batchAdd" width="500px">
      <el-form :model="batchAddForm">
        <el-form-item label="计划名称：">
          <el-input v-model="batchAddForm.name" style="width:370px;"></el-input>
        </el-form-item>
        <el-form-item label="模板选择：">
          <el-select v-model="batchAddForm.selectVal" placeholder="" style="width:370px;">
            <el-option v-for='item in batchAddForm.templete' :label='item.TEMP_TITLE' :key='item.TEMP_SEQ' :value='item.TEMP_SEQ'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主叫号码：">
          <el-checkbox :indeterminate="batchAddForm.isIndeterminate" v-model="batchAddForm.checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <el-checkbox-group v-model="batchAddForm.checkedTel" @change="handleCheckedTelChange">
            <el-checkbox v-for="item in batchAddForm.telArr" :label="item.simNum" :key="item.simMachintCorde" :value='item.simMachintCorde' style="width:180px;">{{item.simNum}}</el-checkbox>
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
          <el-checkbox v-model="checkbox" label="12：00~14:00" name="type" style="width:170px;"></el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="batchAdd = false">取消</el-button>
        <el-button type="primary" @click="batchAdd = false; batchAddConfirm()">确定</el-button>
      </div>
    </el-dialog>
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
     <!-- 拨号计划-弹窗 -->
    <el-dialog class="dialog" title="拨号计划" :visible.sync="plan" width="500px">
      <el-form :model="batchAddForm">
        <el-form-item label="计划名称：">
          <el-input v-model="batchAddForm.name" style="width:370px;"></el-input>
        </el-form-item>
        <el-form-item label="模板选择：">
          <el-select v-model="batchAddForm.selectVal" placeholder="" style="width:370px;">
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
          <el-checkbox v-model="checkbox" label="12：00~14:00" name="type" style="width:170px;"></el-checkbox>
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
  import {commonAjax} from "../../api/api";
  import {formatDate} from '../../../static/js/format';
  import axios from 'axios';
  export default {
    data() {
      return {
        topBtnGroupForm:{//表格上部分按钮组
          name: '',
          startTime: '',
          endTime: '',
          selectVal: '',
          options: [{
            value: '计划执行中'
          }, {
            value: '计划取消 '
          }, {
            value: '计划完成'
          }, {
            value: '计划失败'
          }],
        },
        batchAddForm:{ //批量加入计划弹窗
          name: '',
          templete: [],
          selectVal: '',
          telArr: [],
          telOptions: [],
          checkedTel:[],
          checkAll: false,
          isIndeterminate: true,
          dateArr: ''
        },
        singleImportForm:{//单个信息导入弹窗
          name: '',
          phone: '',
          checked: false
        },
        checked: false,
        tableCount: 0,
        currentPage: 1,
        batchAdd: false,
        singleImport: false,
        batchImport: false,
        plan: false,
        planShow: false,
        checkbox:1,
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
        value2: '',
        value: '',
        value6: '',
        tableData: [
          {
            CUS_TELEPHONE: '',//客户手机号
            CUS_NAME: '',//客户姓名
            CUS_WITH: '',//意向
            TASK_NAME: '',//拨打模板
            CUS_LAST_CALL: '',//最后计划时间
            ENTER_TIME: '',//添加时间
            CALL_COUNT:'',//历史累计通话次数
            CREATER_TIME: '',//最近拜访
            CUS_OWN: ''//所属者
          }
        ]
      };
    },
    created(){
      // 批量加入计划
      // 模板选择
      commonAjax('/speechtemplate/getTemplateByMerchant', 'post').then(res => {
        if (res.resultCode  == 0) {
           this.batchAddForm.templete = res.dataInfo;
        } else {
          this.$message({
              type: 'error',
              message: '批量加入计划-模板选择数据加载有误'
          });
        }
      });
      // 主叫号码
      commonAjax('/sim/getSimNumByMerchant', 'post').then(res => {
        if (res.resultCode  == 0) {
          this.batchAddForm.telArr = res.dataInfo;
          for(let i=0;i<res.dataInfo.length;i++){
            this.batchAddForm.telOptions.push(res.dataInfo[i].simNum);
          }
        } else {
          this.$message({
              type: 'error',
              message: '批量加入计划-模板选择数据加载有误'
          });
        }
      });
    },
    mounted(){
      this.tableInit();
    },
    methods: {
      formatDate(time) {
          var date = new Date(time);
          return formatDate(date, "yyyy-MM-dd hh:mm:ss");
      },
      tableInit(page){
        let that = this;
        let paramsForm = {
          page: page,
          size: 10
        }
        commonAjax('/customer', 'get',paramsForm).then(res => {
          if (res.dataInfo.length > 0) {
            that.tableCount = res.count;
            let tableData = res.dataInfo;
            tableData.map(function(currentValue,index){
              if(currentValue.CUS_LAST_CALL){
                tableData[index].CUS_LAST_CALL = that.formatDate(currentValue.CUS_LAST_CALL);
              }

              if(currentValue.ENTER_TIME){
                tableData[index].ENTER_TIME = that.formatDate(currentValue.ENTER_TIME)
              }

              if(currentValue.CREATER_TIME){
                tableData[index].CREATER_TIME = that.formatDate(currentValue.CREATER_TIME)
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
      handleCurrentChange(val) {
        this.tableInit(val);
      },
      handleDelete(index,row){
        this.$confirm('是否确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).then(() => {
            //确定
            let cusIds = [];//客户编号
            cusIds.push(row.CUS_SEQ);
            let params = new URLSearchParams();
            params.append('cusIds', cusIds);
            axios.post('http://192.168.1.251:9001/merchant.call/customer/deleteCustomer', params, ).then(res => {
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
        }).catch(() => {
            //取消
        })
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
      handleCheckAllChange(val) {
        this.batchAddForm.checkedTel = val ? this.batchAddForm.telOptions : [];
        this.batchAddForm.isIndeterminate = false;
      },
      handleCheckedTelChange(value) {
        let checkedCount = value.length;
        this.batchAddForm.checkAll = checkedCount === this.batchAddForm.telArr.length;
        this.batchAddForm.isIndeterminate = checkedCount > 0 && checkedCount < this.batchAddForm.telArr.length;
      },
      batchAddConfirm(){
        if(this.batchAddForm.name){
          if(this.batchAddForm.selectVal){
            if(this.batchAddForm.checkedTel.length>0){
              if(this.batchAddForm.dateArr.length == 2){
                let templateId = this.batchAddForm.selectVal; //模板ID
                let planName = this.batchAddForm.name; //计划名称
                let masterCallNum = this.batchAddForm.checkedTel; //主叫号码
                let statePlanTime = this.batchAddForm.dateArr[0]; //任务开始时间
                let endPlanTime = this.batchAddForm.dateArr[1]; //任务结束时间
                let cusIds = []; //客户编号
                
                let selectionData = this.$refs.multipleTable.selection;
                for(let i=0;i<selectionData.length;i++){
                  cusIds.push(selectionData[i].CUS_SEQ)
                }

                let params = new URLSearchParams();
                params.append('templateId', templateId);
                params.append('planName', planName);
                params.append('masterCallNum', masterCallNum);
                params.append('statePlanTime', statePlanTime);
                params.append('endPlanTime', endPlanTime);
                params.append('cusIds', cusIds);
                axios.post('http://192.168.1.251:9001/merchant.call/customer/batchAddPlan', params, ).then(res => {
                    if (res.data.resultCode == 0) {
                        this.$message({
                            type: 'success',
                            message: res.data.resultMsg
                        });
                    } else{
                      this.$message({
                          type: 'error',
                          message: res.data.resultMsg
                      });
                    };
                }).catch(err => {
                    console.log(err);
                })
              }else{
                  this.$message({
                  type: 'error',
                  message: '请选择计划时间'
                });
              }
            }else{
              this.$message({
                type: 'error',
                message: '请选择主叫号码'
              });
            }
          }else{
            this.$message({
              type: 'error',
              message: '请选择模板'
            });
          }
        }else{
          this.$message({
              type: 'error',
              message: '请输入计划名称'
          });
        }
      },
      batchCancle(){
        let selectionData = this.$refs.multipleTable.selection;
        console.log(selectionData);
        if(selectionData.length==0){
          this.$message({
              type: 'error',
              message: '请选择需取消计划的行'
          });
        }else{
          let templateId = [];//模板Id
          let telNum = [];//主叫号码
          for(let i=0;i<selectionData.length;i++){
            templateId.push(selectionData[i].TASK_SEQ);
            telNum.push(selectionData[i].CUS_TELEPHONE);
          }
          let params = new URLSearchParams();
          params.append('templateId', templateId);
          params.append('telNum', telNum);
          axios.post('http://192.168.1.251:9001/merchant.call/customer/batchCancelPlan', params, ).then(res => {
              if (res.data.resultCode == 0) {
                  this.$message({
                      type: 'success',
                      message: res.data.resultMsg
                  });
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
          let cusIds = [];//客户编号
          for(let i=0;i<selectionData.length;i++){
            cusIds.push(selectionData[i].CUS_SEQ);
          }
          let params = new URLSearchParams();
          params.append('cusIds', cusIds);
          axios.post('http://192.168.1.251:9001/merchant.call/customer/dataStatus', params, ).then(res => {
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
      batchDelete(){
        let selectionData = this.$refs.multipleTable.selection;
        if(selectionData.length==0){
          this.$message({
              type: 'error',
              message: '请选择需要批量删除的数据'
          });
        }else{
          let cusIds = [];//客户编号
          for(let i=0;i<selectionData.length;i++){
            cusIds.push(selectionData[i].CUS_SEQ);
          }
          let params = new URLSearchParams();
          params.append('cusIds', cusIds);
          axios.post('http://192.168.1.251:9001/merchant.call/customer/deleteCustomer', params, ).then(res => {
              if (res.data.resultCode == 0) {
                  this.$message({
                      type: 'success',
                      message: res.data.resultMsg
                  });
                  that.currentPage = 1;
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
      topBtnSearch(){
        let that = this;
        let paramsForm = {
          customerInfo: this.topBtnGroupForm.name,
          status: this.topBtnGroupForm.selectVal,
          stateTime: this.topBtnGroupForm.startTime,
          endTime: this.topBtnGroupForm.endTime,
        }
        commonAjax('/customer/customerCondition', 'get',paramsForm).then(res => {
          if (res.dataInfo.length > 0) {
            that.tableCount = res.count;
            let tableData = res.dataInfo;
            tableData.map(function(currentValue,index){
              if(currentValue.CUS_LAST_CALL){
                tableData[index].CUS_LAST_CALL = that.formatDate(currentValue.CUS_LAST_CALL);
              }

              if(currentValue.ENTER_TIME){
                tableData[index].ENTER_TIME = that.formatDate(currentValue.ENTER_TIME)
              }

              if(currentValue.CREATER_TIME){
                tableData[index].CREATER_TIME = that.formatDate(currentValue.CREATER_TIME)
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
      toPublicUser(){
        this.$router.push('/PublicUser');
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
      }
    }
  };
</script>

<style lang="scss">
  .main-wrap{
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
        height: 40px;
        background: #E4E7ED url(/static/images/icon.png) no-repeat center /26px auto;
      }
    
      .bom {
        height: 108px;
        background-color: #f2f6fc;
        text-align: center;
        line-height: 24px;
        padding: 21px 0;
        .title{
          font-weight: bold;
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
    
    .el-date-editor.el-input{
      width: 190px;
    }

    .main-table{
      flex: 1;
      background-color: #fff;
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

