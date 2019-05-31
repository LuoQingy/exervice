<template>
    <div class="MaterialPicture">
         <div class="left fl">
             <div class="top"><i class="el-icon-plus"></i>新建分组</div>
             <div class="groupname">
                 <ul>
                     <li>所有图片<span>{{grouplist.tatolnum}}</span></li>
                     <li v-for="(item,index) in grouplist.list" :key="index">{{item.name}}<span>{{item.num}}</span></li>
                 </ul>
             </div>
         </div>
         <div class="right fl">
             <div class="top">
                 <div class="topleft fl">所有图片</div>
                 <div class="topright fr">
                     <el-button type="primary">本地上传</el-button>
                 </div>
             </div>
             <div class="opration">
                 <el-checkbox v-model="checkedall">全选</el-checkbox>
                 <span>删除</span>
             </div>
             <div class="imglist">
                 <ul>
                     <li>
                        <div class="topli">
                            <img src="https://wx.qlogo.cn/mmopen/vi_32/eu7bwyDiasbBbnQRu8D9vCKr55EkYQHNoh9epKqwUESQzzMoBsGhOv1TWrG47AmPP33iboHTTWQL6FWmkrNy06VQ/132" alt="">
                        </div>
                        <div class="bottomli">
                            <el-checkbox v-model="checkedall">123</el-checkbox> 
                        </div>
                        <div class="delatebg"><i class="el-icon-delete"></i></div>
                     </li>
                 </ul>
                 
             </div>
             <div class="footer block">
                <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage4"
                :page-sizes="[100, 200, 300, 400]"
                :page-size="100"
                layout="total, sizes, prev, pager, next, jumper"
                :total="400">
                </el-pagination>
            </div>
         </div>
         
    </div>
</template>
<script>
export default {
    data(){
        return{
            grouplist:{
                tatolnum:23234,
                list:[
                {name:'好图',num:123},
                {name:'中图',num:123},
                {name:'坏图',num:123},
                ]
            },
            checkedall:false,//全选复选框
            currentPage4: 4
        }
    },
    methods:{
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      }
    }
}
</script>
<style lang="less" scoped>
.MaterialPicture{
    width: 1100px;
    height: 620px;
    background: #fff;
    .fl{
        float: left;
    }
    .fr{
        float: right;
    }
    .left{
        width: 200px;
        height: 600px;
        border: 1px solid #ddd;
        margin-left: 40px;
        .top{
            width: 190px;
            height: 30px;
            line-height: 30px;
            color: #409EFF;
            border-bottom: 1px solid #ddd;
            padding-left:10px; 
            font-size: 14px;
        }
        .groupname{
            ul{
                li:nth-child(1){
                    background: #f2f2f2;
                }
                li{
                  width: 190px;
                  height: 30px; 
                  line-height: 30px;
                  padding-left:10px; 
                  font-size: 14px;
                  span{
                      color: #999;
                  }
                }
                li:hover{
                    background: #f2f2f2;
                }
            }
        }
    }
    .right{
        width: 800px;
        height: 600px;
        border: 1px solid #ddd;
        margin-left: 20px;
        position: relative;
        .top{
           width: 780px;
           height: 50px;
           line-height: 50px;
           padding: 0 10px; 
        }
        .opration{
            width: 780px;
           height: 50px;
           line-height: 50px;
           background: #f2f2f2;
           padding-left: 20px;
           span{
               color:#409EFF;
               margin-left: 20px;
           }
        }
        .imglist{
           
            ul{
                padding: 20px;
               
                li{
                    border: 1px solid #ddd;
                    width: 180px;
                    height: 200px;
                    position: relative;
                    .delatebg{
                        display: none;
                    }
                    .topli{
                        width: 180px;
                        height: 160px;
                        text-align: center;
                        img{
                            width: 180px;
                            height: 160px;
                        }
                    }
                    .bottomli{
                        background: #fff;
                        width: 170px;
                        height: 40px;
                        line-height: 40px;
                        padding-left: 10px;
                    }
                }
                 li:hover{
                    border: 1px solid #409EFF;
                    .delatebg{
                        width: 180px;
                        height: 20px;
                        line-height: 20px;
                        background: rgba(0,0,0,.5);
                        position: absolute;
                        left: 0;
                        bottom: 40px;
                        text-align: right;
                        
                        display: block;
                        i{
                            color: #fff;
                            margin-right: 10px;
                        }
                    }
                }
            }
        }
        .footer{
            position: absolute;
            right: 20px;
            bottom: 20px;
        }
    }
}
</style>

