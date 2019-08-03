<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input v-model="searchContent" placeholder="搜索相关的数据" style="width: 200px;" class="filter-item" @keyup.enter.native='searchData' />
            <el-button type="primary" icon='el-icon-search' style="margin-left:20px;margin-top:0px; height:40px;" @click="searchData">搜索</el-button>
        </div>
        <el-table
            v-loading='listLoading' 
            :data='list' 
            border 
            element-loading-text="Loading"
            fit
            highlight-current-row
            :header-cell-style='style'
        >
            <el-table-column align="center" label="编号" width="100" >
                <template slot-scope="scope">
                    {{ scope.$index }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="商户序号" width="100" prop="merchantSort">
            </el-table-column>

            <el-table-column align="center" label="商户名称" prop="merchantName">
            </el-table-column>

            <el-table-column align="center" label="logo">
                <template slot-scope="scope">
                    <img :src="scope.row.merchantLogo" style="width:80px;height:80px;" alt="">
                </template>
            </el-table-column >

            <el-table-column align="center" label="手机号" prop='merchantPhone'>
            </el-table-column>

            <el-table-column align="center" label="铺位" prop='merchantBunk'>
            </el-table-column>

            <el-table-column align="center" label="分类" prop='industryName'>
            </el-table-column>

            <el-table-column align="center" label="营业时间" prop='merchantBusinessHours'>
            </el-table-column>

            <el-table-column align="center" label="创建时间" prop='merchantCreateTime'>
            </el-table-column>

            <el-table-column align="center" label="操作" >
                <template>
                    <el-button type="text">店铺详情</el-button>
                </template>
            </el-table-column>

        </el-table>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    data(){
        return{
            list:[],//每一页的数据列表
            totalList:[],//总数据
            subList:[],
            listLoading: true,
            currentPage: 1,//页码
            currentSize:10,//每一页的条数
            searchContent:'',
            style:{
                'text-align':'center'
            }
        }
    },
    created(){
        this.getData();
    },
    methods: {
        getData(){
            this.listLoading = true
            axios.post('http://hopscaapi.paycore.cc/users/getMerchantList',{"mallId":"1","sortType":1,"pageNum":"1","pageSize":"10000"}).then(res => {
                console.log(res)
                this.list = res.data.resp.list;
                this.totalList =  res.data.resp.list;
                this.listLoading = false
            }).catch((err) =>{

            })
        },
        searchData(){
            let arr = [];
            if(!this.searchContent){
                this.list = this.totalList;
                return
            }
            this.totalList.forEach((item,index) => {
                //console.log(item.province)
                for(let key in item){
                    let text = item[key];
                    text = String(text)
                    if(text.indexOf(this.searchContent)> -1){
                        arr.push(item.merchantId)
                    }
                }
            });
            console.log(arr)
            arr = [...new Set(arr)]
            console.log(arr)
            this.list = [];
            this.totalList.forEach((item,index) => {
                arr.forEach((val,inx) => {
                    if(item.merchantId == val){
                        this.list.push(item)
                    }
                })
            });
            console.log(this.totalList)
        },
    }
}
</script>

<style lang="scss" scoped>
.filter-container {
    line-height: 40px;
    vertical-align: middle;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    display: -webkit-flex;
}
</style>
