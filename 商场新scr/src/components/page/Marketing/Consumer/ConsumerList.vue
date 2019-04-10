<template>
  <div>
    <div>
      <el-breadcrumb separator="/" class="content_title">
        <el-breadcrumb-item>营销中心</el-breadcrumb-item>
        <el-breadcrumb-item>消费营销</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div>
      <el-form ref="reform" class="search" :model="sizeForm" label-width="80px">
        <el-form-item label="状态:" prop="memberGradeId" label-width="50px">
          <el-select v-model="sizeForm.memberGradeId" placeholder="请选择会员等级" style="width:150px;">
            <el-option label="全部" value=" "></el-option>
            <el-option v-for="(item,index) in grade" :key="index" :label="item.umgName" :value="item.umgId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动状态:" prop="memberGradeId">
          <el-select v-model="sizeForm.memberGradeId" placeholder="请选择会员等级" style="width:150px;">
            <el-option label="全部" value=" "></el-option>
            <el-option v-for="(item,index) in grade" :key="index" :label="item.umgName" :value="item.umgId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称:" prop="usersMemberCardNum">
          <el-input v-model="sizeForm.usersMemberCardNum" placeholder="输入优惠券名称商户名"></el-input>
        </el-form-item>
        <el-form-item label-width="10px">
          <el-button type="primary" @click="searchTap" icon="el-icon-search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table :data="tableData" border ref="menbertable" style="width: 100%" :cell-style="center" :header-cell-style="center">
        <el-table-column prop="usersId" label="活动名称"></el-table-column>
        <el-table-column prop="usersId" label="活动时间"></el-table-column>
        <el-table-column prop="usersId" label="活动对象"></el-table-column>
        <el-table-column prop="usersId" label="申请人"></el-table-column>
        <el-table-column label="活动状态" width="150">
          <template slot-scope="scope">
            <p class="table_details">{{ scope.row.usersStatus| status}}</p>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="150">
          <template slot-scope="scope">
            <p class="table_details">{{ scope.row.usersStatus| status}}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-dropdown>
              <el-button type="primary">更多
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item><p>黄金糕</p></el-dropdown-item>
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
</template>
  
<script>
export default {
  data() {
    return {
      sizeForm: {},
      grade: [
        {
          umgName: "十四",
          umgId: ""
        }
      ],
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    };
  },
  methods: {
    center() {
      return "text-align: center;";
    },
    //   搜索
    searchTap() {},
    handleSizeChange(val) {},
    handleCurrentChange(val) {}
  }
};
</script>
  
<style scoped lang="less">
.search {
  margin-top: 15px;
  display: flex;
}
</style>