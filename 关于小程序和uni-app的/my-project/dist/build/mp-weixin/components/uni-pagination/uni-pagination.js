(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/uni-pagination/uni-pagination"],{2907:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var u=function(){return e.e("components/uni-icon/uni-icon").then(e.bind(null,"f0ab"))},r={name:"uni-pagination",components:{uniIcon:u},props:{prevText:{type:String,default:"上一页"},nextText:{type:String,default:"下一页"},current:{type:[Number,String],default:1},total:{type:[Number,String],default:0},pageSize:{type:[Number,String],default:10},showIcon:{type:[Boolean,String],default:!1}},watch:{current:function(t){this.currentIndex=+t}},data:function(){return{currentIndex:1}},computed:{maxPage:function(){var t=1,n=Number(this.total),e=Number(this.pageSize);return n&&e&&(t=Math.ceil(n/e)),t}},methods:{clickLeft:function(){1!==Number(this.currentIndex)&&(this.currentIndex-=1,this.change("prev"))},clickRight:function(){Number(this.currentIndex)!==this.maxPage&&(this.currentIndex+=1,this.change("next"))},change:function(t){this.$emit("change",{type:t,current:this.currentIndex})}},created:function(){this.currentIndex=+this.current}};n.default=r},3525:function(t,n,e){"use strict";e.r(n);var u=e("2907"),r=e.n(u);for(var i in u)"default"!==i&&function(t){e.d(n,t,function(){return u[t]})}(i);n["default"]=r.a},"81ebb":function(t,n,e){"use strict";var u=e("c988"),r=e.n(u);r.a},"9f41":function(t,n,e){"use strict";e.r(n);var u=e("ddfe"),r=e("3525");for(var i in r)"default"!==i&&function(t){e.d(n,t,function(){return r[t]})}(i);e("81ebb");var c=e("2877"),a=Object(c["a"])(r["default"],u["a"],u["b"],!1,null,null,null);n["default"]=a.exports},c988:function(t,n,e){},ddfe:function(t,n,e){"use strict";var u=function(){var t=this,n=t.$createElement;t._self._c},r=[];e.d(n,"a",function(){return u}),e.d(n,"b",function(){return r})}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/uni-pagination/uni-pagination-create-component',
    {
        'components/uni-pagination/uni-pagination-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("9f41"))
        })
    },
    [['components/uni-pagination/uni-pagination-create-component']]
]);                
