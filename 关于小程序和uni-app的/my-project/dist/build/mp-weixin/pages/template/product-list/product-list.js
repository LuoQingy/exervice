(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/template/product-list/product-list"],{"0627":function(t,i,e){"use strict";(function(t){Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;var e={data:function(){return{title:"product-list",productList:[],renderImage:!1}},methods:{loadData:function(){var t=this,i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"add",e=[{image:"https://img-cdn-qiniu.dcloud.net.cn/uploads/example/product1.jpg",title:"Apple iPhone X 256GB 深空灰色 移动联通电信4G手机",originalPrice:9999,favourPrice:8888,tip:"自营"},{image:"https://img-cdn-qiniu.dcloud.net.cn/uploads/example/product2.jpg",title:"Apple iPad 平板电脑 2018年新款9.7英寸",originalPrice:3499,favourPrice:3399,tip:"优惠"},{image:"https://img-cdn-qiniu.dcloud.net.cn/uploads/example/product3.jpg",title:"Apple MacBook Pro 13.3英寸笔记本电脑（2017款Core i5处理器/8GB内存/256GB硬盘 MupxT2CH/A）",originalPrice:12999,favourPrice:10688,tip:"秒杀"},{image:"https://img-cdn-qiniu.dcloud.net.cn/uploads/example/product4.jpg",title:"Kindle Paperwhite电纸书阅读器 电子书墨水屏 6英寸wifi 黑色",originalPrice:999,favourPrice:958,tip:"秒杀"},{image:"https://img-cdn-qiniu.dcloud.net.cn/uploads/example/product5.jpg",title:"微软（Microsoft）新Surface Pro 二合一平板电脑笔记本 12.3英寸（i5 8G内存 256G存储）",originalPrice:8888,favourPrice:8288,tip:"优惠"},{image:"https://img-cdn-qiniu.dcloud.net.cn/uploads/example/product6.jpg",title:"Apple Watch Series 3智能手表（GPS款 42毫米 深空灰色铝金属表壳 黑色运动型表带 MQL12CH/A）",originalPrice:2899,favourPrice:2799,tip:"自营"}];"refresh"===i&&(this.productList=[]),e.forEach(function(i){t.productList.push(i)})}},onLoad:function(){var t=this;this.loadData(),setTimeout(function(){t.renderImage=!0},300)},onPullDownRefresh:function(){this.loadData("refresh"),setTimeout(function(){t.stopPullDownRefresh()},2e3)},onReachBottom:function(){this.loadData()}};i.default=e}).call(this,e("543d")["default"])},"71cd":function(t,i,e){"use strict";e.r(i);var n=e("0627"),o=e.n(n);for(var a in n)"default"!==a&&function(t){e.d(i,t,function(){return n[t]})}(a);i["default"]=o.a},a094:function(t,i,e){"use strict";var n=function(){var t=this,i=t.$createElement;t._self._c},o=[];e.d(i,"a",function(){return n}),e.d(i,"b",function(){return o})},eb55:function(t,i,e){"use strict";e.r(i);var n=e("a094"),o=e("71cd");for(var a in o)"default"!==a&&function(t){e.d(i,t,function(){return o[t]})}(a);var r=e("2877"),u=Object(r["a"])(o["default"],n["a"],n["b"],!1,null,null,null);i["default"]=u.exports}},[["11c9","common/runtime","common/vendor"]]]);