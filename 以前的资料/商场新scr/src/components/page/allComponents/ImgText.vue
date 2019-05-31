<template>
  <div :class="['img_text',{'margin_bottom':dataJson.hideBlank !== true}, {'active':index == curIndex}]">
    <div class="body_view" @click="getIndex">
      <img class="img" :src="dataJson.imgUrl" alt>
      <div class="text">
        <span>{{dataJson.textContent}}</span>
      </div>
    </div>
    <edit-btn :index="index" @changeUsedNum="changeUsedNum">
      <img-text-edit :index="index"></img-text-edit>
    </edit-btn>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";
import EditBtn from "./EditBtn";
import ImgTextEdit from "./ImgText_edit";

export default {
  name: "imgText",
  components: { EditBtn, ImgTextEdit },
  props: {
    index: {
      type: Number
    }
  },
  data() {
    return {
      // dataJson: {}
    };
  },
  created() {},
  computed: {
    // ...mapState(['dragContent']),
    ...mapGetters({
      curIndex: "getCurIndex",
      dragContent: "getDragContent"
    }),
    dataJson() {
      return this.dragContent[this.index].dataJson;
    }
  },
  methods: {
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
.img_text {
  position: relative;
  height: 171px;
  background: #f2f2f2;
  border-color: #f7f7f9 #f7f7f9 transparent #f7f7f9;
  .img {
    display: block;
    width: 100%;
    height: 171px;
  }
  .text {
    display: flex;
    height: 14px;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    padding: 5px 0;
    color: #fff;
  }
}
.margin_bottom {
  margin-bottom: 15px;
}
.active {
  border: 2px solid #3089dc;
}
</style>
