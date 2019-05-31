<template>
  <div id="activity-management">
    <h3>停车订单</h3>
    <div class="screenOptions">
      <div class="searchCondition">订单编号：
        <el-input v-model="user.orderNumber" @change="getCommodityData()" style="width:240px;margin-right:20px;" placeholder="输入订单编号"></el-input>选择时间：
        <el-date-picker
          @change="getCommodityData()"
          v-model="searchTime"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </div>
      <div class="searchCondition">买家昵称：
        <el-input v-model="user.nickName" @change="getCommodityData()" style="width:240px;margin-right:20px;" placeholder="输入订单编号"></el-input>订单状态
        <el-select v-model="user.orderStatus" @change="getCommodityData()" style="width:150px;margin-right:20px;" placeholder="请选择">
          <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
    </div>
    <div class="activity-content main">
      <div style="width:100%" class="table">
        <el-table :data="tableData" style="width: 100%" border :cell-style="center" :header-cell-style="tableStyle">
          <el-table-column label="订单编号" prop="couponName" width="120"></el-table-column>
          <el-table-column label="买家昵称" prop="couponType" width="120"></el-table-column>
          <el-table-column label="订单类型" prop="couponCreateTime" width="160">
            <template slot-scope="scope">
              <div>
                <p class="table_details">{{scope.row.couponReceiveStartTime}}-{{scope.row.couponReceiveEndTime}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="入场时间" width="160">
            <template slot-scope="scope">
              <div v-if="scope.row.couponValidityType==2">
                <p class="table_details">{{scope.row.couponValidityStartTime}}-{{scope.row.couponValidityEndTime}}</p>
              </div>
              <div v-else>
                <p class="table_details">领取{{scope.row.couponGetDays}}天内有效</p>
              </div>
              <!-- <p class="table_details">{{scope.row.usersPhoneNumber}}</p> -->
            </template>
          </el-table-column>
          <el-table-column label="停车时长" prop="couponStatusShow" width="160">
            <!-- 1=待审核 2=上架 3=下架 4=驳回 5=暂停 -->
          </el-table-column>
          <el-table-column label="车牌号" prop="couponGetStatus" width="160"></el-table-column>
          <el-table-column label="实付款" prop="createPerson" width="120"></el-table-column>
          <el-table-column label="支付方式" prop="createPerson" width="120"></el-table-column>
          <el-table-column label="订单状态" prop="createPerson" width="160"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span style="color:#169BD5" @click="goParkOrderInfo">查看详情</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination" style="width:100%">
        <!-- <span class="fr">回到首页</span> -->
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
export default {
  data() {
    return {
      tableData: [],
      activityList: [],
      searchTime: "",
      status: [
        //状态备注：状态(1=待审核 2=上架 3=下架 4=驳回 5=暂停)
        {
          value: 1,
          label: "待付款"
        },
        {
          value: 2,
          label: "已退款"
        },
        {
          value: 3,
          label: "交易成功"
        },
        {
          value: 4,
          label: "交易关闭"
        },
        {
          value: 5,
          label: "待结算"
        }
      ],
      pageSize: 5,
      currentPage4: 4,
      total: 0,
      tableStyle: {
        "text-align": "center",
        color: "#999999",
      },
      user: {
        pageNum: 1,
        pageSize: 5,
        orderNumber: "", //订单ID
        orderStatus: "", //订单状态
        startTime: "", //开始时间
        endTime: "", //结束时间
        nickName: "" //买家昵称
      },
      selectStatus: "0" //操作状态
    };
  },
  created() {
    this.$nextTick(() => {
      this.getCommodityData();
    });
  },
  mounted() {},
  methods: {
    center() {
      return "text-align: center;";
    },
    goParkOrderInfo() {
      this.$router.push({
        path: "/marketing/ParkOrderInfo",
        query: {}
      });
    },
    getCommodityData() {
      //获取停车订单
      this.tableData = [];
      if (this.searchTime == null || this.searchTime.length == 0) {
        //解析时间
        this.user.startTime = "";
        this.user.endTime = "";
      } else {
        this.user.startTime = this.forlataTime(this.searchTime[0]);
        this.user.endTime = this.forlataTime(this.searchTime[1]);
      }
      this.$httpAuth({
        url: "/gm/checkingOrder",
        method: "post",
        data: {
          pageNum: this.user.pageNum,
          pageSize: this.user.pageSize,
          orderType: 2,
          orderNumber: this.user.orderNumber, //订单ID
          orderStatus: this.user.orderStatus, //订单状态
          startTime: this.user.startTime, //开始时间
          endTime: this.user.endTime, //结束时间
          nickName: this.user.nickName //买家昵称
        }
      })
        .then(res => {
          if (res.data.code == 10000) {
            let resp = res.data.resp;
            //console.log(resp)
            if (resp.list == null || resp.list.length == 0) {
            } else {
              for (let i = 0; i < resp.list.length; i++) {
                if (resp.list[i].couponStatus == 1) {
                  //判断状态
                  resp.list[i].couponStatusShow = "待审核";
                } else if (resp.list[i].couponStatus == 2) {
                  resp.list[i].couponStatusShow = "已上架";
                } else if (resp.list[i].couponStatus == 3) {
                  resp.list[i].couponStatusShow = "已下架";
                } else if (resp.list[i].couponStatus == 4) {
                  resp.list[i].couponStatusShow = "被驳回";
                } else if (resp.list[i].couponStatus == 5) {
                  resp.list[i].couponStatusShow = "暂停";
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

    handleSizeChange(val) {
      this.total = 0;
      //console.log(this.pageSize);
      this.user.pageSize = val;
      this.user.pageNum = 1;
      this.getCommodityData();
      //console.log(`每页 ${val} 条`);
    },

    handleCurrentChange(val) {
      //console.log(`当前页: ${val}`);
      //console.log(val)
      this.user.pageNum = val;
      this.getCommodityData();
    },
    forlataTime(time) {
      //解析时间的函数
      //参数time为从后台取到的毫秒数
      //console.log(time)
      var dataTime = new Date(time);
      var y = dataTime.getFullYear(); //显示年
      var m = dataTime.getMonth() + 1; //显示月
      m = m < 10 ? "0" + m : m;
      var d = dataTime.getDate(); //显示日
      d = d < 10 ? "0" + d : d;
      var h = dataTime.getHours(); //显示小时
      h = h < 10 ? "0" + h : h;
      var minute = dataTime.getMinutes(); //显示分钟
      minute = minute < 10 ? "0" + minute : minute;
      var second = dataTime.getSeconds(); //显示秒
      second = second < 10 ? "0" + second : second;
      return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
      // return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;     //返回最终时间y-m-d h-m
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
    margin: 20px 10px;
    .searchCondition {
      margin: 10px 0;
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
