<template>
  <div class="notice_ment_edit bannerEdit">
    <div class="head">
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
        <p class="tipContent">建议图片宽度60,高度60，支持类型:jpg、png。</p>
      </div>
      <!--上传和预览图片-->
      <div class="picContent upload_img">
        <div class="left_icon">
          <i class="iconfont icon-i-add" v-if="!dataJson.imgUrl"></i>
          <img :src="dataJson.imgUrl" v-if="dataJson.imgUrl">
        </div>
        <div class="upload_btn">
          <el-button size="small" plain @click="addPic">{{dataJson.imgUrl? '替换' : '上传'}}图片</el-button>
        </div>
      </div>
      <!--上传和预览图片end-->
      <div class="isauto">
        <el-radio-group v-model="isauto" @change="isautoChange">
          <el-radio :label="1">自动添加</el-radio>
          <el-radio :label="2">手动添加</el-radio>
        </el-radio-group>
      </div>
      <!--手动选择的选项-->
      <div class="picContent">
        <div class="tips">
          <p class="tipTitle">
            <span class="title">选择轮播公告</span>
            <span class="tipRequired">*</span>
          </p>
          <p class="tipContent">公告内容每5秒跳动一次</p>
        </div>
        <div class="picContent">
          <!--  -->
          <div class="picItem" :index="i" v-for="(v,i) in dataJson.anIdList" :key="i">
            <div class="itemMove">
              <div class="up">
                <i :class="[{'notAllow':i == 0},'iconfont','icon-arrowup']" @click="toUp(i)"></i>
              </div>
              <div class="down">
                <i :class="[{'notAllow':i == dataJson.anIdList.length-1},'iconfont','icon-arrowdown']" @click="toDown(i)"></i>
              </div>
            </div>
            <div class="addPic">
              <div class="picLink">
                <span class="linkContent">
                  <el-input size="mini" readonly type="text" placeholder="请输入合法的无线连接" v-model="v.annUrl"></el-input>
                  <i class="iconfont icon-link" v-show="isauto===2" @click="showPop(i)"></i>
                </span>
              </div>
            </div>
            <div class="deletePic" @click="deleteThis(i)">
              <i :class="[{'notAllow': dataJson.anIdList.length == 1},'iconfont','icon-trash']"></i>
            </div>
          </div>
          <div class="panelAdd" @click="addContent" v-show="isauto===2">
            <i class="iconfont icon-i-add"></i>
            添加 {{dataJson.anIdList.length}} / {{maxPicContainer}}
          </div>
        </div>
        <!--手动选择的选项end-->
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
    <search-pop :index="index" :isnotice="isnotice" v-show="isShowPop" @closePop="closePop" @confirmSelect="confirmSelect"></search-pop>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { formdata } from "@/libs/formdata.js";
import SearchPop from "./SearchPop";
export default {
  name: "NoticeMent_edit",
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
      isnotice: true,
      isauto: 1,
      maxPicContainer: 6,
      isShowPop: false,
      popIndex: "",
      picSrc: {}
    };
  },
  computed: {
    ...mapGetters({
      curIndex: "getCurIndex",
      dragContent: "getDragContent"
    }),
    dataJson() {
      this.picSrc = this.dragContent[this.index].dataJson;
      this.isauto = this.picSrc.isAuto?1:2;
      return this.picSrc;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.picSrc.anIdList.forEach(val => {
        val.annUrl = `/project/noticeinfo?annId=${val.annId}`;
      });
      if (this.isauto === 1) {
        this.getAnList();
      }else{
        this.picSrc.isAuto=false;
      }
    });
  },
  methods: {
    ...mapMutations(["changeCurIndex"]),
    // 获取公告列表
    getAnList(content) {
      let data = `searchContext=${''}&annIsUse=${true}&pageNum=1&pageSize=6`;
      this.$xwhttpAuth({
        url: "/mall/getAnnouncementList",
        method: "post",
        data: data
      })
        .then(res => {
          if (res.data.code === 10000) {
            let arr =[];
            res.data.resp.list.some(val => {
              arr.push({
                annUrl: `/project/noticeinfo?annId=${val.annId}`,
                annTitle: val.annTitle,
                annId: val.annId,
                annColor: val.annColor
              });
            });
            this.picSrc.isAuto=true;
            this.picSrc.anIdList = arr;
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    isautoChange(val){
      if(val===1){
        this.getAnList();
      }else if(val===2){
        this.picSrc.anIdList = [];
        this.picSrc.isAuto=false;
      }
    },
    //关闭编辑窗口
    hideEdit() {
      this.changeCurIndex("");
    },
    //增加图片容器
    addContent() {
      if (this.picSrc.anIdList.length < this.maxPicContainer) {
        this.picSrc.anIdList.push({
          annUrl: "",
          annTitle: "",
          annId: "",
          annColor: ""
        });
      } else {
        this.$message({
          type: "error",
          message: "最多只能有" + this.maxPicContainer + "条信息"
        });
      }
    },
    //上传图片触发
    addPic(i) {
      this.$refs.file.click();
    },
    //图片上传
    picUpload() {
      this.isShowLoading = true;
      this.uploadPic(this.$refs.file.files[0], data => {
        let index = this.nowUpload;
        this.picSrc.imgUrl = data;
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
    confirmSelect(item) {
      this.picSrc.anIdList[this.popIndex].annId = item.annId;
      this.picSrc.anIdList[this.popIndex].annUrl = `/project/noticeinfo?annId=${
        item.annId
      }`;
      this.picSrc.anIdList[this.popIndex].annTitle = item.annTitle;
      this.picSrc.anIdList[this.popIndex].annColor = item.annColor;
      this.closePop();
    },
    //容器上移
    toUp(index) {
      let arr = this.dataJson.anIdList.splice(index - 1, 2);
      this.dataJson.anIdList.splice(index - 1, 0, ...arr.reverse());
    },
    //容器下移
    toDown(index) {
      let arr = this.dataJson.anIdList.splice(index, 2);
      this.dataJson.anIdList.splice(index, 0, ...arr.reverse());
    },
    //删除容器
    deleteThis(index) {
      this.dataJson.anIdList.splice(index, 1);
    }
  }
};
</script>

<style lang="less" scoped>
.active {
  border-color: #3089dc;
}
.isauto {
  margin: 10px 0;
}
.notice_ment_edit {
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
        /*align-items: center;*/
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
    i.notAllow {
      color: #ddd !important;
      cursor: not-allowed;
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
            width: 70px;
            height: 50px;
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
              line-height: 50px;
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
            flex: 1;
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
                padding: 0 12px 0 8px;
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
      .left_icon {
        width: 70px;
        height: 50px;
        background: #f4f4f4;
        display: flex;
        justify-content: center;
        align-items: center;
        /*cursor: pointer;*/
        img {
          width: 100%;
          height: 100%;
        }
      }
      .upload_btn {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
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
    .upload_img {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      background: #f9f9f9;
    }
    .radio_group {
      padding: 10px 0;
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
input[type="file"] {
  display: none;
}
</style>
