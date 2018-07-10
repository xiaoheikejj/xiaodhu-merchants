<template>
  <div class="login-container">
      <div class="login-form-box">
        <div class="title-container">
          <h3 class="main-title">小电呼智能语音机器人</h3>
          <h3 class="min-title">后台管理系统</h3>
        </div>
        <el-form class="login-form" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px">
          <el-form-item prop="username">
            <el-input v-model="ruleForm.username" placeholder="用户名" clearable></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="ruleForm.password" type="password" placeholder="密码" clearable></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-row :gutter="10">
              <el-col :span="14">
                <div class="grid-content bg-purple">
                  <el-input v-model="ruleForm.code" placeholder="验证码" clearable></el-input>
                </div>
              </el-col>
              <el-col :span="10">
                <div class="grid-content bg-purple">
                  <el-button class="code-btn" @click='mathNum'>{{codeNo}}</el-button>
                </div>
              </el-col>
            </el-row>
          </el-form-item>
          <el-button class="login-btn" type="primary" @click="submitForm('ruleForm')" :loading="loading">登录</el-button>
        </el-form>
      </div>
  </div>
</template>

<script>
    import Vue from 'vue';
    import {commonAjax} from "../../api/api";
    import axios from 'axios';

    export default {
        data() {
            return {
                ruleForm: {
                    email: sessionStorage.getItem("username") || '',
                    password: sessionStorage.getItem("password") || '',
                    code: '',
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    code: [
                        { required: true, message: '请输入验证码', trigger: 'blur' }
                    ],
                },
                codeNo: '',
                loading: false,
                checked: true
            };
        },
        mounted () {
          this.codeNo = parseInt(Math.random()*8999) + 1000;
        },
        methods: {
            submitForm(formName) {
              this.$refs[formName].validate((valid) => {
                  if (valid) {
                    if(this.ruleForm.code == this.codeNo){
                      let paramsForm = {
                        mercLoginName: this.ruleForm.username,
                        mercPwd: this.ruleForm.password
                      }
                      this.loading = true;
                      commonAjax('/merchant/login', 'post',paramsForm).then(res => {
                        if (res.status == 0) {
                            this.$router.push('/home');
                            sessionStorage.setItem('username',res.mercLoginName);
                        } else {
                            this.$message({
                                type: 'error',
                                message: 'error'
                            });
                        }
                        this.loading = false;
                      });
                    }else{
                      this.$message({
                          type: 'error',
                          message: '验证码输入有误'
                      });
                    }
                  } else {
                      // this.$message({
                      //     type: 'error',
                      //     message: 'error'
                      // });
                  }
              });
            },
            handleCkeck(){
              this.checked = !this.checked;
            },
            mathNum: function() {
                this.codeNo = parseInt(Math.random()*8999) + 1000;
            },
        },
    };
</script>

<style rel="stylesheet/scss" lang="scss">

.login-container {
  height: 100%;
  width: 100%;
  position: relative;
  background: url(/static/images/login-bg.png) no-repeat center / cover;
  .login-form-box{
    width: 380px;
    height: 500px;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 172px;
    margin: auto 0;
  }
  .login-form {
    height: 380px;
    padding: 50px 44px 0;
    border-radius: 4px;
    background-color: #fff;
  }

  .el-form-item{
    margin-bottom: 0;
  }
  .el-input{
    margin-bottom: 30px;
     input{
      height: 42px;
      font-size: 16px;
      color: #757575;
    }
  }

  // .el-input__inner{
  //   border-color: #ccc;
  // }

  .el-form-item__error{
    padding-top: 4px;
    top: 65%;
  }

  .login-btn{
    width:100%;
    height:42px;
    font-size: 18px;
  }

  .title-container {
    position: relative;
    .main-title {
      font-size: 34px;
      line-height: 34px;
      color: #fff;
      text-align: center;
      font-weight: bold;
      font-style: italic;
      letter-spacing: 2px;
    }
    .min-title {
      font-size: 20px;
      line-height: 60px;
      color: #fff;
      margin-bottom: 40px;
      text-align: center;
      font-weight: normal;
      letter-spacing: 1px;
    }
  }
  .code-btn{
      width: 100%;
      letter-spacing: 1px;
      padding: 0;
      height: 42px;
      font-size: 18px;
    }
}
</style>
