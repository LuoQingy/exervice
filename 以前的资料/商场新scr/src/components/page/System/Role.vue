<template>
  <div>
    <div>
      <el-breadcrumb separator="/" class="content_title">
        <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="admin">
      <div class="title">
        <span>共{{tableData.length}}条数据</span>
        <el-button type="primary" @click="addRole(null)">新建角色</el-button>
      </div>
      <div class="table">
        <el-table :data="tableData" border style="width: 100%" :cell-style="center" :header-cell-style="center">
          <el-table-column prop="sysRoleCnName" label="角色"></el-table-column>
          <el-table-column prop="count" label="包含账号"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="addRole(scope.row.sysRoleId)">修改权限</el-button>
              <el-popover placement="top" width="160" v-model="scope.row.visible">
                <p>确定删除该角色吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="delTap(scope.row.sysRoleId)">确定</el-button>
                </div>
                <!-- <el-button slot="reference">删除</el-button> -->
                <el-button type="text" slot="reference" size="mini">删除</el-button>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
  
<script>
export default {
  data() {
    return {
      tableData: []
    };
  },
  created() {
    this.Roles();
  },
  methods: {
    center() {
      return "text-align: center;";
    },
    // 删除
    delTap(sysRoleId) {
      this.$httpAuth
        .post("/gm/deleteSysRole", {
          sysRoleId
        })
        .then(result => {
          if(result.data.code===10000){
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.Roles();
          }else{
            this.$message({
              message: result.data.msg,
              type: 'warning'
            });
          }
        })
        .catch(err => {});
    },
    // 跳到角色设置页面
    addRole(id) {
      this.$router.push({
        name: "addrole",
        query: {
          id: id ? id : null
        }
      });
    },
    // 角色列表
    Roles() {
      this.$xwhttpAuth
        .post("/gm/getSysRoleList")
        .then(result => {
          if (result.data.code === 10000) {
            result.data.resp.forEach(element => {
              element.visible = false;
            });
            this.tableData = result.data.resp;
          }
        })
        .catch(err => {});
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
</style>