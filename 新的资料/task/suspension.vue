<template>
    <div >
        <div v-show="check" @click="seeList" id="infor">
            <canvas id="myCanvas" width="50px" height="50px">
                浏览器或者次版本不支持canvas
            </canvas>
        </div>
        <div v-if="falg" > {{isChangeCheck}}
            <div  id="infor-list" v-show="!check" @click="seeList">
                <p class="duration">浏览时长 {{record.durationTime}}</p>
                <h3 class="record-title"><i></i> 浏览{{record.lists.length}}篇文章</h3>
            </div>
        </div>
    </div>
</template>

<script>
import information from "../../plugin/canvas";
export default {
    props: {"check": { type: Boolean, default: true } },
    data(){
        return{
            record:{
                durationTime:'',//浏览时长
                lists:[],//浏览过的文章

            },
            falg:false,
            timer:null,
        }
    },
    mounted(){
        try {
          copy("http://www.hbbgsb.cn/main/actionApiCodeInfo/2",'app')
        } catch (error) {
          console.log(error)
        }
        var num = 0
        var cricle = new WaveCircleProgress("myCanvas");
        this.timer = setInterval(()=>{
            num = num+1;
			num = num%100;
            cricle.setProgress(num);
            console.log(cricle.setTextContent('12:14','4篇'))
            localStorage.setItem('check','false')  
            this.record = this.$information(5000,true);
        },1000)
        this.$root.$on('change',(msg)=>{
            console.log(msg)
            this.check = true;
        　　//msg是通过事件传递来的数据 (传递来的123)
        });
    },
    computed:{
        isChangeCheck(){
           let branch =  localStorage.getItem('check');
            return branch
        }
    },
    watch: {
        $route(to, from) {
            //console.log(to,from)
            this.check = true;
        },
        isChangeCheck(){
            console.log('变化了');
        }
    },
   
    methods:{
        seeList(){//查看列表
            this.check = !this.check;
            console.log(this.check);
            this.$overallCheck = false;
            console.log(this.$overallCheck);
            localStorage.setItem('check','true')      
            if(!this.check){
               this.record =  this.$information();
            }
            this.falg = true;  
        },
        
    },
    computed:{
        getCheck(){
            this.$information(5000,true)
        }
    },
    destroyed() {
        clearInterval(this.timer);
    },
}
</script>

<style lang="less" scoped>
#infor{
    position: fixed;
    right:10px;
    bottom: 30px;
    z-index: 10000;
    font-size: 12px;
    text-align: center;
    line-height: 36px;
    color: #fff;
    
    overflow: hidden;
    #myCanvas{
        position: absolute;
        left: 0px;
        top: 0px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        -webkit-border-radius: 50%;
        border: 2px solid #007ed7;
        background: rgba(255, 255, 255, .6);
    }
}

#infor-list{
    position: fixed;
    right:10px;
    bottom: 80px;
    z-index: 10001;
    font-size: 12px;
    padding: 0px 5px;
    max-width: 140px;
    height: 36px;
    text-align: center;
    line-height: 18px;
    color: #fff;
    background: rgba(0, 0, 0, .3)
    
   
}
</style>

