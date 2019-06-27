<template>
  <div style="height:100%;">
    <div>
      <el-breadcrumb separator="/" class="content_title">
        <el-breadcrumb-item>会员管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="box">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="会员等级设置" name="shipsetting"></el-tab-pane>
        <el-tab-pane label="会员权益" name="menberright"></el-tab-pane>
        <el-tab-pane label="积分规则" name="integralRule"></el-tab-pane>
      </el-tabs>
    </div>
    
    <router-view></router-view>
  </div>
</template>
  
<script>
export default {
  data() {
    return {
      activeName: "shipsetting"
    };
  },
  methods: {
    handleClick(val) {
        console.log(this.activeName)
      this.$router.push({name:this.activeName});
    },
    changactive(){
      let routerName = this.$route.fullPath;
      let path = routerName.split('/');
      this.activeName = path[3];
    }
  },
  mounted(){
      this.changactive();
  },
  watch: {
    $route(val) {
      this.changactive();
    }
  }
};
</script>
  
<style scoped>
.box /deep/ .el-tabs__header{
    margin: 0;
}
</style>