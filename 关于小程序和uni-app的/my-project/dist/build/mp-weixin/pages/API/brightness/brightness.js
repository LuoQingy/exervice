(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/API/brightness/brightness"],{"0761":function(e,n,t){"use strict";var c=function(){var e=this,n=e.$createElement;e._self._c},o=[];t.d(n,"a",function(){return c}),t.d(n,"b",function(){return o})},2678:function(e,n,t){"use strict";t.r(n);var c=t("0761"),o=t("d55e");for(var s in o)"default"!==s&&function(e){t.d(n,e,function(){return o[e]})}(s);t("f310");var r=t("2877"),u=Object(r["a"])(o["default"],c["a"],c["b"],!1,null,null,null);n["default"]=u.exports},"776b":function(e,n,t){"use strict";(function(e){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var t={data:function(){return{title:"brightness",screen:0,keepScreenOn:!0}},onLoad:function(){var n=this;e.getScreenBrightness({success:function(e){console.log(e),n.screen=(100*e.value).toFixed(),console.log("屏幕亮度值："+n.screen)},fail:function(e){console.log(e)}})},methods:{sliderChange:function(n){var t=n.detail.value;this.screen!==t&&(console.log("当前数值："+n.detail.value),e.setScreenBrightness({value:t/100,success:function(){console.log("success")},fail:function(e){console.log(e)}}),this.screen=t)},keep:function(){e.setKeepScreenOn({keepScreenOn:this.keepScreenOn}),this.keepScreenOn=!this.keepScreenOn}}};n.default=t}).call(this,t("543d")["default"])},b40c:function(e,n,t){},d55e:function(e,n,t){"use strict";t.r(n);var c=t("776b"),o=t.n(c);for(var s in c)"default"!==s&&function(e){t.d(n,e,function(){return c[e]})}(s);n["default"]=o.a},f310:function(e,n,t){"use strict";var c=t("b40c"),o=t.n(c);o.a}},[["0473","common/runtime","common/vendor"]]]);