<template>
  <div>
    <div>
      <el-breadcrumb separator="/" class="content_title">
        <el-breadcrumb-item>新建角色/修改角色</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form">
      <el-form ref="form" label-width="100px">
        <el-form-item label="角色名称:" required>
          <el-input v-model="sysRoleCnName" @blur="CnNameBlur" size="mini" style="width:300px;"></el-input>
        </el-form-item>
        <div class="allselect">
          <el-form-item label="全部权限">
            <el-switch v-model="allrole" @change="allchang" active-color="#3d9efd" inactive-color="#ff893c"></el-switch>
          </el-form-item>
          <el-form-item label-width="0">
            <el-button type="primary" @click="getCheckedKeys" size="small">保存</el-button>
            <el-button type="primary" @click="close" size="small">取消</el-button>
          </el-form-item>
        </div>
        <div class="tree">
          <el-tree
            :data="treeData"
            @check="change"
            ref="tree"
            show-checkbox
            accordion
            node-key="menuId"
            :default-checked-keys="checkedkeys"
            :props="defaultProps"
          ></el-tree>
        </div>
      </el-form>
    </div>
  </div>
</template>
  
<script>
import bus from "@/components/common/bus.js";
import {specailTest} from "@/libs/regular.js";
export default {
  data() {
    return {
      sysRoleCnName: "",
      allrole: false,
      listLen: "",
      treeData: [],
      checkdata: [],
      checkedkeys: [],
      defaultProps: {
        children: "children",
        label: "menuName"
      }
    };
  },
  created() {
    if(this.$route.query.id){
      this.sysRoleId = this.$route.query.id;
      this.getSysRoleInfo();
    }
    this.getMenuList();
    // this.findIndustryAndMerchant();
  },
  methods: {
    // 获取角色详情
    getSysRoleInfo() {
      this.$httpAuth
        .post("/gm/getSysRoleInfo", {
          sysRoleId:this.sysRoleId
        })
        .then(result => {
          if(result.data.code===10000){
            this.sysRoleCnName = result.data.resp.sysRoleCnName;
            result.data.resp.meunList.forEach(val=>{
              this.checkedkeys.push(val.menuId)
            })
          }
        })
        .catch(err => {});
    },
    // 获取商场的权限
    getMenuList() {
      this.$httpAuth
        .post("/gm/getMenuList")
        .then(result => {
          if (result.data.code === 10000) {
            this.treeData = result.data.resp;
            let data = result.data.resp;
            let total = data.length;
            data.forEach(val => {
              if (val.children) {
                total += val.children.length;
                val.children.forEach(value => {
                  if (value.children) {
                    total += value.children.length;
                  }
                });
              }
            });
            this.listLen = total;
          }
        })
        .catch(err => {});
    },
    // 角色名
    CnNameBlur() {
      if (!this.sysRoleCnName) {
        this.$message({
          message: "请输入角色名称",
          type: "warning"
        });
        return false;
      } else if (specailTest(this.sysRoleCnName)) {
        this.$message({
          message: "请不要输入特殊字符和空格",
          type: "warning"
        });
        return false;
      } else {
        return true;
      }
    },
    // 权限全选
    allchang(val) {
      let arr = [];
      if (val) {
        this.treeData.forEach(val => {
          arr.push(val.menuId);
        });
        this.$refs.tree.setCheckedKeys(arr);
      } else {
        this.$refs.tree.setCheckedKeys([]);
      }
    },
    // 点击chekbox
    change(data, val, key) {
      if (val.checkedKeys.length === this.listLen) {
        this.allrole = true;
      } else {
        this.allrole = false;
      }
    },
    // 权限选择
    checkMenuArray(val) {
      if (val.length === 0) {
        this.$message({
          message: "请选择角色权限",
          type: "warning"
        });
        return false;
      } else {
        return true;
      }
    },
    // 保存
    getCheckedKeys() {
      let menuArray = this.$refs.tree.getCheckedKeys();
      if (this.CnNameBlur() && this.checkMenuArray(menuArray)) {
        let url = '/gm/addSysRole';
        let sysRoleId = null;
        if(this.sysRoleId){
          url = '/gm/updateSysRole';
          sysRoleId = this.sysRoleId;
        }
        this.$httpAuth
          .post(url, {
            sysRoleCnName: this.sysRoleCnName,
            menuArray,
            sysRoleId
          })
          .then(result => {
            if (result.data.code === 10000) {
              this.$message({
                message: result.data.resp,
                type: "success"
              });
              this.close();
            } else {
              this.$message({
                message: result.data.msg,
                type: "warning"
              });
            }
          })
          .catch(err => {});
      }
    },
    //取消
    close() {
      bus.$emit("closetags");
      this.$router.push("/system/role");
    }
  }
};
</script>
  
<style scoped lang="less">
.form {
  margin-top: 20px;
  .allselect {
    display: flex;
    justify-content: space-between;
    border-bottom: 2px solid #969696;
    padding-right: 200px;
  }
  .tree {
    margin-top: 20px;
    margin-left: 40px;
  }
}
</style>