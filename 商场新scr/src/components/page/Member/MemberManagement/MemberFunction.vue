<template>
  <div>
    <div>
      <el-breadcrumb separator="/" class="content_title">
        <el-breadcrumb-item :to="{ path: '/member/management' }">会员管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/member/lists' }">会员列表</el-breadcrumb-item>
        <el-breadcrumb-item>会员详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="function">
      <div class="user_msg">
        <div class="list">
          <span>用户卡号:</span>
          <span>{{usersMemberCardList.umcNum}}</span>
        </div>
        <div class="list">
          <span>用户手机号:</span>
          <span>{{userInfo.usersPhoneNumber}}</span>
        </div>
      </div>
      <ul class="details">
        <li class="details_list">
          <p class="detailsnum">{{userBehaviorRecord.ubrAvailableCoin}}</p>
          <p>可用积分</p>
        </li>
        <li class="details_list">
          <p class="detailsnum">{{userBehaviorRecord.ubrAccumulateCoin}}</p>
          <p>累计积分</p>
        </li>
        <li class="details_list">
          <p class="detailsnum">{{userBehaviorRecord.ubrTotal}}</p>
          <p>消费总额</p>
        </li>
        <li class="details_list">
          <p class="detailsnum">{{userBehaviorRecord.ubrExpenditureNum}}</p>
          <p>消费次数</p>
        </li>
        <li class="details_list">
          <p class="detailsnum">{{usersMemberGrade.umgName}}</p>
          <p>当前等级</p>
        </li>
        <li class="details_list">
          <p class="detailsnum">{{userBehaviorRecord.couponCount?userBehaviorRecord.couponCount:0}}</p>
          <p>卡券</p>
        </li>
        <li class="details_list">
          <p class="detailsnum">{{userBehaviorRecord.ubrGroupOrder}}</p>
          <p>团购订单</p>
        </li>
        <li class="details_list">
          <p class="detailsnum">{{userBehaviorRecord.ubrCollectMerchant}}</p>
          <p>收藏商户</p>
        </li>
        <li class="details_list">
          <p class="detailsnum">{{userBehaviorRecord.ubrBrowseNum}}</p>
          <p>浏览次数</p>
        </li>
        <li class="details_list">
          <p class="detailsnum">{{userBehaviorRecord.ubrOfflineNum}}</p>
          <p>线下到访次数</p>
        </li>
      </ul>
    </div>
    <div class="table_details">
      <div>
        <el-radio-group v-model="radio" @change="getUserRecord">
          <el-radio-button label="1">积分记录</el-radio-button>
          <el-radio-button label="2">等级记录</el-radio-button>
          <el-radio-button label="3">消费记录</el-radio-button>
          <el-radio-button label="4">卡券记录</el-radio-button>
          <el-radio-button label="5">团购记录</el-radio-button>
          <el-radio-button label="6">收藏商户</el-radio-button>
          <el-radio-button label="7">浏览记录</el-radio-button>
          <el-radio-button label="8">线下到访记录</el-radio-button>
        </el-radio-group>
      </div>
      <div>
        <el-table :data="tableData.list" border style="width: 100%">
          <template v-for="item in header">
            <el-table-column :prop="item.prop" :label="item.label">
              <template slot-scope="scope">
                <p v-if="item.fliter&&item.prop=='crUnknown'">{{scope.row[item.prop]==1?"来源":'消耗'}}</p>
                <p v-else-if="item.fliter&&item.prop=='orderType'">{{scope.row[item.prop]|ordertype}}</p>
                <p v-else-if="item.fliter&&item.prop=='ucouStatus'">{{scope.row[item.prop]==1?"未使用":'已使用'}}</p>
                <p v-else-if="item.fliter&&item.prop=='commodityStatus'">{{scope.row[item.prop]|commodityStatus}}</p>
                <p v-else-if="item.fliter&&item.prop=='orderId'" @click="detailsTap(scope.row[item.prop])">
                  <el-button type="text">查看详情</el-button>
                </p>
                <p v-else-if="item.fliter&&item.prop=='usersId'">
                  <el-button type="text">查看详情</el-button>
                </p>
                <p v-else>{{scope.row[item.prop]}}</p>
              </template>
            </el-table-column>
          </template>
        </el-table>
        <div class="pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            background
            layout="total, sizes, prev, pager, next"
            :total="tableData.total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import { headers } from "./tableHeader.js";
import { formdata } from "@/libs/formdata.js";
export default {
  data() {
    return {
      radio: 1,
      userId: "",
      header: [],
      currentPage: 1,
      pageSize: 10,
      tableData: [],
      usersMemberCardList: {},
      userBehaviorRecord: {},
      usersMemberGrade: {},
      userInfo: {}
    };
  },
  created() {
    this.userId = this.$route.query.userId;
    this.radio = this.$route.query.type;
    this.getUserRecord();
    this.getuserinfo();
  },
  methods: {
    // 获取相应的记录列表
    getUserRecord() {
      let data = formdata({
        type: this.radio,
        usersId: this.userId,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      });
      this.header = headers[this.radio];
      this.$xwhttpAuth
        .post("mall/getUsersRecord", data)
        .then(result => {
          if (result.data.code === 10000) {
            let _this = this;
            setTimeout(function() {
              _this.tableData = result.data.resp;
            }, 200);
          } else {
            let _this = this;
            setTimeout(function() {
              _this.tableData = [];
            }, 200);
          }
        })
        .catch(err => {});
    },
    // 获取用户消费 积分等数额
    getuserinfo() {
      let formData = formdata({
        usersId: this.userId
      });
      this.$httpAuth
        .post("mall/getUsersInfo", formData)
        .then(result => {
          const data = result.data.resp;
          if (result.data.code === 10000) {
            this.userInfo = data;
            this.usersMemberCardList = data.usersMemberCardList[0];
            this.userBehaviorRecord = data.userBehaviorRecord;
            this.usersMemberGrade =
              data.usersMemberCardList[0].usersMemberGrade;
          } else {
          }
        })
        .catch(err => {});
    },
     // 查看详情
    detailsTap(id) {
      this.$router.push({
        name: "orderdetails",
        query: {
          orderid: id
        }
      });
    },
    handleSizeChange(val) {
      this.currentPage =1;
      this.pageSize = val;
      this.getUserRecord();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getUserRecord();
    }
  },
  filters: {
    ordertype(val) {
      let type;
      switch (val) {
        case 1:
          type = "买单";
          break;
        case 2:
          type = "团购";
          break;
        case 3:
          type = "商城";
          break;
        default:
          type = "未知";
          break;
      }
      return type;
    },
    commodityStatus(val) {
      let type;
      switch (val) {
        case 1:
          type = "未开始";
          break;
        case 2:
          type = "进行中";
          break;
        case 3:
          type = "结束";
          break;
        default:
          type = "暂停";
          break;
      }
      return type;
    }
  },
  watch: {
    tableData() {}
  }
};
</script>
  
<style scoped lang="less">
.function {
  border: 1px solid #cccccc;
  margin-top: 15px;
  font-size: 14px;
  .user_msg {
    display: flex;
    height: 38px;
    line-height: 38px;
    background: #f2f2f2;
    padding-left: 10px;
    .list {
      width: 300px;
    }
  }
  .details {
    display: flex;
    justify-content: space-between;
    .details_list {
      flex: 1;
      height: 70px;
      display: flex;
      flex-flow: column;
      align-items: center;
      justify-content: center;
      color: #cccccc;
      .detailsnum {
        font-size: 16px;
        font-weight: 300;
        color: #000;
        margin-bottom: 10px;
      }
    }
  }
}
.table_details {
  padding-left: 10px;
  margin-top: 30px;
}
.pagination {
  text-align: right;
  margin: 20px 0 0;
}
</style>