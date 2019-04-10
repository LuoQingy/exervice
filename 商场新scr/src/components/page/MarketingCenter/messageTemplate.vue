<template>
        <div id="activity-management"> 
            <h3>短信模板</h3>
            <div class="screenOptions">
                <el-button type="primary" size="small" @click="allEvent" class="fl">全部</el-button>
                <el-button type="primary" @click="toMessage(1,1)" class="fr" >新建短信模板</el-button>
                <el-button type="primary"  class="fr" >短信使用统计</el-button>
            </div>
            <div class="activity-content main">
                <div style="width:100%" class="table">
                   <el-table :data="tableData" style="width: 100%" border @selection-change="handleSelectionChange" :cell-style="center" :header-cell-style="tableStyle">
                        <el-table-column label="序号" prop="stNum" width="70">
                        </el-table-column>
                        <el-table-column label="模板名称" prop="stName" width="140">
                        </el-table-column>
                        <el-table-column label="模板ID" prop="stId" width="140">
                        </el-table-column>
                          <el-table-column label="申请人" prop="stName" width="140">
                             <template slot-scope="scope">
                                <div>
                                    <span v-show="scope.row.stObjectType">商场</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="创建时间" prop="stCreateTime" >
                        </el-table-column>
                        <el-table-column prop="stContent"  label="短信内容">
                        </el-table-column>
                        <el-table-column  label="操作" width="170" >
                            <template slot-scope="scope">
                                <div class="operation">
                                    <span class="detele" v-if="scope.row.stStatus==1"  @click="handleClick(scope)">待审核</span>
                                    <span class="detele" v-else-if="scope.row.stStatus==2"  @click="handleClick(scope)">审核通过</span>
                                    <span class="detele" v-else-if="scope.row.stStatus==3"  @click="handleClick(scope)">审核未通过</span>
                                    <span class="edit" @click="deteleActivity(scope.row.stId)">删除</span>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="pagination" style="width:100%" v-show="total>0">
                    <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage4"
                        :page-sizes="[5,10,20,30,total]"
                        :page-size="pageSize"
                        layout="total,sizes, prev, pager, next, jumper"
                        :total="total">
                    </el-pagination>
                </div>
            </div>
        </div>
</template>
  
<script>
export default {
    data(){
        return{
            tableData: [],
            activityList:[],
            pageSize:5,
            currentPage4: 4,
            total:0,
            tableStyle:{
                "text-align": "center",
                'height':'40px',
                'color':'#999999',
                'background':'#f3f3f3',
            },
            user:{
                pageNum:1,//备注：页 默认1
                pageSize:5//备注：页数 默认5
            },
        }
    },
    created(){
        this.$nextTick( () =>{
            this.getMessageData();
        })
        
    },
    mounted(){

    },
    methods:{
        center(){
            return "text-align: center;height:80px;";
        },
        toMessage(ev,Id){//去添加活动 或修改活动
            //console.log(Id)
            if(ev==1){
                this.$router.push('/marketing/addMessage')   
            }else if(ev==2){
                this.$router.push('/marketing/addMessage?stId='+Id)   
            }
            //console.log(Id)
        },

        handleClick(tab, event) {
            
            console.log(tab.$index, event);
        },

        handleSelectionChange(val) {
            let arr = [];
            val.forEach(value => {
                arr.push(value.usersId);
            });
            this.selectlist = arr;
        },

        getMessageData(){//获取短信模板数据
           
            this.tableData = [ ]
            this.$httpAuth({
                url:'/mall/selectMallSmsTemplateAll',
                method:'post',
                data:this.user
            }).then((res) =>{
                if(res.data.code == 10000){
                    let resp = res.data.resp;
                    //console.log(resp)
                    if(resp.list==null||resp.list.length==0){

                    }else{
                        this.total = resp.total;
                        this.tableData = resp.list;
                        //console.log(this.tableData)
                        //this.activityList = resp.list; 
                    }
                    let obj = {
                        "stId":1,                //类型：Number  必有字段  备注：无
                        "stObjectType":1,                //类型：Number  必有字段  备注：1=商场 2=商户
                        "stObjectId":1,                //类型：Number  必有字段  备注：商场或商户的ID
                        "stNum":"T12345678",                //类型：String  必有字段  备注：模版序列号
                        "stName":"注册通知",                //类型：String  必有字段  备注：模板名称
                        "stType":1,                //类型：Number  必有字段  备注：模板类型：1=普通短信 2=营销短信 3=验证码短信
                        "stContent":"你好，你注册成功了。",                //类型：String  必有字段  备注：模板内容
                        "stDescription":"用户注册",                //类型：String  必有字段  备注：申请说明
                        "stStatus":1,                //类型：Number  必有字段  备注：状态：1=待审核 2=审核通过 3=审核未通过
                        "stCreateTime":"2018-11-07 10:05:33"                //类型：String  必有字段  备注：创建时间
                    }
                }
            }).catch((err) =>{
                console.log(err);
            });
        },

        forlataTime(time) {//解析时间的函数
            //参数time为从后台取到的毫秒数
            //console.log(time)
            var dataTime = new Date(time);
            var y = dataTime.getFullYear();    //显示年
            var m = dataTime.getMonth() + 1;    //显示月
            m = m < 10 ? ('0' + m) : m;
            var d = dataTime.getDate();     //显示日
            d = d < 10 ? ('0' + d) : d;
            var h = dataTime.getHours();    //显示小时
            h = h < 10 ? ('0' + h) : h;
            var minute = dataTime.getMinutes();     //显示分钟
            minute = minute < 10 ? ('0' + minute) : minute;
            var second = dataTime.getSeconds();//显示秒
            second = second < 10 ? ('0' + second) : second;
            return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
           // return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;     //返回最终时间y-m-d h-m
        },

        deteleActivity(ev){//删除短信模板
            console.log(ev)
            let data = {
                stId:ev
            }
            this.$httpAuth({
                url:'/mall/deleteTemplate',
                method:'post',
                data:data
            }).then((res) =>{
                 if(res.data.code == 10000){
                    let resp = res.data.resp;
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.getMessageData()
                }
            }).catch((err) =>{
                console.log(err);
            });
        },   
        
        allEvent(){//全部
            this.pageSize = this.total;
            this.user.pageSize = this.total;
            this.user.pageNum = 1;
            this.getMessageData()
        },

        handleSizeChange(val) {//每页多少条
            this.total  = 0;
            //console.log(this.pageSize);
            this.pageSize = val;
            this.user.pageSize = val;
            this.user.pageNum = 1;
            this.getMessageData()
            //console.log(`每页 ${val} 条`);
        },

        handleCurrentChange(val) {//页码
            //console.log(`当前页: ${val}`);
            //console.log(val)
            this.user.pageNum = val;
            this.getMessageData()
        }
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
#activity-management{
    width: auto;
    min-width: 1100px;
    h3{
		height: 40px;
		line-height: 40px;
		border-bottom: 1px solid #f3f3f3;
        font-size: 14px;
        color: #333;
        font-weight: normal;
    }
    .screenOptions{
        width: 100%;
        margin: 10px 0px;
        overflow: hidden;
        font-size: 14px;
        color: #333;
        .el-button{
            margin-right: 10px;
        }
    }
    .activity-content{
        width: 100%;
        margin: 10px 0;
        overflow: hidden;
        .table{
            background: #ffffff;
            .activity-activityRank{
                width: 35px;
                height: 25px;
                cursor: pointer;
                border:1px solid  #cdcdcd;
            }
        }
                

        .operation{
            .edit{
                 cursor: pointer;
            }
            .detele{
                padding-right: 5px;
               // color: red;
            }
        }
        .pagination {
            // text-align: center;
            background: #eff3f9;
            padding: 20px 0px;
            margin: 20px 0 0;
        }
    }
    .main .operating {
		overflow: hidden;
		clear: both;
		padding: 15px 10px;
		border-top: 5px solid #169BD5;
        background: #169BD5;
        .left {
            float: left;
            font-size: 0;
            span {
                font-size: 14px;
                height: 24px;
                line-height: 24px;
                display: inline-block;
            }
            select {
                width: 50px;
                font-size: 14px;
                height: 22px;
                display: inline-block;
                border: 1px solid #BEBEBE;
                margin: 0 10px;
            }
        }
        .right {
            float: right;
            font-size: 0;
            span {
                font-size: 14px;
                height: 24px;
                line-height: 24px;
                display: inline-block;
            }
	
            input {
                width: 140px;
                font-size: 14px;
                height: 22px;
                padding: 0 5px;
                display: inline-block;
                border: 1px solid #BEBEBE;
                margin: 0 10px;
            }
        }
	}
}

</style>
