<template>
  <div>
    <div>
      <el-breadcrumb separator="/" class="content_title">
        <el-breadcrumb-item>商场装修</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="page_view">
      <div class="left_view">
        <div>
          <!--页面列表-->
          <div class="body_table">
            <div class="add_page_btn">
              <el-button size="mini" icon="el-icon-plus" @click="addPage">新建页面</el-button>
            </div>
            <el-table
              :data="list"
              ref="singleTable"
              border
              :cell-style="()=>'text-align: center;'"
              :header-cell-style="()=>'text-align: center;'"
            >
              <el-table-column label="ID" prop="pageId" width="80"></el-table-column>
              <el-table-column label="页面名称" prop="pageName" width="150"></el-table-column>
              <el-table-column label="状态" prop="pageIsUse" width="80"></el-table-column>
              <el-table-column label="链接二维码" width="100">
                <template slot-scope="{row}">
                  <el-popover placement="right-start" trigger="hover">
                    <div>
                      <qrcode :value="URL" :options="{ size: 140 }"></qrcode>
                    </div>
                    <i slot="reference" class="el-icon-menu"></i>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="链接地址">
                <template slot-scope="{row}">
                  <p>{{URL}}</p>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200px">
                <template slot-scope="{ row }">
                  <el-button size="mini" @click="handleEdit(row)">装修页面</el-button>
                  <el-dropdown>
                    <el-button size="mini">
                      更多
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>
                        <p @click="setPage(row)">启用页面</p>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <p @click="rechristen(row)">重命名</p>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <p @click="delPage(row)">删除</p>
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
                :page-sizes="[5, 10, 15, 20]"
                :page-size="pageSize"
                background
                layout="total, sizes, prev, pager, next"
                :total="total"
              ></el-pagination>
            </div>
          </div>
          <!--页面列表end-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueQrcode from "@xkeshi/vue-qrcode";
import { formdata } from "../../../libs/formdata.js";
import { api } from "@/libs/axiosProxy.js";
import {specailTest} from "@/libs/regular.js";
export default {
  name: "pageView",
  components: {
    // RrgTable,
    qrcode: VueQrcode
  },
  data() {
    return {
      URL: "",
      platform: "mobile",
      pageTypes: [],
      currentPageTypeId: "2",
      columns: [],
      list: [],
      copyBtn: {},
      currentRow: {},
      pageSize: 10,
      currentPage: 1,
      total: 0,
      allList: []
    };
  },
  created() {
    if (api.type === "dev") {
      this.URL = "http://thuser.paycore.cc/#/project/index?mallId=1";
    } else if (api.type === "pro") {
      this.URL = "http://huser.paycore.cc/#/project/index?mallId=1";
    }
     else if (api.type === "pre") {
      this.URL = "http://yhuser.paycore.cc/#/project/index?mallId=1";
    } else {
      this.URL = "http://thuser.paycore.cc/#/project/index?mallId=1";
    }
    this.initPageList();
  },
  methods: {
    // 复制链接
    copyUrl(e, item) {
      this.$message({
        type: "success",
        message: "复制成功"
      });
    },
    // 发布页面
    setPage(item) {
      this.$httpAuth
        .post("mall/setUsePage", {
          pageId: item.pageId,
          pageTypeId: this.currentPageTypeId
        })
        .then(res => {
          this.initPageList();
          this.$message({
            type: "success",
            message: "启用成功"
          });
        });
    },
    // 重命名
    rechristen(item) {
      this.$prompt("请输入新的页面名称", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: item.pageName
      })
        .then(({ value }) => {
          let test = specailTest(value);
          if (value && !test) {
            this.$httpAuth
              .post("mall/updatePage", {
                pageId: item.pageId,
                pageName: value
              })
              .then(res => {
                if (res.data.code === 10000) {
                  this.initPageList();
                  this.$message({
                    type: "success",
                    message: "修改成功"
                  });
                } else {
                  this.$message({
                    type: "warning",
                    message: res.data.msg
                  });
                }
              });
          } else if (value && test) {
            this.$message({
              message: "页面名称不能为特殊字符",
              type: "warning"
            });
          } else {
            this.$message({
              message: "页面名称不能为空",
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    // 新建页面
    addPage() {
      this.$prompt("请输入页面名称", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(row => {
          let value = row.value;
          let test = specailTest(value);
          if (row.value && !test) {
            this.$httpAuth({
              url: "mall/addPage",
              method: "POST",
              data: {
                pageTypeId: this.currentPageTypeId,
                pageName: value
              }
            }).then(res => {
              if (res.data.code === 10000) {
                this.initPageList();
                this.$message({
                  type: "success",
                  message: "创建成功"
                });
              } else {
                this.$message({
                  type: "warning",
                  message: res.data.msg
                });
              }
            });
          } else if (row.value && test) {
            this.$message({
              message: "页面名称不能为特殊字符",
              type: "warning"
            });
          } else {
            this.$message({
              message: "页面名称不能为空",
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    // 装修页面
    handleEdit(item) {
      // let routeData = this.$router.resolve({
      //   path: "/content/pageModelSetting",
      //   query: {
      //     pageTypeId: this.currentPageTypeId,
      //     pageId: item.pageId
      //   }
      // });
      // window.open(routeData.href, "_blank");
      this.$router.push({
        path: "/content/pageModelSetting",
        query: {
          pageTypeId: this.currentPageTypeId,
          pageId: item.pageId
        }
      });
    },
    // 选中页面
    handleCurrentChange(currentRow) {
      if (currentRow.pageUrl) {
        this.pageUrl = currentRow.pageUrl;
      }
    },
    // 删除页面
    delPage(item) {
      this.$confirm("确定删除该页面吗?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let formData = formdata({
          pageId: item.pageId
        });
        this.$xwhttpAuth.post("mall/deletePage", formData).then(res => {
          this.initPageList();
          this.$message({
            type: "success",
            message: res.data.resp
          });
        });
      });
    },
    // 根据页面类型来初始化页面列表
    initPageList() {
      this.$httpAuth({
        method: "POST",
        url: "mall/selectByPageTypeId",
        data: {
          pageTypeId: this.currentPageTypeId
        }
      }).then(res => {
        if (res.data.code === 10000) {
          res.data.resp.forEach(item => {
            item.pageTypeId = item.pageTypeId.toString();
            item.pageIsUse = item.pageIsUse ? "启用" : "未启用";
          });
        }
        this.list = res.data.resp;
        this.allList = res.data.resp;
        this.total = res.data.resp.length;
      });
    },
    // 前端的分页处理
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      let list = [];
      for (let i = 0; i < val; i++) {
        if (this.allList[i]) {
          list.push(this.allList[i]);
        } else {
          break;
        }
        this.list = list;
      }
    },
    // 前端的分页处理
    handleCurrentChange(val) {
      this.currentPage = val;
      let num = (val - 1) * this.pageSize;
      let list = [...this.allList];
      this.list = list.splice(num, this.pageSize);
    }
  }
};
</script>

<style lang="less" scoped>
.page_view {
  display: flex;
  .left_view {
    background: #ffffff;
    .body_table {
      .add_page_btn {
        padding: 10px;
        margin-right: 20px;
        float: right;
      }
    }
  }
}

.el-radio-button--mini .el-radio-button__inner {
  width: 70px !important;
  border-radius: 0 !important;
}
</style>
