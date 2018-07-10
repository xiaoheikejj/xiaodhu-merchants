<template>
    <div class="header">
        <h1 class="title">小电呼商户后台管理系统</h1>
        <div class="info">
            <div class="name">{{username}}，你好</div>
            <div class="exit" @click="exit">[退出]</div>
            <!-- <div class="message">站内信<span class="num">4</span></div>
            <div>帮助中心</div>
            <div>设置</div> -->
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                username: sessionStorage.getItem("username") || ''
            }
        },
        methods:{
            exit(){
                this.$confirm('您是否要退出当前账户', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    //确定
                    sessionStorage.removeItem('userName');
                    this.$router.push('/login');
                }).catch(() => {
                    //取消
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .header {
        position: relative;
        user-select: none;
        display: flex;
        height: 60px;
        line-height: 60px;
        padding: 0 20px;
    }

    .title{
        width: 300px;
        font-size: 16px;
        height: 60px;
        color: #fff;
        letter-spacing: 3px;
    }

   .info{
       flex: 1;
       display: flex;
       justify-content: flex-end;
       &>div{
            padding-left: 8px;
            font-size: 15px;           
            color: #fff;
       }
       .exit{
           color: #9099a6;
           cursor: pointer;
           user-select: none;
       }
       .message{
           padding-left: 26px;
           background: url(/static/images/message.png) no-repeat 0 center / 22px auto;
           margin-left: 5px;
       }
       .num{
           color: #3399ff;
           padding-left: 2px;
       }
   }
</style>
