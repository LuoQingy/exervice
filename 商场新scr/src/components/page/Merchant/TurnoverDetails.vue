<template>
  <div class="turnovev-list">
    <div>
      <el-breadcrumb separator="/" class="content_title">
        <el-breadcrumb-item>上报明细</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="info">
      <ul class="info_list">
        <el-row :gutter="20">
          <el-col :lg="4" class="list">
            <el-card class="box-card">
              <div slot="header">
                <span>累积上报金额</span>
              </div>
              <div class="number">{{statistics.total}}</div>
            </el-card>
          </el-col>

          <el-col :lg="5" class="list">
            <el-card class="box-card">
              <div slot="header">
                <span>上月累积金额</span>
              </div>
              <div class="number">{{statistics.lastMonth}}</div>
            </el-card>
          </el-col>

          <el-col :lg="5" class="list">
            <el-card class="box-card">
              <div slot="header">
                <span>上周累积金额</span>
              </div>
              <div class="number">{{statistics.lastWeek}}</div>
            </el-card>
          </el-col>

          <el-col :lg="5" class="list">
            <el-card class="box-card">
              <div slot="header">
                <span>昨日上报金额</span>
              </div>
              <div class="number">{{statistics.yesterday}}</div>
            </el-card>
          </el-col>

          <el-col :lg="5" class="list">
            <el-card class="box-card">
              <div slot="header">
                <span>未上报数</span>
              </div>
              <div class="number">{{statistics.nonReport}}</div>
            </el-card>
          </el-col>
        </el-row>
      </ul>
      <div class="search">
        <el-form ref="form" class="form" :model="sizeForm" label-width="80px">
          <el-form-item label="选择时间:">
            <el-date-picker v-model="sizeForm.date" type="date" value-format="yyyy-MM-dd HH:mm:ss " placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="状态:">
            <el-select v-model="sizeForm.status" style="width:150px;">
              <el-option v-for="item in options2" :key="item.type" :label="item.label" :value="item.type"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="10px">
            <el-button type="primary" icon="el-icon-search" @click="searchTap('enter')">查询</el-button>
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
          :header-cell-style="{'background':'#f2f2f2','text-align':'center'}"
        >
          <el-table-column label="上报日期" prop="trReportDate"></el-table-column>

          <el-table-column label="营业额" prop="trReportPrices"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <p class="table_details">{{scope.row.trIsReportStatus|status}}</p>
            </template>
          </el-table-column>
          <el-table-column label="上报时间" prop="trReportTime"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button v-if="!scope.row.trIsReportStatus" type="text" @click="detailsTap(scope.row)">营业额上报</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
    <el-dialog title="营业额上报" :visible.sync="dialogVisible" width="30%" class="tanchuang">
      <el-form ref="form" :model="form" label-width="70px" label-position="right" class="showboxs">
        <el-form-item label="上报日期">
          <el-date-picker disabled v-model="form.trReportDate" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <div class="form-box changecolor">
          &nbsp;&nbsp;
          <span>上报商户:</span>
          {{merchantName}}
        </div>
        <div class="form-box">
          &nbsp;&nbsp;
          <span>当日营业额 :</span>&nbsp;
          <el-input-number v-model="form.trReportPrices" :min="0" controls-position="right" placeholder="请输入营业金额" style="max-width:150px"></el-input-number>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sumbits">确认上报</el-button>
      </span>
    </el-dialog>
  </div>
</template>
  
<script>
import { formatTime } from "@/libs/formdata.js";
import { moneyTest } from "@/libs/regular.js";
export default {
  data() {
    return {
      merchantName: "",
      currentPage: 1,
      pageSize: 10,
      total: 0,
      merchantId: "",
      statistics: {
        nonReport: 0, //类型：Number  必有字段  备注：未上报
        lastMonth: 0, //类型：Number  必有字段  备注：上个月
        lastWeek: 0, //类型：Number  必有字段  备注：上周
        yesterday: 0, //类型：Number  必有字段  备注：昨天
        total: 0, //类型：Number  必有字段  备注：总
        thirtyDay: "0" //类型：String  必有字段  备注：近30天内
      },
      dialogVisible: false,
      form: {
        trReportDate: "",
        trReportPrices: ""
      },
      sizeForm: {
        date: "",
        status: ""
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
      value1: "",
      tableData: []
    };
  },
  mounted() {
    this.getMerchantReportStatistics();
    this.searchTap();
  },
  created() {
    this.merchantId = this.$route.query.merchantId;
  },
  methods: {
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.searchTap();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.searchTap();
    },
    getMerchantReportStatistics() {
      this.$httpAuth({
        url: "/gm/getMerchantReportStatistics",
        method: "post",
        data: {
          merchantId: this.merchantId
        }
      }).then(res => {
        if (res.data.code == 10000) {
          this.statistics = res.data.resp;
        } else {
          this.$message.error(res.data.msg || "报错了");
        }
      });
    },
    // 确认上报
    sumbits() {
      if (!this.form.trReportPrices && this.form.trReportPrices != "0") {
        this.$message({
          message: "请输入上报金额",
          type: "warning"
        });
        return;
      } else if (
        this.form.trReportPrices &&
        !moneyTest(this.form.trReportPrices)
      ) {
        this.$message({
          message: "输入的金额格式不对",
          type: "warning"
        });
        return;
      }
      this.$httpAuth({
        url: "/gm/turnoverReport",
        method: "post",
        data: {
          merchantId: this.merchantId,
          trReportDate: this.form.trReportDate, //类型：String  必有字段  备注：上报日期
          trReportPrices: this.form.trReportPrices
        }
      }).then(res => {
        if (res.data.code == 10000) {
          this.$message.success("上报成功");
          this.searchTap();
          this.form.trReportPrices = "";
          this.dialogVisible = false;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //搜索
    searchTap(enter) {
      let status = null;
      if (this.sizeForm.status == 1) {
        status = true;
      } else if (this.sizeForm.status == 2) {
        status = false;
      }
      if (enter) {
        this.currentPage = 1;
      }
      let alls = {
        merchantId: this.merchantId,
        date: this.sizeForm.date || null,
        status: status,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      };
      this.$httpAuth({
        url: "/gm/getMerchantReportDetail",
        method: "post",
        data: alls
      }).then(res => {
        if (res.data.code == 10000) {
          this.merchantName = res.data.resp.merchantName;
          this.tableData = res.data.resp.info.list;
          this.total = res.data.resp.info.total;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 重置条件
    resetForm(formName) {
      this.sizeForm = {
        date: "",
        status: ""
      };
    },
    // 营业额上报
    detailsTap(row) {
      this.form.trReportDate = row.trReportDate;
      this.form.trReportPrices = "";
      this.dialogVisible = true;
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
  
<style  lang="less">
.tanchuang {
  .el-dialog {
    min-width: 300px !important;
  }
}
.turnovev-list {
  .showboxs {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    .form-box {
      border: 1px solid rgb(242, 242, 242);
      height: 40px;
      line-height: 40px;
      width: 55%;
      margin-bottom: 5px;
      min-width: 288px;
    }

    .changecolor {
      background: rgb(242, 242, 242);
    }
  }
  .info {
    padding: 10px;
    .checklist {
      margin-top: 10px;
      margin-bottom: 10px;
    }
    .info_list {
      // display: flex;
      font-size: 14px;

      .box-card {
        margin-bottom: 10px;
      }
      .list {
        width: 20%;
      }
      @media screen and (max-width: 1660px) {
        .list {
          width: 20%;
        }
      }
      @media screen and (max-width: 1460px) {
        .list {
          width: 50%;
        }
      }
      @media screen and (max-width: 1160px) {
        .list {
          width: 100%;
        }
      }
      .number {
        text-align: center;
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
      }
    }
    .table {
      margin-top: 20px;
    }
  }
}
</style>