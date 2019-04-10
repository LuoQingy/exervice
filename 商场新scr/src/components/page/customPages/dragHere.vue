<template>
  <!--中间的视图-->
  <div class="dragPanel">
    <draggable :options="dragOption_2" class="app-sort item">
      <div class="" v-for="(item,index) in getDragContent" :key="index">
        <div v-if="item.cId" :is="item.cId | getCom" :index="index" @changeUsedNum="changeUsedNum">
        </div>
        <div v-else="item.componentId" :is="item.componentId | getCom" :index="index" @changeUsedNum="changeUsedNum">
        </div>
      </div>
    </draggable>
  </div>
</template>
<script>
import { mapState, mapMutations, mapGetters } from "vuex";
import draggable from "vuedraggable";
import BannerModel from "../allComponents/BannerModel";
import ImgText from "../allComponents/ImgText";
import NoticeMent from "../allComponents/NoticeMent";
import NavTab from "../allComponents/NavTab";
import { getObjById } from "@/utils/index";
// import VTitle from '../allComponents/VTitle'
export default {
  data() {
    return {
      dragOption_2: {
        group: {
          name: "people", //这个很重要，其他的与之能产生关联的拖拽框就靠这name 一定要一致
          pull: false,
          put: true
        },
        sort: false,
        animation: 150,
        filter: ".body_view"
        // draggable:'.item'
        // ghostClass: "ghost"
      }
    };
  },
  components: {
    draggable,
    BannerModel,
    ImgText,
    NoticeMent,
    NavTab
  },
  computed: {
    // ...mapState(['dragContent','curIndex']),
    ...mapGetters({
      getDragContent: "getDragContent",
      curIndex: "getCurIndex"
    })
  },
  methods: {
    ...mapMutations(["sortCp", "addCp"]),
    changeUsedNum(data) {
      this.$emit("changeUsedNum", data);
    },
    ...mapMutations(["changeCurIndex"]),
    getIndex() {
      this.index !== this.curIndex
        ? this.changeCurIndex(this.index)
        : this.changeCurIndex(undefined);
    }
  },
  filters: {
    getCom(val) {
      // 获取组件名字 对应 components注册的组件
      return getObjById(val).name;
    }
  }
};
</script>
<style lang="less" scoped>
@import url("http://at.alicdn.com/t/font_841014_xtn0hsu7p8.css");
.dragPanel {
  width: 100%;
  text-align: center;
  .app-sort {
    width: 100%;
    min-height: 100px;
    border: 1px solid #e6e6e6;
  }
}
</style>
