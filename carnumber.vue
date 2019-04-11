<template>
    <div class="carnumberdemo">
        <!-- 车牌显示 -->
        <div class="content-car-number">
            <div class="content-section">{{getKeyShow}}
                <div class="content-section-flex flex-card">
                    <div class="content-section-flex flex-card-border">
                        <button  class="flex-btn"  v-bind:class="{isClick: isYue }">{{areaName}}</button>
        　　　　　　　　　<button   class="flex-btn"  v-bind:class="{isClick: isA}">{{areaLetter}}</button>
                        <div class="flex-mid"><span></span></div>
                        <div class="flex-btns" id="btnFather">
                            <button v-for="(item,index) in carList"  v-bind:class="{isNumClick: item.isNumCheck }">{{item.numName}}</button>
        　　　　　　　　　　　<button v-if="!checkbox"  v-bind:class="{isNumClick: isNumSix }">
                                <b class="addNew">+</b>
                                <b class="addnewText">新能源</b>    
                            </button>
        　　　　　　　　　　　<button v-else v-bind:class="{isNumClick: isNumSix }">{{numSix}}</button>
                        </div>
            　　　  </div>
        　　　　</div>
        　　</div>            
        </div>
    </div>
</template>

<script>
export default {
    props: ['usersVehicle'],
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

            carnumberdata:{
                carNumberInput:'',//传出去的车辆信息
                isnewcar:false,//是否是新能源
            }
        }
    },
    mounted(){
        let test = /([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})/;   
    },
    computed:{
        getKeyShow(){
            //console.log(this.usersVehicle)
            if(this.usersVehicle.name.length>0){
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
                    this.checkbox = false;
                    this.numSix =''
                    this.key = 7;
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
    },
   
    methods:{
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
              border: 1px solid #ffc200; /*no*/
              z-index: 2;
              border-radius: 5px;
            }
            .isNumClick {
              border-radius: 5px !important;
              border: 1px solid #ffc200 !important; /*no*/
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
    
    .keyboard {
        width: 100%;
        height: 8.2rem;
        position: fixed;
        bottom: 0rem;
        background: #eeeeee;
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
        .btn-father{
            background: #fff;
            overflow: hidden;
            margin-bottom: 30px;
            border-top: 1px solid #eee;
            .btn-complete {
                height: 1.2rem;
                width: 3rem;
                text-align: center;
                color: #ffc200;
                font-size: .44rem;
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

        .keyboard-row {
            margin-top: 20px;
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
