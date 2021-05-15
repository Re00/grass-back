<template>
  <el-card>
    <!--    面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/homeForAdmin' } " replace>首页</el-breadcrumb-item>
      <el-breadcrumb-item>产品管理</el-breadcrumb-item>
      <el-breadcrumb-item>增加分类</el-breadcrumb-item>
    </el-breadcrumb>

  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

    <el-form-item label="分类名称" prop="typeName" class="formItemFirst">
      <el-input v-model="ruleForm.typeName"></el-input>
    </el-form-item>

    <el-form-item label="分类级别" prop="typeNum">
      <el-select v-model="ruleForm.typeNum" placeholder="请选择级别" @change="optionsChange($event)">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          >
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="父级分类" prop="typePid">
      <el-select v-model="ruleForm.typePid"
                 placeholder="请选择父级分类"
                 :disabled="selectDis"
                 @change="pidOptionsChange($event)">
        <el-option
          v-for="item in typePidOptions"
          :key="item.typeId"
          :label="item.typeName"
          :value="item.typeId"
          >
        </el-option>
      </el-select>

      <el-form-item class="formItemFirst">
        <el-button type="primary" @click="submitForm('ruleForm')">添加分类</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>

    </el-form-item>

  </el-form>
  </el-card>
</template>
<script>
export default {
  inject: ['reload'],
  data () {
    return {
      selectDis: true,
      options: [
        {
          value: '1',
          label: '一级'
        }, {
          value: '2',
          label: '二级'
        }
      ],
      typePidOptions: [],
      ruleForm: {
        typeName: '',
        typeNum: '',
        typePid: ''
      },
      rules: {
        typeName: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        typeNum: [
          { required: true, message: '请选择分类级别', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.getGoodsType()
  },
  methods: {
    addType () {

    },
    optionsChange (changeId) {
      // 父类选择更换
      if (changeId === '2') {
        this.selectDis = false
      } else {
        this.selectDis = true
        this.ruleForm.typePid = ''
      }
    },
    pidOptionsChange (changePid) {
    //  填写pid更换
      this.ruleForm.typePid = changePid
      console.log(changePid)
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm)
          this.$http.post(`goodsType/addOneType`, this.ruleForm).then((res) => {
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
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.selectDis = true
      this.ruleForm.typePid = ''
    },
    async getGoodsType () {
      const res = await this.$http.get(`goodsType/getAllTypeName/1`)
      console.log(res.data)
      this.typePidOptions = res.data
    }
  }
}
</script>

<style>
.demo-ruleForm{
  margin-top: 20px;
}
.formItemFirst{
  margin-top: 50px;
  width: 400px;
}
</style>
