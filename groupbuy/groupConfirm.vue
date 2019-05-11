<template>
    <div class="confirmOrder" :style="totalH">
        <div class="one">
        <div class="qrcode">
                <span class="left">{{couponInfo.commodityName}}</span>
                <span class="right unitprice" >&yen;{{couponInfo.commodityPreferentialPrice | fixMoney}}</span>
        </div>
        <div class="top" >
            <div class="left">
                <p class="title" v-if="couponInfo.commodityRestrict">数量限购{{couponInfo.commodityRestrict}}件</p>
                <p class="title" v-else>数量</p>
            </div>
            <div class="right">
                <van-stepper
                v-model="goodnum"
                integer
                :min="1"
                :max="limitNum"
                :step="1"
                @change="changeNum"
                />
            </div>
        </div>
        <div class="qrcode">
                <span class="left">小计</span>
                <span class="right" >&yen;{{sumPrice | fixMoney}}</span>
        </div>
        </div>
        <div class="two">
        <div class="qrcode" v-if="userInfor.umgIsDiscount">
                <span class="left">会员权益</span>
                <span class="right" >{{userInfor.umgDiscount}}折<van-checkbox v-model="memberright"></van-checkbox></span>
                
        </div>
        <!-- <div class="qrcode">
                <span class="left">使用积分<img src="../../assets/img/groupbuy/integral_icon.png" alt=""></span>
                <span class="accuright" >
                    <p>本单不可用积分抵扣</p>
                    <p>现有积分{{userInfor.ubrAvailableCoin}}</p>
                </span>
        </div> -->
        <div class="qrcode">
                <span class="left">总价</span>
                <span class="right" >&yen;{{commodityTotalPrice | fixMoney}}</span>
        </div>
        </div>
         <div class="two">
        <div class="qrcode">
                <span class="left">{{usersPhoneNumber}}</span>
                <span class="right" ></span>
                
        </div>
        </div>
        <div @click="addOrder()" :class="limitBuyAmount?'account':'account accountlimit'">
               确认买单
        </div>
        <div class="acumulate" v-if="sureState">
            <div class="blackbg"></div>
            <div class="tip">
                <p class="title">提示</p>
                <p class="resptip">购买成功</p>
                <p class="content">
                    <span @click="goOrderInfo">查看详情</span><span @click="hidesureState">确定</span>
                </p>
            </div>
            
        </div>
    </div>
</template>
<script>
import { Dialog,Toast } from 'vant';
import { mapState} from 'vuex'
import store from '@/vuex/demo'//vuex
export default {
    store,
    data(){
        return{
            totalH:{
                "height":document.documentElement.clientHeight  +'px'
            },
            commodityId:0,
            goodnum:1,
            couponInfo:{
                commodityName:'',
                commodityPreferentialPrice:0,
                commodityProvideGross:0,
                mgStatus:3
            },
            memberright:true,//是否使用权益
            commodityTotalPrice:0,//总价
            orderId:0,//订单id
            toast1:'',
            toast2:'',
            sureState:false,//购买成功、兑换成功状态
            limitNum:1,
            limitBuyAmount:true,
        }
    },
    filters:{
        fixMoney(value){//数值两位小数
            let num=(value*1).toFixed(2)
            return num
        }
    },
    watch:{
        memberright(){
            this.computing()
        }
    },
    created(){
         this.commodityId=this.$route.query.commodityId
         this.$demostore.state.userInfor.getUserData();
    },
    mounted(){
        this.getUsersInfo()
        this.getCommodityInfo()
        
    },
    computed:{
        ...mapState(['userInfor']),
        sumPrice(){
            let result=this.goodnum*this.couponInfo.commodityPreferentialPrice
            let final=result.toFixed(2)
            return final
        },
        usersPhoneNumber(){
                var phone = this.userInfor.usersPhoneNumber;
                var arr = phone.split('');
                arr.splice(3, 4, '****');
                phone = arr.join('');
                return phone
        }
        
        },
    methods:{
       hidesureState(){
            this.sureState=false
            this.$router.back()
       },
       changeNum(){
           
           if(this.goodnum>this.limitNum){
                this.goodnum=this.limitNum
                Toast(`限购${this.limitNum}件`)
            }
           this.computing()
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
                    
                    if(resp.commodityRestrict){//是否限购
                        this.limitNum=resp.commodityRestrict
                    }else{
                        this.limitNum=resp.commodityInventory
                    }
                    _this.couponInfo=resp
                    
                }else{
                     this.$Toast(data.data.msg)
                }
                
            }).catch((err)=>{
                console.log(err)
            });
        },
        getUsersInfo(){
            let _this=this
            this.$formAuthAxios({
                url:'/users/getUsersInfo',
                method:'post',
                data:{
                }
            }).then((data)=>{
                if(data.data.code==10000){
                    this.computing()
                }
                
            }).catch((err)=>{
                console.log(err)
            });
        },
        //计算团购价格
        computing(){
            let _this=this
            this.$jsonAuthAxios({
                url:'/users/computing',
                method:'post',
                data:{
                    "orderType":2,                //类型：Number  必有字段  备注：订单类型 1=买单 2=团购 3=商城
                    "productId":this.commodityId,                //类型：Number  必有字段  备注：所有产品id
                    "productNum":this.goodnum,                //类型：Number  必有字段  备注：产品数量
                    "useMemberRightsInterests":this.memberright,                //类型：Boolean  必有字段  备注：是否使用会员权益
                    "useCoin":false,                //类型：Boolean  必有字段  备注：是否使用积分抵扣
                    "coin":0                //类型：Number  可有字段  备注：使用多少积分抵扣
                }
            }).then((data)=>{
                if(data.data.code==10000){
                    let resp=data.data.resp
                    _this.commodityTotalPrice=resp.result.toFixed(2)
                     this.limitBuyAmount=true
                }else{
                     this.$Toast(data.data.msg)
                     if(data.data.msg=='您购买数量超出限购数量!'){
                          this.limitBuyAmount=false
                     }else{
                         this.limitBuyAmount=true
                     }
                }
                
            }).catch((err)=>{
                console.log(err)
            });
        },

        // 微信支付部分
        // 下单
         addOrder(){
            let _this=this
             if(!this.limitBuyAmount){
                 this.$Toast(`您购买的数量已到达限购数量，不能再购买了哟`)
                 return
             }
            let  data={
                "orderType":2,                                      //订单类型 1=买单 2=团购 3=商城
                "productId":this.commodityId,                       //所有产品id 买单不传
                "productNum":this.goodnum,                          //产品数量 买单不传
                "useMemberRightsInterests":this.memberright,         //是否使用会员权益
                "useCoin":false,                          //是否使用积分抵扣
                "coin":0,              //使用多少积分抵扣
                "price":this.commodityTotalPrice                      //前端计算完后价格 可积分,可金额  
            }
             this.$jsonAuthAxios({
                url: '/users/addOrder',
                method: 'post',
                data:data
            }).then((res) =>{
                //console.log(res.data)
               if(res.data.code == 10000){
                   this.orderId=res.data.resp.orderId
                   let weiUa = navigator.userAgent.toLowerCase();
					if(weiUa.match(/MicroMessenger/i) == "micromessenger"){//是否处于微信
                         this.gocartpayok()
                    }else{
                        this.$Toast('请在微信中打开')
                    }
                   
                }else{
                    this.$Toast(res.data.msg)
                }
            }).catch((err) =>{  
                console.log(err)
            }) 
           
         },
        //			确认支付
			gocartpayok() {
                let _this = this
                this.toast1=this.$Toast.loading({
                mask: true,
                message: '正在支付...',
                duration:0
                });
                console.log("获取openId")
                console.log(this.$cookies.get('openId'))
                let data={
                        "orderId":this.orderId,                          //订单Id
                        "status":2,      
                        "openId":this.$cookies.get('openId'),                                
                        "payChannel":1,        //支付渠道(1:微信 2:支付宝(口碑) 3:其他) 订单金额支付一定要填写
                        // "openId":"oKYtXs_sIZ7wdFZY1FgnGIpFH-fU",    //苏
                        // "openId":"oKYtXs7lpAXWLEfii2d9wjeSghnY",     //李             
                        // "openId":"oKYtXs7QS62Z3JUYEv0GMGSm1nbU"      //骆             
                    }
                
                
                    // 用于测试演示环境的签名信息是否可以用于开发环境
                // this.$axios({
                //     baseURL: 'http://twx3.paycore.cc',
                //     headers: {
                //         'Content-Type': 'application/json;charset=UTF-8',
                //         'AuthToken':this.$cookies.get("AuthToken")
                //     },
                //     url: '/users/updateOrderStatus',
                //     method: 'post',
                //     data:data

                 this.$jsonAuthAxios({
                    url: '/users/updateOrderStatus',
                    method: 'post',
                    data:data
                }).then((res) =>{
                    //console.log(res.data)
                     this.toast1.clear();
                   if(res.data.code == 10000){
                      
                        if(res.data.msg=="H5_PAY"){//微信支付
						var result = res.data.resp
						function onBridgeReady() {
							WeixinJSBridge.invoke(
								'getBrandWCPayRequest', {
									"appId": result.appId, //公众号名称，由商户传入     
									"timeStamp": result.timeStamp, //时间戳，自1970年以来的秒数     
									"nonceStr": result.nonceStr, //随机串     
									"package": result.package,
									"signType": result.signType, //微信签名方式：     
									"paySign": result.paySign //微信签名 
								},
								(res) =>{

									if(res.err_msg == "get_brand_wcpay_request:ok") {

										console.log('支付返回')
                                        console.log(res)

                                        _this.checkOrderPayStatus()
                                        

									} else {
										
									}
								}
							);
						}
						if(typeof WeixinJSBridge == "undefined") {
							if(document.addEventListener) {
								document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
							} else if(document.attachEvent) {
								document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
								document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
							}
						} else {
							onBridgeReady();
                        }
                    }else{
                        this.sureState=true
                        // _this.checkOrderPayStatus()
                    }
                    }else{

                    }
                }).catch((err) =>{  
                    console.log(err)
                }) 

            },
            //查询订单状态
        checkOrderPayStatus(){
            let _this=this
            this.toast2=this.$Toast.loading({
                mask: true,
                message: '支付确认中...',
                duration:0
                });
            let data="orderId="+this.orderId
            this.$formAuthAxios({
                url:'/users/checkOrderPayStatus',
                method:'post',
                data:data
            }).then((data)=>{
                this.toast2.clear();
                if(data.data.code==10000){
                    this.sureState=true
                }else{
                    this.$Toast(data.data.msg)
                }
                
            }).catch((err)=>{
                console.log(err)
            });
        },
            goOrderInfo(){
                this.$router.push({
                    path: '/project/orderDetails',
                    name: 'orderDetails', //'要跳转的路径的 name,
                    query: {
                        orderId: this.orderId,
                        mallId: this.$mallId
                    }
                })
            }
    }
}
</script>
<style lang="less" scoped>
@import url('../../common/comfireresp.css');
    .confirmOrder{
        width: 100%;
        background: #f2f2f2;
        position: relative;
        
        .top{
            width: 100%;
            display: flex;
            background: #fff;
             
             border-bottom: 1px solid #f2f2f2;
            .left{
                flex: 1;
                margin-left: .2rem;
                .title{
                    font-size:0.4rem;
                    margin-top: .1rem;
                    color: #333;
                    height: 1.2rem;
                    line-height: 1.2rem;
                }
            }
            
            .right{
                flex: 1;
                text-align: right;
                margin-top: .3rem;
                margin-right: .2rem;
                 
            }
            
        }
        .two{
            border-top: .34rem solid #f2f2f2;
        }
        .qrcode{
            display: flex;
            height: 1.4rem;
            line-height: 1.4rem;
            background: #fff;
            border-bottom: 1px solid #f2f2f2;
                .left{
                    flex: 1;
                    font-size: .4rem;
                    margin-left: .2rem;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    img{
                        width: .4rem;
                        margin-left: .1rem;
                        margin-top: .04rem;
                        vertical-align: text-top; 
                    }
                }
                .right{
                    flex: 1;
                    margin-right: .2rem;
                    text-align: right;
                    height: 1.4rem;
                    line-height: 1.4rem;
                    font-size: 0.5rem;
                    color: #FF9600;
                    .van-checkbox{
                        display: inline-block;
                        margin-left: .1rem;
                        vertical-align: middle;
                        margin-top: -.1rem;
                    }
                    
                }
                .accuright{
                    flex: 1;
                    margin-right: .2rem;
                    text-align: right;
                    color: #FF9600;
                        p:nth-child(1){
                            font-size: .4rem;
                            height: .6rem;
                            line-height: .8rem;
                        }
                        p:nth-child(2){
                            font-size: .3rem;
                            height: .6rem;
                            line-height: .7rem;
                        }
                    }
                .unitprice{
                     color:#333;
                }
        }
       
        // 立即抢购/积分兑换按钮
        .account{
            height: 1.4rem;
            line-height: 1.4rem;
            background: #DDC993;
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            color: #fff;   
            font-size: .44rem;
            text-align: center;
        }
        .accountlimit{
            background: #ccc;
        }
      
    }
</style>

