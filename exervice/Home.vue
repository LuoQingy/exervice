<template>
  <div class="home">
    <m-header></m-header>
    <router-view />
  </div>
</template>

<script>
import mHeader from './m-header/m-header.vue'
export default {
  components: { mHeader },
  data() {
    return{
      timer:null,
      num:0,
    }
  },
  mounted(){
    console.log(this.name);
    Cookies.set('name', 'value');
    console.log('cookies:  '+Cookies.get('name'));
    console.log(typeof(Cookies.get('num')));
    function information(time,check,id=0,title=0){
      var timer=null;
      var num  =0;
      if(Cookies.get('num')){
        num= Number(Cookies.get('num'));
      } 
      timer = setInterval(() =>{
        num = num + 5;
        console.log(num);
        Cookies.set('num',num);
        console.log(countDown(num));
        console.log('函数里面')
      },time)
      function countDown(times){
        var day=0,
          hour=0,
          minute=0,
          second=0;//时间默认值
        if(times > 0){
          day = Math.floor(times / (60 * 60 * 24));
          hour = Math.floor(times / (60 * 60)) - (day * 24);
          minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60);
          second = Math.floor(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
        }
        if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;
        if(day){
          if (hour <= 9) hour = '0' + hour;
          return day+":"+hour+"："+minute+"："+second;
        }else if(hour){
          if (hour <= 9) hour = '0' + hour;
          return hour+"："+minute+"："+second;
        }else {
          return minute+"："+second;
        }
      }
    }
    information(5000,true)
    if(Cookies.get('num')){
      this.num = Number(Cookies.get('num'));
    }  
    console.log(typeof(this.num),this.num);
    // this.timer = setInterval(() =>{
    //   this.num = this.num + 5;
    //   console.log(this.num);
    //   Cookies.set('num',this.num);
    //   console.log(countDown(this.num));
    // },5000)
    function countDown(times){
      var day=0,
        hour=0,
        minute=0,
        second=0;//时间默认值
      if(times > 0){
        day = Math.floor(times / (60 * 60 * 24));
        hour = Math.floor(times / (60 * 60)) - (day * 24);
        minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60);
        second = Math.floor(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
      }
      if (minute <= 9) minute = '0' + minute;
      if (second <= 9) second = '0' + second;
      if(day){
        if (hour <= 9) hour = '0' + hour;
        return day+":"+hour+"："+minute+"："+second;
      }else if(hour){
        if (hour <= 9) hour = '0' + hour;
        return hour+"："+minute+"："+second;
      }else {
        return minute+"："+second;
      }
    }
  },
  destroyed(){
    //clearInterval(this.timer)
  }
}
</script>

<style lang="less" scoped>
.home {
  margin: 0 auto;
}
</style>

