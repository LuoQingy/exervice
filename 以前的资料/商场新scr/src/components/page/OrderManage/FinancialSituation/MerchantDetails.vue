<template>
   <div class="FinancialIndex">
       <h3>财务概况</h3>
       <div class="top"> 
           <div>
               <p style="color:#000;font-size:16px;margin-top:20px">{{FinancialList.sellerName}}</p>
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
            <el-table-column prop="comercialName" label="交易方式" width="180">
                 <template slot-scope="scope">
                    <div>{{scope.row.orderTypeShow}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="orderPrices" label="订单金额"></el-table-column>
            <el-table-column prop="factGathering" label="实收金额"></el-table-column>
            <el-table-column prop="discountAmount" label="优惠金额"></el-table-column>
            <el-table-column prop="refunded" label="退款金额"></el-table-column>
            <el-table-column label="操作">
                 <template slot-scope="scope">
                    <div style="color:#409EFF;cursor:pointer" @click="goTradeDetails(scope.row.orderType)">查看明细</div>
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
            sellerId:'',//售卖方id
            sellerType:0,//售卖方类型
        }
    },
    created(){ 
        this.sellerType=this.$route.query.sellerType
        this.sellerId=this.$route.query.sellerId
    },
    mounted(){
        this.selletStatement()
    },
    methods:{
        cellStyle(){//表格居中样式
            return "text-align: center;height:50px;";
        },
        goTradeDetails(orderType){
            this.$router.push({
                path:'/OrderManage/TradeDetails',
                query:{
                    "sellerType":this.sellerType,              
                    "sellerId":this.sellerId,              
                    "orderType":orderType
                }
            })
        },
        selletStatement() {
            this.tableData=[]
            this.$httpAuth({
                url:'/gm/selletStatement',
                method:'post',
                data:{
                    "sellerType":this.sellerType,                
                    "sellerId":this.sellerId                   
                }
                }).then(result => {
                    if (result.data.code === 10000) {
                        this.FinancialList={
                            "sellerName":result.data.resp.sellerName,                   //商户名称
                            "orderPrices":result.data.resp.orderPrices,                 //订单金额
                            "factGathering":result.data.resp.factGathering,             //已收款
                            "refunded":result.data.resp.refunded,                      //已退款
                            "discountAmount":result.data.resp.discountAmount,          //优惠金额
                        }
                       let data=result.data.resp.sellerStatementOrderTypeListVoList
                        data.forEach((item,index) => { //交易方式 1=买单 / 2=团购 / 3=商城 / 4=停车订单
                            if(item.orderType==1){
                                item.orderTypeShow="买单"
                            }else if(item.orderType==2){
                                 item.orderTypeShow="团购"
                            }else if(item.orderType==3){
                                 item.orderTypeShow="商场"
                            }else if(item.orderType==4){
                                 item.orderTypeShow="停车订单"
                            }
                        });
                       
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
