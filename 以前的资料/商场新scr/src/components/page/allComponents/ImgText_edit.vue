<template>
  <div class="img_text_edit bannerEdit">
    <div class="head">
      <p>{{dragContent[index].component.componentName}}</p>
      <div class="hidePanel">
        <i class="iconfont icon-close" @click="hideEdit"></i>
      </div>
    </div>
    <div class="content">
      <div class="tips">
        <p class="tipTitle">
          <span class="title">图片</span>
          <span class="tipRequired">*</span>
        </p>
        <p class="tipContent">建议图片宽度750,高度350，支持类型:jpg、png。</p>
      </div>
      <!--上传按钮-->
      <div class="upload_btn">
        <div class="avatar-uploader uploader" @mouseenter="showUploaderBtn = true" @mouseleave="showUploaderBtn = false">
          <div class="loadingContent" v-show="isShowLoading">
            <div class="loading">
              <i class="el-icon-loading"></i>
            </div>
          </div>
          <div v-if="!showUploaderBtn && !dataJson.imgUrl">
            <i class="el-icon-plus avatar-uploader-icon"></i>
            <span class="avatar-uploader-span">添加图片</span>
          </div>
          <div v-if="!showUploaderBtn && dataJson.imgUrl">
            <img :src="dataJson.imgUrl" class="avatar">
          </div>
          <div v-show="showUploaderBtn" class="uploader_btn">
            <el-upload
              class
              :auto-upload="false"
              :action="actionUrl"
              :show-file-list="false"
              :on-change="changeImg"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <el-button v-show="!dataJson.imgUrl" size="mini" plain>上传图片</el-button>
              <el-button v-show="dataJson.imgUrl" size="mini" plain>替换图片</el-button>
            </el-upload>
          </div>
        </div>
      </div>
      <div ondragstart="return false;">
        <div class="input_group">
          <p>文本内容</p>
          <div>
            <el-input placeholder="请输入文本" ref="textContent" type="text" size="mini" maxlength="19" v-model="dataJson.textContent">
              <span slot="suffix" class="el-input__icon">{{dataJson.textContent.length}}/19</span>
            </el-input>
          </div>
        </div>
        <div class="input_group">
          <p>链接</p>
          <div>
            <span class="linkContent">
              <el-input type="text" style="width:100%;" clearable placeholder="请输入合法的无线连接" v-model="dataJson.url"></el-input>
              <i class="iconfont icon-link" @click="showPop"></i>
            </span>
          </div>
        </div>
      </div>
      <!--隐藏下方空白-->
      <div class="whiteSpace">
        <label>
          <span class="iconfont">
            <span class="boxChecked">
              <i class="iconfont icon-check" v-show="dataJson.hideBlank"></i>
            </span>
            <input type="checkbox" v-model="dataJson.hideBlank" class="checkbox" style="display:none">
          </span>
          <span class="checkboxLabel">隐藏模块下方的间隙</span>
        </label>
      </div>
    </div>
    <search-pop :index="index" v-show="isShowPop" @closePop="closePop" @confirmSelect="confirmSelect"></search-pop>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import SearchPop from "./SearchPop";
import { uploadPic } from "../../../utils/index";
export default {
  name: "ImgText_edit",
  props: {
    index: {
      type: Number,
      required: false
    }
  },
  components: {
    SearchPop
  },
  data() {
    return {
      imageUrl: "",
      actionUrl: `${this.$api._baseUrl}/uploadImage`,
      showUploaderBtn: false,
      isShowPop: false,
      isShowLoading: false, // 是否显示加载动画
      data: { role: 1 },
      headers: {
        AuthToken: localStorage.getItem("token")
      }
    };
  },
  created() {},
  computed: {
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
    // 更换上传图片
    changeImg(file, fileList) {
      this.isShowLoading = true;
      uploadPic(this.actionUrl, file.raw, res => {
        this.$store.state.dragContent[this.index].dataJson.imgUrl = res;
        this.isShowLoading = false;
      });
    },
    // 显示搜索框
    showPop() {
      this.isShowPop = true;
    },
    //确认选择商品或者分类
    confirmSelect(goodLink) {
      this.$store.state.dragContent[this.index].dataJson.url = goodLink;
      this.closePop();
    },
    // 关闭搜索框
    closePop() {
      this.isShowPop = false;
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return false;
    },
    hideEdit() {
      this.changeCurIndex("");
    }
  }
};
</script>

<style lang="less" scoped>
.active {
  border-color: #3089dc;
}
.linkContent {
  width: 100%;
  box-sizing: border-box;
  position: relative;
  padding-right: 25px;
  display: inline-table;
  border-collapse: separate;
  overflow: visible;
  border-spacing: 0;
  background-color: #ffffff;
  transition: all 0.3s ease-out;
  i.icon-link {
    position: absolute;
    top: 5px;
    bottom: 0;
    right: 5px;
    color: #666;
    &:hover {
      color: #3089dc;
    }
  }
  i.icon-close {
    display: inline-block;
    width: 10px;
    height: 10px;
    padding: 2px;
    position: absolute;
    top: 6px;
    right: 25px;
    background: #ccc;
    border-radius: 50%;
    font-size: 10px;
    color: #fff;
  }
}
.img_text_edit {
  .head {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 49px;
    border-bottom: 1px solid #ccc;
    p {
      color: #999999;
      flex: 1;
    }
    i {
      color: #999999;
    }
  }
  .content {
    margin: 15px 0;
    .tips {
      .tipTitle {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 6px;
        .title {
          color: #999;
          font-size: 12px;
          line-height: 12px;
          margin-bottom: 0;
        }
        .tipRequired {
          color: red;
          margin: 0 5px;
        }
      }
      .tipContent {
        color: #a2a2a2;
        font-size: 12px;
        line-height: 16px;
        margin-bottom: 10px;
      }
    }
    .upload_btn {
      display: flex;
      justify-content: center;
      margin-bottom: 10px;
      .avatar-uploader {
        width: 100%;
        text-align: center;
        background: #ccc;
        border: 1px dashed #d9d9d9 !important;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      .avatar-uploader:hover {
        border-color: #409eff;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        vertical-align: middle;
        line-height: 175px;
        text-align: center;
      }
      .avatar-uploader-span {
        vertical-align: middle;
        font-size: 14px;
      }
      .avatar {
        width: 100%;
        height: 175px;
        display: block;
      }

      .uploader_btn {
        height: 175px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .loadingContent {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: rgba(200, 200, 200, 0.5);
        .loading {
          margin: 18px 0 0 0;
        }
      }
    }
    .input_group {
      margin-bottom: 5px;
      .icon-link {
        &:hover {
          color: #3089dc;
        }
      }
      .icon-close {
        background: #ccc;
        border-radius: 50%;
        color: #fff;
      }
      p {
        font-size: 12px;
        color: #ccc;
        margin-bottom: 5px;
      }
    }
    .whiteSpace {
      margin: 15px 0;
      .iconfont {
        display: inline-block;
        vertical-align: middle;
        position: relative;
        width: 14px;
        height: 14px;
        line-height: 12px;
        .boxChecked {
          display: inline-block;
          width: 12px;
          height: 12px;
          background: #ffffff;
          border-radius: 2px;
          border: 1px solid #999999;
          transition: ease all 0.3s 0s;
          &:hover {
            border-color: #3089dc;
            background-color: #f1f7fe;
          }
          i {
            font-size: 12px;
            color: #3089dc;
            // opacity: 0;
          }
        }
      }
      .checkboxLabel {
        margin-top: 2px;
        font-size: 12px;
        color: #666;
      }
    }
    .editorFooter {
      padding-top: 10px;
      border-top: 1px solid #ccc;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .saveBtn {
        margin: 0 10px 0;
        color: #333333;
        border-color: #333333;
        text-decoration: none;
        outline: 0;
        height: 28px;
        padding: 0 16px;
        font-size: 12px;
        line-height: 26px;
        border-width: 1px;
        border-style: solid;
        position: relative;
        display: inline-block;
        background: transparent;
        transition: all 0.3s ease-out;
        cursor: pointer;
        box-shadow: none;
        border-radius: 2px;
        text-align: center;
        &:hover {
          background-color: #e6e6e6;
        }
      }
    }
  }
}
</style>
