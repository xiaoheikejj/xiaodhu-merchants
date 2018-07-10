<template>
  <div style="width:100%;">
    <div class="main-hd">
      <div class="hd-title">拜访计划</div>
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
            </el-row>
          </div>
        </el-card>
      </div>
    </div>
    <div class="top-btnGroup">
      <el-form ref="form" :inline="true" :model="form">
        <el-form-item label="客户信息：" style="margin-bottom:0;">
          <el-input v-model="form.name" style="width:120px;"></el-input>
        </el-form-item>
        <el-form-item label="状态：" style="margin-bottom:0;">
          <el-select v-model="value" placeholder="请选择" style="width:120px;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="意向：" style="margin-bottom:0;">
          <el-select v-model="value" placeholder="请选择"  style="width:120px;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="拜访时间：" style="margin-bottom:0;">
          <el-date-picker
            v-model="value6"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-button type="primary">搜索</el-button>
        <el-button type="primary">导出</el-button>
      </el-form>
    </div>
    <div class="main-table">
      <el-table
        :data="tableData"
        stripe
        style="width: 100%">
        <el-table-column
          prop="info"
          label="客户信息">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
        </el-table-column>
        <el-table-column
          prop="order"
          label="意向">
        </el-table-column>
        <el-table-column
          prop="explain"
          label="意向说明">
        </el-table-column>
        <el-table-column
          prop="template"
          label="使用模板">
        </el-table-column>
        <el-table-column
          prop="date"
          label="计划时间">
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="handleEdit(scope.$index, scope.row)">标记</el-button>
            <el-button
              type="text"
              @click="handleDelete(scope.$index, scope.row)">再次拜访</el-button>
            <el-button
              type="text"
              @click="handleDelete(scope.$index, scope.row)">历史通话</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
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
          info: '176000000',
          status: '已拜访',
          order: 'A',
          explain: '176000000',
          template:'模板A',
          date: '2016-05-02',
          num: '17321083305',
          remark: '已初步确定，待下一步沟通'
        }, {
          info: '176000000',
          status: '已拜访',
          order: 'A',
          explain: '176000000',
          template:'模板A',
          date: '2016-05-02',
          num: '17321083305',
          remark: '已初步确定，待下一步沟通'
        }, {
          info: '176000000',
          status: '已拜访',
          order: 'A',
          explain: '176000000',
          template:'模板A',
          date: '2016-05-02',
          num: '17321083305',
          remark: '已初步确定，待下一步沟通'
        }, {
          info: '176000000',
          status: '已拜访',
          order: 'A',
          explain: '176000000',
          template:'模板A',
          date: '2016-05-02',
          num: '17321083305',
          remark: '已初步确定，待下一步沟通'
        }, {
          info: '176000000',
          status: '已拜访',
          order: 'A',
          explain: '176000000',
          template:'模板A',
          date: '2016-05-02',
          num: '17321083305',
          remark: '已初步确定，待下一步沟通'
        }, {
          info: '176000000',
          status: '已拜访',
          order: 'A',
          explain: '176000000',
          template:'模板A',
          date: '2016-05-02',
          num: '17321083305',
          remark: '已初步确定，待下一步沟通'
        }],
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
    methods: {}
  };
</script>

<style lang="scss" scoped>

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

  .main-card{
    margin-top: 14px;
  }

  .card-content {
    .el-col {
      height: 148px;
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
</style>

