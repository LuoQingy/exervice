<template>
  <div>
    <div>
      <el-breadcrumb separator="/" class="content_title">
        <el-breadcrumb-item>营销中心</el-breadcrumb-item>
        <el-breadcrumb-item>模板消息</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="getTem">
      <i class="el-icon-info"></i>
      <div style="flex:1;">
        <div class="getmessage">
          <span>获取品牌公众号模板消息</span>
          <p>
            <span>最近一次获取时间:2018-28-15</span>
            <el-button type="primary" size="mini">立即获取</el-button>
          </p>
        </div>
        <p>GIC将同步您微信公众号的所有模板消息</p>
      </div>
    </div>
    <div>
      <el-input class="input" v-model="input" placeholder="请输入内容"></el-input>
    </div>
    <div>
      <el-table :data="tableData" border  :cell-style='center' :header-cell-style="center" style="width: 100%">
        <el-table-column prop="date" label="标题"></el-table-column>
        <el-table-column prop="name" label="绑定状态" width="120"></el-table-column>
        <el-table-column prop="address" label="触发条件" width="120"></el-table-column>
        <el-table-column prop="address" sortable label="最近更新时间"></el-table-column>
        <el-table-column label="操作" width="100">
            <template slot-scope="scope">
                <el-button type="text">编辑</el-button>
                <el-button type="text">删除</el-button>
            </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
  
<script>
export default {
  data() {
    return {
      input: "",
      tableData:[{
          date:'ddd',
          name:'ddd',
          address:'ddd',
      }],
      center:{
          'text-align': 'center'
      }
    };
  }
};
</script>
  
<style scoped lang='less'>
.getTem {
  margin-top: 15px;
  border: 1px solid #b3d8ff;
  padding: 8px 16px;
  background: #ecf5ff;
  display: flex;
  align-items: center;
  .el-icon-info {
    font-size: 36px;
    color: #188ffe;
    margin-right: 20px;
  }
  .getmessage {
    display: flex;
    justify-content: space-between;
  }
}
.input {
  width: 300px;
  margin: 15px 0;
}
</style>