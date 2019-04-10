<template>
    <div id="addActivity">
        <h3>{{activityOperation}}</h3>
        <div class="addActivity-content">
             <el-form   ref="ruleForm" label-width="120px" class="demo-ruleForm">              
                <el-form-item label="选择券类型："  required>
                   <div class="activity-name">
                       <el-radio-group v-model="radio2" @change="changeType">
                            <el-radio :label="1">套餐</el-radio>
                            <el-radio :label="2">代金券</el-radio>
                        </el-radio-group>
                   </div>
                </el-form-item>
            </el-form>     
        </div>
        <div v-show="radio2==1">
            <group-buying-goods></group-buying-goods>
        </div>
        <div v-show="radio2==2">
            <create-goods-vouchers></create-goods-vouchers>
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
            radio2:1,
            activityOperation:'创建商品',
        }
    },
    created(){
       
    },
    methods:{
        changeType(){//选择劵类型
            console.log(this.radio2)
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
