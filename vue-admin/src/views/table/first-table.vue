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
            <el-table-column align="center" label="序号" width="50" >
                <template slot-scope="scope">
                    {{ scope.$index }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="ID" width="170" prop='id'>
               
            </el-table-column>
            <el-table-column label="标题" prop='title' >

            </el-table-column>
            <el-table-column label="作者" width="100" prop="author" align="center">

            </el-table-column>
            <el-table-column label="页面浏览量" width="100" prop="pageviews" align="center">
                
            </el-table-column>
            <el-table-column class-name="status-col" label="状态类型" width="100" align="center">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="created_at" label="创建时间" width="190">
                <template slot-scope="scope">
                <i class="el-icon-time" />
                <span>{{ scope.row.display_time }}</span>
                </template>
            </el-table-column>
        </el-table>
        
    </div>
</template>

<script>
import { getList } from '@/api/table'
export default {
    filters: {
        statusFilter(status) {
            const statusMap = {
                published: 'success',
                draft: 'gray',
                deleted: 'danger'
            }
            return statusMap[status]
        }
    },
    data(){
        return{
            list:[],
            listLoading: true,
            totalList:[],//总数据
            currentPage: 1,//页码
            currentSize:10,//每一页的条数
            searchContent:'',
            style:{
                'text-align':'center'
            }
        }
    },
    created() {
        this.fetchData()
    },
    methods: {
        fetchData() {
            this.listLoading = true
            getList().then(response => {
                this.list = response.data.items
                this.totalList = response.data.items; 
                this.listLoading = false
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
                        arr.push(item.id)
                    }
                }
            });
            console.log(arr)
            arr = [...new Set(arr)]
            console.log(arr)
            this.list = [];
            this.totalList.forEach((item,index) => {
                arr.forEach((val,inx) => {
                    if(item.id == val){
                        this.list.push(item)
                    }
                })
            });
            console.log(this.totalList)
        }
    }
}
</script>

<style>
.filter-container {
    line-height: 40px;
    vertical-align: middle;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    display: -webkit-flex;
}
</style>
