<template>
    <div class="myCoupons" :style="totalH">
        <div class="swipenav">
            <div class="top">
                <div class="left">
                    <p class="title"><img src="../../assets/img/personal/stores_icon.png" alt="">{{couponInfo.commodityName}}</p>
                    <p class="subtitle"><span>{{couponInfo.commoditySubtitile}}</span></p>
                    <p class="intro">
                        <!-- <span>【普通团购】</span> -->
                        <span v-if="couponInfo.commodityRestrict!=undefined">【不限购】</span>
                        <span v-if="!couponInfo.commodityIsReturnable">【不可退】</span>
                    </p>
                </div>
                <div class="right">
                    <span>{{couponInfo.participationCount}}</span><span>人已参团</span>
                </div>
            </div>
            <!-- <van-swipe class="swipelist" :width="swiperLiWidth" :touchable="true" :show-indicators="false">
            <van-swipe-item v-for="(item, index) in couponInfo.commodityImgList" :key="index">
                <div class="swipeImg">
                    <img :src="item.ciImagerUrl" alt="">
                </div>
            </van-swipe-item>
            </van-swipe> -->
            <imgShow :couponInfo="couponInfo"></imgShow> 
            <div class="footer" v-if="couponInfo.commodityCommodityDetails">
                <div v-html="couponInfo.commodityCommodityDetails"></div>
            </div>
        </div>
        <div class="footermg">
        <div class="list" v-if="usersCommodityInfoVo.sellerName!=undefined">
            <div class="left">
            <div class="leftimg">
                <img :src="usersCommodityInfoVo.logo" alt="">
            </div>
            <div class="middle">
                    <p class="name">{{usersCommodityInfoVo.sellerName}}</p>
                    <p class="info"><span>{{usersCommodityInfoVo.sellerAddress}}</span></p>
                    <p class="upNumber">
                        <span @click="tabphone(usersCommodityInfoVo.sellerPhone)"><img src="../../assets/img/phone.png" alt="">联系门店</span>
                        <span @click="goindoorLocation"><img src="../../assets/img/direction_iocn.png" alt="">到这去</span>
                    </p>
            </div>
            </div>
        </div>
        </div>
        <div class="account">
                <div class="left">
                    <span>&yen;{{couponInfo.commodityPreferentialPrice | fixMoney}}</span>
                    <span>&yen;{{couponInfo.commodityOriginalPrice | fixMoney}}</span>
                </div>
                <div class="right">
                    <span @click="goconfirmOrder()">立即抢购</span>
                </div>
        </div>
        <tabtel :telInfo="telInfo"></tabtel>
    </div>
</template>
<script>
import { Dialog,Toast } from 'vant';
import imgShow from './imgShow';
import tabtel from '../../common/tabtel.vue'
export default {
    data(){
        return{
            totalH:{
                "height":document.documentElement.clientHeight  +'px'
            },
            swiperLiWidth:document.documentElement.getBoundingClientRect().width/3,
            couponInfo:{
               commodityPreferentialPrice:0,
               commodityOriginalPrice:0
            },
            usersCommodityInfoVo:{},
            commodityId:0,
            telInfo:{}
        }
    },
    components:{
        imgShow,
        tabtel
    },
    created(){
        this.commodityId=this.$route.query.commodityId
    },
    mounted(){
        this.getCommodityInfo()
    },
     filters:{
        fixMoney(value){//数值两位小数
            let num=(value*1).toFixed(2)
            return num
        }
    },
    methods:{
        
        tabphone(){//拨打电话
            this.telInfo={
                telState:true,
                sellerPhone:this.usersCommodityInfoVo.sellerPhone
            }
        },
        
        goindoorLocation(){
            this.$router.push({
                path:'/project/indoorLocation',
                name:'indoorLocation',
                query:{
                    mallId: this.$mallId
                },
            })
        },
       
        goconfirmOrder(){//跳转买单页面
            let href=window.location.href
            if(href.indexOf('?from=')!=-1){//由分享进入的,重定向地址，解决由分享进入的微信支付问题
                window.location.href=this.$rooturl+'/resetUrl?url='+this.$pageurl+'/#/project/groupConfirm?commodityId='+this.commodityId+'&mallId='+this.$mallId
            }else{//不是分享进入的
                this.$router.push({
                    name:'groupConfirm',
                    query:{
                        commodityId:this.commodityId,
                        mallId: this.$mallId
                    }
                })
            }
            
            
        },
        //获取团购详情
        getCommodityInfo(){
            let _this=this
            let data="mallId="+this.$mallId+"&commodityId="+this.commodityId
            this.$formAxios({
                url:'/open/getCommodityInfo',
                method:'post',
                data:data
            }).then((data)=>{
                if(data.data.code==10000){
                    let resp=data.data.resp
                    _this.couponInfo=resp
                    if(resp.usersCommodityInfoVo){
                         _this.usersCommodityInfoVo=resp.usersCommodityInfoVo
                    }
                   
                }
                
            }).catch((err)=>{
                console.log(err)
            });
        },
        refundmoney(){//退款
            Dialog.confirm({
            title: '退款将退回到微信零钱，是否确认',
            }).then(() => {
            // on confirm
            }).catch(() => {
            // on cancel
            });
        }
    }
}
</script>
<style lang="less" scoped>
    .myCoupons{
        width: 100%;
        background: #f2f2f2;
        position: relative;
        
        .swipenav{
                width: 100%;
                background: #fff;
            .top{
            width: 100%;
            display: flex;
            background: #fff;
            padding: .5rem 0 0 0;
            // height: 1.6rem;
            .left{
                flex: 3;
                margin-left: .2rem;
                
                .title{
                    font-size:0.44rem;
                    font-weight:bold;
                    margin-top: .1rem;
                    img{
                        width: .5rem;
                        vertical-align: text-top;
                        margin-right: .1rem;
                    }
                }
                .subtitle{
                    font-size:0.32rem;
                    font-weight:400;
                    color:#333;
                    margin-top: 10px;
                    
                }
                .intro{
                    font-size:0.28rem;
                    font-weight:400;
                    color:#996633;
                    margin-top: 10px;
                }
            }
            
            .right{
                flex: 2;
                text-align: right;
                margin-right: .2rem;
                font-size: .4rem;
                height: 1.6rem;
                line-height: 1.6rem;
                span:nth-child(1){
                  color:rgba(153,102,51,1);
                    margin-right: .2rem;
                    font-size:0.34rem;
                }
                span:nth-child(2){
                  color:#999999;
                  font-size:0.32rem;
                }
                
            }
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
               
            }
        .footer{
                width: 100%;
                background: #fff;
                //  border-top: .2rem solid #f2f2f2;
                font-size: .4rem;
            div{
                padding:0.2rem;
                p:nth-child(1){
                    font-size:0.4rem;
                    color:rgba(153,153,153,1);
                    margin-bottom: .2rem;
                }
                p:nth-child(2){
                    font-size:0.4rem;
                    color:rgba(51,51,51,1);
                }
            }
           
        }
        .footermg{
            padding-bottom: 1.6rem;
        
        .list{
            width: 100%;
            height: 2.2rem;
            background: #fff;
             border-top: .34rem solid #f2f2f2;
             border-bottom: .34rem solid #f2f2f2;
            display: flex;
            
            .left{
                flex: 5;
                display: flex;
            .leftimg{
                flex: 1;
                img{
                    width: 1.6rem;
                    height: 1.6rem;
                    margin: .3rem 0 0 .2rem;
                }
                
            }
           .middle{
                flex: 4;
                margin-left: .2rem;
                .name{
                    font-size: .42rem;
                    margin-top: .3rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    width: 5rem;
                    padding: .1rem 0 0 0;
                }
                .info{
                    font-size: .28rem;
                    margin-top: .1rem;
                    span{
                        margin-right: .2rem;
                        color: #999;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        width: 7rem;
                        padding: .1rem 0 0 0;
                        display: inline-block;
                    }
                }
                .upNumber{
                    font-size: .28rem;
                    margin-top: .1rem;
                    span:nth-child(1){
                        border-right: 1px solid rgba(65,169,249,1);
                        padding-right: .2rem;
                    }
                    span{
                        color:rgba(65,169,249,1);
                        margin-right: .2rem;
                        img{
                            width: .4rem;
                            font-size: .28rem;
                            margin-right: .2rem;
                            color:rgba(65,169,249,1);
                            vertical-align: bottom;
                        }
                    }
                    
                }
            }
            }
            .right{
                flex: 1;
                text-align: center;
                margin-right: .2rem;
                img{
                    width: 2rem;
                    margin-top: 0.4rem;
                }
                
            }
        }
        }
      // 立即抢购部分
        .account{
            display: flex;
            height: 1.4rem;
            line-height: 1.4rem;
            background: #fff;
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
                .left{
                    flex: 1;
                    font-size: .44rem;
                    margin-left: .2rem;
                    span:nth-child(1){
                        flex: 1;
                        color: #FF9600;
                        margin-right: .4rem;
                    } 
                    span:nth-child(2){
                        flex: 1;
                        color: #999999;
                        text-decoration:line-through;
                    } 
                }
                .right{
                    flex: 1;
                    text-align: right;
                     font-size: .4rem;
                    span{
                        display: inline-block;
                        width: 3rem;
                        line-height: 1.4rem;
                        height: 1.4rem;
                        color: #fff;
                        background: #DDC993;
                        text-align: center;
                    }
                }
        }
    }
</style>

