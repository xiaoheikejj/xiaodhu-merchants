<template>
    <div id="Header">
        <!-- <h1 class="title">商户后台管理系统</h1> -->
        <i class="iconfont icon-shouqi" @click="$store.commit('reduceCollapse')"></i>
        <div class="info">
            <i class="fullscreen iconfont icon-quanping" @click="aa"></i>
            <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link username">
                    <span class="user-name">{{username}}</span><i class="iconfont icon-xiala"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="change">修改密码</el-dropdown-item>
                    <el-dropdown-item divided command="loginout">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>
<script>
import { baseUrl } from '../assets/api/api'
    export default {
        data() {
            return {
                username: sessionStorage.getItem("userName") || '',
                fullScreen: false
            }
        },
        methods:{
            aa(){
                if(this.fullScreen){
                    this.fullScreen = false;
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.mozCancelFullScreen) {//FireFox
                        document.mozCancelFullScreen();
                    } else if (document.webkitCancelFullScreen) {//Chrome等
                        document.webkitCancelFullScreen();
                    } else if (document.msExitFullscreen) {//IE11
                        document.msExitFullscreen();
                    }
                }else{
                    this.fullScreen = true;
                    var docElm = document.documentElement;
                    if(docElm.requestFullscreen) {//W3C
                        docElm.requestFullscreen();
                    }else if(docElm.mozRequestFullScreen) {//FireFox
                        docElm.mozRequestFullScreen();
                    }else if(docElm.webkitRequestFullScreen) {//Chrome等
                        docElm.webkitRequestFullScreen();
                    } else if(elem.msRequestFullscreen) {//IE11
                        elem.msRequestFullscreen();
                    }
                }
            },
            handleCommand(command) {
                if(command == 'loginout'){
                    sessionStorage.removeItem('userName');
                    sessionStorage.removeItem('mercSeq');
                    this.$router.push('/login');
                }else if(command == 'change'){
                    this.$prompt('请修改密码', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
                      // inputErrorMessage: '邮箱格式不正确'
                    }).then(({ value }) => {
                        this.$ajax({
                            url: baseUrl + "/merchant/updatePassword",
                            method: 'post',
                            data: this.$qs.stringify({
                                password: this.$md5(value)
                            })
                        })
                        .then(res => {
                            if (res.data.status === "0") {
                                this.$message({
                                  type: 'success',
                                  message: res.data.errorMsg
                                })
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        })
                    }).catch(() => {
                      this.$message({
                        type: 'info',
                        message: '取消修改'
                      });
                    });
                }
            }
        }
    }
</script>
