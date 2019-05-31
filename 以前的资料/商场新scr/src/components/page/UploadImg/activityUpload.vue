<template>
    <el-upload
        class="avatar-uploader"
        accept='image/gif,image/jpeg,image/bmp,image/png'
        :action="this.$api._baseUrl+'/uploadImage'"
        :before-upload="beforeupload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        {{getFun}}
    </el-upload>
</template>
<script>
import { formdata } from "../../../libs/formdata.js";
export default {
    props: ['ruleFormT','imgurl'],
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
              console.log(this.imageUrl,result.data.resp)
              this.$emit('childByValue',this.imageUrl)
            }
          });
          return false;
        },
    },
    mounted(){
      this.$nextTick(()=>{
        this.imageUrl = this.ruleFormT.activityImageUrl;
      })
    },
    computed:{
      getFun(){
        this.imageUrl = this.ruleFormT.activityImageUrl;
        this.imageUrl = this.imgurl;
      }
  }
}
</script>
<style lang="less" scoped>
.avatar-uploader{
    width: 75px;
    height: 75px;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    overflow: hidden;
    &:hover {
        border: 1px solid #409EFF;
    }
   .el-upload {
    width: 75px;
    height: 75px;

  .avatar-uploader-icon {
    font-size: 24px;
    color: #8c939d;
    width: 75px;
    height: 75px;
    line-height: 75px;
    text-align: center;
    &:hover{
      color: #409EFF;
    }
  }
  .avatar {
    width: 75px;
    height: 75px;
    display: block;
  }
  }
  }
</style>


