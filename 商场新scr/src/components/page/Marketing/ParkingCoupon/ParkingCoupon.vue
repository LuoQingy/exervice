<template>
  <div id="activity-management">
    <h3>营销中心/停车券</h3>
    <div class="screenOptions">
      <el-button type="primary" plain @click="searchChange(0)">全部</el-button>
      <el-button type="primary" plain @click="searchChange(3)">已上架</el-button>
      <el-button type="primary" plain @click="searchChange(4)">已下架</el-button>
      <el-button type="primary" plain @click="searchChange(1)">待审核</el-button>
      <el-input
        v-model="user.name"
        @change="searchEvent()"
        @keyup.enter="searchEvent()"
        style="width:200px;margin-right:20px;"
        placeholder="输入停车劵名称"
      ></el-input>
      <el-button type="primary" icon="el-icon-search" @click="searchEvent">搜索</el-button>
    </div>
    <div class="screenOptions">
      <el-button type="danger" @click="goAddParkingCoupon()" class="fr" icon="el-icon-plus">创建停车券</el-button>
    </div>
    <div class="activity-content main">
      <div style="width:100%" class="table">
        <el-table :data="tableData" style="width: 100%" border :cell-style="center" :header-cell-style="tableStyle">
          <el-table-column label="停车券名称" prop="pcName" width="160"></el-table-column>
          <el-table-column label="抵扣时长">
            <template slot-scope="scope">{{scope.row.pcDeductionDuration}}小时</template>
          </el-table-column>
          <el-table-column label="限领次数/张" prop="pcEverydayGetNum"></el-table-column>
          <el-table-column label="券有效期">
            <template slot-scope="scope">领取后{{scope.row.pcValidity}}小时</template>
          </el-table-column>
          <el-table-column label="状态" prop="pcStatusShow" width="100"></el-table-column>
          <el-table-column label="操作" width="140">
            <template slot-scope="scope">
              <div class="oprationspan">
                <span v-if="scope.row.pcStatus==1" @click="toExamine(scope.row)">审核</span>
                <span v-if="scope.row.pcStatus==3||scope.row.pcStatus==6" @click="lowerFrame(scope.row)">下架</span>
                <span v-if="scope.row.pcStatus==1" @click="goEditParkingCoupon(scope.row)">修改</span>
                <span v-if="scope.row.pcStatus==3" @click="suspend(scope.row,6)">暂停</span>
                <span v-if="scope.row.pcStatus==6" @click="suspend(scope.row,3)">取消暂停</span>
                <el-popover v-if="scope.row.pcStatus==4"  placement="top" width="160" v-model="scope.row.visible">
                  <p>确定删除该停车券吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="deleteParking(scope.row)">确定</el-button>
                  </div>
                  <span slot="reference" style="color:red">删除</span>
                </el-popover>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination" style="width:100%">
        <!-- <span class="fr">回到首页</span> -->
        <el-pagination
          background
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="pageNum"
          :page-size="pageSize"
          :page-sizes="[10, 20, 30, 40]"
          layout="total, sizes, prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
  
<script>
import {specailTest} from "@/libs/regular.js";
export default {
  data() {
    return {
      tableData: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      tableStyle: {
        "text-align": "center",
        height: "45px",
        color: "#999999"
      },
      user: {
        status: "", //状态(1:待审核 2:已审核 3:上架 4:下架 6:暂停)
        name: ""
      },
      selectStatus: "0" //操作状态
    };
  },
  created() {
    this.$nextTick(() => {
      this.getCommodityData();
    });
  },
  methods: {
    center() {
      return "text-align: center;";
    },
    goAddParkingCoupon() {
      //去创建停车券
      this.$router.push("/marketing/addParkingCoupon");
    },
    goEditParkingCoupon(item) {
      //去修改停车券
      this.$router.push({
        path: "/marketing/addParkingCoupon",
        query: {
          pcId: item.pcId
        }
      });
    },
    getCommodityData() {
      //获取优惠券
      this.tableData = [];
      this.$httpAuth({
        url: "/mall/getParkingCouponList",
        method: "post",
        data: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          status: this.user.status, //状态(1:待审核 2:已审核 3:上架 4:下架 6:暂停)
          name: this.user.name
        }
      })
        .then(res => {
          if (res.data.code == 10000) {
            let resp = res.data.resp;
            //console.log(resp)
            if (resp.list == null || resp.list.length == 0) {
            } else {
              this.total = resp.total;
              resp.list.forEach((item, index) => {
                  item.visible =false;
                if (item.pcEverydayGetRestrict == 1) {
                  //领取限制
                  item.pcEverydayGetNum = "无条件";
                } else {
                  item.pcEverydayGetNum = "每日" + item.pcEverydayGetNum + "张";
                }
                if (item.pcStatus == 1) {
                  //状态(1:待审核 2:已审核 3:上架 4:下架 6:暂停)
                  item.pcStatusShow = "待审核";
                } else if (item.pcStatus == 2) {
                  item.pcStatusShow = "已审核";
                } else if (item.pcStatus == 3) {
                  item.pcStatusShow = "已上架";
                } else if (item.pcStatus == 4) {
                  item.pcStatusShow = "已下架";
                } else if (item.pcStatus == 6) {
                  item.pcStatusShow = "暂停";
                }
              });
              this.tableData = resp.list;
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    toExamine(item) {
      //审核
      let obj = {
        pcId: item.pcId
      };
      this.$httpAuth({
        url: "/mall/auditParkingCoupon",
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
    lowerFrame(item) {
      //下架
      let obj = {
        pcId: item.pcId
      };
      this.$httpAuth({
        url: "/mall/downShelfParkingCoupon",
        method: "post",
        data: obj
      })
        .then(res => {
          if (res.data.code == 10000) {
            let resp = res.data.resp;
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
    deleteParking(item) {
      let obj = {
        pcId: item.pcId
      };
      this.$httpAuth({
        url: "/mall/deleteParkingCoupon",
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
      //3=恢复 / 6=暂停
      let obj = {
        pcId: item.pcId,
        pcStatus: type
      };
      this.$httpAuth({
        url: "/mall/pauseToTestoreParkingCoupon",
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
      //搜索条件的选择0:全部 1:待审核 2:已审核 3:上架 4:下架
      if (ev == 0) {
        this.user.status = "";
      } else {
        this.user.status = ev;
      }
      this.getCommodityData();
    },
    searchEvent() {
      //搜索事件
      this.pageNum = 1;
      this.total = 0;
      if (specailTest(this.user.name)) {
        this.$message.info("搜索名称不能包含特殊字符");
        return;
      }
      this.getCommodityData();
    },
    handleSizeChange(val) {
      this.pageNum = 1;
      this.pageSize = val;
      this.getCommodityData();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
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
  width: auto;
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
    overflow: hidden;
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
  .main .operating {
    overflow: hidden;
    clear: both;
    padding: 15px 10px;
    border-top: 5px solid #169bd5;
    background: #eff3f8;
    .left {
      float: left;
      font-size: 0;
      span {
        font-size: 14px;
        height: 24px;
        line-height: 24px;
        display: inline-block;
      }
      select {
        width: 50px;
        font-size: 14px;
        height: 22px;
        display: inline-block;
        border: 1px solid #bebebe;
        margin: 0 10px;
      }
    }
  }
  .oprationspan {
    span {
      color: #169bd5;
      font-size: 14px;
      margin: 0 10px;
    }
  }
}
</style>
