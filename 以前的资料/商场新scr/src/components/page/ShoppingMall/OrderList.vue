<template>
  <div>
    <div>
      <el-breadcrumb separator="/" class="content_title">
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search_form">
      <el-form ref="form" class="form" :model="sizeForm" label-width="80px">
        <el-form-item label="订单编号:" prop="orderNumber">
          <el-input v-model="sizeForm.orderNumber"></el-input>
        </el-form-item>
        <el-form-item label="选择时间:" prop="data">
          <el-date-picker
            v-model="sizeForm.data"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="——"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="卖家昵称:" prop="nickName">
          <el-input v-model="sizeForm.nickName"></el-input>
        </el-form-item>
        <el-form-item label="订单状态:" prop="orderStatus">
          <el-select v-model="sizeForm.orderStatus">
            <el-option v-for="item in options" :key="item.orderType" :label="item.name" :value="item.orderType"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="10px">
          <el-button type="primary" @click="searchTap">查询</el-button>
          <el-button type="primary" @click="resetForm('form')">重置条件</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table :data="tableData" border style="width: 100%" :cell-style="center" :header-cell-style="center">
        <el-table-column label="买家昵称" prop="users.usersNickName"></el-table-column>
        <el-table-column label="订单号">
          <template slot-scope="scope">
            <el-button type="text" @click="detailsTap(scope.row.orderId)">{{scope.row.orderNumber}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="支付方式">
          <template slot-scope="scope">
            <p class="table_details">{{scope.row.orderPayWay|payway}}</p>
          </template>
        </el-table-column>
        <el-table-column label="实付款">
          <template slot-scope="scope">
            <p class="table_details" v-if="scope.row.orderPayWay===1||scope.row.orderPayWay===3">{{scope.row.orderFactPrices}}</p>
            <p class="table_details" v-if="scope.row.orderPayWay===2||scope.row.orderPayWay===3">{{scope.row.orderFactCoin}}</p>
          </template>
        </el-table-column>
        <el-table-column v-if="orderType !== '1'" label="购买数量" prop="orderCouponNum"></el-table-column>
        <el-table-column label="订单状态">
          <template slot-scope="scope">
            <p class="table_details">{{scope.row.orderStatus|status}}</p>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="orderCreateTime"></el-table-column>
        <el-table-column label="购买门店">
          <template slot-scope="scope">
            <p class="table_details" v-if="scope.row.merchant">{{scope.row.merchant.merchantName}}</p>
            <p class="table_details" v-else>商场</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="detailsTap(scope.row.orderId)">查看详情</el-button>
          </template>
        </el-table-column>
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
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
  
<script>
import bus from "../../common/bus.js";
import { status1, status2 } from "./status.js";
var _this;
export default {
  data() {
    _this = this;
    return {
      orderType: "",
      sizeForm: {
        orderStatus: null,
        nickName: null,
        data: [],
        orderNumber: null
      },
      options: [],
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    };
  },
  created() {
    this.init();
  },
  methods: {
    center() {
      return "text-align: center;";
    },
    // 按类型获取表格数据
    checkingOrder() {
      let startTime;
      let endTime;
      if (this.sizeForm.data && this.sizeForm.data.length > 0) {
        startTime = this.sizeForm.data[0]; //类型：Mixed  可有字段  备注：开始时间
        endTime = this.sizeForm.data[1]; //类型：Mixed  可有字段  备注：结束时间
      } else {
        startTime = null; //类型：Mixed  可有字段  备注：开始时间
        endTime = null; //类型：Mixed  可有字段  备注：结束时间
      }
      this.$httpAuth
        .post("gm/checkingOrder", {
          pageNum: this.currentPage, //类型：Number  必有字段  备注：1
          pageSize: this.pageSize,
          orderType: this.orderType, //类型：Number  必有字段  备注：订单类型：1=买单 2=团购 3=商城
          orderNumber: this.sizeForm.orderNumber
            ? this.sizeForm.orderNumber
            : null, //类型：Mixed  可有字段  备注：订单ID
          orderStatus: this.sizeForm.orderStatus
            ? this.sizeForm.orderStatus
            : null, //类型：Mixed  可有字段  备注：订单状态
          nickName: this.sizeForm.nickName ? this.sizeForm.nickName : null,
          startTime,
          endTime
        })
        .then(result => {
          if (result.data.code === 10000) {
            this.tableData = result.data.resp.list;
            this.total = result.data.resp.total;
          }
        })
        .catch(err => {});
    },
    // 根据路由初始化数据
    init() {
      let orderType = this.$route.fullPath.split("/")[2].substr(-1, 1);
      /*
         @orderType 1=买单  2=团购  3=商城
      */
      this.orderType = orderType;
      if (orderType === "1") {
        this.options = status1;
      } else if (orderType === "2") {
        this.options = status2;
      } else if (orderType === "3") {
        this.options = status1;
      }
      this.checkingOrder();
    },
    // 查询
    searchTap() {
      this.currentPage = 1;
      this.checkingOrder();
    },
    // 重置条件
    resetForm(formName) {
      this.currentPage = 1;
      this.$refs[formName].resetFields();
      this.checkingOrder();
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
      this.currentPage = 1;
      this.pageSize = val;
      this.checkingOrder();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.checkingOrder();
    }
  },
  filters: {
    status(val) {
      // 1:待支付、2:支付成功/可使用、3:已退款、4:交易关闭、5:已使用、6:已过期
      let str = "";
      _this.options.forEach(value => {
        if (value && value.orderType == val) {
          str = value.name;
        }
      });
      return str;
    },
    payway(val) {
      if (val === 1) {
        return "金额";
      } else if (val === 2) {
        return "积分";
      } else if (val === 3) {
        return "金额+积分";
      }
    }
  },
  watch: {
    //   监视路由的变化
    $route() {
      this.init();
    }
  }
};
</script>
  
<style lang="less" scoped>
.search_form {
  margin: 20px 0;
  .form {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>