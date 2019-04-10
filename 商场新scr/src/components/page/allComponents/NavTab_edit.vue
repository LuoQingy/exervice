<template>
  <div class="bannerEdit">
    <div class="head">
      <!-- 编辑框头部 -->
      <p>{{dragContent[index].component.componentName}}</p>
      <div class="hidePanel">
        <i class="iconfont icon-close" @click="hideEdit"></i>
      </div>
    </div>
    <div class="content">
      <div class="tips">
        <p class="tipTitle">
          <span class="title">上传图片</span>
          <span class="tipRequired">*</span>
        </p>
        <p class="tipContent">建议图片宽度120,高度120，支持类型:jpg、png。要求一组内的图片高度必须完全一致。</p>
      </div>
      <div class="picContent">
        <!--  -->
        <div class="picItem" :index="i" v-for="(v,i) in saveContent" :key="i">
          <!-- 上下排序 -->
          <div class="itemMove">
            <div class="up">
              <i :class="[{'notAllow':i == 0},'iconfont','icon-arrowup']" @click="toUp(i)"></i>
            </div>
            <div class="down">
              <i :class="[{'notAllow':i == saveContent.length-1},'iconfont','icon-arrowdown']" @click="toDown(i)"></i>
            </div>
          </div>
          <!-- 上传 -->
          <div class="addPic">
            <div :class="['add',{'alert':v.imgRequired}]" @mouseover="mouseover(i)" @mouseout="mouseout(i)">
              <img :class="'showPic'+i" :src="v.navImg" ref="uploadPic" v-show="v.navImg">
              <div class="hoverContent" v-if="v.showAdd">
                <span class="upload" @click="addPic(i)">替换图片</span>
              </div>
              <div class="loadingContent" v-show="isShowLoading&&i==nowUpload">
                <div class="loading">
                  <i class="el-icon-loading"></i>
                </div>
              </div>
            </div>
            <div class="picLink">
              <span class="linkContent" style="padding:0;">
                <el-input class="link text" type="text" size="mini" clearable placeholder="请输入合法的无线连接" v-model="v.navUrl"></el-input>
                <!-- <i class="iconfont icon-link" @click="showPop(i)"></i> -->
              </span>
              <span class="linkContent" style="padding:0;">
                <el-input class="link text" type="text" size="mini"  placeholder="请输入导航标题" v-model="v.navTitle"></el-input>
              </span>
            </div>
          </div>
          <div class="deletePic" @click="deleteThis(i)">
            <i :class="[{'notAllow': saveContent.length == 1},'iconfont','icon-trash']"></i>
          </div>
        </div>
        <div class="panelAdd" @click="addContent">
          <i class="iconfont icon-i-add"></i>
          添加 {{saveContent.length}} / {{maxPicContainer}}
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
    <input type="file" accept="image/*" @change="picUpload" ref="file">
    <search-pop :index="index" v-show="isShowPop" @closePop="closePop" @confirmSelect="confirmSelect">
    </search-pop>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import SearchPop from "./SearchPop";
import { formdata } from "@/libs/formdata.js";
export default {
  components: {
    SearchPop
  },
  props: {
    index: {
      type: Number,
      required: false
    }
  },
  data() {
    return {
      picSrc: [],
      defaultImg:
        "https://img.alicdn.com/simba/img/TB1nJqZCk9WBuNjSspeSuuz5VXa.jpg",
      isShowLoading: false, //加载动画
      nowUpload: 0, //当前进行图片上传的位置
      isShowPop: false,
      dataJson:{},
      isShowGoodList: false,
      selectGoodIndex: 0, //选择的商品索引
      goodLink: "", //跳转链接
      popIndex: 0, //当前选择轮播图
      linkPlaceholder: "输入商品ID或者商品名称",
      maxPicContainer: 10
    };
  },
  computed: {
    ...mapState(["dragContent", "curIndex"]),
    saveContent() {
      this.dataJson = this.dragContent[this.index].dataJson;
      this.picSrc = this.dragContent[this.index].dataJson.navList;
      return this.picSrc;
    }
  },
  methods: {
   ...mapMutations(['changeCurIndex']),
    //鼠标移入
    mouseover(i) {
      let data = {
        pIndex: this.index,
        index: i,
        key: "navList"
      };
      this.$store.commit("mouseover", data);
    },
    //鼠标移出
    mouseout(i) {
      let data = {
        pIndex: this.index,
        index: i,
        key: "navList"
      };
      this.$store.commit("mouseout", data);
    },
    //上传图片触发
    addPic(i) {
      this.nowUpload = i;
      this.$refs.file.click();
    },
    //图片上传
    picUpload() {
      this.isShowLoading = true;
      this.uploadPic(this.$refs.file.files[0], data => {
        let index = this.nowUpload;
        this.picSrc[index].navImg = data;
        this.picSrc[index].imgRequired = false;
        let pData = {
          pIndex: this.index,
          index: index,
          swiperImg: this.picSrc
        };
        this.isShowLoading = false;
      });
    },
    //调用图片上传接口
    uploadPic(fileData, callback) {
      let _this = this;
      let role = 1;
      let data = formdata({ role: role, file: fileData });
      let header = {
        AuthToken: localStorage.getItem("token")
      };
      let xhr;
      if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
      } else {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
      }
      xhr.open("POST", this.$api._baseUrl + "/uploadImage", true);
      xhr.setRequestHeader("AuthToken", localStorage.getItem("token"));
      xhr.send(data); //data
      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 304) {
            callback(JSON.parse(xhr.responseText).resp);
        } else {
          _this.$message({ message: "图片上传出错！", type: "error" });
          _this.isShowLoading = false;
        }
      };
    },
    //显示商品或类别选择弹窗
    showPop(i) {
      this.popIndex = i;
      this.isShowPop = true;
    },
    closePop() {
      this.isShowPop = false;
    },
    //确认选择商品或者分类
    confirmSelect(goodLink) {
      this.picSrc[this.popIndex].navUrl = goodLink;
      this.closePop();
    },
    //增加图片容器
    addContent() {
      if (this.picSrc.length < this.maxPicContainer) {
        this.picSrc.push({
          navImg: this.defaultImg,
          navUrl: "www.baidu.com",
          navTitle: "新建"
        });
      } else {
        this.$message({
          type: "error",
          message: "最多只能有" + this.maxPicContainer + "张图片！"
        });
      }
    },
    //容器上移
    toUp(index) {
      let data = {
        pIndex: this.index,
        index: index,
        type: "navList"
      };
      this.$store.commit("bannerToUp", data);
    },
    //容器下移
    toDown(index) {
      let data = {
        pIndex: this.index,
        index: index,
        type: "navList"
      };
      this.$store.commit("bannerToDown", data);
    },
    //删除容器
    deleteThis(index) {
      this.picSrc.splice(index, 1);
    },
    //关闭编辑窗口
    hideEdit() {
      this.changeCurIndex('');
    }
  }
};
</script>
<style lang="less" scoped>
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
  .picContent {
    .picItem {
      display: flex;
      flex-direction: row;
      margin-bottom: 10px;
      background-color: #f9f9f9;
      .itemMove {
        width: 25px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        cursor: pointer;
        i {
          color: #999;
          font-size: 12px;
          margin: 8px 0;
        }
      }
      .addPic {
        flex: 1;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        .add {
          width: 80px;
          height: 70px;
          position: relative;
          background: #f4f4f4;
          position: relative;
          text-align: center;
          border: 1px solid #f4f4f4;
          margin-right: 5px;
          display: flex;
          align-items: center;
          cursor: pointer;
          &.alert {
            border-color: red;
          }
          .addicon {
            display: inline-block;
            width: 100%;
            height: 100%;
            line-height: 70px;
            text-align: center;
          }
          img[class*="showPic"] {
            max-width: 100%;
            max-height: 100%;
            margin: 0 auto;
          }
          .hoverContent {
            flex-direction: row;
            align-items: center;
            position: absolute;
            top: 0;
            left: 73px;
            width: 205px;
            height: 100%;
            background-color: #f9f9f9;
            text-align: center;
            z-index: 1;
            .upload {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 80px;
              height: 30px;
              margin: 9px auto;
              background-color: #fff;
              border: 1px solid #666;
              border-radius: 2px;
              font-size: 12px;
              color: #333;
            }
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
        .picLink {
          // width: 170px;
          position: relative;
          display: flex;
          flex-direction: column;
          .linkContent {
            position: relative;
            padding-right: 25px;
            display: inline-table;
            border-collapse: separate;
            overflow: visible;
            border-spacing: 0;
            background-color: #ffffff;
            transition: all 0.3s ease-out;
            .link {
              display: table-cell;
              outline: none;
              font-size: 12px;
              color: #999;
              height: 20px;
              line-height: 20px;
              margin: 0;
            }
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
        }
      }
      .deletePic {
        color: #999;
        width: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        i {
          font-size: 16px;
        }
      }
    }
    .panelAdd {
      margin-top: 16px;
      display: flex;
      width: 100%;
      height: 40px;
      line-height: 40px;
      justify-content: center;
      background-color: #f4f4f4;
      color: #666;
      font-size: 12px;
      cursor: pointer;
      i {
        display: inline;
        font-size: 12px;
        padding-right: 5px;
      }
    }
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

i.notAllow {
  color: #ddd !important;
  cursor: not-allowed;
}

input[type="file"] {
  display: none;
}

input[type="radio"] {
  vertical-align: middle;
  margin-right: 3px;
}

.rrg-pop .checkGood {
  width: 600px;
  .popTitle {
    display: flex;
    justify-content: space-between;
    padding-left: 10px;
    label {
      height: 100%;
      line-height: 38px;
    }
  }
  .picBoc {
    width: 570px;
    height: 256px;
    margin: 14px;
    border: 1px solid #bebebe;
    input {
      border-bottom: 1px solid #bebebe;
      height: 39px;
      padding: 0 5px;
      width: 419px;
    }
    .search {
      width: 106px;
      line-height: 18px;
      float: right;
    }
    .main {
      width: 100%;
      ul {
        overflow: auto;
        height: 215px;
        li {
          line-height: 30px;
          color: #666;
          span:first-child {
            overflow: hidden;
            padding: 0 8px;
            line-height: 40px;
            cursor: pointer;
            &:hover {
              background: #f1f1f1;
            }
            & + span::before {
              content: "》";
            }
          }
          &.active {
            color: #fff;
            background: #a2ceeb;
          }
        }
      }
      .loading {
        padding: 30px 0;
        text-align: center;
        color: #ccc;
        i {
          display: block;
          font-size: 30px;
          color: #ccc;
        }
      }
    }
  }
  .curentSelect {
    margin: 0 0 0 15px;
    height: 30px;
    span {
      font-size: 14px;
      color: #333333;
      line-height: 30px;
      b {
        color: #d15b47;
        & + b:before {
          content: "》";
          margin-left: 5px;
        }
      }
    }
  }
}
</style>
