<template>
  <div class="draggable">
    <!--左边组件列表-->
    <div class="left_list">
      <div :class="[{'active':nowIndex == item.ccId},'wholeList']" v-for="item in modelList" v-if="item" :key="item.ccId">
        <div class="list-item" @click="showList(item.ccId)">{{item.ccName}}</div>
        <div class="subContent">
          <draggable class="subList" v-model="item.component" :options="dragOption" :move="getData" @end="onEnd">
            <div
              class="select-item"
              v-for="(v,i) in item.component"
              :name="v.dragcomponentName"
              :count="v.componentMax"
              :componentid="v.componentId"
              :key="i"
            >
              <span class="item-name">
                <p>{{v.componentName}}</p>
                <p>{{v.usedNum?v.usedNum:0}}/{{v.componentMax}}</p>
              </span>
            </div>
          </draggable>
        </div>
      </div>
    </div>
    <div class="rigth">
      <div class="dragPlace">
        <dragHere @changeUsedNum="changeUsedNum"></dragHere>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import draggable from "vuedraggable";
import dragHere from "./dragHere";
import { getObjById } from "@/utils/index";
import { formdata } from "@/libs/formdata.js";
export default {
  data() {
    return {
      modelList: [],
      nowIndex: 0,
      dragOption: {
        group: {
          name: "people", //这个很重要，其他的与之能产生关联的拖拽框就靠这name 一定要一致
          pull: "clone",
          put: false
        },
        sort: false, //默然为true。这里我们只需要他拖拽，无需能拖动排序,
        animation: 150
      },
      currentDrag: {}
    };
  },
  mounted() {
    // 获取左边模块列表
    let query = this.$route.query;
    let data = formdata({
      pageId: query.pageId,
      ptId: query.pageTypeId
    });
    this.$xwhttpAuth.post("mall/getComponentList", data).then(res => {
      if (res.data.code === 10000) {
        this.modelList = res.data.resp;
        this.nowIndex = res.data.resp[0].ccId;
        this.modelList.forEach(item => {
          if (item) {
            item.component.forEach(value => {
              let id = value.componentId;
              value.dragcomponentName = getObjById(id).name;
              value.isShowEdit = true;
            });
          }
        });
      }
    });
  },
  components: {
    draggable,
    dragHere
  },
  created() {
    let query = this.$route.query;
    this.$httpAuth
      .post("mall/listPageRsComponentServiceRank", {
        pageId: query.pageId,
        pageTypeId: query.pageTypeId
      })
      .then(result => {
        if (result.data.code === 10000) {
          if (result.data.resp && result.data.resp.length === 0) {
            this.$store.commit("newDrag", {
              data: null
            });
            return;
          }
          result.data.resp.forEach((val, index) => {
            let data = {
              index: index,
              drag: val
            };
            this.$store.commit("newDrag", {
              data: data,
              newpage: true
            });
          });
        } else {
          this.$message({
            message: result.data.msg,
            type: "warning"
          });
        }
      })
      .catch(err => {});
  },
  methods: {
    showList(index) {
      this.nowIndex == index ? (this.nowIndex = "") : (this.nowIndex = index);
    },
    onEnd(evt) {
      if (evt.from !== evt.to) {
        let data = {
          index: evt.newIndex, //拖拽插入的index
          drag: this.currentDrag //需要插入的数据
        };
        console.log(evt.newIndex);
        this.$store.commit("newDrag", { data: data, newpage: false });
        this.modelList.forEach(item => {
          if (item && this.currentDrag.ccId == item.ccId) {
            item.component.forEach(ele => {
              if (this.currentDrag.componentId == ele.componentId) {
                if (ele.usedNum < ele.componentMax) {
                  ++ele.usedNum;
                } else {
                  this.$message({ type: "error", message: "已经超过使用次数" });
                  this.$store.commit("deleteThis", evt.newIndex);
                }
              }
            });
          }
        });
        this.$store.state.curIndex = evt.newIndex;
      }
    },
    // 获取拖动中的元素数据
    getData(evt) {
      this.currentDrag = evt.draggedContext.element;
      console.log("拖拽的数据", evt.draggedContext.element);
    },
    // 改变数量
    changeUsedNum(data) {
      this.modelList.forEach(item => {
        if (item && item.ccId == data.ccId) {
          item.component.forEach(ele => {
            if (data.componentId == ele.componentId) {
              ele.usedNum -= 1;
            }
          });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.draggable {
  height: 100%;
  display: flex;
  .left_list {
    width: 190px;
    border-right: 1px solid #e6e6e6;
    height: 100%;
    .wholeList {
      .list-item {
        overflow: hidden;
        border-top: 1px solid transparent;
        height: 40px;
        line-height: 39px;
        font-size: 12px;
        color: #666666;
        cursor: pointer;
        position: relative;
        padding-left: 20px;
        transition: background 0.2s;
      }
      .select-item {
        line-height: 39px;
        font-size: 12px;
        cursor: pointer;
        position: relative;
        display: inline-block;
        width: 50%;
        text-align: center;
      }
      .subContent {
        display: none;
      }
    }
    .active {
      .subContent {
        display: block;
      }
    }
  }
  .dragPlace {
    width: 375px;
    margin-top: 20px;
  }
}

.rigth {
  flex: 1;
  width: 950px;
  overflow-x: scroll;
  padding-left: 60px;
}
// .rigth::-webkit-scrollbar {
//   // width: 0;
//   height: ;
// }

.rigth::-webkit-scrollbar {
  width: 16px;
  height: 16px;
  background-color: #f5f5f5;
}

/*定义滚动条轨道 内阴影+圆角*/
.rigth::-webkit-scrollbar-track {
  width: 0;
  height: 0;
  background: #ffffff;
}

/*定义滑块 内阴影+圆角*/
.rigth::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #555;
}
</style>


