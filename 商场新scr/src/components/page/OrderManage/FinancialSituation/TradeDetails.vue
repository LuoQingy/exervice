<template>
   <div class="FinancialIndex">
       <h3>财务概况</h3>
       <div class="top">
           <div>
               <p style="color:#000;font-size:16px;margin-top:20px">{{FinancialList.orderType}}</p>
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
            <el-table-column prop="comercialName" label="日期" width="180">
                 <template slot-scope="scope">
                    <div>{{scope.row.day}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="orderPrices" label="订单金额"></el-table-column>
            <el-table-column prop="factGathering" label="实收金额"></el-table-column>
            <el-table-column prop="discountAmount" label="优惠金额"></el-table-column>
            <el-table-column prop="refunded" label="退款金额"></el-table-column>
            <el-table-column label="操作">
                 <template slot-scope="scope">
                    <div style="color:#409EFF;cursor:pointer" @click="goDayDetails(scope.row.day)">查看明细</div>
                </template>
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
                {comercialName:'商场',tel:'12334354556',totalReturns:232434,haveTotal:32134,waitTotal:3254}
            ],
            sellerType:"",              
            sellerId:"",              
            orderType:""
        }
    },
    created(){ 
        this.sellerType=this.$route.query.sellerType
        this.sellerId=this.$route.query.sellerId
        this.orderType=this.$route.query.orderType
    },
    mounted(){
        this.selletOrderTypeStatement()
    },
    methods:{
        cellStyle(){//表格居中样式
            return "text-align: center;height:50px;";
        },
        goDayDetails(day){
            this.$router.push({
                path:'/OrderManage/DayDetails',
                query:{
                    "someDay":day,
                   "sellerType":this.sellerType,                //售卖方类型 1=商城 / 2=商户 (商户登录不用传)
                    "sellerId":this.sellerId ,                //售卖方id (商户登录不用传)
                    "orderType":this.orderType,               //交易方式 1=买单 / 2=团购 / 3=商城 / 4=停车 (商户没有停车订单)
                }
            })
        },
        selletOrderTypeStatement() {
            this.tableData=[]
            this.$httpAuth({
                url:'/gm/selletOrderTypeStatement',
                method:'post',
                data:{
                    "orderType":this.orderType,                
                    "sellerType":this.sellerType,                
                    "sellerId":this.sellerId                   
                }
                }).then(result => {
                    if (result.data.code === 10000) {
                        let orderType=result.data.resp.orderType
                            if(orderType==1){
                                orderType="买单"
                            }else if(orderType==2){
                                 orderType="团购"
                            }else if(orderType==3){
                                 orderType="商场"
                            }else if(orderType==4){
                                orderType="停车订单"
                            }
                        this.FinancialList={
                            "orderType":orderType,                   //商户名称
                            "orderPrices":result.data.resp.orderPrices,                 //订单金额
                            "factGathering":result.data.resp.factGathering,             //已收款
                            "refunded":result.data.resp.refunded,                      //已退款
                            "discountAmount":result.data.resp.discountAmount,          //优惠金额
                        }
                       let data=result.data.resp.sellerStatementGroupByDayListVoList
                        this.tableData=data
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
