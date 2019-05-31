<template>
  <!-- <div class="mescroll-box"> -->
  <!-- <div ref="mescroll" class="mescroll" id="mescroll"> -->
  <div v-if="componentshow" style="padding:0 0px;">
    <!-- <div class="news-list-wrap" v-for="(item, index) in dataList" :key="index"> -->
    <section
      v-for="(item, index) in dataList"
      :key="index"
      class="news-item"
      :class="item.images.length >= 3 ? 'news-item-s2' : 'news-item-s1'"
    >
      <modular-advertisement v-if="index%2==1&&index>0"></modular-advertisement>
      <modular-second
        v-if="item.images.length >= 3"
        :itemContent="item"
      ></modular-second>
      <modular-first v-else :itemContent="item"></modular-first>
     
    </section>
    <!-- </div> -->
  </div>
  <!-- </div> -->
  <!-- </div> -->
</template>

<script>
import modularFirst from '@/views/modular/modularFirst';
import modularSecond from '@/views/modular/modularSecond';
export default {
  components: { modularFirst, modularSecond,modularAdvertisement:{
      render(createElement) {
        return createElement(
          'script',
          {
            attrs: {
              type: 'text/javascript',
              src: '//tu.baixing.com/widget/script/zl-xxlst26.js?autosize=1',
            },
          },
        );
      },
    },},
  props: { 'father': null, "Adown": { type: Boolean, default: true } },
  data() {
    return {
      // type: '',
      dataList: [],//数据列表
      componentshow: false,
      mescroll: null,
      topimage: {
        src: require("../../assets/image/mescroll-totop.png")
      },
      // timer: null,
      // loadingtimes: 0,
      // once: true,
      // OnceTimes: 3000,
      num: 0,
      scrollTop: 35
    }
  },
  mounted() {
    let type = this.$route.params.type;
    // this.type = type;
    // console.log("首页进来的栏目:" + this.type);
    this.loadingDialog("show");
    // this.mescrollEvent()//初始化mescroll
    // this.getFristList(type);
    this.getDataList(type)

    if (!this.father) {
      this.bus.$on('downCallback', this.downCallback)
      this.bus.$on('upCallback', this.upCallback)
    }
  },
  destroyed() {
    console.log("子页面1被缓存");
    // 卸载监控上拉/下拉加载
    this.bus.$off('downCallback', this.downCallback)
    this.bus.$off('upCallback', this.upCallback)
  },

  // activated() {
  //   console.log("子页面1被激活");
  //   // 触发监控上拉/下拉加载
  //   if (!this.father) {
  //     this.bus.$on('downCallback', this.downCallback)
  //     this.bus.$on('upCallback', this.upCallback)
  //   }
  // },
  //keep-alive钩子函数：组件消失，被缓存时调用
  // deactivated() {
  //   console.log("子页面1被缓存");
  //   // 卸载监控上拉/下拉加载
  //   this.bus.$off('downCallback', this.downCallback)
  //   this.bus.$off('upCallback', this.upCallback)
  // },
  methods: {
    // mescrollEvent() {//初始化mescroll
    //   //下拉加载初始化
    //   let self = this;
    //   self.mescroll = new MeScroll("body", {
    //     //请至少在vue的mounted生命周期初始化mescroll,以确保您配置的id能够被找到
    //     down: {
    //       use: this.Adown,//是否启用下拉刷新
    //       auto: false, //是否在初始化完毕之后自动执行下拉回调callback; 默认true
    //       callback: self.downCallback, //下拉刷新的回调
    //       lazyLoad: {
    //         use: true,
    //         attr: "imgurl", // 网络地址的属性名 (图片加载成功会移除该属性): <img imgurl='网络图  src='占位图''/>
    //         // showClass: '', // 图片加载成功的显示动画: 渐变显示,参见mescroll.css
    //         delay: 0, // 列表滚动的过程中每500ms检查一次图片是否在可视区域,如果在可视区域则加载图片
    //         offset: 200 // 超出可视区域200px的图片仍可触发懒加载,目的是提前加载部分图片
    //       }
    //     },
    //     up: {
    //       auto: false, //初始化完毕,是否自动触发上拉加载的回调
    //       isBoth: false, //上拉加载时,如果滑动到列表顶部是否可以同时触发下拉刷新;默认false,两者不可同时触发; 这里为了演示改为true,不必等列表加载完毕才可下拉;
    //       isBounce: true, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
    //       callback: self.upCallback, //上拉加载的回调
    //       toTop: {
    //         //配置回到顶部按钮
    //         src: self.topimage.src //默认滚动到1000px显示,可配置offset修改
    //         //offset : 1000
    //       },
    //       lazyLoad: {
    //         use: true,
    //         attr: "imgurl", // 网络地址的属性名 (图片加载成功会移除该属性): <img imgurl='网络图  src='占位图''/>
    //         // showClass: '', // 图片加载成功的显示动画: 渐变显示,参见mescroll.css
    //         delay: 0, // 列表滚动的过程中每500ms检查一次图片是否在可视区域,如果在可视区域则加载图片
    //         offset: 200 // 超出可视区域200px的图片仍可触发懒加载,目的是提前加载部分图片
    //       }
    //     }
    //   });
    // },
    getDataList(type, beforeId = null, isUpback = false) {
      let reqObj = beforeId ? { params: { type, beforeId } } : { params: { type } }
      this.$http.get("/news.html", reqObj).then(res => {
        // this.log('dataList', res.data.data)
        let resArr = []
        if (!isUpback) {//非下拉加载重置数组
          this.dataList = []
        }
        res.data.data.forEach((item, index) => {
          if (item.type == 'news') {
            resArr.push(item);
          }
        });
        this.$set(this, 'dataList', this.dataList.concat(resArr))
        this.loadingDialog("hide");
        this.componentshow = true;
        // this.mescroll.endSuccess();
        // 触发父组件的endSuccess
        this.bus.$emit('endSuccess')
        if (!beforeId && resArr.length < 10) { //初次请求返回数据不足10时重新发送请求
          this.getDataList(type, resArr[resArr.length - 1]['id'], true)
        }
      }).catch(err => {
        this.bus.$emit('endErr')
      })
    },
    // getFristList(type) {//根据类型type获取数据
    //   this.$http.get("/news.html", {
    //     params: {
    //       type
    //     },
    //   }).then(res => {
    //     let dataList = [];
    //     let data = res.data.data
    //     data.forEach((item, index) => {
    //       if (item.type == 'news') {
    //         dataList.push(item);
    //       }
    //     });
    //     this.dataList = [];
    //     if (dataList.length >= 10) {
    //       this.log('dataList', dataList)
    //       this.dataList = data;
    //       this.loadingDialog("hide");
    //       this.componentshow = true;
    //       this.mescroll.endSuccess();
    //       // this.addAdvertisement();//添加上拉加载的广告  
    //     } else {
    //       this.getBeforeidList(type, data[0].id, false);
    //     }
    //     // localStorage.setItem("route", this.AType || this.$route.params.type);
    //   });
    // },

    // getBeforeidList(type, beforeId, isUpback) {//根据类型type和beforeId获取数据 isUpback//是否上拉加载
    //   let dataList = [];
    //   this.$http.get("/news.html", {
    //     params: {
    //       type,
    //       beforeId
    //     },
    //   }).then(res => {
    //     this.componentshow = true;
    //     let data = res.data.data
    //     data.forEach((item, index) => {
    //       if (item.type == 'news') {
    //         dataList.push(item);
    //       }
    //     })
    //     if (!isUpback) {
    //       this.dataList = dataList;
    //       this.loadingDialog("hide");
    //       this.mescroll.endSuccess();
    //       // this.addAdvertisement();//添加上拉加载的广告
    //     } else {
    //       this.dataList = this.dataList.concat(dataList);
    //       this.mescroll.endSuccess();
    //       // this.addAdvertisement();//添加上拉加载的广告  
    //     }
    //   }).catch(err => {
    //     this.mescroll.endErr()
    //   })
    // },
    downCallback() {//下拉刷新的回调
      this.componentshow = false;
      // this.loadingtimes = 0;
      // setTimeout(() => {
      let type = this.$route.params.type;//刷新的类型
      let beforeId = this.dataList[this.dataList.length - 1].id;//刷新前列表最后广告id
      this.getDataList(type, beforeId, false);
      // }, 200)
    },

    upCallback() {//上拉加载的回调
      let type = this.$route.params.type;//刷新的类型
      let beforeId = this.dataList[this.dataList.length - 1].id;//刷新前列表最后广告id
      this.getDataList(type, beforeId, true);
    },

    // addAdvertisement() {//添加广告
    //   //自动执行上拉加载的逻辑
    //   if (this.once) {
    //     this.once = false //防止重新执行定时器
    //     this.automation()
    //   }
    // },
    // automation() {//用定时器执行上拉加载
    //   console.log(this.once);
    //   console.log(421);
    //   console.log(this.OnceTimes);
    //   this.timer = setInterval(() => {
    //     this.loadingtimes++;
    //     console.log("上拉加载启动")
    //     this.upCallback();
    //     console.log(this.loadingtimes)
    //     if (this.loadingtimes >= 5) {
    //       console.log('NIHAO')
    //       clearInterval(this.timer)
    //     }
    //   }, this.OnceTimes);
    //   if (this.loadingtimes >= 5) {
    //     console.log('NIHAO')
    //     clearInterval(this.timer)
    //   }
    // },
  },
  watch: {
    // 监听路由变化-用于非首次加载
    $route: function (to, from) {
      let TmpType = this.$route.params.type
      // let localroute = localStorage.getItem("route");
      // if (localroute == TmpType) {
      //   this.loadingDialog("hide");
      //   this.componentshow = true;
      // } else {
      // this.type = TmpType;
      this.loadingDialog("show");
      this.componentshow = false;
      this.getDataList(TmpType);

      // this.mescroll.scrollTo(0, 0)
      // console.log("监听路由的变化1");
      //console.log(this.$route.params);
      //清除定时器
      // clearInterval(this.timer)
      // this.once = true
      // this.loadingtimes = 0//重置自动加载的次数
      // }
    }
  }
}
</script>

<style lang="less">
.news-item,
.news-item-s2,
.news-ad {
  height: auto;
  position: relative;
  &:before {
    content: "";
    position: absolute;
    width: 187.5%;
    height: 1px;
    bottom: 0;
    left: 3%;
    right: 0;
    top: 0;
    margin: 0 auto;
    // transform: translateX(-50%);
    border-bottom: 1px solid #e6e6e6;
    transform-origin: 0 0;
    transform: scale(0.5, 0.5);
    box-sizing: border-box;
  }
  a {
    display: block;
    padding: 10px 0;
    // border-bottom: 1px solid #f5f5f5;
    color: #333;
    text-decoration: none;
    .news-wrap {
      position: relative;
      min-height: 115px;
      h3 {
        font-size: 15px;
        line-height: 1.2em;
        overflow: hidden;
        width: 100%;
        max-height: 40px;
        margin-bottom: 15px;
        font-weight: 800;
        color: #222222;
      }
      .img-wrap {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        display: -webkit-flex;
        overflow: hidden;
        height: 2rem;
        .img {
          width: 33.33%;
          padding-right: 2px;
          div {
            width: 100%;
            background-color: rgba(150, 150, 150, 0.1);
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;
            height: 100%;
            border-radius: 2px;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      .tags {
        margin-top: 15px;
        color: #999999;
        overflow: hidden;
        font-size: 12px;
        font-family: PingFang-SC-Medium;
        .tag {
          display: inline-block;
          line-height: 12px;
          margin-right: 5px;
        }
        .tag-view {
          float: right;
          margin-right: 0px;
        }
      }
    }
  }
}
.news-item:first-child,
.news-item-s2:first-child,
.news-ad:first-child {
  height: auto;
  position: relative;
  &:before {
    content: "";
    display: none;
  }
}
.modular-advertisement{
  width: 100%;
  height: 2.5rem;
  background: red;
}
</style>
