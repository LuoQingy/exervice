<template>
  <div>
    <div>
      <el-breadcrumb separator="/" class="content_title">
        <el-breadcrumb-item>商城管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search_form">
      <el-form ref="form" class="first_list" :model="sizeForm" label-width="80px">
        <el-form-item label="商品ID:" prop="goodsid">
          <el-input v-model="sizeForm.goodsid" placeholder="输入商品ID"></el-input>
        </el-form-item>
        <el-form-item label="商品名称:" prop="mgName">
          <el-input v-model="sizeForm.mgName" placeholder="输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商户名称:" prop="merchantName">
          <el-input v-model="sizeForm.merchantName" placeholder="输入商户名称"></el-input>
        </el-form-item>
        <el-form-item label="商品状态:" prop="status">
          <el-select v-model="sizeForm.status" style="width:100px;margin-right:20px">
            <el-option label="全部" value></el-option>
            <el-option label="上架" value="3"></el-option>
            <el-option label="下架" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="10px">
          <el-button type="primary" @click="mallGoodsList('enter')">查询</el-button>
          <el-button @click="resetForm('form')">重置条件</el-button>
          <!-- <el-button type="primary">导出excel</el-button> -->
        </el-form-item>
      </el-form>
    </div>
    <div class="searchBtn">
      <div>
        <el-checkbox v-model="allchecked" :indeterminate="indeterminate" @change="allchang">全选</el-checkbox>
        <el-select v-model="page" style="width:100px;margin:0 20px" placeholder="批量选择" @change="pageChang">
          <el-option label="取消" value="0"></el-option>
          <el-option label="当前页" value="1"></el-option>
          <el-option label="所有页" value="2"></el-option>
        </el-select>
        <el-button class="btn" :disabled="btnDisabled" @click="upAndDownGoods(1)" type="primary" size="mini">批量上架</el-button>
        <el-button class="btn" :disabled="btnDisabled" @click="upAndDownGoods(2)" type="primary" size="mini">批量下架</el-button>
      </div>
      <div>
        <el-button icon="el-icon-plus" type="danger" size="mini" @click="detailsTap">发布商品</el-button>
      </div>
    </div>
    <div class="table_box">
      <el-checkbox-group v-model="idList" @change="idListChang">
        <div class="table">
          <el-table :data="GoodsList" border style="width: 100%" :cell-style="center" :header-cell-style="center">
            <el-table-column label="商品ID" prop="mgId">
              <template slot-scope="scope">
                <el-checkbox :label="scope.row.mgId">{{scope.row.mgId}}</el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="商品名称" prop="mgName"></el-table-column>
            <el-table-column label="价格/积分">
              <template slot-scope="scope">
                <p v-if="scope.row.mgGoodsType==1">{{scope.row.mgCurrentPrice}}元</p>
                <p v-else>{{scope.row.mgOriginalCoin}}积分</p>
              </template>
            </el-table-column>
            <el-table-column label="30天销量" prop="mgSales"></el-table-column>
            <el-table-column label="商品状态">
              <template slot-scope="scope">
                <p class="table_details">{{scope.row.mgStatus|status}}</p>
              </template>
            </el-table-column>
            <el-table-column label="上架时间" prop="mgCreateTime"></el-table-column>
            <el-table-column label="修改时间" prop="mgCreateTime"></el-table-column>
            <el-table-column label="所属用户">
              <template slot-scope="scope">
                <p class="table_details">{{scope.row.merchant?scope.row.merchant.merchantName:'商场'}}</p>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-dropdown>
                  <el-button type="text" >
                    更多
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <p @click="detailsTap(scope.row.mgId)">查看</p>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="scope.row.mgStatus ==2">
                      <p @click="upAndDownGoods(1,scope.row.mgId)">上架</p>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="scope.row.mgStatus ==2">
                      <p @click="deleteMallGoods(scope.row.mgId)">删除</p>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="scope.row.mgStatus ==3">
                      <p @click="upAndDownGoods(2,scope.row.mgId)">下架</p>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="pageSize"
              background
              layout="total, sizes, prev, pager, next"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
import {numberTest} from "@/libs/regular.js";
export default {
  data() {
    return {
      GoodsList: [], //商品列表
      currentPage: 1, //当前页数
      pageSize: 10, //当前条数
      total: 0, //总条数
      allchecked: false, //全选
      indeterminate: false,
      btnDisabled: true, //按钮禁用
      idList: [], //选择的id
      page: "", //当前页 还是所有页
      allidList: [], //所有的商品id
      sizeForm: {
        goodsid: "", //商品ID
        mgName: "", //商品名称
        merchantName: "",
        status: "" //选择的状态
      }
    };
  },
  created() {
    this.mallGoodsList();
  },
  methods: {
    center() {
      return "text-align: center;";
    },
    // 获取商品详情
    mallGoodsList(enter) {
      if(enter){
        this.currentPage = 1;
      }
      if(this.sizeForm.goodsid&&!numberTest(this.sizeForm.goodsid)){
          this.$message({
            message: '商品ID请输入整数',
            type: 'warning'
          });
          return;
      }
      this.$httpAuth
        .post("/gm/selectMallGoodsByAudited", {
          mgId: this.sizeForm.goodsid ? this.sizeForm.goodsid : null, //类型：Number  可有字段  备注：商品ID
          mgName: this.sizeForm.mgName ? this.sizeForm.mgName : null, //类型：String  可有字段  备注：商品名称
          merchant: {
            //类型：Object  可有字段  备注：商户信息
            merchantName: this.sizeForm.merchantName
              ? this.sizeForm.merchantName
              : null //类型：String  可有字段  备注：商户名称
          },
          mgStatus: this.sizeForm.status, //类型：Number  可有字段  备注：状态：1=待审核 2=待发布（下架） 3=已发布（上架） 4=已驳回 5=已删除
          pageNum: this.currentPage, //类型：Number  必有字段  备注：无
          pageSize: this.pageSize
        })
        .then(result => {
          if (result.data.code === 10000) {
            this.GoodsList = result.data.resp.list;
            this.allidList = [];
            this.GoodsList.forEach(val => {
              this.allidList.push(val.mgId);
            });
            this.total = result.data.resp.total;
            this.allchecked = false; //全选
            this.indeterminate = false;
            this.btnDisabled = true; //按钮禁用
            this.idList = []; //选择的id
            this.page = ""; //当前页 还是所有页
          }
        })
        .catch(err => {});
    },
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.mallGoodsList('enter');
    },
    // 全选
    allchang(val) {
      this.idList =[];
      if (val) {
        this.page = "1";
        this.idList = [...this.allidList];
        this.btnDisabled = false;
      } else {
        this.page = "";
        this.idList = [];
        this.btnDisabled = true;
      }
    },
    // 选择当前页 所有页
    pageChang(val) {
      this.idList = [];
      if (val && val != 0) {
        this.idList = [...this.allidList];
        this.btnDisabled = false;
        this.allchecked = true;
        if (val == 2) {
          this.$httpAuth
            .post("/gm/selectMallGoodsByAudited", {
              mgId: this.sizeForm.goodsid ? this.sizeForm.goodsid : null,
              mgName: this.sizeForm.mgName ? this.sizeForm.mgName : null,
              merchant: {
                merchantName: this.sizeForm.merchantName
                  ? this.sizeForm.merchantName
                  : null
              },
              mgStatus: this.sizeForm.status,
              pageNum: this.currentPage,
              pageSize: this.total
            })
            .then(result => {
              if (result.data.code === 10000) {
                let arr = [];
                result.data.resp.list.forEach(val => {
                  arr.push(val.mgId);
                });
                this.idList = arr;
              }
            })
            .catch(err => {});
        }
      } else {
        this.idList = [];
        this.btnDisabled = true;
        this.allchecked = false;
      }
    },
    //选择框
    idListChang(val) {
      if (val.length > 0) {
        this.btnDisabled = false;
        if (val.length === this.allidList.length) {
          this.allchecked = true;
          this.page = "1";
          this.indeterminate = false;
        } else {
          this.allchecked = false;
          this.page = "";
          this.indeterminate = true;
        }
      } else {
        this.btnDisabled = true;
        this.allchecked = false;
        this.indeterminate = false;
      }
    },
    //上下架商品
    upAndDownGoods(type, mgid) {
      let goodsIdArray;
      if (mgid || mgid === 0) {
        goodsIdArray = mgid;
      } else {
        goodsIdArray = this.idList.join(",");
      }
      this.$httpAuth
        .post("gm/upAndDownGoods", {
          goodsIdArray,
          type
        })
        .then(res => {
          if (res.data.code === 10000) {
            this.mallGoodsList();
            this.$message({
              type: "success",
              message: res.data.msg
            });
          } else {
            this.$message({
              type: "warning",
              message: res.data.msg
            });
          }
        });
    },
    // 查看详情
    // 商品详情
    detailsTap(id) {
      if (typeof id != "object") {
        this.$router.push({
          name: "goods",
          query: {
            goodsid: id,
            chakan:true
          }
        });
      } else {
        this.$router.push({
          name: "goods"
        });
      }
    },
    // 删除页面
    deleteMallGoods(mgId) {
      this.$confirm("确定删除该吗吗?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$httpAuth
          .post("/gm/deleteMallGoods", {
            mgId
          })
          .then(res => {
            if (res.data.code === 10000) {
              this.mallGoodsList();
              this.$message({
                type: "success",
                message: res.data.resp
              });
            } else {
              this.$message({
                type: "warning",
                message: res.data.msg
              });
            }
          });
      });
    },
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.mallGoodsList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.mallGoodsList();
    }
  },
  filters: {
    status(val) {
      if (val == 2) {
        return "下架";
      } else if (val == 3) {
        return "上架";
      }
    }
  }
};
</script>

<style scoped lang="less">
.search_form {
  margin: 30px 0;
  margin-right: 80px;
}
.search_form .first_list {
  display: flex;
  flex-wrap: wrap;
}
.searchBtn {
  margin: 10px;
  display: flex;
  justify-content: space-between;
  .btn {
    width: 80px;
  }
  .el-icon-download {
    font-weight: bolder;
  }
}
.table {
  .el-icon-info {
    color: #ff9900;
    font-size: 16px;
  }
}
</style>
