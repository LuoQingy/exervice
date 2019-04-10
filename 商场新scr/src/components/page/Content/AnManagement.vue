<template>
  <div id="activity-management">
    <h3>公告管理</h3>
    <div class="screenOptions">
      <div>
        <label>公告标题：</label>
        <input v-model="searchContext" type="text" placeholder="请输入公告标题" @keyup.enter="searchAnList">
        <el-button type="primary" icon="el-icon-search" @click="searchAnList">搜索</el-button>
      </div>
      <div>
        <el-button type="danger" @click="toAnnouncement" class="fr" icon="el-icon-plus">添加轮播公告</el-button>
      </div>
    </div>
    <div class="activity-content main">
      <el-table
        :data="tableData"
        ref="singleTable"
        border
        :cell-style="()=>'text-align: center;'"
        :header-cell-style="()=>'text-align: center;'"
      >
        <el-table-column label="序号" width="100">
          <template slot-scope="{row}">
            <el-input
              size="mini"
              @change="getAnInfoone(row.annId,row.annRank)"
              @keyup.enter="getAnInfoone(row.annId,row.annRank)"
              v-model="row.annRank"
              style="width:60px;text-align:center"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="公告标题" prop="annTitle" ></el-table-column>
        <el-table-column label="生效时间段">
          <template slot-scope="{row}">
            {{row.annStartTime}}-{{row.annEndTime}}
          </template>
        </el-table-column>
        <el-table-column label="最后修改时间">
          <template slot-scope="{row}">
            {{row.annUpdateTime?row.annUpdateTime:row.annCreateTime}}
          </template>
        </el-table-column>
        <el-table-column label="修改人" >
          <template slot-scope="{row}">
            {{row.admin?row.admin.adminName:'无'}}
          </template>
        </el-table-column>

        <el-table-column label="显示状态">
          <template slot-scope="{row}">
            <el-select @change="getAnInfo(row.annId,row.annIsUse)" v-model="row.annIsUse" style="width:80px;" placeholder="请选择">
              <el-option v-for="(item,index) in options" :key="index" :label="item.label" :value="item.label"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="{ row }">
            <el-button type="text" @click="goEditAn(row.annId)">编辑</el-button>
            <el-popover placement="top" width="160" v-model="row.visible">
              <p>确定删除改公告吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="row.visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="deleteAnList(row.annId)">确定</el-button>
              </div>
              <el-button class="delete" type="text" slot="reference">删除</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>

      <div style="width:100%" class="table">
        <!--<table cellpadding="0" cellspacing="0" width="100%">-->
          <!--<tr>-->
            <!--<th style="width:70px;border-right:none;">序号</th>-->
            <!--<th style="width:120px;border-right:none;">公告标题</th>-->
            <!--<th style="width:260px;border-right:none;">生效时间段</th>-->
            <!--<th style="width:120px;border-right:none;">最后修改时间</th>-->
            <!--<th style="width:110px;border-right:none;">修改人</th>-->
            <!--<th style="width:100px;border-right:none;">显示状态</th>-->
            <!--<th style="width:108px">操作</th>-->
          <!--</tr>-->
          <!--<tr v-if="!tableData.length">-->
            <!--<td colspan="7">暂无内容</td>-->
          <!--</tr>-->
          <!--<tr v-for="(item, index) in tableData" :key="index">-->
            <!--<td style="width:50px;border-right:none;">-->
              <!--<el-input-->
                <!--size="mini"-->
                <!--@change="getAnInfoone(item.annId,item.annRank)"-->
                <!--@keyup.enter="getAnInfoone(item.annId,item.annRank)"-->
                <!--v-model="item.annRank"-->
                <!--style="width:60px;text-align:center"-->
              <!--&gt;</el-input>-->
            <!--</td>-->
            <!--<td style="width:120px;border-right:none;">{{item.annTitle}}</td>-->
            <!--<td style="width:260px;border-right:none;">{{item.annStartTime}}-{{item.annEndTime}}</td>-->
            <!--<td style="width:120px;border-right:none;">{{item.annUpdateTime?item.annUpdateTime:item.annCreateTime}}</td>-->
            <!--<td style="width:110px;border-right:none;">{{item.admin?item.admin.adminName:'无'}}</td>-->
            <!--<td style="width:100px;border-right:none;">-->
              <!--<el-select @change="getAnInfo(item.annId,item.annIsUse)" v-model="item.annIsUse" style="width:80px;" placeholder="请选择">-->
                <!--<el-option v-for="(item,index) in options" :key="index" :label="item.label" :value="item.label"></el-option>-->
              <!--</el-select>-->
            <!--</td>-->
            <!--<td style="width:108px" class="operation">-->
              <!--<span class="edit" @click="goEditAn(item.annId)">编辑</span>-->
              <!--<el-popover placement="top" width="160" v-model="item.visible">-->
                <!--<p>确定删除改公告吗？</p>-->
                <!--<div style="text-align: right; margin: 0">-->
                  <!--<el-button size="mini" type="text" @click="item.visible = false">取消</el-button>-->
                  <!--<el-button type="primary" size="mini" @click="deleteAnList(item.annId)">确定</el-button>-->
                <!--</div>-->
                <!--<el-button class="delete" type="text" slot="reference">删除</el-button>-->
              <!--</el-popover>-->
            <!--</td>-->
          <!--</tr>-->
        <!--</table>-->
      </div>
      <div class="pagination" style="width:100%">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-size="pageSize"
          @size-change="handleSizeChange"
          :page-sizes="[10, 20, 30, 40]"
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
      tableData: [],
      options: [
        {
          label: "启用"
        },
        {
          label: "停用"
        }
      ],
      useState: "启用",
      activeName: "first",
      pageSize:10,
      pageNum: 1,
      total: 30,
      anTitle: "", //公告标题
      searchContext: "", //搜索内容
      anInfo: {} //单条数据
    };
  },
  created() {
    this.getAnList();
  },
  mounted() {},
  methods: {
    toAnnouncement() {
      this.$router.push("/content/addAnnouncement");
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.getAnList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getAnList();
    },
    goEditAn(anId) {
      //跳到编辑页面
      this.$router.push({
        name: "editAnnouncement",
        query: {
          anId: anId
        }
      });
    },
    searchAnList() {
      //搜索公告
      this.getAnList();
    },
    // 获取公告列表
    getAnList() {
      let _this = this;
      _this.tableData = [];
      let data =
        "pageNum=" +
        this.pageNum +
        "&pageSize=" +
        this.pageSize +
        "&searchContext=" +
        this.searchContext;
      this.$xwhttpAuth({
        url: "/mall/getAnnouncementList",
        method: "post",
        data: data
      })
        .then(res => {
          if (res.data.code == 10000) {
            let resp = res.data.resp.list;
            this.total = res.data.resp.total;
            for (let i = 0; i < resp.length; i++) {
              resp[i].visible = false;
              if (resp[i].annIsUse) {
                resp[i].annIsUse = "启用";
              } else {
                resp[i].annIsUse = "停用";
              }
            }
            _this.tableData = resp;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    findAnByTitle() {
      //根据公告标题搜索
      let _this = this;
      let data = "anTitle=" + this.anTitle;
      this.$xwhttpAuth({
        url: "/mall/deleteAnnouncement",
        method: "post",
        data: data
      })
        .then(data => {
          if (data.data.code == 10000) {
            _this.$message.success(data.data.resp);
          } else {
            _this.$message.info(data.data.msg);
          }
          _this.getAnList();
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 删除公告
    deleteAnList(annId) {
      let _this = this;
      let data = "annId=" + annId;
      this.$xwhttpAuth({
        url: "/mall/deleteAnnouncement",
        method: "post",
        data: data
      })
        .then(data => {
          if (data.data.code == 10000) {
            _this.$message.success(data.data.resp);
          } else {
            _this.$message.info(data.data.msg);
          }
          _this.getAnList();
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 修改公告
    getAnInfoone(annId, annRank) {
      let _this = this;
      let data = "annId=" + annId;
      this.$xwhttpAuth({
        url: "/mall/getAnnouncementInfo",
        method: "post",
        data: data
      })
        .then(data => {
          let resp = data.data.resp; //获取单条的数据
          resp.annRank = annRank;
          _this.submitForm(resp);
        })
        .catch(err => {
          console.log(err);
        });
    },
    getAnInfo(annId, annIsUse) {
      let _this = this;
      let data = "annId=" + annId;
      this.$xwhttpAuth({
        url: "/mall/getAnnouncementInfo",
        method: "post",
        data: data
      })
        .then(data => {
          let resp = data.data.resp; //获取单条的数据
          if (annIsUse == "启用") {
            resp.annIsUse = true;
          } else {
            resp.annIsUse = false;
          }
          _this.submitForm(resp);
        })
        .catch(err => {
          console.log(err);
        });
    },
    submitForm(resp) {
      let _this = this;
      this.$httpAuth({
        url: "/mall/updateAnnouncement",
        method: "post",
        data: resp
      })
        .then(data => {
          if (data.data.code == 10000) {
            _this.$message.success(data.data.resp);
            this.getAnList();
          } else {
            _this.$message.info(data.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>


<style lang="less" scoped>
.fl {
  float: left;
}
.fr {
  float: right;
}
input,
button {
  outline: none;
  border: none;
}
#activity-management {
  width: auto;
  min-width: 1000px;
  h3 {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #f3f3f3;
    text-indent: 15px;
    font-size: 14px;
    color: #333;
    font-weight: normal;
  }
  .screenOptions {
    width: 100%;
    margin: 10px 0px;
    overflow: hidden;
    display: flex;
    div:nth-child(1) {
      flex: 1;
      input {
        border: 1px solid #ddd;
        height: 26px;
        line-height: 26px;
        width: 200px;
      }
    }
    div:nth-child(2) {
      flex: 1;
      text-align: right;
      .el-button {
        margin-right: 10px;
      }
    }
  }
  .activity-content {
    width: 100%;
    margin: 10px 0;
    overflow: hidden;
    .table table tr th {
      line-height: 60px;
      border: solid #ddd;
      border: 1px solid #ebeef5;
      color: #333333;
      font-weight: normal;
      font-size: 14px;
    }
    .table table tr td {
      overflow-x: hidden;
      vertical-align: middle;
      text-align: center;
      border: 1px solid #ebeef5;
      color: #333333;
      border-top: none;
      font-size: 13px;
      height: 40px;
      img {
        padding: 10px 0px;
        vertical-align: middle;
        width: 100px;
        height: 60px;
      }
    }
    .operation {
      span {
        cursor: pointer;
      }
      .edit {
        color: #13c300;
      }
      .detele {
        padding-left: 5px;
        color: red;
      }
    }
    .pagination {
      margin: 20px 0 0;
    }
  }
}
</style>
