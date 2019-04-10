<template>
    <div id="addActivity" >
        <h3>{{activityOperation}}</h3>
        <div style="margin-top:10px;">
            <div v-if="radio2==1">
                <group-buying-goods></group-buying-goods>
            </div>
            <div v-if="radio2==2">
                <create-goods-vouchers></create-goods-vouchers>
            </div>
        </div>
        
    </div>
</template>

<script>
import groupBuyingGoods from './groupBuyingGoods'
import createGoodsVouchers from './createGoodsVouchers'
export default {
    components:{createGoodsVouchers,groupBuyingGoods},
    data(){
        return{
            radio2:3,
            activityOperation:'修改商品套餐',
            loading:true,
        }
    },
    created(){
        let commodityId = this.$route.query.commodityId;
        let commodityType = this.$route.query.type;
        if(commodityId&&commodityType){
            this.radio2=commodityType;
            if(commodityType==2){
                this.activityOperation ='修改售卖代金劵'
            }
        }else{
            this.$router.push('/marketing/groupPurchaseManagement');

        }
        
    },
    mounted(){
       
    },
    methods:{
        changeType(){//选择劵类型
            console.log(this.radio2)
        },
        getCommodityDetails(ev){//团购详情
            let data = {
                commodityId:ev
            }
            this.$httpAuth({
                url:'/gm/getCommodityInfo',
                method:'post',
                data:data
            }).then((res) =>{
                 if(res.data.code == 10000){
                    let resp = res.data.resp;
                    if(resp.commodityType==2){
                        this.radio2=resp.commodityType;
                        this.activityOperation ='修改售卖代金劵'
                    }
                   
                }
            }).catch((err) =>{
                console.log(err);
            });
        },
    },
}
</script>

<style lang="less" scoped>
.fl{
    float: left;
}
.fr{
    float: right;
}
input,button{
    outline: none;
    border: none;
    
}
#addActivity{
    width: auto;
    min-width: 1000px;
    h3{
		height: 35px;
		line-height: 35px;
		border-bottom: 1px solid #f3f3f3;
		text-indent: 15px;
        font-size: 14px;
        color: #333;
        font-weight: normal;
    }
    .addActivity-content{
        width: 100%;
        margin-left: 70px;
        margin-top: 10px;
        .el-form{
            .el-form-item{
                .rules {
                    display: flex;
                    .rules_label {
                        margin-right: 10px;
                    }
                    .rules_right{
                        margin-left: 26px;
                    }
                }
                .el-button{
                    width: 140px;
                    height: 38px;
                }
                .activity-url{
                    width: 75px;
                    height: 75px;
                    border: 1px solid #d9d9d9;
                    border-radius: 2px;
                    cursor: pointer;
                    overflow: hidden;
                    img{
                        width: 75px;
                        height: 75px;
                    }
                }
                .activity-name{
                    input{
                        width: 300px;
                        height: 30px;
                        border: 1px solid #f3f3f3;
                        text-indent: 5px;
                        margin-right: 5px;
                        border-radius: 5px;
                        -webkit-border-radius: 5px;
                    }
                }
            }  
        }
        
    }
}
</style>
