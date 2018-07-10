<template>
  <div style="width:100%;">
    <div class="main-hd">
      <div class="hd-title">子账户管理</div>
      <div class="hd-btnGroup">
        <el-button type="primary">新增</el-button>
        <el-button type="primary" @click="idconfig">权限配置</el-button>
      </div>
    </div>
    <div class="top-btnGroup">
      <el-form ref="form" :inline="true" :model="form">
        <el-form-item label="名称/编号：" style="margin-bottom:0;">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="用户角色权限" style="margin-bottom:0;">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary">搜索</el-button>
      </el-form>
    </div>
    <div class="main-table">
      <el-table
        :data="tableData"
        stripe
        style="width: 100%">
         <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="no"
          label="用户编号">
        </el-table-column>
        <el-table-column
          prop="name"
          label="用户名称">
        </el-table-column>
        <el-table-column
          prop="status"
          label="用户权限角色">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="text"
              @click="handleEdit(scope.$index, scope.row)">修改</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.$index, scope.row)">重置密码</el-button>
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
          no: '176000000',
          name: '木灵希',
          status: '运营专员'
        },{
          no: '176000000',
          name: '木灵希',
          status: '运营专员'
        },{
          no: '176000000',
          name: '木灵希',
          status: '运营专员'
        },{
          no: '176000000',
          name: '木灵希',
          status: '运营专员'
        },{
          no: '176000000',
          name: '木灵希',
          status: '运营专员'
        }, {
          no: '176000000',
          name: '木灵希',
          status: '运营专员'
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
    methods: {
      idconfig(){
        this.$router.push('/idConfig');
      },
    }
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

  .hd-btnGroup{
    height: 32px;
    width: 152px;
    position: absolute;
    top: 14px;
    right: 20px;
  }

  .top-btnGroup{
    padding: 20px 20px;
    background-color: #fff;
    margin: 14px 0;
  }
</style>

