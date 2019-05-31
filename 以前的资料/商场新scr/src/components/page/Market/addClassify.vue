<template>
  <div class="addFloor">
    <div>
      <el-breadcrumb separator="/" class="content_title">
        <el-breadcrumb-item :to="{ path: '/market/classifyMainte' }">分类维护</el-breadcrumb-item>
        <el-breadcrumb-item>添加分类</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="formdiv">
      <el-form label-width="120px" class="demo-ruleForm">
        <el-form-item label="分类名称:" required>
          <el-input v-model="ruleForm.name" style="width:400px;" size="medium" maxlength="20"></el-input>
          <span class="tiptext">{{ruleForm.name.length}}/20</span>
        </el-form-item>
        <el-form-item label="分类排序:" required>
          <el-input type="number" v-model.number="ruleForm.sort" style="width:400px;" size="medium" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item v-if="parentId==0" label="分类图标:" required>
          <Elupload @uploadimg="upload" @delimg="delimg" :imglist="dialogImageUrl" :type="['jpg','png']"></Elupload>
        </el-form-item>
      </el-form>
    </div>
    <div class="btndiv">
      <el-button class="btnResult" type="primary" @click="onSubmit">保存</el-button>
      <el-button class="btnResult" type="primary" @click="goback">取消</el-button>
    </div>
  </div>
</template>
  
<script>
import Elupload from "../UploadImg/Elupload.vue";
import bus from "@/components/common/bus.js";
import {specailTest,numberTest} from "@/libs/regular.js";
export default {
  data() {
    return {
      dialogImageUrl: [],
      dialogVisible: false,
      ruleForm: {
        name: "",
        sort: 0,
      },
      parentId: 0
    };
  },
  created() {
    this.parentId = this.$route.query.parentId;
  },

  mounted() {},
  components: {
    Elupload
  },
  methods: {
    upload(img) {
      // 激活图标的组件传过来的值
      this.dialogImageUrl.splice(0, 1, img);
    },
    delimg(val) {
      this.dialogImageUrl.splice(val, 1);
    },
    onSubmit() {
      let _this = this;
      if (_this.ruleForm.name == "") {
        this.$message.info("分类名称不能为空");
        return;
      } else if (specailTest(this.ruleForm.name)) {
        this.$message.info("分类名称不能为特殊字符");
        return;
      } else if (!_this.ruleForm.sort&& _this.ruleForm.sort != "0") {
        this.$message.info("分类排序不能为空");
        return;
      } else if (!numberTest(this.ruleForm.sort)) {
        this.$message.info("分类排序只能输入数字");
        return;
      }
      if (this.parentId == 0) {
        if (_this.dialogImageUrl.length===0) {
          this.$message.info("分类图标不能为空");
          return;
        }
      }
      this.$httpAuth({
        url: "/mall/addCategory",
        method: "post",
        data: {
          parentId: this.parentId,
          industryName: this.ruleForm.name,
          sort: this.ruleForm.sort,
          icon: this.dialogImageUrl[0]
        }
      })
        .then(res => {
          console.log(res.data);
           if (res.data.code == 10000) {
            let resp = res.data.resp;
            this.$message.success(res.data.resp);
            _this.$router.push("/market/classifyMainte");
          }else{
            this.$message.warning(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //返回
    goback() {
      bus.$emit("closetags");
      this.$router.push("/market/classifyMainte");
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