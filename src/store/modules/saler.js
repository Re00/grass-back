/*
 * @Description: 用户登录状态模块
 * @Author: hai-27
 * @Date: 2020-02-19 17:42:11
 * @LastEditors: hai-27
 * @LastEditTime: 2020-02-26 23:14:32
 */
export default {
  state: {
    saler: '',
    // {
    //   salername: '', // 登录的供货商昵称
    //     salerId: '', // 供货商Id
    //   salerImg: '', // 供货商头像
    //   token: ''
    // },
    showLoginForSaler: false // 用于控制是否显示登录组件
  },
  getters: {
    getSaler (state) {
      return state.saler
    },
    getShowLoginForSaler (state) {
      return state.showLoginForSaler
    }
  },
  mutations: {
    setSaler (state, data) {
      state.saler = data
    },
    setShowLoginForSaler (state, data) {
      state.showLoginForSaler = data
    }
  },
  actions: {
    setSaler ({ commit }, data) {
      commit('setSaler', data)
    },
    setShowLoginForSaler ({ commit }, data) {
      commit('setShowLoginForSaler', data)
    }
  }
}
