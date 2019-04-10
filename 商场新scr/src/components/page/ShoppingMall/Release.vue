<template>
  <div>
    <div>
      <el-breadcrumb separator="/" class="content_title">
        <el-breadcrumb-item>商城管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="searchBtn">
      <div>
        <span>状态</span>
        <el-select v-model="status">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div>
        <el-button icon="el-icon-plus" type="danger" size="mini" @click="detailsTap">发布商品</el-button>
      </div>
    </div>
    <div class="table_box">
      <div class="table">
        <el-table :data="GoodsList" border style="width: 100%" :cell-style="center" :header-cell-style="center">
          <el-table-column label="商品编号" prop="mgId"></el-table-column>
          <el-table-column label="商品名称" prop="mgName"></el-table-column>
          <el-table-column label="所属用户" prop="objectType"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <p class="table_details">
                {{scope.row.mgStatus|status}}
                <el-tooltip class="item" effect="dark" :content="scope.row.mgRejectExplain" placement="top">
                  <i v-if="scope.row.mgStatus ==4" class="el-icon-warning"></i>
                </el-tooltip>
              </p>
            </template>
          </el-table-column>
          <el-table-column label="最后一次操作时间" prop="mgCreateTime"></el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.mgStatus !=1"
                type="text"
                icon="el-icon-edit"
                size="mini"
                @click="detailsTap(scope.row.mgId)"
              >查看修改</el-button>
              <el-button v-if="scope.row.mgStatus ==1" type="primary" size="mini" @click="detailsTap(scope.row.mgId,'GoodsReview')">审核</el-button>
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
let vm;
export default {
  data() {
    vm = this;
    return {
      status: "", //查询的商品状态
      options: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "待审核",
          value: 1
        },
        {
          label: "已下架",
          value: 2
        },
        {
          label: "已上架",
          value: 3
        },
        {
          label: "已驳回",
          value: 4
        }
      ], //商品状态选择
      GoodsList: [], //商品列表
      currentPage: 1, //当前页面
      pageSize: 10, //一页几条数据
      total: 10 //搜索结果的数据数量
    };
  },
  created() {
    this.mallGoodsList();
  },
  methods: {
    center() {
      return "text-align: center;";
    },
    // 获取商品列表
    mallGoodsList() {
      this.$httpAuth
        .post("gm/mallGoodsList", {
          mgStatus: this.status,
          pageNum: this.currentPage,
          pageSize: this.pageSize
        })
        .then(result => {
          if (result.data.code === 10000) {
            this.GoodsList = result.data.resp.list;
            this.total = result.data.resp.total;
          }
        })
        .catch(err => {});
    },
    // 商品详情
    detailsTap(id, GoodsReview) {
      if (typeof id != "object") {
        let query = {goodsid: id};
        if (GoodsReview) {
          query.chakan = 'true';
          query.GoodsReview = 'true';
        }
        this.$router.push({
          name: "goods",
          query
        });
      } else {
        this.$router.push({
          name: "goods"
        });
      }
    },
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.mallGoodsList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.mallGoodsList();
    }
  },
  watch: {
    status() {
      this.currentPage = 1;
      this.mallGoodsList();
    }
  },
  filters: {
    status(val) {
      let label;
      vm.options.forEach(value => {
        if (val == value.value) {
          label = value.label;
        }
      });
      return label;
    }
  }
};
</script>

<style scoped lang="less">
.searchBtn {
  margin: 10px;
  display: flex;
  justify-content: space-between;
  .btn {
    width: 80px;
  }
  .el-icon-download {
    font-weight: bolder;
  }
}
.table_box {
  /*border-top: 3px solid #324157;*/
  margin-top: 40px;
}
.table {
  .el-icon-warning {
    margin-left: 10px;
    color: #ff9900;
    font-size: 16px;
  }
}
</style>
