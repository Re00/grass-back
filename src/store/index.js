import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import admin from './modules/admin'
import saler from './modules/saler'
import shoppingCart from './modules/shoppingCart'
import doneGood from './modules/doneGood'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  modules: {
    user,
    admin,
    saler,
    doneGood,
    shoppingCart
  }
})
