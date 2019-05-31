<template>
  <div class="info">
    <div>
      <el-breadcrumb separator="/" class="content_title">
        <el-breadcrumb-item>短信营销</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <ul class="info_list">
      <li class="list">
        <span class="title">发送时间:</span>
        <span>{{infotitle.mpsSendTime}}</span>
      </li>
      <li class="list">
        <span class="title">发送人数:</span>
        <span>{{infotitle.mpsPlanNum}}</span>
      </li>
      <li class="list">
        <span class="title">发送条数:</span>
        <span>{{infotitle.countNum}}</span>
      </li>
      <li class="list">
        <span class="title">模板名称:</span>
        <span>{{infotitle.smsTemplate.stName}}</span>
      </li>
      <li class="list">
        <span class="title">模板类型:</span>
        <span>{{infotitle.smsTemplate.stType|stType}}</span>
      </li>
      <li class="list">
        <span class="title">营销场景:</span>
        <span>暂无</span>
      </li>
    </ul>
    <div class="message">
      <span>短信模板:</span>
      <p>{{infotitle.smsTemplate.stContent}}</p>
    </div>
    <div>
      <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
        <el-form-item prop="region">
          <el-select v-model="ruleForm.status" style="width:120px" @change="selectchang">
            <el-option label="全部" value></el-option>
            <el-option label="成功" :value="1"></el-option>
            <el-option label="失败" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="20px" prop="name">
          <el-input v-model="ruleForm.search" placeholder="搜索手机号码" @keyup.enter.native="searchTap('enter')"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table :data="tableData" style="width: 100%" :header-cell-style="{background:'#f1f3f7'}">
        <el-table-column label="会员信息" prop="users.usersNickName">
          <template slot-scope="scope">
            <div class="user">
              <div class="img">
                <img :src="scope.row.users.usersPortrait" alt>
              </div>
              <div>
                <p>{{scope.row.users.usersName}}</p>
                <p>{{scope.row.users.usersNickName}}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="手机号码" prop="phoneNumber"></el-table-column>
        <el-table-column label="回执状态" prop="errMsg"></el-table-column>
        <el-table-column label="上报时间" prop="sendTime"></el-table-column>
        <el-table-column label="发送状态">
          <template slot-scope="scope">
            <p>{{scope.row.success?'成功':'失败'}}</p>
          </template>
        </el-table-column>
        <el-table-column label="错误码" prop="errCode"></el-table-column>
        <el-table-column label="短信内容" prop="smsContent"></el-table-column>
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
</template>
  
<script>
export default {
  data() {
    return {
      data: [],
      infotitle: {
        smsTemplate: {}
      },
      tableData: [],
      ruleForm: {
        status: "",
        search: ""
      },
      currentPage: 1,
      pageSize: 10,
      total: 0
    };
  },
  created() {
    this.selectByDetail();
    this.searchTap();
  },
  methods: {
    selectByDetail() {
      this.$httpAuth
        .post("mall/selectByDetail", {
          mpsId: this.$route.query.mpId
        })
        .then(result => {
          if (result.data.code === 10000) {
            this.infotitle = result.data.resp;
          }
        })
        .catch(err => {});
    },
    // 下拉触发
    selectchang() {
      this.searchTap('enter');
    },
    //搜索
    searchTap(enter) {
      if(enter){
        this.currentPage = 1;
      }
      this.$httpAuth
        .post("/mall/selectBySendDetailList", {
          mpsId: this.$route.query.mpId, //类型：Number  必有字段  备注：无
          status: this.ruleForm.status, //类型：Mixed  必有字段  备注：无
          search: this.ruleForm.search,
          pageNum: this.currentPage,
          pageSize: this.pageSize
        })
        .then(result => {
          if (result.data.code === 10000) {
            this.tableData = result.data.resp.list;
            this.total = result.data.resp.total;
          } else {
            this.$message({
              message: result.data.msg,
              type: "warning"
            });
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
  },
  filters: {
    stType(val) {
      //类型：Number  必有字段  备注：模板类型：1=普通短信 2=营销短信 3=验证码短信
      let str;
      if (val == 1) {
        str = "普通短信";
      } else if (val == 2) {
        str = "营销短信";
      } else if (val == 3) {
        str = "验证码短信";
      }
      return str;
    }
  }
};
</script>
  
<style scoped lang="less">
.search_form {
  margin: 20px 0;
  .form {
    display: flex;
    flex-wrap: wrap;
  }
}
.info_list {
  display: flex;
  flex-wrap: wrap;
  margin: 0 20px;
  .list {
    width: 33%;
    margin-top: 20px;
    .title {
      margin-right: 10px;
    }
  }
}
.message {
  display: flex;
  margin: 20px 20px 40px;
  margin-top: 20px;
}
.demo-ruleForm {
  display: flex;
}
.user {
  display: flex;
  .img {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    img {
      width: 100%;
    }
  }
}
</style>