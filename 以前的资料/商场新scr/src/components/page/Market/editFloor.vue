<template>
  <div class="addFloor">
    <div>
      <el-breadcrumb separator="/" class="content_title">
        <el-breadcrumb-item :to="{ path: '/market/floorMainte' }">楼层维护</el-breadcrumb-item>
        <el-breadcrumb-item>添加楼层</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="formdiv">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="楼层名称:" prop="floorName">
          <el-input v-model="ruleForm.floorName" style="width:400px;" size="medium" maxlength="20"></el-input>
          <span class="tiptext">{{ruleForm.floorName.length}}/20</span>
        </el-form-item>
        <el-form-item label="楼层主营:" prop="floorMain">
          <el-input v-model="ruleForm.floorMain" style="width:400px" size="medium" maxlength="20"></el-input>
          <span class="tiptext">{{ruleForm.floorMain.length}}/20</span>
        </el-form-item>
      </el-form>
    </div>
    <div class="btndiv">
      <el-button class="btnResult" type="primary" @click="onSubmit">保存</el-button>
      <el-button class="btnResult" type="primary" @click="onReset">取消</el-button>
    </div>
  </div>
</template>
  
<script>
import upload from "../UploadImg/upload.vue";
import uploadone from "../UploadImg/uploadone.vue";
import bus from "@/components/common/bus.js";
import {specailTest} from "@/libs/regular.js";
export default {
  data() {
    var specail = (rule, value, callback) => {
      if (specailTest(value)) {
        callback(new Error("请不要输入空格和特殊字符"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        floorName: "",
        floorMain: ""
      },
      floorId: 1,
      rules: {
        floorName: [
          { required: true, message: "请输入楼层名称", trigger: "blur" },
          { validator: specail, trigger: "blur" }
        ],
        floorMain: [
          { required: true, message: "请输入楼层主营", trigger: "blur" },
          { validator: specail, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.floorId = this.$route.query.floorId;
  },
  mounted() {
    this.selectFloor();
  },
  methods: {
    selectFloor() {
      let _this = this;
      this.$httpAuth({
        url: "/gm/selectFloor",
        method: "get",
        params: {
          floorId: this.floorId
        }
      })
        .then(res => {
          if (res.data.code == 10000) {
            let resp = res.data.resp;
            this.ruleForm = resp;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    onSubmit() {
      this.$refs.ruleForm.validate(vali => {
        if (vali) {
          let _this = this;
          this.$httpAuth({
            url: "/mall/updateFloor",
            method: "post",
            data: {
              floorId: this.floorId,
              floorName: this.ruleForm.floorName,
              floorMain: this.ruleForm.floorMain
            }
          })
            .then(res => {
               if (res.data.code == 10000) {
                let resp = res.data.resp;
                this.$message.success(res.data.resp);
                _this.$router.push("/market/floorMainte");
              }else{
                this.$message.info(res.data.msg);
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },
    onReset() {
      bus.$emit("closetags");
      this.$router.push("/market/floorMainte");
    }
  }
};
</script>
  
<style scoped lang='less'>
.addFloor {
  .formdiv {
    width: 98%;
    margin-top: 20px;
    .demo-ruleForm {
      margin-top: 20px;
      position: relative;
      .tiptext {
        position: absolute;
        left: 360px;
        top: 2px;
        color: #666;
      }
      .upload_box {
        width: 100px;
        height: 100px;
        display: inline-block;
        border: 1px dashed #cccccc;
        .upload_icon {
          font-size: 30px;
          color: #969696;
          line-height: 100px;
        }
      }
      .tips {
        color: #969696;
      }
    }
  }
  .btndiv {
    width: 400px;
    margin: 40px auto;
    .btnResult {
      width: 120px;
      height: 40px;
      font-size: 14px;
    }
  }
}
</style>