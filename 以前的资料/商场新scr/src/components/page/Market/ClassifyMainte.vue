<template>
  <div class="box categoryManagement">
    <h3>类目管理</h3>
    <div class="content">
      <div class="box1">
        <div class="floatLeft">
          <el-button @click="goAddClassify" type="danger" icon="el-icon-plus">添加一级栏目</el-button>
          <b>序号越小越靠前</b>
        </div>
        <div class="floatRight">
          <el-button @click="hiddenAll" v-show="showAllflag" type="primary">隐藏所有栏目</el-button>
          <el-button @click="showAll" v-show="!showAllflag" type="primary">显示所有栏目</el-button>
        </div>
      </div>
      <div class="box1">
        <dl class="table">
          <dt class="thead">
            <div>序号</div>
            <div>图标</div>
            <div>类目名称</div>
            <div>操作</div>
          </dt>
          <dd class="optimization" v-if="!tableDataLoading">
            <div class="rrg-table-loading" v-loading.lock="true" element-loading-text="加载中"></div>
          </dd>
          <dd class="optimization rrg-table-noContent" v-if="!categoryList.length && tableDataLoading">暂无内容</dd>
          <dd v-for="(firstItem, firstIndex) in categoryList" :key="firstIndex" v-show="tableDataLoading">
            <div class="row">
              <div>
                <span class="rank floatLeft rankleft">{{firstItem.sort}}</span>
                <span class="rank floatLeft rankright">
                  <img :src="firstItem.icon" alt>
                </span>
              </div>
              <div class="categoryName">
                <input class="first" type="text" v-model="firstItem.industryName" :readonly='true'>
                <i
                  class="el-icon-caret-left non-editable"
                  :class="firstItem.isShowChild?'show':''"
                  :style="{visibility: (firstItem.categoryList != null && !!firstItem.categoryList.length)?'initial':'hidden'}"
                  @click.stop="showChild(firstItem)"
                ></i>
              </div>
              <div class="options">
                <el-button type="text" size="medium" @click="toAddCategory(firstItem.industryId,firstItem.parentId)">
                  编辑
                </el-button>
                <div class="dropdown exactAreaClassName">
                  <el-dropdown>
                    <el-button type="text" size="medium">更多<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>
                        <p @click="addMoreCategory(firstItem.industryId)">添加二级类别</p>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <p @click="deleteCategoryItem(firstItem.industryId)">删除</p>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </div>
            </div>
            <el-collapse-transition>
              <ul v-if="firstItem.categoryList != null && !!firstItem.categoryList.length"
                  v-show="firstItem.isShowChild">
                <li v-for="(secondItem, secondIndex) in firstItem.categoryList" :key="secondIndex">
                  <div class="row">
                    <div class="rank">{{secondItem.sort}}</div>
                    <div class="categoryName">
                      <input class="second" type="text" v-model="secondItem.industryName" :readonly='true'>
                    </div>
                    <div class="options">
                      <el-button type="text" size="medium"
                                 @click="toAddCategory(secondItem.industryId,secondItem.parentId)">编辑
                      </el-button>
                      <el-button type="text" size="medium" @click="deleteCategoryItem(secondItem.industryId)">删除
                      </el-button>
                    </div>
                  </div>
                </li>
              </ul>
            </el-collapse-transition>
          </dd>
        </dl>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        imageUrl: "",
        categoryList: [],
        oldDatas: [],
        clickOpt: false,
        showAllflag: false,
        oldVal: "",
        popText: "此操作将永久删除该类目及其子类目, 是否继续?",
        replyBool: false,
        isShowPop: false,

        dropdownList: [],

        tableDataLoading: false
      };
    },
    created() {
      this.$nextTick(() => {
        this.getCategory();
      });
    },
    methods: {
      //添加父类别
      goAddClassify() {
        this.$router.push({
          name: "addClassify",
          query: {
            parentId: 0
          }
        });
      },
      //添加子类别
      addMoreCategory(industryId) {
        this.$router.push({
          name: "addClassify",
          query: {
            parentId: industryId
          }
        });
      },
      //删除类目
      deleteCategoryItem(industryId) {
        let _this = this;
        this.$confirm("确认删除？")
          .then(_ => {
            this.$httpAuth({
              url: "/mall/deleteIndustryMall",
              method: "get",
              params: {
                industryId: industryId
              }
            })
              .then(res => {
                if (res.data.code == 10000) {
                  this.$message.success(res.data.resp);
                } else {
                  this.$message.success(res.data.resp);
                }
                this.getCategory();
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(_ => {
          });
      },
      //编辑
      toAddCategory(industryId, parentId) {
        this.$router.push({
          name: "editClassify",
          query: {
            industryId: industryId,
            parentId: parentId
          }
        });
      },
      //显示所有子类目
      showAll() {
        this.categoryList.forEach(firstItem => {
          firstItem.isShowChild = true;
          firstItem.categoryList.forEach(secondItem => {
            secondItem.isShowChild = true;
          });
        });
        this.showAllflag = !this.showAllflag;
      },
      //是否隐藏所有子栏目
      hiddenAll() {
        this.categoryList.forEach(firstItem => {
          firstItem.isShowChild = false;
          firstItem.categoryList.forEach(secondItem => {
            secondItem.isShowChild = false;
          });
        });
        this.showAllflag = !this.showAllflag;
      },
      // 显示子分类
      showChild(item, index) {
        item.isShowChild = !item.isShowChild;
      },
      //获取一级分类列表接口
      getCategory() {
        this.tableDataLoading = false;
        var _this = this;
        this.$httpAuth({
          method: "post",
          url: "/mall/getSonIndustry"
        })
          .then(function (res) {
            if (res.data.code == 10000) {
              _this.categoryList = res.data.resp;
              _this.oldDatas = [];
              if (_this.categoryList.length) {
                _this.categoryList.forEach((firstItem, firstIndex) => {
                  _this.$set(firstItem, "isShowChild", false);
                  _this.$set(firstItem, "isShowOpt", false);
                  let firstObj = {
                    categoryId: firstItem.industryId,
                    name: firstItem.industryName,
                    rank: firstItem.sort,
                    icon: firstItem.icon
                  };
                  firstObj.isShowChild = firstItem.isShowChild;
                  firstObj.isShowOpt = firstItem.isShowOpt;
                  firstObj.categoryList = [];
                  _this.oldDatas.push(firstObj);
                  if (
                    firstItem.categoryList != null &&
                    !!firstItem.categoryList.length
                  ) {
                    firstItem.categoryList.forEach((secondItem, secondIndex) => {
                      _this.$set(secondItem, "isShowChild", false);
                      _this.$set(secondItem, "isShowOpt", false);
                      let secondObj = {
                        categoryId: secondItem.industryId,
                        name: secondItem.industryName,
                        rank: secondItem.sort
                      };
                      secondObj.isShowChild = secondItem.isShowChild;
                      secondObj.isShowOpt = secondItem.isShowOpt;
                      secondObj.categoryList = [];
                      _this.oldDatas[firstIndex].categoryList.push(secondObj);
                      if (
                        secondItem.categoryList != null &&
                        !!secondItem.categoryList.length
                      ) {
                        secondItem.categoryList.forEach(
                          (thirdItem, thirdIndex) => {
                            _this.$set(thirdItem, "isShowOpt", false);
                            let thirdObj = {
                              categoryId: thirdItem.industryId,
                              name: thirdItem.industryName,
                              rank: thirdItem.sort
                            };
                            thirdObj.isShowChild = thirdItem.isShowChild;
                            thirdObj.isShowOpt = thirdItem.isShowOpt;
                            thirdItem.categoryList = [];
                            _this.oldDatas[firstIndex].categoryList[
                              secondIndex
                              ].categoryList.push(thirdObj);
                          }
                        );
                      }
                    });
                  }
                });
              }
            }
            _this.tableDataLoading = true;
          })
          .catch(function (err) {
            console.log(err);
            _this.tableDataLoading = true;
          });
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /*内容样式*/

  .box {
    min-width: 860px;
    position: relative;
  }

  .box h3 {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #999;
    padding-left: 15px;
    font-size: 14px;
  }

  .floatLeft {
    /*float: left;*/
    display: inline-block;
  }

  .rankleft {
    width: 45%;
    text-align: center;
    border-right: 1px solid #ebeef5;
  }

  .rankright {
    width: 45%;
    text-align: center;
  }

  .rankright img {
    width: 30px;
    height: 30px;
    margin-bottom: -10px;
  }

  .rrg-btn-danger {
    width: 140px;
    height: 40px;
    line-height: 40px;
    background: #d15b47;
    color: #fff;
    display: inline-block;
    text-align: center;
  }

  .floatRight {
    float: right;
  }

  .rrg-btn-primary {
    width: 140px;
    height: 40px;
    line-height: 40px;
    background: #428bca;
    color: #fff;
    display: inline-block;
    text-align: center;
  }

  .content {
    padding: 12px 12px 80px 12px;
  }

  .content .box1 {
    width: 100%;
  }

  .content .box1 .optimization {
    border-bottom: 1px solid #ddd;
  }

  .content .box1 .noContent {
    text-align: center;
    line-height: 100px;
  }

  .content .box1 .floatLeft b {
    font-size: 14px;
    color: #333;
  }

  .content .box1 .table {
    margin: 10px 0;
    border: solid #ebeef5;
    border-width: 1px 1px 0;
  }

  .content .box1 .table .thead {
    /*border: solid #ddd;*/
    /*border-width: 0 0 1px 0;*/
    /*background: #f2f2f2;*/
    height: 40px;
    line-height: 40px;
    text-align: center;
  }

  .content .box1 .table .thead > div {
    /*border-right: 1px solid #ccc;*/
    font-size: 12px;
    color: #909399;
    font-weight: bold;
    border: solid #ebeef5;
    border-width: 0 1px 1px 0;
  }

  .content .box1 .table .thead > div:nth-child(1) {
    width: 9.8%;
    float: left;
  }

  .content .box1 .table .thead > div:nth-child(2) {
    width: 10.5%;
    float: left;
  }

  .content .box1 .table .thead > div:nth-child(3) {
    width: 50.5%;
    float: left;
  }

  .content .box1 .table .thead > div:nth-child(4) {
    width: 28.8%;
    float: left;
    border-right: none;
  }

  .content .box1 .table .options {
    width: 100px;
  }

  .content .box1 .table .options .edit {
    /* border:1px solid #a7c9a1; */
    color: #81a87b !important;
    width: 60px;
    height: 20px;
    line-height: 20px;
    display: inline-block;
    margin-right: 10px;
  }

  .content .box1 .table .options .dropdown {
    position: relative;
    display: inline-block;
    color: #70a0c1 !important;
    width: 60px;
    height: 20px;
    line-height: 20px;
  }

  .content .box1 .table .options .dropdown i {
    font-size: 14px;
  }

  .content .box1 .table .options .dropdown .dropdownMenu {
    position: absolute;
    top: 30px;
    right: 0;
    z-index: 99;
  }

  .content .box1 .table .options .dropdown .dropdownMenu ul {
    padding: 5px 0;
    border: 1px solid #ebeef5;
    background: #fff;
  }

  .content .box1 .table .options .dropdown .dropdownMenu li {
    width: 125px;
    line-height: 30px;
    color: #7e8c8d;
    cursor: pointer;
  }

  .content .box1 .table .options .dropdown .dropdownMenu li:hover {
    background: #ecf5ff;
  }

  .content .box1 .table .options .dropdown .dropdownMenu li a {
    display: inline-block;
    width: 100%;
    height: 100%;
  }

  .content .box1 .table .options .dropdown .dropdownMenu ol {
    overflow-y: scroll;
    position: absolute;
    right: 132px;
    top: 0;
    width: 143px;
    height: 150px;
    padding: 5px 0;
    border: 1px solid #ebeef5;
    background: #fff;
  }

  .content .box1 .table .row {
    width: 100%;
    border-bottom: 1px solid #ebeef5;
  }

  .content .box1 .table .row > div {
    box-sizing: border-box;
    display: inline-block;
    line-height: 40px;
    text-align: center;
  }

  .content .box1 .table .row > div.categoryName {
    text-align: right;
  }

  .content .box1 .table .row > div.categoryName i {
    margin-right: 5%;
    vertical-align: middle;
    font-size: 20px;
    cursor: pointer;
    transition: all 0.3s;
  }

  .content .box1 .table .row > div.categoryName i.show {
    transform: rotateZ(-90deg);
  }

  .content .box1 .table .row > div.categoryName i.hidden {
    visibility: hidden;
  }

  .content .box1 .table .row > div.categoryName input {
    width: 75%;
    padding: 0 10px;
    height: 30px;
    border: 1px solid #bebebe;
    font-size: 14px;
  }

  .content .box1 .table .row > div.categoryName input.first {
    width: 80%;
  }

  .content .box1 .table .row > div.categoryName input.second {
    width: 65%;
  }

  .content .box1 .table .row > div.categoryName input.third {
    width: 55%;
  }

  .content .box1 .table .row > div select {
    display: inline-block;
    height: 30px;
    border: 1px solid #bebebe;
  }

  .content .box1 .table .row > div + div {
    border-left: 1px solid #ebeef5;
  }

  .content .box1 .table .row > div:nth-child(1) {
    width: 20%;
  }

  .content .box1 .table .row > div:nth-child(2) {
    width: 50%;
  }

  .content .box1 .table .row > div:nth-child(3) {
    width: 28%;
  }

  .content .box1 .table .row .rank input {
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border: 1px solid #bebebe;
  }

  .page {
    float: right;
    margin: 8px 0;
  }

  .content .box1 .myBtn {
    width: 57px;
    line-height: 16px;
    height: 16px;
    margin: 8px 30px 8px 0;
  }
</style>
