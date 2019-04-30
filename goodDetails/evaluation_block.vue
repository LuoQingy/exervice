<template>
    <div id="evaluation-block">
        <!-- 显示的评价率 -->
        <div class="evaluation-rate-display">
            <div class="fl evaluation-rate">
                {{progressBar.goodPercentage}}
            </div>
            <div class="fl evaluate">
                <div class="good-evaluation">
                    <p class="fl evaluation-name">好评（ {{progressBar.goodPercentage}} ）</p>
                    <div class="fr display-bar">
                        <p class="gray-display-bar"></p>
                        <p class="red-display-bar" :style="progressBar.goodProgressBar"></p>                                      
                    </div>
                </div>
                <div class="middle-evaluation">
                    <p class="fl evaluation-name">中评（ {{progressBar.middlePercentage}} ）</p>
                    <div class="fr display-bar">
                        <p class="gray-display-bar"></p>
                        <p class="red-display-bar" :style="progressBar.middleProgressBar"></p>                                       
                    </div>
                </div>
                <div class="differential-evaluation">
                    <p class="fl evaluation-name">差评（ {{progressBar.differencePercentage}} ）</p>
                    <div class="fr display-bar">
                        <p class="gray-display-bar"></p>
                        <p class="red-display-bar" :style="progressBar.differenceProgressBar"></p>                                     
                    </div>
                </div>
            </div>
            <!--<div class="fl allowable-evaluation">
              	  您可对已购买商品<span>进行评价</span>
            </div>-->
        </div>
        <!-- 评价内容块 -->
        <div class="evaluation-content">
            <ul class="evaluationUl">
                <li class="fl" v-for="(item,index) in evaluationList" :key="index" :class="item.className" @click="evaluateTab(index)">
                    {{item.title}} ({{item.length}})
                </li>
            </ul>
            <!-- 全部 -->
            <div class="all-evaluate-area evaluation-area" v-show="evaluationList[0].hideCheck">
                <ul >
                    <li v-for="(item,index) in wholeList" :key="index">
                        <div class="evaluation-star-name">
                            <p class="fl">
                                <i v-for="(text,index) in item.stars" class="fa fa-star"></i>                                
                            </p>
                            <p class="fr">
                                <span class="fr evaluation-time">
                                   {{item.addTime}}
                                </span>
                                <span class="fr evaluation-username">
                                    {{item.userName}}
                                </span>                               
                            </p>
                        </div>
                        <div class="evaluation-words">
                            {{item.context}}
                        </div>
                         <div class="shrinkage">
                             <div v-for="(images,second) in item.imgList" :key="second" @click="btnClick(0,index,second)">
                                 <img :src="images.url" >
                             </div>
                        </div>
                        <div class="big-img" v-show="item.appearCheck">
                            <div class="fl"   @mouseover="overEvent(0,index,item.imgList.length)" @mouseout="enterEvent(0,index,item.imgList.length)">
                                <img :src="item.bigImgUrl" >
                                <button v-show="item.leftCheck" @click="btnLeft(0,index,item.imgList.length)" class="btn fa fa-chevron-left"></button>
                                <button v-show="item.rightCheck" @click="btnRight(0,index,item.imgList.length)" class="btn fa fa-chevron-right"></button>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <!-- 好评 -->
            <div class="good-evaluate-area evaluation-area" v-show="evaluationList[1].hideCheck" >
                <ul>
                    <li v-for="(item,index) in goodList" :key="index">
                        <div class="evaluation-star-name">
                            <p class="fl">
                                <i v-for="(star,index) in item.stars" class="fa fa-star"></i>                                
                            </p>
                            <p class="fr">
                                <span class="fr evaluation-time">
                                    {{item.addTime}}
                                </span>
                                <span class="fr evaluation-username">
                                    {{item.userName}}
                                </span>                               
                            </p>
                        </div>
                        <div class="evaluation-words">
                             {{item.context}}
                        </div>
                        <div class="shrinkage">
                             <div v-for="(images,second) in item.imgList" :key="second" @click="btnClick(1,index,second)">
                                 <img :src="images.url" >
                             </div>
                        </div>
                         <div class="big-img" v-show="item.appearCheck">
                            <div class="fl"  @mouseover="overEvent(1,index,item.imgList.length)" @mouseout="enterEvent(1,index,item.imgList.length)">
                                <img :src="item.bigImgUrl" >
                                <button v-show="item.leftCheck" @click="btnLeft(1,index,item.imgList.length)" class="btn fa fa-chevron-left"></button>
                                <button v-show="item.rightCheck" @click="btnRight(1,index,item.imgList.length)" class="btn fa fa-chevron-right"></button>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <!-- 中评 -->
            <div class="middle-evaluate-area evaluation-area" v-show="evaluationList[2].hideCheck">
                <ul>
                     <li v-for="(item,index) in moddleList" :key="index">
                        <div class="evaluation-star-name">
                            <p class="fl">
                                <i v-for="(item,index) in item.stars" class="fa fa-star"></i>                                
                            </p>
                            <p class="fr">
                                <span class="fr evaluation-time">
                                    {{item.addTime}}
                                </span>
                                <span class="fr evaluation-username">
                                    {{item.userName}}
                                </span>                               
                            </p>
                        </div>
                        <div class="evaluation-words">
                            {{item.context}}
                        </div>
                        <div class="shrinkage">
                             <div v-for="(images,second) in item.imgList" :key="second"  @click="btnClick(2,index,second)">
                                 <img :src="images.url" >
                             </div>
                        </div>
                        <div class="big-img" v-show="item.appearCheck">
                            <div class="fl"  @mouseover="overEvent(2,index,item.imgList.length)" @mouseout="enterEvent(2,index,item.imgList.length)">
                                <img :src="item.bigImgUrl" >
                                <button v-show="item.leftCheck" @click="btnLeft(2,index,item.imgList.length)" class="btn fa fa-chevron-left"></button>
                                <button v-show="item.rightCheck" @click="btnRight(2,index,item.imgList.length)" class="btn fa fa-chevron-right"></button>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <!-- 差评 -->
            <div class="diss-evaluate-area evaluation-area" v-show="evaluationList[3].hideCheck">
                <ul>
                    <li v-for="(item,index) in dissList" :key="index">
                        <div class="evaluation-star-name">
                            <p class="fl">
                                <i v-for="(item,index) in item.stars" class="fa fa-star"></i>                                
                            </p>
                             <p class="fr">
                                <span class="fr evaluation-time">
                                    {{item.addTime}}
                                </span>
                                <span class="fr evaluation-username">
                                     {{item.userName}}
                                </span>                               
                            </p>
                        </div>
                        <div class="evaluation-words">
                             {{item.context}}
                        </div>
                        <div class="shrinkage">
                            <div v-for="(images,second) in item.imgList" :key="second" @click="btnClick(3,index,second)">
                                <img :src="images.url" >
                            </div>
                        </div>
                        <div class="big-img" v-show="item.appearCheck">
                            <div class="fl" @mouseover="overEvent(3,index,item.imgList.length)" @mouseout="enterEvent(3,index,item.imgList.length)">
                                <img :src="item.bigImgUrl" >
                                <button v-show="item.leftCheck" @click="btnLeft(3,index,item.imgList.length)" class="btn fa fa-chevron-left"></button>
                                <button v-show="item.rightCheck" @click="btnRight(3,index,item.imgList.length)" class="btn fa fa-chevron-right"></button>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>

        </div>            
   </div>
</template>

<script>

export default {
    data(){
        return{
            progressBar:{
                goodPercentage:'',//好评百分比
                middlePercentage:'',//中评百分比
                differencePercentage:'',//差评百分比
                goodProgressBar:{//好评进度条
                    'width':''
                },
                middleProgressBar:{//中评进度条
                    'width':''
                },
                differenceProgressBar:{//差评进度条
                    'width':''
                }
            }, 
            goodsId:"",
            evaluationList:[//评价列表
                {
                    title:'全部',
                    className:'active',
                    hideCheck:true,
                    length:0
                },
                {
                    title:'好评',
                    className:'',
                    hideCheck:false,
                    length:0
                },
                {
                    title:'中评',
                    className:'',
                    hideCheck:false,
                    length:0
                },
                {
                    title:'差评',
                    className:'',
                    hideCheck:false,
                    length:0
                },
            ],
            wholeList:[ ],
            goodList:[ ],
            moddleList:[ ],
            dissList:[  ],
            set:'',//判断前后是否点击同一张
        }
    },
    created(){
        var routerParams = this.$route.params.goodsId;
        var routerQuery = this.$route.query;
        this.goodsId = routerParams;
        console.log("evaluation"+routerParams);
        console.log(routerQuery);
    },
    mounted(){
        //this.evaluationList[0].length =  this.wholeList.length;
      //  this.evaluationList[1].length =  this.goodList.length;
       // this.evaluationList[2].length =  this.moddleList.length;
       // this.evaluationList[3].length =  this.dissList.length;
       console.log(this.goodsId)
       if(this.goodsId!=null||this.goodsId != undefined){
           this.getGoodsEval();
       }
        
    },
    methods:{
        evaluateTab(index){
            for(var i= 0;i<4;i++){
                this.evaluationList[i].hideCheck = false;
                this.evaluationList[i].className = ' ';
            }
             this.evaluationList[index].hideCheck = true;
             this.evaluationList[index].className = 'active';
        },

        percentageEvent(){//百分比算法
            var good = Math.round(((this.goodList.length/this.wholeList.length)*100).toFixed(1));
            var moddle =  Math.round(((this.moddleList.length/this.wholeList.length)*100).toFixed(1)); 
            var diss = Math.round(((this.dissList.length/this.wholeList.length)*100).toFixed(1));
            console.log(good,moddle,diss)
            this.progressBar.goodPercentage = good+'%';
            this.progressBar.middlePercentage = moddle+"%";
            this.progressBar.differencePercentage = diss+"%";
            this.progressBar.goodProgressBar.width = good*350/100+'px';
            this.progressBar.middleProgressBar.width = moddle*350/100+'px';
            this.progressBar.differenceProgressBar.width = diss*350/100+'px';
        },

        forlataTime(time){
            //参数time为从后台取到的毫秒数
            var  dataTime = new Date(time);
            var y = dataTime.getFullYear();    //显示年
            var m = dataTime.getMonth() + 1;    //显示月
                m = m < 10 ? ('0' + m) : m;   
            var d = dataTime.getDate();     //显示日
                d = d < 10 ? ('0' + d) : d;  
            var h = dataTime.getHours();    //显示小时
            var minute = dataTime.getMinutes();     //显示分钟					
                minute = minute < 10 ? ('0' + minute) : minute;  
            var second = dataTime.getSeconds();//显示秒
                second = second < 10 ? ('0' + second) : second; 
            return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;     //返回最终时间y-m-d h-m
        },
        
        getGoodsEval(){//获取商品的评价数据
            var vm = this;
            var user = {
                goodsId:this.goodsId,
            }
            console.log(user)
             this.$getAxios({
                url:'/mall/getGoodsCommentAll',
                method:'get',
                params:user,
            }).then(function(res){
                console.log(res.data)
                console.log('商品评价数据'+res.data.msg);
                if(res.data.code == 20000){
                    console.log(res.data.msg)
                }else if(res.data.code == 10000){
                    var success = res.data.extend.success;
                    if(success.length==0||success==null){

                    }else{
                        vm.wholeList = [ ];
                        vm.goodList = [ ];
                        vm.moddleList = [ ];
                        vm.dissList = [ ];
                        for(var i=0;i<success.length;i++){
                            vm.evaluationList[0].length = success.length;
                            var wholeObj={ 
                                goodsCommentId:success[i].goodsCommentId,
                                goodsId:success[i].goodsId,
                                commentId:success[i].commentId,
                                bigImgUrl:'', 
                                appearCheck:false,
                                leftCheck:false,
                                rightCheck:false,
                                set:'new',
                            }
                            if(success[i].order_detail_comments.length>0){
                                for(var j=0;j<success[i].order_detail_comments.length;j++){
                                    wholeObj.context=success[i].order_detail_comments[j].context//评价内容
                                    wholeObj.stars = success[i].order_detail_comments[j].stars//评星
                                    if(success[i].order_detail_comments[j].addTime!=null){
                                        wholeObj.addTime = vm.forlataTime(success[i].order_detail_comments[j].addTime)
                                    }
                                    
                                    if(success[i].order_detail_comments[j].users !=null&&success[i].order_detail_comments[j].users.userName!=null){
                                        wholeObj.userName = success[i].order_detail_comments[j].users.userName;
                                    }else{
                                        wholeObj.userName = '匿*户';
                                    }
                                    wholeObj.imgList = [ ];
                                    for(var h=0;h<success[i].order_detail_comments[j].order_detail_comment_images.length;h++){
                                        if(success[i].order_detail_comments[j].order_detail_comment_images[h].url !=null){
                                            var whImgObj={
                                                url:success[i].order_detail_comments[j].order_detail_comment_images[h].url
                                            }
                                            wholeObj.imgList.push(whImgObj);
                                        }
                                    }
                                    if(success[i].order_detail_comments[j].stars==3){//好评
                                          var goodObj={ 
                                            goodsCommentId:success[i].goodsCommentId,
                                            goodsId:success[i].goodsId,
                                            commentId:success[i].commentId,
                                            bigImgUrl:'', 
                                            appearCheck:false,
                                            leftCheck:false,
                                            rightCheck:false,
                                            set:'new',
                                        }
                                        goodObj.context=success[i].order_detail_comments[j].context//评价内容
                                        goodObj.stars = success[i].order_detail_comments[j].stars//评星
                                        if(success[i].order_detail_comments[j].users !=null&&success[i].order_detail_comments[j].users.userName!=null){
                                            goodObj.userName = success[i].order_detail_comments[j].users.userName;
                                        }else{
                                            goodObj.userName = '匿*户';
                                        }
                                        goodObj.imgList = [ ];
                                        for(var h=0;h<success[i].order_detail_comments[j].order_detail_comment_images.length;h++){
                                            if(success[i].order_detail_comments[j].order_detail_comment_images[h].url !=null){
                                               var goImgObj={
                                                url:success[i].order_detail_comments[j].order_detail_comment_images[h].url
                                            }
                                            goodObj.imgList.push(goImgObj);
                                            }
                                        }
                                            vm.goodList.push(goodObj);
                                         vm.evaluationList[1].length =  vm.goodList.length;
                                     }
                                     if(success[i].order_detail_comments[j].stars==2){//中评
                                        var moddleObj={ 
                                            goodsCommentId:success[i].goodsCommentId,
                                            goodsId:success[i].goodsId,
                                            commentId:success[i].commentId,
                                            bigImgUrl:'', 
                                            appearCheck:false,
                                            leftCheck:false,
                                            rightCheck:false,
                                            set:'new',
                                        }
                                        moddleObj.context=success[i].order_detail_comments[j].context//评价内容
                                        moddleObj.stars = success[i].order_detail_comments[j].stars//评星
                                        if(success[i].order_detail_comments[j].users !=null&&success[i].order_detail_comments[j].users.userName!=null){
                                            moddleObj.userName = success[i].order_detail_comments[j].users.userName;
                                        }else{
                                            moddleObj.userName = '匿*户';
                                        }
                                        moddleObj.imgList = [ ];
                                        for(var h=0;h<success[i].order_detail_comments[j].order_detail_comment_images.length;h++){
                                             if(success[i].order_detail_comments[j].order_detail_comment_images[h].url !=null){
                                               var moImgObj={
                                                url:success[i].order_detail_comments[j].order_detail_comment_images[h].url
                                            }
                                            moddleObj.imgList.push(moImgObj);
                                            }
                                        }
                                        vm.moddleList.push(moddleObj);
                                        vm.evaluationList[2].length =  vm.moddleList.length;
                                    }
                                    if(success[i].order_detail_comments[j].stars==1){//差评
                                        var dissObj={
                                            goodsCommentId:success[i].goodsCommentId,
                                            goodsId:success[i].goodsId,
                                            commentId:success[i].commentId,
                                            bigImgUrl:'', 
                                            appearCheck:false,
                                            leftCheck:false,
                                            rightCheck:false,
                                            set:'new',
                                        }
                                        dissObj.context=success[i].order_detail_comments[j].context//评价内容
                                        dissObj.stars = success[i].order_detail_comments[j].stars//评星
                                        if(success[i].order_detail_comments[j].users !=null&&success[i].order_detail_comments[j].users.userName!=null){
                                            dissObj.userName = success[i].order_detail_comments[j].users.userName;
                                        }else{
                                            dissObj.userName = '匿*户';
                                        }
                                        dissObj.imgList = [ ];
                                        for(var h=0;h<success[i].order_detail_comments[j].order_detail_comment_images.length;h++){
                                            if(success[i].order_detail_comments[j].order_detail_comment_images[h].url !=null){
                                               var disImgObj={
                                                url:success[i].order_detail_comments[j].order_detail_comment_images[h].url
                                            }
                                            console.log('sss'+disImgObj.url);
                                            dissObj.imgList.push(disImgObj);
                                            }
                                        }
                                        vm.dissList.push(dissObj);
                                        vm.evaluationList[3].length =  vm.dissList.length;
                                    }
                                }
                            }
                            vm.wholeList.push(wholeObj);
                        }
                         vm.percentageEvent();
                    }
                }
            }).catch(function(err){
                console.log(err)
            });	
        },

        overEvent(ev,index,length){//鼠标移入
           // console.log(ev,index,length)
            if(ev==0){
                this.wholeList[index].appearCheck=true;
                if(length==1){

                }else if(length>=2){
                   if(this.wholeList[index].set==0){
                        this.wholeList[index].rightCheck=true;
                    }else if(this.wholeList[index].set==(length-1)){
                        this.wholeList[index].leftCheck=true;
                    }else{
                        this.wholeList[index].rightCheck=true;
                        this.wholeList[index].leftCheck=true;
                    }
                }                
              //  console.log(this.wholeList[index].set)
            }else if(ev==1){
                 this.goodList[index].appearCheck=true;
                if(length==1){

                }else if(length>=2){
                   if(this.goodList[index].set==0){
                        this.goodList[index].rightCheck=true;
                    }else if(this.goodList[index].set==(length-1)){
                        this.goodList[index].leftCheck=true;
                    }else{
                        this.goodList[index].rightCheck=true;
                        this.goodList[index].leftCheck=true;
                    }
                }    
             // console.log(this.goodList[index].set)
            }else if(ev==2){
                this.moddleList[index].appearCheck=true;
                if(length==1){

                }else if(length>=2){
                   if(this.moddleList[index].set==0){
                        this.moddleList[index].rightCheck=true;
                    }else if(this.moddleList[index].set==(length-1)){
                        this.moddleList[index].leftCheck=true;
                    }else{
                        this.moddleList[index].rightCheck=true;
                         this.moddleList[index].leftCheck=true;
                    }
                }    
              // console.log(this.moddleList[index].set)
            }else if(ev==3){
                this.dissList[index].appearCheck=true;
                if(length==1){

                }else if(length>=2){
                   if(this.dissList[index].set==0){
                        this.dissList[index].rightCheck=true;
                    }else if(this.dissList[index].set==(length-1)){
                        this.dissList[index].leftCheck=true;
                    }else{
                        this.dissList[index].rightCheck=true;
                         this.dissList[index].leftCheck=true;
                    }
                }    
                //console.log(this.dissList[index].set)
            }
        },

        enterEvent(ev,index,length){//鼠表离开
           // console.log(ev,index,length);
            if(ev==0){
                this.wholeList[index].appearCheck=true;                                 
                this.wholeList[index].rightCheck=false;
                this.wholeList[index].leftCheck=false;
            }else if(ev==1){
                 this.goodList[index].appearCheck=true;                                 
                this.goodList[index].rightCheck=false;
                this.goodList[index].leftCheck=false;
            }else if(ev==2){
                this.moddleList[index].appearCheck=true;                             
                this.moddleList[index].rightCheck=false;
                this.moddleList[index].leftCheck=false;
            }else if(ev==3){
                this.dissList[index].appearCheck=true;                              
                this.dissList[index].rightCheck=false;
                this.dissList[index].leftCheck=false;
            }
        },

        btnClick(ev,index,sed){//点击切换
            console.log(ev,index,sed)
            if(ev==0){
                this.wholeList[index].appearCheck=true;
                this.wholeList[index].bigImgUrl=this.wholeList[index].imgList[sed].url
                if(this.wholeList[index].set==sed){
                    this.wholeList[index].appearCheck=false;
                    this.wholeList[index].set ='new';
                }else{
                    this.wholeList[index].set=sed
                }
            }else if(ev==1){
                 this.goodList[index].appearCheck=true;
                this.goodList[index].bigImgUrl=this.goodList[index].imgList[sed].url
                if(this.goodList[index].set==sed){
                    this.goodList[index].appearCheck=false;
                    this.goodList[index].set ='new';
                }else{
                    this.goodList[index].set=sed
                }
            }else if(ev==2){
                this.moddleList[index].appearCheck=true;
                this.moddleList[index].bigImgUrl=this.moddleList[index].imgList[sed].url
                if(this.moddleList[index].set==sed){
                    this.moddleList[index].appearCheck=false;
                    this.moddleList[index].set ='new';
                }else{
                    this.moddleList[index].set=sed
                }
            }else if(ev==3){
                 this.dissList[index].appearCheck=true;
                this.dissList[index].bigImgUrl=this.dissList[index].imgList[sed].url
                if(this.dissList[index].set==sed){
                    this.dissList[index].appearCheck=false;
                    this.dissList[index].set ='new';
                }else{
                    this.dissList[index].set=sed
                }
            }
        },

        btnLeft(ev,index,length){//点击切换上一张图片
            if(ev==0){
                console.log('点击前'+this.wholeList[index].set)
                this.wholeList[index].set=this.wholeList[index].set-1
                var all = this.wholeList[index].set;
                this.wholeList[index].bigImgUrl=this.wholeList[index].imgList[all].url                               
                this.wholeList[index].rightCheck=false;
                this.wholeList[index].leftCheck=false;
                if(length>=2){
                   if(this.wholeList[index].set==0){
                        this.wholeList[index].rightCheck=true;
                        this.wholeList[index].set=0
                    }else if(this.wholeList[index].set==(length-1)){
                        this.wholeList[index].leftCheck=true;
                        this.wholeList[index].set = length-1;
                    }else{
                        this.wholeList[index].rightCheck=true;
                        this.wholeList[index].leftCheck=true;
                    }
                }    
                console.log('点击后'+this.wholeList[index].set)  
            }else if(ev==1){
                console.log('点击前'+this.goodList[index].set)
                this.goodList[index].set=this.goodList[index].set-1
                var god = this.goodList[index].set;
                this.goodList[index].bigImgUrl=this.goodList[index].imgList[god].url                               
                this.goodList[index].rightCheck=false;
                this.goodList[index].leftCheck=false;
                if(length>=2){
                   if(this.goodList[index].set==0){
                        this.goodList[index].rightCheck=true;
                        this.goodList[index].set=0
                    }else if(this.goodList[index].set==(length-1)){
                        this.goodList[index].leftCheck=true;
                        this.goodList[index].set = length-1;
                    }else{
                        this.goodList[index].rightCheck=true;
                        this.goodList[index].leftCheck=true;
                    }
                }    
                console.log('点击后'+this.goodList[index].set)  
              
            }else if(ev==2){
                console.log('点击前'+this.moddleList[index].set)
                this.moddleList[index].set=this.moddleList[index].set-1
                var mod = this.moddleList[index].set;
                this.moddleList[index].bigImgUrl=this.moddleList[index].imgList[mod].url                               
                this.moddleList[index].rightCheck=false;
                this.moddleList[index].leftCheck=false;
                if(length>=2){
                   if(this.moddleList[index].set==0){
                        this.moddleList[index].rightCheck=true;
                        this.moddleList[index].set=0
                    }else if(this.moddleList[index].set==(length-1)){
                        this.moddleList[index].leftCheck=true;
                        this.moddleList[index].set = length-1;
                    }else{
                        this.moddleList[index].rightCheck=true;
                        this.moddleList[index].leftCheck=true;
                    }
                }    
                console.log(this.moddleList[index].set)
            }else if(ev==3){
                console.log('点击前'+this.dissList[index].set)
                this.dissList[index].set=this.dissList[index].set-1
                var mod = this.dissList[index].set;
                this.dissList[index].bigImgUrl=this.dissList[index].imgList[mod].url                               
                this.dissList[index].rightCheck=false;
                this.dissList[index].leftCheck=false;
                if(length>=2){
                   if(this.dissList[index].set==0){
                        this.dissList[index].rightCheck=true;
                        this.dissList[index].set=0
                    }else if(this.dissList[index].set==(length-1)){
                        this.dissList[index].leftCheck=true;
                        this.dissList[index].set = length-1;
                    }else{
                        this.dissList[index].rightCheck=true;
                        this.dissList[index].leftCheck=true;
                    }
                }    
                 console.log(this.dissList[index].set)
            }
        },

        btnRight(ev,index,length){//点击切换下一张图片
             if(ev==0){
                 console.log('点击前'+this.wholeList[index].set)
                this.wholeList[index].set=this.wholeList[index].set+1
                var all = this.wholeList[index].set;
                this.wholeList[index].bigImgUrl=this.wholeList[index].imgList[all].url                               
                this.wholeList[index].rightCheck=false;
                this.wholeList[index].leftCheck=false;
                if(length>=2){
                   if(this.wholeList[index].set==0){
                        this.wholeList[index].rightCheck=true;
                        this.wholeList[index].set=0
                    }else if(this.wholeList[index].set==(length-1)){
                        this.wholeList[index].leftCheck=true;
                        this.wholeList[index].set = length-1;
                    }else{
                        this.wholeList[index].rightCheck=true;
                        this.wholeList[index].leftCheck=true;
                    }
                }   
                console.log(this.wholeList[index].set)
            }else if(ev==1){
                console.log('点击前'+this.goodList[index].set)
                this.goodList[index].set=this.goodList[index].set+1
                var god = this.goodList[index].set;
                this.goodList[index].bigImgUrl=this.goodList[index].imgList[god].url                               
                this.goodList[index].rightCheck=false;
                this.goodList[index].leftCheck=false;
                if(length>=2){
                   if(this.goodList[index].set==0){
                        this.goodList[index].rightCheck=true;
                        this.goodList[index].set=0
                    }else if(this.goodList[index].set==(length-1)){
                        this.goodList[index].leftCheck=true;
                        this.goodList[index].set = length-1;
                    }else{
                        this.goodList[index].rightCheck=true;
                        this.goodList[index].leftCheck=true;
                    }
                }    
                console.log('点击后'+this.goodList[index].set) 
            }else if(ev==2){
                console.log('点击前'+this.moddleList[index].set)
                this.moddleList[index].set=this.moddleList[index].set+1
                var mod = this.moddleList[index].set;
                this.moddleList[index].bigImgUrl=this.moddleList[index].imgList[mod].url                               
                this.moddleList[index].rightCheck=false;
                this.moddleList[index].leftCheck=false;
                if(length>=2){
                   if(this.moddleList[index].set==0){
                        this.moddleList[index].rightCheck=true;
                        this.moddleList[index].set=0
                    }else if(this.moddleList[index].set==(length-1)){
                        this.moddleList[index].leftCheck=true;
                        this.moddleList[index].set = length-1;
                    }else{
                        this.moddleList[index].rightCheck=true;
                        this.moddleList[index].leftCheck=true;
                    }
                }    
                console.log('点击后'+this.moddleList[index].set)  
            }else if(ev==3){
                  console.log('点击前'+this.dissList[index].set)
                this.dissList[index].set=this.dissList[index].set+1
                var mod = this.dissList[index].set;
                this.dissList[index].bigImgUrl=this.dissList[index].imgList[mod].url                               
                this.dissList[index].rightCheck=false;
                this.dissList[index].leftCheck=false;
                if(length>=2){
                   if(this.dissList[index].set==0){
                        this.dissList[index].rightCheck=true;
                        this.dissList[index].set=0
                    }else if(this.dissList[index].set==(length-1)){
                        this.dissList[index].leftCheck=true;
                        this.dissList[index].set = length-1;
                    }else{
                        this.dissList[index].rightCheck=true;
                        this.dissList[index].leftCheck=true;
                    }
                }    
                 console.log(this.dissList[index].set)
            }    
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
#evaluation-block{
    width: 100%;
}
.evaluation-rate-display{
    width: 100%;
    height: 120px;
    background: #ffffff;
    overflow: hidden;
}
.evaluation-rate-display  .evaluation-rate{
    width: 270px;
    height: 120px;
    line-height: 120px;
    text-align: center;
    font-size: 48px;
    color: #ff4141;
    font-weight: bold;
}
.evaluation-rate-display  .evaluate{
    width: 450px;
    height: 95px;
    padding-top: 30px;
}
.evaluation-rate-display  .evaluate>div{
    width: 450px;
    height: 25px;
}
.evaluation-rate-display  .evaluate>div .evaluation-name{
    width: 100px;
    height: 25px;
    font-size: 12px;
    color: #666666;
}
.evaluation-rate-display  .evaluate>div .display-bar{
    width: 350px;
    height: 22px;
    padding-top:3px; 
    position: relative;
}
.display-bar .gray-display-bar{
    width: 350px;
    height: 12px;
    background: #efefef;
}
.display-bar .red-display-bar{
    height: 12px;
    background: #ff4141;
    position: absolute;
    left: 0px;
    top: 3px;
    z-index: 2;
}
.evaluation-rate-display .allowable-evaluation{
    width: 240px;
    height: 120px;
    font-size: 14px;
    color: #333;
    line-height: 120px;
    text-align: center;
    cursor: pointer;
}
.evaluation-rate-display .allowable-evaluation span{
    color: #0073fe;
    
}
.evaluation-content{
    width: 100%;
}
.evaluation-content .evaluationUl{
    width: 100%;
    height: 30px;
    border-bottom:1px solid #e6e6e6; 
}
.evaluation-content .evaluationUl li{
    padding: 0px 30px;
    height: 29px;  
    text-align: center;
    font-size: 14px;
    color: #666; 
    cursor: pointer;
}
.evaluation-content .evaluationUl .active{
    border-bottom:2px solid #ff4141; 
    color: #ff4141;
}
.evaluation-content  .evaluation-area{
    width: 964px;
}
.evaluation-content  .evaluation-area ul{
     width: 964px;
}
.evaluation-content  .evaluation-area ul li{
    width: 964px;   
    border-top: 1px dashed #c6c6c6;
}
.evaluation-content  .evaluation-area ul li:nth-of-type(1){
    border-top: none;
}
.evaluation-content  .evaluation-area ul li .evaluation-star-name{
    width: 100%;
    height: 15px;
    padding-top:15px; 
}
 .evaluation-star-name p{
    height: 15px;
    line-height: 15px;
 }
  .evaluation-star-name p i{
      color: #ff4141;
      font-size: 14px;
  }
 .evaluation-star-name p .evaluation-time{
    font-size: 12px;
    color: #999;  
    padding: 0px 15px 0px 20px;
}
.evaluation-star-name p .evaluation-username{      
    font-size: 12px;
    color: #999; 
    padding: 0px 15px 0px 0px;
 }
.evaluation-content  .evaluation-area ul li .evaluation-words{
    width: 85%;
    line-height: 26px;  
    color: #666;
    font-size: 13px; 
    overflow: hidden;
    padding-bottom: 10px;
}
.shrinkage {
   width: 100%;
   overflow: auto;
}
.shrinkage  div{
    padding-right: 10px;
    padding-bottom: 10px;
    float: left;
}
.shrinkage img{
    width: 40px;
    height: 40px;

    cursor: pointer;
}
.big-img{
    width: 100%;
    overflow: auto;
}
.big-img div{
  position: relative;
}
.big-img div img{
    max-width:400px;
    max-height: 400px; 
    padding-bottom: 10px;   
}
.big-img div button{
    width: 10%;
    height: 20%;
    text-align: center;
    font-size: 35px;
    color: #ff0000;
    position: absolute;
    top: 40%;
    cursor: pointer;
    background: rgba(255, 255, 255, 0)
}
.big-img div .active{
    display: block;
}
.big-img div .fa-chevron-left{
    left: 0px；
}
.big-img div .fa-chevron-right{
    right: 0px;
}
</style>
