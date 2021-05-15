<template>
  <div class="home" id="home" name="home">
    <!--  轮播图开始-->
      <div class="block">
        <el-carousel :interval="4000" type="card" height="320px">
          <el-carousel-item v-for="item in carousel" :key="item.gid">
            <router-link :to="{ path: '/goods/details', query: {productID:item.gid} }">
              <img style="height:460px;" :src="item.img"  class="carouselImg"/>
            </router-link>
          </el-carousel-item>

<!--          <el-carousel-item v-for="item in carousel" :key="item.carousel_id">-->
<!--            <img style="height:460px;" :src="$target + item.imgPath" :alt="item.describes" />-->
<!--          </el-carousel-item>-->

        </el-carousel>
      </div>
    <!--  轮播图结束-->
    <div class="main-box">
      <div class="main">
<!--        肉类产品展示-->
        <div class="phone">
          <div class="box-hd">
            <div class="title">肉类</div>
          </div>
          <div class="box-bd">
            <div class="promo-list">
              <router-link to>
<!--                左面侧栏的图片-->
                <img :src="$target +'肉.png'" />
              </router-link>
            </div>
            <div class="list">
              <MyList :list="meatList" :isMore="true"></MyList>
            </div>
          </div>
        </div>
<!--        肉类产品展示结束-->
<!--        酒类产品展示-->
        <div class="appliance" id="promo-menu">
          <div class="box-hd">
            <div class="title">酒类</div>
            <div class="more" id="more">
              <MyMenu :val="2" @fromChild="getChildMsg">
                <span slot="1">新品</span>
                <span slot="2">草原酒</span>
              </MyMenu>
            </div>
          </div>
          <div class="box-bd">
            <div class="promo-list">
              <ul>
                <li>
<!--                  左侧展示第一张图片-->
<!--                  <img :src="$target +'public/imgs/appliance/appliance-promo1.png'" />-->
                </li>
                <li>
<!--                  左侧展示第二章图片-->
<!--                  <img :src="$target +'public/imgs/appliance/appliance-promo2.png'" />-->
                </li>
              </ul>
            </div>
            <div class="list">
              <MyList :list="wineList" :isMore="true"></MyList>
            </div>
          </div>
        </div>
<!--        牲畜类产品展示-->
        <div class="accessory" id="promo-menu">
          <div class="box-hd">
            <div class="title">牲畜</div>
            <div class="more" id="more">
              <MyMenu :val="3" @fromChild="getChildMsg2">
                <span slot="1">新品</span>
                <span slot="2">牛</span>
                <span slot="3">羊</span>
              </MyMenu>
            </div>
          </div>
          <div class="box-bd">
            <div class="promo-list">
              <ul>
                <li>
                  <img :src="$target +'奶.png'" />
<!--                  <img :src="$target +'public/imgs/accessory/accessory-promo1.png'" alt />-->
                </li>
                <li>
<!--                  <img :src="$target +'public/imgs/accessory/accessory-promo2.png'" alt />-->
                </li>
              </ul>
            </div>
            <div class="list">
              <MyList :list="animalList" :isMore="true"></MyList>
            </div>
          </div>
        </div>
<!--        牲畜类产品展示结束-->
<!--        奶类产品展示-->
        <div class="milk">
          <div class="box-hd">
            <div class="title">奶类</div>
          </div>
          <div class="box-bd">
            <div class="promo-list">
              <router-link to>
                <!--                左面侧栏的图片-->
                <img :src="$target +'奶.png'" />
              </router-link>
            </div>
            <div class="list">
              <MyList :list="milkList" :isMore="true"></MyList>
            </div>
          </div>
        </div>
<!--        奶类产品展示结束-->
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data () {
    return {
      carousel: '', // 轮播图数据
      meatList: '', // 肉类列表
      milkList: '', // 奶类列表
      grassWineList: '', // 草原特产酒类列表
      wineList: '', // 酒类商品列表
      wineNewList: '', // 热门新品酒类列表
      animalList: '', // 牲畜类列表
      animalNewList: '', // 新品商品列表
      beefList: '', // 牛商品列表
      angList: '', // 羊商品列表
      wineActive: 1, // 酒当前选中的商品分类
      animalActive: 1 // 配件当前选中的商品分类
    }
  },
  watch: {
    // 酒当前选中的商品分类，响应不同的商品数据
    wineActive: function (val) {
      // 页面初始化的时候把wineNewList(热门酒商品列表)直接赋值给wineList(酒商品列表)
      // 所以在切换商品列表时判断wineNewList是否为空,为空则是第一次切换,把wineList赋值给wineNewList
      if (this.wineNewList === '') {
        this.wineNewList = this.wineList
      }
      if (val === 1) {
        // 1为新品
        this.wineList = this.wineNewList
        return
      }
      if (val === 2) {
        // 2为草原特产酒
        this.wineList = this.grassWineList
      }
    },
    animalActive: function (val) {
      // 页面初始化的时候把animalNewList(新品商品列表)直接赋值给animalList(牲畜类列表)
      // 所以在切换商品列表时判断animalNewList是否为空,为空则是第一次切换,把animalList赋值给animalNewList
      if (this.animalNewList === '') {
        this.animalNewList = this.animalList
      }
      if (val === 1) {
        // 1为热门商品
        this.animalList = this.animalNewList
        return
      }
      if (val === 2) {
        // 2为牛商品
        this.animalList = this.beefList
        return
      }
      if (val === 3) {
        // 3 为羊商品
        this.animalList = this.angList
      }
    }
  },
  created () {
    // 获取轮播图
    this.$http
      .get('goodsCarousel/allCarouselImgs')
      .then(res => {
        if (res.data.code === '0000') {
          this.carousel = res.data.data.goodsCarousel
        }
      })
      .catch(err => {
        return Promise.reject(err)
      })
    // 获取各类商品数据
    this.getPromo('1006', 'meatList')// 肉类
    this.getPromo('1007', 'milkList')// 奶类
    this.getPromo('1001003', 'grassWineList')// 草原酒类
    this.getPromo('1009001', 'beefList')// 牛
    this.getPromo('1009002', 'angList')// 羊
    this.getPromo(
      // 军酒，马奶酒，草原酒
      // 仅查找新品酒
      ['1001001', '1001002', '1001003'],
      'wineList',
      'goods/orderGoods?type=1001&inOrder=0'
    )
    this.getPromo(
      // 仅查找新品牲畜
      [ '1009001', '1009002' ],
      'animalList',
      'goods/orderGoods?type=1009&inOrder=0'
    )
    console.log(this.wineNewList)
  },
  methods: {
    // 获取酒类模块子组件传过来的数据
    getChildMsg (val) {
      this.wineActive = val
    },
    // 获取配件模块子组件传过来的数据
    getChildMsg2 (val) {
      this.animalActive = val
    },
    // 获取各类商品数据方法封装
    getPromo (categoryName, val, api) {
      api = api !== undefined ? api : `goods/getAllGoods?type=${categoryName}`
      console.log(api)
      this.$http
        .get(api)
        .then(res => {
          console.log(val)
          console.log(res.data)
          if (res.data.code === '0000') {
            // 成功 赋值
            this[val] = res.data.data.goodsList
          }
        })
        .catch(err => {
          return Promise.reject(err)
        })
    }
  }
}
</script>

<style>
@import "../assets/css/index.css";
#home .block .carouselImg{
    width: 613px;
    height: 320px;
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
</style>
