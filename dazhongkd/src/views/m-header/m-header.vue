<template>
    <header>
        <div class="top-menu">
            <div id="J_top_menu" class="top-menu-list">
                <router-link
                v-for="(item,index) of newList"
                :key="index"
                tag="a"
                @click.native="addClass(index)"
                class="tab-item"
                :to="`/home/index/${item}`"
                >
                    <template v-if="item=='看点'" lang="html">推荐</template>
                    <template lang="html" v-else>{{item}}</template>
                </router-link>
            </div>
        </div>
    </header>
</template>

<script>
export default {
    data(){
        return{
            newList:["推荐",
  "美食",
  "旅游",
  "时尚",
  "健康",
  "汽车",
  "娱乐",
  "猎奇",
  "社会",
  "财经",
  "体育",
  "国内",
  "家居",
  "科技",
  "电视",
  "NBA",
  "人文",
  "数码",]
        }
    },
    mounted(){
        
    },
    methods:{
        addClass(index){

        }
    }
}
</script>

<style lang="less" scoped>
    header {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0px;
  width: px2rem(375px);
  max-width: 750px;
  height: 35px;
  .top-menu {
    position: relative;
    height: 35px;
    background-color: #f4f5f6;
    // overflow-y: hidden;
    &:after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background-image: -webkit-linear-gradient(
        top,
        transparent,
        transparent 40%,
        #ddd 0
      );
      background-size: 100% 1px;
      background-position: bottom;
      background-repeat: no-repeat;
    }

    .top-menu-list {
      overflow: hidden;
      overflow-x: scroll;
      // margin-right: 40px;
      white-space: nowrap;
      -webkit-overflow-scrolling: touch;
      a {
        font-size: 16px;
        line-height: 25px;
        // display: inline-block;
        // height: 25px;
        margin: 0px 0 5px 5px;
        padding: 0 10px;
        -webkit-animation: fadeout 0.4s;
        animation: fadeout 0.4s;
        vertical-align: middle;
        white-space: nowrap;
        color: #999999;
        text-decoration: none;
      }
      .router-link-active {
        color: #D4221C;
        font-size: 16px;
        position: relative;
        font-weight: bold;
      }
    }
  }
}
</style>
