<template>
  <el-card class="allBuyerBox-card">
    <!--    面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/homeForAdmin' } " replace>首页</el-breadcrumb-item>
      <el-breadcrumb-item >用户管理</el-breadcrumb-item>
      <el-breadcrumb-item >采购商管理</el-breadcrumb-item>
      <el-breadcrumb-item >采购商一览</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    搜索框-->
    <el-row class="search">
      <el-col>
        <el-input placeholder="请输入内容"
                  v-model="query"
                  class="input-with-select">
          <el-button slot="append"
                     icon="el-icon-search"
                     @click.prevent="searchOrder()">
          </el-button>
        </el-input>
      </el-col>
    </el-row>
    <!--    表格-->
    <el-table
      :data="tableData"
      style="width: 100%;text-align: center">
      <el-table-column
        label="#"
        width="60"
        type="index"
      >
      </el-table-column>

      <el-table-column
        label="采购商头像"
        width="120"
        prop="buyerimg"
      >
        <template slot-scope="scope">
          <el-popover
            placement="right"
            :title="scope.row.buyername"
            trigger="hover">
            <img :src="scope.row.buyerimg"
                 style="max-height: 400px;max-width: 450px"/>
            <img slot="reference"
                 :src="scope.row.buyerimg"
                 style="max-height: 50px;max-width: 150px"
            />
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column
        prop="buyerId"
        label="采购商编号"
        width="200"
      >
      </el-table-column>

      <el-table-column
        prop="buyeraccount"
        label="采购商账户"
        width="140"
      >
      </el-table-column>

      <el-table-column
      prop="buyerpass"
      label="采购商密码"
      width="140"
      >
    </el-table-column>

      <el-table-column
        prop="buyername"
        label="采购商昵称"
        width="160"
      >
      </el-table-column>

      <el-table-column
        prop="buyerinfo"
        label="采购商简介"
        width="240"
      >
      </el-table-column>

      <el-table-column
        prop="touptime"
        label="创建时间"
        width="160">
      </el-table-column>

      <el-table-column label="操作" width="200">
        <template slot-scope="scope" style="text-align: center;">
          <el-button
            size="mini"
            type="primary"
            @click="handleUpdate(scope.row)">修改</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.buyerId)">删除</el-button>

        </template>
      </el-table-column>

    </el-table>
    <!--    分页-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="current"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!--  修改对话框-->
    <el-dialog
      title="采购商信息"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
    @close="diaClose">
      <el-form :model="form">
        <el-form-item label="头像" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            :action="actionAddr"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="编号" :label-width="formLabelWidth">
          <el-input v-model="form.buyerId" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="昵称" :label-width="formLabelWidth">
          <el-input v-model="form.buyername" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="账户" :label-width="formLabelWidth">
          <el-input v-model="form.buyeraccount" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.buyerpass" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="简介" :label-width="formLabelWidth">
          <el-input v-model="form.buyerinfo" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateFalse()">取 消</el-button>
        <el-button type="primary" @click="updatebuyer()">确 定</el-button>
      </span>
    </el-dialog>

  </el-card>

</template>

<script>

export default {
  inject: ['reload'],
  // import引入的组件需要注入到对象中才能使用",
  components: {},
  data () {
    // 这里存放数据",
    return {
      // 搜索值
      query: '',
      // 分页值
      current: 1,
      size: 5,
      total: 0,
      // 表单数据
      tableData: [],
      // 修改显示参数
      centerDialogVisible: false,
      // 修改表格宽度
      formLabelWidth: '120px',
      // 修改表格数据
      form: {
        buyerId: '',
        buyername: '',
        buyeraccount: '',
        buyerpass: '',
        buyerimg: '',
        buyerinfo: ''
      },
      imageUrl: '',
      checkUrl: '',
      actionAddr: 'http://localhost:8081/goods/uploadMain'
    }
  },
  created () {
    this.getOrderList()
  },
  // 方法集合",
  methods: {

    // 头像上传
    handleAvatarSuccess (res) {
      // 上传成功
      this.imageUrl = res.msg
      this.checkUrl = res.msg
      this.form.buyerimg = res.msg
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
    // 修改函数
    updatebuyer () {
      //  提交表单修改订单信息
      this.centerDialogVisible = false

      this.$http.put(`buyer/updateOneBuyer`, this.form).then((res) => {
        const {msg, code} = res.data
        if (code === '0000') {
          this.$message.success(msg)
        } else {
          this.$message.error(msg)
        }
        this.reload()
      }).catch((error) => {
        console.log(error)
      })
    },
    handleUpdate (row) {
      //  显示修改订单信息
      this.centerDialogVisible = true

      this.form.buyerId = row.buyerId
      this.form.buyername = row.buyername
      this.form.buyeraccount = row.buyeraccount
      this.form.buyerpass = row.buyerpass
      this.form.buyerimg = row.buyerimg
      this.form.buyerinfo = row.buyerinfo

      this.imageUrl = row.buyerimg
    },
    updateFalse () {
      this.imageUrl = ''
      this.centerDialogVisible = false // 关闭显示
      if (this.checkUrl === '') {
      //  说明没上传
        console.log('没上传头像')
      } else {
      //  上传过头像，还取消了
        console.log('上传了，还没提交')
        let deleteUrl = this.checkUrl.split('/')[3]// 切分后获取要删除的名称
        this.$http.post(`goods/deleteImg?key=${deleteUrl}`)// 直接云端删除未上传头像
      }
    },
    // 修改对话框关闭
    diaClose () {
      this.updateFalse()
    },
    // 删除函数
    handleDelete (buyerId) {
      console.log(buyerId)
      // 删除采购商信息
      this.$confirm('此操作将永久删除该采购商, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`buyer/deleteOneBuyer/${buyerId}`).then((res) => {
          if (res.data.code === '0000') {
            // 更新视图
            this.reload()
            // 提示
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '删除失败'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    // 分页函数
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.size = val
      this.current = 1
      this.getOrderList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.current = val
      this.getOrderList()
    },
    setSomething (msg, code, buyerList, total, current, size) {
      //  赋值函数
      console.log('进入赋值函数')
      if (code === '0000') {
        //  赋值表格
        this.tableData = buyerList
        //  给总数赋值
        this.total = parseInt(total)
        this.current = current
        this.size = size
        //  成功不提示
      } else {
        this.$message.warning(msg)
      }
    },
    async searchOrder () {
      //  查询采购商
      const res = await this.$http.get(`buyer/searchAllBuyer?current=${this.current}&size=${this.size}&searchName=${this.query}`)
      console.log(res)
      if (res.data.data != null) {
        const {
          data: {buyerList, total, current, size},
          msg,
          code
        } = res.data
        this.setSomething(msg, code, buyerList, total, current, size)
      } else {
        this.tableData = []
      }
    },
    async getOrderList () {
      //  获取数据
      const res = await this.$http.get(`buyer/getAllBuyers?current=${this.current}&size=${this.size}`)
      if (res.data.data != null) {
        console.log(res)
        const {
          data: {buyerList, total, current, size},
          msg,
          code
        } = res.data
        this.setSomething(msg, code, buyerList, total, current, size)
      } else {
        this.tableData = []
      }
    }
  }
}
</script>

<style >
.search{
  margin-top:30px;
}

.allBuyerBox-card {
  width: 100%;
  min-width: 1450px;
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
