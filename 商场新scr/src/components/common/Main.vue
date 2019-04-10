<template>
  <div class="wrapper">
    <v-head></v-head>
    <v-sidebar v-if="isShowRouter"></v-sidebar>
    <div class="content-box" :class="{'content-collapse':collapse}">
      <v-tags v-if="isShowRouter"></v-tags>
      <div class="content" :class="{'pad0': !isShowRouter}">
        <transition name="move" mode="out-in">
          <keep-alive :include="tagsList">
            <router-view></router-view>
          </keep-alive>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import vHead from "./Header.vue";
import vSidebar from "./Sidebar.vue";
import vTags from "./Tags.vue";
import bus from "./bus";

export default {
  data() {
    return {
      tagsList: [],
      collapse: false,
      isShowRouter: true
    };
  },
  components: {
    vHead,
    vSidebar,
    vTags
  },
  created() {
    bus.$on("collapse", msg => {
      this.collapse = msg;
    });

    // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
    bus.$on("tags", msg => {
      let arr = [];
      for (let i = 0, len = msg.length; i < len; i++) {
        msg[i].name && arr.push(msg[i].name);
      }
      this.tagsList = arr;
    });
  },
  methods: {},
  destroyed(){
    bus.$off();
  }
};
</script>
<style lang="less" scoped>
.main {
  display: flex;
  height: 100%;
  overflow: hidden;
  .content-box {
    flex: 1;
  }
  .pad0 {
    padding: 0;
  }
}
.content {
  width: auto;
  height: 100%;
  padding: 10px 10px 30px;
  overflow-y: scroll;
  box-sizing: border-box;
  .content_title {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #ccc;
  }
}
  .content::-webkit-scrollbar {
    width: 12px;
    height: 12px;
    background-color: #f5f5f5;
  }
  /*定义滚动条轨道 内阴影+圆角*/
  .content::-webkit-scrollbar-track {
    width: 0;
    height: 0;
    background: #ffffff;
  }

  /*定义滑块 内阴影+圆角*/
  .content::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #555;
  }
</style>
