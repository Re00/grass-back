<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!--    面包屑-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/homeForAdmin' } " replace>首页</el-breadcrumb-item>
        <el-breadcrumb-item>公告管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加公告</el-breadcrumb-item>
      </el-breadcrumb>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="标题" prop="theme">
          <el-input v-model="form.theme" style="width:50%;" />
        </el-form-item>
        <el-form-item label="正文" >
          <el-card style="height: 610px;">
            <quill-editor
              v-model="form.content"
              ref="myQuillEditor"
              style="height: 500px;"
              :options="editorOption"
              @blur="onEditorBlur($event)"
              @focus="onEditorFocus($event)"
              @change="onEditorChange($event)"
            ></quill-editor>
          </el-card>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">立即发布</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  inject: ['reload'],
  data () {
    return {
      form: {
        name: '',
        theme: '',
        content: ''
      },
      rules: {
        theme: [
          {required: true, message: '请输入标题', trigger: 'blur'},
          {min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'}
        ],
        text: [
          {required: true, message: '请输入内容'},
          { max: 500, message: '请输入500位以内的字符' }
        ]
      },
      content: `<p>hello world</p>`,
      editorOption: {
        theme: 'snow',
        modules: {
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'strike'],
              // , 'code-block'
              // ['blockquote'],
              [{ 'header': 1 }, { 'header': 2 }],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              [{ 'script': 'sub'}, { 'script': 'super' }],
              [{ 'indent': '-1'}, { 'indent': '+1' }],
              [{ 'direction': 'rtl' }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'font': [] }],
              [{ 'align': [] }],
              ['clean']
            ],
            handlers: {
              'image': function (value) { // 劫持图片上传，自定义图片上传
                if (value) {
                  document.querySelector('#upload').click()
                } else {
                  this.editor.quill.format('image', false)
                }
              }
            }
          }
        },
        imageResize: { // 图片缩放比例
          displayStyles: {
            backgroundColor: 'black',
            border: 'none',
            color: 'white'
          },
          modules: ['Resize', 'DisplaySize', 'Toolbar'] // Resize 允许缩放， DisplaySize 缩放时显示像素 Toolbar 显示工具栏
        }
      }
    }
  },
  computed: {
    editor () {
      return this.$refs.myQuillEditor.quill
    }
  },
  methods: {
    // 上传
    handleAvatarSuccess (res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
      console.log(res)
      console.log(file)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    onEditorReady (editor) { // 准备编辑器
    },
    onEditorBlur () {}, // 失去焦点事件
    onEditorFocus () {}, // 获得焦点事件
    onEditorChange (val) {
    }, // 内容改变事件
    onSubmit (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.editor.getText().length !== 1) {
            this.$http.post(`announcement/addAnnounce`, {
              borSId: this.$store.getters.getAdmin.adminId,
              borSName: this.$store.getters.getAdmin.adminName,
              title: this.form.theme,
              text: this.encode(this.editor.root.innerHTML),
              type: 0 // 0为管理员发布
            }).then(res => {
              if (res.data.code === '0000') {
                this.form.theme = ''
                this.editor.deleteText(0, 500)
                this.$notify.success('发布成功')
              } else {
                this.$notify.error('发布失败')
              }
            })
          } else {
            this.$notify.error('请输入内容')
          }
        } else {
          this.$notify.error('请输入标题')
          return false
        }
      })
    },
    encode (str) {
      // 对字符串进行编码
      const encode = encodeURI(str)
      // 对编码的字符串转化base64
      return btoa(encode)
    },
    decode (base64) {
      // 对base64转编码
      const decode = atob(base64)
      // 编码转字符串
      return decodeURI(decode)
    }
  }
}
</script>

<style>

</style>
