<template>
  <div id="Login">
    <div class="login-form-box">
      <div class="title-container">
        <h3 class="main-title">小电呼智能语音机器人</h3>
        <div class="line-box">
          <div class="line"></div>
          <h3 class="min-title">商户后台管理系统</h3>
          <div class="line"></div>
        </div>
      </div>
      <el-form class="login-form" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px">
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" placeholder="用户名" maxlength="30" clearable></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="ruleForm.password" type="password" placeholder="密码" maxlength="30" clearable></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-row :gutter="10">
            <el-col :span="14">
              <div class="grid-content bg-purple">
                <el-input v-model="ruleForm.code" maxlength="4" @keyup.enter.native="submitForm('ruleForm')" placeholder="验证码" clearable></el-input>
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
import {Ajax} from "../../assets/api/api";
import md5 from 'js-md5';
export default {
  name: "Login",
  data() {
    return {
      ruleForm: {
        email: sessionStorage.getItem("username") || "",
        password: sessionStorage.getItem("password") || "",
        code: ""
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ],
        code: [
          {
            required: true,
            message: "请输入验证码",
            trigger: "blur"
          }
        ]
      },
      codeNo: "",
      loading: false,
      checked: true
    };
  },
  mounted() {
    this.codeNo = parseInt(Math.random() * 8999) + 1000;
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.ruleForm.code == this.codeNo) {
            let paramsForm = {
              mercLoginName: this.ruleForm.username,
              mercPwd: md5(this.ruleForm.password)
            };
            this.loading = true;
            Ajax("/merchant/login", "post", paramsForm).then(res => {
              if (res.status == 0) {
                this.loading = false;
                sessionStorage.setItem("userName", res.mercLoginName);
                sessionStorage.setItem("mercSeq", res.mercSeq);
                this.$router.push("/proList");
              } else {
                this.$message({
                  type: "error",
                  message: res.message
                });
                this.loading = false;
                this.mathNum();
              }
            });
          } else {
            this.$message({
              type: "error",
              message: "验证码输入有误"
            });
          }
        } else {

        }
      });
    },
    handleCkeck() {
      this.checked = !this.checked;
    },
    mathNum: function() {
      this.codeNo = parseInt(Math.random() * 8999) + 1000;
    }
  }
};
</script>
