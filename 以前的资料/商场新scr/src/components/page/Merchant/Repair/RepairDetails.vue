<template>
  <div>
    <div>
      <el-breadcrumb separator="/" class="content_title">
        <el-breadcrumb-item>物业报修</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="bigbox">
      <p class="title">报修单信息</p>
      <div class="list_box">
        <p class="list">
          <span class="first">报修单状态:</span>
          <span>{{info.repairsStatus|status}}</span>
        </p>
        <p class="list">
          <span class="first">申请商户:</span>
          <span v-if="info.merchant">{{info.merchant.merchantName}}</span>
        </p>
        <p class="list">
          <span class="first">申请时间:</span>
          <span>{{info.repairsCreateTime}}</span>
        </p>
        <p class="list">
          <span class="first">报修单号:</span>
          <span>{{info.repairsNumber}}</span>
        </p>
        <p class="list" v-if="info.repairsStatus===2||info.repairsStatus===3">
          <span class="first">维修人:</span>
          <span v-if="info.admin">{{info.admin.adminName}}</span>
        </p>
        <p class="list" v-if="info.repairsStatus===2||info.repairsStatus===3">
          <span class="first">受理时间:</span>
          <span>{{info.repairsAcceptanceTime}}</span>
        </p>
        <p class="list" v-if="info.repairsStatus===3">
          <span class="first">处理完成时间:</span>
          <span>{{info.repairsDisposeTime}}</span>
        </p>
        <p class="list" v-if="info.repairsStatus===3">
          <span class="first">申请用户评价:</span>
          <span>{{info.repairsEvaluate|repairsEvaluate}}</span>
        </p>
      </div>
    </div>
    <div class="bigbox">
      <p class="title">报修内容</p>
      <div class="list_box">
        <p class="list">
          <span class="first">报修项目:</span>
          <span v-if='info.repairsProject'>{{info.repairsProject.rpRepairsProject}}</span>
        </p>
        <p class="list">
          <span class="first">服务时间:</span>
          <span>{{info.repairsServeTime}}</span>
        </p>
        <p class="list">
          <span class="first">联系方式:</span>
          <span>{{info.repairsContactWay}}</span>
        </p>
        <p class="list">
          <span class="first">备注:</span>
          <span>{{info.repairsRemark}}</span>
        </p>
        <div class="list">
          <span class="first">图片:</span>
          <p v-if="info.repairsImagesList&&info.repairsImagesList.length>0">
            <template v-for="item in info.repairsImagesList">
              <span class="img">
                <img :src="item.riImagesUrl" alt>
              </span>
            </template>
          </p>
        </div>
      </div>
    </div>
    <div class="bigbox">
      <div class="box">
        <el-button v-if="info.repairsStatus ===1" size="medium" class="left_btn" @click="assign" type="primary">指派维修人</el-button>
        <el-button size="medium" style="width:90px" @click="goback">返回</el-button>
      </div>
    </div>
    <admindialog :Visible="Visible" :repairsId="repairsId"  @close="close"></admindialog>
  </div>
</template>
  
<script>
var _this;
import admindialog from "./admindialog";
export default {
  components:{
admindialog
  },
  data() {
    _this = this;
    return {
      Visible:false,
      repairsId: 0,
      options2: [
        {
          label: "全部",
          type: " "
        },
        {
          label: "未处理",
          type: "1"
        },
        {
          label: "已受理",
          type: "2"
        },
        {
          label: "已处理",
          type: "3"
        },
        {
          label: "拒绝受理",
          type: "4"
        }
      ],
      info: {}
    };
  },
  filters: {
    status(val) {
      if (val) {
        let status;
        _this.options2.forEach(value => {
          if (value.type == val) {
            status = value.label;
          }
        });
        return status;
      }
    },
    repairsEvaluate(val){
        if(val===0){
          return '未评论'
        }else if(val===1){
          return '好评'
        }else if(val===2){
          return '差评'
        }else if(val===3){
          return '不评论'
        }
    }
  },
  created() {
    this.repairsId = +this.$route.query.repairsId;
    this.getRepairsInfo();
  },
  methods: {
    getRepairsInfo() {
      this.$httpAuth
        .post("/gm/getRepairsInfo", {
          repairsId: this.repairsId
        })
        .then(result => {
          if (result.data.code === 10000) {
            this.info = result.data.resp;
          } else {
            this.$message({
              message: result.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    // 指派受理人
    assign() {
      this.Visible = true;
    },
     // 关闭dialog
    close() {
      this.Visible = false;
      this.getRepairsInfo();
    },
    // 返回
    goback(){
      this.$router.push({
        path:'/merchant/repairlist'
      })
    }
  }
};
</script>
  
<style scoped lang='less'>
.bigbox {
  font-size: 14px;
  margin-top: 15px;
  border: 1px solid #ccc;
  margin-left: 20px;
  .title {
    padding-left: 15px;
    height: 30px;
    line-height: 30px;
    background: #d7d7d7;
  }
  .list_box {
    padding: 15px 0 15px 200px;
    background: #f2f2f2;
    .list {
      margin-bottom: 5px;
      display: flex;
      .first {
        width: 100px;
        text-align: right;
        margin-right: 15px;
      }
      .img {
        margin-right: 15px;
        img {
          width: 100px;
        }
      }
    }
  }
  .box {
    background: #f2f2f2;
    padding: 15px 0 50px;
    padding-left: 310px;
    .left_btn {
      margin-right: 100px;
    }
  }
}
</style>