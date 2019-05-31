<template>
  <div id="get-rules">
    <div class="configuration">
      <div class="title">规则配置：</div>
      <div class="table" style="margin-top:15px;">
        <el-table :data="rule" style="width: 100%" border :header-cell-style="header_style" :cell-style="rowStyle">
          <el-table-column label="项目" prop="name" width="180"></el-table-column>
          <el-table-column label="积分(+)" prop="ucgrCoin" width="120"></el-table-column>
          <el-table-column label="说明" prop="info"></el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="editRules(scope.row,'dialogVisible')">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <p class="title" style="line-height: 40px;">注：当配置为0时，则表示该项不获得积分</p>
      </div>
    </div>
    <div class="configuration" style="margin-top:30px;">
      <div class="title">
        <p>综合体商场业态积分换算比例:</p>
      </div>
      <div style="margin-top:15px;">
        <el-table :data="tableData1" border style="width: 100%" :header-cell-style="header_style" :cell-style="rowStyle">
          <el-table-column prop="industryName" label="业态"></el-table-column>
          <el-table-column label="比例">
            <template slot-scope="scope">
              <p>{{scope.row.ucgrCoin}}:1</p>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="editoperation(scope.row,'operationVisible')">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <p class="title" style="margin-top:15px;">注：新增业态时默认比例为1:1,若需调整，请及时修改。 人民币:积分</p>
      </div>
    </div>
    <div class="configuration" style="margin-top:25px;">
      <div class="title" style="width: 80px">其它：</div>
      <div class="title" style="width: 90%">
        <span>会员生日当天消费可获得</span>
        <el-input-number
          size="mini"
          style="width:108px;"
          @change="(val)=>{update(val,birthdayId)}"
          v-model="multiple"
          controls-position="right"
          :min="0"
          type="number"
        ></el-input-number>
        <span>倍积分</span>
      </div>
    </div>
    <!-- 规则配置 -->
    <el-dialog title="规则配置" :visible.sync="dialogVisible" width="30%">
      <div class="rules_box">
        <span>{{rulesLabel}}</span>
        <el-input-number
          style="flex:1;margin-left:15px;"
          v-model="ucgrCoin"
          controls-position="right"
          :min="0"
          type="number"
        ></el-input-number>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateRule">保存</el-button>
      </span>
    </el-dialog>
    <!-- 业态配置 -->
    <el-dialog title="业态积分比例" :visible.sync="operationVisible" width="30%">
      <div class="rules_box">
        <span>{{rulesLabel}}</span>
        <div class="rela">
          <el-input-number
            style="margin-left:15px;flex:1"
            v-model="ucgrCoin"
            controls-position="right"
            :min="0"
            type="number"
          ></el-input-number>
          <span class="abs">人民币</span>
        </div>&nbsp;: &nbsp;
        <div  class="rela">
          <el-input :value="1" :readonly="true" style="text-align:center;"></el-input>
          <span class="abs">积分</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="operationVisible = false">取消</el-button>
        <el-button type="primary" @click="updateoperation">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
var _this;
import {specailTest,oneDecimalTest,numberTest} from "@/libs/regular.js";
export default {
  data() {
    _this = this;
    return {
      dialogVisible: false,
      ucgrCoin: 0,
      ucgrId: 0,
      birthdayId:0,
      rulesLabel: "",
      operationVisible: false,
      tableData: {
        REGISTER: {
          name: "注册送积分",
          info: "会员注册成功赠送积分"
        },
        COMPLETE_DATA: {
          name: "完善资料",
          info: "首次在完善资料页面将必填项目完善获得积分"
        },
        BIND_FACE: {
          name: "绑定人脸",
          info: "首次在人脸识别页面绑定人脸"
        },
        OPEN_ALIPAY: {
          name: "开通支付宝/口碑联名卡",
          info: "在支付宝/口碑领取会员卡获得积分"
        },
        OPEN_DIANPING: {
          name: "开通大众点评联名卡",
          info: "在大众点评领取会员卡获得积分"
        }
      },
      rule: [],
      tableData1: [],
      activeName: "second",
      header_style: {
        background: "#f2f2f2",
        "text-align": "center",
        color: "#333333",
        "font-weight": "normal",
        height: "38px"
      },
      rowStyle: {
        "text-align": "center",
        color: "#333333",
        height: "38px"
      },
      multiple: 0,
    };
  },
  created() {
    this.getsTheCurrentIntegralRules();
  },
  methods: {
    // 积分获取规则
    getsTheCurrentIntegralRules() {
      this.$httpAuth
        .post("/mall/getsTheCurrentIntegralRules")
        .then(result => {
          if (result.data.code === 10000) {
            result.data.resp.rule.forEach((val, index, arr) => {
              if (this.tableData[val.ucgrName]) {
                arr[index].name = this.tableData[val.ucgrName].name;
                arr[index].info = this.tableData[val.ucgrName].info;
              }
            });
            this.rule = result.data.resp.rule;
            this.tableData1 = result.data.resp.allBusiness;
            this.multiple = result.data.resp.birthday[0].ucgrCoin;
            this.birthdayId = result.data.resp.birthday[0].ucgrId;
          } else {
            this.$message({
              message: result.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    // 规则配置编辑
    editRules(data, key) {
      this.ucgrCoin = data.ucgrCoin;
      this.ucgrId = data.ucgrId;
      this.rulesLabel = data.name;
      this[key] = true;
    },
    // 修改积分获取
    updateRule() {
      if (numberTest(this.ucgrCoin)) {
        this.$httpAuth
          .post("/mall/updateRule", {
            ucgrCoin: this.ucgrCoin, //类型：String  必有字段  备注：比例值
            ucgrId: this.ucgrId
          })
          .then(result => {
            if (result.data.code === 10000) {
              this.$message({
                message: result.data.msg,
                type: "success"
              });
              this.dialogVisible = false;
              this.getsTheCurrentIntegralRules();
            } else {
              this.$message({
                message: result.data.msg,
                type: "warning"
              });
            }
          })
          .catch(err => {});
      } else {
        this.$message({
          message: "请填写整数",
          type: "warning"
        });
        this.getsTheCurrentIntegralRules();
      }
    },// 业态编辑
    editoperation(data, key) {
      this.ucgrCoin = data.ucgrCoin;
      this.ucgrId = data.ucgrId;
      this.rulesLabel = data.industryName;
      this[key] = true;
    },
    // 修改业态比例
    updateoperation() {
      if (oneDecimalTest(this.ucgrCoin)) {
        this.$httpAuth
          .post("/mall/updateRule", {
            ucgrCoin: this.ucgrCoin, //类型：String  必有字段  备注：比例值
            ucgrId: this.ucgrId
          })
          .then(result => {
            if (result.data.code === 10000) {
              this.$message({
                message: result.data.msg,
                type: "success"
              });
              this.operationVisible = false;
              this.getsTheCurrentIntegralRules();
            } else {
              this.$message({
                message: result.data.msg,
                type: "warning"
              });
            }
          })
          .catch(err => {});
      } else {
        this.$message({
          message: "人民币格式不正确",
          type: "warning"
        });
        this.getsTheCurrentIntegralRules();
      }
    },
    update(val,id) {
      if (oneDecimalTest(val)) {
        this.$httpAuth
          .post("/mall/updateRule", {
            ucgrCoin: val, //类型：String  必有字段  备注：比例值
            ucgrId: id
          })
          .then(result => {
            if (result.data.code === 10000) {
              this.$message({
                message: result.data.msg,
                type: "success"
              });
              this.getsTheCurrentIntegralRules();
            } else {
              this.$message({
                message: result.data.msg,
                type: "warning"
              });
            }
          })
          .catch(err => {});
      } else {
        this.$message({
          message: "倍数格式不正确",
          type: "warning"
        });
        this.getsTheCurrentIntegralRules();
      }
    },
  },
  filters: {
    name(val) {
      let str;
      _this.tableData.forEach(value => {
        if (value[val]) {
          str = value[val].name;
        }
      });
      return str;
    }
  }
};
</script>

<style lang="less" scoped>
input,
button {
  outline: none;
  border: none;
}
#get-rules {
  margin-bottom: 50px;
  .configuration {
    .title {
      font-size: 14px;
      color: #333;
      .multiple {
        width: 105px;
        height: 23px;
        text-indent: 5px;
        border: 1px solid #a9a9a9;
      }
    }
    .table table tr th {
      line-height: 60px;
      border: solid #ddd;
      border: 1px solid #797979;
      color: #333333;
      font-weight: normal;
    }
    .table table tr td {
      //  line-height: 55px;
      vertical-align: middle;
      text-align: center;
      border: 1px solid #797979;
      color: #333333;
      border-top: none;
    }
  }
  .btn-father {
    text-indent: 8%;
    margin-top: 20px;
    .el-button {
      width: 140px;
      height: 38px;
    }
  }
}
.rules_box {
  display: flex;
  align-items: center;
}
.rela{
  position: relative;
  flex: 1;
  display: flex;
  .abs{
    position: absolute;
    bottom: -30px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>