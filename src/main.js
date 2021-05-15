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
// 导入quill富文本
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import QuillEditor from 'vue-quill-editor'
import MyServerHttp from '@/plugins/http.js'
import store from './store'

// 全局组件
import MyMenu from './components/MyMenu'
import MyList from './components/MyList'
import MyLogin from './components/MyLogin'
import MyRegister from './components/MyRegister'

// 全局函数及变量
import Global from './Global'
Vue.component(MyMenu.name, MyMenu)
Vue.component(MyList.name, MyList)
Vue.component(MyLogin.name, MyLogin)
Vue.component(MyRegister.name, MyRegister)

// 使用eleme-ui
Vue.use(ElementUI)
// 使用全局js
Vue.use(Global)
// 使用富文本
Vue.use(QuillEditor)

// 使用axios
Vue.use(MyServerHttp)

// 全局拦截器,在进入需要用户权限的页面前校验是否已经登录
router.beforeResolve((to, from, next) => {
  const loginUser = store.state.user.user.buyerId
  console.log(loginUser)
  // 判断路由是否设置相应校验用户权限
  if (to.meta.requireAuth) {
    if (loginUser === '' || loginUser === undefined) {
      // 没有登录，显示登录组件
      store.dispatch('setShowLogin', true)
      if (from.name == null) {
        // 此时，是在页面没有加载，直接在地址栏输入链接，进入需要登录验证的页面
        next('/')
        return
      }
      // 终止导航
      next(false)
      return
    }
  }
  next()
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  store,
  template: '<App/>'
})
