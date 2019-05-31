<template>
  <div id="groupPurchaseManagement">
    <div>
      <el-breadcrumb separator="/" class="content_title">
        <el-breadcrumb-item>营销中心</el-breadcrumb-item>
        <el-breadcrumb-item>团购商品管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="screenOptions">状态
      <el-select v-model="commodityStatus" @change="searchChange(1)" style="width:150px;margin-right:20px;" placeholder="请选择">
        <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>领取状态
      <el-select v-model="commodityGetStatus" @change="searchChange(2)" style="width:130px;margin-right:20px;" placeholder="请选择">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>劵类型
      <el-select v-model="commodityType" @change="searchChange(3)" style="width:150px;margin-right:20px;" placeholder="请选择">
        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>

      <el-input v-model="user.commodityName" style="width:200px;margin-right:20px;" placeholder="输入优惠劵名称/商品名"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="searchEvent">搜索</el-button>
    </div>
    <div class="screenOptions">
      <span class="fl xianshi" v-if="toAudited>0">{{toAudited}}条待审核</span>
      <el-button type="danger" @click="toAddActivity(1,1)" class="fr" icon="el-icon-plus">创建商品</el-button>
    </div>
    <div class="activity-content">
      <el-table
        :data="tableData"
        v-loading="loading"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
        :cell-style="center"
        :header-cell-style="tableStyle"
      >
        <el-table-column label="商品名称" prop="commodityName" width="120"></el-table-column>
        <el-table-column label="原价" prop="commodityOriginalPrice"></el-table-column>
        <el-table-column label="现价" prop="commodityPreferentialPrice"></el-table-column>
        <el-table-column label="商品有效期" width="280">
          <template slot-scope="scope">
            <div v-if="scope.row.commodityValidity==2">
              <p class="table_details">{{scope.row.commodityPeriodStartTime}}-{{scope.row.commodityPeriodEndTime}}</p>
            </div>
            <div v-else>
              <p class="table_details">领取{{scope.row.commodityDay}}天内有效</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商品状态">
          <template slot-scope="scope">
            <span v-if="scope.row.commodityStatus==1">待审核</span>
            <span v-else-if="scope.row.commodityStatus==2">已审核</span>
            <span v-else-if="scope.row.commodityStatus==3">已上架</span>
            <span v-else-if="scope.row.commodityStatus==4">已下架</span>
            <span v-else-if="scope.row.commodityStatus==5" class="jinggao">
              被驳回
              <i class="el-icon-warning"></i>
            </span>
            <span v-else-if="scope.row.commodityStatus==6">暂停</span>
            <span v-else></span>
            <!-- (1:待审核 2:已审核 3:上架 4:下架 5:驳回 6:暂停) -->
          </template>
        </el-table-column>
        <el-table-column label="领取状态">
          <template slot-scope="scope">
            <span v-if="scope.row.commodityStatus==6">暂停</span>
            <span v-else>{{scope.row.commodityGetStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="commodityInventory" label="剩余库存"></el-table-column>
        <el-table-column label="创建人" prop="admin.adminName">
          <template slot-scope="scope">
            <p v-if="scope.row.admin">{{scope.row.admin.adminName}}</p>
            <p v-else>商场</p>
          </template>
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
              <el-dropdown>
                <el-button type="text" >
                  更多
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <p @click="handleCommand(scope.row,1)">查看</p>
                  </el-dropdown-item>
                  <el-dropdown-item v-show="scope.row.commodityStatus==1||scope.row.commodityStatus==2">
                    <p @click="handleCommand(scope.row,2)">修改</p>
                  </el-dropdown-item>
                  <el-dropdown-item v-show="scope.row.commodityStatus==1">
                    <p @click="handleCommand(scope.row,3)">审核</p>
                  </el-dropdown-item>
                  <el-dropdown-item v-show="scope.row.commodityStatus==3||scope.row.commodityStatus==6">
                    <p @click="handleCommand(scope.row,5)">下架</p>
                  </el-dropdown-item>
                  <el-dropdown-item v-show="scope.row.commodityStatus==3">
                    <p @click="handleCommand(scope.row,6)">暂停</p>
                  </el-dropdown-item>
                  <el-dropdown-item v-show="scope.row.commodityStatus==6">
                    <p @click="handleCommand(scope.row,7)">取消暂停</p>
                  </el-dropdown-item>
                  <el-dropdown-item v-show="scope.row.commodityStatus==4">
                    <p @click="handleCommand(scope.row,8)">查看效果</p>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>

            <!--<div class="operation">-->
              <!--<select v-model="selectStatus" @change="handleCommand(scope.row)">-->
                <!--<option value="1">查看</option>-->
                <!--<option value="2" v-show="scope.row.commodityStatus==1||scope.row.commodityStatus==2">修改</option>-->
                <!--<option value="3" v-show="scope.row.commodityStatus==1">审核</option>-->
                <!--<option value="5" v-show="scope.row.commodityStatus==3||scope.row.commodityStatus==6">下架</option>-->
                <!--<option value="6" v-show="scope.row.commodityStatus==3">暂停</option>-->
                <!--<option value="7" v-show="scope.row.commodityStatus==6">取消暂停</option>-->
                <!--<option value="8" v-show="scope.row.commodityStatus==4">查看效果</option>-->
              <!--</select>-->
              <!--<span>-->
                <!--更多-->
                <!--<i class="el-icon-caret-bottom el-icon&#45;&#45;right"></i>-->
              <!--</span>-->
            <!--</div>-->
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="user.pageNum"
          :page-sizes="[10, 20,30, 40, 60]"
          :page-size="user.pageSize"
          layout="total,sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { specailTest } from "@/libs/regular.js";
export default {
  data() {
    return {
      tableData: [],
      activityList: [],
      selectlist: [],
      status: [
        //状态备注：状态(1:待审核 2:已审核 3:上架 4:下架 5:驳回 6:暂停)
        {
          value: 0,
          label: "全部"
        },
        {
          value: 1,
          label: "待审核"
        },
        {
          value: 2,
          label: "已审核"
        },
        {
          value: 3,
          label: "已上架"
        },
        {
          value: 4,
          label: "已下架"
        },
        {
          value: 5,
          label: "被驳回"
        },
        {
          value: 6,
          label: "暂停"
        }
      ],
      options: [
        //领取状态(1:未开始 2:进行中 3:已结束 4:暂停)
        {
          value: 0,
          label: "全部"
        },
        {
          value: 1,
          label: "未开始"
        },
        {
          value: 2,
          label: "进行中"
        },
        {
          value: 3,
          label: "已结束"
        },
        {
          value: 4,
          label: "暂停"
        }
      ],
      statusOptions: [
        //1:团购商品 2:售卖代金券 劵类型
        {
          value: 0,
          label: "全部"
        },
        {
          value: 1,
          label: "套餐"
        },
        {
          value: 2,
          label: "代金券"
        }
      ],
      selectStatus: "0",
      commodityStatus: 0, //状态
      commodityGetStatus: 0, //领取状态
      commodityType: 0, //劵类型
      toAudited: 0, //待审核的条数
      total: 0,
      loading: true,
      tableStyle: {
        "text-align": "center",
        color: "#999999",
      },
      user: {
        pageNum: 1, //备注：页 默认1
        pageSize: 10 //备注：页数 默认5
      }
    };
  },
  created() {
    this.getWaitExamine();
    this.$nextTick(() => {
      this.getCommodityData();
    });
  },
  mounted() {},
  methods: {
    center() {
      return "text-align: center;";
    },
    getWaitExamine() {
      //获取待审核
      let obj = {
        commodityType: "", //备注：类型 1:团购商品 2:售卖代金券
        commodityStatus: 1, //备注：状态(1:待审核 2:已审核 3:上架 4:下架 5:驳回)
        commodityGetStatus: "", //备注：领取状态(1:未开始 2:进行中 3:已结束 4:暂停)
        commodityName: "", //备注：商场=商户名字或团购名称 / 商户=团购名称
        pageNum: 1, //备注：页 默认1
        pageSize: 1000 //备注：页数 默认5
      };
      this.$httpAuth({
        url: "/gm/getCommodityList",
        method: "post",
        data: obj
      })
        .then(res => {
          if (res.data.code == 10000) {
            let resp = res.data.resp;
            this.toAudited = resp.total;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    toAddActivity(ev, Id) {
      //去添加活动 或修改活动
      if (ev == 1) {
        this.$router.push("/marketing/createGoods");
      } else if (ev == 2) {
        this.$router.push("/marketing/createGoods");
      }
    },
    handleCommand(item,num) {
      this.selectStatus = num;
      if (this.selectStatus == 1) {
        this.$router.push({
          path: "/marketing/voucherDetails",
          name: "voucherDetails",
          query: {
            commodityId: item.commodityId,
            type: item.commodityType
          }
        });
        return;
      }
      if (this.selectStatus == 2) {
        this.$router.push({
          path: "/marketing/modifyGoods",
          name: "modifyGoods",
          query: {
            commodityId: item.commodityId,
            type: item.commodityType
          }
        });
        return;
      }
      if (this.selectStatus == 3) {
        //审核
        this.toExamine(item.commodityId, item.commodityStatus);
      }
      if (this.selectStatus == 5) {
        this.lowerFrame(item.commodityId);
      }
      if (this.selectStatus == 6) {
        //暂停
        this.suspend(item.commodityId, 6);
      }
      if (this.selectStatus == 7) {
        //取消暂停
        this.suspend(item.commodityId, 3);
      }
      if (this.selectStatus == 8) {
        //查看效果
        this.suspend(item.commodityId, 3);
      }
      this.selectStatus = 0;
    },

    lowerFrame(itemId) {
      //下架
      let obj = {
        commodityId: itemId
      };
      this.$httpAuth({
        url: "/gm/downShelfCommodity",
        method: "post",
        data: obj
      })
        .then(res => {
          if (res.data.code == 10000) {
            let resp = res.data.resp;
            console.log(resp);
            this.$message({
              message: "下架成功",
              type: "success"
            });
            this.getCommodityData();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    toExamine(itemId, status) {
      //审核
      let obj = {
        commodityId: itemId,
        commodityStatus: 2,
        commodityRefuseExplain: ""
      };
      this.$httpAuth({
        url: "/gm/auditCommodity",
        method: "post",
        data: obj
      })
        .then(res => {
          if (res.data.code == 10000) {
            let resp = res.data.resp;
            //console.log(resp)
            this.$message({
              message: resp,
              type: "success"
            });
            this.getCommodityData();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    suspend(itemId, status) {
      //暂停或者恢复团购
      let obj = {
        commodityId: itemId,
        commodityStatus: status
      };
      this.$httpAuth({
        url: "/gm/pauseToTestoreCommodity",
        method: "post",
        data: obj
      })
        .then(res => {
          if (res.data.code == 10000) {
            let resp = res.data.resp;
            //console.log(resp)
            this.getCommodityData();
            if (status == 3) {
              this.$message({
                message: "恢复成功",
                type: "success"
              });
            } else {
              this.$message({
                message: "暂停成功",
                type: "success"
              });
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    handleSelectionChange(val) {
      let arr = [];
      val.forEach(value => {
        arr.push(value.usersId);
      });
      this.selectlist = arr;
    },

    getCommodityData() {
      //获取团购数据
      this.loading = true;
      this.tableData = [];
      this.$httpAuth({
        url: "/gm/getCommodityList",
        method: "post",
        data: this.user
      })
        .then(res => {
          if (res.data.code == 10000) {
            let resp = res.data.resp;
            //console.log(resp)
            if (resp.list == null || resp.list.length == 0) {
            } else {
              this.total = resp.total;
              this.tableData = resp.list;
              this.tableData.forEach((item, index) => {
                let start = new Date(item.commoditySellStartTime);
                let end = new Date(item.commoditySellEndTime);
                let nowTime = new Date();
                if (nowTime.getTime() > end.getTime()) {
                  item.commodityGetStatus = "已结束";
                } else if (nowTime.getTime() > start.getTime()) {
                  item.commodityGetStatus = "进行中";
                } else {
                  item.commodityGetStatus = "未开始";
                }
                return;
              });
              this.loading = false;
            }
          } else {
            this.loading = false;
          }
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
        });
    },

    editActivityData(ev) {
      //修改活动数据
      let obj = {
        activityId: ev.activityId, //类型：Number  必有字段  备注：活动id
        activityTitle: ev.activityTitle, //类型：String  可有字段  备注：活动标题
        activityColor: ev.activityColor, //类型：String  可有字段  备注：标题颜色
        activityImageUrl: ev.activityImageUrl, //类型：String  可有字段  备注：图片url
        activityStartTime: ev.activityStartTime, //类型：String  可有字段  备注：有效期开始
        activityEndTime: ev.activityEndTime, //类型：String  可有字段  备注：有效期结束
        activityContextType: ev.activityContextType, //类型：Number  可有字段  备注：活动内容类型(1:链接跳转 2:富文本内容)
        activityUrl: ev.activityUrl, //类型：String  可有字段  备注：链接类型内容
        activityContext: ev.activityContext, //类型：String  可有字段  备注：富文本内容
        activityIsUse: ev.activityIsUse, //类型：Boolean  可有字段  备注：是否启用
        activityRank: ev.activityRank, //类型：Number  可有字段  备注：序号
        activityIsValidity: ev.activityIsValidity //类型：String  可有字段  备注：是否永久有效
      };
      this.$httpAuth({
        url: "/mall/updateActivity",
        method: "post",
        data: obj
      })
        .then(res => {
          if (res.data.code == 10000) {
            this.getActivityData();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    deteleActivity(ev) {
      //删除活动
      let data = "activityId=" + ev;
      this.$xwhttpAuth({
        url: "/mall/deleteActivity",
        method: "post",
        data: data
      })
        .then(res => {
          if (res.data.code == 10000) {
            let resp = res.data.resp;
            this.$message({
              message: "删除成功",
              type: "success"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    searchChange(ev) {
      //搜索条件的选择 1状态 2领取状态 3劵类型
      if (ev == 1) {
        if (this.commodityStatus == 0) {
          delete this.user.commodityStatus;
        } else {
          this.user.commodityStatus = this.commodityStatus;
        }
      } else if (ev == 2) {
        if (this.commodityGetStatus == 0) {
          delete this.user.commodityGetStatus;
        } else {
          this.user.commodityGetStatus = this.commodityGetStatus;
        }
      } else if (ev == 3) {
        if (this.commodityType == 0) {
          delete this.user.commodityType;
        } else {
          this.user.commodityType = this.commodityType;
        }
      }
    },

    searchEvent() {
      //搜索事件
      this.user.pageNum = 1;
      this.total = 0;
      if (specailTest(this.user.commodityName)) {
        this.$message.info("搜索名称不能包含特殊字符");
        return;
      }
      this.getCommodityData();
    },

    handleSizeChange(val) {
      this.total = 0;
      this.user.pageSize = val;
      this.user.pageNum = 1;
      this.getCommodityData();
    },

    handleCurrentChange(val) {
      this.user.pageNum = val;
      this.getCommodityData();
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
#groupPurchaseManagement {
  padding-bottom: 30px;
  h3 {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #f3f3f3;
    font-size: 14px;
    color: #333;
    font-weight: normal;
  }
  .screenOptions {
    width: 100%;
    margin: 15px 0px;
    overflow: hidden;
    font-size: 14px;
    color: #333;
    .el-button {
      margin-right: 10px;
    }
    .xianshi {
      padding-left: 5px;
      padding-top: 10px;
    }
  }
  .activity-content {
    width: 100%;
    margin: 10px 0;
    overflow: hidden;

    .jinggao {
      i {
        color: #ff9900;
      }
    }
    .operation {
      position: relative;
      // background: red;
      span {
        width: 100%;
        position: absolute;
        left: 0px;
        right: 0px;
        top: 0px;
        bottom: 0px;
        z-index: 3;
        cursor: pointer;
        color: #409eff;
      }
      select {
        width: auto;
        padding: 0 2%;
        margin: 0;
        border: 0;
        appearance: none;
        -moz-appearance: none;
        -webkit-appearance: none;
        cursor: pointer;
        outline: none;
        opacity: 0;
        position: relative;
        z-index: 5;
        option {
          text-align: center;
        }
      }
    }
    .pagination {
      margin: 20px 0 0;
    }
  }
}
</style>
