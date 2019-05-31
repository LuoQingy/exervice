<template>
  <div id="activity-management">
    <div>
      <el-breadcrumb separator="/" class="content_title">
        <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="screenOptions">活动名称：
      <el-input v-model="user.activityName" style="width:190px;margin-right:10px;" placeholder="请活动名称"></el-input>活动状态：
      <el-select v-model="activityStatus" style="width:108px;margin-right:10px;" placeholder="请选择">
        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>显示状态：
      <el-select v-model="value" style="width:108px;margin-right:10px;" placeholder="请选择">
        <el-option label="全部" :value="0"></el-option>
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-search" @click="searchEvent">搜索</el-button>
      <el-button type="danger" @click="toAddActivity(1,1)" class="fr" icon="el-icon-plus">添加活动</el-button>
    </div>
    <div class="activity-content">
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
        :cell-style="center"
        :header-cell-style="tableStyle"
      >
        <el-table-column label="序号" width="80">
          <template slot-scope="scope">
            <div>
              <el-input
                class="activity-activityRank"
                @keyup.enter="inputEvent(scope.row,scope.row.activityRank)"
                @change="inputEvent(scope.row,scope.row.activityRank)"
                placeholder="请输入序号"
                style="width:55px;text-align: center;"
                v-model.number="scope.row.activityRank"
              ></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="活动图片" width="130">
          <template slot-scope="scope">
            <div class="activity-icon">
              <img class="user_img" :src="scope.row.activityImageUrl" alt>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="活动名称" prop="activityTitle" width="100">
          <template slot-scope="scope">
            <div>
              <p :style="'color:'+scope.row.activityColor">{{scope.row.activityTitle}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="生效时间段" width="260">
          <template slot-scope="scope">
            <div v-if="!scope.row.activityIsValidity">
              <p class="table_details">{{scope.row.activityStartTime}}-{{scope.row.activityEndTime}}</p>
            </div>
            <div v-else>
              <p class="table_details">永久有效</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="活动状态">
          <template slot-scope="scope">
            <div v-if="scope.row.activityIsValidity">
              <p>进行中</p>
            </div>
            <div v-else>
              <p>{{scope.row.activityState}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="最后修改时间" width="160">
          <template slot-scope="scope">
            <div v-if="scope.row.activityUpdateTime">
              <p class="table_details">{{scope.row.activityUpdateTime}}</p>
            </div>
            <div v-else>
              <p class="table_details">{{scope.row.activityCreateTime}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="admin.adminName" label="修改人">
          <template slot-scope="scope">
            <p class="table_details">{{scope.row.admin.adminName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="显示状态" width="110">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.activityIsUse"
              @change="selectChange(scope.row,scope.row.activityIsUse)"
              style="width:90px;"
              placeholder="请选择"
            >
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="operation">
              <span class="edit" @click="toAddActivity(2,scope.row.activityId)">编辑</span>
              <el-popover placement="top" width="160" v-model="scope.row.visible">
                <p>确定删除改活动吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="scope.row.visible =false">取消</el-button>
                  <el-button type="primary" size="mini" @click="deteleActivity(scope.row.activityId)">确定</el-button>
                </div>
                <el-button class="delete" type="text" slot="reference">删除</el-button>
              </el-popover>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination" style="width:100%">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[10, 20, 30, 40,60]"
          :page-size="pageSize"
          layout="total,sizes,prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { numberTest, specailTest } from "@/libs/regular.js";
export default {
  data() {
    return {
      tableData: [],
      activityList: [],
      selectlist: [],
      options: [
        {
          value: true,
          label: "启用"
        },
        {
          value: false,
          label: "停用"
        }
      ],
      statusOptions: [
        //1=未开始 / 2=进行中 / 3=已结束
        {
          value: 0,
          label: "全部"
        },
        {
          value: 1,
          label: "未开始"
        },
        {
          value: 2,
          label: "进行中"
        },
        {
          value: 3,
          label: "已结束"
        }
      ],
      activityStatus: 0,
      value: 0,
      activeName: "first",
      pageSize: 10,
      pageNum: 1,
      total: 0,
      tableStyle: {
        "text-align": "center",
      },
      user: {
        activityName: "",
        activityStatus: "",
        activityIsUse: ""
      }
    };
  },
  created() {
    this.$nextTick(() => {
      this.getActivityData();
    });
  },
  methods: {
    center() {
      return "text-align: center;";
    },
    toAddActivity(ev, Id) {
      if (ev == 1) {
        this.$router.push("/content/addActivity");
      } else if (ev == 2) {
        this.$router.push("/content/addActivity?activityId=" + Id);
      }
    },
    handleSelectionChange(val) {
      let arr = [];
      val.forEach(value => {
        arr.push(value.usersId);
      });
      this.selectlist = arr;
    },
    //获取活动数据
    getActivityData() {
      var data =
        "activityName=" +
        this.user.activityName +
        "&activityStatus=" +
        this.user.activityStatus;
      data += "&activityIsUse=" + this.user.activityIsUse;
      data += "&pageNum=" + this.pageNum + "&pageSize=" + this.pageSize;
      this.tableData = [];
      this.$xwhttpAuth({
        url: "/mall/getActivityList",
        method: "post",
        data: data
      })
        .then(res => {
          if (res.data.code == 10000) {
            let resp = res.data.resp;
            //console.log(resp)
            if (resp.list == null || resp.list.length == 0) {
            } else {
              this.total = resp.total;
              resp.list.forEach((item, index) => {
                let start = new Date(item.activityStartTime);
                let end = new Date(item.activityEndTime);
                let nowTime = new Date();
                item.visible = false;
                if (nowTime.getTime() > end.getTime()) {
                  item.activityState = "已结束";
                } else if (nowTime.getTime() > start.getTime()) {
                  item.activityState = "进行中";
                } else {
                  item.activityState = "未开始";
                }
              });
              this.tableData = resp.list;
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    editActivityData(ev) {
      //修改活动数据
      let obj = {
        activityId: ev.activityId, //类型：Number  必有字段  备注：活动id
        activityTitle: ev.activityTitle, //类型：String  可有字段  备注：活动标题
        activityColor: ev.activityColor, //类型：String  可有字段  备注：标题颜色
        activityImageUrl: ev.activityImageUrl, //类型：String  可有字段  备注：图片url
        activityStartTime: ev.activityStartTime, //类型：String  可有字段  备注：有效期开始
        activityEndTime: ev.activityEndTime, //类型：String  可有字段  备注：有效期结束
        activityContextType: ev.activityContextType, //类型：Number  可有字段  备注：活动内容类型(1:链接跳转 2:富文本内容)
        activityUrl: ev.activityUrl, //类型：String  可有字段  备注：链接类型内容
        activityContext: ev.activityContext, //类型：String  可有字段  备注：富文本内容
        activityIsUse: ev.activityIsUse, //类型：Boolean  可有字段  备注：是否启用
        activityRank: ev.activityRank, //类型：Number  可有字段  备注：序号
        activityIsValidity: ev.activityIsValidity //类型：String  可有字段  备注：是否永久有效
      };
      this.$httpAuth({
        url: "/mall/updateActivity",
        method: "post",
        data: obj
      })
        .then(res => {
          if (res.data.code == 20000) {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          } else if (res.data.code == 10000) {
            this.getActivityData();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    deteleActivity(ev) {
      //删除活动
      let data = "activityId=" + ev;
      this.$xwhttpAuth({
        url: "/mall/deleteActivity",
        method: "post",
        data: data
      })
        .then(res => {
          if (res.data.code == 20000) {
          } else if (res.data.code == 10000) {
            let resp = res.data.resp;
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getActivityData();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    inputEvent(item, ev) {
      //序号
      if (ev == "" || ev == " ") {
        this.$message.info("请输入活动序号");
        return;
      } else if (!numberTest(ev)) {
        this.$message.info("活动序号只能输入数字");
        return;
      } else {
      }
      this.editActivityData(item);
    },

    selectChange(item, ev) {
      //数据的修改启用或者停
      this.editActivityData(item);
    },
    searchEvent() {
      //搜索事件
      if (specailTest(this.user.activityName)) {
        this.$message.info("搜索活动名称不能包含特殊字符");
        return;
      }
      if (this.activityStatus == 0) {
        this.user.activityStatus = "";
      } else {
        this.user.activityStatus = this.activityStatus;
      }
      if (this.value == 0) {
        if (this.value === false) {
          this.user.activityIsUse = this.value;
        } else {
          this.user.activityIsUse = "";
        }
      } else {
        this.user.activityIsUse = this.value;
      }
      this.pageNum = 1;
      this.total = 0;
      this.getActivityData();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.getActivityData();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getActivityData();
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
button {
  outline: none;
  border: none;
}
#activity-management {
  padding-bottom: 30px;
  .screenOptions {
    width: 100%;
    margin: 15px 0px;
    overflow: hidden;
    font-size: 14px;
    color: #333;
    .el-button {
      margin-right: 10px;
    }
  }
  .activity-content {
    width: 100%;
    margin: 10px 0;
    .activity-icon {
      width: 80px;
      height: 48px;
      margin: 0 auto;
      .user_img {
        width: 100px;
        height: 60px;
        vertical-align: middle;
      }
    }
    .operation {
      span {
        cursor: pointer;
      }
      .edit {
        padding-left: 5px;
      }
      .detele {
        padding-left: 5px;
        // color: red;
      }
    }
    .pagination {
      margin: 20px 0 0;
    }
  }
}
</style>
