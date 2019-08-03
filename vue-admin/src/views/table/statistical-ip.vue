<template>
    <div class="channel-container">
        <div class="filter-container">
            <el-input v-model="searchContent" placeholder="搜索相关的数据" style="width: 200px;" class="filter-item" @keyup.enter.native='searchData' />
            <el-button type="primary" icon='el-icon-search' style="margin-left:20px;margin-top:0px; height:40px;" @click="searchData">搜索</el-button>
        </div>
        <el-table 
        :data="list"
        border>
            <el-table-column label="省份" prop="province"  align="center" min-width="100px">
       
            </el-table-column>
            <el-table-column label="总IP"  prop="总IP"  align="center">
      
            </el-table-column>
             <el-table-column label="独立IP"  prop="独立IP"   align="center">
      
            </el-table-column>
            <el-table-column label="百分比" prop="百分比"  align="center">
      
            </el-table-column>
            <!-- <el-table-column label="人均访问"  prop="custom" align="center">
                <template slot-scope="scope">
                    <span >{{ scope.row.custom }}</span>
                </template>
            </el-table-column> -->
        </el-table>
        <div class="block" style="padding:10px 0px;">
            <el-pagination  
            style="float:right;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="currentSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalList.length">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import axios from 'axios';//在这里单独引入先
export default {
    data(){
        return{
            list:[],//每一页的数据列表
            totalList:[],//总数据
            subList:[],
            currentPage: 1,//页码
            currentSize:10,//每一页的条数
            searchContent:'',
        }
    },
    created(){
        let obj = {
            "泰国":{"总IP":16,"百分比":"0%","独立IP":14},
            "格鲁吉亚":{"总IP":1,"百分比":"0%","独立IP":1},
            "台湾":{"总IP":69,"百分比":"0.01%","独立IP":47},
            "河南":{"总IP":58136,"百分比":"4.64%","独立IP":35714},
            "湖北":{"总IP":16368,"百分比":"1.31%","独立IP":10476},
            "江西":{"总IP":17581,"百分比":"1.4%","独立IP":11360},
            "新西兰":{"总IP":1,"百分比":"0%","独立IP":1},
            "黑龙江":{"总IP":119907,"百分比":"9.56%","独立IP":59124},
            "天津":{"总IP":23803,"百分比":"1.9%","独立IP":14992},
            "澳门":{"总IP":16,"百分比":"0%","独立IP":12},
            "越南":{"总IP":4,"百分比":"0%","独立IP":3},
            "美国":{"总IP":7,"百分比":"0%","独立IP":7},
            "西藏":{"总IP":348,"百分比":"0.03%","独立IP":255},
            "肯尼亚":{"总IP":1,"百分比":"0%","独立IP":1},
            "吉林":{"总IP":75936,"百分比":"6.06%","独立IP":36763},
            "上海":{"总IP":7395,"百分比":"0.59%","独立IP":5028},
            "山西":{"总IP":143963,"百分比":"11.48%","独立IP":77384},
            "宁夏":{"总IP":3403,"百分比":"0.27%","独立IP":2345},
            "香港":{"总IP":72,"百分比":"0.01%","独立IP":50},
            "韩国":{"总IP":9,"百分比":"0%","独立IP":7},
            "浙江":{"总IP":13037,"百分比":"1.04%","独立IP":8235},
            "英国":{"总IP":1,"百分比":"0%","独立IP":1},
            "匈牙利":{"总IP":2,"百分比":"0%","独立IP":1},
            "山东":{"总IP":87894,"百分比":"7.01%","独立IP":53245},
            "福建":{"总IP":11165,"百分比":"0.89%","独立IP":7054},
            "伊朗":{"总IP":1,"百分比":"0%","独立IP":1},
            "俄罗斯":{"总IP":5,"百分比":"0%","独立IP":4},
            "河北":{"总IP":94823,"百分比":"7.56%","独立IP":51756},
            "重庆":{"总IP":53652,"百分比":"4.28%","独立IP":30049},
            "湖南":{"总IP":21002,"百分比":"1.67%","独立IP":13617},
            "海南":{"总IP":1247,"百分比":"0.1%","独立IP":884},
            "亚太地区":{"总IP":12,"百分比":"0%","独立IP":8},
            "陕西":{"总IP":22399,"百分比":"1.79%","独立IP":13139},
            "贵州":{"总IP":5170,"百分比":"0.41%","独立IP":3512},
            "新疆":{"总IP":7389,"百分比":"0.59%","独立IP":4863},
            "江苏":{"总IP":49529,"百分比":"3.95%","独立IP":30603},
            "共享地址":{"总IP":144,"百分比":"0.01%","独立IP":108},
            "安徽":{"总IP":31269,"百分比":"2.49%","独立IP":19471},
            "甘肃":{"总IP":16127,"百分比":"1.29%","独立IP":10602},
            "四川":{"总IP":100923,"百分比":"8.05%","独立IP":58053},
            "加拿大":{"总IP":4,"百分比":"0%","独立IP":3},
            "广西":{"总IP":43536,"百分比":"3.47%","独立IP":26182},
            "日本":{"总IP":20,"百分比":"0%","独立IP":11},
            "云南":{"总IP":8788,"百分比":"0.7%","独立IP":5775},
            "内蒙古":{"总IP":35714,"百分比":"2.85%","独立IP":18138},
            "马来西亚":{"总IP":1,"百分比":"0%","独立IP":1},
            "辽宁":{"总IP":117800,"百分比":"9.39%","独立IP":63950},
            "广东":{"总IP":43983,"百分比":"3.51%","独立IP":23215},
            "局域网":{"总IP":322,"百分比":"0.03%","独立IP":273},
            "青海":{"总IP":1526,"百分比":"0.12%","独立IP":930},
            "中国":{"总IP":1868,"百分比":"0.15%","独立IP":921},
            "新加坡":{"总IP":29,"百分比":"0%","独立IP":20},
            "澳大利亚":{"总IP":3,"百分比":"0%","独立IP":3},
            "菲律宾":{"总IP":1,"百分比":"0%","独立IP":1},
            "北京":{"总IP":17597,"百分比":"1.4%","独立IP":10375}}
        this.analysisData(obj)
    },
    methods: {
        analysisData(list){
            this.totalList = [];
            if(list instanceof Object){
                for(let key in list){
                    let obj ={
                        province:key,
                    }
                    //console.log(key)
                    if(list[key] instanceof Object){
                        for(let i in list[key]){
                            obj[i] = list[key][i]
                        }
                    }
                    this.totalList.push(obj)
                    let newObj = JSON.parse(JSON.stringify(obj))
                    this.subList.push(newObj);
                }
               
                //console.log((this.currentPage-1)*this.currentSize)
                //console.log(this.totalList)
                this.list = []
                this.totalList.forEach((item,index) => {
                    if(index >= (this.currentPage-1)*this.currentSize && index <(this.currentPage)*this.currentSize){
                        this.list.push(item)
                    }
                    
                });
                //console.log(this.list,this.totalList)
            }
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.list = []
            this.currentSize = val;
            //console.log(this.currentSize)
            this.totalList.forEach((item,index) => {
                if(index >= (this.currentPage-1)*this.currentSize && index <(this.currentPage)*this.currentSize){
                    this.list.push(item)
                }
                
            });
            //console.log(this.list ,this.totalList)
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage = val;
            this.list = []
            this.totalList.forEach((item,index) => {
                if(index >= (this.currentPage-1)*this.currentSize && index <(this.currentPage)*this.currentSize){
                    this.list.push(item)
                }
                
            });
            //console.log(this.list ,this.totalList)
        },
        searchData(){
            let arr = [];
            if(!this.searchContent){
                this.totalList = this.subList;
                this.list = []
                this.totalList.forEach((item,index) => {
                    if(index >= (this.currentPage-1)*this.currentSize && index <(this.currentPage)*this.currentSize){
                        this.list.push(item)
                    }
                    
                });
                return
            }
            this.subList.forEach((item,index) => {
                //console.log(item.province)
                for(let key in item){
                    let text = item[key];
                    text = String(text)
                    if(text.indexOf(this.searchContent)> -1){
                        arr.push(item.province)
                    }
                }
            });
            console.log(arr)
            arr = [...new Set(arr)]
            console.log(arr)
            this.totalList = [];
            this.subList.forEach((item,index) => {
                arr.forEach((val,inx) => {
                    if(item.province == val){
                        this.totalList.push(item)
                    }
                })
            });
            this.list = []
            this.totalList.forEach((item,index) => {
                if(index >= (this.currentPage-1)*this.currentSize && index <(this.currentPage)*this.currentSize){
                    this.list.push(item)
                }
                
            });
        }
    }
}
</script>

<style scoped>
.channel-container {
    padding: 20px;
}
.filter-container {
    line-height: 40px;
    vertical-align: middle;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    display: -webkit-flex;
}

</style>
