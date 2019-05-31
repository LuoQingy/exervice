<template>
    <div class="addFloor">
        <div>
            <el-breadcrumb separator="/" class="content_title">
                <el-breadcrumb-item :to="{ path: '/market/floorMainte' }">楼层维护</el-breadcrumb-item>
                <el-breadcrumb-item>添加楼层</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="formdiv">
            <el-form label-width="120px" class="demo-ruleForm">
                <el-form-item label="楼层名称:" required>
                    <el-input v-model="ruleForm.floorName" style="width:400px;" size="medium" maxlength="20"></el-input>
                    <span class="tiptext">{{ruleForm.floorName.length}}/20</span>
                </el-form-item>
                <el-form-item label="楼层主营:" required>
                    <el-input v-model="ruleForm.floorMain" style="width:400px" size="medium" maxlength="20"></el-input>
                    <span class="tiptext">{{ruleForm.floorMain.length}}/20</span>
                </el-form-item>
            </el-form>
        </div>
        <div class="btndiv">
          <el-button  class="btnResult" type="primary" @click="onSubmit">保存</el-button>
          <el-button class="btnResult" type="primary" @click="onReset">取消</el-button>
        </div>
    </div>
</template>
  
<script>
import upload from '../UploadImg/upload.vue'
import uploadone from '../UploadImg/uploadone.vue'
import bus from "@/components/common/bus.js";
import {specailTest} from "@/libs/regular.js";
export default {
  data() {
    return {
      ruleForm: {
        floorName: "",
        floorMain:"",
      },
      rules: {
        name: [
          { required: true, message: "请输入特权名称", trigger: "blur" },
          { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" }
        ],
        intro: [
          { required: true, message: "请输入特权简介", trigger: "blur" },
          { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" }
        ],
      },
    };
  },
  mounted(){
    
  },
  methods: {
    onSubmit(){
        let _this=this
        if(_this.ruleForm.floorName==""){
            this.$message.info('楼层名称不能为空')
            return;
        }else if(specailTest(this.ruleForm.floorName)){
            this.$message.info('楼层名称不能为空格和特殊字符')
            return;
        }else if(_this.ruleForm.floorMain==""){
            this.$message.info('楼层主营不能为空')
            return;
        }if(specailTest(this.ruleForm.floorMain)){
            this.$message.info('楼层主营不能为空格和特殊字符')
            return;
        }
        this.$httpAuth({
            url:'/mall/addFloor',
            method:'post',
            data:{
               "floorName": this.ruleForm.floorName,
               "floorMain":this.ruleForm.floorMain
            }
        }).then((res) =>{
            if(res.data.code == 10000){
                let resp = res.data.resp;
                this.$message.success(res.data.resp);
                this.onReset();
            }else{
              this.$message.info(res.data.msg);
            }
        }).catch((err) => {
            console.log(err);
        });
    },
    onReset(){
      bus.$emit("closetags");
      this.$router.push('/market/floorMainte')
    },
  }
};
</script>
  
<style scoped lang='less'>
.addFloor{
  .formdiv{
    width: 98%;
    margin-top: 20px;
    .demo-ruleForm{
        margin-top: 20px;
        position: relative;
        .tiptext{
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
  .btndiv{
    width: 400px;
    margin: 40px auto;
    .btnResult{
      width: 120px;
        height: 40px;
        font-size: 14px;
    }
  }



}
</style>