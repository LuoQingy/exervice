import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import Fastclick from 'fastclick'
Fastclick.attach(document.body)

Vue.config.productionTip = false;
import request from './assets/js/request.js'
// import Vuelazyload from 'vue-lazyload'
// global.$ = global.jQuery = $

Vue.use(request)

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
