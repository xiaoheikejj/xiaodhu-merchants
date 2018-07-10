<template>
  <div style="width:100%;">
    <div class="main-hd">
      <div class="hd-title"><span class="return" @click="returnRouter"></span>权限配置</div>
      <div class="hd-btnGroup">
        <el-button type="primary">新增权限角色</el-button>
      </div>
    </div>
    <div class="top-btnGroup">
      <el-form ref="form" :inline="true" :model="form">
        <el-form-item label="角色名称：" style="margin-bottom:0;">
          <el-input v-model="form.name"></el-input>
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
          prop="no"
          label="编号">
        </el-table-column>
        <el-table-column
          prop="name"
          label="角色名称">
        </el-table-column>
        <el-table-column
          prop="status"
          label="权限预览">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="text"
              @click="handleEdit(scope.$index, scope.row)">修改</el-button>
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
      returnRouter(){
        this.$router.push('/accountMan');
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
    padding-left: 40px;
    position: relative;
    .return{
      display: block;
      cursor: pointer;
      width: 40px;
      height: 40px;
      background: url(/static/images/return.png) no-repeat 0 center / 36px auto;
      position: absolute;
      left: 0;
      top: 10px;
    }
    
  }

  .hd-btnGroup{
    height: 32px;
    width: 100px;
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

