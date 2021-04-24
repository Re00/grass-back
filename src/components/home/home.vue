<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            供货商管理
          </div>
        </el-col>
        <el-col :span="18" class="header-middle">
          <div class="grid-content bg-purple-light">
            <h3>
              横幅
            </h3>
          </div>
        </el-col>
        <el-col :span="2" class="logout">
          <div class="grid-content bg-purple">
            <a href="">注销</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>

      <el-aside width="200px" class="aside">
        <el-menu
          :unique-opened="true"
          default-active="1"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-s-goods"></i>
              <span>产品管理</span>
            </template>
            <el-menu-item-group title="">
              <el-menu-item index="1-1">
                <i class="el-icon-goods"></i>浏览产品
              </el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="">
              <el-menu-item index="1-2">
                <i class="el-icon-goods"></i>上架产品
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="2">
            <template slot="title">
              <!--              <i class="el-icon-location"></i>-->
              <span>订单管理</span>
            </template>
            <el-menu-item-group title="">
              <el-menu-item index="2-1">待发货</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="">
              <el-menu-item index="2-2">已完成</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="">
              <el-menu-item index="2-3">已取消</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>

      </el-aside>
      <el-main class="main">Main</el-main>
    </el-container>
  </el-container>
</template>

<script>

export default {
  beforeCreate () {
    // 登录验证
    // const token = localStorage.getItem("token")
    // if(!token){
    //   this.$router.push({name:"login"})
    // }
  },
  // import引入的组件需要注入到对象中才能使用",
  components: {},
  data () {
    // 这里存放数据",
    return {}
  },
  // 方法集合",
  methods: {

    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
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
