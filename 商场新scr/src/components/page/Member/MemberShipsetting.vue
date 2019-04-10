<template>
  <div>
    <div class="btn">
      <el-button type="primary" icon="el-icon-plus" @click="addrules">升级规则描述</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="addTap">添加会员等级</el-button>
    </div>
    <div class="table">
      <el-table :data="tabledata" border style="width: 100%" :cell-style="center" :header-cell-style="center">
        <template v-for="(item ,index) in tableheader">
          <el-table-column :prop="item.prop" :label="item.label" :key="item.index" :width="item.width">
            <template slot-scope="scope">
              <div v-if="index === tableheader.length-1">
                <el-button type="text" @click="editMemberGrade(scope.row.umgId)">编辑</el-button>
                <el-popover placement="top" width="160" v-model="scope.row.visible">
                  <p>确定要删除会员等级吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="deleteMemberGrade(scope.row.umgId)">确定</el-button>
                  </div>
                  <el-button type="text" slot="reference">删除</el-button>
                </el-popover>
              </div>
              <div v-else>{{scope.row[item.prop]}}</div>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 30, 40]"
          background
          layout="total, sizes, prev, pager, next"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
  
<script>
export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dialogFormVisible: false,
      textarea: "",
      tableheader: [
        {
          prop: "umgSerialNumber",
          label: "序号",
          width: "80"
        },
        {
          prop: "umgName",
          label: "会员等级名称",
          width: "180"
        },
        {
          prop: "umgUpgradeCondition",
          label: "升级条件",
          width: ""
        },
        {
          prop: "umgDiscount",
          label: "折扣率",
          width: "180"
        },
        {
          prop: "handle",
          label: "操作",
          width: "180"
        }
      ],
      tabledata: []
    };
  },
  methods: {
    center() {
      return "text-align: center;";
    },
    // 获取会员等级
    getMemberGradeAll() {
      this.$httpAuth
        .post("gm/getMemberGradeAll", {
          mallId: 1, //类型：Number  必有字段  备注：商场ID
          pageNum: this.currentPage,
          pageSize: this.pageSize
        })
        .then(result => {
          if (result.data.code === 10000) {
            this.total = result.data.resp.total;
            result.data.resp.list.forEach(val => {
              val.visible = false;
            });
            this.tabledata = result.data.resp.list;
          }
        })
        .catch(err => {});
    },
    // 添加会员规矩
    addrules() {
      this.$router.push({
        name: "memberrules"
      });
    },
    addTap() {
      this.$router.push({ name: "addmembergrade" });
    },
    // 删除会员等级
    deleteMemberGrade(umgId) {
      this.$httpAuth
        .post("mall/deleteMemberGrade", {
          umgId
        })
        .then(result => {
          if (result.data.code === 10000) {
            this.getMemberGradeAll();
          }
        })
        .catch(err => {});
    },
    // 编辑会员等级
    editMemberGrade(umgId) {
      this.$router.push({
        name: "addmembergrade",
        query: { umgId }
      });
    },
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getMemberGradeAll();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getMemberGradeAll();
    }
  },
  created() {
    this.getMemberGradeAll();
  }
};
</script>
  
<style lang="less" scoped>
.btn {
  padding-top: 20px;
  text-align: right;
}
.table {
  margin-top: 20px;
}
</style>