<template>
  <div>
    <div>
      <el-breadcrumb separator="/" class="content_title">
        <el-breadcrumb-item>抄表上报</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="info">
      <div class="checklist">
        <el-radio-group v-model="radio" @change="radiochang">
          <el-radio-button label="物业报修"></el-radio-button>
          <el-radio-button label="营业额上报"></el-radio-button>
        </el-radio-group>
      </div>
      <ul class="info_list">
        <li class="list">
          <span class="number">{{StatisticsData.yesterdayReport}}</span>
          <span>昨日上报商户</span>
        </li>
        <li class="list">
          <span class="number">{{StatisticsData.yesterdayNonReport}}</span>
          <span>昨日未上报商户</span>
        </li>
        <li class="list">
          <span class="number">{{StatisticsData.todayReport}}</span>
          <span>今日上报商户</span>
        </li>
        <li class="list">
          <span class="number">{{StatisticsData.yesterdayReportSum}}</span>
          <span>昨日上报总金额</span>
        </li>
        <li class="list">
          <span class="number">{{StatisticsData.thisMonthReportSum}}</span>
          <span>本月累计上报金额</span>
        </li>
      </ul>
      <div class="search">
        <el-form ref="form" class="form" :model="sizeForm" label-width="80px">
          <el-form-item label="选择时间:" prop="date">
            <el-date-picker v-model="sizeForm.date" type="date" value-format='yyyy-MM-dd' placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="状态:" prop="status">
            <el-select v-model="sizeForm.status" style="width:150px;">
              <el-option v-for="item in options2" :key="item.type" :label="item.label" :value="item.type"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商户名称:" prop="merchantName">
            <el-input v-model="sizeForm.merchantName" style="width:150px;"></el-input>
          </el-form-item>
          <el-form-item label-width="10px">
            <el-button type="primary" icon="el-icon-search" @click="searchTap('enter')">搜索</el-button>
            <el-button type="primary" @click="resetForm('form')">重置条件</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          :cell-style="{'text-align':'center'}"
          :header-cell-style="{'text-align':'center'}"
        >
          <el-table-column label="ID" prop="merchantId" width="100"></el-table-column>
          <el-table-column label="商户名称" prop="merchantName"></el-table-column>
          <el-table-column label="上报时间">
            <template slot-scope="scope">
              <p v-if="scope.row.trIsReportStatus">{{scope.row.trReportTime}}</p>
              <p v-else>暂无</p>
            </template>
          </el-table-column>
          <el-table-column label="上报金额">
            <template slot-scope="scope">
              <p v-if="scope.row.trIsReportStatus">{{scope.row.trReportPrices}}</p>
              <p v-else>暂无</p>
            </template>
          </el-table-column>
          <el-table-column label="上报状态">
            <template slot-scope="scope">
              <p class="table_details">{{scope.row.trIsReportStatus|status}}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="detailsTap(scope.row.merchantId)">查看详情</el-button>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      radio: "营业额上报",
      sizeForm: {
        date: "", //类型：String  可有字段  备注：搜索时间
        status: "", //类型：Mixed  可有字段  备注：搜索状态
        merchantName: "" //类型：Mixed  可有字段  备注：搜索商户名
      },
      options2: [
        {
          label: "全部",
          type: ""
        },
        {
          label: "已上报",
          type: "1"
        },
        {
          label: "未上报",
          type: "2"
        }
      ],
      tableData: [],
      StatisticsData: {},
      currentPage: 1,
      pageSize: 10,
      total: 0
    };
  },
  created() {
    this.getTurnoverReportMerchantList();
    this.getTurnoverReportStatistics();
  },
  methods: {
    radiochang(val) {
      if (val === "营业额上报") {
        return;
      } else if (val === "物业报修") {
        this.$router.push("/merchant/repairlist");
      }
    },
    //搜索
    searchTap() {
      this.currentPage = 1;
      this.getTurnoverReportMerchantList();
    },
    // 获取统计
    getTurnoverReportStatistics() {
      this.$httpAuth
        .post("/mall/getTurnoverReportStatistics")
        .then(result => {
          if (result.data.code === 10000) {
            this.StatisticsData = result.data.resp;
          } else {
            this.$message({
              message: result.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    // 营业表格
    getTurnoverReportMerchantList() {
      let status = null;
      if (this.sizeForm.status == 1) {
        status = true;
      } else if (this.sizeForm.status == 2) {
        status = false;
      }
      this.$httpAuth
        .post("/mall/getTurnoverReportMerchantList", {
          date: this.sizeForm.date ? this.sizeForm.date : null, //类型：String  可有字段  备注：搜索时间
          status, //类型：Mixed  可有字段  备注：搜索状态
          merchantName: this.sizeForm.merchantName
            ? this.sizeForm.merchantName
            : null, //类型：Mixed  可有字段  备注：搜索商户名
          pageNum: this.currentPage, //类型：Number  可有字段  备注：页 默认1
          pageSize: this.pageSize
        })
        .then(result => {
          if (result.data.code === 10000) {
            this.tableData = result.data.resp.list;
            this.total = result.data.resp.total;
          } else {
            this.$message({
              message: result.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    // 重置条件
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getTurnoverReportMerchantList();
    },
    // 查看详情
    detailsTap(merchantId) {
        this.$router.push({
            path:'/merchant/TurnoverDetails',
            query:{
                merchantId
            }
        })
    },
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getTurnoverReportMerchantList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTurnoverReportMerchantList();
    }
  },
  filters: {
    status(val) {
      if (val) {
        return "已上报";
      } else {
        return "未上报";
      }
    }
  }
};
</script>

<style scoped lang="less">
.info {
  padding: 10px;
  .checklist {
    margin-top: 20px;
    margin-bottom: 10px;
  }
  .info_list {
    display: flex;
    font-size: 14px;
    .list {
      border: 1px solid #efefef;
      border-radius: 4px;
      height: 70px;
      width: 19%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      box-sizing: border-box;
      margin-right: 10px;
    }
    .number {
      font-size: 22px;
      font-weight: bold;
    }
  }
  .search {
    padding: 20px 20px 10px;
    background: #f2f2f2;
    margin-top: 10px;
    .form {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
  }
  .table {
    margin-top: 20px;
  }
}
</style>
