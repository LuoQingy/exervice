<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template v-if="item.children&&item.children.length>1">
          <el-submenu :index="item.path" :key="item.path">
            <template slot="title">
              <!-- <i :class="item.icon"></i> -->
              <img class="img" :src="item.imgurl" alt="">
              <span slot="title">{{ item.meta.title }}</span>
            </template>
            <template v-for="subItem in item.children">
              <el-menu-item v-if="!subItem.ishide" :index="subItem.path" :key="subItem.path">{{ subItem.meta.title }}</el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else-if="item.children">
          <el-menu-item :index="item.children[0].path" :key="item.children[0].path">
            <!-- <i :class="item.children[0].icon"></i> -->
            <img class="img" :src="item.children[0].imgurl" alt="">
            <span slot="title">{{ item.children[0].meta.title}}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from "../common/bus";
import { routes } from "../../router/router";
export default {
  data() {
    return {
      collapse: false,
      items: routes
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path;
    }
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on("collapse", msg => {
      this.collapse = msg;
    });
  },
  destroyed() {
    bus.$off();
  }
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 50px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 200px;
}
.sidebar > ul {
  height: 100%;
}
.img{
  width: 20px;
  height: 20px;
  margin-right: 10px;
}
</style>
