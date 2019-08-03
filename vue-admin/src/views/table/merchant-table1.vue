<template>
    <div class="app-container">
        <div class="filter-container">
            商户名称 ：<el-input v-model="searchContent" placeholder="请输入商户名称" style="width: 200px;margin-right:30px;" class="filter-item" @keyup.enter.native='searchData' />
            楼层 ： <el-select v-model="floorId" clearable @change='selectFloor' placeholder="请选择楼层" style='width: 150px;margin-right:30px;'>
                <el-option
                v-for="item in floorList"
                :key="item.floorId"
                :label="item.floorName"
                :value="item.floorId">
                </el-option>
            </el-select>
            商户分类 ： <el-select v-model="firstSortId"  @change="selectFirstClass"  placeholder="一级分类" style='width: 150px;margin-right:10px;'>
                <el-option
                v-for="item in classList"
                :key="item.industryId"
                :label="item.industryName"
                :value="item.industryId">
                </el-option>
            </el-select>
            <el-select v-model="secondSortId" @change="selectSecondClass" :disabled='secondClassList.length>0?false:true'  placeholder="二级分类" style='width: 150px;margin-right:30px;'>
                <el-option
                v-for="item in secondClassList"
                :key="item.industryId"
                :label="item.industryName"
                :value="item.industryId">
                </el-option>
            </el-select>
            <el-button type="primary" icon='el-icon-search' style="margin-left:20px;margin-top:0px; height:40px;" @click="searchData">查询</el-button>
            <el-button type="primary" icon='el-icon-search' style="margin-left:20px;margin-top:0px; height:40px;" @click="searchData">重置条件</el-button>
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
            <el-table-column align="center" label="编号" width="50" >
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

        <div class="block" style="padding:20px 0px;">
            <el-pagination  
            style="float:right;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="merchant.pageNum"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="merchant.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </div>
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
            total:0,//总条数
            searchContent:'',
            style:{
                'text-align':'center'
            },
            floorId:'',
            firstSortId:'',
            secondSortId:'',
            floorList:[],//楼层
            classList:[],//一级分类
            secondClassList:[],//二级分类
            merchant:{
                mallId:"1",
                sortType:1,
                pageNum:1,
                pageSize:10
            }
        }
    },
    created(){
        this.getData();
        this.getFloorData();
    },
    methods: {
        getData(){
            this.listLoading = true
            axios.post('http://twx3.paycore.cc/users/getMerchantList',this.merchant).then(res => {
                //console.log(res)
                this.list = res.data.resp.list;
                this.totalList =  res.data.resp.list;
                this.total = res.data.resp.total;
                this.listLoading = false
            }).catch((err) =>{

            })
        },
        getFloorData(){//获取楼层和分类的数据
            axios.post('http://twx3.paycore.cc/users/getMallFloor',{"mallId":"1"}).then(res => {
                //console.log(res.data)
                this.floorList = res.data.resp;
                this.floorList.unshift({floorName:'全部楼层',floorId:'全部楼层'})
            }).catch((err) =>{

            })
            axios.post('http://twx3.paycore.cc/users/getIndustryAll',{"mallId":"1"}).then(res => {
                //console.log(res.data)
                this.classList = res.data.resp;
                this.classList.unshift({industryName:'全部分类',industryId:'全部分类'})
            }).catch((err) =>{

            })
        },

        searchData(){//筛选
            this.merchant.pageNum = 1;
            this.merchant.pageSize =10;
            this.getData()
        },

        handleSizeChange(val){
            console.log(`每页 ${val} 条`);
            this.merchant.pageSize = val;
            this.getData()
        },

        handleCurrentChange(val){
            console.log(`当前页: ${val}`);
            this.merchant.pageNum = val;
            this.getData()
        },

        selectFloor(val){//选择楼层
            //console.log(this.floorId,'val',val)
            if(this.floorId && this.floorId !='全部楼层'){
                this.merchant.floorId = this.floorId;
            }else{
                delete this.merchant.floorId;
            }
            console.log(this.merchant)
        },

        selectFirstClass(val){//选择一级分类
            console.log(this.firstSortId,'val',val)
            if(this.firstSortId && this.firstSortId !='全部分类'){
                this.merchant.industryId = this.firstSortId;
                this.secondSortId = ''
                this.classList.forEach((item,index) => {
                    if(item.industryId == this.firstSortId){
                        this.secondClassList = item.children;
                        this.secondClassList.unshift({industryName:'全部'+item.industryName,industryId:item.industryId})
                        console.log(this.secondClassList)
                    }
                });
            }else{
                this.secondClassList = [];
                delete this.merchant.industryId;
            }
            console.log(this.merchant)
        },

        selectSecondClass(val){//选择二级分类
            if(this.secondSortId){
                this.merchant.industryId = this.secondSortId;
            }else{
                delete this.merchant.industryId;
            }
        },

        resetEvent(){//重置条件

        }
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
