<template>
    <div class="myCoupons" :style="totalH">
        <div v-for="(item,index) in grouplist" :key="index" @click="gogroupInfo(item.commodityId,item.commodityType)">
        <div class="swipe">
            <van-swipe :autoplay="3000" class="swipelist">
            <van-swipe-item>
                <img v-lazy="item.ciImagerUrl" />
            </van-swipe-item>
            </van-swipe>
        </div>
        <div class="top">
            <div class="left">
                <p class="title">{{item.commodityName}}</p>
                <p class="subtitle"><span>{{item.commoditySubtitile}}</span></p>
                <p class="intro">
                    <span>&yen;{{item.commodityPreferentialPrice | fixMoney}}</span>
                    <span>&yen;{{item.commodityOriginalPrice | fixMoney}}</span>
                </p>
            </div>
             <div class="right">
                <span>{{item.participationCount}}</span><span>人已参团</span>
            </div>
            
        </div>
        </div>
         <div class="loading" v-show="isLoading">
				<van-loading color="black" type="spinner"/>
                <div>{{loadingtip}}</div>
		</div>
        <div class="nodata" v-if="selectListState">没有数据~</div>
    </div>
</template>
<script>
import { Dialog,Toast } from 'vant';
export default {
    data(){
        return{
            totalH:{
                "height":document.documentElement.clientHeight  +'px'
            },
            images: [
                'https://img.yzcdn.cn/2.jpg',
                'https://img.yzcdn.cn/2.jpg',
            ],
            grouplist:[],
            groupdata:{
                mallId:1,
                pageNum:1,
                pageSize:5,
            },
            flag:false,				
            fullHeight: document.body.scrollTop || document.documentElement.clientHeight,
            isLoading:true,
            loadingtip:'',//加载提示语
            selectListState:false
          
        }
    },
    created(){
       
    },
    filters:{
        fixMoney(value){//数值两位小数
            let num=(value*1).toFixed(2)
            return num
        }
    },
    mounted(){
        this.getCommodityList()
         //			上拉刷新数据
			window.addEventListener('scroll', () => {
				if((window.scrollY+this.fullHeight)>=document.documentElement.scrollHeight){
					if(this.flag){
						this.getCommodityList()
					}
				}
			})
    },
    methods:{
        getCommodityList(){//团购列表
        let _this=this
        let data="mallId="+this.$mallId+"&pageNum="+this.groupdata.pageNum+"&pageSize="+this.groupdata.pageSize
         _this.isLoading=true
            _this.loadingtip='正在加载中'
            this.$formAxios({
                    url:'/open/getCommodityList',
                    method:'post',
                    data:data
                }).then((data)=>{
                        _this.isLoading=false
                        _this.loadingtip='加载完成'
                        if(data.data.code==10000){
                             this.selectListState=false
                            let resp=data.data.resp
                            for(let i=0;i<resp.list.length;i++){
                                _this.grouplist.push(resp.list[i])
                            }
                            if(resp.pages<= _this.groupdata.pageNum){
                                _this.loadingtip='没有更多了'
                                _this.flag=false
                            }else{
                                _this.flag=true
                                _this.groupdata.pageNum++
                            }
                    
                        }else{
                            this.selectListState=true
                        }
                }).catch((err)=>{
                    console.log(err)
                });
        },
       gogroupInfo(commodityId,commodityType){//跳转团购详情 类型 1:团购商品 2:售卖代金券
            if(commodityType==1){
                 this.$router.push({
                    name:'groupInfo',
                    query:{
                        commodityId:commodityId,
                        mallId: this.$mallId
                    }
                })
            }else if(commodityType==2){
                this.$router.push({
                        name:'cashCouponInfo',
                        query:{
                            commodityId:commodityId,
                            mallId: this.$mallId
                        }
                    })
            }
           
        },
    },
    destroyed(){
        window.addEventListener('scroll', () => {
				if((window.scrollY+this.fullHeight)>=document.documentElement.scrollHeight){
					if(this.flag){
						this.getCommodityList()
					}
				}
			})
    }
}
</script>
<style lang="less" scoped>
    .myCoupons{
        width: 100%;
        background: #f2f2f2;
        position: relative;
        .swipe{
            .swipelist {
                width: 100%;
                height: 5rem;
                margin: 0 auto;
                line-height: 5rem;
                text-align: center;
                img{
                    width: 100%; 
                    max-height: 5rem;
                    background: #fff;
                }
            }
        }
        .top{
            width: 100%;
            background: #fff;
            padding: .2rem 0;
            border-bottom: .34rem solid #f2f2f2;
            position: relative;
             display: flex;
           
            .left{
                flex: 3;
                margin-left: .2rem;
                   width: 6rem;
                .title{
                    font-size:0.46rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    height: .6rem;
                    line-height: .6rem;
                }
                .subtitle{
                    font-size:0.34rem;
                    font-weight:400;
                    color:#999;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    height: .6rem;
                    line-height: .6rem;
                }
                .intro{
                    height: .6rem;
                    line-height: .2rem;
                    span:nth-child(1){
                        font-size:0.44rem;
                        color:rgba(255,150,0,1);
                    }
                    span:nth-child(2){
                        font-size:0.28rem;
                        text-decoration:line-through;
                        color:rgba(153,153,153,1);
                    }
                }
                
            }
            .right{
                flex: 2;
                text-align: right;
                margin-right: .2rem;
                span:nth-child(1){
                        font-size:0.39rem;
                        color:#996633;
                    }
                    span:nth-child(2){
                        font-size:0.28rem;
                        color:#999999;
                    }
                
            }
            
        }
       .loading{
            width: 100%;
            margin: .2rem auto;
            text-align: center;
            .van-loading{
                text-align: center;
                width: 100%;
                margin: .2rem auto;
            }
            div{
                font-size: .4rem;
                color: #666;
            }
        }
        .nodata{
            width: 3rem;
            font-size: .4rem;
            margin:auto;
            text-align: center;
            color: #999;
            padding-top: 2rem;
        }
    }
</style>

