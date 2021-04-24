import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login.vue'
import Test1 from '@/components/login/test1.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'test1',
      path: '/test1',
      component: Test1
    }
  ]
})
