<template>
    <div id="addMessage">
        <h3>{{activityOperation}}</h3>
        <div class="content">
            <div class="title">
                <P class="first">
                    1.长度不要超过450字(汉字，字符，数字等可见符号，都按1个子计算)。
                    单条短信长度为70字，超过70字后，按67字/条分割成多条，
                    以长短信的方式发送给用户，即用户收到的是一条长短信，
                    但是按多条计算
                </P>
                <P>2.营销类短信，请在短信内容后面增加 <span class="first">“回T退订”</span> </P>
                <P>3.短信模板内容不能有【】符号</P>
                <P>4.不能发送房产、移民、贷款、政治、色情、暴力等违法类短信</P>
                <P>5.短信内容中不能输入Enter/换行，否则将导致短信分条发送</P>
            </div>
            <div style="overflow: hidden;">
                <div class="propams fl">
                    <el-form  ref="ruleForm" label-width="120px" class="demo-ruleForm">     
                        <el-form-item label="模板名称：" required>
                            <el-input placeholder="请输入模板名称" maxlength="10" v-model="stName">
                                <span slot="append">{{stName.length}}/10</span>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="短信类型：" required>
                            <el-select v-model="relativeTime"  @change="changeType" style="width:100%;"  placeholder="请选择">
                                <el-option
                                    v-for="item in statusOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select> 
                        </el-form-item>
                        <el-form-item label="模板内容：" required>
                            <el-input 
                                type="textarea"
                                maxlength="450"
                                :autosize="{ minRows: 5, maxRows: 20}"
                                placeholder="请输入模板内容"
                                v-model="stContent">
                            </el-input>
                            <span class="fr" style="color:#999;font-size:14px;">{{stContent.length}}/450</span>
                        </el-form-item>
                        <el-form-item label="申请说明：" required>
                            <el-input 
                                type="textarea"
                                maxlength="120"
                                :autosize="{ minRows: 5, maxRows: 20}"
                                placeholder="请输入申请说明"
                                v-model="stDescription">
                            </el-input>
                            <span class="fr" style="color:#999;font-size:14px;">{{stDescription.length}}/120</span>
                        </el-form-item>
                        <el-form-item>
                        <div style="margin-top:10px;">
                                <el-button type="primary" size="medium" style="width:100px;" @click="preservation">提交</el-button>
                                <el-button type="primary" size="medium"  @click="returnEvent">返回</el-button>
                        </div>
                        </el-form-item>
                    </el-form>  
                </div>
                <div class="fl title-word">
                    <div style="padding-left: 10px;">
                        <div class="content-hints">
                            <p>模板示例如下，其中{数字}为可插入的变量，参照表如下：
                                注意考虑变量值的文本长度，以免超出67字/条的文本上限。
                            </p>
                            <div class="fl">     
                                {1}= {姓名} <span></span>
                                <br>

                                {2}= {会员昵称} <br>

                                {3}= {姓名+先生/女士} <br>

                                {4}= {会员昵称+先生/女士} <br>

                                {5}= {生日日期} <br>

                                {6}= {生日倒计时天数} <br>

                                {7}= {关注日期} <br>

                                {8}= {关注天数} <br>

                                {9}= {开卡天数} <br>

                                {10}= {开卡日期} <br>

                                {11}= {会员卡号} <br>

                                {12}= {会员等级名称} <br>

                                {13}= {积分余额} <br>

                                {14}= {消费总额} <br>

                                {15}= {消费次数} <br>

                                {16}= {最近消费日期} <br>

                                {17}= {最近消费间隔} <br>
 
                                {18}= {最高单笔消费} <br>

                                {19}= {最近一次使用积分}
                            </div>
                            <div class="fl" style="padding-left:50px;">  
                                {20}= {30天内过期积分额度}  <br>

                                {21}= {30天内过期优惠券张数} <br>

                                {22}= {30天内过期停车券张数} <br>

                                {23}= {30天内过期团购券张数}  <br>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
           
        </div>
    </div>
</template>

<script>
import {specailTest,numberTest,bracketsTest} from "@/libs/regular.js";
export default {
    data(){
        return{
            stName:"",  //类型：String  必有字段  备注：名称
            stType:1,//类型：Number  必有字段  备注：模板类型：1=普通短信 2=营销短信 3=验证码短信
            stContent:"",//类型：String  必有字段  备注：内容
            stDescription:"",//类型：String  必有字段  备注：申请说明
            statusOptions: [//1:团购商品 2:售卖代金券 劵类型
                {
                    value: 1,
                    label: '普通短信'
                },
                {
                    value: 2,
                    label: '营销短信'
                },
                {
                    value: 3,
                    label: '验证码短信'
                },
            ],
            relativeTime:1,
            activityOperation:'新建短信模板',
        }
    },
    mounted(){

    },
    methods:{
        changeType(){//选择时间类型
            this.stType = this.relativeTime
            console.log(this.relativeTime)
        },
        addCommodity(ev){//添加团购商品数据
            let  obj = { 
                "stName":this.stName, //类型：String  必有字段  备注：名称
                "stType":this.stType,//类型：Number  必有字段  备注：模板类型：1=普通短信 2=营销短信 3=验证码短信
                "stContent":this.stContent, //类型：String  必有字段  备注：内容
                "stDescription":this.stDescription//类型：String  必有字段  备注：申请说明
            }
            this.$httpAuth({
                url:'/mall/addTemplate',
                method:'post',
                data:obj
            }).then((res) =>{
               if(res.data.code == 10000){
                    this.$router.push('/marketing/messageTemplate');
                    this.$message({
                        message: '新建成功',
                        type: 'success'
                    });
                }else{
                    this.$message({
                        message: res.data.msg,
                        type: 'warning'
                    });
                }
            }).catch((err) =>{
                console.log(err);
            }); 
        },

        preservation(){
            this.stName = this.stName.trim();
            this.stContent = this.stContent.trim();
            this.stDescription = this.stDescription.trim();
            if(specailTest(this.stName)){
               this.$message.info('模板名称不能含有特殊字符');
               return;
            }

            if(this.stName==''||this.stName=='  '){
                this.$message.info('请输入模板名称');
                return;
            }
            if(bracketsTest(this.stContent)){
               this.$message.info('模板内容不能含有特殊字符【】');
               return;
            }
            if(this.stContent==''||this.stContent=='  '){
                this.$message.info('请输入模板内容');
                return;
            }
            if(this.stDescription==''||this.stDescription=='  '){
                this.$message.info('请输入申请说明');
                return;
            }
            this.addCommodity();

        },
        returnEvent(){
            this.$router.push('/marketing/messageTemplate');
        },
    }
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
#addMessage{
    width: auto;
    min-width: 1000px;
    h3{
		height: 35px;
		line-height: 35px;
		border-bottom: 1px solid #f3f3f3;
		text-indent: 5px;
        font-size: 14px;
        color: #333;
        font-weight: normal;
    }
    .content{
        padding: 15px 15px;
        .title{
            background: #f5f8fa;
            padding: 20px 30px;
            p{
                font-size: 14px;
                color: #666666;
            }
            .first{
                
                color: #589aff;
            }
        }
        .propams{
            margin-top: 20px;
            width:50%;
        }
        .title-word{
            margin-top: 20px;
            width:50%;
            .content-hints{
                padding: 23px 10px;
                background: #f5f8fa;
                font-size: 14px;
                overflow: hidden;
                p{
                    color: #666;
                    line-height: 30px;
                }
                div{
                    line-height: 20px;
                }

            }
        }
    }
}
</style>
