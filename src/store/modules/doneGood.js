export default {
  state: {
    good: {},
    goodsNum: 1
  },
  getters: {
    getGood (state) {
      return state.good
    },
    getGoodsNum (state) {
      return state.goodsNum
    }
  },
  mutations: {
    setGood (state, data) {
      state.good = data
    },
    setGoodsNum (state, data) {
      state.goodsNum = data
    }
  },
  actions: {
    setGood ({ commit }, data) {
      commit('setGood', data)
    },
    setGoodsNum ({ commit }, data) {
      commit('setGoodsNum', data)
    }

  }
}
