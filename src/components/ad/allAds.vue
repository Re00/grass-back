<template>
<el-card>
  <!--    面包屑-->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/homeForAdmin' } " replace>首页</el-breadcrumb-item>
    <el-breadcrumb-item>广告管理</el-breadcrumb-item>
    <el-breadcrumb-item>查看广告</el-breadcrumb-item>
  </el-breadcrumb>
  <el-table
    :data="tableData"
    :default-sort = "{prop: 'touptime', order: 'descending'}"
    height="700"
    border
    style="width: 100%">
    <el-table-column
      type="index"
      label="#"
      width="80">
    </el-table-column>
    <el-table-column
      prop="id"
      label="图片编号"
      width="330">
    </el-table-column>
    <el-table-column
      label="图片"
      width="180">
      <template slot-scope="scope">
        <el-popover
          placement="right"
          :title="scope.row.adName"
          trigger="hover">
          <img :src="scope.row.adImg"
               style="max-height: 400px;max-width: 450px"/>
          <img slot="reference"
               :src="scope.row.adImg"
               style="max-height: 50px;max-width: 150px"
          />
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column
      prop="adName"
      label="图片名称"
      width="230">
    </el-table-column>
    <el-table-column
      prop="touptime"
      label="日期"
      width="280"
      sortable>
    </el-table-column>
    <el-table-column
      label="操作"
    >
      <template slot-scope="scope" style="text-align: center;">
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</el-card>
</template>

<script>

export default {
  inject: ['reload'],
  created () {
    this.getCarousel()
  },
  data () {
    // 这里存放数据",
    return {
      tableData: [],
      size: 5,
      current: 1
    }
  },
  // 方法集合",
  methods: {
    getCarousel () {
      this.$http.get(`ad/getAllAds?current=${this.current}&size=${this.size}`).then(res => {
        if (res.data.code === '0000') {
          this.tableData = res.data.data.adList
        }
      })
    },
    handleDelete (id) {
      this.$confirm('此操作将永久删除该广告, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`ad/deleteOneAd?id=${id}`).then(res => {
          if (res.data.code === '0000') {
            this.reload()
            this.$notify.success(res.data.msg)
          } else {
            this.$notify.error(res.data.msg)
          }
        })
      })
    }
  }
}
</script>

<style>

</style>
