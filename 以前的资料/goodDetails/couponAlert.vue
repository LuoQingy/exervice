<template>
    <div :style='alertStyle'>
		<div :style='alertAll'>
            <div class="receive-coupon-success" >
                <div class="success-first">
                    <i class="fr fa fa-remove" ></i>
                </div>
                <div class="success-second">
                    <div class="fl success-second-left"> <i class="fa fa-check"></i></div>
                    <div class="fl success-second-right">
                        <p class="coupon-use-condition">恭喜，您已成功领取<span></span>优惠卷</p>
                        <p class="coupon-use-time">使用时间：</p>
                        <button  >确定</button>
                    </div>
                </div>
            </div>
        </div>   
    </div>
</template>

<script>
export default {
    data(){
        return{
            alertStyle:{
					'width':document.documentElement.clientWidth+'px',
					'height':document.documentElement.clientHeight+'px',
					'position':'absolute',
					'top':0,
					'left':0,
					'z-index':231,
                    'background':'rgba(241,241,241,0.7)',
                    // 'overflow':'hidden',
				},
				alertAll:{
					'position':'relative',
					'width':'533px',
					'height':'176px',
					'top':window.innerHeight/2 -176/2 +'px',
					'left':window.innerWidth/2 -533/2 +'px',
					'background':'#fff',
					'border':'1px solid #9cb2c1'
				},
        }
    },
    
}
</script>

<style scoped>
body{
    width: 100%;
    height: 100%;
    overflow: hidden;
}
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
.receive-coupon-success{
    width: 533px;
    height: 176px;
    background: #fff;
    border: 1px solid #e4e4e4; 
}
.receive-coupon-success .success-first{
    width: 100%;
    height: 39px;
    line-height: 39px;
    border-bottom:1px solid #e4e4e4; 
}
.receive-coupon-success .success-first i{
    width: 39px;
    height: 39px;
    line-height: 39px;
    text-align: center;
    font-size: 20px;
    color: #a1a1a1;
    cursor: pointer;
}
.receive-coupon-success  .success-second{
    padding-top: 20px;
}
.receive-coupon-success  .success-second .success-second-left{
    width: 72px;
    height: 116px;
    text-align: center;
}
.receive-coupon-success  .success-second .success-second-left i{
    padding: 5px 5px;
    background: #6ec70c;
    color: #fff;
    font-size: 16px;
    border-radius:13px; 
}
.receive-coupon-success  .success-second .success-second-right{
    width: 460px;
    height: 116px;
}
.success-second-right .coupon-use-condition{
    height: 26px;
    color: #333;
    font-size: 14px
}
.success-second-right .coupon-use-condition span{
    color: #FF6666;
}
.success-second-right .coupon-use-time{
    height: 20px;
    line-height: 20px;
    color: #666;
    font-size: 12px;
}
.success-second-right button{
    margin-top:20px;
    line-height: 30px;
    padding: 0px 18px;
    border: 1px solid #e1e1e1; 
    font-size: 12px;
    color: #333;
}
</style>


