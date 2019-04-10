<template>
   <div class="FinancialIndex">
       <h3>财务概况</h3>
       <div class="top">
          <div>
               <p style="color:#000;font-size:16px;margin-top:20px">{{FinancialList.day}}</p>
           </div>
           <div>
               <p>{{FinancialList.orderPrices}}元</p>
               <p>订单金额</p>
           </div>
            <div>
               <p>{{FinancialList.factGathering}}元</p>
               <p>实收金额</p>
           </div>
           <div>
               <p>{{FinancialList.refunded}}元</p>
               <p>优惠金额</p>
           </div>
           <div>
               <p>{{FinancialList.discountAmount}}元</p>
               <p>退款金额</p>
           </div>
       </div>
       <div class="showtabber">
           <el-table :data="tableData" border style="width: 100%" :header-cell-style="tableStyle" :cell-style="cellStyle">
            <el-table-column prop="orderNumber" label="订单编号" width="180"></el-table-column>
            <el-table-column prop="usersNickName" label="买家昵称"></el-table-column>
            <el-table-column prop="orderPrices" label="订单金额"></el-table-column>
            <el-table-column prop="factGathering" label="实收金额"></el-table-column>
            <el-table-column prop="refunded" label="退款金额"></el-table-column>
            <el-table-column prop="discountAmount" label="优惠金额"></el-table-column>
            <el-table-column prop="orderCreateTime" label="下单时间"></el-table-column>
            <el-table-column prop="orderStatusShow" label="订单状态">
            </el-table-column>
        </el-table>
       </div>
    </div> 
</template>
<script>
export default {
    data(){
        return{
            tableStyle:{
                "text-align": "center",
                'height':'40px',
                'color':'#999999',
                'background':'#f3f3f3',
            },
            FinancialList:{
                money:9898.0,
                text:'待收款'
            },
            searchTime: '',//搜索日期
            storeinput:"",//门店名称
            tableData:[
                {comercialName:'商场',tel:'12334354556',totalReturns:232434,haveTotal:32134,waitTotal:3254,state:'待支付'}
            ],
            someDay:"",
            sellerType:"",                //售卖方类型 1=商城 / 2=商户 (商户登录不用传)
            sellerId:"" ,                //售卖方id (商户登录不用传)
            orderType:"", 
        }
    },
    created(){
        this.someDay=this.$route.query.someDay
        this.sellerType=this.$route.query.sellerType
        this.sellerId=this.$route.query.sellerId
        this.orderType=this.$route.query.orderType
    },
    mounted(){
        this.selletSomeDayStatement()
    },
    methods:{
        cellStyle(){//表格居中样式
            return "text-align: center;height:50px;";
        },
         selletSomeDayStatement() {
            this.$httpAuth({
                url:'/gm/selletSomeDayStatement',
                method:'post',
                data:{
                    "orderType":this.orderType,                
                    "sellerType":this.sellerType,                
                    "sellerId":this.sellerId ,
                    "someDay":this.someDay+" 00:00:00",                  
                }
                }).then(result => {
                    if (result.data.code === 10000) {
                       
                        this.FinancialList={
                            "day":result.data.resp.day,                      
                            "orderPrices":result.data.resp.orderPrices,                 //订单金额
                            "factGathering":result.data.resp.factGathering,             //已收款
                            "refunded":result.data.resp.refunded,                      //已退款
                            "discountAmount":result.data.resp.discountAmount,          //优惠金额
                        }
                       
                       let orderType=result.data.resp.orderType
                       let data=result.data.resp.selletSomeDayStatementListVoList
                        console.log(data)
                       //交易方式：1=买单 / 2=团购 / 3=商城 / 4=停车订单
                        //买单订单状态：1:待支付、2:支付成功、3:已退款、4:交易关闭
                        data.forEach((item,index) => {
                                    if(item.orderStatus==1){
                                        item.orderStatusShow="待支付"
                                    }else if(item.orderStatus==2){
                                        item.orderStatusShow="支付成功"
                                    }else if(item.orderType==3){
                                        item.orderStatusShow="已退款"
                                    }else if(item.orderType==4){
                                        item.orderStatusShow="交易关闭"
                                    }
                                if(orderType==2){//团购券、兑换券订单状态：1:待支付、2:支付成功/可使用、3:已退款、4:交易关闭、5:已使用、6:已过期
                                    if(item.orderStatus==5){
                                        item.orderStatusShow="已使用"
                                    }else if(item.orderStatus==6){
                                        item.orderStatusShow="已过期"
                                    }
                                }
                        });
                           
                        this.tableData=data
                        console.log(this.tableData)
                    }
                })
                .catch(err => {});
            }
       
    }
}
</script>
<style lang="less" scoped>
.FinancialIndex{
    width: 100%;
     h3{
		height: 35px;
		line-height: 35px;
		border-bottom: 1px solid #f3f3f3;
		text-indent: 15px;
        font-size: 14px;
        color: #333;
        font-weight: normal;
    }
    .top{
        display: flex;
        width: 100%;
        height: 100px;
        margin: 20px 0;
        div{
            flex: 1;
            text-align: center;
            p{
                height: 50px;
                line-height: 50px;
                text-align: center;
            }
            p:nth-child(1){
                color: red;
                font-size: 24px;
            }
            p:nth-child(2){
                font-size: 16px;
            }
        }
        div:nth-child(n+1):nth-child(-n+3){
            border-right: 1px solid #ddd;
        }
    }
    .showtabber{
        margin-top:40px;
    }
}
</style>
