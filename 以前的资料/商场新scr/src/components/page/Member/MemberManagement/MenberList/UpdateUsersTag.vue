<template>
  <div>
    <el-dialog :visible.sync="FormVisible"   width="60%" @close="closeTap">
      <div slot="title" class="dialog-title">
        标签变更
      </div>
      <p v-if='!updateUsers'>共给{{page==2?total:this.selectlist.length}}人变更标签 <span v-if="updateUsers">,添加后不可以批量取消。</span> </p>
      <p v-else>给{{usersName}}变更标签 <span v-if="updateUsers">,添加后不可以批量取消。</span> </p>
      <div>
        <div class="hascheck">
          <p v-if="tagtext.length<=0" class="nocheck">当前没有标签，请添加</p>
          <div v-else class="check">
            <template v-for="item in tagtext">
              <el-tag style="margin-right:10px;margin-bottom:10px;">{{item}}</el-tag>
            </template>
          </div>
        </div>
      </div>
      <div class="check_ts">
        <p>请选择添加的标签，可多选。</p>
        <p class="ts"> <i class="el-icon-warning"></i> 提示:更多标签可在标签管理添加！</p>
      </div>
      <div>
        <div v-if="item.usersTagList.length>0" v-for="(item,index) in TagList">
          <p>{{item.uttName}}</p>
          <el-checkbox-group class="check_box" v-model="checkList" @change="checkChang">
            <el-checkbox v-for="(items,indexs) in item.usersTagList" name="type" :label="items.utagId+','+items.utagName" :key="indexs">{{items.utagName}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeTap">关闭</el-button>
        <el-button type="primary" @click="UpdateUsersTag">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
  
<script>
import { formdata } from "../../../../../libs/formdata.js";
export default {
  data() {
    return {
      FormVisible: false,
      TagList: [],
      tagtext: [],
      utagIdArray: [],
      checkList: []
    };
  },
  props: {
    tabFormVisible: {
      type: Boolean
    },
    selectlist: {
      type: Array,
      default: () => []
    },
    updateUsers: "",//单个修改的用户id
    page: {
      type: String,
      default:"3"
    },
    usersSearchParams: {
      type: Object,
      default:() => {}
    },
    total:{
      type:Number,
      default:0
    },
    usersName:{
      type: String,
      default:" "
    }
  },
  created() {
    this.getUsersTagList();
  },
  methods: {
    getUsersTagList() {
      this.$httpAuth
        .post("mall/getUsersTagNoMallIdIs0List")
        .then(result => {
          if (result.data.code === 10000) {
            this.TagList = result.data.resp;
            // this.TagList.forEach(val => {
            //   this.checkList.push([]);
            // });
          }
        })
        .catch(err => {});
    },
    getUsersTagListByUsersId(userid) {
      let formData = formdata({
        usersId: userid
      });
      this.$httpAuth
        .post("mall/getUsersTagListByUsersId", formData)
        .then(result => {
          const data = result.data.resp;
          if (result.data.code === 10000) {
            console.log("用户标签", data);
            let arr = [];
            data.forEach(val => {
              if (val && val.usersTagList) {
                val.usersTagList.forEach(val => {
                  arr.push(`${val.utagId},${val.utagName}`);
                });
              }
            });
            this.checkList = arr;
            this.checkChang(arr);
          } else {
          }
        })
        .catch(err => {});
    },
    checkChang(val) {
      let arr = [];
      let arr1 = [];
      val.forEach(val => {
        arr.push(val.split(",")[1]);
        arr1.push(Number(val.split(",")[0]));
      });
      this.tagtext = arr;
      this.utagIdArray = arr1;
    },
    UpdateUsersTag() {
      let type;
      if (this.updateUsers) {
        type = 3;
      } else {
        type = this.page;
      }
      this.$httpAuth
        .post("mall/addOrUpdateUsersTag", {
          usersId: this.updateUsers,
          type,
          utagIdArray: this.utagIdArray,
          usersIdArray: this.selectlist,
          usersSearchParams: this.usersSearchParams? this.usersSearchParams:{}//类型：Object  必有字段  备注：搜索条件 (请求方式为2使用)
        })
        .then(result => {
          if (result.data.code === 10000) {
            this.FormVisible = false;
            this.tagtext = [];
            this.checkList = [];
            this.$emit("updateUsersTag");
            this.$emit("delusers");
            this.$message({
              message: result.data.resp,
              type: "success"
            });
          }else{
            this.FormVisible = false;
            this.tagtext = [];
            this.checkList = [];
            this.$emit("updateUsersTag");
            this.$emit("delusers");
             this.$message({
              message: result.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    closeTap() {
      this.tagtext = [];
      this.checkList = [];
      this.$emit("closedialogForm");
      this.$emit("delusers");
    }
  },
  watch: {
    tabFormVisible(val) {
      this.FormVisible = val;
    },
    updateUsers(val) {
      console.log(val)
      if (val) {
        this.getUsersTagListByUsersId(val);
      }
    }
  }
};
</script>
  
<style scoped lang="less">
/deep/ .el-dialog{
  height: 80%;
  overflow-y: scroll;
}
.hascheck {
  width: 100%;
  padding: 20px;
  text-align: center;
  height: 150px;
  box-sizing: border-box;
  background: #f4fbf4;
  margin-top: 10px;
  .nocheck {
    line-height: 150px;
  }
  .check {
    display: flex;
    flex-wrap: wrap;
  }
}
.check_ts {
  margin-top: 20px;
  .ts {
    color: #f8b56d;
    margin-top: 10px;
  }
}
.check_box {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
  .el-checkbox + .el-checkbox {
    margin-left: 0px;
  }
  .el-checkbox {
    margin-right: 30px;
    margin-bottom: 10px;
    width: 180px;
  }
}
</style>