<template>
  <el-card class="addGoodsBox-card">
<!--    面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/homeForSaler' } " replace>首页</el-breadcrumb-item>
      <el-breadcrumb-item>产品管理</el-breadcrumb-item>
      <el-breadcrumb-item>产品上架</el-breadcrumb-item>
    </el-breadcrumb>
<!--    提示信息-->
    <el-alert
      title="上架产品"
      class="topAlert"
      type="info"
      center
      show-icon>
    </el-alert>
<!--    步骤条-->
    <el-steps :active="parseInt(active)" finish-status="success" simple style="margin-top: 20px">
      <el-step title="基本信息" ></el-step>
      <el-step title="产品图片" ></el-step>
    </el-steps>
<!--    form表单-->
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <!--    左侧tab-->
      <el-tabs v-model="active" tab-position="left">
<!--        第一部分-->
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="产品名称" prop="gname" class="formItemFirst">
            <el-input
              v-model="ruleForm.gname"
              maxlength="50"
              show-word-limit
              clearable
              placeholder="请输入产品名称" >
            </el-input>
          </el-form-item>

          <el-form-item label="产品库存" prop="gnum" class="formItemOthers">
            <el-input v-model.number="ruleForm.gnum"
                      maxlength="6"
                      show-word-limit
                      placeholder="请输入产品库存"></el-input>
          </el-form-item>

          <el-form-item label="产品价格" prop="gpride" class="formItemOthers">
            <el-input v-model="ruleForm.gpride"
                      maxlength="10"
                      show-word-limit
                      placeholder="请输入产品价格"></el-input>
          </el-form-item>

          <el-form-item label="产品划线价" prop="glinepride" class="formItemOthers">
            <el-input v-model="ruleForm.glinepride"
                      maxlength="10"
                      show-word-limit
                      placeholder="请输入产品划线价格，可不输入"></el-input>
          </el-form-item>

          <el-form-item label="产品简介" prop="ginfo" class="formItemOthers">
            <el-input v-model="ruleForm.ginfo"
                      maxlength="100"
                      show-word-limit
                      clearable
                      placeholder="请输入产品简介"></el-input>
          </el-form-item>

          <el-form-item label="产品分类" prop="gtype" class="formItemOthers">
          <el-cascader
            v-model="selectedOptions"
            :options="options"
            :props="defaultProp"
            @change="handleChange">
          </el-cascader>
          </el-form-item>

        </el-tab-pane>
<!--第二部分-->
        <el-tab-pane name="2" label="产品图片">
          <el-form-item>
            <el-upload
              class="upload-demo"
              :action="actionAddr"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :headers="headers"
              :limit="limitNum"
              :before-upload="beforeUpload"
              list-type="picture">
              <el-button size="small" type="primary" >点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/jpeg/png文件，且不超过1MB并少于5张图片</div>

            </el-upload>
            <el-button @click="addGoods('ruleForm')" type="primary" class="addBtn" circle>添加产品</el-button>
          </el-form-item>
        </el-tab-pane>
<!--第三部分-->
<!--        <el-tab-pane name="3" label="产品简介">-->

<!--          <el-form-item style="margin-top: 50px">-->
<!--&lt;!&ndash;            按钮&ndash;&gt;-->
<!--            <el-button @click="addGoods" type="primary">添加产品</el-button>-->
<!--&lt;!&ndash;            富文本&ndash;&gt;-->
<!--            <quill-editor style="margin-top: 20px" v-model="ruleForm.gInfo">-->

<!--            </quill-editor>-->
<!--          </el-form-item>-->
<!--        </el-tab-pane>-->

      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>

export default {
  inject: ['reload'],
  // import引入的组件需要注入到对象中才能使用",
  data () {
    // 这里存放数据",
    return {
      active: '1',
      ruleForm: {
        gname: '', // 产品名称
        gnum: '', // 产品库存
        ginfo: '', // 产品简介
        gsalenum: 0, // 销售数量
        gimg: '', // 图片
        gimgMain: '', // 主图
        gpride: '', // 价格
        glinepride: '', // 划线价
        gtype: '', // 类型
        gsalerName: localStorage.getItem('salername'), // 所属供销商昵称
        gsalerId: localStorage.getItem('salerId')// 所属供销商id
      },
      rules: {
        gname: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ],
        gnum: [
          { required: true, message: '请输入产品库存', trigger: 'blur' },
          {type: 'number', message: '产品库存必须为数字值'}

        ],
        gpride: [
          { required: true, message: '请输入产品价格', trigger: 'blur' },
          { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确格式,可保留两位小数' }
        ],
        glinepride: [
          {pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确格式,可保留两位小数', trigger: 'blur'}
        ],
        ginfo: [
          { required: true, message: '请输入产品简介', trigger: 'blur' }
        ]
      },
      // 级联选择器数据
      options: [],
      selectedOptions: ['9000', '900'],
      defaultProp: {
        label: 'typeName',
        value: 'typeId',
        children: 'children',
        expandTrigger: 'hover'
      },
      //  图片上传
      actionAddr: 'http://localhost:8081/goods/uploadMain',
      headers: {
        token: localStorage.getItem('token')
      },
      limitNum: 5

    }
  },
  // 方法集合",
  created () {
    this.getGoodsType()
  },
  methods: {
    addGoods (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 设置类型
          this.ruleForm.gtype = this.selectedOptions.join('')
          // 提交请求
          this.$http.post(`goods/postOneGood`, this.ruleForm).then((res) => {
            const {
              msg,
              code
            } = res.data
            if (code === '0000') {
              this.$message.success(msg)
              this.reload()
            } else {
              this.$message.error(msg)
            }
          })
        } else {
          this.active = '1'
          return false
        }
      })
    },
    // 图片上传方法
    handleRemove (file) {
      // 移除图片
      let nowUrl = file.response.msg// 要移出的图片在云端的路径

      let urlStr = this.ruleForm.gimg// 当前已保存路径
      let urlArr = urlStr.split(',')// 字符串转数组
      let Index = urlArr.findIndex((item) => {
        return item === nowUrl // 寻找索引
      })
      // urlArr[Index].split('/')[3],删除key
      this.$http.post(`goods/deleteImg?key=${urlArr[Index].split('/')[3]}`).then((res) => {
        // 删除成功后
        this.$message.success('已移除')
        urlArr.splice(Index, 1)
        this.ruleForm.gimg = urlArr.toString()// 数组转字符串并赋值
      })
    },
    handlePreview (file) {
      // 预览图片
      console.log('handlePreview')
      console.log('file')
    },
    handleSuccess (file) {
      // 成功上传
      // file.msg为上传商品路径

      this.$message.success('成功上传')
      let url = this.ruleForm.gimg
      let tmpUrl = file.msg
      if (url === '') {
        this.ruleForm.gimg = tmpUrl
      } else {
        this.ruleForm.gimg = url + ',' + tmpUrl
      }
      console.log('success')
    },
    beforeUpload (file) {
    //  上传之前
      const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1)

      const whiteList = ['jpg', 'jpeg', 'png']

      if (whiteList.indexOf(fileSuffix) === -1) {
        this.$message.warning('上传文件只能是 jpg、jpeg、png格式')
        return false
      }

      const isLt2M = file.size / 1024 / 1024 < 1

      if (!isLt2M) {
        this.$message.warning('上传文件大小不能超过 1MB')
        return false
      }
    },
    // 选择器方法
    handleChange () {
    //  级联选择器触发
    },
    // 表单提交
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    //  获取分类信息
    async getGoodsType () {
      const res = await this.$http.get(`goodsType/getAllTypeName/2`)
      console.log(res.data)
      this.options = res.data
    }
  }
}
</script>

<style>
.topAlert{
  margin-top: 20px;
}
.demo-ruleForm{
  height: 550px;
  overflow: auto;
}
.upload-demo{
  margin-top: 50px;
}
.formItemFirst{
  margin-top: 50px;
  width: 700px;
}
.formItemOthers{
  width: 700px;
}
.addBtn{
  margin-top: 20px;
  float: right;
}
</style>
