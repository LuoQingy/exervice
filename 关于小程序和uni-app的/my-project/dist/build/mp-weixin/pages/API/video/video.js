(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/API/video/video"],{2971:function(e,n,t){"use strict";t.r(n);var o=t("5703"),u=t.n(o);for(var c in o)"default"!==c&&function(e){t.d(n,e,function(){return o[e]})}(c);n["default"]=u.a},5703:function(e,n,t){"use strict";(function(e){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var t=[["camera"],["album"],["camera","album"]],o={data:function(){return{title:"chooseVideo",sourceTypeIndex:2,sourceType:["拍摄","相册","拍摄或相册"],src:""}},onUnload:function(){this.src="",this.sourceTypeIndex=2,this.sourceType=["拍摄","相册","拍摄或相册"]},methods:{sourceTypeChange:function(e){this.sourceTypeIndex=e.target.value},chooseVideo:function(){var n=this;e.chooseVideo({sourceType:t[this.sourceTypeIndex],success:function(e){n.src=e.tempFilePath}})}}};n.default=o}).call(this,t("543d")["default"])},"69e8":function(e,n,t){"use strict";t.r(n);var o=t("b2b2"),u=t("2971");for(var c in u)"default"!==c&&function(e){t.d(n,e,function(){return u[e]})}(c);t("ec1c");var r=t("2877"),a=Object(r["a"])(u["default"],o["a"],o["b"],!1,null,null,null);n["default"]=a.exports},b2b2:function(e,n,t){"use strict";var o=function(){var e=this,n=e.$createElement;e._self._c},u=[];t.d(n,"a",function(){return o}),t.d(n,"b",function(){return u})},d39b:function(e,n,t){},ec1c:function(e,n,t){"use strict";var o=t("d39b"),u=t.n(o);u.a}},[["b6d7","common/runtime","common/vendor"]]]);