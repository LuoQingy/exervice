<template>
  <div>
    <div>
      <el-breadcrumb separator="/" class="content_title">
        <el-breadcrumb-item>物业报修</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="info">
      <div class="checklist">
        <el-radio-group v-model="radio" @change="radiochang">
          <el-radio-button label="物业报修"></el-radio-button>
          <el-radio-button label="营业额上报"></el-radio-button>
        </el-radio-group>
      </div>
      <ul class="info_list">
        <li class="list">
          <span class="number">{{info.untreated}}</span>
          <span>未处理</span>
        </li>
        <li class="list">
          <span class="number">{{info.acccepted}}</span>
          <span>已受理</span>
        </li>
        <li class="list">
          <span class="number">{{info.resolved}}</span>
          <span>已处理</span>
        </li>
        <li class="list">
          <span class="number">{{info.good}}</span>
          <span>累积好评用户</span>
        </li>
        <li class="list">
          <span class="number">{{info.goodRate}}%</span>
          <span>好评占比</span>
        </li>
      </ul>
      <div class="search">
        <el-form ref="form" class="form" :model="sizeForm" label-width="80px">
          <el-form-item label="申请时间:" prop="data">
            <el-date-picker
              v-model="sizeForm.data"
              value-format="yyyy-MM-dd"
              :default-time='["00:00:00","23:59:59"]'
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="dataChang"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="受理状态:" prop="repairsStatus">
            <el-select v-model="sizeForm.repairsStatus" style="width:150px;">
              <el-option v-for="item in options2" :key="item.type" :label="item.label" :value="item.type"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申请商户:" prop="merchantName">
            <el-input v-model="sizeForm.merchantName" placeholder="默认搜索所有商户" style="width:150px;"></el-input>
          </el-form-item>
          <el-form-item label="报修单号:" prop="repairsNumber">
            <el-input v-model="sizeForm.repairsNumber" placeholder="默认搜索所有单号" style="width:150px;"></el-input>
          </el-form-item>
          <el-form-item label="受理人:" prop="adminName">
            <el-input v-model="sizeForm.adminName" placeholder="默认搜索所有受理人" style="width:150px;"></el-input>
          </el-form-item>
          <el-form-item label-width="10px">
            <el-button type="primary" icon="el-icon-search" @click="searchTap">搜索</el-button>
            <el-button type="primary" @click="resetForm('form')">重置条件</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table">
        <div class="btn">
          <el-button type="primary" @click="edit">编辑报修项目</el-button>
        </div>
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          :cell-style="{'text-align':'center'}"
          :header-cell-style="{'text-align':'center'}"
        >
          <el-table-column label="序号" prop="rpId" width="100"></el-table-column>
          <el-table-column label="报修单号" prop="repairsNumber"></el-table-column>
          <el-table-column label="报修项目" prop="repairsProject.rpRepairsProject"></el-table-column>
          <el-table-column label="申请时间" prop="repairsCreateTime"></el-table-column>
          <el-table-column label="联系方式" prop="repairsContactWay"></el-table-column>
          <el-table-column label="申请商户">
            <template slot-scope="scope">
              <p v-if="scope.row.merchant">{{scope.row.merchant.merchantName}}</p>
            </template>
          </el-table-column>
          <el-table-column label="受理状态">
            <template slot-scope="scope">
              <p class="table_details">{{scope.row.repairsStatus|status}}</p>
            </template>
          </el-table-column>
          <el-table-column label="维修人">
            <template slot-scope="scope">
              <p v-if="scope.row.admin">{{scope.row.admin.adminName}}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-dropdown placement="bottom">
                <el-button type="text">更多</el-button>
                <el-dropdown-menu slot="dropdown">
                  <span @click="detailsTap(scope.row.repairsId)">
                    <el-dropdown-item>详情</el-dropdown-item>
                  </span>
                  <span @click="assign(scope.row.repairsId)">
                    <el-dropdown-item v-if="scope.row.repairsStatus===1">指定维修人</el-dropdown-item>
                  </span>
                  <span @click="reject(scope.row.repairsId)">
                    <el-dropdown-item v-if="scope.row.repairsStatus===1">拒绝受理</el-dropdown-item>
                  </span>
                  <span @click="delPage(scope.row.repairsId)">
                    <el-dropdown-item v-if="scope.row.repairsStatus===3">删除</el-dropdown-item>
                  </span>
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
    </div>
    <admindialog :Visible="Visible" :repairsId="repairsId" @close="close"></admindialog>
  </div>
</template>

<script>
import admindialog from "./admindialog";
var _this;
export default {
  components: {
    admindialog
  },
  data() {
    _this = this;
    return {
      radio: "物业报修",
      sizeForm: {
        repairsStatus: " ",
        data: [],
        adminName: "",
        merchantName: "",
        repairsNumber: ""
      },
      Visible: false,
      repairsId: 0,
      options2: [
        {
          label: "全部",
          type: " "
        },
        {
          label: "未处理",
          type: "1"
        },
        {
          label: "已受理",
          type: "2"
        },
        {
          label: "已处理",
          type: "3"
        },
        {
          label: "拒绝受理",
          type: "4"
        }
      ],
      value1: "",
      tableData: [],
      info: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    };
  },
  created() {
    this.getRepairsList();
    this.getRepairsStatistics();
  },
  methods: {
    radiochang(val) {
      if (val === "物业报修") {
        return;
      } else if(val==='营业额上报'){
        this.$router.push('/merchant/turnoverlist');
      }
    },
    dataChang(val){
        if(val&&val.length>0){
          if(val[0]===val[1]){
            this.$message({
              message: '开始日期不能和结束日期相同',
              type: 'warning'
            });
            this.sizeForm.data = [];
          }
        }
    },
    // 获取报修列表
    getRepairsList() {
      this.$httpAuth
        .post("gm/getRepairsList", {
          requestStartTime: this.sizeForm.data[0]
            ? this.sizeForm.data[0]
            : null, //类型：Mixed  必有字段  备注：申请开始时间
          requestEndTime: this.sizeForm.data[1] ? this.sizeForm.data[1] : null, //类型：Mixed  必有字段  备注：申请结束时间
          repairsStatus: this.sizeForm.repairsStatus
            ? this.sizeForm.repairsStatus
            : null, //类型：Mixed  必有字段  备注：0=取消申请 / 1=未受理 / 2=已受理 / 3=已处理 / 4=拒绝
          adminName: this.sizeForm.adminName ? this.sizeForm.adminName : null, //类型：Mixed  必有字段  备注：受理人名称
          repairsNumber: this.sizeForm.repairsNumber
            ? this.sizeForm.repairsNumber
            : null, //类型：Mixed  必有字段  备注：报修单号
          merchantName: this.sizeForm.merchantName
            ? this.sizeForm.merchantName
            : null, //类型：Mixed  必有字段  备注：商户名称
          pageNum: this.currentPage, //类型：Number  必有字段  备注：无
          pageSize: this.pageSize
        })
        .then(result => {
          if (result.data.code === 10000) {
            this.tableData = result.data.resp.list;
            this.total = result.data.resp.total;
          }else{
            this.$message({
              message: result.data.msg,
              type: 'warning'
            });
          }
        })
        .catch(err => {});
    },
    // 统计数据
    getRepairsStatistics() {
      this.$xwhttpAuth
        .post("mall/getRepairsStatistics")
        .then(result => {
          if (result.data.code === 10000) {
            this.info = result.data.resp;
          }
        })
        .catch(err => {});
    },
    //搜索
    searchTap() {
      this.currentPage = 1;
      this.getRepairsList();
    },
    // 重置条件
    resetForm(formName) {
      this.currentPage = 1;
      this.$refs[formName].resetFields();
      this.getRepairsList();
    },
    // 查看详情
    detailsTap(repairsId) {
      this.$router.push({
        name: "repairdetails",
        query: {
          repairsId
        }
      });
    },
    // 指派受理人
    assign(repairsId) {
      this.repairsId = repairsId;
      this.Visible = true;
    },
    // 拒绝受理
    reject(repairsId) {
      this.$httpAuth
        .post("/mall/reject", {
          repairsId: repairsId //类型：Number  必有字段  备注：id
        })
        .then(result => {
          if (result.data.code === 10000) {
            this.$message({
              message: "已拒绝受理",
              type: "success"
            });
            this.getRepairsList();
            this.getRepairsStatistics();
          } else {
            this.$message({
              message: result.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    //删除
    delPage(repairsId) {
      this.$confirm("确定删除该报修单吗?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$httpAuth
          .post("/gm/deleteRepairs", {
            repairsId: repairsId //类型：Number  必有字段  备注：id
          })
          .then(result => {
            if (result.data.code === 10000) {
              this.$message({
                message: "已删除报修改单",
                type: "success"
              });
              this.getRepairsList();
              this.getRepairsStatistics();
            } else {
              this.$message({
                message: result.data.msg,
                type: "warning"
              });
            }
          })
          .catch(err => {});
      });
    },
    // 新增项目
    edit() {
      this.$router.push({
        name: "editingproject"
      });
    },
    // 关闭dialog
    close() {
      this.Visible = false;
      this.getRepairsList();
      this.getRepairsStatistics();
    },
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getRepairsList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getRepairsList();
    }
  },
  filters: {
    status(val) {
      if (val) {
        let status;
        _this.options2.forEach(value => {
          if (value.type == val) {
            status = value.label;
          }
        });
        return status;
      }
    }
  }
};
</script>

<style scoped lang="less">
.info {
  padding: 10px;
  .checklist {
    margin-top: 20px;
    margin-bottom: 10px;
  }
  .info_list {
    display: flex;
    font-size: 14px;
    .list {
      border: 1px solid #efefef;
      border-radius: 4px;
      height: 70px;
      width: 19%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      box-sizing: border-box;
      margin-right: 10px;
    }
    .number {
      font-size: 22px;
      font-weight: bold;
    }
  }
  .search {
    padding: 20px 20px 10px;
    background: #f2f2f2;
    margin-top: 10px;
    .form {
      display: flex;
      flex-wrap: wrap;
    }
  }
  .table {
    margin-top: 20px;
    .btn {
      padding: 10px;
      text-align: right;
    }
  }
}
</style>
