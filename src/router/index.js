import Vue from 'vue'
import Router from 'vue-router'
import Test from '@/components/test/test.vue'
import LoginForSaler from '@/components/login/loginForSaler.vue'
import LoginForAdmin from '@/components/login/loginForAdmin.vue'
import RegistForSaler from '@/components/regist/regeistForSaler'
import HomeForSaler from '@/components/home/homeForSaler.vue'
import HomeForAdmin from '@/components/home/homeForAdmin.vue'
import HomeForBuyer from '@/components/home/homeforBuyer'
import OrderForSalerWait from '@/components/order/orderForSalerWait.vue'
import OrderForSalerUn from '@/components/order/orderForSalerUn.vue'
import OrderForSalerCom from '@/components/order/orderForSalerCom.vue'
import OrderForSalerWaitByAdmin from '@/components/order/orderForSalerWaitByAdmin.vue'
import OrderForSalerUnByAdmin from '@/components/order/orderForSalerUnByAdmin.vue'
import OrderForSalerComByAdmin from '@/components/order/orderForSalerComByAdmin.vue'
import OrderForBuyerComByAdmin from '@/components/order/orderForBuyerComByAdmin.vue'
import OrderForBuyerUnByAdmin from '@/components/order/orderForBuyerUnByAdmin.vue'
import OrderForBuyerWaitByAdmin from '@/components/order/orderForBuyerWaitByAdmin.vue'
import AddGoodsForSaler from '@/components/goods/addGoodsForSaler.vue'
import AddGoodsForAdmin from '@/components/goods/addGoodsForAdmin.vue'
import AddGoodsTypeForAdmin from '@/components/goods/addGoodsTypeForAdmin.vue'
import GoodsForSaler from '@/components/goods/GoodsForSaler.vue'
import GoodsForAdmin from '@/components/goods/GoodsForAdmin.vue'
import AllSaler from '@/components/saler/allSaler'
import AllBuyer from '@/components/buyer/allBuyer'
import AddSaler from '@/components/saler/addSaler'
import AddBuyer from '@/components/buyer/addBuyer'
import OwnSaler from '@/components/saler/ownSaler'
import AddAnnounceForSaler from '@/components/saler/addAnnounceForSaler'
import AnnounceManageForSaler from '@/components/saler/announceManageForSaler'
import AnnounceForBuyer from '@/components/announcement/announceForBuyer'
import AnnounceForSaler from '@/components/announcement/announceForSaler'
import AnnounceForAdmin from '@/components/announcement/announceForAdmin'
import AddAnnounceForAdmin from '@/components/announcement/addAnnounceForAdmin'
import OneAnnounceInAdminn from '@/components/announcement/oneAnnounceInAdmin'
import AddCarousel from '@/components/carousel/addCarousel'
import AllCarousel from '@/components/carousel/allCarousel'
import AllAds from '@/components/ad/allAds'
import AddAd from '@/components/ad/addAd'

import Home from '@/views/Home.vue'
import Goods from '@/views/Goods.vue'
import Details from '@/views/Details.vue'
import ShoppingCart from '@/views/ShoppingCart'
import Order from '@/views/Order'
import ConfirmOrder from '@/views/ConfirmOrder'
import OwnBuyer from '@/views/ownBuyer'
import DoneOrder from '@/views/doneOrder'
import AnnounceViews from '@/views/announceViews.vue'
import AddAnnounce from '@/views/addAnnounce.vue'
import OneAnnounce from '@/views/oneAnnounce'
import AnnounceManage from '@/views/announceManage'

import Error from '@/components/Error'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'loginForSaler',
      path: '/loginForSaler',
      component: LoginForSaler
    },
    {
      name: 'registForSaler',
      path: '/registForSaler',
      component: RegistForSaler
    },
    {
      name: 'test',
      path: '/test',
      component: Test
    },
    {
      name: 'loginForAdmin',
      path: '/loginForAdmin',
      component: LoginForAdmin
    },
    {
      name: 'homeForAdmin',
      path: '/homeForAdmin',
      component: HomeForAdmin,
      children: [
        {
          name: 'orderForSalerUnByAdmin',
          path: '/orderForSalerUnByAdmin',
          component: OrderForSalerUnByAdmin
        },
        {
          name: 'orderForSalerComByAdmin',
          path: '/orderForSalerComByAdmin',
          component: OrderForSalerComByAdmin
        },
        {
          name: 'orderForSalerWaitByAdmin',
          path: '/orderForSalerWaitByAdmin',
          component: OrderForSalerWaitByAdmin
        },
        {
          name: 'orderForBuyerComByAdmin',
          path: '/orderForBuyerComByAdmin',
          component: OrderForBuyerComByAdmin
        },
        {
          name: 'orderForBuyerUnByAdmin',
          path: '/orderForBuyerUnByAdmin',
          component: OrderForBuyerUnByAdmin
        },
        {
          name: 'orderForBuyerWaitByAdmin',
          path: '/orderForBuyerWaitByAdmin',
          component: OrderForBuyerWaitByAdmin
        },
        {
          name: 'goodsForAdmin',
          path: '/goodsForAdmin',
          component: GoodsForAdmin
        },
        {
          name: 'addGoodsForAdmin',
          path: '/addGoodsForAdmin',
          component: AddGoodsForAdmin
        },
        {
          name: 'addGoodsTypeForAdmin',
          path: '/addGoodsTypeForAdmin',
          component: AddGoodsTypeForAdmin
        },
        {
          name: 'allSaler',
          path: '/allSaler',
          component: AllSaler
        },
        {
          name: 'allBuyer',
          path: '/allBuyer',
          component: AllBuyer
        },
        {
          name: 'addSaler',
          path: '/addSaler',
          component: AddSaler
        },
        {
          name: 'addBuyer',
          path: '/addBuyer',
          component: AddBuyer
        },
        {
          name: 'oneAnnounceInAdmin',
          path: '/oneAnnounceInAdmin',
          component: OneAnnounceInAdminn
        },
        {
          name: 'announceForBuyer',
          path: '/announceForBuyer',
          component: AnnounceForBuyer
        },
        {
          name: 'announceForSaler',
          path: '/announceForSaler',
          component: AnnounceForSaler
        },
        {
          name: 'announceForAdmin',
          path: '/announceForAdmin',
          component: AnnounceForAdmin
        },
        {
          name: 'addAnnounceForAdmin',
          path: '/addAnnounceForAdmin',
          component: AddAnnounceForAdmin
        },
        {
          name: 'allCarousel',
          path: '/allCarousel',
          component: AllCarousel
        },
        {
          name: 'addCarousel',
          path: '/addCarousel',
          component: AddCarousel
        },
        {
          name: 'addAd',
          path: '/addAd',
          component: AddAd
        },
        {
          name: 'allAds',
          path: '/allAds',
          component: AllAds
        }
      ],
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('token') === '') next({ name: 'loginForAdmin' })
        else next()
      }
    },
    {
      name: 'homeForSaler',
      path: '/homeForSaler',
      component: HomeForSaler,
      children: [
        {
          name: 'orderForSalerUn',
          path: '/orderForSalerUn',
          component: OrderForSalerUn
        },
        {
          name: 'orderForSalerCom',
          path: '/orderForSalerCom',
          component: OrderForSalerCom
        },
        {
          name: 'orderForSalerWait',
          path: '/orderForSalerWait',
          component: OrderForSalerWait
        },
        {
          name: 'goodsForSaler',
          path: '/goodsForSaler',
          component: GoodsForSaler
        },
        {
          name: 'addGoodsForSaler',
          path: '/addGoodsForSaler',
          component: AddGoodsForSaler
        },
        {
          name: 'ownSaler',
          path: '/ownSaler',
          component: OwnSaler
        },
        {
          name: 'addAnnounceForSaler',
          path: '/addAnnounceForSaler',
          component: AddAnnounceForSaler
        },
        {
          name: 'announceManageForSaler',
          path: '/announceManageForSaler',
          component: AnnounceManageForSaler
        }
      ],
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('salername') === '') next({ name: 'loginForSaler' })
        else next()
      }
    },
    {name: 'homeForBuyer',
      path: '/',
      component: HomeForBuyer,
      children: [
        {
          name: 'home',
          path: '',
          component: Home
        },
        {
          name: 'Error',
          path: '/error',
          component: Error
        },
        {
          path: '/goods',
          name: 'Goods',
          component: Goods
        },
        {
          path: '/goods/details',
          name: 'Details',
          component: Details
        },
        {
          path: '/shoppingCart',
          name: 'ShoppingCart',
          component: ShoppingCart,
          meta: {
            requireAuth: true // 需要验证登录状态
          }
        },
        {
          path: '/order',
          name: 'Order',
          component: Order,
          meta: {
            requireAuth: true // 需要验证登录状态
          }
        },
        {
          path: '/confirmOrder',
          name: 'ConfirmOrder',
          component: ConfirmOrder,
          meta: {
            requireAuth: true // 需要验证登录状态
          }
        },
        {
          path: '/ownBuyer',
          name: 'ownBuyer',
          component: OwnBuyer,
          meta: {
            requireAuth: true // 需要验证登录状态
          }
        },
        {
          path: '/doneOrder',
          name: 'doneOrder',
          component: DoneOrder,
          meta: {
            requireAuth: true // 需要验证登录状态
          }
        },
        {
          path: '/addAnnounce',
          name: 'addAnnounce',
          component: AddAnnounce,
          meta: {
            requireAuth: true // 需要验证登录状态
          }
        },
        {
          path: '/announceViews',
          name: 'announceViews',
          component: AnnounceViews
        },
        {
          path: '/oneAnnounce',
          name: 'oneAnnounce',
          component: OneAnnounce
        },
        {
          path: '/announceManage',
          name: 'announceManage',
          component: AnnounceManage
        }
      ]
    }
  ]
})

/* 由于Vue-router在3.1之后把$router.push()方法改为了Promise。所以假如没有回调函数，错误信息就会交给全局的路由错误处理。
vue-router先报了一个Uncaught(in promise)的错误(因为push没加回调) ，然后再点击路由的时候才会触发NavigationDuplicated的错误(路由出现的错误，全局错误处理打印了出来)。 */
// 禁止全局路由错误处理打印
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) { return originalPush.call(this, location, onResolve, onReject) }
  return originalPush.call(this, location).catch(err => err)
}
