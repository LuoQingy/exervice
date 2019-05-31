<template>
  <div class="home">
    <m-header></m-header>
    <!-- <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" /> -->
    <router-view />
  </div>
</template>

<script>
import mHeader from './m-header/m-header.vue'
export default {
  components: { mHeader },
  data() {
    return {
      mescroll: null,
      topimage: {
        src: require("@/assets/image/mescroll-totop.png")
      },
    }
  },
  watch: {
    $route(to, from) {
      let name = to.name
      this.lockDown(name === 'artical')
    }
  },
  methods: {
    mescrollEvent() {//初始化mescroll
      //下拉加载初始化
      this.mescroll = new MeScroll("body", {
        //请至少在vue的mounted生命周期初始化mescroll,以确保您配置的id能够被找到
        down: {
          //   use: this.Adown,//是否启用下拉刷新
          auto: false, //是否在初始化完毕之后自动执行下拉回调callback; 默认true
          callback: this.downCallback, //下拉刷新的回调
          // callback: this.$refs.son.downCallback, //下拉刷新的回调
          //   callback: this.bus.$emit('downCallback'), //下拉刷新的回调
          lazyLoad: {
            use: true,
            attr: "imgurl", // 网络地址的属性名 (图片加载成功会移除该属性): <img imgurl='网络图  src='占位图''/>
            // showClass: '', // 图片加载成功的显示动画: 渐变显示,参见mescroll.css
            delay: 0, // 列表滚动的过程中每500ms检查一次图片是否在可视区域,如果在可视区域则加载图片
            offset: 200 // 超出可视区域200px的图片仍可触发懒加载,目的是提前加载部分图片
          }
        },
        up: {
          auto: false, //初始化完毕,是否自动触发上拉加载的回调
          isBoth: false, //上拉加载时,如果滑动到列表顶部是否可以同时触发下拉刷新;默认false,两者不可同时触发; 这里为了演示改为true,不必等列表加载完毕才可下拉;
          isBounce: true, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
          callback: this.upCallback, //上拉加载的回调
          //   callback: this.$refs.son.upCallback, //上拉加载的回调
          //   callback: this.bus.$emit('upCallback'), //上拉加载的回调
          toTop: {
            //配置回到顶部按钮
            src: this.topimage.src //默认滚动到1000px显示,可配置offset修改
            //offset : 1000
          },
          lazyLoad: {
            use: true,
            attr: "imgurl", // 网络地址的属性名 (图片加载成功会移除该属性): <img imgurl='网络图  src='占位图''/>
            // showClass: '', // 图片加载成功的显示动画: 渐变显示,参见mescroll.css
            delay: 0, // 列表滚动的过程中每500ms检查一次图片是否在可视区域,如果在可视区域则加载图片
            offset: 200 // 超出可视区域200px的图片仍可触发懒加载,目的是提前加载部分图片
          }
        }
      });
    },
    downCallback() {
      this.bus.$emit('downCallback')
    },
    upCallback() {
      this.bus.$emit('upCallback')
    },
    lockDown(value) {//是否锁下拉
      this.mescroll.lockDownScroll(value)
    }
  },
  async mounted() {
    // await this.mescrollEvent()
    // this.bus.$on('endSuccess', () => { this.mescroll.endSuccess() })
    // this.bus.$on('endErr', () => { this.mescroll.endErr() })
    // let name = this.$route.name
    // this.lockDown(name === 'artical')
    // this.bus.$on('lockDown', () => { this.log('lockdown', 'artical'); this.mescroll.lockDownScroll(true) })
    // this.bus.$on('unlockDown', () => { this.mescroll.lockDownScroll(false) })
  },
}
</script>

<style lang="less" scoped>
.home {
  margin: 0 auto;
}
</style>

