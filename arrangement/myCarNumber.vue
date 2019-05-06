<template>
    <div class="carnumberdemo">
        <!-- 车牌显示 -->
        <div class="btn-father">
            <button class="btn-complete btn-first" @click="cancelClick"><span>取消</span></button>
            <button class="btn-complete btn-second" @click="completeClick"><span>完成</span></button>
        </div>
        <div style="text-align: center;line-height:1rem;font-size:.45rem;">
            车辆{{usersVehicle.index+1}}的车牌号
        </div>
        <div class="content-car-number">
            <div class="content-section">{{getKeyShow}}
                <div class="content-section-flex flex-card">
                    <div class="content-section-flex flex-card-border">
                        <button :id="'font'+usersVehicle.index" class="flex-btn" @click="btnClickYue" v-bind:class="{isClick: isYue }">{{areaName}}</button>
        　　　　　　　　　<button  :id='"letter"+usersVehicle.index' class="flex-btn" @click="btnClickA" v-bind:class="{isClick: isA}">{{areaLetter}}</button>
                        <div class="flex-mid"><span></span></div>
                        <div class="flex-btns" id="btnFather">
                            <button v-for="(item,index) in carList" :id='item.id+usersVehicle.index' @click="btnClickNum(index)" v-bind:class="{isNumClick: item.isNumCheck }">{{item.numName}}</button>
        　　　　　　　　　　　<button v-if="!checkbox" :id='"numSix"+usersVehicle.index' @click="carTypeChange" v-bind:class="{isNumClick: isNumSix }">
                                <b class="addNew">+</b>
                                <b class="addnewText">新能源</b>    
                            </button>
        　　　　　　　　　　　<button v-else :id='"numSix"+usersVehicle.index' @click="btnClickNum(5)" v-bind:class="{isNumClick: isNumSix }">{{numSix}}</button>
                        </div>
            　　　  </div>
        　　　　</div>
        　　</div>            
        </div>

        <!-- 车牌输入 -->

        <div class="keyboard" v-if="keyboardShow" :class='{animationDown:isDown,animationUp:isUp}'>
            <div v-if="keyboard == 'txt'">
        　　　　<div class="keyboard-row" v-for="(item,rows) in carTxt" :key="rows">
        　　　　　　<button class="keyboard-row-item" v-for="(i,index) in item.name" @click="btnWordClick(rows,index,i)" :key="index">{{i}}</button>
        　　　　</div>
        　　　　<div class="keyboard-row">
        　　　　　　<button class="keyboard-row-item bottom" @click="btnBottomClick('新')">新</button>
        　　　　　　<button class="keyboard-row-item bottom" @click="btnBottomClick('领')">领</button>
        　　　　　　<button v-for="(j,index) in noneBottomtxt" class="none-botton" :key="index">{{j}}</button>
        　　　　　　<div class="keyboard-row-item clear" @click="clearClick">
        　　　　　　　　<img src="../assets/img/personal/icon_input_delete.png" alt="删除">
        　　　　　　</div>
        　　　　</div>
        　　</div>
            <div v-if="keyboard == 'num'">
        　　　　<div class="keyboard-row" v-for="(item,rows) in carNum" :key="rows">
        　　　　　　<button :disabled="!isSelectl?isDisable && i<10 :isDisable&& rows!=0 " class="keyboard-row-item" v-for="(i,index) in item.name" @click="btnWordClick(rows,index,i)" :key="index">{{i}}
        　　　　　　</button>
        　　　　</div>
        　　　　<div class="keyboard-row">
        　　　　　　<button :disabled="isSelectl" v-for="item in carNumBottom" class="keyboard-row-item bottom" @click="btnBottomNumClick(item)">{{item}}</button>
        　　　　　　<button v-for="j in noneBottom" class="none-botton" >{{j}}</button>
        　　　　　　<div class="keyboard-row-item clear" @click="clearClick">
        　　　　　　　　<img src="../assets/img/personal/icon_input_delete.png" alt="删除">
        　　　　　　</div>
        　　　　</div>
        　　</div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['usersVehicle','keyboardUpData'],
    data(){
        return{
            key: '1',//总共有多少位
            areaName:'',//车牌第一个字段  
            areaLetter:'',//车牌第个二字段  
            isYue:false,
            isA:false,
            carList:[//车牌后五位
                {
                    isNumCheck:false,
                    numName:'',//显示的内容
                    id:'numOne'//标记
                },
                {
                    isNumCheck:false,
                    numName:'',//显示的内容
                    id:'numTwo'//标记
                },
                {
                    isNumCheck:false,
                    numName:'',//显示的内容
                    id:'numThree'//标记
                },
                {
                    isNumCheck:false,
                    numName:'',//显示的内容
                    id:'numFour'//标记
                },
                {
                    isNumCheck:false,
                    numName:'',//显示的内容
                    id:'numFive'//标记
                },
            ],
            checkbox: false,
            numSix: '',//新能源最后一位
            isNumSix: false,
            isDown: false,//键盘动画下
    　　　　 isUp: false,//键盘动画上
            keyboardShow:false,//键盘的开关
            keyboard:false,//什么类型的键盘
            isDisable: false,
            selected: null,
            isSelectx: false,
    　　　　 isSelectl: false,
            carTxt: [//车牌地区
    　　　　　　{ name: ['粤', '京', '津', '沪', '渝', '冀', '豫', '云', '辽', '黑'] },
    　　　　　　{ name: ['湘', '皖', '鲁', '琼', '苏', '浙', '赣', '鄂', '桂', '甘'] },
    　　　　　　{ name: ['晋', '蒙', '陕', '吉', '闽', '贵', '青', '藏', '川', '宁'] }
    　　　　 ],
    　　　　 carNumBottom: ['W', 'X', 'Y', 'Z'],
    　　　　 noneBottom: ['', '', '', ''],
    　　　　 noneBottomtxt: ['', '', '', '', '', ''],
    　　　　 carNum: [
    　　　　　　{ name: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'] },
    　　　　　　{ name: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'] },
    　　　　　　{ name: ['L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V'] }
    　　　　 ],
            carnumberdata:{
                carNumberInput:'',//传出去的车辆信息
                isnewcar:false,//是否是新能源
            }
        }
    },
    mounted(){
        let test = /([京津沪渝冀豫云辽黑湘皖鲁苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼新领]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})/;   
    },
    computed:{
        getKeyShow(){
            if(this.keyboardShow==false){
                this.isYue = false;
                this.isA = false;
                this.carList.forEach((item) => {
                    item.isNumCheck = false;
                });
                this.isNumSix = false;
            }
            if(this.usersVehicle.check===true){
                console.log(this.usersVehicle)
                if(this.usersVehicle.name.length>0){
                    this.usersVehicle.check=false
                    let usersVehicleList =this.usersVehicle.name.split('')
                    //console.log(usersVehicleList)
                    this.areaName =usersVehicleList[0];
                    this.areaLetter =usersVehicleList[1];
                    this.carList.forEach((item,index) => {
                        item.numName = usersVehicleList[index+2];
                    });
                    if(usersVehicleList.length>7){
                        this.numSix = usersVehicleList[7];
                        this.checkbox = true;
                　　　　 this.key = 8;
                        this.carnumberdata.isnewcar=true;
                    }else{
                        this.numSix =''
                        this.key = 7;
                        this.checkbox = false;
                        this.carnumberdata.isnewcar=false;
                    }
                }else{
                    this.areaName = '';
                    this.areaLetter = '';
                    this.carList.forEach((item) => {
                        item.numName = '';
                    });
                    this.numSix = '';
                }
                
             }
        }
    },
    watch: { 
        keyboardShow(){
            //console.log(this.keyboardUpData)
            //console.log(this.keyboardShow)
            this.$emit('keyboardUp',this.keyboardShow)
        },
    },
    methods:{
        btnClickYue(){//填写车牌第一个字段方法
            this.isYue = true;
            this.isA = false;
            this.carList.forEach((item) => {
                item.isNumCheck = false;
            });
            this.isNumSix = false;
            this.isUp = true;
            this.keyboardShow= true;
            this.keyboard = 'txt'
            this.key = 1;
            //console.log(this.keyboard)
            //console.log(document.getElementById('btnFather'))
        },

        btnWordClick(rows, index, name){//键盘显示
            this.selected = name;
            //console.log(name)
            if(this.key === 1 ){
                if(this.areaName === '临'){
                    this.areaLetter = '';
                    this.carList.forEach((item) => {
                        item.numName = '';
                    });
                    this.numSix = '';
                }
                this.areaName = name;
                this.isSelectl = false;
                document.getElementById('letter'+this.usersVehicle.index).click()
            }else if(this.key === 2){
                this.areaLetter = name;
                document.getElementById('numOne'+this.usersVehicle.index).click()
            }else if(this.key === 3){
                this.carList[0].numName = name;
                document.getElementById('numTwo'+this.usersVehicle.index).click()
            }else if(this.key === 4){
                this.carList[1].numName = name;
                document.getElementById('numThree'+this.usersVehicle.index).click()
            }else if(this.key === 5){
                this.carList[2].numName = name;
                document.getElementById('numFour'+this.usersVehicle.index).click()
            }else if(this.key === 6){
                this.carList[3].numName = name;
                document.getElementById('numFive'+this.usersVehicle.index).click()
            }else if(this.key === 7){
                this.carList[4].numName = name;
                if(this.checkbox){
                    document.getElementById('numSix'+this.usersVehicle.index).click()
                }
                
            }else if(this.key === 8){
                this.numSix = name;
            }

            if(this.key === 7 || this.key === 8){
                this.carNumBottom = ['W', 'X', 'Y', 'Z', '港', '澳', '学'];
                this.noneBottom = [''];
            }else if(this.key === 3 || this.key === 4 || this.key === 5 || this.key === 6){
                this.carNumBottom = ['W', 'X', 'Y', 'Z'];
                this.noneBottom = ['', '', '', ''];
            }
        },

        btnBottomClick(val){// 车牌第一位选择‘临’,’新‘后的键盘显示
            // this.areaLetter = '';
            // this.carList.forEach((item) => {
            //     item.numName = '';
            // });
            // this.numSix = '';
            this.areaName = val;
            this.isSelectx = true;
            this.isSelectl = false;
            if(val === '新'){
                document.getElementById('letter'+this.usersVehicle.index).click()
            }else if(val === '领'){
                this.isDisable = true;
                document.getElementById('letter'+this.usersVehicle.index).click('isLin')
            }
        },

        btnBottomNumClick(name){ //键盘最后一行字母点击事件
            console.log(name)
            this.selected = name;
            if(this.key === 2){
                this.areaLetter = name;
                document.getElementById('numOne'+this.usersVehicle.index).click()
            }else if(this.key === 3){
                console.log(name)
                this.carList[0].numName = name;
                document.getElementById('numTwo'+this.usersVehicle.index).click()
            }else if(this.key === 4){
                this.carList[1].numName = name;
                document.getElementById('numThree'+this.usersVehicle.index).click()
            }else if(this.key === 5){
                this.carList[2].numName = name;
                document.getElementById('numFour'+this.usersVehicle.index).click()
            }else if(this.key === 6){
                this.carList[3].numName = name;
                document.getElementById('numFive'+this.usersVehicle.index).click()
            }else if(this.key === 7){
                this.carList[4].numName = name;
                if(this.checkbox){
                    document.getElementById('numSix'+this.usersVehicle.index).click()
                }
            }else if(this.key === 8){
                this.numSix = name;
            }
        },

        btnClickA(){//填写车牌第二个字段方法
            this.isYue = false;
            this.isA = true;
            this.carList.forEach((item) => {
                item.isNumCheck = false;
            });
            this.isUp = true;
            this.isNumSix = false;
            this.keyboardShow= true;
            this.keyboard = 'num'
            this.key = 2;
        },
        
        btnClickNum(index){//填写车牌后五位或六位方法
            if(this.isSelectl){
                this.isDisable = true;
            }else{
                this.isDisable = false;
            }
            //console.log(index)
            this.keyboardShow= true;
            this.keyboard = 'num';
            this.isUp = true
            this.isYue = false;
            this.isA = false;
            this.carList.forEach((item) => {
                item.isNumCheck = false;
            });
            this.isNumSix = false;
            if(index===0){
                this.key = 3;
                this.carList[index].isNumCheck = true;
            }else  if(index===1){
                this.key = 4;
                this.carList[index].isNumCheck = true;
            }else  if(index===2){
                this.key = 5;
                this.carList[index].isNumCheck = true;
            }else  if(index===3){
                this.key = 6;
                this.carList[index].isNumCheck = true;
            }else  if(index===4){
                this.key = 7;
                this.carList[index].isNumCheck = true;
            }else if (index == 5){
                this.isNumSix = true;
                this.key = 8; 
            }
            if(this.key === 7 || this.key === 8){
                this.carNumBottom = ['W', 'X', 'Y', 'Z', '港', '澳', '学'];
                this.noneBottom = [''];
            }else if(this.key === 3 || this.key === 4 || this.key === 5 || this.key === 6){
                this.carNumBottom = ['W', 'X', 'Y', 'Z'];
                this.noneBottom = ['', '', '', ''];
            }
            //console.log(this.key)
        },

        carTypeChange(){//是否新能源
            this.checkbox = ! this.checkbox;
            this.carList.forEach((item) => {
                item.isNumCheck = false;
            });
            this.isNumSix = false;
            if(!this.checkbox){
                this.key = 7;
                this.carList[4].isNumCheck = true;
            }else{
                this.isNumSix = true;
                this.key = 8; 
                this.btnClickNum(5)
            }
        },

        cancelClick(){//取消输入
            this.isYue = false;
            this.isA = false;
            this.carList.forEach((item) => {
                item.isNumCheck = false;
            });
            this.isNumSix = false;
            this.isUp = false;
            this.isDown = true;
            this.keyboardShow = false;
            this.usersVehicle.check=true; 
            this.$emit('keyboardUp',this.keyboardShow)
        },

        completeClick(){//输入完成 
            this.isYue = false;
            this.isA = false;
            let carNumberInput=this.areaName+this.areaLetter;
            this.carList.forEach((item) => {
                carNumberInput += item.numName;
                item.isNumCheck = false;
            });
            this.isNumSix = false;
            //console.log(this.key)
            
            if(this.numSix){
                carNumberInput += this.numSix
            }else{

            }
            if(carNumberInput.length==7&&this.numSix==''){
                this.carnumberdata.isnewcar = SVGFEGaussianBlurElement;
            }else if(carNumberInput.length==8){
                this.carnumberdata.isnewcar = true;
            }else{
                this.$Toast('请输入完整的车牌号');
                return;
            }
            //console.log(carNumberInput.length)
            //console.log(this.carnumberdata)
            this.carnumberdata.carNumberInput = carNumberInput;
            this.usersVehicle.name = carNumberInput;  
            this.$emit('carnumberdata',this.carnumberdata)   
            this.isUp = false;
            this.isDown = true;
            this.keyboardShow = false;
            this.$emit('keyboardUp',this.keyboardShow)
        },
        
    　　clearClick(){// 键盘点击‘删除图标’
            console.log('是否是新能源');
            if(this.key===1){
                this.areaName = '';
            }else if(this.key===2){
                this.areaLetter = '';
                document.getElementById('font'+this.usersVehicle.index).click()
            }else if(this.key===3){
                this.carList[0].numName = name;
                document.getElementById('letter'+this.usersVehicle.index).click()
            }else if(this.key===4){
                this.carList[1].numName = name;
                document.getElementById('numOne'+this.usersVehicle.index).click()
            }else if(this.key===5){
                this.carList[2].numName = name;
                document.getElementById('numTwo'+this.usersVehicle.index).click()
            }else if(this.key===6){
                this.carList[3].numName = name;
                document.getElementById('numThree'+this.usersVehicle.index).click()
            }else  if(this.key===7){
                this.carList[4].numName = '';
                document.getElementById('numFour'+this.usersVehicle.index).click()
            }else  if(this.key===8){
                this.numSix = '';
                this.checkbox = !this.checkbox;
                
                document.getElementById('numFive'+this.usersVehicle.index).click()
            }
        },
    }
}
</script>

<style lang="less" scoped>
//车牌输入框
.carnumberdemo{
    button{
        padding: 0 !important;
    }
.content-car-number {
      .car-content-title {
        display: flex;
        justify-content: space-between;
        padding: 0 32px;
        margin-bottom: 16px;
        span {
          font-size: .44rem;
        }
        .ze-checkbox {
          display: flex;
          align-items: center;
        }
        .ze-radio-text {
          font-size: 28px;
        }
        .ze-checkbox-icon {
          color: #FFEDB1 !important;
          margin-right: 8px;
        }
      }
      .content-section {
        .content-section-flex {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: .4rem;
        //   margin-bottom: .2rem;
          .blank-border {
            height: 1rem;
            width: 1px; /*no*/
            border-right: 1px solid #ddd; /*no*/
            margin-top: .2rem;
            float: left;
            z-index: 1;
            &.blank-border-first {
              margin-top: 0px;
            }
          }
          &.flex-card {
            color: #000;
            .addNew{
                color: #999;
            }
            .addnewText{
                font-size:.28rem;
                display:inline-block;
                width:1rem;
                color: #999;
            }
            .flex-btn {
              width: 1.12rem;
              height: 1.2rem;
              border: none;
              text-align: center;
              background: #fff;
              font-size: .44rem;
              color: #000;
              border: 1px solid #ddd;
              border-radius:5px;
              margin-right:.04rem;
              margin-top: -.2rem;
            }
            .flex-btns {
              text-align: center;
              background: #fff;
              width: fit-content;
              position: relative;
              height: 1.4rem;
              button {
                width: 1.12rem;
                height: 1.2rem;
                border: none;
                font-size: .4rem;
                color: #000;
                border: 1px solid #ddd;
                border-radius:5px;
                background: transparent;
                float: left;
                // margin-left: -20px;
                z-index: 2;
                position: relative;
                margin-right:.04rem;
                &:first-child {
                  margin-left: 0;
                }
              }
            }
            .flex-mid {
              margin: 0 0.1rem;
              span {
                display: block;
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background: #ddd;
              }
            }
            .isClick {
              border: 1px solid #1989fa; /*no*/
              z-index: 2;
              border-radius: 5px;
            }
            .isNumClick {
              border-radius: 5px !important;
              border: 1px solid #1989fa !important; /*no*/
              z-index: 10;
              background-color: #fff !important;
            }
          }
          .flex-card-border {
            // border: 1px solid #ddd; /*no*/
            border-radius: 5px;
          }
        }
      }
    }
    .fee-hours {
      padding: 0 32px;
      margin-bottom: 80px;
      .fee-hours-title {
        margin-bottom: 16px;
        font-size: 34px;
      }
      .fee-hours-content {
        display: flex;
        justify-content: space-between;
        margin-bottom: 32px;
        &.fee-hours-num {
          display: block;
        }
      }
      .fee-hours-num {
        width: 152px;
        height: 64px;
        font-size: 28px;
        background: #ececec;
        border-radius: 8px;
        text-align: center;
        line-height: 64px;
      }
      .isFeeHour {
        background: #ffeeb1;
      }
    }
    .searchPay-btn {
      text-align: center;
      /*background-color: #f6f6f6;*/
      margin: 0 32px 0;
      button {
        width: 686px;
        height: 88px;
        color: #ffffff;
        font-size: 32px;
        background: #ececec;
        border: none;
        border-radius: 8px;
        &.searchPay-btn-click {
          box-shadow: 0px 5px 10px 0px rgba(255, 227, 135, 1);
          background: #ffc200;
          color: #101010;
        }
      }
    }
    //键盘
    .btn-father{
        background: #fff;
        overflow: hidden;
        border-bottom: 1px solid #eee;
        .btn-complete {
            height: 1.2rem;
            margin: 0 .5rem;
            text-align: center;
            color: #1989fa;
            font-size:14px;
            background: #fff;
            border: none;
            
        }
        .btn-first{
            float: left;
        }
        .btn-second{
            float: right;
        }
    }
    .keyboard {
        width: 100%;
        height: 6.3rem;
        padding-top: 0.5rem;
        position: fixed;
        bottom: 0rem;
        background: #f3f3f3;
        z-index: 10001;
        left: 0;
        margin-bottom:-0.1rem;
        &.animationDown {
            animation: slide_dowms 0.3s ease-out;
            animation-fill-mode: forwards;
        }
        &.animationUp {
            animation: slide_ups 0.3s ease-out;
            animation-fill-mode: forwards;
        }
       

        .keyboard-row {
            margin-top: 0.5rem;
            display: flex;
            justify-content: space-between;
            // padding: 0 8px;
            color: #333;
            &:first-child {
            margin-top: 0;
            }
            .keyboard-row-items {
            display: flex;
            justify-content: left;
            }
            .keyboard-row-bottom {
            display: flex;
            justify-content: space-between;
            }
            .keyboard-row-item {
            width: 1rem;
            height: 1rem;
            line-height: 1rem;
            background: #fff;
            font-size: .4rem;
            text-align: center;
            border: 1px solid #ccc; /*no*/
            border-radius: 5px;
            color: #333;
            &.bottom {
                width: 1rem;
                height: 1rem;
                background: #fff;
                font-size: 0.4rem;
                text-align: center;
                border: 1px solid #ccc;
                border-radius: 5px;
                color: #333;
            }
            &.clear {
                width: 1rem;
                height: 1rem;
                display: flex;
                align-items: center;
                justify-content: center;
                img {
                width: .8rem;
                }
            }
            }
            .none-botton {
            border: none;
            height: 1rem;
            width: 1rem;
            visibility: hidden;
            }
        }
        button {
            &:active {
            background: #f4f4f4 !important;
            color: #999 !important;
            }
        }
    }

    @keyframes slide_ups {
      from {
        bottom: -502px;
      }
      to {
        bottom: 0px;
      }
    }
    @keyframes slide_dowms {
      from {
        bottom: 0px;
      }
      to {
        bottom: -502px;
      }
    }
}
</style>
