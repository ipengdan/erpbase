<template>
  <div class="login">
    <div class="login-box">
      <div class="avator">
        <img src="../assets/logo.png" alt="">
      </div>
      
      <el-form ref="loginFormRef" :model="account" :rules="loginRules" label-width="0px" class="login-form">
        <el-form-item prop="username">
          <el-input 
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
            v-model="account.username">
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            prefix-icon="el-icon-key"
            v-model="account.password"
            type="password"
            show-password>
          </el-input>
        </el-form-item>

        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {login} from '../network/common'

export default {
  name: 'Login',
  data () {
    return {
      account : {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 15, message: '请输入长度在3-10位的用户名',trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 3, max: 10, message: '请输入长度在3-10位的密码',trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    login () {
      this.$refs.loginFormRef.validate(valid=> {
        if (!valid) return;
        //1.发起http请求
        //2.成功后将token保存在sessionStorage中
        //3.跳转到home界面
        login (this.account).then(res => {
          console.log(res);
          if(res.meta.status == 200) {
            window.sessionStorage.setItem('token', res.data.token);
            this.$message.success(res.meta.msg);
            this.$router.push('/home');
          }else {
            this.$message.error(res.meta.msg);
          }
        });
      });
    },

    reset () {
      this.$refs.loginFormRef.resetFields();
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  background-color: #2b4b6b;
  height: 100%;
  .login-box {
    width: 750px;
    height: 500px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);

    .avator {
      width: 230px;
      height: 230px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 20px;
      background-color: #fff;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 10px #ddd;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }

    .login-form {
      position: absolute;
      bottom: 0;
      width: 100%;
      box-sizing: border-box;
      padding: 0 20px;

      .btns {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}

</style>