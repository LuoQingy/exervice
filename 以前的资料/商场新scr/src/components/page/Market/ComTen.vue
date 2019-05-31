<template>
  <div id="activity-management">
    <div class="title">
      <span class="titletext">会员类型</span>
      <div class="titlebtn">
        <span class="btn" @click="goClassifyMainte">
          <span>分类维护</span>
        </span>
        <span class="btn" @click="goFloorMainte">
          <span>楼层管理</span>
        </span>
        <span class="btn" @click="addUser">
          <span>+添加商户</span>
        </span>
      </div>
    </div>
    <div class="screenOptions">
      <div class="fl name">
        <label>商户名称：</label>
        <input v-model="merchantName" type="text" placeholder="请输入商户名称">
      </div>
      <div class="fl floor">
        <label>楼层：</label>
        <el-select v-model="floorvalue" style="width:90px;" placeholder="请选择">
          <el-option label="全部" value></el-option>
          <el-option v-for="(item,index) in flooroptions" :key="index" :label="item.floorName"
                     :value="item.floorId"></el-option>
        </el-select>
      </div>
      <div class="fl classify">
        <label>商户分类：</label>
        <el-select v-model="classifyvalue" style="width:120px;" placeholder="一级分类" @change="classifyvalueChang">
          <el-option label="全部" value></el-option>
          <el-option v-for="(item,index) in classifyoptions" :key="index" :label="item.industryName"
                     :value="item.industryId"></el-option>
        </el-select>
        <el-select v-model="twoclassifyvalue" :disabled="classifyvalue!='0'&&!classifyvalue" style="width:120px;"
                   placeholder="二级分类">
          <el-option label="全部" value></el-option>
          <el-option v-for="(item,index) in twooptions" :key="index" :label="item.industryName"
                     :value="item.industryId"></el-option>
        </el-select>
      </div>
      <el-button type="primary" class="fl" icon="el-icon-search" @click="findMerchant">查询</el-button>
      <el-button type="primary" class="fl" icon="el-icon-search" @click="reset">重置条件</el-button>
    </div>
    <div class="activity-content main">
      <el-table
        :data="tableData"
        ref="singleTable"
        border
        :cell-style="()=>'text-align: center;'"
        :header-cell-style="()=>'text-align: center;'"
      >
        <el-table-column label="序号" width="120">
          <template slot-scope="{row, $index}">
            <el-input-number
              :min="0"
              ref="rankref"
              @change="leaveInput(row.merchantId,$index)"
              @keyup.enter="leaveInput(row.merchantId,$index)"
              class="rankinput"
              controls-position="right"
              v-model="row.merchantSort"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="商户名称" prop="merchantName"></el-table-column>
        <el-table-column label="logo">
          <template slot-scope="{row}">
            <img style="width: 80px;height: 80px;" :src="row.merchantLogo">
          </template>
        </el-table-column>
        <el-table-column label="手机号码" prop="merchantPhone"></el-table-column>
        <el-table-column label="铺位" prop="merchantBunk"></el-table-column>
        <el-table-column label="分类" prop="industryName"></el-table-column>
        <el-table-column label="楼层" prop="floorName"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="{row}">
            {{row.merchantStatus==1?'启用':'停用'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="{ row }">
            <el-button type="text" @click="showShopInfo(row.merchantId)">店铺信息</el-button>
            <el-button type="text" v-if="row.merchantStatus==1" @click="stopShop(row.merchantId)">停用</el-button>
            <el-button type="text" v-if="row.merchantStatus!=1" @click="startShop(row.merchantId)">启用</el-button>
            <el-popover placement="top" width="160" v-model="row.visible">
              <p>确定删除吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="row.visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="detele(row.merchantId)">确定</el-button>
              </div>
              <el-button type="text" slot="reference" class="detele">删除</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>

      <!--<div style="width:100%" class="table">-->
      <!--<table cellpadding="0" cellspacing="0" width="100%">-->
      <!--<tr>-->
      <!--<th style="width:100px;color:#999;border-right:none;">序号</th>-->
      <!--<th style="width:140px;color:#999;border-right:none;">商户名称</th>-->
      <!--<th style="width:100px;color:#999;border-right:none;">logo</th>-->
      <!--<th style="width:140px;color:#999;border-right:none;">手机号码</th>-->
      <!--<th style="width:100px;color:#999;border-right:none;">铺位</th>-->
      <!--<th style="width:100px;color:#999;border-right:none;">分类</th>-->
      <!--<th style="width:100px;color:#999;border-right:none;">楼层</th>-->
      <!--<th style="width:100px;color:#999;border-right:none;">状态</th>-->
      <!--<th style="width:200px;color:#999;">操作</th>-->
      <!--</tr>-->
      <!--<tr v-if="!tableData.length">-->
      <!--<td colspan="9">暂无内容</td>-->
      <!--</tr>-->
      <!--<tr v-for="(item, index) in tableData" :key="index">-->
      <!--<td style="width:100px;border-right:none;">-->
      <!--<el-input-number-->
      <!--:min="0"-->
      <!--ref="rankref"-->
      <!--@change="leaveInput(item.merchantId,index)"-->
      <!--@keyup.enter="leaveInput(item.merchantId,index)"-->
      <!--class="rankinput"-->
      <!--controls-position="right"-->
      <!--v-model="item.merchantSort"-->
      <!--&gt;</el-input-number>-->
      <!--</td>-->
      <!--<td style="width:140px;border-right:none;">{{item.merchantName}}</td>-->
      <!--<td style="width:100px;border-right:none;">-->
      <!--<img :src="item.merchantLogo">-->
      <!--</td>-->
      <!--<td style="width:100px;border-right:none;">{{item.merchantPhone}}</td>-->
      <!--<td style="width:100px;border-right:none;">{{item.merchantBunk}}</td>-->
      <!--<td style="width:100px;border-right:none;">{{item.industryName}}</td>-->
      <!--<td style="width:100px;border-right:none;">{{item.floorName}}</td>-->
      <!--<td style="width:100px;border-right:none;">{{item.merchantStatus==1?'启用':'停用'}}</td>-->
      <!--<td style="width:200px" class="operation">-->
      <!--<span class="edit" @click="showShopInfo(item.merchantId)">店铺信息</span>-->
      <!--<span v-if="item.merchantStatus==1" class="edit" @click="stopShop(item.merchantId)">停用</span>-->
      <!--<span v-if="item.merchantStatus!=1" class="edit" @click="startShop(item.merchantId)">启用</span>-->
      <!--<el-popover placement="top" width="160" v-model="item.visible">-->
      <!--<p>确定删除吗？</p>-->
      <!--<div style="text-align: right; margin: 0">-->
      <!--<el-button size="mini" type="text" @click="item.visible = false">取消</el-button>-->
      <!--<el-button type="primary" size="mini" @click="detele(item.merchantId)">确定</el-button>-->
      <!--</div>-->
      <!--<span slot="reference" class="detele">删除</span>-->
      <!--</el-popover>-->
      <!--</td>-->
      <!--</tr>-->
      <!--</table>-->
      <!--</div>-->
      <div class="pagination" style="width:100%">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="nowPage"
          :page-size="pageTotal"
          @size-change="handleSizeChange"
          :page-sizes="[10, 20, 30, 40]"
          layout="total, sizes, prev, pager, next"
          :total="pageNumberTotal"
        ></el-pagination>
      </div>
    </div>
    <!-- 编辑店铺信息 -->
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [],
        activeName: "first",
        searchText: "",
        nowPage: 1, //分页
        pageTotal: 10, //一页的个数
        pageNumberTotal: 0, //总共页数
        floorvalue: null,
        classifyvalue: null,
        twoclassifyvalue: null,
        merchantSort: null,
        flooroptions: [],
        classifyoptions: [],
        twooptions: [],
        merchantName: null //商户名称
      };
    },
    created() {
      this.findMerchant();
      this.getMallClassifyAndFloor();
      this.getSonIndustry();
    },
    mounted() {
    },

    methods: {
      addUser() {
        //跳转添加商户页面
        this.$router.push("/market/addComTen");
      },
      goClassifyMainte() {
        //跳转分类维护页面
        this.$router.push("/market/classifyMainte");
      },
      goFloorMainte() {
        //跳转分类维护页面
        this.$router.push("/market/floorMainte");
      },
      leaveInput(umriId, index) {
        //修改排序
        let _this = this;
        _this.merchantSort = _this.tableData[index].merchantSort;
        if (_this.merchantSort == "" && _this.merchantSort != "0") {
        } else {
          _this.moveRight(umriId);
        }
      },
      moveRight(merchantId) {
        //获取单个详情
        let _this = this;
        this.$httpAuth({
          url: "/mall/updateMerchantListSort",
          method: "post",
          data: {
            merchantId,
            merchantSort: this.merchantSort
          }
        })
          .then(res => {
            if (res.data.code == 10000) {
              this.$message({
                message: res.data.resp,
                type: 'success'
              });
              this.findMerchant();
            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      handleSizeChange(val) {
        this.nowPage = 1;
        this.pageTotal = val;
        this.findMerchant();
      },
      handleCurrentChange(val) {
        this.nowPage = val;
        this.findMerchant();
      },
      //跳转编辑
      showShopInfo(merchantId) {
        this.$router.push({
          name: "editComTen",
          query: {
            merchantId: merchantId
          }
        });
      },
      //获取楼层和一级分类
      getMallClassifyAndFloor() {
        let _this = this;
        this.$httpAuth({
          url: "/mall/getMallClassificationAndFloor",
          method: "post"
        })
          .then(res => {
            if (res.data.code == 10000) {
              _this.flooroptions = res.data.resp.floor;
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      getSonIndustry() {
        //获取所有经营类型
        let _this = this;
        this.$httpAuth({
          url: "/mall/getSonIndustry",
          method: "post"
        })
          .then(res => {
            let resp = res.data.resp;
            this.classifyoptions = res.data.resp;
          })
          .catch(err => {
            console.log(err);
          });
      },
      // 选择一级分类 改变二级分类
      classifyvalueChang(industryId) {
        let step = this.classifyoptions.some(val => {
          if (val.industryId == industryId) {
            this.twooptions = val.categoryList;
            return true;
          }
        });
        this.twoclassifyvalue = null;
      },
      //查询商户
      findMerchant() {
        let _this = this;
        this.$httpAuth({
          url: "/mall/mallFindMerchant",
          method: "post",
          data: {
            nowPage: _this.nowPage,
            pageTotal: _this.pageTotal,
            merchantName: _this.merchantName,
            floorId: _this.floorvalue,
            industryId: this.twoclassifyvalue
              ? this.twoclassifyvalue
              : this.classifyvalue
          }
        })
          .then(res => {
            if (res.data.code == 10000) {
              _this.tableData = res.data.resp.merchant;
              _this.pageNumberTotal = res.data.resp.pageNumberTotal;
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      // 重置条件
      reset() {
        this.merchantName = null;
        this.floorvalue = null;
        this.classifyvalue = null;
        this.twoclassifyvalue = null;
        this.findMerchant();
      },
      //停用商户
      stopShop(merchantId) {
        let _this = this;
        this.$httpAuth({
          url: "/mall/updateMerchantStatus",
          method: "get",
          params: {
            merchantId: merchantId,
            status: 2
          }
        })
          .then(res => {
            if (res.data.code == 10000) {
              this.$message.success(res.data.resp);
            } else {
              this.$message.info(res.data.resp);
            }
            this.findMerchant();
          })
          .catch(err => {
            console.log(err);
          });
      },
      //启用商户
      startShop(merchantId) {
        let _this = this;
        this.$httpAuth({
          url: "/mall/updateMerchantStatus",
          method: "get",
          params: {
            merchantId: merchantId,
            status: 1
          }
        })
          .then(res => {
            if (res.data.code == 10000) {
              this.$message.success(res.data.resp);
            } else {
              this.$message.info(res.data.resp);
            }
            this.findMerchant();
          })
          .catch(err => {
            console.log(err);
          });
      },
      //删除商户
      detele(merchantId) {
        let _this = this;
        _this.nowPage = 1;
        let data = {};
        this.$httpAuth({
          url: "/mall/deleteMerchant",
          method: "get",
          params: {
            merchantId: merchantId
          }
        })
          .then(res => {
            if (res.data.code == 10000) {
              this.$message.success(res.data.resp);
            } else {
              this.$message.info(res.data.resp);
            }
            this.findMerchant();
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  };
</script>


<style lang="less" scoped>
  .fl {
    float: left;
  }

  .fr {
    float: right;
  }

  input,
  button {
    outline: none;
    border: none;
  }

  #activity-management {
    width: auto;
    min-width: 1000px;
    .title {
      width: 100%;
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid #f2f2f2;
      display: flex;
      .titletext {
        flex: 1;
      }
      .titlebtn {
        flex: 1;
        text-align: right;
        span {
          width: 100px;
          height: 30px;
          line-height: 30px;
          font-size: 14px;
          background: #f56c6c;
          display: inline-block;
          text-align: center;
          color: #fff;
          border-radius: 4px;
        }
      }
    }
    .screenOptions {
      width: 100%;
      margin: 20px 0px;
      overflow: hidden;
      .name {
        margin-right: 20px;
        input {
          border: 1px solid #f2f2f2;
          outline: none;
          width: 200px;
          height: 30px;
          line-height: 30px;
        }
      }
      .floor {
        margin-right: 20px;
      }
      .classify {
        margin-right: 20px;
      }
    }
    .activity-content {
      width: 100%;
      margin: 10px 0;
      overflow: hidden;
      .rankinput {
        width: 100px;
        /*height: 30px;*/
        line-height: 30px;
        /*border: 1px solid #f2f2f2;*/
        outline: none;
        text-align: center;
      }
      .table table tr th {
        line-height: 50px;
        border: solid #ddd;
        border: 1px solid #ddd;
        color: #333333;
        font-weight: normal;
      }
      .table table tr td {
        overflow-x: hidden;
        vertical-align: middle;
        text-align: center;
        border: 1px solid #ddd;
        color: #333333;
        border-top: none;
        font-size: 14px;
        img {
          padding: 5px 0px;
          vertical-align: middle;
          width: 80px;
          height: 48px;
        }
      }
      .operation {
        span {
          cursor: pointer;
        }
        .edit {
          // color: #13c300;
          padding: 5px;
        }
        .detele {
          padding: 5px;
          // color: red;
        }
      }
      .pagination {
        margin: 20px 0 0;
      }
    }
    .btndiv {
      width: 200px;
      margin: auto;
    }
  }
</style>
