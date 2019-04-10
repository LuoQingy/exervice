<template>
  <div>
    <div>
      <el-breadcrumb separator="/" class="content_title">
        <el-breadcrumb-item>智能营销</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search_form">
      <el-form ref="form" class="form" :model="sizeForm" label-width="80px">
        <el-form-item label="活动类型:" prop="marketingType">
          <el-select v-model="sizeForm.marketingType">
            <el-option v-for="item in options" :key="item.type" :label="item.label" :value="item.type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <el-select v-model="sizeForm.status">
            <el-option v-for="item in options2" :key="item.type" :label="item.label" :value="item.type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="planName" label="活动名称">
          <el-input v-model="sizeForm.planName" placeholder="请输入活动名称"></el-input>
        </el-form-item>
        <el-form-item label-width="10px">
          <el-button type="primary" icon="el-icon-search" @click="searchTap">搜索</el-button>
          <el-button type="primary" @click="resetForm('form')">重置条件</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="btn_right">
      <el-button type="danger" icon="el-icon-plus" @click="addTap">创建新活动</el-button>
    </div>
    <div class="table">
      <el-table :data="tableData" border style="width: 100%" :cell-style="center" :header-cell-style="center">
        <el-table-column label="活动名称" prop="planName"></el-table-column>
        <el-table-column label="活动类型">
          <template slot-scope="scope">
            <p class="table_details">{{scope.row.marketingType|type}}</p>
          </template>
        </el-table-column>
        <el-table-column label="活动时间" prop="creationTime"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <p class="table_details">{{scope.row.status|status}}</p>
          </template>
        </el-table-column>
        <el-table-column label="创建人" prop="orderCreateTime">
          <template slot-scope="scope">
            <p class="table_details">商场</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-dropdown>
              <span class="el-dropdown-link">
                更多
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="scope.row.status ===1||scope.row.status ===2">
                  <p @click="marketingPlanById(scope.row.mpId)">修改</p>
                </el-dropdown-item>
                <el-dropdown-item v-if="scope.row.status ===1">
                  <p @click="reviewMarketingPlan(scope.row.mpId)">审核</p>
                </el-dropdown-item>
                <el-dropdown-item v-if="scope.row.status ===5">
                  <p @click=" selectMarketingPlanCouponDetails(scope.row.mpId,scope.row.marketingType)">查看效果</p>
                </el-dropdown-item>
                <el-dropdown-item v-if="scope.row.status !==1&&scope.row.status !==5">
                  <p @click="cancelMarketingPlan(scope.row.mpId)">取消活动</p>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
var _this;
export default {
  data() {
    _this = this;
    return {
      sizeForm: {
        planName: "",
        marketingType: "",
        status: ""
      },
      options: [
        {
          label: "全部",
          type: ""
        },
        {
          label: "短信营销",
          type: "1"
        },
        {
          label: "卡券营销",
          type: "2"
        }
      ],
      options2: [
        {
          label: "全部",
          type: ""
        },
        {
          label: "待审核",
          type: "1"
        },
        {
          label: "已审核",
          type: "2"
        },
        {
          label: "已开始",
          type: "4"
        },
        {
          label: "已结束",
          type: "5"
        }
      ],
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    };
  },
  created() {
    this.marketingPlanList();
  },
  methods: {
    center() {
      return "text-align: center;";
    },
    // 获取营销列表
    marketingPlanList() {
      this.$httpAuth
        .post("/mall/marketingPlanList", {
          marketingType: this.sizeForm.marketingType, //类型：Mixed  可有字段  备注：营销方式：1=短信营销 2=卡券营销
          status: this.sizeForm.status, //类型：Mixed  可有字段  备注：状态：1=待审核 2=已审核 3=未开始 4=已开始 5=已结束 6=已取消
          planName: this.sizeForm.planName, //类型：Mixed  可有字段  备注：营销计划名称
          pageNum: this.currentPage, //类型：Number  必有字段  备注：无
          pageSize: this.pageSize //类型：Number  必有字段  备注：无
        })
        .then(result => {
          if (result.data.code === 10000) {
            this.tableData = result.data.resp.list;
            this.total = result.data.resp.total;
          }
        })
        .catch(err => {});
    },
    //搜索
    searchTap() {
      this.currentPage = 1;
      this.marketingPlanList();
    },
    // 重置条件
    resetForm(formName) {
      this.currentPage = 1;
      this.$refs[formName].resetFields();
      this.marketingPlanList();
    },
    // 新建活动 活动详情
    addTap() {
      this.$router.push({
        name: "addactive"
      });
    },
    // 修改智能营销
    marketingPlanById(mpId) {
      this.$router.push({
        name: "addactive",
        query: { mpId }
      });
    },
    // 审核营销
    reviewMarketingPlan(mpId) {
      this.$httpAuth
        .post("/mall/reviewMarketingPlan", { mpId })
        .then(result => {
          if (result.data.code === 10000) {
            this.$message({
              message: "审核成功",
              type: "success"
            });
            this.marketingPlanList();
          } else {
            this.$message({
              message: result.data.resp,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    // 取消营销
    cancelMarketingPlan(mpId) {
      this.$httpAuth
        .post("/mall/cancelMarketingPlan", { mpId })
        .then(result => {
          if (result.data.code === 10000) {
            this.$message({
              message: "取消成功",
              type: "success"
            });
            this.marketingPlanList();
          } else {
            this.$message({
              message: result.data.resp,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    // 查询营销效果
    selectMarketingPlanCouponDetails(mpId, marketingType) {
      if (marketingType == 1) {
        this.$router.push({ //短信营销
          name: "messageList",
          query: {
            mpId
          }
        });
      }else if (marketingType == 2){ //卡券营销
        this.$router.push({
        name: "PlanCouponDetails",
        query: {
          mpId
        }
      });
      }
    },
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.marketingPlanList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.marketingPlanList();
    }
  },
  filters: {
    status(val) {
      let status;
      _this.options2.forEach(value => {
        if (val == value.type) {
          status = value.label;
        }
      });
      return status;
    },
    type(val) {
      let type;
      _this.options.forEach(value => {
        if (val == value.type) {
          type = value.label;
        }
      });
      return type;
    }
  }
};
</script>
  
<style scoped lang="less">
.search_form {
  margin: 20px 0;
  .form {
    display: flex;
    flex-wrap: wrap;
  }
}

.btn_right {
  text-align: right;
  margin-bottom: 20px;
}

.el-dropdown-link {
  color: #029afe;
}
</style>