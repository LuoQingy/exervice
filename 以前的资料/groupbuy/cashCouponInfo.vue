<template>
    <div class="myCoupons" :style="totalH">
        <div class="swipe">
            <van-swipe :autoplay="3000" class="swipelist">
            <van-swipe-item v-for="(item,index) in couponInfo.commodityImgList" :key="index">
                <img v-lazy="item.ciImagerUrl" />{{index}}
            </van-swipe-item>
            </van-swipe>
        </div>
        <div class="top">
            <div class="up">
            <div class="left">
                <p class="title">{{couponInfo.commodityName}}</p>
                <p class="subtitle"><img src="../../assets/img/personal/stores_icon.png" alt=""><span>{{couponInfo.commoditySubtitile}}</span></p>
                <p class="intro">{{couponInfo.commodityOriginalPrice}}元代金券</p>
                <p class="time" v-if="couponInfo.commodityValidity==1">有限期:领取{{couponInfo.commodityDay}}天内有效</p>
                <p class="time" v-if="couponInfo.commodityValidity==2">有限期:{{couponInfo.commodityPeriodStartTime}}至{{couponInfo.commodityPeriodEndTime}}</p>
            </div>
            <div class="right" @click="share">
                <img class="icon" src="../../assets/img/personal/share_icon.png" alt="">
                <!-- <div class="remainnum">剩余<span>12</span>件</div> -->
            </div>
            </div>
        </div>
        <div class="list" v-if="usersCommodityInfoVo.sellerName!=undefined">
            <div class="left">
            <div class="leftimg">
                <img :src="usersCommodityInfoVo.logo" alt="">
            </div>
            <div class="middle">
                    <p class="name">{{usersCommodityInfoVo.sellerName}}</p>
                    <p class="info"><span>{{usersCommodityInfoVo.sellerAddress}}</span></p>
                    <p class="upNumber">
                        <span @click="telmerchantPhone()"><img src="../../assets/img/phone.png" alt="">联系门店</span>
                        <span @click="goindoorLocation"><img src="../../assets/img/direction_iocn.png" alt="">到这去</span>
                    </p>
            </div>
            </div>
        </div>
        <div class="footer" v-if="couponInfo.commodityCommodityDetails">
            <div v-html="couponInfo.commodityCommodityDetails">
            </div>
        </div>
        <div class="getbtn" @click="goconfirmOrder">立即购买</div>
       <tabtel :telInfo="telInfo"></tabtel>
       <wxshare :sureState="sureState"></wxshare>
    </div>
</template>
<script>
import { Dialog,Toast } from 'vant';
import tabtel from '../../common/tabtel.vue'
import wxshare from './../../common/wxshare.vue';

export default {
    components:{
        tabtel,
        wxshare
    },
    data(){
        return{
            totalH:{
                "height":document.documentElement.clientHeight  +'px'
            },
            images: [
                'https://img.yzcdn.cn/2.jpg',
                'https://img.yzcdn.cn/2.jpg',
            ],
            couponInfo:{
                title:'麦当劳10元3翅',
                subtitle:'麦当劳10元3翅',
                intro:'麦当劳10元3翅',
                time:'2018-5-9 12:2:12',
                total:99,
                code:12132565644,
                state:'未使用',
                list:[
                    {img:require('../../assets/img/personal/couponImg.png'),
                    name:'pandora国庆会员专属礼包',
                    condition:'购指定套装可享8折优惠及精美礼品1份',
                    time:'10-01至10-07',
                    },
                ],
            },
            commodityId:1,
            usersCommodityInfoVo:{},
            telInfo:{},
            sureState:{
                checked:false
            },//分享功能的引导
        }
    },
    created(){
        this.commodityId=this.$route.query.commodityId
        this.$wxShare(this.$mallId,'金铂天地', '欢迎欢迎，热烈欢迎', window.location.href, require('./../../assets/img/home/LOGO.png'))
    },
    mounted(){
        this.getCommodityInfo()
    },
    methods:{
        share(){//调用微信分享
            let weiUa = window.navigator.userAgent.toLowerCase()
            if(weiUa.match(/MicroMessenger/i) == 'micromessenger') {
					// 跳转到微信授权页面
					 this.sureState.checked=true
				}else{
                    Toast('请在微信中打开')
                }
        },
         telmerchantPhone(){//拨打电话
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
       goconfirmOrder(){//跳转提交订单页面
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
       
        //获取团购代金券详情
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
                }
            }
        }
        .top{
            width: 100%;
          
            background: #fff;
            padding: .5rem 0 0 0;
            border-bottom: 0.34rem solid #f2f2f2;
            .up{
                display: flex;
                // border-bottom: 1px solid #ddd;
                padding-bottom: .4rem;
            .left{
                flex: 4;
                margin-left: .2rem;
                
                .title{
                    font-size:0.44rem;
                    font-weight:bold;
                    margin-top: .1rem;
                }
                .subtitle{
                    font-size:0.28rem;
                    font-weight:400;
                    color:rgba(153,153,153,1);
                    margin-top: 8px;
                    img{
                        width: .4rem;
                        margin-right: .1rem;
                        vertical-align: text-top;
                    }
                }
                .intro{
                    font-size:0.28rem;
                    font-weight:400;
                    color:rgba(153,153,153,1);
                    margin-top: 8px;
                }
                .time{
                    font-size:0.28rem;
                    font-weight:400;
                    color:rgba(51,51,51,1);
                    margin-top: 8px;
                }
            }
            
            .right{
                flex: 1;
                text-align: right;
                margin-right: .2rem;
                .state{
                   width: 2rem;
                    margin-bottom: -.8rem;
                }
                .icon{
                   width: 24px;
                }
                .remainnum{
                    font-size: .28rem;
                    color: #999;
                    margin-top: .45rem;
                    span{
                        color: orange;
                    }
                }
            }
            }
        }
        .list{
            width: 100%;
            height: 2.2rem;
            background: #fff;
            display: flex;
            border-bottom: .34rem solid #f2f2f2;
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
                    margin-top: .2rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    width: 5rem;
                    padding: .1rem 0;
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
                        padding: .1rem 0;
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
        .footer{
                width: 100%;
                background: #fff;
                padding-bottom: .4rem;
                //  border-top: 0.2rem solid #f2f2f2;
            div{
                padding: 0.4rem 0.2rem 0 .2rem;
                font-size:0.4rem;
                color:rgba(153,153,153,1);
            }
           
        }
       .getbtn{
               width: 9.44rem;
                height: 1.4rem;
                line-height: 1.4rem;
                text-align: center;
                color: #fff;
                background: #ddc993;
                border-radius: 5px;
                margin: 1.8rem auto 0;
                font-size: .45rem;
       }
       
    }
</style>

