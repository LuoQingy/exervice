import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

let typeData = [
  "推荐",
  "美食",
  "旅游",
  "时尚",
  "健康",
  "汽车",
  "娱乐",
  "猎奇",
  "社会",
  "财经",
  "体育",
  "国内",
  "家居",
  "科技",
  "电视",
  "NBA",
  "人文",
  "数码",
  ];
  console.log(typeData);
var randomNum1 = Math.floor(Math.random()*typeData.length);
var type = typeData[randomNum1];
export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home/index/'+type+''
    },
    {
      path: '/home',
      component: resolve => require(['./views/Home.vue'], resolve),
      children: [{
        path: '/home/index/:id',
        name: 'Home',
        component: resolve => require(['./views/content/content.vue'], resolve),
        meta:{keepAlive:true}
      },
      {
        path: '/home/third',
        name: 'third',
        component: resolve => require(['./views/modular/modularThird.vue'], resolve),
        meta:{keepAlive:true}
      }
    ]
    },
    // {
    //   path: "/about",
    //   name: "about",
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () =>
    //     import(/* webpackChunkName: "about" */ "./views/About.vue")
    // }
  ]
});
