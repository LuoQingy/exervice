<template>
  <div>
    <div>
      <el-breadcrumb separator="/" class="content_title">
        <el-breadcrumb-item>会员分组详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="table">
      <p class="title">会员共{{total}}人</p>
      <el-table
        :data="tableData"
        :default-sort="{prop: 'costFee', order: 'descending'}"
        @sort-change="sortchang"
        style="width: 100%"
        :cell-style="()=>'text-align: center;'"
        :header-cell-style="()=>'background: #f1f3f7;text-align: center;'"
      >
        <el-table-column label="会员信息">
          <template slot-scope="scope">
            <div class="message">
              <img class="user_img" :src="scope.row.portrait" alt>
              <span>{{scope.row.nickName}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="性别" width="50px">
          <template slot-scope="scope">
            <p class="table_details">{{scope.row.sex|label}}</p>
          </template>
        </el-table-column>
        <el-table-column label="会员状态">
          <template slot-scope="scope">
            <p class="table_details">微信:{{scope.row.wxConcernStatus|status}}关注</p>
            <p class="table_details">口碑:{{scope.row.wxConcernStatus|status}}关联</p>
          </template>
        </el-table-column>
        <el-table-column prop="membergGrade" label="会员等级"></el-table-column>
        <el-table-column prop="costFee" sortable="custom" label="消费总额" width="100px"></el-table-column>
        <el-table-column prop="costNumber" sortable="custom" label="消费次数" width="100px"></el-table-column>
        <el-table-column prop="lastFee" sortable="custom" label="最近消费时间"></el-table-column>
        <el-table-column prop="addTime" sortable="custom" label="新增时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="detailsTap(scope.row.usersId)">查看</el-button>
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
export default {
  data() {
    return {
      searchCondition: "",
      tableData: [],
      sortColName: "1",
      sortType: "desc",
      currentPage: 1,
      pageSize: 10,
      total: 0
    };
  },
  created() {
    this.mgId = this.$route.query.mgId;
    this.getMembersGroupUsersList();
  },
  methods: {
    // 获取会员分组列表
    getMembersGroupUsersList() {
      this.$httpAuth
        .post("mall/getMembersGroupUsersList", {
          mgId: this.mgId,
          sortColName: this.sortColName, //类型：Mixed  可有字段  备注：排序列名 1=消费总额 / 2=消费次数 / 3=最近消费时间 / 4=新增时间
          sortType: this.sortType, //类型：Mixed  可有字段  备注：排序方式 asc=升序 / desc=降序
          pageNum: this.currentPage, //类型：String  可有字段  备注：默认1
          pageSize: this.pageSize
        })
        .then(result => {
          if (result.data.code === 10000) {
            this.total = result.data.resp.total;
            this.tableData = result.data.resp.list;
          } else  {
            this.$message({
              message: result.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    // 会员详情
    detailsTap(userid) {
      this.$router.push({
        name: "memberDetails",
        query: { userid }
      });
    },
    // 排序
    sortchang(data) {
      switch (data.prop) {
        case "costFee":
          this.sortColName = "1";
          break;
        case "costNumber":
          this.sortColName = "2";
          break;
        case "lastFee":
          this.sortColName = "3";
          break;
        case "addTime":
          this.sortColName = "4";
          break;
        default:
          this.sortColName = "1";
          break;
      }
      switch (data.order) {
        case "ascending":
          this.sortType = "asc";
          break;
        case "descending":
          this.sortType = "desc";
          break;
        default:
          this.sortType = "desc";
          break;
      }
      this.getMembersGroupUsersList();
    },
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getMembersGroupUsersList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getMembersGroupUsersList();
    }
  },
  filters: {
    label(val) {
      if (val == 1) {
        return "男";
      } else if (val == 2) {
        return "女";
      } else {
        return "未知";
      }
    },
    status(val) {
      if (val == 1) {
        return "已";
      } else if (val == 2) {
        return "未";
      } else {
        return "取消";
      }
    }
  }
};
</script>
  
<style scoped lang="less">
.table {
  margin-top: 30px;
  .title {
    margin-bottom: 10px;
    color: #e69e33;
  }
}
.message {
  display: flex;
  align-items: center;
  justify-content: center;
  .user_img {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    margin-right: 20px;
  }
}
</style>