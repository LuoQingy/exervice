<template>
  <div id="activity-management">
    <h3>营销中心/领券中心</h3>
    <div class="screenOptions">状态
      <el-select v-model="commodityStatus" @change="searchChange(1)" style="width:150px;margin-right:20px;" placeholder="请选择">
        <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>活动状态
      <el-select v-model="commodityGetStatus" @change="searchChange(2)" style="width:130px;margin-right:20px;" placeholder="请选择">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>劵类型
      <el-select v-model="commodityType" @change="searchChange(3)" style="width:150px;margin-right:20px;" placeholder="请选择">
        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-input
        v-model="user.activityName"
        @change="searchEvent"
        @key.enter="searchEvent"
        style="width:200px;margin-right:20px;"
        placeholder="输入优惠劵名称/商品名"
      ></el-input>
      <el-button type="primary" icon="el-icon-search" @click="searchEvent">搜索</el-button>
    </div>
    <div class="screenOptions1">
      <el-button type="danger" @click="toAddActivity(1,1)" icon="el-icon-plus">创建优惠券</el-button>
    </div>
    <div class="activity-content main">
      <div style="width:100%" class="table">
        <el-table
          :data="tableData"
          style="width: 100%"
          border
          @selection-change="handleSelectionChange"
          :cell-style="center"
          :header-cell-style="tableStyle"
        >
          <el-table-column label="优惠券名称" prop="couponName" width="160"></el-table-column>
          <el-table-column label="券类型" prop="couponType" width="160"></el-table-column>
          <el-table-column label="领取时间" prop="couponCreateTime" width="250">
            <template slot-scope="scope">
              <div v-if="scope.row.couponReceiveStartTime">
                <p class="table_details">{{scope.row.couponReceiveStartTime}}至{{scope.row.couponReceiveEndTime}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="券有效期" width="250">
            <template slot-scope="scope">
              <div v-if="scope.row.couponValidityType==2">
                <p
                  v-if="scope.row.couponValidityStartTime"
                  class="table_details"
                >{{scope.row.couponValidityStartTime}}至{{scope.row.couponValidityEndTime}}</p>
              </div>
              <div v-else>
                <p class="table_details">领取{{scope.row.couponGetDays}}天内有效</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="160">
            <template slot-scope="scope">
              <p>{{scope.row.couponStatus|getstatus}}</p>
            </template>
            <!-- 1=待审核 2=上架 3=下架 4=驳回 5=暂停 -->
          </el-table-column>
          <el-table-column label="活动状态" prop="couponGetStatus" width="160"></el-table-column>
          <el-table-column label="创建人" prop="createPerson" width="160"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div class="operation">
                <select v-model="selectStatus" @change="handleCommand(scope.row)">
                  <option value="1">查看</option>
                  <!-- 1=待审核 2=上架 3=下架 4=驳回 5=暂停 -->
                  <option value="2" v-show="scope.row.couponStatus==4">修改</option>
                  <option value="3" v-show="scope.row.couponStatus==1">审核</option>
                  <option value="5" v-show="scope.row.couponStatus==2||scope.row.couponStatus==5">下架</option>
                  <option value="6" v-show="scope.row.couponStatus==2">暂停</option>
                  <option value="7" v-show="scope.row.couponStatus==5">取消暂停</option>
                  <option value="8" v-show="scope.row.couponStatus==3">查看效果</option>
                </select>
                <span>
                  更多
                  <i class="el-icon-caret-bottom el-icon--right"></i>
                </span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination" style="width:100%">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-sizes="[5, 10, 20, 40]"
          :page-size="pageSize"
          layout="total, prev, pager, next,sizes, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {specailTest} from "@/libs/regular.js";
var _this;
export default {
  data() {
    _this = this;
    return {
      tableData: [],
      activityList: [],
      selectlist: [],
      status: [
        //状态备注：状态：1=待审核 2=上架 3=下架 4=驳回 5=暂停 6=已审核
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
          label: "已上架"
        },
        {
          value: 3,
          label: "已下架"
        },
        {
          value: 4,
          label: "被驳回"
        },
        {
          value: 5,
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
          label: "代金券"
        },
        {
          value: 2,
          label: "折扣券"
        }
      ],
      commodityStatus: "", //状态
      commodityGetStatus: "", //领取状态
      commodityType: "", //劵类型
      pageSize: 5,
      currentPage4: 1,
      total: 0,
      tableStyle: {
        "text-align": "center",
        color: "#999999",
      },
      user: {
        pageNum: 1, //备注：页 默认1
        pageSize: 5, //备注：页数 默认5
        commodityStatus: "", //状态
        commodityGetStatus: "", //领取状态
        commodityType: "", //劵类型
        activityName: ""
      },
      selectStatus: "0" //操作状态
    };
  },
  created() {
    this.$nextTick(() => {
      this.getCommodityData();
    });
  },
  filters: {
    getstatus(value) {
      let str = "";
      _this.status.some(val => {
        if (value == val.value) {
          str = val.label;
          return true;
        }
      });
      return str;
    }
  },
  methods: {
    center() {
      return "text-align: center;";
    },
    toAddActivity(ev, Id) {
      //去创建优惠券
      console.log(Id);
      if (ev == 1) {
        this.$router.push("/marketing/addVoucher");
      } else if (ev == 2) {
        this.$router.push("/marketing/addVoucher?commodityId=" + Id);
      }
      console.log(Id);
    },

    handleSelectionChange(val) {
      let arr = [];
      val.forEach(value => {
        arr.push(value.usersId);
      });
      this.selectlist = arr;
    },

    getCommodityData() {
      //获取优惠券
      this.tableData = [];
      this.$httpAuth({
        url: "/gm/selectCouponAll",
        method: "post",
        data: {
          pageNum: this.user.pageNum,
          pageSize: this.user.pageSize,
          couponStatus: this.user.commodityStatus, //状态1=待审核 2=上架 3=下架 4=驳回 5=暂停
          couponActiveStatus: this.user.commodityGetStatus, //1=未开始 2=进行中 3=已结束 4=暂停
          couponType: this.user.commodityType, //劵类型1=满减券 2=折扣券
          name: this.user.activityName
        }
      })
        .then(res => {
          if (res.data.code == 10000) {
            let resp = res.data.resp;
            //console.log(resp)
            if (resp.list == null || resp.list.length == 0) {
            } else {
              for (let i = 0; i < resp.list.length; i++) {
                let item = resp.list[i];
                //判断优惠券的类型
                if (resp.list[i].couponType == 1) {
                  resp.list[i].couponType = "代金券";
                } else if (resp.list[i].couponType == 2) {
                  resp.list[i].couponType = "折扣券";
                }
                let start = new Date(
                  resp.list[i].couponReceiveStartTime
                ).getTime();
                let end = new Date(resp.list[i].couponReceiveEndTime).getTime();
                let nowTime = new Date().getTime();
                if (
                  item.couponStatus == 1 ||
                  (item.couponStatus == 2 && start > nowTime)||item.couponStatus == 4
                ) {
                  item.couponGetStatus = "未开始";
                } else if (
                  (item.couponStatus == 2&& (start < nowTime)&&(nowTime<end))
                ) {
                  item.couponGetStatus = "进行中";
                } else if (
                  item.couponStatus == 3||(item.couponStatus == 2 && nowTime > end)
                ) {
                  item.couponGetStatus = "已结束";
                } else if (item.couponStatus == 5) {
                  item.couponGetStatus = "暂停";
                }

                if (resp.list[i].couponRsObjectList[0].croObjectType == 1) {
                  //判断创建人
                  resp.list[i].createPerson = "商场";
                } else if (
                  resp.list[i].couponRsObjectList[0].croObjectType == 2
                ) {
                  resp.list[i].createPerson =
                    resp.list[i].couponRsObjectList[0].merchant.merchantName;
                }
              }
              this.total = resp.total;
              this.tableData = resp.list;
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleCommand(item) {
      // 1=查看 2=修改 3=审核  5=下架 6=暂停 7=取消暂停 8=查看效果-->
      if (this.selectStatus == 1) {
        this.$router.push({
          path: "/marketing/addVoucher",
          name: "addVoucher",
          query: {
            couponId: item.couponId,
            chakan: true
          }
        });
      } else if (this.selectStatus == 3) {
        this.$confirm("确定通过优惠券的审核", "审核", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$httpAuth
              .post("/gm/reviewCoupon", {
                couponId: item.couponId,
                couponStatus: 1
              })
              .then(result => {
                if (result.data.code === 10000) {
                  this.getCommodityData();
                  this.$message({
                    type: "success",
                    message: result.data.resp
                  });
                }else{
                  this.$message({
                    type: "warning",
                    message: result.data.msg
                  });
                }
              })
              .catch(err => {});
          })
          .catch(() => {
          });
      } else if (this.selectStatus == 2) {
        this.$router.push({
          name: "addVoucher",
          query: {
            couponId: item.couponId
          }
        });
      } else if (this.selectStatus == 5) {
        //下架
        this.lowerFrame(item);
      } else if (this.selectStatus == 6) {
        //暂停
        this.suspend(item, 1);
      } else if (this.selectStatus == 7) {
        //取消暂停
        this.suspend(item, 2);
      } else if (this.selectStatus == 8) {
        //查看效果
        this.$router.push({
          path: " /MerchantServices/couponTurnover",
          name: "couponTurnover",
          query: {
            couponId: item.couponId
          }
        });
      }
      this.selectStatus='';
    },
    lowerFrame(item) {
      //下架
      let obj = {
        couponId: item.couponId
      };
      this.$httpAuth({
        url: "/gm/closeCoupon",
        method: "post",
        data: obj
      })
        .then(res => {
           if (res.data.code == 10000) {
            let resp = res.data.resp;
            console.log(resp);
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
    suspend(item, type) {
      //暂停或者恢复优惠券1=暂停 2=恢复
      let obj = {
        couponId: item.couponId,
        couponStatus: type
      };
      this.$httpAuth({
        url: "/gm/suspendAndRecoveryCoupon",
        method: "post",
        data: obj
      })
        .then(res => {
          if (res.data.code == 10000) {
            let resp = res.data.resp;
            //console.log(resp)

            if (type == 1) {
              this.$message({
                message: "暂停成功",
                type: "success"
              });
            } else {
              this.$message({
                message: "恢复成功",
                type: "success"
              });
            }
            this.getCommodityData();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    searchChange(ev) {
      //搜索条件的选择 1状态 2领取状态 3劵类型
      if (ev == 1) {
        //1=待审核 2=上架 3=下架 4=驳回 5=暂停
        if (this.commodityStatus == 0) {
          this.user.commodityStatus = "";
        } else {
          this.user.commodityStatus = this.commodityStatus;
        }
      } else if (ev == 2) {
        if (this.commodityGetStatus == 0) {
          this.user.commodityGetStatus = "";
        } else {
          this.user.commodityGetStatus = this.commodityGetStatus;
        }
      } else if (ev == 3) {
        //1=满减券 2=折扣券
        if (this.commodityType == 0) {
          this.user.commodityType = "";
        } else {
          this.user.commodityType = this.commodityType;
        }
      }
    },

    searchEvent() {
      //搜索事件
      this.user.pageNum = 1;
      this.total = 0;
      if (specailTest(this.user.activityName)) {
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
#activity-management {
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
    margin: 10px 0px;
    font-size: 14px;
    color: #333;
    .el-button {
      margin-right: 10px;
    }
  }
  .screenOptions1{
    text-align: right;
    font-size: 14px;
    color: #333;
    .el-button {
      margin-right: 10px;
    }
  }
  .activity-content {
    width: 100%;
    margin: 10px 0;
    overflow: hidden;
    .table {
      background: #ffffff;
      .activity-activityRank {
        width: 35px;
        height: 25px;
        cursor: pointer;
        border: 1px solid #cdcdcd;
      }
    }

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
