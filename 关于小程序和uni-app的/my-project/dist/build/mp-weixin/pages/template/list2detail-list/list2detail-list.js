(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/template/list2detail-list/list2detail-list"],{"2f1a":function(t,e,i){"use strict";var n=function(){var t=this,e=t.$createElement;t._self._c},a=[];i.d(e,"a",function(){return n}),i.d(e,"b",function(){return a})},"92ce":function(t,e,i){"use strict";var n=i("db2a"),a=i.n(n);a.a},9986:function(t,e,i){"use strict";i.r(e);var n=i("2f1a"),a=i("cd82");for(var o in a)"default"!==o&&function(t){i.d(e,t,function(){return a[t]})}(o);i("92ce");var s=i("2877"),l=Object(s["a"])(a["default"],n["a"],n["b"],!1,null,null,null);e["default"]=l.exports},"9ab1":function(t,e,i){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n=i("325c").dateUtils,a={data:function(){return{banner:{},listData:[],last_id:"",reload:!1}},onLoad:function(){this.getBanner(),this.getList()},onPullDownRefresh:function(){this.reload=!0,this.last_id="",this.getBanner(),this.getList()},onReachBottom:function(){this.getList()},methods:{getBanner:function(){var e=this,i={column:"id,post_id,title,author_name,cover,published_at"};t.request({url:"https://unidemo.dcloud.net.cn/api/banner/36kr",data:i,success:function(i){t.stopPullDownRefresh(),200==i.statusCode&&(e.banner=i.data)},fail:function(t,e){console.log("fail"+JSON.stringify(t))}})},getList:function(){var e=this,i={column:"id,post_id,title,author_name,cover,published_at"};this.last_id&&(i.minId=this.last_id,i.time=(new Date).getTime()+"",i.pageSize=10),t.request({url:"https://unidemo.dcloud.net.cn/api/news",data:i,success:function(t){if(200==t.statusCode){var i=e.setTime(t.data);e.listData=e.reload?i:e.listData.concat(i),e.last_id=i[i.length-1].id,e.reload=!1}},fail:function(t,e){console.log("fail"+JSON.stringify(t))}})},goDetail:function(e){var i={author_name:e.author_name,cover:e.cover,id:e.id,post_id:e.post_id,published_at:e.published_at,title:e.title};t.navigateTo({url:"../list2detail-detail/list2detail-detail?detailDate="+encodeURIComponent(JSON.stringify(i))})},setTime:function(t){var e=[];return t.forEach(function(t){e.push({author_name:t.author_name,cover:t.cover,id:t.id,post_id:t.post_id,published_at:n.format(t.published_at),title:t.title})}),e}}};e.default=a}).call(this,i("543d")["default"])},cd82:function(t,e,i){"use strict";i.r(e);var n=i("9ab1"),a=i.n(n);for(var o in n)"default"!==o&&function(t){i.d(e,t,function(){return n[t]})}(o);e["default"]=a.a},db2a:function(t,e,i){}},[["cb73","common/runtime","common/vendor"]]]);