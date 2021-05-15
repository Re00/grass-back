<template>
  <el-card>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/homeForAdmin' } " replace>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>供货商管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加供货商</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form ref="ruleForm"
             :label-position="labelPosition"
             :model="ruleForm"
             :rules="rules"
             class="login-form"
             label-width="100px"
             status-icon
             center>

      <el-form-item prop="头像上传" label="头像上传" class="formFirst">
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
      <el-form-item prop="saleraccount" label="账号" class="formOthers">
        <el-input
          v-model="ruleForm.saleraccount"
          autocomplete="off"
          placeholder="请输入账号，此为唯一登录账号"
          maxlength="20"
          show-word-limit></el-input>
      </el-form-item>
      <el-form-item prop="salername" label="昵称" class="formOthers">
        <el-input
          v-model="ruleForm.salername"
          autocomplete="off"
          placeholder="请输入昵称，此将作为店铺名称"
          maxlength="40"
          show-word-limit
          clearable></el-input>
      </el-form-item>
      <el-form-item prop="salerpass" label="密码" class="formOthers">
        <el-input
          v-model="ruleForm.salerpass"
          autocomplete="off"
          placeholder="请输入密码"
          maxlength="30"
          type="password"
          show-password>
        </el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass" class="formOthers">
        <el-input
          type="password"
          v-model="ruleForm.checkPass"
          placeholder="请再次输入密码"
          autocomplete="off"
          show-password>
        </el-input>
      </el-form-item>
      <el-form-item label="个人简介" prop="salerinfo" class="formOthers">
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
            :loading="btnType">添加</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  inject: ['reload'],
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
          {required: true, message: '请输入密码', trigger: 'blur'}
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
    handleAvatarSuccess (res) {
      this.imageUrl = res.msg
      this.ruleForm.salerimg = this.imageUrl
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 1

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 1MB!')
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
              const {
                code,
                msg
              } = res.data
              if (code === '0000') {
                // 成功
                // 刷新页面
                this.reload()
                // 提示成功
                this.$notify.success({
                  title: '添加成功'
                })
              } else {
                // 注册失败
                this.ruleForm.btnType = false
                this.$notify.error({
                  title: '添加失败',
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
      let deleteUrl = this.imageUrl.split('/')[3]// 切分后获取要删除的名称
      this.$http.post(`goods/deleteImg?key=${deleteUrl}`)// 直接云端删除未上传头像
      this.imageUrl = ''
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
.formFirst{
  margin-top: 20px;
}
.formOthers{
  width: 500px;
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
