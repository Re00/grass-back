<template>
  <div id="appForBuyer">
  <el-container>
    <!-- 顶部导航栏 -->

    <div class="topbar">
      <div class="nav">
        <ul>
          <li v-show="this.$store.getters.getUser.buyerId!==''&&this.$store.getters.getUser.buyerId!==undefined">
            <p>欢迎 {{this.$store.getters.getUser.buyerName}}</p>
          </li>
          <li v-if="!this.$store.getters.getUser">
            <el-button type="text" @click="login">登录</el-button>
            <span class="sep">|</span>
            <el-button type="text" @click="register = true">注册</el-button>
          </li>
          <li v-else>
            <el-popover placement="top" width="180" v-model="visible">
              <p>确定退出登录吗？</p>
              <div style="text-align: right; margin: 10px 0 0">
                <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="logout">确定</el-button>
              </div>

              <el-button type="text" slot="reference">
                <el-avatar :size="20" :src="this.$store.getters.getUser.buyerImg"></el-avatar>
              </el-button>

            </el-popover>
          </li>
          <li v-show="this.$store.getters.getUser.buyerId!==''&&this.$store.getters.getUser.buyerId!==undefined">
            <router-link to="/order">我的订单</router-link>
          </li>
          <li v-show="this.$store.getters.getUser.buyerId!==''&&this.$store.getters.getUser.buyerId!==undefined">
            <router-link to="/ownBuyer">个人中心</router-link>
          </li>
          <li v-show="this.$store.getters.getUser.buyerId!==''&&this.$store.getters.getUser.buyerId!==undefined">
            <router-link to="/addAnnounce">发布公告</router-link>
          </li>
          <li v-show="this.$store.getters.getUser.buyerId!==''&&this.$store.getters.getUser.buyerId!==undefined">
            <router-link to="/announceManage">我发布的</router-link>
          </li>
          <li :class="getNum > 0 ? 'shopCart-full' : 'shopCart'" v-show="this.$store.getters.getUser.buyerId!==''&&this.$store.getters.getUser.buyerId!==undefined">
            <router-link to="/shoppingCart">
              <i class="el-icon-shopping-cart-full"></i> 购物车
              <span class="num">({{getNum}})</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>

    <!-- 顶部导航栏END -->

    <el-header>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        active-text-color="#409eff"
        router
      >
        <div class="logo">
          <router-link to="/">
            <img :src="$target + '1620886438121.png'"/>
          </router-link>
        </div>
        <el-menu-item index="/">首页</el-menu-item>
        <el-menu-item index="/goods">全部商品</el-menu-item>
        <el-menu-item index="/announceViews">公告</el-menu-item>

        <div class="so">
          <el-input placeholder="请输入搜索内容" v-model="search">
            <el-button slot="append" icon="el-icon-search" @click="searchClick"></el-button>
          </el-input>
        </div>
      </el-menu>

    </el-header>

<!--    &lt;!&ndash; 登录模块 &ndash;&gt;-->
    <MyLogin></MyLogin>
<!--    &lt;!&ndash; 注册模块 &ndash;&gt;-->
    <MyRegister :register="register" @fromChild="isRegister"></MyRegister>

    <el-main>
      <keep-alive>
        <router-view v-if="isRouterAlive"></router-view>
      </keep-alive>
    </el-main>

    <el-footer>
      <div class="footer">
        <div class="ng-promise-box">
          <div class="ng-promise">
            <p class="text">
              <a class="icon1" href="javascript:;">7天无理由退换货</a>
              <a class="icon2" href="javascript:;">满99元全场免邮</a>
              <a class="icon3" style="margin-right: 0" href="javascript:;">100%品质保证</a>
            </p>
          </div>
        </div>
        <div class="github">
          <a href="https://github.com/hai-27/vue-store" target="_blank">
            <div class="github-but"></div>
          </a>
        </div>
        <div class="mod_help">
          <p>
            <router-link to="/">首页</router-link>
            <span>|</span>
            <router-link to="/goods">全部商品</router-link>
          </p>
          <p class="coty">商城版权所有 &copy; 2012-2022</p>
        </div>
      </div>

    </el-footer>
  </el-container>
    <div v-if="showAd" class="adClass" @click="showAd = false">
      <a :href="ad.adUrl"  target="_blank">
        <img :src="ad.adImg" alt="" style="width: 100px;height: 270px">
        <p>{{ad.adName}}</p>
      </a>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  provide () { // 父组件中通过provide来提供变量，在子组件中通过inject来注入变量。
    return {
      reload: this.reload
    }
  },
  beforeUpdate () {
    this.activeIndex = this.$route.path
  },
  data () {
    return {
      isRouterAlive: true, // 控制视图是否显示的变量
      activeIndex: '', // 头部导航栏选中的标签
      search: '', // 搜索条件
      register: false, // 是否显示注册组件
      visible: false, // 是否退出登录
      ad: {
        // id
        // touptime
        // toupdatetime
        // adName
        // adImg
        // adUrl
      }, // 广告
      showAd: true
    }
  },
  created () {
    // 获取浏览器localStorage，判断用户是否已经登录
    if (localStorage.getItem('user')) {
      // 如果已经登录，设置vuex登录状态
      this.setUser(JSON.parse(localStorage.getItem('user')))
    }
    this.getOneAd()
  },
  computed: {
    ...mapGetters(['getUser', 'getNum'])
  },
  watch: {
    // 获取vuex的登录状态
    getUser: function (val) {
      if (val === '') {
        // 用户没有登录
        this.setShoppingCart([])
      } else {
        // 用户已经登录,获取该用户的购物车信息
        console.log(val.buyerId)
        this.$http
          .get(`buyerCart/getAllCartGoods?BCid=${val.buyerId}`)
          .then(res => {
            if (res.data.code === '0000') {
              // 0000 为成功, 更新vuex购物车状态
              this.setShoppingCart(res.data.data)
              console.log(this.setShoppingCart)
            }
          })
          .catch(err => {
            return Promise.reject(err)
          })
      }
    }
  },
  methods: {
    ...mapActions(['setUser', 'setShowLogin', 'setShoppingCart']),
    reload () {
      this.isRouterAlive = false // 先关闭，
      this.$nextTick(function () {
        this.isRouterAlive = true // 再打开
      })
    },
    login () {
      // 点击登录按钮, 通过更改vuex的showLogin值显示登录组件
      this.setShowLogin(true)
    },
    // 退出登录
    logout () {
      this.visible = false
      // 清空本地登录信息
      localStorage.clear()
      // 清空vuex登录信息
      this.setUser('')
      console.log(this.getUser)
      // 返回首页
      this.$router.push({name: 'home'})
      location.reload()
      this.notifySucceed('成功退出登录')
    },
    // 接收注册子组件传过来的数据
    isRegister (val) {
      this.register = val
    },
    // 点击搜索按钮
    searchClick () {
      if (this.search !== '') {
        // 跳转到全部商品页面,并传递搜索条件
        this.$router.push({ path: '/goods', query: { search: this.search } })
        this.search = ''
      }
    },
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
    },
    getOneAd () {
      this.$http.get(`ad/getOneAd`).then(res => {
        if (res.data.code === '0000') {
          console.log(res.data.data)
          this.ad = res.data.data
        }
      })
    }
  }
}
</script>
<style>
.adClass{
  position: fixed;
  /*left: 30px;*/
  top: 150px;
  width: 100px;
  height: 300px;
  background: #a0fafa;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
/* 买家端全局CSS */
* {
  padding: 0;
  margin: 0;
  border: 0;
  list-style: none;
}

#appForBuyer .el-header {
  padding: 0;
}
#appForBuyer .el-main {
  min-height: 300px;
  padding: 20px 0;
}
#appForBuyer .el-footer {
  padding: 0;
}

/* 买家端全局CSS END */

/* 顶部导航栏CSS */
.topbar {
  height: 40px;
  background-color: #3d3d3d;
  margin-bottom: 20px;
}
.topbar .nav {
  width: 1225px;
  margin: 0 auto;
}
.topbar .nav ul {
  float: right;
}
.topbar .nav li {
  float: left;
  height: 40px;
  color: #b0b0b0;
  font-size: 14px;
  text-align: center;
  line-height: 40px;
  margin-left: 20px;
}
.topbar .nav .sep {
  color: #b0b0b0;
  font-size: 12px;
  margin: 0 5px;
}
.topbar .nav li .el-button {
  color: #b0b0b0;
}
.topbar .nav .el-button:hover {
  color: #fff;
}
.topbar .nav li a {
  color: #b0b0b0;
}
.topbar .nav a:hover {
  color: #fff;
}
.topbar .nav .shopCart {
  width: 120px;
  background: #424242;
}
.topbar .nav .shopCart:hover {
  background: #fff;
}
.topbar .nav .shopCart:hover a {
  color: #ff6700;
}
.topbar .nav .shopCart-full {
  width: 120px;
  background: #ff6700;
}
.topbar .nav .shopCart-full a {
  color: white;
}
/* 顶部导航栏CSS END */

/* 顶栏容器CSS */
.el-header .el-menu {
  max-width: 1225px;
  margin: 0 auto;
}
.el-header .logo {
  height: 60px;
  width: 189px;
  float: left;
  margin-right: 100px;
}
.el-header .so {
  margin-top: 10px;
  width: 300px;
  float: right;
}
/* 顶栏容器CSS END */

/* 底栏容器CSS */
.footer {
  width: 100%;
  text-align: center;
  background: #2f2f2f;
  padding-bottom: 20px;
}
.footer .ng-promise-box {
  border-bottom: 1px solid #3d3d3d;
  line-height: 145px;
}
.footer .ng-promise-box {
  margin: 0 auto;
  border-bottom: 1px solid #3d3d3d;
  line-height: 145px;
}
.footer .ng-promise-box .ng-promise p a {
  color: #fff;
  font-size: 20px;
  margin-right: 210px;
  padding-left: 44px;
  height: 40px;
  display: inline-block;
  line-height: 40px;
  text-decoration: none;
  background: url("~@/assets/imgs/us-icon.png") no-repeat left 0;
}
.footer .github {
  height: 50px;
  line-height: 50px;
  margin-top: 20px;
}
.footer .github .github-but {
  width: 50px;
  height: 50px;
  margin: 0 auto;
  background: url("~@/assets/imgs/github.png") no-repeat;
}
.footer .mod_help {
  text-align: center;
  color: #888888;
}
.footer .mod_help p {
  margin: 20px 0 16px 0;
}

.footer .mod_help p a {
  color: #888888;
  text-decoration: none;
}
.footer .mod_help p a:hover {
  color: #fff;
}
.footer .mod_help p span {
  padding: 0 22px;
}
/* 底栏容器CSS END */
</style>
