<template>
  <div class="login-wrap">
    <div class="login-form">
        <h2>销售登录</h2>
      <el-input v-model="saleraccount" placeholder="请输入账号" class="login-input"></el-input>
      <el-input
        placeholder="请输入密码"
        v-model="salerpass"
        show-password
        class="login-input"
      ></el-input>

      <el-button
      @click.prevent="handleLogin(saleraccount, salerpass)"
      class="login-btn"
      type="primary"
      >登录</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      saleraccount: '',
      salerpass: ''
    }
  },
  methods: {
    // 登录请求

    handleLogin (salerAccount, salerPass) {
      this.$http
        .post('saler/loginSaler', null, {
          params: {
            saleraccount: salerAccount,
            salerpass: salerPass
          }
        })
        .then((res) => {
          const { data,
            code,
            msg
          } = res.data
          if (code === '1111') {
            // 登录失败
            this.$notify.error({
              title: '错误',
              message: '用户名或密码错误'
            })
          } else {
            // 登录成功
            this.$notify.success({
              title: '成功',
              message: '用户名或密码错误'
            })
          }
          console.log(res)
          console.log(data)
          console.log(code)
          console.log(msg)
        })
    }
  }
}
</script>

<style>
.login-wrap {
  height: 100%;
  background-color: #324152;
  /* 弹性布局 */
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-wrap .login-form {
  width: 400px;
  background-color: aliceblue;
  border-radius: 5px;
  padding: 30px;
}
.login-wrap .login-form .login-input{
    margin-bottom: 20px;
}
.login-wrap .login-btn {
    width: 100%;
}
</style>
