<template>
  <div style="width:100%;">
    <div class="main-hd">
      <div class="hd-title">通话记录</div>
    </div>
    <div class="top-btnGroup">
      <el-form ref="form" :inline="true" :model="form">
        <el-form-item label="客户信息：" style="margin-bottom:0;">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="意向：" style="margin-bottom:0;">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商户入网时间：" style="margin-bottom:0;">
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
          label="拨打时间">
        </el-table-column>
        <el-table-column
          prop="num"
          label="主叫号码">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="text"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
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
          order: 'A',
          explain: '176000000',
          template:'模板A',
          date: '2016-05-02',
          num: '17321083305',
        }, {
          info: '176000000',
          order: 'A',
          explain: '176000000',
          template:'模板A',
          date: '2016-05-02',
          num: '17321083305',
        }, {
          info: '176000000',
          order: 'A',
          explain: '176000000',
          template:'模板A',
          date: '2016-05-02',
          num: '17321083305',
        }, {
          info: '176000000',
          order: 'A',
          explain: '176000000',
          template:'模板A',
          date: '2016-05-02',
          num: '17321083305',
        }, {
          info: '176000000',
          order: 'A',
          explain: '176000000',
          template:'模板A',
          date: '2016-05-02',
          num: '17321083305',
        }, {
          info: '176000000',
          order: 'A',
          explain: '176000000',
          template:'模板A',
          date: '2016-05-02',
          num: '17321083305',
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
</style>

