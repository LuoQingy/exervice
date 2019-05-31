<template>
  <div id="details">
        <div class="big_img" ref="narrow">
            <van-swipe class="swipelist" :width="swiperLiWidth" :touchable="true" :show-indicators="false">
            <van-swipe-item v-for="(item, index) in couponInfo.commodityImgList" :key="index">
                <div class="swipeImg"  @click="alertBigEvemt(index,item.ciImagerUrl)">
                    <img :src="item.ciImagerUrl" alt="">
                </div>
            </van-swipe-item>
            </van-swipe>
        </div>
          
      <!-- 点击图片变全屏 -->
        <div :style="swiperStyle" v-show="secondScreenCheck" id="swiper">
          <div>
            <div class="lunbo">
              <van-swipe :initial-swipe='swipeIndex' @change="onChange" :show-indicators="false">
                <van-swipe-item v-for="(item,index) in couponInfo.commodityImgList" :key="index">
                  <div >
                    <img :src="item.ciImagerUrl">
                  </div>
                </van-swipe-item>
              </van-swipe>
            </div>
            <div  @click="loadshareimg()" >
                <img class="downloadimg" src="../../assets/img/groupbuy/download_icon.png" alt="">
            </div>
             <div @click="canaelBigEvent()">
                <img class="closeloadimg"  src="../../assets/img/groupbuy/close_icon.png" alt="">
            </div>
            <div class="numberimg">
               {{imgIndex}}/{{ImgLength}}
            </div>
          </div>
        </div>
     
  </div>
</template>

<script>
  import {Toast} from 'vant';
 
  export default {
   props:{
       couponInfo:{}
   },
    data() {
      return {
        swipeIndex: 0,//当前轮播图下标
        imglist: [],//放大图片的始祖
        relateAttr: [],//相关属性
        certainAttr: [],//相关属性里的某些属性
        secondScreenCheck: false,
        imgurl:'',//点击放大的图片
        swiperStyle: {
          'width': window.innerWidth / window.innerWidth * 10 + 'rem',
          'height': window.innerHeight / window.innerWidth * 10 + 'rem',
          'line-height': window.innerHeight / window.innerWidth * 10 + 'rem',
          'position': 'fixed',
          'top': '0rem',
          'bottom': '0rem',
          'left': '0rem',
          'right': '0rem',
          'z-index': '100',
          'background': 'rgba(0, 0, 0, 1)',
          'overflow': 'hidden',
        },
        swiperLiWidth:document.documentElement.getBoundingClientRect().width/3,
        imgIndex:1,
        ImgLength:1
      }
    },
    created(){
      setTimeout(()=>{
          let commodityImgList=this.couponInfo.commodityImgList
          this.ImgLength=commodityImgList.length
      },1000)
    },
    mounted() {
      this.$nextTick(() => {
       
      })
    },
    methods: {
       onChange(index){//获取第几张
            this.imgIndex=index+1
        },
      alertBigEvemt(index,imgurl) {//点击放大图片
        // this.imglist=this.couponInfo.commodityImgList
        this.imgurl=imgurl
        this.secondScreenCheck = true;
        this.swipeIndex = index
      },

      canaelBigEvent() {//点击缩小图片
        // this.swipeIndex = index;
        console.log("pppppp")
        this.secondScreenCheck = false;
      },
      //点击下载图片
        loadshareimg() {
            console.log('点击下载图片')
            console.log(this.imgurl)
            var a = document.createElement('a')
            var event = new MouseEvent('click')
            a.download = this.couponInfo.commodityName //图片的名称
            a.href = this.imgurl
            a.dispatchEvent(event)
        },
      
    },
  }
</script>

<style scoped lang="less">
    
  /* 放大图片 */
  #swiper {
    color: #fff;
  }

  #swiper > div {
    width: 10.8rem;
    height: 100%;
    cursor: pointer;
    position: relative;
  }

  #swiper .lunbo {
    width: 10.8rem;
    height: 100%;
    text-align: center;
  }

  #swiper .lunbo .van-swipe {
    width: 10.8rem;
    height: 100%;
    text-align: center;
  }

  #swiper .lunbo .van-swipe .van-swipe-item img {
    width: 10.8rem;
    vertical-align: middle;
    height: 360px;
  }
  .numberimg{
          position: fixed;
          left: 0.4rem;
          bottom: .2rem;
          width: 1rem;
          height: 1rem;
          line-height: 1rem;
          color: #fff;
          font-size: 0.44rem;
          z-index: 99;
          text-align: center;
  }
  .closeloadimg{
        position: fixed;
        left: .4rem;
        top: .6rem;
        width: .8rem;
  }
  .downloadimg{
        position: fixed;
        right: .4rem;
        bottom: .4rem;
        width: .8rem;
  }
  .swipeImg{
        width: 100%;
        margin-left: .2rem;
        padding: .2rem 0;
        img{
                width: 96%;
                max-height: 2rem;
                display: block;
            }
        
    }
</style>
