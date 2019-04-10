import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import {store} from './store/index'
import  {api,instanceAuth,xwinstanceAuth } from '@/libs/axiosProxy.js'
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
import '../static/css/icon.css';
import "babel-polyfill";
import echarts from 'echarts';
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)


/* 
  获取缓存的配置，不要在配置文件里去配置
*/ 

Vue.prototype.$axios = axios;
Vue.prototype.$httpAuth= instanceAuth;
Vue.prototype.$xwhttpAuth = xwinstanceAuth;

Vue.prototype.$api = api;
Vue.prototype.$echarts = echarts;

Vue.use(ElementUI, {size: 'small'});
//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  const role = localStorage.getItem('token');
  if (!role && to.path !== '/login') {
    next('/login');
  } else if (to.meta.permission) {
    // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
    role === 'admin' ? next() : next('/403');
  } else {
    next();
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
