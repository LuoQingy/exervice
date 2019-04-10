<template>
  <div class="menberright">
    <div class="tablediv">
      <div class="btn">
        <el-button type="primary" @click="addRight">新增特权</el-button>
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
                <el-input-number
                  :min="0"
                  ref="rankref"
                  @change="leaveInput(item.umriId,index)"
                  @keyup.enter="leaveInput(item.umriId,index)"
                  class="rankinput"
                  controls-position="right"
                  v-model="item.umriRank"
                ></el-input-number>
              </div>
              <div class="bushuang">{{item.umriName?item.umriName:'无'}}</div>
              <div class="bushuang">
                <img :src="item.umriActivateIcon?item.umriActivateIcon:'无'">
              </div>
              <div class="bushuang">
                <span v-for="(second,index) in item.usersMemberGradeList" :key="index">{{second.umgName?second.umgName:'无'}}</span>
              </div>
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
        { label: "排序" },
        { label: "特权名称" },
        { label: "图标" },
        { label: "激活等级" },
        { label: "操作" }
      ],
      tabledata: [], //会员权益列表
      rankNumber: "" //input框的值
    };
  },
  created() {
    this.getRight();
  },
  methods: {
    getRight() {
      //获取会员权益数据
      let _this = this;
      let data = "mallId=1";
      this.$xwhttpAuth({
        url: "/mall/getMemberRightsInterestsList",
        method: "post",
        data: data
      })
        .then(res => {
          if (res.data.code == 10000) {
            let resp = res.data.resp;
            if (resp == null || resp.length == 0) {
            } else {
              this.tabledata =resp;
            }
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    addRight() {
      //去新增会员权益
      this.$router.push("/member/addmenberright");
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
      this.$confirm("确认删除？", {
        center: true
      })
        .then(_ => {
          let data = "umriId=" + umriId;
          this.$xwhttpAuth({
            url: "/mall/deleteMemberRightsInterests",
            method: "post",
            data: data
          })
            .then(res => {
              if (res.data.code == 10000) {
                this.$message.success(res.data.resp);
                _this.getRight();
              } else {
                this.$message.success(res.data.msg);
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(_ => {});
    },
    leaveInput(umriId, index) {
      //修改排序
      let _this = this;
      _this.rankNumber = _this.tabledata[index].umriRank;
      if (_this.rankNumber == "" && _this.rankNumber != "0") {
      } else {
        _this.moveRight(umriId);
      }
    },
    moveRight(umriId) {
      //获取单个详情
      let _this = this;
      let data = "umriId=" + umriId;
      this.$xwhttpAuth({
        url: "/mall/getMemberRightsInterestsInfo",
        method: "post",
        data: data
      })
        .then(res => {
          if (res.data.code == 10000) {
            let resp = res.data.resp;
            _this.comfileRight(resp);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    comfileRight(resp) {
      let _this = this;
      let typeId = [];
      resp.usersMemberGradeList.forEach((item, index) => {
        typeId.push(item.umgId);
      });
      var data = "umriId=" + resp.umriId + "&umriName=" + resp.umriName;
      data += "&umriPrivilegeIntro=" + resp.umriPrivilegeIntro;
      data += "&umriActivateIcon=" + resp.umriActivateIcon;
      data += "&umriNonactivateIcon=" + resp.umriNonactivateIcon;
      data += "&umriPrivilegeIntroduce=" + resp.umriPrivilegeIntroduce;
      data += "&umgIdArray=" + typeId;
      data += "&umriRank=" + _this.rankNumber;
      this.$xwhttpAuth({
        url: "/mall/updateMemberRightsInteres",
        method: "post",
        data: data
      })
        .then(res => {
          if (res.data.code == 10000) {
            let resp = res.data.resp;
            this.$message({
              showClose: true,
              message: "修改成功",
              type: "success"
            });
            _this.getRight();
          }
        })
        .catch(err => {
          console.log(err);
        });
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
.menberright {
  padding-bottom: 50px;
  .tablediv {
    padding: 20px;
    min-width: 600px;
    font-size: 14px;
    .btn {
      padding-top: 20px;
      text-align: right;
    }
    .table {
      margin-top: 20px;
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