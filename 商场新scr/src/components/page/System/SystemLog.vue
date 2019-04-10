<template>
  <div>
    <div>
      <el-breadcrumb separator="/" class="content_title">
        <el-breadcrumb-item>日志管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search_form">
      <el-form ref="form" :model="sizeForm" label-width="80px">
        <div class="first_list">
          <el-form-item label-width="10px">
            <el-select v-model="sizeForm.vip" style="width:100px;">
              <el-option label="全部" value></el-option>
              <el-option label="账号" value="userName"></el-option>
              <el-option label="手机号码" value="phone"></el-option>
              <el-option label="用户ID" value="userId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="10px">
            <el-input v-model="sizeForm.input"></el-input>
          </el-form-item>
          <el-form-item label="角色:" label-width="100px">
            <el-select v-model="MallRole" placeholder="全部" style="width:200px;margin-right:20px">
              <el-option label="全部" value></el-option>
              <template v-for="item in MallRolelist">
                <el-option :label="item.sysRoleName" :value="item.sysRoleCnName"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="操作类型" label-width="75px">
            <el-select v-model="MallType" style="width:100px;margin-right:20px">
              <el-option label="全部" value></el-option>
              <template v-for="item in MallTypelist">
                <el-option :label="item" :value="item"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="操作页面">
            <el-select v-model="MallPage" style="width:100px;margin-right:20px">
              <el-option label="全部" value></el-option>
              <template v-for="item in MallPagelist">
                <el-option :label="item" :value="item"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="时间:" label-width="55px">
            <el-date-picker
              v-model="data"
              @change="timechang"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="——"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label-width="10px">
            <el-button type="primary" @click="searchTap('enter')">查询</el-button>
            <!-- <el-button type="primary">导出excel</el-button> -->
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="table">
      <el-table :data="tableData" border style="width: 100%" :cell-style="center" :header-cell-style="center">
        <el-table-column label="序号" width="55">
          <template slot-scope="scope">{{++scope.$index}}</template>
        </el-table-column>
        <el-table-column prop="operatingTime" label="操作时间" width="180"></el-table-column>
        <el-table-column prop="userName" label="操作人" width="180"></el-table-column>
        <el-table-column prop="role" label="角色"></el-table-column>
        <el-table-column prop="type" label="操作类型"></el-table-column>
        <el-table-column prop="page" label="操作页面"></el-table-column>
        <el-table-column label="操作明细">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="detailsTap(scope.$index)">查看明细</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5,10, 20, 30, 40]"
          :page-size="pageSize"
          background
          layout="total, sizes, prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
    </div>

    <!-- 操作明细 -->
    <el-dialog :visible.sync="dialogFormVisible" width="40%" @close="dialogFormVisible = false">
      <div slot="title" class="dialog-title">操作明细</div>
      <div>
        <div class="operation_details">
          <ul class="lists">
            <li class="list">
              <span>流水号:</span>
              <span class="right">{{detailsData.serialNumber}}</span>
            </li>
            <li class="list">
              <span>操作结果:</span>
              <span class="right">{{detailsData.result?"成功":"失败"}}</span>
            </li>
            <li class="list">
              <span>操作时间:</span>
              <span class="right">{{detailsData.operatingTime}}</span>
            </li>
            <li class="list">
              <span>用户名:</span>
              <span class="right">{{detailsData.userName}}</span>
            </li>
            <li class="list">
              <span>角色:</span>
              <span class="right">{{detailsData.role}}</span>
            </li>
            <li class="list">
              <span>操作类型:</span>
              <span class="right">{{detailsData.type}}</span>
            </li>
          </ul>
          <ul class="lists">
            <li class="list">
              <span>操作耗时:</span>
              <span class="right">{{detailsData.timeConsuming}}秒</span>
            </li>
            <li class="list">
              <span>结束时间:</span>
              <span class="right">{{detailsData.endTime}}</span>
            </li>
            <li class="list">
              <span>用户ID:</span>
              <span class="right">{{detailsData.userId}}</span>
            </li>
            <li class="list">
              <span>IP地址:</span>
              <span class="right">{{detailsData.ip}}</span>
            </li>
            <li class="list">
              <span>操作页面:</span>
              <span class="right">{{detailsData.page}}</span>
            </li>
          </ul>
        </div>
        <div class="textarea">
          <el-form label-width="100px;">
            <el-form-item label="明细:">
              <el-input type="textarea" :readonly="read" :autosize="{ minRows: 3}" v-model="detailsData.detail"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>
  
<script>
export default {
  data() {
    return {
      userName: "",
      MallType: "",
      MallTypelist: [],
      MallPage: "",
      MallPagelist: [],
      MallRole: "",
      MallRolelist: [],
      data: "",
      read: true,
      detailsData: {},
      dialogFormVisible: false,
      sizeForm: {
        input: "",
        vip: ""
      },
      tableData: [],
      currentPage: 1,
      total: 0,
      pageSize: 5
    };
  },
  created() {
    this.logSearch({});
    this.getMallType();
    this.getMallPage();
    this.getMallRole();
  },
  methods: {
    center() {
      return "text-align: center;";
    },
    detailsTap(val) {
      this.dialogFormVisible = true;
      this.detailsData = this.tableData[val];
    },
    // 查询
    searchTap(enter) {
      if (enter) {
        this.currentPage = 1;
      }
      let data = {};
      if (this.sizeForm.vip) {
        //账号 用户id 手机号码
        data[this.sizeForm.vip] = this.sizeForm.input;
      }
      if (this.MallType) {
        //操作类型
        data.type = this.MallType;
      }
      if (this.MallPage) {
        //操作页面
        data.page = this.MallPage;
      }
      if (this.data) {
        //时间
        data.startTime = this.data[0];
        data.endTime = this.data[1];
      }
      if (this.MallRole) {
        //角色
        data.roleName = this.MallRole;
      }
      this.logSearch(data);
    },
    timechang(val) {
      if (val.length > 0) {
        if (val[0] === val[1]) {
          let str = this.data[1].split(" ")[0];
          this.data[1] = [str, "23:59:59"].join(" ");
        }
      }
    },
    // 日志列表
    logSearch(data) {
      this.$httpAuth
        .post("gm/logSearch", {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          ...data
        })
        .then(result => {
          if (result.data.code === 10000) {
            this.tableData = result.data.resp.list;
            this.total = result.data.resp.total;
          }
        })
        .catch(err => {});
    },
    //操作类型
    getMallType() {
      this.$httpAuth
        .post("gm/selectLogType")
        .then(result => {
          if (result.data.code === 10000) {
            this.MallTypelist = result.data.resp;
          }
        })
        .catch(err => {});
    },
    //操作页面
    getMallPage() {
      this.$httpAuth
        .post("gm/selectLogPage")
        .then(result => {
          if (result.data.code === 10000) {
            this.MallPagelist = result.data.resp;
          }
        })
        .catch(err => {});
    },
    // 角色
    getMallRole() {
      this.$httpAuth
        .post("gm/selectLogRole")
        .then(result => {
          if (result.data.code === 10000) {
            this.MallRolelist = result.data.resp;
          }
        })
        .catch(err => {});
    },
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.searchTap();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.searchTap();
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
.table {
  margin-top: 20px;
  background: #ffffff;
  padding: 5px;
  .pagination {
    text-align: right;
    margin: 20px 0 0;
  }
}
.operation_details {
  display: flex;
  .lists {
    flex: 1;
    .list {
      display: flex;
      flex: 1;
      justify-content: space-between;
      line-height: 32px;
      margin-right: 20px;
      .right {
        flex: 1;
        text-align: right;
      }
    }
  }
}
.textarea {
  margin-top: 20px;
}
</style>