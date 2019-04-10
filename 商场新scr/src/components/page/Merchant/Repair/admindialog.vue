<template>
  <div>
    <el-dialog title="指派人" :visible.sync="dialogVisible" width="500px" @close="closedialog">
      <div style="text-align:center;">
        <span>选择指派人</span>
        <el-select v-model="value" placeholder="请选择">
          <el-option v-for="item in options" :key="item.adminId" :label="item.adminName" :value="item.adminId"></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="checkdata">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
  
<script>
export default {
  data() {
    return {
      dialogVisible: false,
      options: [],
      value: ""
    };
  },
  props: {
    Visible: {
      default: false,
      type: Boolean
    },
    repairsId: {
      type: Number
    }
  },
  watch: {
    Visible(val) {
      this.dialogVisible = val;
    }
  },
  created() {
    this.getMallAllAdmin();
  },
  methods: {
    // 获取账号列表
    getMallAllAdmin() {
      this.$httpAuth
        .post("/mall/getMallAdminNoRoleMall", {
          currentPage: 1,
          pageSize: 100
        })
        .then(result => {
          if (result.data.code === 10000) {
            this.options = result.data.resp;
          } else  {
            this.$message({
              message: result.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    checkdata() {
      this.$httpAuth
        .post("/mall/designate", {
          repairsId: this.repairsId, //类型：Number  必有字段  备注：id
          adminId: this.value
        })
        .then(result => {
          if (result.data.code === 10000) {
            this.dialogVisible = false;
            this.$message({
              message: "指派成功",
              type: "success"
            });
          } else {
            this.$message({
              message: result.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    closedialog() {
      this.$emit("close");
    }
  }
};
</script>
  
<style scoped>
</style>