// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 导入element-ui
import ElementUI from 'element-ui'
// 使用element-ui css
import 'element-ui/lib/theme-chalk/index.css'
// 导入全局css
import '@/assets/css/reset.css'

import MyServerHttp from '@/plugins/http.js'

// 使用eleme-ui
Vue.use(ElementUI)

// 使用axios
Vue.use(MyServerHttp)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
