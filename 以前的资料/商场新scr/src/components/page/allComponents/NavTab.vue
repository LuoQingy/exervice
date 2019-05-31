<template>
  <div :class="[{'active':index == curIndex},{'margin_bottom':dataJson.hideBlank !== true},'navContent']">
    <div class="navTab" @click="getIndex">
      <ul class="nav_lists">
        <template v-for="item in navList">
          <li class="list">
            <img :src="item.navImg" alt>
            <p>{{item.navTitle}}</p>
          </li>
        </template>
      </ul>
    </div>
    <edit-btn :index="index" @changeUsedNum="changeUsedNum">
      <NavTabEdit :index="index"></NavTabEdit>
    </edit-btn>
  </div>
</template>
<script>
import { mapState, mapMutations, mapGetters } from "vuex";
import NavTabEdit from "./NavTab_edit";
import EditBtn from "./EditBtn";
export default {
  props: {
    index: {
      type: Number
    }
  },
  data() {
    return {
      dataJson:{}
    };
  },
  computed: {
    ...mapState(["dragContent"]),
    ...mapGetters({
      curIndex: "getCurIndex",
      dragContent: "getDragContent"
    }),
    navList() {
      this.dataJson = this.dragContent[this.index].dataJson;
      return this.dragContent[this.index].dataJson.navList;
    }
  },
  components: {
    NavTabEdit,
    EditBtn
  },
  methods: {
    // prevent(){},
    ...mapMutations(["changeCurIndex"]),
    getIndex() {
      this.index !== this.curIndex
        ? this.changeCurIndex(this.index)
        : this.changeCurIndex(undefined);
    },
    changeUsedNum(data) {
      this.$emit("changeUsedNum", data);
    }
  }
};
</script>
<style lang="less" scoped>
.nav_lists {
  background: #ffffff;
  display: flex;
  flex-wrap: wrap;
  padding: 10px 0;
  .list {
    width: 20%;
    text-align: center;
    font-size: 10px;
    color: #cccccc;
    margin-bottom: 10px;
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
  }
}
.navContent {
  position: relative;
}
.margin_bottom{
  margin-bottom: 15px;
}
.active {
  border: 2px solid #3089dc;
}
</style>
