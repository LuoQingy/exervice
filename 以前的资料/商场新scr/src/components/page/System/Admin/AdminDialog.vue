<template>
  <div>
    <el-dialog :visible.sync="FormVisible" width="40%" @close="closeTap">
      <div slot="title" class="dialog-title">
        账号设置
      </div>
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item v-if="isAddAdmin||isSetting" label="账号名" prop="username" :label-width="formLabelWidth">
          <el-input v-model="form.username" style="width:80%;" :readonly="isSetting"></el-input>
        </el-form-item>
        <el-form-item v-if="isAddAdmin" label="用户名称" prop="adminNickname" :label-width="formLabelWidth">
          <el-input v-model="form.adminNickname" style="width:80%;" :readonly="isSetting"></el-input>
        </el-form-item>
        <el-form-item v-if="isAddAdmin" label="手机号" prop="phone" :label-width="formLabelWidth">
          <el-input v-model="form.phone" style="width:80%;"></el-input>
        </el-form-item>
        <el-form-item v-if="isAddAdmin||isChang" label="登录密码" prop="password" :label-width="formLabelWidth">
          <div style="width:80%;">
            <el-input v-model="form.password"></el-input>
            <p>密码长度不少于6个字符，必须包含数字、字母、特殊字符，其中任意两种</p>
          </div>
        </el-form-item>
        <el-form-item v-if="isAddAdmin||isChang" label="确认密码" prop="checkpassword" :label-width="formLabelWidth">
          <el-input v-model="form.checkpassword" style="width:80%;"></el-input>
        </el-form-item>
        <el-form-item v-if="isAddAdmin||isSetting" label="拥有的权限:" prop="roles" :label-width="formLabelWidth">
          <el-checkbox-group v-model="form.roles">
            <template v-for="item in chantRoles">
              <el-checkbox :label="item.sysRoleId|tostr" name="type">{{item.sysRoleCnName}}</el-checkbox>
            </template>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitform('form')">确认创建</el-button>
        <el-button type="primary" @click="closeTap">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
  
<script>
import {specailTest,phoneTest,passwordTest} from "@/libs/regular.js";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!passwordTest(value)) {
        callback(new Error("密码格式错误"));
      } else {
        if (this.form.checkpassword !== "") {
          this.$refs.form.validateField("checkpassword");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var phone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机号"));
      } else if (!phoneTest(value)) {
        callback(new Error("请输入正确的手机号"));
      } else {
        callback();
      }
    };
    var usernametest = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入账号名"));
      } else if (specailTest(value)) {
        callback(new Error("不能输入特殊字符和空格"));
      } else {
        callback();
      }
    };
    var adminNicknametest = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名称"));
      } else if (specailTest(value)) {
        callback(new Error("不能输入特殊字符和空格"));
      } else {
        callback();
      }
    };
    // 
    return {
      FormVisible: false,
      formLabelWidth: "120px",
      rules: {
        username: [
          { required: true, validator:usernametest, trigger: "blur" }
        ],
        adminNickname: [
          { required: true, validator:adminNicknametest, trigger: "blur" }
        ],
        phone: [{ required: true, validator: phone, trigger: "blur" }],
        password: [
          { required: true, validator: validatePass, trigger: "blur" }
        ],
        checkpassword: [
          { required: true, validator: validatePass2, trigger: "blur" }
        ],
        roles: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个权限",
            trigger: "change"
          }
        ]
      },
      form: {
        username: "",
        adminNickname: "",
        phone: "",
        password: "",
        checkpassword: "",
        roles: []
      },
      chantRoles: []
    };
  },
  props: {
    dialogFormVisible: {
      type: Boolean
    },
    isAddAdmin: {
      type: Boolean
    },
    isSetting: {
      type: Boolean
    },
    isChang: {
      type: Boolean
    },
    adminName: {
      type: String
    },
    sysRoleIds:{
      type:Array,
      default:()=>[]
    }
  },
  created() {
    this.Roles();
  },
  methods: {
    closeTap(val) {
      this.$emit("closedialog", val);
      this.$refs["form"].resetFields();
    },
    // 角色权限
    Roles() {
      this.$xwhttpAuth
        .post("/gm/getSysRoleList")
        .then(result => {
          if (result.data.code === 10000) {
            this.chantRoles = result.data.resp;
          }
        })
        .catch(err => {});
    },
    // 新建用户
    createAccountNumber() {
      this.$httpAuth
        .post("gm/createAccountNumber", {
          username: this.form.username,
          adminNickname: this.form.adminNickname,
          phone: this.form.phone,
          password: this.form.password,
          roles: this.form.roles
        })
        .then(result => {
          if (result.data.code === 10000) {
            this.$message({
              message: result.data.resp,
              type: "success"
            });
            this.closeTap(true);
          } else {
            this.$message({
              message: result.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    // 修改密码
    updatePassword() {
      this.$httpAuth
        .post("mall/updatePassword", {
          username: this.form.username,
          newPassword: this.form.password
        })
        .then(result => {
          if (result.data.code === 10000) {
            this.$message({
              message: result.data.resp,
              type: "success"
            });
            this.closeTap(true);
          } else {
            this.$message({
              message: result.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    // 修改角色配置
    roleManagement() {
      this.$httpAuth
        .post("gm/roleManagement", {
          username: this.form.username,
          roles: this.form.roles
        })
        .then(result => {
          if (result.data.code === 10000) {
            this.$message({
              message: '修改成功',
              type: "success"
            });
            this.closeTap(true);
          } else {
            this.$message({
              message: result.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    submitform(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isAddAdmin) {
            this.createAccountNumber();
          } else if (this.isChang) {
            this.updatePassword();
          } else if (this.isSetting) {
            this.roleManagement();
          }
          this.$refs[formName].resetFields();
        } else {
          console.log("error submitform!!");
          return false;
        }
      });
    }
  },
  filters: {
    tostr(val) {
      return String(val);
    }
  },
  watch: {
    dialogFormVisible(val) {
      this.FormVisible = val;
    },
    adminName(val) {
      this.form.username = val;
    },
    sysRoleIds(val){
      console.log(val)
      this.form.roles = val;
    }
  }
};
</script>
  
<style scoped>
.el-checkbox + .el-checkbox {
  margin-left: 0;
}
.el-checkbox {
  margin-right: 20px;
}
</style>