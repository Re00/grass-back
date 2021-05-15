<template>
  <el-card class="orderForSlaerComBox-card">
    <!--    面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/homeForSaler' } " replace>首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>已完成订单</el-breadcrumb-item>
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
        width="180"
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
        <!--        <template slot-scope="scope">-->
        <!--          <i class="el-icon-time"></i>-->
        <!--          <span style="margin-left: 10px"></span>-->
        <!--        </template>-->
      </el-table-column>

      <!--      <el-table-column-->
      <!--        label="姓名"-->
      <!--        width="180">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-popover trigger="hover" placement="top">-->
      <!--            <p>姓名: {{ scope.row.name }}</p>-->
      <!--            <p>住址: {{ scope.row.address }}</p>-->
      <!--            <div slot="reference" class="name-wrapper">-->
      <!--              <el-tag size="medium">{{ scope.row.name }}</el-tag>-->
      <!--            </div>-->
      <!--          </el-popover>-->
      <!--        </template>-->
      <!--      </el-table-column>-->

      <el-table-column label="操作" >
        <template slot-scope="scope" style="text-align: center;">

          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.soId)">删除</el-button>
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
      type: 1,
      // 表单数据
      tableData: [],

      // 修改时的产品数量
      num: 1
    }
  },
  created () {
    this.getOrderList()
  },
  // 方法集合",
  methods: {

    handleDelete (soId) {
      // 删除订单信息
      console.log()
      this.$confirm('此操作将永久删除该订单记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`salerOrder/deleteOneSalerOrder/${soId}`).then((res) => {
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
          message: '已取消删除'
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
      const salerId = localStorage.getItem('salerId')
      if (this.query === '') {
        this.searchTF = false
      } else {
        this.searchTF = true
      }
      const res = await this.$http.get(`salerOrder/searchOrderByGName?current=${this.current}&size=${this.size}&gName=${this.query}&type=${this.type}&Sid=${salerId}`)
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
      const salerId = localStorage.getItem('salerId')
      //  获取数据
      const res = await this.$http.get(`salerOrder/getPageOrderBytpId?current=${this.current}&size=${this.size}&Sid=${salerId}&type=${this.type}`)
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

.orderForSlaerComBox-card {
  width: 100%;
  min-width: 1450px;
}

</style>
