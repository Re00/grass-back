<!--
 * @Description: 用户注册组件
 * @Author: hai-27
 * @Date: 2020-02-19 22:20:35
 * @LastEditors: hai-27
 * @LastEditTime: 2020-03-01 15:34:34
 -->
<template>
  <div id="register">
    <el-dialog title="注册" width="300px" center :visible.sync="isRegister">
      <el-form
        :model="RegisterUser"
        :rules="rules"
        status-icon
        ref="ruleForm"
        class="demo-ruleForm"
      >
        <el-form-item prop="account">
          <el-input
            prefix-icon="el-icon-user-solid"
            placeholder="请输入账号"
            v-model="RegisterUser.account"
          ></el-input>
        </el-form-item>
        <el-form-item prop="name">
          <el-input
            prefix-icon="el-icon-user-solid"
            placeholder="请输入昵称"
            maxlength="40"
            show-word-limit
            clearable
            v-model="RegisterUser.name"
          ></el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input
            prefix-icon="el-icon-view"
            type="password"
            placeholder="请输入密码"
            v-model="RegisterUser.pass"
          ></el-input>
        </el-form-item>
        <el-form-item prop="confirmPass">
          <el-input
            prefix-icon="el-icon-view"
            type="password"
            placeholder="请再次输入密码"
            v-model="RegisterUser.confirmPass"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="medium" type="primary" @click="Register" style="width:100%;">注册</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'MyRegister',
  props: ['register'],
  data () {
    // 用户名的校验方法
    let validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入用户名'))
      }
      // 用户名以字母开头,长度在4-16之间,允许字母数字下划线
      const userNameRule = /^[a-zA-Z][a-zA-Z0-9_]{3,15}$/
      if (userNameRule.test(value)) {
        // 判断数据库中是否已经存在该账户
        this.$http
          .post(`buyer/findBuyer?buyerName=${this.RegisterUser.account}`)
          .then(res => {
            // “0000”代表该账户不存在，可以注册
            console.log(res)
            if (res.data.code === '0000') {
              this.$refs.ruleForm.validateField('checkPass')
              return callback()
            } else {
              return callback(new Error(res.data.msg))
            }
          })
          .catch(err => {
            return Promise.reject(err)
          })
      } else {
        return callback(new Error('字母开头,长度4-16之间,允许字母数字下划线'))
      }
    }
    // 密码的校验方法
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入密码'))
      }
      // 密码以字母开头,长度在6-18之间,允许字母数字和下划线
      const passwordRule = /^[a-zA-Z]\w{5,17}$/
      if (passwordRule.test(value)) {
        this.$refs.ruleForm.validateField('checkPass')
        return callback()
      } else {
        return callback(
          new Error('字母开头,长度6-18之间,允许字母数字和下划线')
        )
      }
    }
    // 确认密码的校验方法
    let validateConfirmPass = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入确认密码'))
      }
      // 校验是否以密码一致
      if (this.RegisterUser.pass !== '' && value === this.RegisterUser.pass) {
        this.$refs.ruleForm.validateField('checkPass')
        return callback()
      } else {
        return callback(new Error('两次输入的密码不一致'))
      }
    }
    return {
      isRegister: false, // 控制注册组件是否显示
      RegisterUser: {
        account: '',
        name: '',
        pass: '',
        confirmPass: ''
      },
      // 用户信息校验规则,validator(校验方法),trigger(触发方式),blur为在组件 Input 失去焦点时触发
      rules: {
        account: [{ validator: validateName, trigger: 'blur' }],
        pass: [{ validator: validatePass, trigger: 'blur' }],
        confirmPass: [{ validator: validateConfirmPass, trigger: 'blur' }],
        name: [
          {required: true, message: '请输入昵称', trigger: 'blur'}
        ]
      }
    }
  },
  watch: {
    // 监听父组件传过来的register变量，设置this.isRegister的值
    register: function (val) {
      if (val) {
        this.isRegister = val
      }
    },
    // 监听this.isRegister变量的值，更新父组件register变量的值
    isRegister: function (val) {
      if (!val) {
        this.$refs['ruleForm'].resetFields()
        this.$emit('fromChild', val)
      }
    }
  },
  methods: {
    Register () {
      // 通过element自定义表单校验规则，校验用户输入的用户信息
      this.$refs['ruleForm'].validate(valid => {
        // 如果通过校验开始注册
        if (valid) {
          this.$http
            .post('buyer/addOneBuyer', {
              buyeraccount: this.RegisterUser.account,
              buyerpass: this.RegisterUser.pass,
              buyername: this.RegisterUser.name
            })
            .then(res => {
              // “0000”代表注册成功，其他的均为失败
              if (res.data.code === '0000') {
                // 隐藏注册组件
                this.isRegister = false
                // 弹出通知框提示注册成功信息
                this.notifySucceed(res.data.msg)
              } else {
                // 弹出通知框提示注册失败信息
                this.notifyError(res.data.msg)
              }
            })
            .catch(err => {
              return Promise.reject(err)
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style>
</style>
