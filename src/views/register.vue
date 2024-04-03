<template>
  <div class="register">
    <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="register-form">
      <div class="register-wechat-qrcode-wrapper">
        <el-image style="width: 100px; height: 100px" :src="require('@/assets/images/register-wechat-qrcode.jpg')" fit="fill"></el-image>
      </div>
      <el-divider>
        <span class="register-wechat-qrcode-tips">请关注公众号获取注册码</span>
      </el-divider>
      <el-form-item prop="username">
        <el-input v-model="registerForm.username" type="text" auto-complete="off" placeholder="用户名">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="registerForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleRegister"
        >
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <el-input
          v-model="registerForm.confirmPassword"
          type="password"
          auto-complete="off"
          placeholder="确认密码"
          @keyup.enter.native="handleRegister"
        >
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input
          v-model="registerForm.code"
          auto-complete="off"
          placeholder="注册码"
          style="width: 63%"
          @keyup.enter.native="handleRegister"
        >
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleRegister"
        >
          <span v-if="!loading">注 册</span>
          <span v-else>注 册 中...</span>
        </el-button>
        <div style="float: right;">
          <router-link class="link-type" :to="'/login'">使用已有账户登录</router-link>
        </div>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-register-footer">
      <span>Copyright © {{'2024-' + new Date().getFullYear()}} dns.zhangmenglong.cn All Rights Reserved.</span>
    </div>
  </div>
</template>

<script>
import { register } from "@/api/login";

export default {
  name: "Register",
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.registerForm.password !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      codeUrl: "",
      registerForm: {
        username: "",
        password: "",
        confirmPassword: "",
        code: "",
        uuid: ""
      },
      registerRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的用户名" },
          { min: 2, max: 20, message: '用户名长度必须介于 2 和 20 之间', trigger: 'blur' }
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" },
          { min: 5, max: 20, message: "用户密码长度必须介于 5 和 20 之间", trigger: "blur" },
          { pattern: /^[^<>"'|\\]+$/, message: "不能包含非法字符：< > \" ' \\\ |", trigger: "blur" }
        ],
        confirmPassword: [
          { required: true, trigger: "blur", message: "请再次输入您的密码" },
          { required: true, validator: equalToPassword, trigger: "blur" }
        ],
        code: [{ required: true, trigger: "change", message: "请输入注册码" }]
      },
      loading: false
    };
  },
  methods: {
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true;
          register(this.registerForm).then(res => {
            if (res.data == -1) {
              this.registerForm.code = null;
              this.registerRules.code[0].message = "注册码错误，请重新输入"
              this.$refs.registerForm.validate(valid => {
                this.loading = false;
                this.$nextTick(() => {
                  this.registerRules.code[0].message = "请输入注册码"
                })
              })
            } else {
              const username = this.registerForm.username;
              this.$alert("<font color='red'>恭喜你，您的账号 " + username + " 注册成功！</font>", '系统提示', {
                dangerouslyUseHTMLString: true,
                type: 'success'
              }).then(() => {
                this.$router.push("/login");
              }).catch(() => {});
            }

          }).catch(() => {
            this.loading = false;
          })
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.register {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/login-background.jpg");
  background-size: cover;
  .register-wechat-qrcode-wrapper{
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .register-wechat-qrcode-tips{
    font-weight: bold;
    font-size: 12px;
  }
  .register-form {
    opacity: 0.9;
    border-radius: 6px;
    background: #ffffff;
    width: 400px;
    padding: 25px 25px 5px 25px;
    .el-input {
      height: 38px;
      input {
        height: 38px;
      }
    }
    .input-icon {
      height: 39px;
      width: 14px;
      margin-left: 2px;
    }
  }
  .el-register-footer {
    height: 40px;
    line-height: 40px;
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #fff;
    font-family: Arial;
    font-size: 12px;
    letter-spacing: 1px;
  }
}
</style>
