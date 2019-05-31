<template>
  <header>
    <section class="top-menu">
      <div id="J_top_menu" ref="menuList" class="top-menu-list">
        <router-link
          v-for="(item, index) of $typeData"
          :key="index"
          tag="a"
          @click.native="addClass(index)"
          :class="$route.params.type == item ? 'activeClass' : ''"
          :to="`/home/index/${item}`"
        >
          <template lang="html">{{ item | formatType }}</template>
        </router-link>
      </div>
    </section>
  </header>
</template>

<script>
export default {
  data() {
    return {
      newList: [],
      scrollDivWidth: '',
      classList: [],
    }
  },
  filters: {
    formatType(val) {
      return val === '看点' ? '推荐' : val
    }
  },
  mounted() {
    // this.getNewList();
    // this.log('newList', this.$route.params)
    this.findIndex(this.$route.params.type)
  },
  watch: {//route切换tab跟踪切换
    $route(to, from) {
      window.scrollTo(0, 0)
      if (to.name === "Home") {
        let type = to.params.type
        this.findIndex(type)
      }
    }
  },
  methods: {
    findIndex(type) {//获取当前nav选中项
      this.$typeData.forEach((item, index) => {
        if (item === type) {
          this.addClass(index)
        }
      })
    },
    addClass(index) {
      document.title = this.$typeData[index];
      this.scrollDivWidth = document
        .querySelector(".top-menu-list a")
        .getBoundingClientRect().width;
      let odivW = this.scrollDivWidth / 2;
      let oNavDiv = document.querySelectorAll(".top-menu-list a");
      let oClienWidth = document.body.clientWidth / 2 || document.documentElement.clientWidth / 2;
      document.querySelector(".top-menu-list").scrollLeft = oNavDiv[index].offsetLeft - oClienWidth + odivW;
    },
    // getNewList() {
    //   this.$http.get("/news.list").then(res => {
    //     this.newList = res.data.list;
    //     let index = '';
    //     console.log(this.$route.params.type);
    //     console.log('记录类型');
    //     //console.log(this.newList)
    //     let active = this.$route.params.type;
    //     for (let ko = 0; ko < this.newList.length; ko++) {
    //       if (this.newList[ko] == "看点") {
    //         this.newList[ko] = "推荐"
    //       }
    //       let className = {
    //         active: ''
    //       }
    //       this.classList.push(className);
    //       if (this.newList[ko] == '推荐') {
    //         index = 0
    //       } else if (this.newList[ko] == active) {
    //         index = ko;
    //       }
    //     }

    //     //console.log(this.classList)
    //     //console.log(this.newList)
    //     //this.classList[index].active = 'activeClass';
    //     this.$nextTick(() => {//在修改数据之后立即使用这个方法，获取更新后的 DOM
    //       this.addClass(index);
    //     })
    //   })
    // }
  }
}
</script>

<style lang="less" scoped>
header {
  position: fixed;
  z-index: 10;
  top: 0;
  // left: 0px;
  width: 10rem;
  max-width: 750px;
  height: 35px;
  .top-menu {
    position: relative;
    height: 35px;
    background-color: #f4f5f6;
    overflow-y: hidden;
    &:after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background-image: -webkit-linear-gradient(
        top,
        transparent,
        transparent 40%,
        #ddd 0
      );
      background-size: 100% 1px;
      background-position: bottom;
      background-repeat: no-repeat;
    }
    .top-menu-list {
      overflow: hidden;
      overflow-x: scroll;
      // margin-right: 40px;
      white-space: nowrap;
      -webkit-overflow-scrolling: touch;
      a {
        font-size: 14px;
        line-height: 25px;
        display: inline-block;
        height: 25px;
        margin: 5px 0 5px 5px;
        padding: 0 10px;
        -webkit-animation: fadeout 0.4s;
        animation: fadeout 0.4s;
        vertical-align: top;
        white-space: nowrap;
        color: #999999;
        text-decoration: none;
      }
      .router-link-active {
        color: #d4221c;
        font-size: 16px;
        position: relative;
        font-weight: bold;
        // &:after {
        //   content: "";
        //   position: absolute;
        //   bottom: 0;
        //   left: 50%;
        //   width:20px;
        //   height:4px;
        //   background:rgba(212,34,28,1);
        //   border-radius:2px;
        //   height: 1px;
        //   background: #D4221C;
        //   transform: translateX(-50%);
        // }
      }
      .activeClass {
        color: #d4221c;
        font-size: 16px;
        position: relative;
        font-weight: bold;
      }
    }
  }
}
header .top-menu .top-menu-list::-webkit-scrollbar {
  display: none;
}
</style>
