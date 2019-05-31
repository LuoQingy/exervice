<template>
  <div class="editContainer">
    <!-- 文字提示 不展示编辑框时-->
    <div class="modelName" v-show="index !== curIndex">{{dragContent[index].component.componentName}}</div>
    <!-- 功能提示 展示编辑宽 -->
    <div class="editPanel" v-show="index === curIndex">
      <div :class="[{'active':dragContent[index].isShowEdit},'edit']">
        <i class="iconfont icon-setting" @click.stop="showEdit(index)"></i>
      </div>
      <div class="up">
        <i @click.stop="goUp" :class="[{'notAllow':index == 0},'iconfont','icon-arrowup']"></i>
      </div>
      <div class="down">
        <i @click.stop="goDown"
           :class="[{'notAllow':index == dragContent.length-1},'iconfont','icon-arrowdown']"></i>
      </div>
      <!-- 删除选择的组件 -->
      <div class="delete">
        <i @click.stop="deleteThis" class="iconfont icon-trash"></i>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    name: "editBtn",
    props: {
      index: {
        type: Number
      }
    },
    created() {
    },
    methods: {
      ...mapMutations([
        'changeCurIndex'
      ]),
      getIndex() {
        this.index !== this.curIndex ?
          this.changeCurIndex(this.index) :
          this.changeCurIndex(undefined)
      },
      showEdit() {
        this.$store.state.dragContent[this.index].isShowEdit = !this.$store.state.dragContent[this.index].isShowEdit;
      },
      goUp() {
        this.$store.commit('goUp', this.index);
      },
      goDown() {
        this.$store.commit('goDown', this.index);
      },
      deleteThis() {
        console.log(this.$store.state.dragContent)
        let data = {
          ccId: this.$store.state.dragContent[this.index].component.ccId,
          componentId: this.$store.state.dragContent[this.index].component.componentId
        }
        this.$emit('changeUsedNum', data);
        this.$store.commit('deleteThis', this.index);
      },
    },
    computed: {
      ...mapGetters({
        curIndex: 'getCurIndex',
        dragContent: 'getDragContent'
      })
    }
  }
</script>

<style lang="less" scoped>
  .modelName {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: -40px;
    width: 20px;
    padding: 10px 4px;
    color: #A2A2A2;
    line-height: 1.1em;
    // border: 1px solid #e6e6e6;
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
        color: #3089DC;
      }
    }
    .iconfont {
      cursor: pointer;
      &:hover {
        color: #3089DC;
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
</style>
