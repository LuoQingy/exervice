(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/component/movable-view/movable-view"],{"3a02":function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var i={data:function(){return{x:0,y:0,scale:2,old:{x:0,y:0,scale:2}}},methods:{tap:function(t){this.x=this.old.x,this.y=this.old.y,this.$nextTick(function(){this.x=30,this.y=30})},tap2:function(){this.scale=this.old.scale,this.scale=this.old.scale,this.$nextTick(function(){this.scale=3})},onChange:function(t){this.old.x=t.detail.x,this.old.y=t.detail.y},onScale:function(t){this.old.scale=t.detail.scale}}};n.default=i},"589e":function(t,n,e){"use strict";e.r(n);var i=e("3a02"),a=e.n(i);for(var o in i)"default"!==o&&function(t){e.d(n,t,function(){return i[t]})}(o);n["default"]=a.a},7702:function(t,n,e){"use strict";e.r(n);var i=e("84f1"),a=e("589e");for(var o in a)"default"!==o&&function(t){e.d(n,t,function(){return a[t]})}(o);e("f3e4");var c=e("2877"),l=Object(c["a"])(a["default"],i["a"],i["b"],!1,null,null,null);n["default"]=l.exports},"84f1":function(t,n,e){"use strict";var i=function(){var t=this,n=t.$createElement;t._self._c},a=[];e.d(n,"a",function(){return i}),e.d(n,"b",function(){return a})},ec75:function(t,n,e){},f3e4:function(t,n,e){"use strict";var i=e("ec75"),a=e.n(i);a.a}},[["c996","common/runtime","common/vendor"]]]);