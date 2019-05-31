<template>
  <div>
    <el-breadcrumb separator="/" class="content_title">
      <el-breadcrumb-item>商场装修</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="info">
      <el-button type="primary" size="mini" @click="goPageModelSetting" icon="el-icon-plus">添加模板</el-button>
      <div class="table">
        <el-table :data="tableData" border style="width: 100%" :cell-style="center" :header-cell-style="center">
          <el-table-column prop="id" label="ID" width="80">
          </el-table-column>
          <el-table-column prop="name" label="页面名称">
          </el-table-column>
          <el-table-column prop="image" label="链接二维码">
          </el-table-column>
          <el-table-column prop="links" label="链接地址">
          </el-table-column>
          <el-table-column prop="status" label="模板状态">
            <template slot-scope="scope">
              {{scope.row.status==1?"启用":'未启用'}}
            </template>
          </el-table-column>
          <el-table-column prop="btn" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="goPageModelSetting">编辑模板</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          id: "2",
          name: "不知道",
          image: "图片",
          links: "www.dddd.",
          status: "1",
          btn: ""
        }
      ]
    };
  },
  methods: {
    center() {
      return 'text-align: center;'
    },
    goPageModelSetting() {
      let routeData = this.$router.resolve({
        path: "/content/pageModelSetting"
        // query: params,
        // params:{catId:params.catId}
      });
      window.open(routeData.href, "_blank");
    }
  }
};
</script>

<style lang="less" scoped>
.info {
  margin-top: 20px;
  .table {
    margin-top: 10px;
  }
}
</style>
