<template>
  <div class="login-wrap">
    <el-form ref="ruleForm"
             :label-position="labelPosition"
             :model="ruleForm"
             :rules="rules"
             class="login-form"
             label-width="100px"
             status-icon>
      <h2>供货商注册</h2>
      <el-form-item prop="头像上传" label="头像上传">
        <el-upload
          class="avatar-uploader"
          :action="actionAddr"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :limit="limitNum">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item prop="saleraccount" label="账号">
        <el-input
          v-model="ruleForm.saleraccount"
          autocomplete="off"
          placeholder="请输入账号，此为唯一登录账号"
          maxlength="20"
          show-word-limit></el-input>
      </el-form-item>
      <el-form-item prop="salername" label="昵称">
        <el-input
          v-model="ruleForm.salername"
          autocomplete="off"
          placeholder="请输入昵称，此将作为店铺名称"
          maxlength="40"
          show-word-limit
          clearable></el-input>
      </el-form-item>
      <el-form-item prop="salerpass" label="密码">
        <el-input
          v-model="ruleForm.salerpass"
          autocomplete="off"
          placeholder="请输入密码"
          maxlength="30"
          type="password"
          show-password>
        </el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input
          type="password"
          v-model="ruleForm.checkPass"
          placeholder="请再次输入密码"
          autocomplete="off"
          show-password>
        </el-input>
      </el-form-item>
      <el-form-item label="个人简介" prop="salerinfo">
        <el-input
          v-model="ruleForm.salerinfo"
          maxlength="100"
          show-word-limit
          clearable
          placeholder="输入简介"
          autocomplete="off">
        </el-input>
      </el-form-item>
      <el-form-item>
        <div class="login-btn">
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
            :loading="btnType">注册</el-button>
          <el-button @click="toBackLogin()">返回</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    var validatePass2 = (rule, value, callback) => {
      console.log(value)
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.salerpass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      labelPosition: 'right',
      btnType: false,
      ruleForm: {
        checkPass: '',
        saleraccount: '', // 账户名
        salerpass: '',
        salername: '', // 昵称
        salerimg: '',
        salerinfo: '',
        sgoodsCom: 0,
        sgoodsNum: 0

      },
      rules: {
        saleraccount: [
          {required: true, message: '请输入账户名', trigger: 'blur'},
          {pattern: /[A-Za-z0-9]/, message: '只能输入英文和数字'}
        ],
        salerpass: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
        salername: [
          {required: true, message: '请输入昵称', trigger: 'blur'}
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      },
      // 图片上传
      limitNum: 1,
      actionAddr: 'http://localhost:8081/goods/uploadMain',
      imageUrl: ''
    }
  },
  methods: {
    // 上传头像方法
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.response.msg)
      console.log(this.imageUrl)
      this.ruleForm.salerimg = this.imageUrl
      console.log(this.ruleForm.salerimg)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 提交表单
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 如果都不为空
          // 旋转注册按钮
          this.btnType = true
          // 删除checkPass
          let salerForm = this.ruleForm
          delete salerForm.checkPass
          // 无头像地址 http://grass-backdata-1259146295.cos.ap-beijing.myqcloud.com/1619860035697.jpg
          if (this.ruleForm.salerimg === '') {
            this.ruleForm.salerimg = 'http://grass-backdata-1259146295.cos.ap-beijing.myqcloud.com/1619860035697.jpg'
          }
          this.$http
            .post('saler/addOneSaler', salerForm)
            .then((res) => {
              console.log('点击登录之后')
              console.log(res)
              const {
                data,
                code,
                msg
              } = res.data
              if (code === '0000') {
                // 注册成功
                // 设置token
                localStorage.setItem('token', data.token)
                localStorage.setItem('salerId', data.salerId)
                localStorage.setItem('salername', data.salername)
                // localStorage.getItem(salerId)
                // 跳转页面
                this.$router.push({name: 'homeForSaler'})
                // 提示成功
                this.$notify.success({
                  title: '注册成功',
                  message: '欢迎' + data.salername
                })
              } else {
                // 注册失败
                this.ruleForm.btnType = false
                this.$notify.error({
                  title: '注册失败',
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
    },
    toBackLogin () {
      this.$router.push({name: 'loginForSaler'})
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
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
