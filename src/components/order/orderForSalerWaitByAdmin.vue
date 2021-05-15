<template>
  <el-card class="orderForSlaerWaitBox-card">
<!--    面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/homeForAdmin' } " replace>首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>供货商订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>待完成订单</el-breadcrumb-item>
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
        prop="soId"
        label="订单编号"
        width="170"
      >
      </el-table-column>

      <el-table-column
        prop="sid"
        label="供货商编号"
        width="170"
      >
      </el-table-column>
      <el-table-column
        prop="bname"
        label="采购商姓名"
        width="100"
      >
      </el-table-column>

      <el-table-column
        prop="gname"
        label="商品名称"
        width="180"
      >
      </el-table-column>

      <el-table-column
        prop="goodsnum"
        label="数量"
        width="60"
      >
      </el-table-column>

      <el-table-column
        prop="goPrice"
        label="价格"
        width="80"
      >
      </el-table-column>

      <el-table-column
        prop="baddr"
        label="采购商地址"
        width="220"
      >
      </el-table-column>

      <el-table-column
        prop="soInfo"
        label="备注"
        width="180"
      >
      </el-table-column>

      <el-table-column
        prop="touptime"
        label="创建时间"
        width="160">
      </el-table-column>

      <el-table-column label="操作" width="260">
        <template slot-scope="scope" style="text-align: center;">
          <el-button
            size="mini"
            type="primary"
            @click="handleUpdate(scope.row)">修改</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.soId,scope.row.boId)">取消</el-button>
          <el-button
            size="mini"
            type="success"
            @click="handleCom(scope.row.soId,scope.row.boId)">完成</el-button>
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
      title="订单信息"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <el-form :model="form">
        <el-form-item label="订单编号" :label-width="formLabelWidth">
          <el-input v-model="form.soId" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="采购商姓名" :label-width="formLabelWidth">
          <el-input v-model="form.bname" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input v-model="form.gname" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="数量" :label-width="formLabelWidth">
<!--          <el-input v-model="form.goodsnum" autocomplete="off"></el-input>-->
          <el-input-number v-model="form.goodsnum" @change="handleChange" :min="1" :max="form.gnum" label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item label="价格" :label-width="formLabelWidth">
          <el-input v-model="form.goPrice" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth">
          <el-input v-model="form.baddr" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="form.soInfo" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateOrder()">确 定</el-button>
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
      searchTF: false,
      // 分页值
      current: 1,
      size: 5,
      total: 0,
      // 状态类型
      type: 0,
      // 表单数据
      tableData: [],
      // 修改显示参数
      centerDialogVisible: false,
      // 修改表格宽度
      formLabelWidth: '120px',
      // 修改表格数据
      form: {
        soId: '',
        boId: '',
        bname: '',
        gname: '',
        goodsnum: '',
        gnum: '',
        gprice: '',
        goPrice: '',
        baddr: '',
        soInfo: '',
        goId: ''
      },
      // 修改时的产品数量
      num: 1
    }
  },
  created () {
    this.getOrderList()
  },
  // 方法集合",
  methods: {
    updateOrder () {
    //  提交表单修改订单信息
      this.centerDialogVisible = false
      const neverNum = this.num
      const formNum = this.form.goodsnum
      let upOrDown // 更新状态码，0数量增加，1数量减少，2不变
      let updateNum // 数量增加或减少数量
      if (neverNum < formNum) {
        upOrDown = 0
        updateNum = formNum - neverNum
      } else if (neverNum > formNum) {
        upOrDown = 1
        updateNum = neverNum - formNum
      } else {
        upOrDown = 2
      }
      this.$http.put(`salerOrder/updateSalerOrder?upOrDown=${upOrDown}&goodsNum=${updateNum}`, this.form).then((res) => {
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
    handleChange (value) {
      // 修改产品数量
      console.log(value)
      const price = this.form.gprice
      this.form.goPrice = price * value
    },
    handleUpdate (row) {
    //  显示修改订单信息
      this.centerDialogVisible = true

      this.form.soId = row.soId
      this.form.soInfo = row.soInfo
      this.form.bname = row.bname
      this.form.gname = row.gname
      this.form.goodsnum = row.goodsnum
      this.form.gnum = row.gnum
      this.form.gprice = row.gprice
      this.form.goPrice = row.goPrice
      this.form.baddr = row.baddr
      this.form.goId = row.goId
      this.form.boId = row.boId

      this.num = row.goodsnum
    },
    handleDelete (soId, boId) {
      console.log(boId)
      // 取消订单信息
      this.$confirm('此操作将取消双方订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.put(`salerOrder/completeOneSalerOrder?boId=${boId}&soId=${soId}&soType=2`).then((res) => {
          if (res.data.code === '0000') {
            // 更新视图
            this.reload()
            // 提示
            this.$message({
              type: 'success',
              message: '取消成功!'
            })
          }
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '取消失败'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    handleCom (soId, boId) {
      console.log(boId)
      // 完成订单
      this.$confirm('此操作将同时完成双方订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.put(`salerOrder/completeOneSalerOrder?boId=${boId}&soId=${soId}&soType=1`).then((res) => {
          if (res.data.code === '0000') {
            // 更新视图
            this.reload()
            // 提示
            this.$message({
              type: 'success',
              message: '已完成!'
            })
          }
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '未完成'
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
      if (this.searchTF) {
        this.searchOrder()
      } else {
        this.getOrderList()
      }
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.current = val
      if (this.searchTF) {
        this.searchOrder()
      } else {
        this.getOrderList()
      }
    },
    setSomething (msg, code, salerOrderList, total, current, size) {
    //  赋值函数
      console.log('进入赋值函数')
      if (code === '0000') {
        //  赋值表格
        this.tableData = salerOrderList
        //  给总数赋值
        this.total = parseInt(total)
        this.current = current
        this.size = size
        //  提示成功
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
    },
    async searchOrder () {
      //  查询订单
      if (this.query === '') {
        this.searchTF = false
      } else {
        this.searchTF = true
      }
      const res = await this.$http.get(`salerOrder/searchOrderForAdmin?current=${this.current}&size=${this.size}&searchName=${this.query}&type=${this.type}`)
      if (res.data.data != null) {
        const {
          data: {salerOrderList, total, current, size},
          msg,
          code
        } = res.data
        this.setSomething(msg, code, salerOrderList, total, current, size)
      } else {
        this.tableData = []
      }
    },
    async getOrderList () {
      //  获取数据
      const res = await this.$http.get(`salerOrder/searchOrderByType?current=${this.current}&size=${this.size}&type=${this.type}`)
      if (res.data.data != null) {
        const {
          data: {salerOrderList, total, current, size},
          msg,
          code
        } = res.data
        this.setSomething(msg, code, salerOrderList, total, current, size)
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

.orderForSlaerWaitBox-card {
  width: 100%;
  min-width: 1450px;
}

</style>
