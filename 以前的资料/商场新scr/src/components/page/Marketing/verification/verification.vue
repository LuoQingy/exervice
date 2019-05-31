<template>
    <div id="verification">
        <div class="top">
            <span style="font-size:14px">核销券码:</span>
            <el-input v-model="input" placeholder="请输入内容" style="max-width:300px"></el-input>
            <div style="margin-left:65px;margin-top:20px">
                <el-button
                type="primary"
                style="width:150px"
                @click="verificationQuery"
                >核销</el-button>
            </div>
        </div>

        <div class="content-table" v-show="isCheck">
            <div class="toptitle">
                <span>核销详情</span>
                <i class="closetag"  @click="showdown"></i>
            </div>
            <div class="content">
                <el-table  :data="tableData" border :cell-style="center" :header-cell-style="tableStyle">
                    <el-table-column prop="couponName"  label="商品名称/券名称" align="center">
                    </el-table-column>
                    <el-table-column prop="name" label="商品图片">
                        <template slot-scope="scope">
                            <img :src="scope.row.couponImageUrl" alt="加载失败" style="width:72px;height:68px" />
                        </template>
                    </el-table-column>
                    <el-table-column label="购买价格/积分">
                        <template slot-scope="scope">
                            <!-- "goodsType":"mock", 备注：商品类型：1=现金 2=积分 3=现金+积分 -->
                            <span v-if="scope.row.goodsType==1">{{scope.row.couponValue}}元</span>
                            <span v-else-if="scope.row.goodsType==2">{{scope.row.goodsCoin}}积分</span>  
                            <span v-else-if="scope.row.goodsType==3">{{scope.row.couponValue}}元+{{scope.row.goodsCoin}}积分</span>
                            <span v-else>{{scope.row.couponValue}}元</span>           
                        </template>
                    </el-table-column>
                    <el-table-column  label="劵状态">
                        <template slot-scope="scope">
                            <!-- "couponStatus":2, 备注：状态(1:未使用 2:已使用 3:已退款) -->
                            <span v-if="scope.row.couponStatus==1">未使用</span>
                            <span v-if="scope.row.couponStatus==2">已使用</span>  
                            <span v-if="scope.row.couponStatus==3">已退款</span>        
                        </template>
                    </el-table-column>
                    <el-table-column  prop="code" label="核销码">
                    </el-table-column>
                    <el-table-column label="所属用户">
                        <template slot-scope="scope">
                            <span v-if="scope.row.volumeAttribution==1">商场</span>
                            <span v-if="scope.row.volumeAttribution==2">商户</span>       
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="footers">
                <el-button type="info" style="width:135px" @click="showdown">
                    取消
                </el-button>
                <el-button type="primary" v-if="tableData.length>0&&tableData[0].couponStatus==1" style="width:135px" @click="volumeWriteOff">
                    确认核销
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            input:'',
            tableData:[],
            isCheck:false,
            tableStyle: {
                "text-align": "center",
                height: "40px",
                color: "#666",
                background: "#f3f3f3",
                'font-weight':'100'
            },
        }
    },
    mounted(){

    },
    methods:{
        center(){
            return "text-align: center;";
        },

        showdown(){
            this.isCheck = false;
            if(this.tableData[0].couponStatus!=1){
                this.tableData=[];
                //this.input='';
            }else{
                this.tableData=[];
            }
           
        },

        verificationQuery(){//获取核销劵详情
            let numCheck =/^[0-9]*$/;
            if(!this.input){
                this.$message.error('请输入核销券码')
                return false;
            }else if(!numCheck.test(this.input)){
                this.$message.error('请输入正确的核销券码')
                return;
            }
            
            this.$httpAuth({
                url:'/gm/writeOffVoCoupon',
                method:'post',
                data:{
                  couponCode:this.input
                }
            }).then((res) =>{
                if(res.data.code == 10000){
                    this.isCheck = true;
                    this.tableData=[Object.assign(res.data.resp,{code:this.input})]
                    console.log(this.tableData)
                }else{
                    this.$message.error(res.data.msg);
                    this.isCheck = false;
                    this.tableData=[];
                }
            }).catch((err) =>{
                this.isCheck = false;
                this.tableData=[];
                console.log(err);
            });
        },
        volumeWriteOff(){//核销劵
            if(this.tableData.length==0){
                this.$message.error('核销列表为空')
            }else{
                this.$httpAuth({
                    url:'/gm/volumeWriteOff',
                    method:'post',
                    data:{
                        couponCode:this.tableData[0].code
                    }
                }).then((res)=>{
                    if(res.data.code==10000){
                        this.$message({
                            type:'success',
                            message:'核销成功'
                        })
                        this.verificationQuery()
                    }else{
                        this.$message.error(res.data.msg)
                    }
                }).catch((err) =>{
                    this.$message.error('网络异常')
                    console.log(err);
                });
            }
        },
    },
}
</script>

<style lang="less" scoped>
#verification {
  margin-left: 20%;
  .content-table {
    min-width: 510px;
    margin-bottom: 30px;
    .toptitle {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        align-items: center;
        border: 1px solid rgb(242, 242, 242);
        span {
            font-size: 14px;
        }
        .closetag {
            position: relative;
            display: block;
            width: 26px;
            height: 30px;
            cursor: pointer;
            -webkit-transition: -webkit-transform 0.5s;
            transition: -webkit-transform 0.5s;
            transition: transform 0.5s;
            transform: rotate(0);
        }
        .closetag::after,
        .closetag::before {
        // box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.23);
        content: '';
            position: absolute;
            top: 12px;
            left: 4px;
            width: 16px;
            height: 5px;
            transform: rotate(45deg);
            background-color: rgb(174, 174, 174);
        }
        .closetag::after {
            transform: rotate(-45deg);
        }
    }
    .content {
        border: 1px solid rgb(242, 242, 242);
        padding:10px 10px 30px 10px;
        border-top: none;
    }
    .footers {
        
        border: 1px solid rgb(242, 242, 242);
        display: flex;
        justify-content: flex-end;
        padding: 10px;
        border-top: none;
    }
  }
  .top {
    min-width: 450px;
    margin-top:50px;
    margin-bottom: 100px;
  }
}
</style>
