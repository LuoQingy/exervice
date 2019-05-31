<template>
    <div id="addActivity">
        <h3>{{suntitle}}</h3>
        <div class="leftshowlist fl">
            <h4>图文列表</h4>
            <div class="graphicMessage">
                <div class="top" :style="selectIndex==-1?selectborder:''" @click="selectMid(-1)">
                    <img :src="selectIndex==-1?leftshowtext.img:ruleForm.originImg" alt="">
                    <p class="title">{{selectIndex==-1?leftshowtext.title:'标题'}}</p>
                </div>
                <div class="middle" :style="selectIndex==index?selectborder:''" v-for="(item,index) in middleText" :key="index" v-show="midTextState" @click="selectMid(index)">
                    <p class="title"><span>{{selectIndex==index?leftshowtext.title:item.title+(index+1)}}</span></p>
                    <p class="rightimg"><img :src="selectIndex==index?leftshowtext.img:ruleForm.originminImg" alt=""></p>
                </div>
                <div class="addOther" @click="showmidText">
                    <i class="el-icon-plus"></i>
                </div>
            </div>   
        </div>
        <div class="addActivity-content fl">
            <span class="triangle"></span>
            <el-form label-position="top" label-width="120px" class="demo-ruleForm">              
                <el-form-item label="标题" required>
                   <div class="activity-name">
                        <input v-model="texttitle" maxlength="64" class="fl"  style="width:400px;" placeholder="请输入标题" />
                        <span style="margin-left: -45px;color:#999">{{ruleForm.title.length}}/64</span>
                   </div>
                </el-form-item>
                 <el-form-item label="作者" required>
                   <div class="activity-name">
                        <input  v-model="ruleForm.author" maxlength="20" class="fl"  style="width:400px;" placeholder="请输入作者" />
                        <span style="margin-left: -45px;color:#999">{{ruleForm.author.length}}/64</span>
                   </div>
                </el-form-item>
                <el-form-item label="封面(大图片建议尺寸：900像素 * 500像素)" required>
                    <div style="margin-bottom:10px;">
                        <el-button type="primary" @click="uploadState=!uploadState">本地上传</el-button>
                        <el-button type="primary" @click="dialogVisible=!dialogVisible">从素材中选择</el-button>
                    </div>
                    <uploadone v-show="uploadState" @childByValue="childByValue" :ruleFormT="ruleForm"></uploadone>
                    <el-checkbox v-show="uploadState" v-model="ruleForm.showbodyimg">封面图片显示在正文中</el-checkbox>
                </el-form-item>
               <el-form-item label="摘要(选填，如果不填写会默认抓取正文前54个字)" required>
                   <el-input type="textarea" :rows="4" v-model="ruleForm.abstract" style="width:400px;" placeholder="请输入摘要"></el-input>
                   <div style="margin-left:360px;color:#999;">{{ruleForm.abstract.length}}/120</div>
                 </el-form-item>
                <el-form-item label="正文" required>
                    <div>
                        <wangeditor @editorContent="getEditorContent" :editorContent="editorContent" :customConfig="customConfig" :isLoading="isLoading" :disableEditor="disableEditor"></wangeditor>
                    </div>
                </el-form-item>

                <el-form-item required>
                    <el-checkbox v-model="ruleForm.linkState" @click="ruleForm.linkState=!ruleForm.linkState">原文链接</el-checkbox>
                    <div>
                       <el-input v-show="ruleForm.linkState"  v-model="ruleForm.link" maxlength="64" style="width:400px;"></el-input>
                    </div>
                </el-form-item>
                <el-form-item>
                   <div style="margin-top:10px;">
                        <el-button type="primary" size="mini" @click="submitForm()">保存</el-button>
                        <el-button type="info" size="mini"  @click="resetForm()">取消</el-button>
                   </div>
                </el-form-item>
            </el-form>  
        </div>
        <el-dialog title="提示" :visible.sync="dialogVisible" width="1200px">
            <ChooseMaterialPicture></ChooseMaterialPicture>
        </el-dialog>
    </div>
</template>

<script>
import uploadone from '../../UploadImg/publicMenuUpload.vue'
import wangeditor from '../../../common/wangeditor.vue'
import forlataTime from '../../../../../static/js/forlataTime.js'
import ChooseMaterialPicture from './ChooseMaterialPicture.vue'
import {specailTest} from "@/libs/regular.js";
export default {
    components:{uploadone,wangeditor,ChooseMaterialPicture},
    data(){
        return{
            midTextState:false,
            middleText:[
            ],
            leftshowtext:{//左侧展示的内容
                title:'标题',
                img:require('../../../../assets/img/loadmidimg.png')
            },
            texttitle:"",
            ruleForm: {
                title: "",//标题
                author:"",//作者
                abstract:"",//摘要
                showbodyimg:false,//封面是否显示在正文中
                link:'',//原文链接
                otherImageUrl:'',
                originImg:require('../../../../assets/img/loadmidimg.png'),
                originminImg:require('../../../../assets/img/loadminimg.png'),
                linkState:false,
                
            },
            suntitle:'增加素材',
            input9:'',//关联链接
            richtext:'',//富文本的值
            editorContent: '',//积分指南
            isLoading: false,
            disableEditor: false,
            customConfig: [//副文本编辑器功能配置
					'head',  // 标题
					'bold',  // 粗体
					'fontSize',  // 字号
					'fontName',  // 字体
					'italic',  // 斜体
					'underline',  // 下划线
					'strikeThrough',  // 删除线
					'foreColor',  // 文字颜色
					'backColor',  // 背景颜色
					// 'link',  // 插入链接
					'list',  // 列表
					'justify',  // 对齐方式
					// 'quote',  // 引用
					// 'emoticon',  // 表情
					'image',  // 插入图片
					// 'table',  // 表格
					// 'video',  // 插入视频
					// 'code',  // 插入代码
					'undo',  // 撤销
					'redo'  // 重复
				],
            selectIndex:-1,//选择的图文消息
            selectborder:{
                "border":"1px solid red"
            },
            uploadState:false,//本地上传
            dialogVisible: false,//素材图片
            
        }
    },
    created() {

  },
    mounted(){
        
    },
    watch:{
        texttitle(){
            this.leftshowtext.title=this.texttitle
            this.ruleForm.title=this.texttitle
        }
    },
    methods:{
        showmidText(){
            this.midTextState=true
            let newText= {title:'图文',img:require('../../../../assets/img/loadminimg.png')}
            this.middleText.push(newText)
        },
        
        selectMid(index){
            this.selectIndex=index
        },
         childByValue(childValue) {
            // 未激活图片组件传过来的值
            this.ruleForm.otherImageUrl=childValue
            this.leftshowtext.img=childValue
        },
        changeColor(){//选择链接 和副文本狂  选择改变公告标题的字体颜色
            this.styleColor.color = this.color;
        },
         getEditorContent(val) {//富文本的值
            this.editorContent = val;
        },
        submitForm(){
                let _this=this
                let specail= /[@#\$%\^&\*]+/g;//校验特殊字符
                let checknum= /^\d+(?=\.{0,1}\d+$|$)/;//校验数字不包括负数
                let checknumpoint= /^([0-9]*[.0-9])$/;//校验数字不包括负数
                if(_this.ruleForm.title==""){
                    this.$message.info('标题不能为空')
                    return;
                }else if(specailTest(this.ruleForm.title)){
                    this.$message.info('标题不能为特殊字符')
                    return;
                }else if(_this.ruleForm.author==""){
                    this.$message.info('作者不能为空')
                    return;
                }else if(specailTest(this.ruleForm.author)){
                    this.$message.info('作者不能为特殊字符')
                    return;
                }else if(_this.ruleForm.abstract==""){
                    this.$message.info('图片不能为空')
                    return;
                }else if(_this.ruleForm.abstract==""){
                    this.$message.info('封面是否显示在正文中不能为空')
                    return;
                }else if(_this.ruleForm.otherImageUrl==""){
                    this.$message.info('摘要不能为空')
                    return;
                }else if(_this.editorContent==""){
                    this.$message.info('正文不能为空')
                    return;
                }else if(_this.ruleForm.link==""){
                    this.$message.info('原文链接不能为空')
                    return;
                }
                if(this.ruleForm.showbodyimg){
                    this.ruleForm.showbodyimg=1
                }else{
                    this.ruleForm.showbodyimg=0
                }
                this.$httpAuth({
                    url:'/mall/addWechatNews',
                    method:'post',
                    data:{
                        "title":this.ruleForm.title,                
                        "thumbMediaId":"dAdlr4u7lc4ThB5dTK1jLg6CKWlQmgSlmTP0XSVPVog",                
                        "showCoverPic":this.ruleForm.showbodyimg,               
                        "content":this.editorContent,                
                        "contentSourceUrl":this.ruleForm.link,                
                        "author":this.ruleForm.author,                
                        "digest":this.ruleForm.abstract,                
                        "imageUrl":this.ruleForm.otherImageUrl       
                    }
                }).then((data)=>{
                    if(data.data.code==10000){
                        _this.$message.success(data.data.resp)
                        _this.$router.push('/system/graphicMessage')
                    }else{
                        _this.$message.info(data.data.msg)
                    }

                }).catch((err)=>{
                    console.log(err)
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
    min-width: 1000px;
    h3{
		height: 35px;
		line-height: 35px;
		border-bottom: 1px solid #f3f3f3;
		text-indent: 15px;
        font-size: 14px;
        color: #333;
        font-weight: normal;
        margin-bottom: 20px;
    }
    .leftshowlist{
        width: 200px;
        background: ghostwhite;
        padding: 10px;
        border: 1px solid #ddd;
        margin-left: 60px;
        h4{
            margin-bottom: 20px;
        }
        .graphicMessage{
        .top{
            width: 200px;
            height: 120px;
            position: relative;
            background: #fff;
            img{
                width: 200px;
                height: 120px;
            }
           .title{
                position: absolute;
                bottom: 0;
                left: 0;
                width: 190px;
                background: rgba(0,0,0,.5);
                color:#fff;
                padding-left:10px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis; 
            }
        }
        .middle{
            border: 1px dashed #ddd;
            width: 200px;
            height: 80px;
            display: flex;
            background: #fff;
            .title{
                font-size: 14px;
                display: inline;
                vertical-align: text-bottom;
                flex: 1;
                span{
                    margin: 10px 0 0 10px;
                    display: inline-block;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    width: 100px;
                }
            }
            .rightimg{
                flex: 1;
                text-align: right;
                height: 80px;
                line-height: 80px;
                img{
                width: 60px;
                height: 60px;
                margin: 10px 10px 0 10px;
                display: inline-block;
                }
            }
            
           
        }
        .addOther{
            border: 1px dashed #ddd;
            width: 200px;
            height: 80px;
            line-height: 80px;
            text-align: center;
            i{
                font-size: 22px;
            }
        }
        }

    }
    .addActivity-content{
        width: 600px;
        background: ghostwhite;
        padding: 10px;
        border: 1px solid #ddd;
        margin-left: 20px;
        position: relative;
        .triangle{
        width: 14px;
        height: 14px;
        position: absolute;
        top: 10px;
        left: -8px;
        background: ghostwhite;
        transform: rotate(135deg);
        border-right: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
    }
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
