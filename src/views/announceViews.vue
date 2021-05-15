<template>
  <el-card shadow="hover" class="announceViewBox-card">
<!--    面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 20px">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>公告</el-breadcrumb-item>
    </el-breadcrumb>
<!--    表格-->
      <el-tabs type="border-card" class="tabClass" tab-position="top">
        <el-tab-pane label="采购商公告">
          <el-table
            :data="buyerTableData"
            style="width: 100%"
            :default-sort = "{prop: 'touptime', order: 'descending'}"
            highlight-current-row
            @row-click = "rowClick($event)"
          >
            <router-link to="/oneAnnounce">
            <el-table-column
              prop="touptime"
              label="发布日期"
              sortable
              width="180">
            </el-table-column>
            <el-table-column
              prop="borSName"
              label="发布者姓名"
              sortable
              width="380">
            </el-table-column>
            <el-table-column
              prop="title"
              label="标题"
              >
            </el-table-column>
            </router-link>
          </el-table>
<!--          分页-->
          <el-pagination
            background
            @size-change="handleSizeChangeForBuyer"
            @current-change="handleCurrentChangeForBuyer"
            :current-page="currentForBuyer"
            :page-sizes="[10, 15, 20, 25,30]"
            :page-size="sizeForBuyer"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalForBuyer">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="供货商公告">
          <el-table
            :data="salerTableData"
            style="width: 100%"
            :default-sort = "{prop: 'date', order: 'descending'}"
            highlight-current-row
            @row-click = "rowClick($event)"
          >
            <router-link to="/oneAnnounce">
            <el-table-column
              prop="touptime"
              label="发布日期"
              sortable
              width="180">
            </el-table-column>
            <el-table-column
              prop="borSName"
              label="发布者姓名"
              sortable
              width="380">
            </el-table-column>
            <el-table-column
              prop="title"
              label="标题"
            >
            </el-table-column>
            </router-link>
          </el-table>
          <!--    分页-->
          <el-pagination
            background
            @size-change="handleSizeChangeForSaler"
            @current-change="handleCurrentChangeForSaler"
            :current-page="currentForSaler"
            :page-sizes="[10, 15, 20, 25,30]"
            :page-size="sizeForSaler"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalForSaler">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="管理员公告">
          <el-table
            :data="adminTableData"
            style="width: 100%"
            :default-sort = "{prop: 'date', order: 'descending'}"
            highlight-current-row
            @row-click = "rowClick($event)"
          >
            <router-link to="/oneAnnounce">
              <el-table-column
                prop="touptime"
                label="发布日期"
                sortable
                width="180">
              </el-table-column>
              <el-table-column
                prop="borSName"
                label="发布管理"
                sortable
                width="380">
              </el-table-column>
              <el-table-column
                prop="title"
                label="标题"
              >
              </el-table-column>
            </router-link>
          </el-table>
          <!--    分页-->
          <el-pagination
            background
            @size-change="handleSizeChangeForAdmin"
            @current-change="handleCurrentChangeForAdmin"
            :current-page="currentForAdmin"
            :page-sizes="[10, 15, 20, 25,30]"
            :page-size="sizeForAdmin"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalForAdmin">
          </el-pagination>
        </el-tab-pane>

      </el-tabs>

  </el-card>
</template>

<script>
export default {
  inject: ['reload'],
  created () {
    this.getAnnounceForBuyer()
    this.getAnnounceForSaler()
    this.getAnnounceForAdmin()
  },
  activated () {
    this.getAnnounceForBuyer()
    this.getAnnounceForSaler()
    this.getAnnounceForAdmin()
  },
  data () {
    return {
      // 采购商
      buyerTableData: [],
      typeForBuyer: 1,
      currentForBuyer: 1,
      sizeForBuyer: 10,
      totalForBuyer: 0,
      // 供货商
      salerTableData: [],
      typeForSaler: 2,
      currentForSaler: 1,
      sizeForSaler: 10,
      totalForSaler: 0,
      // 管理员
      adminTableData: [],
      typeForAdmin: 0,
      currentForAdmin: 1,
      sizeForAdmin: 10,
      totalForAdmin: 0,
      // 选中行
      currentRow: 0
    }
  },
  watch: {
    currentRow: function (val) {
      this.reload()
    }
  },
  methods: {
    formatter (row, column) {
      return row.address
    },
    getAnnounceForBuyer () {
      this.$http.get(`announcement/getAnnounce?current=${this.currentForBuyer}&size=${this.sizeForBuyer}&type=${this.typeForBuyer}`).then(res => {
        if (res.data.code === '0000') {
          const data = res.data.data
          console.log(data)
          this.buyerTableData = data.announcementList
          this.currentForBuyer = data.current
          this.sizeForBuyer = data.size
          this.totalForBuyer = parseInt(data.total)
        } else {
          this.currentForBuyer = 1
          this.sizeForBuyer = 10
          this.totalForBuyer = 0
        }
      })
    },
    getAnnounceForSaler () {
      this.$http.get(`announcement/getAnnounce?current=${this.currentForSaler}&size=${this.sizeForSaler}&type=${this.typeForSaler}`).then(res => {
        if (res.data.code === '0000') {
          const data = res.data.data
          console.log(data)
          this.salerTableData = data.announcementList
          this.currentForSaler = data.current
          this.sizeForSaler = data.size
          this.totalForSaler = parseInt(data.total)
        } else {
          this.currentForSaler = 1
          this.sizeForSaler = 10
          this.totalForSaler = 0
        }
      })
    },
    getAnnounceForAdmin () {
      this.$http.get(`announcement/getAnnounce?current=${this.currentForAdmin}&size=${this.sizeForAdmin}&type=${this.typeForAdmin}`).then(res => {
        if (res.data.code === '0000') {
          const data = res.data.data
          console.log(data)
          this.adminTableData = data.announcementList
          this.currentForAdmin = data.current
          this.sizeForAdmin = data.size
          this.totalForAdmin = parseInt(data.total)
        } else {
          this.currentForAdmin = 1
          this.sizeForAdmin = 10
          this.totalForAdmin = 0
        }
      })
    },
    rowClick (val) {
      this.$router.push({name: 'oneAnnounce', query: {announceId: val.id}})
      console.log(val)
    },
    // 分页函数ForBuyer
    handleSizeChangeForBuyer (val) {
      this.sizeForBuyer = val
      this.currentForBuyer = 1
      this.getAnnounceForBuyer()
    },
    handleCurrentChangeForBuyer (val) {
      this.currentForBuyer = val
      this.getAnnounceForBuyer()
    },
    // 分页函数ForSaler
    handleSizeChangeForSaler (val) {
      this.sizeForSaler = val
      this.currentForSaler = 1
      this.getAnnounceForSaler()
    },
    handleCurrentChangeForSaler (val) {
      this.currentForSaler = val
      this.getAnnounceForSaler()
    },
    //  分页函数ForAdmin
    handleSizeChangeForAdmin (val) {
      this.sizeForAdmin = val
      this.currentForAdmin = 1
      this.getAnnounceForAdmin()
    },
    handleCurrentChangeForAdmin (val) {
      this.currentForAdmin = val
      this.getAnnounceForAdmin()
    }

  }
}
</script>
<style>
.announceViewBox-card {
  width: 1250px;
  min-width: 1250px;
  margin-left: 325px;
  margin-top: 50px;
  height: 900px;
  /*display: flex;*/
  /*justify-content: center;*/
  /*align-items: center;*/
}
.tabClass{
  width: 1150px;
}

</style>
