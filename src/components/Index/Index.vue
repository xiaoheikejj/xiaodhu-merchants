<template>
  <div style="padding:24px 12px;width:100%;">
    <el-row :gutter="24" style="width:100%;">
      <el-col :span="14">
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="card-title">账户概览</span>
            </div>
            <div class="card-content">
              <el-row :gutter="30" style="width:100%;">
                <el-col :span="8">
                  <div class="top"></div>
                  <div class="bom">
                    <div class="title">180天</div>
                    <div class="con">您的套餐剩余时间</div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="top"></div>
                  <div class="bom">
                    <div class="title">180天</div>
                    <div class="con">您的套餐剩余时间</div>
                  </div>
                </el-col>
                <el-col :span="8">
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
      </el-col>
      <el-col :span="10">
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="card-title">事件提醒</span>
            </div>
            <div class="card-content">
              <div class="list">
                <span class="left">待执行拨号计划</span>
                <span class="right">20</span>
              </div>
              <div class="list">
                <span class="left">待执行拨号计划</span>
                <span class="right">20</span>
              </div>
              <div class="list">
                <span class="left">待执行拨号计划</span>
                <span class="right">20</span>
              </div>
            </div>
        </el-card> 
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
       
      }
    },
    methods: {
      
    }
  }
</script>

<style lang="scss" scoped>
  .el-row {
    margin: 0 !important;
  }
  .card-title{
    color: #606266;
  }
  .card-content{
    height: 148px;
    .el-col{
      height: 148px;
    }
    .top{
      height: 40px;
      background: #E4E7ED url(/static/images/icon.png) no-repeat center /26px auto;
    }
    .bom{
      height: 108px;
      background-color: #F2F6FC;
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
  .list{
    background-color: #f0f3f6;
    margin-bottom: 20px;
    height: 36px;
    line-height: 36px;
    display: flex;
    padding: 0 10px;
    &:last-child{
      margin-bottom: 0;
    }
    .left{
      width: 70%;
      color: #909399;
    }
    .right{
      flex: 1;
      text-align: right;
      color: #3399ff;
      font-weight: bold;
    }
  }
</style>

