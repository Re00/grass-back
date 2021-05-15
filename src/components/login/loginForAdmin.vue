<template>
  <div class="login-wrap">
    <el-form ref="ruleForm"
             :label-position="labelPosition"
             :model="ruleForm"
             :rules="rules"
             class="login-form"
             label-width="100px"
             status-icon>
      <h2>管理员登录</h2>
      <el-form-item prop="account">
        <el-input v-model="ruleForm.account" autocomplete="off" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item label="" prop="password">
        <el-input v-model="ruleForm.password" autocomplete="off" placeholder="请输入密码" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm('ruleForm')" :loading="ruleForm.btnType">登录</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {mapActions} from 'vuex'

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
        password: '',
        btnType: false
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
    ...mapActions(['setAdminToken', 'setAdmin']),
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 如果都不为空
          var adminName = this.ruleForm.account
          var adminPass = this.ruleForm.password
          this.ruleForm.btnType = true
          // console.log(this.ruleForm)
          this.$http
            .post('admin/login', null, {
              params: {
                adminname: adminName,
                adminpass: adminPass
              }
            }).then((res) => {
              console.log(res)
              const {
                data,
                code,
                msg
              } = res.data
              if (code === '0000') {
              // 登录成功
              // 设置token
              //  保存到vuex
                this.setAdminToken(data.token)
                this.setAdmin(data)
                // 保存到本地
                localStorage.setItem('token', data.token)
                localStorage.setItem('admin', JSON.stringify(data))
                // 跳转页面
                this.$router.push({name: 'homeForAdmin'})
                // 提示成功
                this.$notify.success({
                  title: '成功',
                  message: '欢迎' + adminName
                })
              } else {
              // 登录失败
                this.ruleForm.btnType = false
                this.$notify.error({
                  title: '错误',
                  message: msg
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
