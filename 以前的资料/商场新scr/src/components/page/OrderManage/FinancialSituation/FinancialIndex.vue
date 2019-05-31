<template>
  <div class="FinancialIndex">
    <h3>财务概况</h3>
    <div class="top">
      <div>
        <p>{{FinancialList.factGathering}}元</p>
        <p>实收款</p>
      </div>
      <div>
        <p>{{FinancialList.refunded}}元</p>
        <p>已收款</p>
      </div>
      <div>
        <p>{{FinancialList.discountAmount}}元</p>
        <p>优惠金额</p>
      </div>
      <div>
        <p>{{FinancialList.merchantSum}}</p>
        <p>门店数量</p>
      </div>
    </div>
    <div class="search">
      <div class="picker">
        <el-date-picker v-model="searchForm.searchTime" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </div>
      <div class="store">
        <span>门店名称</span>
        <el-input v-model="searchForm.storeinput" style="width:300px;" placeholder="请输入内容"></el-input>
        <el-button type="primary" icon="el-icon-search">查询</el-button>
      </div>
    </div>
    <div class="showtabber">
      <el-table :data="tableData" border style="width: 100%" :header-cell-style="tableStyle" :cell-style="cellStyle">
        <el-table-column label="商户名" width="180">
          <template slot-scope="scope">
            <div>{{scope.row.sellerNameShow}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="sellerPhone" label="手机号" width="180"></el-table-column>
        <el-table-column prop="factGathering" label="实收款"></el-table-column>
        <el-table-column prop="refunded" label="已退款"></el-table-column>
        <el-table-column prop="discountAmount" label="优惠金额"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div style="color:#409EFF;cursor:pointer" @click="goMerchantDetails(scope.row.sellerId,scope.row.sellerType)">查看明细</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pageshow">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.pageNum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="searchForm.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import forlataTime from "../../../common/forlataTime.js";
export default {
  data() {
    return {
      tableStyle: {
        "text-align": "center",
        color: "#999999",
      },
      FinancialList: {
        money: 9898.0,
        text: "待收款"
      },

      tableData: [
        {
          comercialName: "商场",
          tel: "12334354556",
          totalReturns: 232434,
          haveTotal: 32134,
          waitTotal: 3254
        }
      ],
      total: 10,
      searchForm: {
        searchTime: "", //搜索日期
        storeinput: "", //门店名称
        pageNum: 1,
        pageSize: 5
      }
    };
  },
  created() {
    this.totalFinancial();
  },
  methods: {
    cellStyle() {
      //表格居中样式
      return "text-align: center;height:50px;";
    },
    goMerchantDetails(sellerId, sellerType) {
      this.$router.push({
        path: "/OrderManage/MerchantDetails",
        name: "MerchantDetails",
        query: {
          sellerId: sellerId,
          sellerType: sellerType
        }
      });
    },
    handleSizeChange(val) {
      this.searchForm.pageSize = val;
      this.searchForm.pageNum = 1;
      this.totalFinancial();
    },
    handleCurrentChange(val) {
      this.searchForm.pageNum = val;
      this.totalFinancial();
    },
    totalFinancial() {
      let startTime = "";
      let endTime = "";
      if (this.searchForm.searchTime) {
        startTime = forlataTime(this.searchForm.searchTime[0]);
        endTime = forlataTime(this.searchForm.searchTime[1]);
      } else {
        startTime = "";
        endTime = "";
      }
      this.tableData = [];
      this.$httpAuth({
        url: "/mall/totalFinancialStatement",
        method: "post",
        data: {
          startTime: startTime,
          endTime: endTime,
          name: this.searchForm.storeinput,
          pageNum: this.searchForm.pageNum,
          pageSize: this.searchForm.pageSize
        }
      })
        .then(result => {
          if (result.data.code === 10000) {
            this.FinancialList = {
              factGathering: result.data.resp.factGathering, //实收款
              refunded: result.data.resp.refunded, //已退款
              discountAmount: result.data.resp.discountAmount, //优惠金额
              merchantSum: result.data.resp.merchantSum //门店数量
            };
            this.total =
              result.data.resp.totalStatementMerchantListVoList.total;
            let list = result.data.resp.totalStatementMerchantListVoList.list;
            list.forEach((item, index) => {
              if (item.sellerType == 1) {
                item.sellerNameShow = "商场";
              } else {
                item.sellerNameShow = item.sellerName + "商户";
              }
            });
            console.log(list);
            this.tableData = list;
          }
        })
        .catch(err => {});
    }
  }
};
</script>
<style lang="less" scoped>
.FinancialIndex {
  width: 100%;
  h3 {
    height: 35px;
    line-height: 35px;
    border-bottom: 1px solid #f3f3f3;
    text-indent: 15px;
    font-size: 14px;
    color: #333;
    font-weight: normal;
  }
  .top {
    display: flex;
    width: 100%;
    height: 100px;
    margin: 20px 0;
    div {
      flex: 1;
      text-align: center;
      p {
        height: 50px;
        line-height: 50px;
        text-align: center;
      }
      p:nth-child(1) {
        color: red;
        font-size: 24px;
      }
      p:nth-child(2) {
        font-size: 16px;
      }
    }
    div:nth-child(n + 1):nth-child(-n + 3) {
      border-right: 1px solid #ddd;
    }
  }
  .search {
    width: 100%;
    min-width: 1000px;
    height: 100px;
    line-height: 100px;
    background: #f2f2f2;
    .picker {
      display: inline;
      margin: 0 20px;
    }
    .store {
      display: inline;
    }
  }
  .showtabber {
    margin-top: 40px;
  }
  .pageshow {
    float: right;
    margin: 20px 0;
  }
}
</style>
