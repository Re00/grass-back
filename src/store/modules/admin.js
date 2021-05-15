export default {
  state: {
    admin: '',
    adminToken: '',
    showLoginForAdmin: false // 用于控制是否显示登录组件
  },
  getters: {
    getAdminToken (state) {
      return state.adminToken
    },
    getAdmin (state) {
      return state.admin
    },
    getShowLoginForAdmin (state) {
      return state.showLoginForAdmin
    }
  },
  mutations: {
    setAdminToken (state, data) {
      state.adminToken = data
    },
    setAdmin (state, data) {
      state.admin = data
    },
    setShowLoginForAdmin (state, data) {
      state.showLoginForAdmin = data
    }
  },
  actions: {
    setAdminToken ({ commit }, data) {
      commit('setAdminToken', data)
    },
    setAdmin ({ commit }, data) {
      commit('setAdmin', data)
    },
    setShowLoginForAdmin ({ commit }, data) {
      commit('setShowLoginForAdmin', data)
    }
  }
}
