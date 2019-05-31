<template>
  <div>
    <div>
      <el-breadcrumb separator="/" class="content_title">
        <el-breadcrumb-item :to="{ path: '/member/management' }">会员管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/member/lists' }">会员列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search_form">
      <el-form ref="reform" :model="sizeForm" label-width="80px">
        <div class="first_list">
          <el-form-item label="手机号:" prop="usersPhoneNumber">
            <el-input v-model="sizeForm.usersPhoneNumber"></el-input>
          </el-form-item>
          <el-form-item label="会员id:" prop="usersId">
            <el-input v-model="sizeForm.usersId"></el-input>
          </el-form-item>
          <el-form-item label="会员昵称:" prop="usersNickName">
            <el-input v-model="sizeForm.usersNickName"></el-input>
          </el-form-item>
          <el-form-item label="卡号:" prop="usersMemberCardNum">
            <el-input v-model="sizeForm.usersMemberCardNum"></el-input>
          </el-form-item>
          <el-form-item label="会员等级:" prop="memberGradeId">
            <el-select v-model="sizeForm.memberGradeId" placeholder="请选择会员等级">
              <el-option label="全部" value=" "></el-option>
              <el-option v-for="(item,index) in grade" :key="index" :label="item.umgName" :value="item.umgId"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="first_list">
          <el-form-item label="注册时间:" prop="data">
            <el-date-picker
              @change="timechang"
              v-model="sizeForm.data"
              value-format="timestamp"
              type="datetimerange"
              range-separator="——"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label-width="10px">
            <el-button type="primary" @click="checkTap">查询</el-button>
            <el-button type="primary" @click="reset">重置条件</el-button>
            <!-- <el-button type="primary">导出excel</el-button> -->
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="function_lists">
      <el-checkbox v-model="checked" @change="allcheckTap"></el-checkbox>
      <el-select v-model="page" style="width: 100px">
        <el-option label="当前页" value="1"></el-option>
        <el-option label="所有页面" value="2"></el-option>
      </el-select>
      <el-button type="primary" :disabled="!checked&&selectlist.length<=0" @click="showdialog('dialogFormVisible')">添加积分</el-button>
      <el-button type="primary" :disabled="!checked&&selectlist.length<=0" @click="showtab('tabFormVisible')">添加标签</el-button>
      <span style="font-size: 14px;">
        会员共
        <span style="color:#ffce84;">{{total}}</span>人
      </span>
    </div>
    <div class="table">
      <el-table
        :data="tableData"
        ref="menbertable"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @select-all="selectall"
        :cell-style="center"
        :header-cell-style="center"
      >
        <el-table-column type="selection" width="30"></el-table-column>
        <el-table-column prop="usersId" label="ID" width="80"></el-table-column>
        <el-table-column label="微信头像" width="100">
          <template slot-scope="scope">
            <img class="user_img" :src="scope.row.usersPortrait" alt>
          </template>
        </el-table-column>
        <el-table-column label="昵称/卡号">
          <template slot-scope="scope">
            <p class="table_details">{{scope.row.usersNickName}}</p>
            <p class="table_details">{{scope.row.usersMemberCardList[0].umcNum}}</p>
          </template>
        </el-table-column>
        <el-table-column label="姓名/电话">
          <template slot-scope="scope">
            <p class="table_details">{{scope.row.usersName}}</p>
            <p class="table_details">{{scope.row.usersPhoneNumber}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="usersMemberCardList[0].usersMemberGrade.umgName" label="等级" width="80"></el-table-column>
        <el-table-column label="积分" width="80">
          <template slot-scope="scope">
            <p>{{scope.row.usersMemberCardList[0].umcUsableCoin|fixed}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="usersFirstPlace" label="领取渠道"></el-table-column>
        <el-table-column label="状态" width="50">
          <template slot-scope="scope">
            <p class="table_details">{{ scope.row.usersStatus| status}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="usersActivateTime" label="开卡时间"></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-popover placement="top" width="287" v-model="scope.row.visible">
              <div style="text-align: right; margin: 0">
                <el-button type="primary" size="mini" @click="detailsTap(scope.row.usersId)">会员画像</el-button>
                <el-button type="primary" size="mini" @click="showdialog('dialogFormVisible',scope.row.usersId,scope.row.usersName)">积分变更</el-button>
                <el-button type="primary" size="mini" @click="showtab('tabFormVisible',scope.row.usersId,scope.row.usersName)">标签变更</el-button>
                <!-- <el-button type="primary" size="mini" @click="scope.row.visible = false;">余额退款</el-button> -->
              </div>
              <el-button type="primary" slot="reference" size="mini">查看更多</el-button>
            </el-popover>
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
    <!-- 积分变更 -->
    <update-coin
      :dialogFormVisible="dialogFormVisible"
      :selectlist="selectlist"
      :usersSearchParams="usersSearchParams"
      :page="page"
      :total="total"
      @updateUsersCoin="getmenberlist"
      @closedialogForm="dialogFormVisible =false"
    ></update-coin>
    <!-- 标签 -->
    <update-tag
      :tabFormVisible="tabFormVisible"
      :selectlist="selectlist"
      :usersSearchParams="usersSearchParams"
      :page="page"
      :total="total"
      :usersName="usersName"
      @updateUsersTag="getmenberlist"
      :updateUsers="updateUsers"
      @closedialogForm="tabFormVisible =false"
      @delusers="updateUsers=''"
    ></update-tag>
  </div>
</template>
  
<script>
import updateCoin from "./updateUsersCoin";
import updateTag from "./UpdateUsersTag";
export default {
  components: {
    updateCoin,
    updateTag
  },
  data() {
    return {
      checked: "",
      page: "1",
      currentPage: 1,
      pageSize: 10,
      total: 0,
      visible: false,
      usersName: "",
      grade: "",
      selectlist: [],
      usersSearchParams: {},
      dialogFormVisible: false,
      tabFormVisible: false,
      TagList: [],
      utagIdArray: [],
      updateUsers: "",
      sizeForm: {
        //搜索条件
        mallId: 1, //类型：Number  必有字段  备注：商场id
        usersPhoneNumber: "", //类型：Mixed  可有字段  备注：电话号码
        usersId: "", //类型：Number  可有字段  备注：用户id
        usersNickName: "", //类型：Mixed  可有字段  备注：昵称
        usersMemberCardNum: "", //类型：Mixed  可有字段  备注：会员卡号
        memberGradeId: "", //类型：Mixed  可有字段  备注：会员等级
        data: ""
      },
      tableData: []
    };
  },
  created() {
    this.getmenberlist();
    this.getMemberGradeAll();
  },
  methods: {
    center() {
      return "text-align: center;";
    },
    // 显示修改积分弹框
    showdialog(val, id, usersName) {
      this[val] = true;
      if (id) {
        this.selectlist = [id];
        this.usersName = usersName;
      } else if (this.checked) {
        let arr = [];
        this.tableData.forEach(val => {
          arr.push(val.usersId);
        });
        this.selectlist = arr;
      }
    },
    // 显示修改标签弹框
    showtab(val, id, usersName) {
      this[val] = true;
      if (id) {
        this.updateUsers = id;
        this.selectlist = [id];
        this.usersName = usersName;
      } else if (this.checked) {
        let arr = [];
        this.tableData.forEach(val => {
          arr.push(val.usersId);
        });
        this.selectlist = arr;
      }
    },
    timechang(val) {
      if (val && val[0] === val[1]) {
        this.$message({
          message: "开始日期和结束日期不能相同",
          type: "warning"
        });
        this.sizeForm.data = "";
      }
    },
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getmenberlist();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getmenberlist();
    },
    // 点击查看详情
    detailsTap(userid) {
      this.$router.push({
        name: "memberDetails",
        query: { userid }
      });
    },
    // 查询
    checkTap() {
      this.currentPage = 1;
      let data = {
        pageNum: this.currentPage,
        pageSize: this.pageSize
      };
      if (this.sizeForm.usersPhoneNumber) {
        data.usersPhoneNumber = this.sizeForm.usersPhoneNumber;
      }
      if (this.sizeForm.usersId) {
        data.usersId = this.sizeForm.usersId;
      }
      if (this.sizeForm.usersNickName) {
        data.usersNickName = this.sizeForm.usersNickName;
      }
      if (this.sizeForm.usersMemberCardNum) {
        data.usersMemberCardNum = this.sizeForm.usersMemberCardNum;
      }
      if (this.sizeForm.memberGradeId) {
        data.memberGradeId = this.sizeForm.memberGradeId;
      }
      if (this.sizeForm.data) {
        data.registerStartTime = this.sizeForm.data[0];
        data.registerEndTime = this.sizeForm.data[1];
      }
      this.usersSearchParams = data;
      this.getmenberlist(data);
    },
    reset() {
      this.currentPage = 1;
      this.$refs.reform.resetFields();
      this.getmenberlist();
    },
    // 表格多选触发
    handleSelectionChange(val) {
      let arr = [];
      val.forEach(value => {
        arr.push(value.usersId);
      });
      this.selectlist = arr;
      if (val.length === this.tableData.length && this.tableData.length != 0) {
        this.checked = true;
      } else {
        this.checked = false;
      }
    },
    // 当前页 所有页选择框
    allcheckTap(val) {
      this.$refs.menbertable.toggleAllSelection();
    },
    // 表格的全选按钮
    selectall(val) {
      if (val.length === this.tableData.length && this.tableData.length != 0) {
        this.checked = true;
      } else {
        this.checked = false;
      }
    },
    // 获取会员列表
    getmenberlist(data) {
      let info = data
        ? data
        : { pageNum: this.currentPage, pageSize: this.pageSize };
      this.$httpAuth
        .post("mall/getUsersList", info)
        .then(result => {
          if (result.data.code === 10000) {
            this.tableData = result.data.resp.list;
            this.tableData.forEach(val => {
              val.visible = false;
            });
            this.total = result.data.resp.total;
          } else {
            this.$message({
              message: result.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "找不到符合搜索的条件的数据",
            type: "warning"
          });
        });
    },
    // 获取会员等级
    getMemberGradeAll() {
      this.$httpAuth
        .post("gm/getMemberGradeAll", {
          mallId: 1,
          pageNum: null, //类型：String  必有字段  备注：无
          pageSize: null
        })
        .then(result => {
          console.log(result);
          this.grade = result.data.resp;
        })
        .catch(err => {});
    }
  },
  filters: {
    status(val) {
      if (val === 1) {
        return "正常";
      } else if (val === 2) {
        return "冻结";
      } else {
        return "异常";
      }
    },
    fixed(val) {
      if (val) {
        return val.toFixed(0);
      } else {
        return 0;
      }
    }
  }
};
</script>
  
<style scoped lang="less">
.search_form {
  margin: 15px 0;
}
.search_form .first_list {
  display: flex;
}
.line {
  color: #ccc;
  font-weight: 600;
  width: 50px;
  text-align: center;
}
.table {
  margin-top: 20px;
  background: #ffffff;
  padding: 5px;
  padding-bottom: 30px;
  .pagination {
    text-align: right;
    margin: 20px 0 0;
  }
  .user_img {
    width: 60px;
    height: 60px;
  }
}
</style>