<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <router-link to="/homeForSaler">
              <img :src="$target + '1620886438121.png'"/>
            </router-link>
          </div>
        </el-col>
        <el-col :span="18" class="header-middle">
          <div class="grid-content bg-purple-light">
            <h3>
              {{this.$store.getters.getSaler.salername}}的小店
            </h3>
          </div>
        </el-col>
        <el-col :span="2" class="logout">
          <div class="grid-content bg-purple">
            <el-popover placement="top" width="180" v-model="visible">
              <p>确定退出登录吗？</p>
              <div style="text-align: right; margin: 10px 0 0">
                <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="handleLogOut">确定</el-button>
              </div>
              <el-button type="text" slot="reference">
                <el-avatar shape="square" :size="43" :src="this.$store.getters.getSaler.salerImg"></el-avatar>
              </el-button>
            </el-popover>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>

      <el-aside width="200px" class="aside">
        <el-menu
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
              <i class="el-icon-s-order"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="orderForSalerWait">
              <i class="el-icon-time"></i>
              <span>待完成</span>
            </el-menu-item>
            <el-menu-item index="orderForSalerCom">
              <i class="el-icon-s-claim"></i>
              <span>已完成</span>
            </el-menu-item>
            <el-menu-item index="orderForSalerUn">
              <i class="el-icon-s-release"></i>
              <span>已取消</span>
            </el-menu-item>
          </el-submenu>
<!--          2-->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-s-goods"></i>
              <span>产品管理</span>
            </template>
            <el-menu-item index="goodsForSaler">
              <i class="el-icon-goods"></i>
              <span>所有产品</span>
            </el-menu-item>
            <el-menu-item index="addGoodsForSaler">
              <i class="el-icon-goods"></i>
              <span>产品上架</span>
            </el-menu-item>
          </el-submenu>
<!--3-->
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-s-goods"></i>
              <span>个人中心</span>
            </template>
            <el-menu-item index="ownSaler">
              <i class="el-icon-goods"></i>
              <span>我的</span>
            </el-menu-item>
            <el-menu-item index="announceManageForSaler">
              <i class="el-icon-goods"></i>
              <span>公告管理</span>
            </el-menu-item><el-menu-item index="addAnnounceForSaler">
              <i class="el-icon-goods"></i>
              <span>发布公告</span>
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
import {mapActions, mapGetters} from 'vuex'
export default {
  provide () { // 父组件中通过provide来提供变量，在子组件中通过inject来注入变量。
    return {
      reload: this.reload
    }
  },
  // beforeCreate () {
  //   // 登录验证
  //   const token = localStorage.getItem('token')
  //   console.log(this.$store.getters.getSaler)
  //   if (!token) {
  //     this.$router.push({name: 'loginForSaler'})
  //   }
  // },
  created () {
    if (localStorage.getItem('saler')) {
      // 如果已经登录，设置vuex登录状态
      this.setSaler(JSON.parse(localStorage.getItem('saler')))
    } else {
      this.$router.push({name: 'loginForSaler'})
    }
  },
  computed: {
    ...mapGetters(['getSaler'])
  },
  data () {
    // 这里存放数据",
    return {
      isRouterAlive: true, // 控制视图是否显示的变量
      visible: false // 是否退出登录
    }
  },
  // 方法集合",
  methods: {
    ...mapActions(['setSaler']),
    reload () {
      this.isRouterAlive = false // 先关闭，
      this.$nextTick(function () {
        this.isRouterAlive = true // 再打开
      })
    },

    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    handleLogOut () {
      // 退出登录
      // 清楚local
      localStorage.clear()
      // 清除vuex
      this.setSaler('')
      // 提示退出
      this.$message.success('退出成功')
      // 跳转login
      this.$router.push({name: 'loginForSaler'})
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
  width: 100%;
}

.header-middle {
  text-align: center;
}

.logout {
  line-height: 60px;
}

.headImg{
  max-height: 50px;
  max-width: 50px;
}
</style>
