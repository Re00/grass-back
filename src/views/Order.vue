<template>
  <div class="order">
    <!-- 我的订单头部 -->
    <div class="order-header">
      <div class="order-header-content">
        <p>
          <i class="el-icon-s-order" style="font-size: 30px;color: #ff6700;"></i>
          我的订单
        </p>
      </div>
    </div>
    <!-- 我的订单头部END -->

    <!-- 我的订单主要内容 -->
    <div class="order-content" v-if="orders.length>0">
      <div class="content" v-for="(item,index) in orders" :key="index">
        <ul>
          <!-- 我的订单表头 -->
          <li class="order-info">
            <div class="order-id">订单编号: {{item[0].boId}}</div>
            <div class="order-time" v-if="item[0].boType===1">&ensp;|&ensp;订单完成时间: {{item[0].todowntime}}</div>
            <div class="order-time" v-if="item[0].boType===2">&ensp;|&ensp;订单取消时间: {{item[0].todowntime}}</div>
            <div class="order-time">订单创建时间: {{item[0].touptime}}</div>
          </li>
          <li class="header">
            <div class="pro-img"></div>
            <div class="pro-name">商品名称</div>
            <div class="pro-price">单价</div>
            <div class="pro-num">数量</div>
            <div class="pro-check">状态</div>
            <div class="pro-total">小计</div>
            <div class="pro-make">操作</div>
          </li>
          <!-- 我的订单表头END -->

          <!-- 订单列表 -->
          <li class="product-list" v-for="(product,i) in item" :key="i">
            <div class="pro-img">
              <router-link :to="{ path: '/goods/details', query: {productID:product.goId} }">
                <img :src="product.gimg" />
              </router-link>
            </div>
            <div class="pro-name">
              <router-link
                :title="product.gname"
                :to="{ path: '/goods/details', query: {productID:product.goId} }"
              >{{product.gname}}</router-link>
            </div>
            <div class="pro-price">{{product.gprice.toFixed(2)}}元</div>
            <div class="pro-num">{{product.goodsnum}}</div>
            <div class="pro-check" v-if="product.boType===0">待完成</div>
            <div class="pro-check" v-if="product.boType===1">已完成</div>
            <div class="pro-check" v-if="product.boType===2">已取消</div>
            <div class="pro-total pro-total-in">{{(product.gprice*product.goodsnum).toFixed(2)}}元</div>
            <div class="pro-make" v-if="product.boType===0">
              <el-button type="danger" icon="el-icon-close" circle plain @click="falseOrder(product.soId,product.boId)"></el-button>
              <el-button type="success" icon="el-icon-check" circle plain @click="completeOrder(product.soId,product.boId)"></el-button>
            </div>
            <div class="pro-make" v-if="product.boType===1">
              <el-button type="danger" icon="el-icon-delete" circle plain @click="deleteOrder(product.boId)"></el-button>
            </div>
            <div class="pro-make" v-if="product.boType===2">
              <el-button type="danger" icon="el-icon-delete" circle plain @click="deleteOrder(product.boId)"></el-button>
            </div>

          </li>
        </ul>
        <div class="order-bar">
          <div class="order-bar-left">
            <span class="order-total">
              共
              <span class="order-total-num">{{total[index].totalNum}}</span> 件商品
            </span>
          </div>
          <div class="order-bar-right">
            <span>
              <span class="total-price-title">合计：</span>
              <span class="total-price">{{total[index].totalPrice.toFixed(2)}}元</span>
            </span>
          </div>
          <!-- 订单列表END -->
        </div>
      </div>
      <div style="margin-top:-40px;"></div>
    </div>
    <!-- 我的订单主要内容END -->

    <!-- 订单为空的时候显示的内容 -->
    <div v-else class="order-empty">
      <div class="empty">
        <h2>您的订单还是空的！</h2>
        <p>快去购物吧！</p>
      </div>
    </div>
    <!-- 订单为空的时候显示的内容END -->
  </div>

</template>

<script>
export default {
  name: 'Order',
  inject: ['reload'],
  data () {
    return {
      orders: [], // 订单列表
      total: [], // 每个订单的商品数量及总价列表
      //  分页
      current: 1,
      size: 5,
      isRouterAlive: true // 控制视图是否显示的变量
      // 查询订单状态码，空为查询所有
      // type: ''
    }
  },
  activated () {
    // 获取订单数据
    this.$http
      .get(`buyerOrder/getAllBuyerOrder?current=${this.current}&size=${this.size}&Bid=${this.$store.getters.getUser.buyerId}`)
      .then(res => {
        if (res.data.code === '0000') {
          this.orders = res.data.data
          console.log(this.orders)
        }
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  watch: {
    // 通过订单信息，计算出每个订单的商品数量及总价
    orders: function (val) {
      let total = []
      for (let i = 0; i < val.length; i++) {
        const element = val[i]

        let totalNum = 0
        let totalPrice = 0
        for (let j = 0; j < element.length; j++) {
          const temp = element[j]
          totalNum += temp.goodsnum
          totalPrice += temp.gprice * temp.goodsnum
        }
        total.push({ totalNum, totalPrice })
      }
      this.total = total
    }
  },
  methods: {
    falseOrder (soId, boId) {
      // type = 2 , false
      this.$confirm('此操作将取消该订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.put(`salerOrder/completeOneSalerOrder?soId=${soId}&boId=${boId}&soType=2`).then((res) => {
          if (res.data.code === '0000') {
            // 更新视图
            this.reload()
            // 提示
            this.$message({
              type: 'success',
              message: '已取消!'
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
    completeOrder (soId, boId) {
      // type = 1 ,com
      this.$confirm('此操作将直接完成该订单记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.put(`salerOrder/completeOneSalerOrder?soId=${soId}&boId=${boId}&soType=1`).then((res) => {
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
            message: '完成失败'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    deleteOrder (boId) {
      this.$confirm('此操作将永久删除该订单记录,如有多物品，也会一并删除，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`buyerOrder/deleteOneBuyerOrder/${boId}`).then((res) => {
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
    }
  }
}
</script>
<style scoped>
.order {
  background-color: #f5f5f5;
  padding-bottom: 20px;
}
/* 我的订单头部CSS */
.order .order-header {
  height: 64px;
  border-bottom: 2px solid #ff6700;
  background-color: #fff;
  margin-bottom: 20px;
}
.order .order-header .order-header-content {
  width: 1225px;
  margin: 0 auto;
}
.order .order-header p {
  font-size: 28px;
  line-height: 58px;
  float: left;
  font-weight: normal;
  color: #424242;
}
/* 我的订单头部CSS END */
.order .content {
  width: 1225px;
  margin: 0 auto;
  background-color: #fff;
  margin-bottom: 50px;
}

.order .content ul {
  background-color: #fff;
  color: #424242;
  line-height: 85px;
}
/* 我的订单表头CSS */
.order .content ul .order-info {
  height: 60px;
  line-height: 60px;
  padding: 0 26px;
  color: #424242;
  border-bottom: 1px solid #ff6700;
}
.order .content ul .order-info .order-id {
  float: left;
  color: #ff6700;
}
.order .content ul .order-info .order-time {
  float: right;
}

.order .content ul .header {
  height: 85px;
  padding-right: 26px;
  color: #424242;
}
/* 我的订单表头CSS END */

/* 订单列表CSS */
.order .content ul .product-list {
  height: 85px;
  padding: 15px 26px 15px 0;
  border-top: 1px solid #e0e0e0;
}
.order .content ul .pro-img {
  float: left;
  height: 85px;
  width: 120px;
  padding-left: 80px;
}
.order .content ul .pro-img img {
  height: 80px;
  width: 80px;
}
.order .content ul .pro-name {
  float: left;
  width: 270px;
  height: 60px;
  text-overflow: ellipsis;
  overflow: hidden;
}
.order .content ul .pro-name a {
  color: #424242;
}
.order .content ul .pro-name a:hover {
  color: #ff6700;
}
.order .content ul .pro-price {
  float: left;
  width: 160px;
  padding-right: 18px;
  text-align: center;
}
.order .content ul .pro-num {
  float: left;
  width: 100px;
  text-align: center;
}
.order .content ul .pro-check {
  float: left;
  width: 100px;
  text-align: center;
}
.order .content ul .pro-total {
  float: left;
  width: 160px;
  /*padding-right: 81px;*/
  text-align: center;
}
.order .content ul .pro-total-in {
  color: #ff6700;
}
.order .content ul .pro-make{
  float: left;
  width: 155px;
  text-align: center;
}
.order .order-bar {
  width: 1185px;
  padding: 0 20px;
  border-top: 1px solid #ff6700;
  height: 50px;
  line-height: 50px;
  background-color: #fff;
}
.order .order-bar .order-bar-left {
  float: left;
}
.order .order-bar .order-bar-left .order-total {
  color: #757575;
}
.order .order-bar .order-bar-left .order-total-num {
  color: #ff6700;
}
.order .order-bar .order-bar-right {
  float: right;
}
.order .order-bar .order-bar-right .total-price-title {
  color: #ff6700;
  font-size: 14px;
}
.order .order-bar .order-bar-right .total-price {
  color: #ff6700;
  font-size: 30px;
}
/* 订单列表CSS END */

/* 订单为空的时候显示的内容CSS */
.order .order-empty {
  width: 1225px;
  margin: 0 auto;
}
.order .order-empty .empty {
  height: 300px;
  padding: 0 0 130px 558px;
  margin: 65px 0 0;
  background: url(../assets/imgs/cart-empty.png) no-repeat 124px 0;
  color: #b0b0b0;
  overflow: hidden;
}
.order .order-empty .empty h2 {
  margin: 70px 0 15px;
  font-size: 36px;
}
.order .order-empty .empty p {
  margin: 0 0 20px;
  font-size: 20px;
}
/* 订单为空的时候显示的内容CSS END */
</style>
