<template>
  <el-card>
<!--    面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/homeForAdmin' } " replace>首页</el-breadcrumb-item>
      <el-breadcrumb-item>广告管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加广告</el-breadcrumb-item>
    </el-breadcrumb>
<!--    图像上传-->
    <el-form ref="ruleForm"
             :model="ruleForm"
             :rules="rules"
             class="login-form"
             label-width="100px"
             status-icon
             center
             style="margin-top: 30px">
      <el-form-item label="广告图上传" class="formFirst">
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

      <el-form-item prop="adName" label="广告地名" class="formOthers">
        <el-input
          v-model="ruleForm.adName"
          autocomplete="off"
          placeholder="请输入广告地名"
          ></el-input>
      </el-form-item>
      <el-form-item prop="adUrl" label="外链地址" class="formOthers">
        <el-input
          v-model="ruleForm.adUrl"
          autocomplete="off"
          placeholder="请输入外链地址"
          ></el-input>
      </el-form-item>
      <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
            :loading="btnType">增加</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>

export default {
  // import引入的组件需要注入到对象中才能使用",
  components: {},
  data () {
    // 这里存放数据",
    return {
      btnType: false,
      ruleForm: {
        adName: '',
        adUrl: '',
        adImg: ''
      },
      rules: {
        adName: [
          {required: true, message: '请输入广告地名', trigger: 'blur'}
        ],
        adUrl: [
          {required: true, message: '请输入外链地址', trigger: 'blur'}
        ]
      },
      // 图片上传
      limitNum: 1,
      actionAddr: 'http://localhost:8081/goods/uploadMain',
      imageUrl: ''
    }
  },
  // 方法集合",
  methods: {
    // 图片上传方法
    handleAvatarSuccess (res) {
      this.imageUrl = res.msg
      this.ruleForm.adImg = res.msg
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 1

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 1MB!')
      }
      return isJPG && isLt2M
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 如果都不为空
          // 旋转更新按钮
          this.btnType = true
          this.$http.post(`ad/addOneAd`, this.ruleForm).then(res => {
            if (res.data.code === '0000') {
              this.$notify.success(res.data.msg)
              this.btnType = false
              this.imageUrl = ''
              this.$refs[formName].resetFields()
            } else {
              this.$notify.error(res.data.msg)
            }
          })
        }
      })
    }

  }
}
</script>

<style>
.formOthers{
  width: 500px;
}
</style>
