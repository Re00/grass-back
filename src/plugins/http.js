// 插件模块

import axios from 'axios'

const MyHttpServer = {}

MyHttpServer.install = (Vue) => {
  // 基准地址
  // http://renyuhe.top:7979/
  axios.defaults.baseURL = 'http://renyuhe.top:7979/'
  // 添加请求拦截器
  axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    console.log('请求拦截器触发')
    config.headers['token'] = localStorage.getItem('token')
    console.log(localStorage.getItem('token'))
    console.log(config.url)
    return config
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  })

  // 添加响应拦截器
  axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  })
  // 4. 添加实例方法
  Vue.prototype.$http = axios

  // // 1. 添加全局方法或 property
  // Vue.myGlobalMethod = function () {
  //   // 逻辑...
  // }

  // // 2. 添加全局资源
  // Vue.directive('my-directive', {
  //   bind (el, binding, vnode, oldVnode) {
  //     // 逻辑...
  //   }
  //   ...
  // })

  // // 3. 注入组件选项
  // Vue.mixin({
  //   created: function () {
  //     // 逻辑...
  //   }
  //   ...
  // })
}

export default MyHttpServer
