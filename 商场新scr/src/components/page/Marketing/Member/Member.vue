<template>
  <div>
    <div>
      <el-breadcrumb separator="/" class="content_title">
        <el-breadcrumb-item>会员分组</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div>
      <div class="btnlist">
        <el-button icon="el-icon-plus" type="danger" size="mini" @click="addmemberTap">新建分组</el-button>
      </div>
      <ul class="grouping_lists">
        <template v-for="item in groupList">
          <li class="grouping" @click="detailsTap(item.mgSearchCondition)">
            <el-tooltip class="item" effect="dark" :content="item.mgIntro" placement="top">
              <p class="list grouping_title">{{item.mgName}}</p>
            </el-tooltip>
            <p class="list grouping_num">{{item.mgPeopleNum}}人</p>
            <p class="list grouping_rules">筛选条件:
              <span>{{item.mgSearchNum}}项</span>
            </p>
            <div class="list grouping_foot">
              <el-button class="btn" type="primary" @click.stop="btnTap" size="mini">发布活动</el-button>
              <p>
                <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                  <i class="el-icon-edit" @click.stop="addmemberTap(item.mgId)"></i>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="详情" placement="top">
                  <i class="el-icon-document" @click.stop="detailsTap(item.mgId)"></i>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                  <i class="el-icon-delete" @click.stop="showconfirm(item.mgId)"></i>
                </el-tooltip>
              </p>
            </div>
          </li>
        </template>
      </ul>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[12, 24, 36, 48]"
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
      groupList: [],
      currentPage: 1,
      pageSize: 12,
      total: 0
    };
  },
  created() {
    this.getMembersGroupList();
  },
  methods: {
    getMembersGroupList() {
      this.$httpAuth
        .post("mall/getMembersGroupList", {
          pageNum: this.currentPage, //类型：String  可有字段  备注：页 默认1
          pageSize: this.pageSize //类型：String  可有字段  备注：页数 默认20
        })
        .then(result => {
          if (result.data.code === 10000) {
            this.groupList = result.data.resp.list;
            this.total = result.data.resp.total;
          }
        })
        .catch(err => {});
    },
    // 分组详情
    detailsTap(mgId) {
      this.$router.push({
        name: "memberlist",
        query: { mgId }
      });
    },
    // 添加分组
    addmemberTap(mgId) {
      let query = typeof mgId === "number" ? { mgId } : {};
      this.$router.push({
        name: "addmember",
        query
      });
    },
    //删除
    delete(mgId) {
      this.$httpAuth
        .post("mall/deleteMembersGroup", {
          mgId
        })
        .then(result => {
          if (result.data.code === 10000) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getMembersGroupList();
          }
        })
        .catch(err => {});
    },
    showconfirm(mgId) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        inputValue: mgId
      })
        .then(() => {
          this.delete(mgId);
        })
        .catch(() => {});
    },
    handleSizeChange(val) {
      this.currentPage=1;
      this.pageSize = val;
      this.getMembersGroupList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getMembersGroupList();
    }
  }
};
</script>
  
<style scoped lang="less">
.btnlist {
  text-align: right;
  margin: 30px 0 10px;
}
.grouping_lists {
  display: flex;
  flex-wrap: wrap;
  .grouping {
    width: 22%;
    border: 2px solid #f6f8fb;
    margin-bottom: 20px;
    margin-right: 1%;
    .list {
      height: 38px;
      display: flex;
      align-items: center;
    }
    .grouping_title {
      justify-content: center;
      background: #f6f8fb;
      font-weight: 400;
    }
    .grouping_num {
      border-top: 2px solid #f6f8fb;
      justify-content: center;
    }
    .grouping_rules {
      border-top: 2px dashed #f6f8fb;
    }
    .grouping_foot {
      justify-content: space-between;
      background: #f7f8fa;
      padding: 0 20px;
      box-sizing: border-box;
      .btn {
        height: 28px;
        line-height: 28px;
        padding: 0;
        width: 60px;
      }
    }
  }
}
</style>