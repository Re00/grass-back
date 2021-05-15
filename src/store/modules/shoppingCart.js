export default {
  state: {
    shoppingCart: []
    // shoppingCart结构
    /*
    shoppingCart = {
      id: "", // 购物车id buyerCart.id
      productID: "", // 商品id goods.gid
      productName: "", // 商品名称 goods.gname
      productImg: "", // 商品图片 goods.gimgMain
      price: "", // 商品价格 goods.gpride
      num: "", // 商品数量 buyerCart.goodsnum
      maxNum: "", // 商品限购数量 buyerCart.goodsnum
      check: false // 是否勾选 buyerCart.checkType
    } */
  },
  getters: {
    getShoppingCart (state) {
      // 获取购物车状态
      console.log('获取购物车状态')
      console.log(state.shoppingCart)
      return state.shoppingCart
    },
    getNum (state) {
      // 购物车商品总数量
      console.log('获取购物车总数量')
      let totalNum = 0
      for (let i = 0; i < state.shoppingCart.length; i++) {
        const temp = state.shoppingCart[i]
        totalNum += temp.buyerCart.goodsnum
      }
      return totalNum
    },
    getIsAllCheck (state) {
      // 判断是否全选
      let isAllCheck = true
      for (let i = 0; i < state.shoppingCart.length; i++) {
        const temp = state.shoppingCart[i]
        // 只要有一个商品没有勾选立即return false;
        if (!temp.buyerCart.checkType) {
          isAllCheck = false
          return isAllCheck
        }
      }
      return isAllCheck
    },
    getCheckGoods (state) {
      // 获取勾选的商品信息
      // 用于确认订单页面
      let checkGoods = []
      for (let i = 0; i < state.shoppingCart.length; i++) {
        const temp = state.shoppingCart[i]
        if (temp.buyerCart.checkType) {
          checkGoods.push(temp)
        }
      }
      return checkGoods
    },
    getCheckNum (state) {
      // 获取购物车勾选的商品数量
      let totalNum = 0
      for (let i = 0; i < state.shoppingCart.length; i++) {
        const temp = state.shoppingCart[i]
        if (temp.buyerCart.checkType) {
          totalNum += temp.buyerCart.goodsnum
        }
      }
      return totalNum
    },
    getTotalPrice (state) {
      // 购物车勾选的商品总价格
      let totalPrice = 0
      for (let i = 0; i < state.shoppingCart.length; i++) {
        const temp = state.shoppingCart[i]
        if (temp.buyerCart.checkType) {
          totalPrice += temp.goods.gpride * temp.buyerCart.goodsnum
        }
      }
      return totalPrice
    }
  },
  mutations: {
    setShoppingCart (state, data) {
      console.log('设置购物车状态')
      // 设置购物车状态
      state.shoppingCart = data
    },
    unshiftShoppingCart (state, data) {
      console.log('添加购物车')
      // 添加购物车
      // 用于在商品详情页点击添加购物车,后台添加成功后，更新vuex状态
      state.shoppingCart.unshift(data)
    },
    updateShoppingCart (state, payload) {
      console.log('更新购物车调用')
      console.log(payload)
      // 更新购物车
      // 可更新商品数量和是否勾选
      // 用于购物车点击勾选及加减商品数量
      if (payload.prop === 'num') {
        // 判断效果的商品数量是否大于限购数量或小于1
        if (state.shoppingCart[payload.key].goods.gnum < payload.val) {
          return
        }
        if (payload.val < 1) {
          return
        }
        state.shoppingCart[payload.key].buyerCart.goodsnum = payload.val
      }
      if (payload.prop === 'check') {
        state.shoppingCart[payload.key].buyerCart.checkType = payload.val
      }
      // 根据商品在购物车的数组的索引和属性更改
    },
    addShoppingCartNum (state, productID) {
      console.log('增加购物车调用')
      // 增加购物车商品数量
      // 用于在商品详情页点击添加购物车,后台返回002，“该商品已在购物车，数量 +1”，更新vuex的商品数量
      for (let i = 0; i < state.shoppingCart.length; i++) {
        const temp = state.shoppingCart[i]
        if (temp.goods.gid === productID) {
          if (temp.buyerCart.goodsnum < temp.goods.gnum) {
            console.log('数量加一')
            temp.buyerCart.goodsnum++
          }
        }
      }
    },
    deleteShoppingCart (state, id) {
      console.log('根据购物车id删除购物车商品')
      // 根据购物车id删除购物车商品
      for (let i = 0; i < state.shoppingCart.length; i++) {
        const temp = state.shoppingCart[i]
        if (temp.buyerCart.id === id) {
          state.shoppingCart.splice(i, 1)
        }
      }
    },
    checkAll (state, data) {
      console.log('点击全选按钮，更改每个商品的勾选状态')
      // 点击全选按钮，更改每个商品的勾选状态
      for (let i = 0; i < state.shoppingCart.length; i++) {
        state.shoppingCart[i].buyerCart.checkType = data
      }
    }
  },
  actions: {
    setShoppingCart ({ commit }, data) {
      commit('setShoppingCart', data)
    },
    unshiftShoppingCart ({ commit }, data) {
      commit('unshiftShoppingCart', data)
    },
    updateShoppingCart ({ commit }, payload) {
      commit('updateShoppingCart', payload)
    },
    addShoppingCartNum ({ commit }, productID) {
      commit('addShoppingCartNum', productID)
    },
    deleteShoppingCart ({ commit }, id) {
      commit('deleteShoppingCart', id)
    },
    checkAll ({ commit }, data) {
      commit('checkAll', data)
    }
  }
}
