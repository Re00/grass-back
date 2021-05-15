<template>
  <div class="confirmOrder">
    <!-- 头部 -->
    <div class="confirmOrder-header">
      <div class="header-content">
        <p>
          <i class="el-icon-s-order"></i>
        </p>
        <p>确认订单</p>
        <router-link to></router-link>
      </div>
    </div>
    <!-- 头部END -->

    <!-- 主要内容容器 -->
    <div class="content">
      <!-- 选择地址 -->
      <div class="section-address">
        <p class="title">收货地址</p>
        <div class="address-body">
          <ul>
            <li
              v-for="(item,index) in address"
              :class="index === confirmAddress ? 'in-section' : ''"
              :key="index"
              @click="chooseAddr(index)"
            >
              <h2>{{item.addrName}}</h2>
              <p class="phone">{{item.addrPhone}}</p>
              <p class="address">{{item.addrMain}}</p>
              <p class="address">{{item.addrSub}}</p>
              <el-button type="primary" style="float: right;margin-left: 10px" @click="showUpdate(item)">修改</el-button>
              <el-button type="danger" style="float: right" @click="addrDelete(item)">删除</el-button>
            </li>
            <li class="add-address" @click="dialogFormVisible = true">
              <i class="el-icon-circle-plus-outline" ></i>
              <p>添加新地址</p>
            </li>
          </ul>
        </div>
      </div>
      <!-- 选择地址END -->

      <!-- 商品及优惠券 -->
      <div class="section-goods">
        <p class="title">商品及优惠券</p>
        <div class="goods-list">
          <ul>
            <li :v-model="goodDetials" :key="this.getGood.gid">
              <img :src="goodDetials.gimgMain" />
              <span class="pro-name">{{goodDetials.gname}}</span>
              <span class="pro-price">{{goodDetials.gpride}}元 x {{ this.goodsNum }}</span>
              <span class="pro-status"></span>
              <span class="pro-total">{{(goodDetials.gpride * this.goodsNum).toFixed(2)}}元</span>
            </li>
          </ul>
        </div>
      </div>
      <!-- 商品及优惠券END -->

      <!-- 配送方式 -->
      <div class="section-shipment">
        <p class="title">配送方式</p>
        <p class="shipment">电话联系</p>
      </div>
      <!-- 配送方式END -->

      <!--      备注-->
      <div class="section-invoice infoInput">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入备注"
          autosize
          v-model="info">
        </el-input>
      </div>
      <!--      备注END-->

      <!-- 结算列表 -->
      <div class="section-count">
        <div class="money-box">
          <ul>
            <li>
              <span class="title">商品件数：</span>
              <span class="value">1件</span>
            </li>
            <li>
              <span class="title">商品总价：</span>
              <span class="value">{{(this.getGood.gpride * this.goodsNum).toFixed(2)}}元</span>
            </li>
            <li class="total">
              <span class="title">应付总额：</span>
              <span class="value">
                <span class="total-price">{{(this.getGood.gpride * this.goodsNum).toFixed(2)}}</span>元
              </span>
            </li>
          </ul>
        </div>
      </div>
      <!-- 结算列表END -->

      <!-- 结算导航 -->
      <div class="section-bar">
        <div class="btn">
<!--          <router-link to="/shoppingCart" class="btn-base btn-return">返回购物车</router-link>-->
          <a href="javascript:void(0);" @click="addOrder" class="btn-base btn-primary">结算</a>
        </div>
      </div>
      <!-- 结算导航END -->
    </div>
    <!-- 主要内容容器END -->
    <!--  添加地址-->
    <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="联系人" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name"
                    autocomplete="off"
                    maxlength="10"
                    show-word-limit
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="phone">
          <el-input v-model="form.phone"
                    autocomplete="off"
                    maxlength="11"
                    show-word-limit
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="收货地址" :label-width="formLabelWidth" prop="addrFront">
          <el-cascader
            :options="options"
            v-model="selectedOptions"
            @change="handleChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" :label-width="formLabelWidth" prop="addrBack">
          <el-input v-model="form.addrBack"
                    autocomplete="off"
                    maxlength="50"
                    show-word-limit
                    clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAddr('form')">确 定</el-button>
      </div>
    </el-dialog>
    <!--  添加地址END-->
    <!--    修改地址-->
    <el-dialog title="收货地址" :visible.sync="updateFormVisible">
      <el-form :model="updateForm" :rules="updateRules" ref="updateForm">
        <el-form-item label="联系人" :label-width="formLabelWidth" prop="addrName">
          <el-input v-model="updateForm.addrName"
                    autocomplete="off"
                    maxlength="10"
                    show-word-limit
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="addrPhone">
          <el-input v-model="updateForm.addrPhone"
                    autocomplete="off"
                    maxlength="11"
                    show-word-limit
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="收货地址" :label-width="formLabelWidth" prop="addrMain">
          <el-cascader
            :options="options"
            v-model="updateOptions"
            @change="handleChange">
          </el-cascader>
          <div>默认为当前地址</div>
        </el-form-item>
        <el-form-item label="详细地址" :label-width="formLabelWidth" prop="addrSub">
          <el-input v-model="updateForm.addrSub"
                    autocomplete="off"
                    maxlength="30"
                    show-word-limit
                    clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addrUpdate('updateForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!--    修改地址END-->
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { regionData, CodeToText } from 'element-china-area-data'
export default {
  inject: ['reload'],
  name: 'ConfirmOrder',
  data () {
    return {
      goodDetials: {},
      goodsNum: 1,
      name: 'cascader',
      options: regionData,
      selectedOptions: [],
      updateOptions: [],
      // 虚拟数据
      confirmAddress: 0, // 选择的地址id
      // 地址列表
      address: [],
      // 选中的地址列表
      waitAddress: '',
      dialogTableVisible: false,
      dialogFormVisible: false,
      // 地址表单
      form: {
        name: '',
        phone: '',
        addrFront: '',
        addrBack: ''
      },
      // 更新地址表单
      updateFormVisible: false,
      updateForm: {
        id: '',
        addrName: '',
        addrPhone: '',
        addrMain: '',
        addrSub: ''
      },
      formLabelWidth: '120px',
      rules: {
        name: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入电话', trigger: 'blur' }
        ],
        addrFront: [
          { required: true, message: '请选择主要地址', trigger: 'blur' }
        ],
        addrBack: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      updateRules: {
        addrName: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        addrPhone: [
          { required: true, message: '请输入电话', trigger: 'blur' }
        ],
        addrMain: [
          { required: true, message: '请选择主要地址', trigger: 'blur' }
        ],
        addrSub: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      // 订单备注
      info: '',
      isRouterAlive: true // 控制视图是否显示的变量
    }
  },
  created () {
    this.getAddr()
    this.goodDetials = this.getGood
    this.goodsNum = this.getGoodsNum
    console.log(this.getGoodsNum)
  },
  activated () {
    this.getAddr()
    this.goodDetials = this.getGood
    this.goodsNum = this.getGoodsNum
  },
  computed: {
    // 获取商品信息，数量
    ...mapGetters(['getGood', 'getGoodsNum'])
  },
  methods: {
    // 结算
    addOrder () {
      console.log(this.getGood)
      const waitOrder = this.getGood
      const goodsNum = this.getGoodsNum
      let allAddr = this.waitAddress.addrName + '/' + this.waitAddress.addrPhone + '/' + this.waitAddress.addrMain + '/' + this.waitAddress.addrSub
      let tempOrder = [{
        bid: this.$store.getters.getUser.buyerId,
        bname: this.$store.getters.getUser.buyername,
        sname: waitOrder.gsalerName,
        goId: waitOrder.gid,
        boType: 0,
        baddr: allAddr,
        gname: waitOrder.gname,
        gimg: waitOrder.gimgMain,
        goodsnum: goodsNum,
        gprice: waitOrder.gpride,
        goPrice: waitOrder.gpride * waitOrder.goodsnum,
        sid: waitOrder.gsalerId,
        boInfo: this.info
      }]
      this.$http
        .post('buyerOrder/addBuyerOrderList', tempOrder)
        .then(res => {
          if (res.data.code === '0000') {
            // 提示结算结果
            this.notifySucceed(res.data.msg)
            // 跳转我的订单页面
            this.$router.push({ path: '/order' })
          } else {
            this.notifyError(res.data.msg)
          }
        })
        .catch(err => {
          return Promise.reject(err)
        })
    },
    // 添加地址
    addAddr (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          this.$http.post(`buyerAddr/addOneAddr`, {
            buyerId: this.$store.getters.getUser.buyerId,
            addrName: this.form.name,
            addrPhone: this.form.phone,
            addrMain: this.form.addrFront,
            addrSub: this.form.addrBack
          }).then(res => {
            if (res.data.code === '0000') {
              this.$notify.success('添加成功')
              this.reload()
              this.form = {}
              // location.reload()
            }
          })
        }
      })
    },
    // 主地址获取
    handleChange (val) {
      // 将区域码转换成汉字
      let addrFront = CodeToText[val[0]] + CodeToText[val[1]] + CodeToText[val[2]]
      console.log(val)
      console.log(addrFront)
      this.form.addrFront = addrFront
      this.updateForm.addrMain = addrFront
    },
    //  获取地址
    getAddr () {
      this.$http.get(`buyerAddr/allAddr?Bid=${this.$store.getters.getUser.buyerId}`).then(res => {
        if (res.data.code === '0000') {
          console.log(res.data)
          this.address = res.data.data
        } else {
          this.address = []
        }
      })
    },
    // 更换地址选项
    chooseAddr (val) {
      this.confirmAddress = val
      this.waitAddress = {
        addrName: this.address[val].addrName,
        addrPhone: this.address[val].addrPhone,
        addrMain: this.address[val].addrMain,
        addrSub: this.address[val].addrSub
      }
      console.log(this.waitAddress)
    },
    addrDelete (addr) {
      this.$confirm('此操作将永久删除该地址, 是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`buyerAddr/deleteAddr?Bid=${addr.buyerId}&id=${addr.id}`).then(res => {
          if (res.data.code === '0000') {
            this.reload()
            this.$notify.success(res.data.msg)
          } else {
            this.$notify.error(res.data.msg)
          }
        })
      })
    },
    addrUpdate (addr) {
      this.$refs[addr].validate((valid) => {
        if (valid) {
          this.updateFormVisible = false
          this.$http.put(`buyerAddr/updateAddr`, this.updateForm).then(res => {
            if (res.data.code === '0000') {
              this.$notify.success('修改成功')
              this.reload()
              this.updateForm = {}
              // location.reload()
            }
          })
        }
      })
    },
    showUpdate (addr) {
      this.updateFormVisible = true
      // ["110000", "110100", "110102",]
      this.updateForm.id = addr.id
      this.updateForm.addrName = addr.addrName
      this.updateForm.addrPhone = addr.addrPhone
      this.updateForm.addrMain = addr.addrMain
      this.updateForm.addrSub = addr.addrSub
      console.log(this.updateForm)
    }

  }
}
</script>
<style scoped>
.confirmOrder {
  background-color: #f5f5f5;
  padding-bottom: 20px;
}
/* 头部CSS */
.confirmOrder .confirmOrder-header {
  background-color: #fff;
  border-bottom: 2px solid #ff6700;
  margin-bottom: 20px;
}
.confirmOrder .confirmOrder-header .header-content {
  width: 1225px;
  margin: 0 auto;
  height: 80px;
}
.confirmOrder .confirmOrder-header .header-content p {
  float: left;
  font-size: 28px;
  line-height: 80px;
  color: #424242;
  margin-right: 20px;
}
.confirmOrder .confirmOrder-header .header-content p i {
  font-size: 45px;
  color: #ff6700;
  line-height: 80px;
}
/* 头部CSS END */

/* 主要内容容器CSS */
.confirmOrder .content {
  width: 1225px;
  margin: 0 auto;
  padding: 48px 0 0;
  background-color: #fff;
}

/* 选择地址CSS */
.confirmOrder .content .section-address {
  margin: 0 48px;
  overflow: hidden;
}
.confirmOrder .content .section-address .title {
  color: #333;
  font-size: 18px;
  line-height: 20px;
  margin-bottom: 20px;
}
.confirmOrder .content .address-body li {
  float: left;
  color: #333;
  width: 220px;
  height: 188px;
  border: 1px solid #e0e0e0;
  padding: 15px 24px 0;
  margin-right: 17px;
  margin-bottom: 24px;
}
.confirmOrder .content .address-body addrBtn{
  float: right;
  /*margin-left: 10px;*/
}
.confirmOrder .content .address-body .in-section {
  border: 1px solid #ff6700;
}
.confirmOrder .content .address-body li h2 {
  font-size: 18px;
  font-weight: normal;
  line-height: 30px;
  margin-bottom: 10px;
}
.confirmOrder .content .address-body li p {
  font-size: 14px;
  color: #757575;
}
.confirmOrder .content .address-body li .address {
  padding: 10px 0;
  max-width: 180px;
  max-height: 88px;
  line-height: 22px;
  overflow: hidden;
}
.confirmOrder .content .address-body .add-address {
  text-align: center;
  line-height: 30px;
}
.confirmOrder .content .address-body .add-address i {
  font-size: 30px;
  padding-top: 50px;
  text-align: center;
}
/* 选择地址CSS END */

/* 商品及优惠券CSS */
.confirmOrder .content .section-goods {
  margin: 0 48px;
}
.confirmOrder .content .section-goods p.title {
  color: #333;
  font-size: 18px;
  line-height: 40px;
}
.confirmOrder .content .section-goods .goods-list {
  padding: 5px 0;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
}
.confirmOrder .content .section-goods .goods-list li {
  padding: 10px 0;
  color: #424242;
  overflow: hidden;
}
.confirmOrder .content .section-goods .goods-list li img {
  float: left;
  width: 30px;
  height: 30px;
  margin-right: 10px;
}
.confirmOrder .content .section-goods .goods-list li .pro-name {
  float: left;
  width: 650px;
  line-height: 30px;
}
.confirmOrder .content .section-goods .goods-list li .pro-price {
  float: left;
  width: 150px;
  text-align: center;
  line-height: 30px;
}
.confirmOrder .content .section-goods .goods-list li .pro-status {
  float: left;
  width: 99px;
  height: 30px;
  text-align: center;
  line-height: 30px;
}
.confirmOrder .content .section-goods .goods-list li .pro-total {
  float: left;
  width: 190px;
  text-align: center;
  color: #ff6700;
  line-height: 30px;
}
/* 商品及优惠券CSS END */

/* 配送方式CSS */
.confirmOrder .content .section-shipment {
  margin: 0 48px;
  padding: 25px 0;
  border-bottom: 1px solid #e0e0e0;
  overflow: hidden;
}
.confirmOrder .content .section-shipment .title {
  float: left;
  width: 150px;
  color: #333;
  font-size: 18px;
  line-height: 38px;
}
.confirmOrder .content .section-shipment .shipment {
  float: left;
  line-height: 38px;
  font-size: 14px;
  color: #ff6700;
}
/* 配送方式CSS END */

/* 发票CSS */
.confirmOrder .content .section-invoice {
  margin: 0 48px;
  padding: 25px 0;
  border-bottom: 1px solid #e0e0e0;
  overflow: hidden;
}

.confirmOrder .content .infoInput{
  width: 500px;
}

.confirmOrder .content .section-invoice .title {
  float: left;
  width: 150px;
  color: #333;
  font-size: 18px;
  line-height: 38px;
}
.confirmOrder .content .section-invoice .invoice {
  float: left;
  line-height: 38px;
  font-size: 14px;
  margin-right: 20px;
  color: #ff6700;
}
/* 发票CSS END */

/* 结算列表CSS */
.confirmOrder .content .section-count {
  margin: 0 48px;
  padding: 20px 0;
  overflow: hidden;
}
.confirmOrder .content .section-count .money-box {
  float: right;
  text-align: right;
}
.confirmOrder .content .section-count .money-box .title {
  float: left;
  width: 126px;
  height: 30px;
  display: block;
  line-height: 30px;
  color: #757575;
}
.confirmOrder .content .section-count .money-box .value {
  float: left;
  min-width: 105px;
  height: 30px;
  display: block;
  line-height: 30px;
  color: #ff6700;
}
.confirmOrder .content .section-count .money-box .total .title {
  padding-top: 15px;
}
.confirmOrder .content .section-count .money-box .total .value {
  padding-top: 10px;
}
.confirmOrder .content .section-count .money-box .total-price {
  font-size: 30px;
}
/* 结算列表CSS END */

/* 结算导航CSS */
.confirmOrder .content .section-bar {
  padding: 20px 48px;
  border-top: 2px solid #f5f5f5;
  overflow: hidden;
}
.confirmOrder .content .section-bar .btn {
  float: right;
}
.confirmOrder .content .section-bar .btn .btn-base {
  float: left;
  margin-left: 30px;
  width: 158px;
  height: 38px;
  border: 1px solid #b0b0b0;
  font-size: 14px;
  line-height: 38px;
  text-align: center;
}
.confirmOrder .content .section-bar .btn .btn-return {
  color: rgba(0, 0, 0, 0.27);
  border-color: rgba(0, 0, 0, 0.27);
}
.confirmOrder .content .section-bar .btn .btn-primary {
  background: #ff6700;
  border-color: #ff6700;
  color: #fff;
}
/* 结算导航CSS */

/* 主要内容容器CSS END */
</style>
