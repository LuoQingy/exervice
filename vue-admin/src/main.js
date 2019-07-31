import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import Cookies from 'js-cookie'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import store from './store'
import router from './router'


import './icons' // icon


Vue.use(ElementUI,{
  size: Cookies.get('size') || 'medium' // set element-ui default size
})
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
