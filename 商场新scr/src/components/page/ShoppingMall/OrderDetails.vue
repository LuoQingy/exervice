<template>
  <div>
    <div>
      <el-breadcrumb separator="/" class="content_title">
        <el-breadcrumb-item>订单详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="info">
      <p class="info_title">订单信息</p>
      <ul class="info_lists">
        <li class="list"><span>订单编号:</span> <span>{{info.orderNumber}}</span> </li>
        <li class="list"><span>创建时间:</span> <span>{{info.orderCreateTime}}</span> </li>
        <li class="list"><span>付款时间:</span> <span>{{info.orderPayTime}}</span> </li>
        <li class="list"><span>付款方式:</span> <span>{{info.orderPayWay|payway}}</span> </li>
        <li class="list"><span>买家昵称:</span> <span v-if='info.users'>{{info.users.usersNickName}}</span> </li>
        <li class="list"><span>付款金额:</span> <span>{{info.orderFactPrices}}</span> </li>
        <li class="list"><span>订单金额:</span> <span>{{info.orderTotalPrices}}</span> </li>
        <li class="list"><span>退款时间:</span> <span>{{info.orSuccessTime}}</span> </li>
        <li class="list"><span>退款金额:</span> <span>{{info.refundAmount}}</span> </li>
        <li class="list" v-if="info.orderType ===3"><span>购买门店:</span> <span>{{info.storeName?info.storeName:'商场'}}</span> </li>
        <li class="list" v-if="info.orderType ===2"><span>发券人:</span> <span>{{info.storeName?info.storeName:'商场'}}</span> </li>
      </ul>
    </div>
    <div class="table" v-if="info.orderType !==1">
      <el-table :data="tableData" style="width: 100%" :cell-style="()=>'text-align: center;'" :header-cell-style="()=>'text-align: center;'">
        <el-table-column label="商品">
          <template slot-scope="scope">
            <div style="display:flex;align-items: center;">
              <p class="table_details">
                <img class="img" :src="info.orderGoodsImages" alt="">
              </p>
              <p class="table_details">{{info.orderGoodsName}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="单价" prop="odGoodsCurrentPrices"></el-table-column>
        <el-table-column label="券码">
          <template slot-scope="scope">
            <p :class="scope.row.usersCoupon.ucouStatus ===2?'del':''">{{scope.row.usersCoupon.ucouCouponCode}}</p>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <p class="table_details">{{scope.row.usersCoupon.ucouStatus|status}}</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
  
<script>
var _this;
export default {
  data() {
    _this = this;
    return {
      info: "",
      tableData: [],
      orderid: ""
    };
  },
  created() {
    console.log(this.$route.query.orderid);
    this.orderid = this.$route.query.orderid;
    this.orderDetails();
  },
  methods: {
    orderDetails() {
      this.$httpAuth
        .post("gm/orderDetails", {
          orderId: this.orderid
        })
        .then(result => {
          if (result.data.code === 10000) {
            this.info = result.data.resp;
            this.tableData = result.data.resp.orderDetailsList;
          }
        })
        .catch(err => {});
    }
  },
  filters: {
    status(val) {
      // 状态(1:未使用 2:已使用 3:已退款)
      if (val === 1) {
        return "未使用";
      } else if (val === 2) {
        return "已使用";
      } else if (val === 3) {
        return "已退款";
      }
    },
    payway(val) {
      if (val === 1) {
        // 支付渠道(1:微信 2:支付宝(口碑) 3:其他)
        let str;
        if (_this.info.orderPayChannel === 1) {
          str = "微信支付";
        } else if (_this.info.orderPayChannel === 2) {
          str = "支付宝(口碑)支付";
        } else if (_this.info.orderPayChannel === 3) {
          str = "其他支付";
        }
        return str;
      } else if (val === 2) {
        return "积分";
      } else if (val === 3) {
        return "金额+积分";
      }
    }
  }
};
</script>
  
<style scoped lang='less'>
.info {
  margin-top: 20px;
  background: #fbfbfb;
  .info_title {
    height: 32px;
    line-height: 32px;
    background: #f2f2f2;
    padding-left: 20px;
  }
  .info_lists {
    padding: 20px 0 50px 20px;
    font-size: 14px;
    .list {
      margin-bottom: 10px;
    }
  }
}
.table {
  margin-top: 20px;
  border: 1px solid #ebeef5;
  border-bottom: none;
  .del {
    text-decoration: line-through;
  }
}
.img {
  width: 60px;
  height: 60px;
  margin-right: 10px;
}
</style>