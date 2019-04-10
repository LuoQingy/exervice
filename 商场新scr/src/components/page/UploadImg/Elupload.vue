<template>
    <div class="upload_list">
        <template v-if="imglist.length>0" v-for="(item,index) in imglist">
            <div class="avatar">
                <img v-if="item.mgiImagesUrl" class="img" :src="item.mgiImagesUrl">
                <img v-else-if="item" class="img" :src="item">
                <span class="del">
                    <i class="el-icon-delete" @click="delimg(index)"></i>
                </span>
            </div>
        </template>
        <el-upload class="avatar-uploader" :disabled="uploadDisabled" :action="this.$api._baseUrl+'/uploadImage'" :before-upload="beforeupload">
            <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
    </div>
</template>
<script>
import { formdata } from "../../../libs/formdata.js";
// let arr = [];
export default {
  data() {
    return {};
  },
  props: {
    imglist: {
      type: Array
    },
    uploadDisabled: {
      type: Boolean,
      default: false
    },
    type:{
      type:Array,
      default:()=>['gif','jpg','png']
    },
    size:{
      type:Number,
      default:10
    }
  },
  methods: {
    beforeupload(file) {
      let type = file.type.split("/")[1].toLowerCase();
      this.type.push('jpeg')
      let canupload = this.type.some(val=>{
        return val==type
      })
      const isLt2M = file.size / 1024 / 1024 < this.size;
      let msg = this.type.join(",")
      if (!canupload) {
        this.$message.error(`上传图片只能是${msg}格式!`);
        return false;
      }
      if (!isLt2M) {
        this.$message.error(`上传头像图片大小不能超过${this.size}MB!`);
        return false;
      }
      let formDate = formdata({
        file: file,
        role: 1
      });
      //下面的this.$reqs 是在主js中通过Vue.prototype.$reqs = axios 来把axios赋给它;
      this.$xwhttpAuth.post("uploadImage", formDate).then(result => {
        if (result.data.code === 10000) {
          this.$emit("uploadimg", result.data.resp);
        } else {
          this.$message({
            message: "上传失败",
            type: "warning"
          });
        }
      });
      return false;
    },
    delimg(index) {
      console.log(index);
      this.$emit("delimg", index);
    }
  },
  watch: {
    //   imglist(val){
    //   }
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
  }
}
.upload_list {
  display: flex;
  .avatar {
    width: 100px;
    height: 100px;
    border: 1px solid #d9d9d9;
    margin-right: 10px;
    &:hover {
      border: 1px dashed #409eff;
      position: relative;
    }
    .img {
      width: 100px;
    }
  }
  .del {
    display: none;
  }
  .avatar:hover .del {
    display: block;
    height: 100px;
    width: 100px;
    background: rgba(0, 0, 0, 0.3);
    position: absolute;
    top: 0;
    left: 0;
    text-align: center;
    line-height: 100px;
    font-size: 22px;
    color: #ffffff;
    font-weight: 700;
    .el-icon-delete {
      cursor: pointer;
    }
  }
}
</style>
