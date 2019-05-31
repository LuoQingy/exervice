<template>
  <div id="integralRule">
    <div class="integralRulebox">
      <el-menu :default-active="activeName" class="el-menu-vertical-demo" router>
        <el-menu-item index="/member/MenberSetting/integralRule/integralAcquisition">
          <span slot="title">积分获取规则</span>
        </el-menu-item>
        <el-menu-item index="/member/MenberSetting/integralRule/integralExchange">
          <span slot="title">积分兑换规则</span>
        </el-menu-item>
        <el-menu-item index="/member/MenberSetting/integralRule/integralValidityPeriod">
          <span slot="title">积分有效期设定</span>
        </el-menu-item>
        <el-menu-item index="/member/MenberSetting/integralRule/integralguide">
          <span slot="title">积分指南</span>
        </el-menu-item>
      </el-menu>
      <div style="margin:15px 0 0 15px;flex:1">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "/member/MenberSetting/integralRule/integralAcquisition"
    };
  },
  mounted() {
    this.changactive();
  },
  methods: {
    handleClick() {
      //tab切换
      if (this.activeName == "first") {
        this.$router.push(
          "/member/MenberSetting/integralRule/integralAcquisition"
        );
      } else if (this.activeName == "second") {
        this.$router.push(
          "/member/MenberSetting/integralRule/integralExchange"
        );
      } else if (this.activeName == "third") {
        this.$router.push(
          "/member/MenberSetting/integralRule/integralValidityPeriod"
        );
      } else if (this.activeName == "fourth") {
        this.$router.push("/member/MenberSetting/integralRule/integralguide");
      }
    },
    changactive() {
      let routerName = this.$route.fullPath;
        this.activeName = routerName;
    }
  },
  watch: {
    $route(val) {
      this.changactive();
    }
  }
};
</script>

<style lang="less" scoped>
#integralRule {
  height: 100%;
  .integralRulebox{
    display: flex;
    height: 100%;
  }
}
.el-menu-vertical-demo{
  width: 150px;
}
</style>
