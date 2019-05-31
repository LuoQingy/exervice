<template>
    <div >
        <div v-show="check" @click="seeList" id="infor">记录</div>
        <div v-if="falg" >
            <div v-show="!check" @click="seeList" id="popup-alert">
                <div  id="infor-list">
                    <!-- <p class="duration">浏览时长 {{durationTime}}</p> -->
                    <h3 class="record-title"><i></i> 浏览篇章记录</h3>
                    <ul>
                        <li v-for="(item,index) in lists" :key="index">
                        
                            <p class="duration">标题：{{item.title}}</p>
                            <P class="duration-time">
                                浏览时长 {{item.num}}
                            </P>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {"check": { type: Boolean, default: true } },
    data(){
        return{
            durationTime:'',//浏览时长
            lists:[],//浏览过的文章
            falg:false,
            startTime:null,
        }
    },
    watch: {
        $route(to, from) {
            //console.log(this.$router)
            console.log(to,from)
            if(to.params.id){
                console.log('是在详情')
                if(to.params.id == from.params.id){

                }else if(from.params.id){
                    this.$information(from.params.id,'',from.params.type,0,new Date().getTime(),true)
                }
            }else{
                if(from.params.id){
                    this.$information(from.params.id,'',from.params.type,0,new Date().getTime(),true)
                    console.log('之前在详情')
                }
                console.log('不在详情')
            }
        }
    },
    methods:{
        seeList(){//查看列表
            this.check = !this.check;
            console.log(this.check)
            
            if(!this.check){
                if(this.$route.params.id){
                    this.lists = this.$information(this.$route.params.id,0,this.$route.params.type,0,new Date().getTime(),false);
                }else{
                    this.lists = this.$information(0,0,0,0,new Date().getTime(),false)
                }
                
                console.log(this.lists)
            }
            this.falg = true;  
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
    bottom: 80px;
    z-index: 10000;
    font-size: 12px;
    text-align: center;
    line-height: 35px;
    color: #fff;
    width:35px;
    height: 35px;
    border-radius: 50%;
    -webkit-border-radius: 50%;
    background: rgba(0, 0, 0, .4)
}
#popup-alert{
    position: fixed;
    right:0px;
    bottom: 0px;
    top: 0px;
    left: 0px;
    z-index: 10001;
    background: rgba(0, 0, 0, 1); 
    overflow: hidden;
}
#infor-list{
    position: absolute;
    right:0px;
    bottom: 0px;
    top: 0px;
    left: 0;
    z-index: 10002;
    font-size: 12px;
    text-align: center;
    color: #000;
    overflow: auto;
    background: rgba(255, 255, 255, 1);
    .record-title{
        line-height: 35px;
        text-align: center;
        font-size: 16px;
        background: #fff;
        color: #000;
        border-bottom: 1px solid #f3f3f3;
        i{
            width: 10px;  
            height: 10px;  
            position: absolute;  
            left: 10px;
            top: 17px;
            border-right: 1px solid #999;  
            border-top: 1px solid #999;  
            -webkit-transform: translate(0,-50%) rotate(-135deg);  
            transform: translate(0,-50%) rotate(-135deg);  
        }
    }
    ul{
        // padding: 0px 10px;
    }
    ul>li{
        padding-top: 10px;
        padding: 3px 10px 10px 10px;
        
        // display: -webkit-box;
        // display: -ms-flexbox;
        // display: flex;
        //  flex-direction: row-reverse;
        // display: -webkit-flex;
        overflow: hidden;
        border-bottom: 1px solid #f3f3f3;
    }
    .duration{
        line-height: 18px;
        text-align: left;
        font-size: 14px;
        // flex-grow: 2;
        font-weight: 400;
    }
    .duration-time{
        // width: 60px;
        line-height: 14px;
        text-align: right;
        font-size: 12px;
        // flex-grow: 0;
        // flex-shrink: 0;
    }
   
}
</style>

