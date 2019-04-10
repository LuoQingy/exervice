<template>
    <div class="btn_list">
        <template v-for="(item,index) in initdata">
            <el-button type="info" @click="chenkinit(index)" round>{{item.screeningChainNodeName}}</el-button>
        </template>
    </div>
</template>
  
<script>
export default {
  data() {
    return {
      initdata: [] //基础筛选条件
    };
  },
  props:{
    btntype:{ //按钮组件是点击第一次 base ,或者 or，并且 and
      type:String,
      default:'base'
    },
    index:{ //点击或者传入index  判断点击的是哪个按钮组件
      default:null
    }
  },
  created() {
    this.getScreeningInitData();
  },
  methods: {
    //   获取基础筛选条件
    getScreeningInitData() {
      this.$xwhttpAuth
        .post("mall/getScreeningInitData")
        .then(result => {
          if (result.data.code === 10000) {
            this.initdata = result.data.resp;
          }
        })
        .catch(err => {});
    },
    // 点击基础筛选
    chenkinit(index) {
      console.log('触发基础选项')
      this.$emit('updata',this.initdata[index].widget,this.btntype,this.index);
    }
  }
};
</script>
  
<style scoped lang="less">
.btn_list {
  padding-left: 20px;
}
</style>