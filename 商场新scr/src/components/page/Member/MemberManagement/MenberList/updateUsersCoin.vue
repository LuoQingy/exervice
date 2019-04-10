<template>
    <div>
        <el-dialog :visible.sync="FormVisible" width="40%" @close="closeTap">
            <div slot="title" class="dialog-title">
                共给{{page==2?total:this.selectlist.length}}人变更积分
            </div>
            <el-form :model="form" ref="ruleForm" :rules="rules" class="form">
                <el-form-item label="变更类型" prop="calculateType">
                    <el-select v-model="form.calculateType" size="mini" style="width:300px;">
                        <el-option label="增加积分" value="1"></el-option>
                        <el-option label="减去积分" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="变更积分"  prop="coinNumber">
                    <el-input v-model="form.coinNumber" style="width:300px;"></el-input>
                </el-form-item>
                <el-form-item label="备注信息" label-width="78px" prop="desc">
                    <el-input type="textarea" v-model="form.desc" maxlength='30' rows='3' style="width:300px;" placeholder="备注信息，最多30个字"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeTap">关闭</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>
  
<script>
import {numberTest} from "@/libs/regular.js";
export default {
  data() {
    var coinNumbertest = (rules, val, callback) => {
      if (numberTest(val)) {
        callback();
      } else {
        callback(new Error("请输入整数"));
      }
    };
    var desctest= (rules, val, callback) => {
      if (!val) {
        callback();
      } else if(val.length>30){
        callback(new Error("最多输入30个字"));
      }else{
        callback();
      }
    };
    return {
      FormVisible: false,
      form: {
        //积分表单
        calculateType: "",
        coinNumber: "",
        desc: ""
      },
      rules: {
        //表单验证
        calculateType: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ],
        coinNumber: [
          { required: true, message: "输入积分数额", trigger: "blur" },
          { validator: coinNumbertest, trigger: "blur" }
        ],
        desc:[{validator: desctest,trigger: "blur"}]
      }
    };
  },
  props: {
    dialogFormVisible: {
      type: Boolean
    },
    selectlist: {
      type: Array
    },
    usersSearchParams: {
      type: Object
    },
    page: {
      type: String
    },
    total:{
      type:Number,
      default:0
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$httpAuth
            .post("mall/updateUsersCoin", {
              reqType: this.page,
              calculateType: this.form.calculateType, //类型：Number  必有字段  备注：计算方式 1:增加 2:减去
              coinNumber: this.form.coinNumber, //类型：Number  必有字段  备注：计算值
              usersIdArray: this.selectlist,
              usersSearchParams: this.usersSearchParams //类型：Object  必有字段  备注：搜索条件 (请求方式为2使用)
            })
            .then(result => {
              if (result.data.code === 10000) {
                this.FormVisible = false;
                this.$refs[formName].resetFields();
                this.$emit("updateUsersCoin");
                this.$message({
                  message: result.data.resp,
                  type: "success"
                });
              }else{
                this.$message({
                  message: result.data.msg,
                  type: 'warning'
                });
              }
            })
            .catch(err => {});
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    closeTap() {
      this.$emit("closedialogForm");
    }
  },
  watch:{
      dialogFormVisible(val){
          this.FormVisible = val;
      }
  }
};
</script>
  
<style scoped>
.form{
  width: 400px;
  margin: 0 auto;
}
.dialog-footer{
  text-align: center;
}
</style>