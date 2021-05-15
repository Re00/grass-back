<template>
  <div id="details">
    <!-- 头部 -->
    <div class="page-header">
      <div class="title">
        <p>{{productDetails.gname}}</p>
        <div class="list">
          <ul>
            <li>
              <router-link to>概述</router-link>
            </li>
            <li>
              <router-link to>参数</router-link>
            </li>
            <li>
              <router-link to>用户评价</router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 头部END -->

    <!-- 主要内容 -->
    <div class="main">
      <!-- 左侧商品轮播图 -->
      <div class="block">
        <el-carousel height="560px" v-if="productPicture.length>1" loop>
          <el-carousel-item v-for="item in productPicture" :key="item" >
            <img style="height:560px;" :src="item"  class="carouselImg"/>
          </el-carousel-item>
        </el-carousel>
        <div v-if="productPicture.length===1">
          <img
            class="carouselImg"
            style="height:560px;"
            :src="productPicture[0]"
          />
        </div>
        <div v-if="productPicture.length===0">
          <img
            class="carouselImg"
            style="height:560px;"
            :src="productMainPic"
          />
        </div>
      </div>
      <!-- 左侧商品轮播图END -->

      <!-- 右侧内容区 -->
      <div class="content">
        <h1 class="name">{{productDetails.gname}}</h1>
        <p class="intro">{{productDetails.ginfo}}</p>
        <router-link :to="{ path: '/goods', query: {search:productDetails.gsalerName} }">
          <p class="store">{{productDetails.gsalerName}}售卖</p>
        </router-link>
        <div class="price">
          <span>单价：{{productDetails.gpride}}元</span>
          <span
            v-show="productDetails.glinepride !== productDetails.gpride&&productDetails.glinepride !== null"
            class="del"
          >{{productDetails.glinepride}}元</span>
        </div>
        <div>
          <p class="numClass">数量</p>
          <el-input-number style="float: right" v-model="num" @change="handleChange" :min="1" :max="productDetails.gnum" label="数量"></el-input-number>
        </div>
        <div class="pro-list">
          <span class="pro-name">{{productDetails.gname}}</span>
          <span class="pro-price">
<!--            <span>{{productDetails.gpride}}元</span>-->
<!--            <span-->
<!--              v-show="productDetails.glinepride !== productDetails.gpride &&productDetails.glinepride !== null"-->
<!--              class="pro-del"-->
<!--            >{{productDetails.glinepride}}元</span>-->
          </span>
          <p class="price-sum">总计 : {{(productDetails.gpride * this.num).toFixed(2)}}元</p>
        </div>
        <!-- 内容区底部按钮 -->
        <div class="button">
          <el-button class="shop-cart" :disabled="dis" @click="addShoppingCart">加入购物车</el-button>
          <el-button class="doneGood" @click="doneGood">立即购买</el-button>
        </div>
        <!-- 内容区底部按钮END -->
        <div class="pro-policy">
          <ul>
            <li>
              <i class="el-icon-circle-check"></i> 小米自营
            </li>
            <li>
              <i class="el-icon-circle-check"></i> 小米发货
            </li>
            <li>
              <i class="el-icon-circle-check"></i> 7天无理由退货
            </li>
            <li>
              <i class="el-icon-circle-check"></i> 7天价格保护
            </li>
          </ul>
        </div>
      </div>
      <!-- 右侧内容区END -->
    </div>
    <!-- 主要内容END -->
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      num: '', // 数量
      dis: false, // 控制“加入购物车按钮是否可用”
      productID: '', // 商品id
      salerId: '', // 所属卖家id
      productDetails: '', // 商品详细信息
      productPicture: [], // 商品图片
      productMainPic: ''// 商品主图
    }
  },
  // 通过路由获取商品id
  activated () {
    if (this.$route.query.productID !== undefined) {
      this.productID = this.$route.query.productID
      // console.log(this.productID)
    }
  },
  watch: {
    // 监听商品id的变化，请求后端获取商品数据
    productID: function (val) {
      this.getDetails(val)
      // this.getDetailsPicture(val)
    }
  },
  methods: {
    ...mapActions(['unshiftShoppingCart', 'addShoppingCartNum', 'setGood', 'setGoodsNum']),
    // 立即更新商品数量
    handleChange (value) {
      this.setGoodsNum(value)
    },
    // 获取商品详细信息
    getDetails (val) {
      this.$http
        .get(`goods/getOneByGid/${val}`)
        .then(res => {
          if (res.data.code === '0000') {
            console.log(res.data)
            this.productDetails = res.data.data// 存储商品详情
            this.productID = res.data.data.gid
            this.salerId = res.data.data.gsalerId// 存储商品所属供货商id

            let gAllImg = res.data.data.gimg
            if (gAllImg === '') {
              this.productMainPic = res.data.data.gimgMain
              this.productPicture = []
            } else if (gAllImg.indexOf(',') === -1) {
              this.productPicture = []
              this.productPicture.push(gAllImg)
            } else {
              let addPicture = res.data.data.gimg.split(',')
              this.productPicture = addPicture
            }
            console.log(this.productDetails)
          } else {
            this.$notify.warning('商品下架啦，看看别的吧！')
          }
        })
        .catch(err => {
          return Promise.reject(err)
        })
    },
    // 加入购物车
    addShoppingCart () {
      // 判断是否登录,没有登录则显示登录组件
      if (!this.$store.getters.getUser) {
        this.$store.dispatch('setShowLogin', true)
        return
      }
      this.$http
        .post('buyerCart/addOneCart', {
          bcId: this.$store.getters.getUser.buyerId,
          gcId: this.productID,
          scId: this.salerId,
          goodsnum: 1,
          checkType: true
        })
        .then(res => {
          switch (res.data.code) {
            case '001':
              // 001新加入购物车成功
              console.log(res.data.buyerCartVO)
              this.unshiftShoppingCart(res.data.buyerCartVO)
              this.notifySucceed(res.data.msg)
              break
            case '002':
              // 002该商品已经在购物车，数量+1
              this.addShoppingCartNum(this.productID)
              this.notifySucceed(res.data.msg)
              break
            case '003':
              // 003商品数量达到限购数量
              this.dis = true
              this.notifyError(res.data.msg)
              break
            default:
              this.notifyError(res.data.msg)
          }
        })
        .catch(err => {
          return Promise.reject(err)
        })
    },
    // 立即购买
    doneGood () {
      this.setGood(this.productDetails)
      this.$router.push({name: 'doneOrder'})
    }
  }
}
</script>
<style>
/* 头部CSS */
#details .page-header {
  height: 64px;
  margin-top: -20px;
  z-index: 4;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
  -webkit-box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.07);
  box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.07);
}
#details .page-header .title {
  width: 1225px;
  height: 64px;
  line-height: 64px;
  font-size: 18px;
  font-weight: 400;
  color: #212121;
  margin: 0 auto;
}
#details .page-header .title p {
  float: left;
}
#details .page-header .title .list {
  height: 64px;
  float: right;
}
#details .page-header .title .list li {
  float: left;
  margin-left: 20px;
}
#details .page-header .title .list li a {
  font-size: 14px;
  color: #616161;
}
#details .page-header .title .list li a:hover {
  font-size: 14px;
  color: #ff6700;
}
/* 头部CSS END */

/* 主要内容CSS */
#details .main {
  width: 1225px;
  height: 560px;
  padding-top: 30px;
  margin: 0 auto;
}
#details .main .block {
  float: left;
  width: 560px;
  height: 560px;
}

#details .main .block .carouselImg{
  width: 560px;
  height: 560px;
}

#details .el-carousel .el-carousel__indicator .el-carousel__button {
  background-color: rgba(163, 163, 163, 0.8);
}
#details .main .content {
  float: left;
  margin-left: 25px;
  width: 640px;
}
#details .main .content span{
  overflow: hidden;
}
#details .main .content .name {
  height: 52px;
  line-height: 30px;
  font-size: 24px;
  font-weight: normal;
  color: #212121;
}
#details .main .content .intro {
  color: #b0b0b0;
  padding-top: 10px;
}
#details .main .content .store {
  color: #ff6700;
  padding-top: 10px;
}
#details .main .content .price {
  display: block;
  font-size: 18px;
  color: #ff6700;
  border-bottom: 1px solid #e0e0e0;
  padding: 25px 0 25px;
}
#details .main .content .numClass{
  float: left;
  margin-left: 387px;
  font-size: 30px;
  color: antiquewhite;
}
#details .main .content .price .del {
  font-size: 14px;
  margin-left: 10px;
  color: #b0b0b0;
  text-decoration: line-through;
}
#details .main .content .pro-list {
  background: #f9f9fa;
  padding: 30px 60px;
  margin: 50px 0 50px;
  height: 100px;
}
#details .main .content .pro-list span {
  line-height: 30px;
  color: #616161;
}
#details .main .content .pro-list .pro-price {
  float: right;
}
#details .main .content .pro-list .pro-price .pro-del {
  margin-left: 10px;
  text-decoration: line-through;
}
#details .main .content .pro-list .price-sum {
  color: #ff6700;
  font-size: 24px;
  padding-top: 20px;
}
#details .main .content .button {
  height: 55px;
  margin: 10px 0 20px 0;
}
#details .main .content .button .el-button {
  float: left;
  height: 55px;
  font-size: 16px;
  color: #fff;
  border: none;
  text-align: center;
}
#details .main .content .button .shop-cart {
  width: 340px;
  background-color: #ff6700;
}
#details .main .content .button .shop-cart:hover {
  background-color: #f25807;
}

#details .main .content .button .doneGood {
  width: 260px;
  margin-left: 40px;
  background-color: red;
}
#details .main .content .button .doneGood:hover {
  background-color: darkred;
}
#details .main .content .pro-policy li {
  float: left;
  margin-right: 20px;
  color: #b0b0b0;
}
/* 主要内容CSS END */
</style>
