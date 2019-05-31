<template>
  <transition name="el-fade-in">
    <div class="rrg-pop is-active" @click="closePop">
      <div class="mask"></div>
      <div class="pop">
        <div class="popBox checkGood" @click.stop="prevent">
          <div class="link_title">
            <div>
              <el-radio-group @change="goodCategoryChang" v-model="goodCategory">
                <el-radio :label="0" v-if="!isnotice">商品页面</el-radio>
                <el-radio :label="1" v-if="!isnotice">活动页面</el-radio>
                <el-radio :label="2" v-if="!isnotice">商家页面</el-radio>
                <el-radio :label="3" v-if="!isnotice">分类页面</el-radio>
                <el-radio :label="4" v-if="isnotice">公告页面</el-radio>
              </el-radio-group>
            </div>
            <i class="el-icon-close" @click="closePop"></i>
          </div>
          <div class="popMain">
            <div class="picBoc">
              <div class="search_box">
                <el-input v-model="searchContent" @keyup.enter.native="search" :readonly="goodCategory===3" placeholder="请输入查询名称"></el-input>
                <el-button type="primary" :disabled="goodCategory===3" @click="search">查询</el-button>
              </div>
              <!-- 其他页面选择 -->
              <div class="main" v-show="isShowGoodList&&goodCategory!==3">
                <div class="loading" v-if="!searchGoodsList.length">
                  <i class="el-icon-loading"></i>
                  <b>努力加载中</b>
                </div>
                <ul v-if="searchGoodsList.length>0">
                  <li
                    v-for="(item, index) in searchGoodsList"
                    @click="selectedGood(item, index)"
                    :key="index"
                    :class="selectGoodIndex == index?'active':''"
                  >
                    <span>{{item[keyvalue]}}</span>
                  </li>
                </ul>
              </div>
              <!-- 分类页面选择 -->
              <div class="main" v-show="isShowGoodList&&goodCategory===3">
                <div class="loading" v-if="!searchGoodsList.length">
                  <i class="el-icon-loading"></i>
                  <b>努力加载中</b>
                </div>
                <ul v-if="searchGoodsList.length>0">
                  <template v-for="(item, index) in searchGoodsList">
                    <li @click="selectedGood(item, item.industryId)" :class="selectGoodIndex == item.industryId?'active':''">
                      <span>{{item[keyvalue]}}</span>
                    </li>
                    <template v-if="item.categoryList&&item.categoryList.length>0">
                      <li
                        v-for="(items, indexs) in item.categoryList"
                        @click="selectedGood(items, items.industryId)"
                        :key="items.industryId"
                        style="padding-left: 30px;'"
                        :class="selectGoodIndex == items.industryId?'active':''"
                      >
                        <span>{{items[keyvalue]}}</span>
                      </li>
                    </template>
                  </template>
                </ul>
              </div>
            </div>
          </div>
          <div class="curentSelect">
            <span>
              当前选择的是：
              <b v-show="firstName">{{firstName}}</b>
              <b v-show="secondName">&nbsp;-&nbsp;{{secondName}}</b>
            </span>
          </div>
          <div class="EditButton">
            <el-button type="primary" @click="confirmSelect">确认</el-button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { formdata } from "@/libs/formdata.js";
export default {
  name: "searchPop",
  props: {
    index: {
      type: Number,
      required: false
    },
    isnotice: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      goodCategory: 0,
      keyvalue: "",
      searchContent: "", //查询商品内容
      searchGoodsList: [], //查询商品列表
      selectGoodIndex: "", //选择的商品索引
      isShowGoodList: false,
      firstName: "",
      secondName: "",
      linkPlaceholder: "输入商品ID或者商品名称"
    };
  },
  created() {
    if (this.isnotice) {
      this.goodCategory = 4;
    }
  },
  methods: {
    prevent() {},
    // 关闭弹窗
    closePop() {
      this.$emit("closePop");
    },
    goodCategoryChang(val) {
      this.keyvalue = "";
      this.searchGoodsList = [];
      this.selectGoodItem = "";
      this.selectGoodIndex = "";
      this.firstName = "";
      this.secondName = "";
      this.searchContent = "";
      this.isShowGoodList = false;
      if (val === 3) {
        this.keyvalue = "industryName";
        this.getCategory();
      }
    },
    // 点击搜索
    search() {
      this.isShowGoodList = true;
      this.searchGoodsList = [];
      if (this.goodCategory === 0) {
        this.keyvalue = "mgName";
        this.searchGoods(this.searchContent);
      } else if (this.goodCategory === 1) {
        this.keyvalue = "activityTitle";
        this.getActivityData(this.searchContent);
      } else if (this.goodCategory === 2) {
        this.keyvalue = "merchantName";
        this.findMerchant(this.searchContent);
      } else if (this.goodCategory === 4) {
        this.keyvalue = "annTitle";
        this.getAnList(this.searchContent);
      }
    },
    //匹配商品接口
    searchGoods(content) {
      this.$httpAuth({
        method: "post",
        url: "/gm/selectMallGoodsByAudited",
        data: {
          mgName: content,
          mgStatus: 3,
          pageNum: 1, //类型：Number  必有字段  备注：无
          pageSize: 100
        }
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.searchGoodsList = res.data.resp.list;
            this.isShowGoodList = true;
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        })
        .catch(function(err) {
          this.isShowGoodList = false;
        });
    },
    //获取活动数据
    getActivityData(content) {
      let data = `activityName=${content}&activityStatus=2&activityIsUse=${true}&pageNum=1&pageSize=100`;
      this.tableData = [];
      this.$xwhttpAuth({
        url: "/mall/getActivityList",
        method: "post",
        data: data
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.searchGoodsList = res.data.resp.list;
            this.isShowGoodList = true;
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
    //查询商户
    findMerchant(content) {
      this.$httpAuth({
        url: "/mall/mallFindMerchant",
        method: "post",
        data: {
          nowPage: 1,
          pageTotal: 100,
          merchantName: content
        }
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.searchGoodsList = res.data.resp.merchant;
            this.isShowGoodList = true;
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
    //获取分类列表接口
    getCategory() {
      this.$httpAuth({
        method: "post",
        url: "/mall/getSonIndustry"
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.searchGoodsList = res.data.resp;
            this.isShowGoodList = true;
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        })
        .catch(function(err) {});
    },
    // 获取公告列表
    getAnList(content) {
      let data = `searchContext=${content}&annIsUse=${true}&pageNum=1&pageSize=100`;
      this.$xwhttpAuth({
        url: "/mall/getAnnouncementList",
        method: "post",
        data: data
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.searchGoodsList = res.data.resp.list;
            this.isShowGoodList = true;
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
    //选择商品
    selectedGood(item, index) {
      this.selectGoodItem = item;
      this.selectGoodIndex = index;
      if (this.goodCategory === 3) {
        if (item.parentId === 0) {
          this.firstName = item[this.keyvalue];
          this.secondName = '';
        }else {
          this.secondName = item[this.keyvalue];
          this.searchGoodsList.some(val=>{
            if(val.industryId===item.parentId){
              this.firstName = val[this.keyvalue];
            }
          })
        }
      } else {
        this.firstName = item[this.keyvalue];
      }
    },
    //确认选择商品或者分类
    confirmSelect() {
      // project/mallgoodsInfo?mgId=110&mgGoodsType=2  商品
      if (!this.selectGoodItem) {
        this.$message({
          message: "请选择链接地址",
          type: "warning"
        });
        return;
      }
      let item = this.selectGoodItem;
      let url;
      if (this.keyvalue === "mgName") {
        // 商品页面
        url = `/project/mallgoodsInfo?mgId=${item.mgId}`;
      } else if (this.keyvalue === "activityTitle") {
        // 活动页面
        url = `/project/activityInfo?activityId=${item.activityId}`;
      } else if (this.keyvalue === "merchantName") {
        // 商家页面
        url = `/project/comUserInfo?merchantId=${item.merchantId}`;
      } else if (this.keyvalue === "annTitle") {
        // 公告页面
        this.$emit("confirmSelect", item);
        this.$emit("closePop");
        return;
      }else if (this.keyvalue === "industryName") {
        url = `/project/merchant?industryId=${item.industryId}&industryName=${item.industryName}`;
        // 分类页面
        this.$emit("confirmSelect", url);
        this.$emit("closePop");
        return;
      }
      this.$emit("confirmSelect", url);
      this.$emit("closePop");
    }
  }
};
</script>

<style lang="less" scoped>
.link_title {
  height: 40px;
  background: #f2f2f2;
  padding: 0 20px;
  align-items: center;
  display: flex;
  justify-content: space-between;
  .el-icon-close {
    font-size: 20px;
    font-weight: 900;
  }
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
    .search_box {
      display: flex;
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
      }
    }
  }
}
</style>
