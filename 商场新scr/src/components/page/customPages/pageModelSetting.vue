<template>
  <div class="box">
    <div class="head">
      <div class="head_right">
        <span class="bar"></span>
        <el-button class="txt" @click="updatePage" type="text">保存</el-button>
        <span class="bar"></span>
        <el-button class="txt" @click="setPage" type="text">启用</el-button>
      </div>
    </div>
    <div class="content">
      <div class="right_content">
        <model-view></model-view>
      </div>
    </div>
  </div>
</template>
<script>
import modelView from "./modelView";
import { mapState } from "vuex";
import bus from "@/components/common/bus.js";
export default {
  components: {
    modelView
  },
  computed: {
    ...mapState(["dragContent", "curIndex"])
  },
  methods: {
    // 保存页面详情
    updatePage() {
      let data = [];
      this.dragContent.forEach((value, index) => {
        if (value.component.componentId == 14) {
          let anIdList = [];
          !value.dataJson.isAuto&&value.dataJson.anIdList.forEach(val => {
            anIdList.push(val.annId);
          });
          let json = {
            imgUrl: value.dataJson.imgUrl,
            isAuto: value.dataJson.isAuto, //是否开启公告自动获取
            anIdList: anIdList,
            hideBlank: value.dataJson.hideBlank //是否隐藏下方间隙
          };
          data.push({
            cId: value.component.componentId,
            data: JSON.stringify(json)
          });
        } else {
          data.push({
            cId: value.component.componentId,
            data: JSON.stringify(value.dataJson)
          });
        }
      });
      this.$httpAuth
        .post("mall/updatePageRsComponentByPageId", {
          pageId: this.$route.query.pageId,
          rank: data
        })
        .then(result => {
          if (result.data.code === 10000) {
            this.$message({
              message: result.data.resp,
              type: "success"
            });
            this.close();
          }
        })
        .catch(err => {});
    },
    // 开启页面
    setPage() {
      this.$httpAuth
        .post("mall/setUsePage", {
          pageId: this.$route.query.pageId,
          pageTypeId: this.$route.query.pageTypeId
        })
        .then(res => {
          if (res.data.code === 10000) {
            this.$message({
              type: "success",
              message: res.data.resp
            });
            this.close();
          }
        });
    },
    close(){
      bus.$emit("closetags");
      this.$router.push("/content/renovation");
    }
  }
};
</script>
<style lang="less" scoped>
.box {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 30px;
}
.head {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 50px;
  padding: 5px 0;
  border: 1px solid #e6e6e6;
  background: #fff;
  .head_left {
    margin-left: 10px;
    color: #999999;
    .select {
      cursor: pointer;
    }
  }
  .head_right {
    height: 100%;
    display: flex;
    align-items: center;
    color: #999999;
    .txt {
      display: flex;
      align-items: center;
      padding: 0 30px;
      height: 100%;
      cursor: pointer;
    }
    .bar {
      display: block;
      height: 100%;
      width: 2px;
      background: #ccc;
    }
  }
}

.content {
  width: 100%;
  flex: 1;
  display: flex;
  .page_decoration {
    display: flex;
    .left_select {
      width: 80px;
      position: fixed;
      top: 62px;
      bottom: 0;
      padding: 50px 20px 0;
      border-right: 1px solid #cccccc;
      display: flex;
      justify-content: flex-start;
      flex-direction: column;
      align-items: center;
      .left_item {
        text-align: center;
        cursor: pointer;
        p {
          margin: 15px 0;
        }
        .item_img {
          width: 50px;
          height: 50px;
          border: 1px solid red;
        }
      }
      .bar {
        height: 2px;
        width: 80%;
        margin: 20px 0 30px;
        background: #ccc;
      }
    }
  }
  .right_content {
    width: 100%;
    height: 100%;
  }
}
</style>


