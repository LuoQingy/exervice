<template>
  <el-upload class="avatar-uploader" :action="this.$api._baseUrl+'/uploadImage'" :before-upload="beforeupload">
    <img v-if="imageUrl" :src="imageUrl" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>
<script>
import { formdata } from "../../../libs/formdata.js";
export default {
  data() {
    return {
      imageUrl: ""
    };
  },
  props:{
    checksize:{
      type:Boolean,
      default:false
    }
  },
  methods: {
    beforeupload(file) {
      console.log(file);
      let formDate = formdata({
        file: file,
        role: 1
      });
      //然后通过下面的方式把内容通过axios来传到后台
      //下面的this.$reqs 是在主js中通过Vue.prototype.$reqs = axios 来把axios赋给它;
      this.$xwhttpAuth.post("uploadImage", formDate).then(result => {
        let _this = this;
        if (result.data.code === 10000) {
          if (this.checksize) {
            let img = new Image();
            // 改变图片的src
            img.src = result.data.resp;
            // 加载完成执行
            img.onload = function() {
              if (img.width == "60" && img.height == "60") {
                _this.imageUrl = result.data.resp;
                _this.$emit("childByValue", result.data.resp);
              } else {
                _this.$message({
                  message: "上传的图片宽高必须为60*60",
                  type: "warning"
                });
              }
            };
          } else {
            this.imageUrl = result.data.resp;
            this.$emit("childByValue", result.data.resp);
          }
        }
      });
      return false;
    }
  }
};
</script>
<style lang="less" scoped>
.avatar-uploader {
  width: 100px;
  height: 100px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  &:hover {
    border: 1px dashed #409eff;
  }
  .el-upload {
    width: 100px;
    height: 100px;

    .avatar-uploader-icon {
      font-size: 24px;
      color: #8c939d;
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
      &:hover {
        color: #409eff;
      }
    }
    .avatar {
      width: 100px;
      height: 100px;
      display: block;
    }
  }
}
</style>


