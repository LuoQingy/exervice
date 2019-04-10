<template>
  <div class="menberright">
    <h3>公众号自定义菜单</h3>
    <div class="tablediv">
      <div class="btn">
        <el-button type="primary" @click="addRight(0)" v-if="tabledata.length<3">新增主菜单</el-button>
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
              <div class="fater">
                <div class="bushuang">
                  <el-input-number
                    controls-position="right"
                    ref="primaryRank"
                    @change="(val)=>{updateRule(val,item.buttonId)}"
                    class="rankinput"
                    v-model="item.sort"
                    :min="0"
                  ></el-input-number>
                </div>
                <div class="bushuang"></div>
                <div class="bushuang">{{item.name?item.name:'无'}}</div>
                <div class="bushuang">{{item.content?item.content:'无'}}</div>
                <div class="bushuang" style="text-align:left;">
                  <el-button type="text" @click="editRight(item.buttonId)" style="margin-left:20%;">编辑</el-button>
                  <el-popover placement="top" width="160" v-model="item.visible">
                    <p>确定要删除会员等级吗？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button size="mini" type="text" @click="item.visible = false">取消</el-button>
                      <el-button type="primary" size="mini" @click="deleteRight(item.buttonId)">确定</el-button>
                    </div>
                    <el-button type="text" style="color:red;" slot="reference">删除</el-button>
                  </el-popover>
                  <el-button type="text" v-if="item.type=='click'&&item.wechatMenuButtons.length<5" @click="addRight(item.buttonId)">新增子菜单</el-button>
                  <el-button type="text"
                             :icon="item.showChild?'el-icon-arrow-up':'el-icon-arrow-down'"
                             v-if="item.type=='click'&&item.wechatMenuButtons.length>0"
                             @click="showChildList(index)">
                  </el-button>
                </div>
              </div>
              <div class="childlist" v-show="item.showChild">
                <el-collapse-transition>
                  <ul>
                    <li v-for="(itemChild,index) in item.wechatMenuButtons" :key="index">
                      <div class="bushuang"></div>
                      <div class="bushuang">
                        <el-input-number
                          controls-position="right"
                          ref="primaryRank"
                          @change="(val)=>{updateRule(val,itemChild.buttonId)}"
                          class="rankinput"
                          type="number"
                          v-model="itemChild.sort"
                          :min="0"
                        ></el-input-number>
                      </div>
                      <div class="bushuang">{{itemChild.name?itemChild.name:'无'}}</div>
                      <div class="bushuang">{{itemChild.content?itemChild.content:'无'}}</div>
                      <div class="bushuang" style="text-align:left;">
                        <strong @click="editRight(itemChild.buttonId)" style="margin-left:20%;">编辑</strong>
                        <strong style="color:red;" @click="deleteRight(itemChild.buttonId)">删除</strong>
                      </div>
                    </li>
                  </ul>
                </el-collapse-transition>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="synPublic">
      <div class="tip" v-show="publishtime!=undefined">自定义菜单已于{{publishtime}}进行编辑，暂未发布上线</div>
      <el-button type="primary" @click="submitNoPublic">同步至微信菜单</el-button>
    </div>
  </div>
</template>

<script>
import { numberTest } from "@/libs/regular.js";
export default {
  data() {
    return {
      tableheader: [
        { label: "主菜单序列" },
        { label: "子菜单序列" },
        { label: "菜单名称" },
        { label: "内容" },
        { label: "操作" }
      ],
      tabledata: [], //会员权益列表
      rankNumber: "", //input框的值
      ruleForm: {
        name: "",
        intro: "",
        type: [],
        umriActivateIcon: "", //激活图标url
        umriNonactivateIcon: "", //未激活图标url
        umriPrivilegeIntroduce: "" //特权介绍
      },
      rules: {
        name: [
          { required: true, message: "请输入特权名称", trigger: "blur" },
          { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" }
        ],
        intro: [
          { required: true, message: "请输入特权简介", trigger: "blur" },
          { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" }
        ]
      },
      cardList: [], //会员卡等级
      publishtime: "" //发布时间
    };
  },
  created() {
    this.getAllNopublic();
  },
  methods: {
    getAllNopublic() {
      //获取公众号数据
      let _this = this;
      this.$xwhttpAuth({
        url: "/mall/getAllNopublic",
        method: "post"
      })
        .then(res => {
          if (res.data.code == 10000) {
            let resp = res.data.resp;
            resp.allNopublic.forEach((item, index) => {
              item.showChild = false;
              item.visible = false;
            });
            this.tabledata = resp.allNopublic;

            this.publishtime = resp.lastUpdateTime;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    addRight(id) {
      //跳转新增菜单
      this.$router.push({
        name: "addPublicMenu",
        query: {
          parentid: id
        }
      });
    },
    showChildList(index) {
      this.tabledata.forEach((item, ev) => {
        if (ev == index) {
          item.showChild = !item.showChild;
        }
      });
    },
    editRight(buttonId) {
      //跳转编辑菜单
      this.$router.push({
        name: "editPublicMenu",
        query: {
          buttonId: buttonId
        }
      });
    },
    submitNoPublic() {
      let _this = this;
      this.$httpAuth({
        url: "/mall/submitNoPublic",
        method: "post"
      })
        .then(res => {
          if (res.data.code == 10000) {
            this.$message.success("同步成功");
            _this.getAllNopublic();
          } else {
            this.$message.warning("同步失败");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    deleteRight(buttonId) {
      //删除权益
      let _this = this;
      this.$httpAuth({
        url: "/mall/deleteNopublic",
        method: "get",
        params: {
          buttonId: buttonId
        }
      })
        .then(res => {
          if (res.data.code == 10000) {
            this.$message.success("删除成功");
          } else {
            this.$message.warning("删除失败");
          }
          _this.getAllNopublic();
        })
        .catch(err => {
          console.log(err);
        });
    },
    updateRule(val, id) {
      if (numberTest(val)) {
        this.changeRank(id, val);
      } else {
        this.$message({
          message: "请填写正整数",
          type: "warning"
        });
        this.getAllNopublic();
      }
    },
    // 更改等级的顺序
    changeRank(umriId, val) {
      let _this = this;
      this.$httpAuth({
        url: "/mall/updateNopublic",
        method: "post",
        data: { sort: val, buttonId: umriId }
      })
        .then(res => {
          if (res.data.code == 10000) {
            _this.$message.success("修改成功");
            this.getAllNopublic();
          } else {
            _this.$message.error(res.data.msg);
            this.getAllNopublic();
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
  margin-bottom: 20px;
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
    padding: 0 20px;
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
          /*background: #f2f2f2;*/
          display: flex;
          border: 1px solid #ebeef5;
          li {
            flex: 1;
            height: 40px;
            line-height: 40px;
            text-align: center;
            color: #909399;
            border-right: 1px solid #ebeef5;
            font-size: 12px;
            font-weight: bold;
          }
        }
        ul li:last-child {
          flex: none;
          width: 280px;
        }
      }
      .body {
        width: 100%;
        ul {
          width: 100%;
          background: #fff;
          border: 1px solid #ebeef5;
          border-top: none;
          li .fater {
            overflow: hidden;
            width: 100%;
            color: #666;
            border-bottom: 1px solid #f2f2f2;
            display: flex;
            .bushuang {
              flex: 1;
              height: 60px;
              line-height: 60px;
              text-align: center;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              border-right: 1px solid #ebeef5;
              font-size: 14px;
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
                cursor: pointer;
                font-size: 16px;
                margin: 0 5px;
              }
            }
          }
          li  .fater .bushuang:last-child {
            width: 280px;
            flex: none;
          }
        }
      }
      .childlist {
        width: 100%;
        ul {
          width: 100%;
          background: #fff;
          li:nth-child(1) {
            border-top: 1px solid #f2f2f2;
          }
          li {
            overflow: hidden;
            width: 100%;
            height: 60px;
            line-height: 60px;
            color: #666;
            border-bottom: 1px solid #f2f2f2;
            display: flex;
            .bushuang {
             flex: 1;
              height: 60px;
              line-height: 60px;
              text-align: center;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              border-right: 1px solid #ebeef5;
              font-size: 14px;
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
                cursor: pointer;
                font-size: 16px;
              }
            }
          }
           li .bushuang:last-child {
            width: 280px;
            flex: none;
          }
        }
      }
    }
  }
  .synPublic {
    width: 100%;
    text-align: center;
    margin-top: 40px;
    .tip {
      margin-bottom: 20px;
      font-size: 16px;
      color: orange;
    }
  }
}
</style>
