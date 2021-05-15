<template>
  <el-card shadow="hover" class="annBuyerbox-card">
    <!--    面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/homeForAdmin' } " replace>首页</el-breadcrumb-item>
      <el-breadcrumb-item>公告管理</el-breadcrumb-item>
      <el-breadcrumb-item>查看采购商公告</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table
      :data="TableData"
      style="width: 100%"
      :default-sort = "{prop: 'touptime', order: 'descending'}"
      highlight-current-row
      @cell-click="rowClick"
    >
      <el-table-column
        prop="#"
        type="index"
        width="70">
      </el-table-column>
      <el-table-column
        prop="touptime"
        label="发布日期"
        sortable
        width="380"
      >
      </el-table-column>
      <el-table-column
        prop="borSName"
        label="发布者"
        sortable
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题"
        width="200"
      >
      </el-table-column>
      <el-table-column
        prop="do"
        label="操作"
        width="200"
      >
        <template slot-scope="scope">
          <el-button type="danger" @click="deleteAnnounce(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--          分页-->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="current"
      :page-sizes="[10, 15, 20, 25,30]"
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
  created () {
    this.getAnnounce()
  },
  data () {
    // 这里存放数据",
    return {
      TableData: [],
      type: 1,
      current: 1,
      size: 10,
      total: 0
    }
  },
  // 方法集合",
  methods: {
    getAnnounce () {
      this.$http.get(`announcement/getAnnounce?current=${this.current}&size=${this.size}&type=${this.type}`).then(res => {
        if (res.data.code === '0000') {
          const data = res.data.data
          console.log(data)
          this.TableData = data.announcementList
          this.current = data.current
          this.size = data.size
          this.total = parseInt(data.total)
        } else {
          this.current = 1
          this.size = 10
          this.total = 0
        }
      })
    },
    deleteAnnounce (id) {
      console.log(id)
      this.$confirm('此操作将永久删除该公告, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`announcement/deleteOneAnnounce?id=${id}`).then(res => {
          if (res.data.code === '0000') {
            this.$message.success(res.data.msg)
            this.getAnnounce()
          } else {
            this.$message.error(res.data.msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    rowClick (row, column) {
      if (column.property !== 'do') {
        this.$router.push({name: 'oneAnnounceInAdmin', query: {announceId: row.id}})
      }
    },
    handleSizeChange (val) {
      this.size = val
      this.current = 1
      this.getAnnounce()
    },
    handleCurrentChange (val) {
      this.current = val
      this.getAnnounce()
    }
  }
}
</script>

<style>
.annBuyerbox-card {

  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
