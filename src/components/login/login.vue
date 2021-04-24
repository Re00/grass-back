<template>
  <div class="login-wrap">
    <el-form ref="ruleForm"
             :label-position="labelPosition"
             :model="ruleForm"
             :rules="rules"
             class="login-form"
             label-width="100px"
             status-icon>
      <h2>登录</h2>
      <el-form-item prop="account">
        <el-input v-model="ruleForm.account" autocomplete="off" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item label="" prop="password">
        <el-input v-model="ruleForm.password" autocomplete="off" placeholder="请输入密码" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    var validateAcccount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入账号'))
      } else {
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      labelPosition: 'top',
      ruleForm: {
        account: '',
        password: ''
      },
      rules: {
        account: [
          {validator: validateAcccount, trigger: 'blur'}
        ],
        password: [
          {validator: validatePass, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 如果都不为空
          var salerAccount = this.ruleForm.account
          var salerPass = this.ruleForm.password
          // console.log(this.ruleForm)
          this.$http
            .post('saler/loginSaler', null, {
              params: {
                saleraccount: salerAccount,
                salerpass: salerPass
              }
            }).then((res) => {
              const {
                data,
                code,
                msg
              } = res.data
              if (code === '1111') {
              // 登录失败
                this.$notify.error({
                  title: '错误',
                  message: msg
                })
              } else {
              // 登录成功
              // 跳转页面
                this.$router.push({name: 'home'})
                // 提示成功
                this.$notify.success({
                  title: '成功',
                  message: '欢迎' + data.salername
                })
              }
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
.login-wrap {
  height: 100%;
  background-color: midnightblue;
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

.login-wrap .login-form .login-btn {
  text-align: right;
}
</style>
