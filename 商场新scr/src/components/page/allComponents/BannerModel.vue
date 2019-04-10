<template>
  <div :class="[{'active':index == curIndex},{'margin_bottom':dataJson.hideBlank !== true},'bannerContent']">
    <div class="body_view picContent" @click="getIndex">
      <el-carousel class="slider" height="134px">
        <el-carousel-item class="imgItem" v-for="(v,i) in swiperImg" :key="i">
          <img :src="v.srcImg" alt>
        </el-carousel-item>
      </el-carousel>
    </div>
    <edit-btn :index="index" @changeUsedNum="changeUsedNum">
      <bannerModelEdit  :index="index"></bannerModelEdit>
    </edit-btn>
  </div>
</template>
<script>
import { mapState, mapMutations, mapGetters } from "vuex";
import BannerModelEdit from "./BannerModel_edit";
import EditBtn from "./EditBtn";
export default {
  props: {
    index: {
      type: Number
    }
  },
  data() {
    return {
      dataJson: {}
    };
  },
  computed: {
    ...mapState(["dragContent"]),
    ...mapGetters({
      curIndex: "getCurIndex",
      dragContent: "getDragContent"
    }),
    swiperImg() {
      this.dataJson = this.dragContent[this.index].dataJson;
      return this.dragContent[this.index].dataJson.swiperImg;
    }
  },
  components: {
    BannerModelEdit,
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
.bannerContent {
  position: relative;
  height: 134px;
  border-color: #f7f7f9 #f7f7f9 transparent #f7f7f9;
  .picContent {
    .slider {
      .imgItem {
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .modelName {
    position: absolute;
    top: 0;
    right: -40px;
    width: 20px;
    padding: 10px 4px;
    color: #a2a2a2;
    line-height: 1.1em;
    background: #fff;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    border-radius: 6px;
  }
  .editPanel {
    position: absolute;
    top: 0;
    right: -40px;
    padding: 10px 0;
    width: 28px;
    // border: 1px solid #e6e6e6;
    background: #fff;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    border-radius: 0;
    div {
      padding: 7px 5px;
      font-size: 0;
      background-color: #fff;
      color: #999999;

      text-align: center;
      &.active {
        color: #3089dc;
      }
    }
    .iconfont {
      cursor: pointer;
      &:hover {
        color: #3089dc;
      }
    }
    .notAllow {
      color: #ddd;
      cursor: not-allowed;
      &:hover {
        color: #ddd;
      }
    }
    .bannerEdit {
      position: absolute;
      top: 0;
      right: -350px;
      padding: 0 15px 10px;
      background-color: #fff;
      // display: flex;
      flex-direction: column;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
      width: 330px;
      // height: 100px;
      color: #000;
      font-size: 1em;
      box-sizing: border-box !important;
      text-align: left;
    }
  }
}
.active {
  border: 2px solid #3089dc;
}
.margin_bottom{
    margin-bottom: 15px;
}
</style>


