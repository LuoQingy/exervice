<template>
  <div>
    <div>
      <el-breadcrumb separator="/" class="content_title">
        <el-breadcrumb-item>账号管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="admin">
      <div class="title">
        <span>共{{total}}条数据</span>
        <el-button type="primary" @click="showdialog('isAddAdmin','')">新建账号</el-button>
      </div>
      <div class="table">
        <el-table :data="tableData" border style="width: 100%" :cell-style="center" :header-cell-style="center">
          <el-table-column label="序号" width="55">
            <template slot-scope="scope">{{scope.$index}}</template>
          </el-table-column>
          <el-table-column prop="adminName" label="账号"></el-table-column>
          <el-table-column label="所属角色">
            <template slot-scope="scope">
              <span v-if="scope.row.roles" v-for="(item,index) in scope.row.roles" :key="index">{{item?item.sysRoleCnName:''}},</span>
            </template>
          </el-table-column>
          <el-table-column prop="adminNickname" label="用户名称"></el-table-column>
          <el-table-column prop="adminLastUpdateMdName" label="最近修改人"></el-table-column>
          <el-table-column prop="adminLastUpdateTime" label="最近修改时间"></el-table-column>
          <el-table-column prop="adminPhone" label="手机号"></el-table-column>
          <el-table-column label="操作" width="250">
            <template slot-scope="scope">
              <el-button
                type="text"
                v-if="canChang(scope.row.roles)"
                size="mini"
                @click="showdialog('isSetting',scope.row.adminName,scope.$index)"
              >配置角色</el-button>
              <el-button type="text" size="mini" @click="showdialog('isChang',scope.row.adminName)">修改密码</el-button>
              <el-popover placement="top" width="160" v-if="canChang(scope.row.roles)" v-model="scope.row.visible">
                <p>确定删除该账号吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="delTap(scope.row.adminName)">确定</el-button>
                </div>
                <el-button type="text" size="mini" slot="reference">删除</el-button>
              </el-popover>
            </template>
          </el-table-column>
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
    <!-- 新建账号 -->
    <form-dialog
      :dialogFormVisible="dialogFormVisible"
      :sysRoleIds="sysRoleIds"
      :isAddAdmin="isAddAdmin"
      :isSetting="isSetting"
      :isChang="isChang"
      @closedialog="closedialog"
      :adminName="adminName"
    ></form-dialog>
  </div>
</template>
  
<script>
import formDialog from "./AdminDialog";
export default {
  components: {
    formDialog
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dialogFormVisible: false,
      isAddAdmin: false,
      isSetting: false,
      isChang: false,
      tableData: [],
      adminName: "",
      sysRoleIds: []
    };
  },
  created() {
    this.getMallAllAdmin();
  },
  methods: {
    center() {
      return "text-align: center;";
    },
    // 获取账号列表
    getMallAllAdmin() {
      this.$httpAuth
        .post("mall/getMallAllAdmin", {
          currentPage: this.currentPage,
          pageSize: this.pageSize
        })
        .then(result => {
          if (result.data.code === 10000) {
            result.data.resp.mallAccountAndRoles.forEach(val => {
              val.visible = false;
            });
            this.tableData = result.data.resp.mallAccountAndRoles;
            this.total = result.data.resp.totalPage;
          } else  {
            this.$message({
              message: result.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    // 判断拥有的角色
    canChang(roles) {
      let boolen = roles.some(val => {
        if (val) {
          return val.sysRoleName === 'ROLE_MALL';
        }
      });
      return !boolen;
    },
    // 显示弹框
    showdialog(type, val, index) {
      let arr = [];
      if (index) {
        console.log(index);
        this.tableData[index].roles.forEach(val => {
          if (val) {
            arr.push(val.sysRoleId.toString());
          }
        });
      }
      this[type] = true;
      this.dialogFormVisible = true;
      this.adminName = val;
      this.sysRoleIds = arr;
    },
    // 删除
    delTap(username) {
      this.$httpAuth
        .post("/mall/deleteMallAccount", {
          username
        })
        .then(result => {
          if (result.data.code === 10000) {
            this.$message({
              message: result.data.resp,
              type: "success"
            });
            this.getMallAllAdmin();
          } else {
            this.$message({
              message: result.data.msg,
              type: "warning"
            });
            this.getMallAllAdmin();
          }
        })
        .catch(err => {});
    },
    // 关闭弹框
    closedialog(val) {
      this.dialogFormVisible = false;
      this.isAddAdmin = false;
      this.isSetting = false;
      this.isChang = false;
      this.adminName = "";
      this.sysRoleIds = [];
      if (val) {
        this.getMallAllAdmin();
      }
    },
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getMallAllAdmin();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getMallAllAdmin();
    }
  }
};
</script>
  
<style scoped lang="less">
.admin {
  .title {
    margin: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.dialog-footer {
  text-align: center;
}
</style>