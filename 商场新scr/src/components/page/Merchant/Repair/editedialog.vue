<template>
  <el-dialog title="新增保修项目" :visible.sync="dialogFormVisible" width="500px" @close="closedialog">
    <el-form :model="form" ref="form" label-width="100px" :rules="rules">
      <el-form-item label="报修项目" prop="name">
        <el-input v-model="form.name" type="text" style="width:300px;" maxlength="15" placeholder="限15字内">
          <template slot="suffix">
            <span>{{form.name.length}}/15</span>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-checkbox v-model="checked">启用</el-checkbox>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closedialog">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {specailTest} from "@/libs/regular.js";
export default {
  data() {
    var name = (rules, val, callback) => {
      if (specailTest(val)) {
        callback(new Error("不能输入特殊字符和空格"));
      } else {
        callback();
      }
    };
    return {
      dialogFormVisible: false,
      checked: false,
      form: {
        name: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: "必填项,请输入",
            trigger: "blur"
          },
          {
            validator: name,
            trigger: "blur"
          }
        ]
      }
    };
  },
  props: {
    Visible: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    closedialog() {
      this.$emit("close");
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$httpAuth
            .post("/mall/addRepairsProject", {
              rpRepairsProject: this.form.name, //类型：String  必有字段  备注：报修项目
              rpStatus: this.checked ? 1 : 2
            })
            .then(result => {
              if (result.data.code === 10000) {
                this.dialogFormVisible = false;
                this.form.name = "";
                this.checked = false;
                this.$message({
                  message: result.data.resp,
                  type: "success"
                });
                this.$emit("success");
              } else {
                this.$message({
                  message: result.data.msg,
                  type: "warnig"
                });
              }
            })
            .catch(err => {});
        }
      });
    }
  },
  watch: {
    Visible(val) {
      this.dialogFormVisible = val;
    }
  }
};
</script>
  
<style scoped>
</style>