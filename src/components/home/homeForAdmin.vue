<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <router-link to="/homeForAdmin">
              <img :src="$target + '1620886438121.png'"/>
            </router-link>
          </div>
        </el-col>
        <el-col :span="18" class="header-middle">
          <div class="grid-content bg-purple-light">
            <h3>
              后台管理
            </h3>
          </div>
        </el-col>
        <el-col :span="2" class="logout">
          <div class="grid-content bg-purple">
            <a href="" @click.prevent="handleLogOut()">注销</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>

      <el-aside width="200px" class="aside">
        <el-menu
          :unique-opened="true"
          :default-active="this.$route.path"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          router>
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
            <el-submenu index="1-1">
              <template slot="title">供货商订单</template>
              <el-menu-item index="orderForSalerWaitByAdmin">待发货</el-menu-item>
              <el-menu-item index="orderForSalerComByAdmin">已完成</el-menu-item>
              <el-menu-item index="orderForSalerUnByAdmin">已取消</el-menu-item>
            </el-submenu>
            <el-submenu index="1-2">
              <template slot="title">采购商订单</template>
              <el-menu-item index="orderForBuyerWaitByAdmin">待收货</el-menu-item>
              <el-menu-item index="orderForBuyerComByAdmin">已收货</el-menu-item>
              <el-menu-item index="orderForBuyerUnByAdmin">已取消</el-menu-item>
            </el-submenu>
            </el-submenu>
<!--          2-->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>产品管理</span>
            </template>
            <el-menu-item index="goodsForAdmin">
              <i class="el-icon-goods"></i>
              <span>所有产品</span>
            </el-menu-item>
            <el-menu-item index="addGoodsForAdmin">
              <i class="el-icon-goods"></i>
              <span>增加产品</span>
            </el-menu-item>
            <el-menu-item index="addGoodsTypeForAdmin">
              <i class="el-icon-goods"></i>
              <span>增加分类</span>
            </el-menu-item>
          </el-submenu>
<!--          3-->
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-submenu index="3-1">
              <template slot="title">供货商管理</template>
              <el-menu-item index="allSaler">浏览供货商</el-menu-item>
              <el-menu-item index="addSaler">添加供货商</el-menu-item>
            </el-submenu>
            <el-submenu index="3-2">
              <template slot="title">采购商管理</template>
              <el-menu-item index="allBuyer">浏览采购商</el-menu-item>
              <el-menu-item index="addBuyer">添加采购商</el-menu-item>
            </el-submenu>
          </el-submenu>
<!--          4-->
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>公告管理</span>
            </template>
            <el-menu-item index="announceForBuyer">
              <span>供货商公告</span>
            </el-menu-item>
            <el-menu-item index="announceForSaler">
              <span>采购商公告</span>
            </el-menu-item>
            <el-menu-item index="announceForAdmin">
              <span>管理员公告</span>
            </el-menu-item>
            <el-menu-item index="addAnnounceForAdmin">
              <span>发布公告</span>
            </el-menu-item>
          </el-submenu>
<!--          5-->
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>轮播图管理</span>
            </template>
            <el-menu-item index="allCarousel">
              <span>查看轮播图</span>
            </el-menu-item>
            <el-menu-item index="addCarousel">
              <span>添加轮播图</span>
            </el-menu-item>
          </el-submenu>
<!--          6-->
          <el-submenu index="6">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>广告管理</span>
            </template>
            <el-menu-item index="allAds">
              <span>查看广告</span>
            </el-menu-item>
            <el-menu-item index="addAd">
              <span>添加广告</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>

      </el-aside>
      <el-main class="main">
        <!--        路由容器-->
        <router-view v-if="isRouterAlive"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {

  provide () { // 父组件中通过provide来提供变量，在子组件中通过inject来注入变量。
    return {
      reload: this.reload
    }
  },
  created () {
    if (localStorage.getItem('admin')) {
      // 如果已经登录，设置vuex登录状态
      this.setAdmin(JSON.parse(localStorage.getItem('admin')))
      // console.log(localStorage.getItem('admin'))
    } else {
      this.$router.push({name: 'loginForAdmin'})
    }
  },
  // beforeCreate () {
  //   // 登录验证
  //   const token = localStorage.getItem('token')
  //   console.log(token)
  //   if (!token) {
  //     this.$router.push({name: 'loginForAdmin'})
  //   }
  // },
  // import引入的组件需要注入到对象中才能使用",
  components: {},
  data () {
    // 这里存放数据",
    return {
      isRouterAlive: true // 控制视图是否显示的变量
    }
  },
  // 方法集合",
  methods: {
    ...mapActions(['setAdminToken', 'setShowLogin', 'setAdmin']),
    ...mapGetters(['getAdminToken', 'getAdmin']),
    reload () {
      this.isRouterAlive = false // 先关闭，
      this.$nextTick(function () {
        this.isRouterAlive = true // 再打开
      })
    },
    handleOpen (key, keyPath) {

    },
    handleClose (key, keyPath) {

    },
    handleLogOut () {
      // 退出登录
      // 清除vuex
      this.setAdmin('')
      // 清楚token
      localStorage.clear()
      // 提示退出
      this.$message.success('退出成功')
      // 跳转login
      this.$router.push({name: 'loginForAdmin'})
    }
  }
}
</script>

<style>
.container {
  height: 100%;
}

.header {
  background-color: #b3c0d1;
}

.aside {
  background-color: #d3dce6;
}

.main {
  background-color: #e9eef3;
}

.header-middle {
  text-align: center;
}

.logout {
  line-height: 60px;
}
</style>
