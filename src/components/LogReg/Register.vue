<template>
  <el-form class="register-form" :model="ruleForm" :rules="rules" autoComplete="on" ref="ruleForm">
    <div class="title-container">
      <h3 class="title">项目管理系统</h3>
    </div>
    <el-form-item prop="username">
        <el-input v-model="ruleForm.username" placeholder="用户名" clearable></el-input>
    </el-form-item>
    <el-form-item prop="email">
        <el-input auto-complete='email' v-model="ruleForm.email" placeholder="邮箱" clearable></el-input>
    </el-form-item>
    <el-form-item prop="code">
        <el-row :gutter="10">
            <el-col :span="16">
              <div class="grid-content bg-purple">
                <el-input v-model="ruleForm.code" placeholder="验证码" clearable></el-input>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <el-button type="primary" class="code-btn" v-show="show" @click="getCode">获取验证码</el-button>
                <el-button class="code-btn" v-show="!show" >{{count}}</el-button>
              </div>
            </el-col>
        </el-row>
    </el-form-item>
    <el-form-item prop="password">
        <el-input type="password" v-model="ruleForm.password" placeholder="密码由8-16字母和数字组成，不能是纯数字或纯英文" clearable></el-input>
    </el-form-item>
    <el-form-item prop="passwordReset">
        <el-input type="password" v-model="ruleForm.passwordReset" placeholder="重新输入密码" clearable></el-input>
    </el-form-item>
    <el-button class="register-btn" type="primary" @click="submitForm('ruleForm')" :loading="loading">注册</el-button>
    <el-button class="login-btn" type="text"  @click="login">返回</el-button>
  </el-form>
</template>

<script>

import { validateEmail, validatePassword} from '../../util/validate';
import { commonAjax } from "../../api/api";
import axios from 'axios';
  export default {
    name: "Register",
    data() {
      const validateEmail = (rule, value, callback) => {
        if (!validateEmail(value)) {
          callback(new Error('请输入正确格式的邮箱地址'))
        } else {
          callback()
        }
      }
      return {
        checked: true,
        show: true,
        count: '',
        timer: null,
        loading: false,
        ruleForm: {
            username: '',
            email: '',
            code: '',
            password: '',
            passwordReset: ''
        },
        rules: {
            username: [
                { required: true, message: '请输入用户名', trigger: 'blur' }
            ],
            email: [
                { required: true, message: '请输入邮箱', trigger: 'blur' }
            ],
            code: [
                { required: true, message: '请输入验证码', trigger: 'blur' }
            ],
            password: [
                { required: true, message: '请输入密码', trigger: 'blur' }
            ],
            passwordReset: [
                { required: true, message: '该项不能为空', trigger: 'blur' }
            ]
        }
      };
    },
    methods:{
      login(){
        this.$router.push('/login');
      },
      getCode(){
        if(this.ruleForm.email){
          if(validateEmail(this.ruleForm.email)){
            const TIME_COUNT = 60;
            if (!this.timer) {
              this.count = TIME_COUNT;
              this.show = false;
              this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= TIME_COUNT) {
                this.count--;
                } else {
                this.show = true;
                clearInterval(this.timer);
                this.timer = null;
                }
              }, 1000)
            }
            let params = {
                email: this.ruleForm.email,
            }
            this.loading = true;
            commonAjax('/email_code', 'get',params).then(res => {
              if (res.err == 0) {
                  this.$message({
                      type: 'success',
                      message: res.msg
                  });
              } else {
                  this.$message({
                      type: 'error',
                      message: res.msg
                  });
              }
              this.loading = false;
            });
          }else{
            this.$message({
              type: 'error',
              message: '请输入正确格式的邮箱地址'
            });
          }
        } else {
          this.$message({
            type: 'error',
            message: '请输入邮箱地址'
          });
        }
      },
      submitForm(formName) {
          this.$refs[formName].validate((valid) => {
              if (valid) {
                  if(validatePassword(this.ruleForm.password)){
                      if( this.ruleForm.password === this.ruleForm.passwordReset){
                        let paramsForm = {
                          email: this.ruleForm.email,
                          password: this.ruleForm.password,
                          code: this.ruleForm.code,
                          username: this.ruleForm.username
                        }
                        commonAjax('/register', 'post', paramsForm).then(res => {
                          if (res.err == 0) {
                              this.$router.push('/login');
                          } else {
                              this.$message({
                                  type: 'error',
                                  message: res.msg
                              });
                          }
                        });
                      }else{
                        this.$message({
                          type: 'error',
                          message: '两次密码输入不一致'
                        });
                      }
                  }else{
                      this.$message({
                        type: 'error',
                        message: '密码由8-16字母和数字组成，不能是纯数字或纯英文'
                      });
                  }
              } else {
                  this.$message({
                      type: 'error',
                      message: 'error'
                  });
              }
          });
      }
    }
  };
</script>

<style lang="scss">
  .register-form{
    .el-input {
      margin-bottom: 4px;
      input {
        height: 40px !important;
      }
    }
    .el-form {
    margin-top: 15px;
      padding: 0 20px;
    }
    .el-checkbox{
      margin-bottom: 25px;
    }
    .el-button{
      width: 100%;
      letter-spacing: 1px;
      padding: 0;
      height: 40px;
    }
  }
</style>

<style lang="scss" scoped>
.btn{
  display: inline-block;
  padding: 0 20px;
  height:40px;
  line-height: 40px;
  border-radius: 5px;
  cursor: pointer;
  background: #fff;
  text-align: center;
  user-select: none;
}
  .register-form{
    width: 360px;
    padding-top: 120px;
    margin: 0 auto !important;
    .title-container {
      position: relative;
      .title {
        font-size: 26px;
        font-weight: 400;
        color: #eee;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }
    .login-btn{
      padding: 0 5px;
      margin: 0;
      color: #ccc;
      text-align: right;
    }
    .code-btn{
      margin: 0;
    }
  }
</style>
