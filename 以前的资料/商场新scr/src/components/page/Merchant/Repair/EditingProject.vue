<template>
  <div>
    <div>
      <el-breadcrumb separator="/" class="content_title">
        <el-breadcrumb-item>编辑报修项目</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="p_table">
      <div class="P_btn">
        <el-button type="primary" @click="add">新增报修项目</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        :cell-style="{'text-align':'center'}"
        :header-cell-style="{'background':'#f2f2f2','text-align':'center'}"
      >
        <el-table-column label="序号" width="100">
          <template slot-scope="scope">
            <input v-model="scope.row.cpRank" @blur="()=>{inputBlur(scope.row.cpRank,scope.row.rpId)}" class="input">
          </template>
        </el-table-column>
        <el-table-column label="报修项目" prop="rpRepairsProject"></el-table-column>
        <el-table-column label="添加时间" prop="rpCreateTime"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.rpStatus"
              @change="(val)=>{updateRepairsProject(val,scope.row.rpId)}"
              :active-value="active"
              :inactive-value="inactive"
              active-text="启用"
              inactive-text="停用"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-popover placement="top" width="160" v-model="scope.row.visible">
              <p>确定要该项目吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="deleteTap(scope.row.rpId)">确定</el-button>
              </div>
              <el-button type="text" slot="reference">删除</el-button>
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
    <editedialog :Visible="Visible" @success="getRepairsProjectList" @close="close"></editedialog>
  </div>
</template>
  
<script>
import { formdata } from "@/libs/formdata.js";
import editedialog from "./editedialog";
import { specailTest, numberTest } from "@/libs/regular.js";
export default {
  components: {
    editedialog
  },
  data() {
    return {
      tableData: [],
      Visible: false,
      active: 1,
      inactive: 2,
      currentPage: 1,
      pageSize: 10,
      total: 0
    };
  },
  created() {
    this.getRepairsProjectList();
  },
  methods: {
    //   获取列表
    getRepairsProjectList() {
      let data = formdata({
        pageNum: this.currentPage,
        pageSize: this.pageSize
      });
      this.$xwhttpAuth
        .post("/mall/getRepairsProjectList", data)
        .then(result => {
          if (result.data.code === 10000) {
            this.tableData = result.data.resp.list;
            this.total = result.data.resp.total;
          }
        })
        .catch(err => {});
    },
    // 添加
    add() {
      this.Visible = true;
    },
    // 关闭dialog
    close() {
      this.Visible = false;
    },
    // 删除
    deleteTap(id) {
      this.$httpAuth
        .post("mall/deleteRepairsProject", {
          rpId: id //类型：Number  必有字段  备注：id
        })
        .then(result => {
          if (result.data.code === 10000) {
            this.getRepairsProjectList();
          }
        })
        .catch(err => {});
    },
    // 排序
    inputBlur(val, id) {
      if (numberTest(val) || val === "0") {
        this.$httpAuth
          .post("/mall/updateRepairsProject", {
            rpId: id, //类型：Number  必有字段  备注：ID
            cpRank: val
          })
          .then(result => {
            if (result.data.code === 10000) {
              this.getRepairsProjectList();
            }
          })
          .catch(err => {});
      } else {
        this.$message({
          message: "请输入正整数",
          type: "warning"
        });
      }
    },
    // 修改状态
    updateRepairsProject(val, id) {
      this.$httpAuth
        .post("mall/updateRepairsProject", {
          rpId: id, //类型：Number  必有字段  备注：ID
          rpStatus: val //类型：Number  必有字段  备注：1=启用 / 2=停用
        })
        .then(result => {
          if (result.data.code === 10000) {
            this.$message({
              message: result.data.resp,
              type: "success"
            });
          } else {
            this.$message({
              message: result.data.msg,
              type: "warning"
            });
            this.getRepairsProjectList();
          }
        })
        .catch(err => {});
    },
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getRepairsProjectList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getRepairsProjectList();
    }
  },
  filters: {
    status(val) {
      if (val) {
        if (val == 1) {
          return "启用";
        } else if (val == 2) {
          return "停用";
        }
      }
    }
  }
};
</script>
  
<style scope lang="less">
.p_table {
  margin-top: 20px;
  .P_btn {
    padding: 10px;
    text-align: right;
  }
  .input {
    margin: 0 10px;
    width: 50px;
    height: 30px;
    line-height: 30px;
    box-sizing: border-box;
    text-align: center;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
  }
}
</style>