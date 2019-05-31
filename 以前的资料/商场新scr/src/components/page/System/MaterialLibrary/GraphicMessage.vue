<template>
  <div class="materialLibrary">
    <h3>素材库图文</h3>
    <div class="tablediv">
      <div class="btn">
        <el-button type="danger" icon="el-icon-plus" @click="addRight">新增图文模板</el-button>
      </div>
      <div class="table">
        <div class="thead">
          <ul>
            <li v-for="(item,index) in tableheader" :key="index">{{item.label}}</li>
          </ul>
        </div>
        <div class="body">
          <ul>
            <li v-for="(item,index) in tabledata" :key="index">
              <div class="bushuang">
                <img :src="item.umriActivateIcon?item.umriActivateIcon:'无'">
              </div>
              <div class="bushuang">{{item.umriName?item.umriName:'无'}}</div>
              <div class="bushuang">{{item.umriName?item.umriName:'无'}}</div>
              <div class="bushuang">{{item.umriName?item.umriName:'无'}}</div>
              <div class="bushuang">
                <strong @click="editRight(item.umriId)">编辑</strong>
                <strong @click="deleteRight(item.umriId)">删除</strong>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
export default {
  data() {
    return {
      tableheader: [
        { label: "图片" },
        { label: "标题" },
        { label: "作者" },
        { label: "修改时间" },
        { label: "操作" }
      ],
      tabledata: [], //会员权益列表
      rankNumber: "" //input框的值
    };
  },
  created() {
    this.getAllText();
  },
  methods: {
    getAllText() {
      //获取所有的图文消息
      let _this = this;
      this.$httpAuth({
        url: "/mall/findAllWechatNews",
        method: "get"
      })
        .then(res => {
          if (res.data.code == 10000) {
            this.tabledata = res.data.resp;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    addRight() {
      //去新增会员权益
      this.$router.push("/system/addGraphicMessage");
    },
    editRight(umriId) {
      //去新增会员权益
      this.$router.push({
        name: "editMenberRight",
        query: {
          umriId: umriId
        }
      });
    },
    deleteRight(umriId) {
      //删除权益
      let _this = this;
      let data = "umriId=" + umriId;
      this.$xwhttpAuth({
        url: "/mall/deleteMemberRightsInterests",
        method: "post",
        data: data
      })
        .then(res => {
          if (res.data.code == 10000) {
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: "success"
            });
            _this.getRight();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    leaveInput(umriId, index) {
      let _this = this;
      _this.rankNumber = _this.$refs.rankref[index].value;
      if (_this.rankNumber == "") {
      } else {
        _this.changeRank(umriId, index);
      }
    },
    // 更改等级的顺序
    changeRank(umriId, index) {
      let _this = this;
      let data = "umriId=" + umriId + "&direction=" + _this.rankNumber;
      this.$xwhttpAuth({
        url: "/mall/moveMemberRightsInteresRank",
        method: "post",
        data: data
      })
        .then(res => {
          if (res.data.code == 10000) {
            _this.$message.success("操作成功");
            _this.$refs.rankref[index].value = "";
            _this.getRight();
          } else {
            _this.$message.error(res.data.msg);
            _this.$refs.rankref[index].value = "";
            _this.getRight();
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
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
.materialLibrary {
  h3 {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #f3f3f3;
    text-indent: 15px;
    font-size: 14px;
    color: #333;
    font-weight: normal;
  }
  .tablediv {
    padding: 20px;
    min-width: 600px;
    .btn {
      padding-top: 20px;
      text-align: right;
    }
    .table {
      margin-top: 20px;
      border: 1px solid #f2f2f2;
      .thead {
        width: 100%;
        ul {
          width: 100%;
          height: 40px;
          line-height: 40px;
          background: #f2f2f2;
          li {
            float: left;
            width: 20%;
            height: 40px;
            line-height: 40px;
            text-align: center;
            color: #666;
          }
        }
      }
      .body {
        width: 100%;
        ul {
          width: 100%;
          background: #fff;
          li {
            overflow: hidden;
            width: 100%;
            height: 60px;
            line-height: 60px;
            color: #666;
            border-bottom: 1px solid #f2f2f2;
            .bushuang {
              float: left;
              width: 20%;
              height: 60px;
              line-height: 60px;
              text-align: center;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              img {
                width: 50px;
                height: 50px;
                margin-top: 5px;
              }
              .rankinput {
                width: 80px;
                height: 30px;
                line-height: 30px;
                border: 1px solid #f2f2f2;
                outline: none;
                text-align: center;
              }
              i {
                font-size: 18px;
                margin-right: 4px;
              }
              strong {
                color: #409eff;
                margin: 0 10px;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }
}
</style>