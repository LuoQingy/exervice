<template>
    <el-upload
        class="avatar-uploader"
        accept='image/gif,image/jpeg,image/bmp,image/png'
        :action="this.$api._baseUrl+'/uploadImage'"
        :before-upload="beforeupload"
        :disabled='disabled'
        >
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        {{getFun}}
    </el-upload>
</template>
<script>
import { formdata } from "../../../libs/formdata.js";
export default {
    props: ['ruleFormT','disabled'],
     data() {
      return {
        imageUrl: ''
      };
    },
    methods: {
      beforeupload(file) {
          console.log(file);
          let formDate = formdata({
            "file":file,
            "role":1
          });
          //然后通过下面的方式把内容通过axios来传到后台
          //下面的this.$reqs 是在主js中通过Vue.prototype.$reqs = axios 来把axios赋给它;
          this.$xwhttpAuth.post("/uploadImage", formDate).then(result => {
            if (result.data.code === 10000) {
              this.imageUrl = result.data.resp;
              this.$emit('childByValue',this.imageUrl)
            }
          });
          return false;
        },
    },
    computed:{
      getFun(){
        //  console.log(this.ruleFormT)
        this.imageUrl = this.ruleFormT;
      }
  }
}
</script>
<style lang="less" scoped>
.avatar-uploader{
    width: 87px;
    height: 87px;
    border: 1px dashed #ececec;
    border-radius: 6px;
    cursor: pointer;
    overflow: hidden;
    &:hover {
        border: 1px solid #409EFF;
    }
   .el-upload {
    width: 87px;
    height: 87px;

  .avatar-uploader-icon {
    font-size: 24px;
    color: #8c939d;
    width: 87px;
    height: 87px;
    line-height: 87px;
    text-align: center;
    &:hover{
      color: #409EFF;
    }
  }
  .avatar {
    width: 87px;
    height: 87px;
    display: block;
  }
  }
  }
</style>


