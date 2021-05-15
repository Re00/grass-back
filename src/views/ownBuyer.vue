<template>
  <el-card shadow="hover" class="box-card">
    <h2>个人中心</h2>
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
      <el-form-item prop="buyeraccount" label="账号" class="formOthers">
        <el-input
          v-model="ruleForm.buyeraccount"
          autocomplete="off"
          placeholder="请输入账号，此为唯一登录账号"
          disabled></el-input>
      </el-form-item>
      <el-form-item prop="buyername" label="昵称" class="formOthers">
        <el-input
          v-model="ruleForm.buyername"
          autocomplete="off"
          placeholder="请输入昵称"
          maxlength="40"
          show-word-limit
          clearable></el-input>
      </el-form-item>
      <el-form-item prop="buyerpass" label="密码" class="formOthers">
        <el-input
          v-model="ruleForm.buyerpass"
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
      <el-form-item label="个人简介" prop="buyerinfo" class="formOthers">
        <el-input
          v-model="ruleForm.buyerinfo"
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
            :loading="btnType">修改</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  inject: ['reload'],
  data () {
    var validatePass2 = (rule, value, callback) => {
      console.log(value)
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.buyerpass) {
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
        buyeraccount: '', // 账户名
        buyerpass: '',
        buyername: '', // 昵称
        buyerimg: '',
        buyerinfo: '',
        buyerId: this.$store.getters.getUser.buyerId

      },
      rules: {
        buyeraccount: [
          {required: true, message: '请输入账户名', trigger: 'blur'},
          {pattern: /[A-Za-z0-9]/, message: '只能输入英文和数字'}
        ],
        buyerpass: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
        buyername: [
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
  created () {
    this.getOneBuyer()
  },
  activated () {
    this.getOneBuyer()
  },
  methods: {
    ...mapGetters(['getUser']),
    ...mapActions(['setUser']),
    // 上传头像方法
    handleAvatarSuccess (res) {
      this.imageUrl = res.msg
      this.ruleForm.buyerimg = res.msg
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
          // 旋转更新按钮
          this.btnType = true
          let buyerForm = this.ruleForm
          // 无头像地址 http://grass-backdata-1259146295.cos.ap-beijing.myqcloud.com/1619860035697.jpg
          if (this.ruleForm.buyerimg === '' || this.ruleForm.buyerimg === null) {
            this.ruleForm.buyerimg = 'http://grass-backdata-1259146295.cos.ap-beijing.myqcloud.com/1619860035697.jpg'
          }
          this.$http
            .put('buyer/updateOneBuyer', {
              buyeraccount: buyerForm.buyeraccount,
              buyerpass: buyerForm.buyerpass,
              buyername: buyerForm.buyername,
              buyerimg: buyerForm.buyerimg,
              buyerinfo: buyerForm.buyerinfo,
              buyerId: buyerForm.buyerId
            })
            .then((res) => {
              const {
                code,
                msg
              } = res.data
              if (code === '0000') {
                // 成功
                // 刷新页面
                this.reload()
                // localStorage.setItem('buyerImg', buyerForm.buyerimg)
                // 更新vuex
                let token = this.$store.getters.getUser.token
                this.setUser({
                  buyerId: this.ruleForm.buyerId,
                  buyerImg: this.ruleForm.buyerimg,
                  buyerName: this.ruleForm.buyername,
                  token: token
                })
                // 提示成功
                this.btnType = false
                this.$notify.success({
                  title: '更新成功'
                })
              } else {
                this.ruleForm.btnType = false
                this.$notify.error({
                  title: '更新失败',
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
    },
    getOneBuyer () {
      console.log(this.$store.getters.getUser.buyerId)
      this.$http.get(`buyer/getOneBuyerByBid/${this.ruleForm.buyerId}`).then((res) => {
        const data = res.data.data
        console.log(data)
        this.imageUrl = data.buyerimg
        this.ruleForm.buyerimg = data.buyerimg
        this.ruleForm.buyername = data.buyername
        this.ruleForm.buyerinfo = data.buyerinfo
        this.ruleForm.buyerpass = data.buyerpass
        this.ruleForm.checkPass = data.buyerpass
        this.ruleForm.buyeraccount = data.buyeraccount
      })
    }
  }
}
</script>

<style>
.box-card {
  width: 1250px;
  min-width: 1250px;
  margin-left: 237px;
  margin-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
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
