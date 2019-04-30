<template>
    <div id="same-introduce">
         <div class="same-type-and-introduction-commodity-details">
            <!-- 同类型产品 商品详情介绍 说明书 -->
            <div class="fl" id="same-type">
                <p class="same-type-header">同类型产品</p>
                <div class="same-type-product" v-for="(item,index) in sameList" :key="index" @click="details(item.goodId)">
                    <div class="fl productBox">
                        <img :src="item.imageUrl" >
                    </div>
                    <div class="fl product-intriduce">
                        <p class="product-information">
                           {{item.name}}
                        </p>
                        <p class="product-price">
                            ￥{{item.price}}
                        </p>
                    </div>
                </div>
            </div>
            <div class="fl" id="introduction">
                <div class="introduction-header">
                    <p class="fl" v-for="(text,index) in seclectList" :key="index" :class="text.className" @click="seclectClick(index)">
                        {{text.title}}
                    </p>                   
                </div>
                <!-- 商品详情 -->
                <div class="introduction-details-information" v-show="seclectList[0].hideCheck">
                    <div class="details-table">
                        <p class="fl" v-for="(item,index) in relateAttr" :key="index">{{item.name}} ：{{item.value}}</p>                          
                    </div> 
                    <div class="imageText-details">
                       	<div id="htmlvue" v-html="detailsContent">
                            <div style="padding:0.5rem;">
                                {{detailsContent}}
                            </div>
                        </div>
                        <div v-for="(title,index) in detailsContentList" :key="index">
                            <div class="same-img">
                                <img :src="title" >
                            </div>
                        </div>
                    </div> 
                </div>
                <!-- 说明书 -->
                <div class="instructions" id="instructions" v-show="seclectList[1].hideCheck">
                    <div id="htmlvue" v-html="instructionBook">
                        <div>
                            {{instructionBook}}	
                        </div>
                    </div>
                    <div v-for="(title,index) in instructionBookList" :key="index">
                        <div class="same-img">
                            <img :src="title" >
                        </div>
                    </div>
                </div>
                <!-- 用户评价块 -->
                <div class="user-evaluation" id="user-evaluation" v-show="seclectList[2].hideCheck">  
                    <evaluation-block></evaluation-block>              
                </div>
            </div>
             <div style="clear:both"></div>
        </div>   
    </div>
</template>

<script>
 import evaluationBlock from './evaluation_block';
export default {
    components:{evaluationBlock},
    data(){
        return{
            goodsId:'',
            drugTable:{
                commodityName:'999感冒灵颗粒',//商品名称 
                commoditySpecification:'5g*9袋' ,//商品规格
                generalName:'999感冒灵颗粒', //通用名称 
                termOfValidity:'30个月',//有效期
                approvalNumber:'国药准字Z2028739',//批准文号  
                indication:'风热感冒',  //适应症/功能主治
                reminder:'刷机过程中请保持电脑不断电，使用适配器和电池一起供',//温馨提示
            },
            
            seclectList:[//商品详情 说明书 用户评价 选中时列表
                {
                    title:'商品详情',
                    className:'introduceSeclect',//选中时的状态，
                    hideCheck:true,//选中出现
                },
                {
                    title:'说明书',
                    className:'',//选中时的状态
                    hideCheck:false,
                },
                {
                    title:'用户评价',
                    className:'',//选中时的状态
                    hideCheck:false,
                }
            ],
            startP :'0',
            endP :'999999',
            relateAttr:[],//相关属性
            detailList:{},
            detailsContent:'',//详情内容
			instructionBook:'',//说明书
			detailsContentList:[],
            instructionBookList:[],
            sameList:[],//同一分类的商品
            type:'1',//1>销量  ，  2>最新   3>评价，4价格
            condition:'desc',//desc高到底   asc 低到高
            num:1,
            page:1,
        }
    },
     created(){
        let routerParams = this.$route.params.goodsId;
		var routerQuery = this.$route.query.goodsId;
		this.msg = this.$route.params.goodsId;
        this.query = this.$route.query.goodsId;
        this.goodsId = routerParams;
		//将数据放在当前组件的数据内
		if(routerParams == routerQuery) { //参数的保存商品Id
			this.goodsId = routerQuery;
			console.log('goodsId:' + this.goodsId)
		}else{
			this.goodsId = routerParams;
			console.log('goodsId:' + this.goodsId)
		}
    },
    mounted(){
        this.$nextTick(() => {
            this.getGoodSku();
            this.getGoodDetails();
        })
        
    },
    methods:{
        details(goodsId){//跳到商品详情页			
            // var goodsId = goodsId	
            // //localStorage.setItem('goodsId',goodsId)
            // let routeData = this.$router.resolve({
            //      path:'/product_details',
            //     name:'product_details', 
            //     params:{
            //         goodsId:goodsId
            //     },
            //     query:{
            //         goodsId:goodsId
            //     }
            //     });
            // console.log(routeData.href)
            // window.open(routeData.href, '_blank');   
            window.open('#/product_details/' + goodsId + '?goodsId=' + goodsId)        
        },
        seclectClick(index){ //商品详情 说明书 用户评价 选中时列表
            for(var i=0;i<this.seclectList.length;i++){
                this.seclectList[i].className = ' ';
                this.seclectList[i].hideCheck = false;
            }
                this.seclectList[index].className = 'introduceSeclect';
                this.seclectList[index].hideCheck = true;
        },

        getGoodSku(){//获取相关属性
            var _this = this;
             console.log(this.goodsId);
            var spec ={					
                goodId:this.goodsId
            }

            console.log(spec);
            this.$getAxios({
                url:'/mall/getGoodsKu',
                method:'get',
                params:spec,
            }).then(function(res){
                
                console.log('获取相关商品属性'+res.data.msg);
                console.log(res.data)
                if(res.data.code == 20000){
                    console.log(res.data.msg)
                }else if(res.data.code == 10000){
                    var success = res.data.extend.success;
                    _this.relateAttr=[]
                    if(res.data.extend.success.length==0){
                        console.log('success为空')
                    }else{
                        for(var i=0;i<success.length;i++){
                            var obj ={
                                name:success[i].name,//属性名
                                value:'',//属性值
                            }
                            for(var j=0;j<success[i].valueList.length;j++){
                                if(success[i].valueList[j].value == null||success[i].valueList[j].value==''){
                                    obj.value += ''
                                }else{
                                    obj.value +=success[i].valueList[j].value;
                                }
                                
                            }
                            _this.relateAttr.push(obj)
                        }
                        
                    }	
                }
            }).catch(function(err){
                console.log(err)
            });		
        }, 
        
        detailContEvent(detailContent,ev){
            var vm = this;
            let detailTextAndUrl = detailContent;
            let andIndex = detailTextAndUrl.indexOf("($rrg$)")
            let detailText = ''
            let detailImgUrlArr = []
            if(andIndex != -1){
                detailText = detailTextAndUrl.substring(0, andIndex)
                let detailImgUrlcont = detailTextAndUrl.substring(andIndex+7,detailTextAndUrl.length)
                detailImgUrlArr = detailImgUrlcont.split('http://')
                detailImgUrlArr.splice(0,1)
                detailImgUrlArr.forEach(item => {
                    item = "http://"+item
                //	console.log(item)
                    if(ev==1){
                        vm.detailsContentList.push(item);
                    }else if(ev==2){
                        vm.instructionBookList.push(item);
                    }
                })
            }else{
                detailText = detailTextAndUrl
            }
            detailText  = detailText.replace(/\(\$(and)\$\)/g, '&')
            if(ev==1){
                this.detailsContent = detailText;
                //console.log(this.detailsContentList);
            }else if(ev==2){
                this.instructionBook = detailText;
                //console.log(this.instructionBookList);
            }
        },

        getGoodDetails(){//商品详情
            var _this = this;
            var  user = {
                goodId:this.goodsId,
            }
            if(_this.$cookies.get('4806dadc9d5788d18e5c7705e7643333')=='b326b5062b2f0e69046810717534cb09'){
                user.userType = 2
            }else{
                user.userType = 1
            }
            if(_this.$cookies.get('tel')){
                user.tel = _this.$cookies.get('tel')
            }else{
                user.tel = ' '
            }
            //console.log(user)
            this.$getAxios({
                url:'/mall/getGoodInfo',
                method:'get',
                params:user
            }).then(function(res){
               // console.log(res.data)
                //console.log('商品详情'+res.data.msg);
                if(res.data.code == 20000){
                    //console.log(res.data.msg)
                }else if(res.data.code == 10000){
                    var success = res.data.extend.success;
                    let obj ={
                        cateId:success.cateId,//分类Id
                    }
                    console.log('详情内容')
                    console.log('说明书内容')
                    if(success.detailContent ==''||success.detailContent==null){
                        obj.detailContent =''
                    }else{                               
                        _this.detailContEvent(success.detailContent,1)
                    }
                    if(success.instructionBook ==''||success.instructionBook ==null){
                        obj.instructionBook ='';                           
                    }else{
                        obj.instructionBook = success.instructionBook
                        _this.detailContEvent(success.instructionBook,2)
                    }
                    if(success.cateId==null||success.cateId==""){
                        if(success.cateId==0){
                             _this.getGoodsByConditionEvent(success.cateId)
                        }
                    }else{
                        _this.getGoodsByConditionEvent(success.cateId)
                    }    
                    console.log('分类id'+success.cateId)                                                                                                         						
                }
            }).catch(function(err){
                console.log(err)
            });	
        },

        getGoodsByConditionEvent(catId){//分类入口搜索接口
            var _this = this;
            var cateId = catId;
                var userId = ' '
           if(this.$cookies.get('userId')) {
                 userId = this.$cookies.get('userId')
           }else{
                userId = ' ' 
           } 
            var data ='categoryId='+cateId+ '&userId='+userId;  
         
           console.log('fdg'+userId)
            data += '&brandsId[]=';
            data += '&searchPropertieId[]=' ;       
            data+='&type='+this.type+'&condition='+this.condition+'&page='+this.page+'&number=10';
            data += "&startPrice="+this.startP +'&endPrice='+this.endP;
            if(_this.$cookies.get('4806dadc9d5788d18e5c7705e7643333')=='b326b5062b2f0e69046810717534cb09'){
					data +='&userType=2'
					//console.log('you')
            }else{
                data +='&userType=1'
              //  console.log('no')
            }
            if(_this.$cookies.get('tel')){
                data +='&tel='+ _this.$cookies.get('tel')
               // console.log('youu')
            }else{
                data +='&tel='
               // console.log('noo')
            }
            console.log(data)
            this.$postAxios({
				url:'/mall/getGoodsByCondition',
				method:'post',
				data:data
			}).then((res) => {
                console.log(res.data)
                if(res.code==20000){
                    console.log("获取分类数据失败")
                }else if(res.data.code==10000){
                    console.log("获取分类数据成功")
                    var success = res.data.extend.success;
                     _this.sameList =[ ];
                    if(success.length==0||success==null){
                        console.log("为空")
                    }else if(success.length>0){ 
                       // console.log(success.length);                   
                        for(var i=0;i<success.length;i++){
                            if(success[i].goodId==_this.goodsId){
                                continue;
                            }
                            var obj ={
                                name:success[i].name,//商品名
                                subName:success[i].subName,//副标题
                                originalPrice:success[i].originalPrice,//商品原价
                                sales:success[i].sales,//商品销量
                                goodId:success[i].goodId,//商品名Id
                                cateId:success[i].cateId,//商品名Id
                                memberPrice:success[i].memberPrice,//会员价
                                sales:success[i].sales,//会员价
                            }
                            if(_this.$cookies.get('4806dadc9d5788d18e5c7705e7643333')=='b326b5062b2f0e69046810717534cb09'){
                                if(success[i].tradePrice==' '||success[i].tradePrice == null){
                                    obj.price = '审核后显示';
                                    // if(success[i].tradePrice==0){
                                    // 	  obj.price = success[i].tradePrice;
                                    // }
                                }else{
                                    obj.price = success[i].tradePrice;//批发商的价格
                                }
                                
                            }else{
                                if(success[i].memberPrice ==' '||success[i].memberPrice==null){
                                    obj.price = '审核后显示';
                                    // if(success[i].price==0){
                                    // 	obj.price = success[i].price;
                                    // }											
                                }else{
                                    obj.price = success[i].memberPrice;//现价
                                }										
                            }
                            if(success[i].goods_images.length==0||success[i].goods_images==null){
                                 obj.imageUrl = require('../../assets/gengxin.jpg');
                            }else{
                                for(var j=0;j<success[i].goods_images.length;j++){
                                    if(success[i].goods_images[j].isHead ==true){
                                        obj.imageUrl = success[i].goods_images[j].imageUrl;
                                        break;
                                    }else{
                                        obj.imageUrl = require('../../assets/gengxin.jpg');
                                    }
                                }
                            }         

                             _this.sameList.push(obj);
                             if(_this.sameList.length>=4){
                                 break;
                             }
                        }                               
                    }
                   
                }
            }).catch((err) => {
                console.log(err)
            })
        },
    },
}
</script>

<style scoped>
div,img,a,li,ul,p,span,h3,input,button,section{
    margin: 0;
    padding: 0;
}
img{
    border: none;
}
li{
    list-style: none;
}
.fl{
    float: left;
}
.fr{
    float: right;
}
input,button{
    outline: none;
    border: none;
    background: #ffffff;
}
.same-type-and-introduction-commodity-details{
    width: 1200px;
    padding-top:10px; 
}
#same-type{
    width: 208px;
    border: 1px solid #e4e4e4;
}
#same-type .same-type-header{
    width: 100%;
    height: 42px;
    line-height: 42px;
    text-align: center;
    font-size: 14px;
    color: #333;
}
#same-type .same-type-product{
    width: 198px;
    height: 65px;
    border-top: 1px solid #e4e4e4;
    padding: 12px 0px 0px 10px;
    background: #fff;
    cursor: pointer;
}
#same-type .same-type-product .productBox{
    width: 50px;
    height: 50px;
}
#same-type .same-type-product .productBox img{
    width: 100%;
    height: 100%;
}
#same-type .same-type-product .product-intriduce{
    width: 148px;
    height: 65px;
}
#same-type .same-type-product .product-intriduce .product-information{
    width: 128px;
    max-height: 40px;
    line-height: 20px;
    font-size: 12px;
    color: #666;
    overflow: hidden;
    margin: 0 auto;
}
#same-type .same-type-product .product-intriduce .product-price{
    width: 128px;
    margin: 0 auto;
    font-size: 14px;
    color: #FF3300;
    font-weight: bold;
}
#introduction{
    width: 978px;
    margin-left:10px; 
    border:1px solid #d7d7d7; 
    border-top:none;
}
#introduction .introduction-header{
    width: 100%;
    height: 44px;
    background: #f2f2f2;
}
#introduction .introduction-header p{
    width: 208px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    color: #333;
    font-size: 14px;
    border-top: 4px solid #f2f2f2;
    cursor: pointer;
    background: #f2f2f2;
}
#introduction .introduction-header .introduceSeclect{
    border-top: 4px solid #4fc1b0;
    background: #fff;
}
#introduction  .introduction-details-information{
    width: 940px;
    padding: 20px 19px 20px 19px;
   
}
#introduction  .details-table{
    width: 910px;
    padding: 15px;
    background: #f2f2f2;
    border-top: 1px solid #e4e4e4;
    overflow: auto;
}
#introduction  .details-table>p,#introduction  .details-table .reminder{
    line-height: 24px;
    font-size: 14px;
    color: #666;
}
#introduction  .details-table>p{
    width: 440px;
    height: 24px;
    text-overflow:ellipsis; 
    white-space:nowrap; 
    overflow:hidden; 
}
#introduction  .details-table .reminder{
    width: 910px;
    font-size:14px;
    color: #666; 
}
#introduction  .details-table .reminder .reminder-title{
    width: 76px;
    height: 24px;
}
#introduction  .details-table .reminder .reminder-content{
    width: 820px;
    line-height: 24px;
}
#introduction  .introduction-details-information .imageText-details{
    width: 880px;
    padding: 30px 30px;
    border: 1px dashed #cccccc;
    font-size: 14px;
    color: #666;
    margin-top:10px;    
}
 .same-img{
    text-align: center;
}
.instructions{
    width:918px;
    padding: 10px 30px;
    margin: 0 auto;
}
.same-img img{
    max-width: 880px;
    vertical-align: middle;
   padding: 10px 0px;
}
#htmlvue{
	font-size: 14px !important;
	line-height: 30px !important;
}
#user-evaluation{
    width: 964px;
    padding: 0px 0px 15px 14px;
}
</style>
