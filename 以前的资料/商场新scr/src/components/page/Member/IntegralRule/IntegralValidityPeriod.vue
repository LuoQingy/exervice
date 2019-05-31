<template>
  <div id="integralExchange">
    <div class="integralExchange-content">
      <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm">
        <el-form-item label="积分有效期：" prop="uciCoinValidity">
          <el-radio v-model="ruleForm.uciCoinValidity" label="1">长期有效</el-radio>
          <el-radio v-model="ruleForm.uciCoinValidity" label="2">自然年内有效</el-radio>
        </el-form-item>
        <div v-if="ruleForm.uciCoinValidity ==='2'">
          <el-form-item label="清零规则：" style="margin-left:5px;" prop="uciResetRule">
            <div>
              <span>每自然年的</span>
              <el-date-picker v-model="ruleForm.uciResetRule" format="MM-dd" value-format="MM-dd" type="date" placeholder="选择日期"></el-date-picker>
              <span>系统自动清零(设置后会在这一天的00:00清零)</span>
            </div>
          </el-form-item>
          <el-form-item style="margin-left:5px;" prop="uciDays">
            <div style="margin-top:10px;">
              <el-checkbox v-model="ruleForm.uciIsUseRemainCoin"></el-checkbox>
              <span>在</span>
              <el-input v-model="ruleForm.uciDays" size="mini" style="width:126px;" placeholder="请输入天数"></el-input>
              <span>天前会员所剩下的积分，可以延长至下一年的12月31日00:00之前。</span>
            </div>
          </el-form-item>
          <el-form-item label="微信通知：" style="margin-left:5px;" prop="uciWechatInform">
            <div>
              <span>含且超过</span>
              <el-input v-model="ruleForm.uciWechatInform" size="mini" style="width:126px;"></el-input>
              <span>积分量(不填，则默认为不限积分，但积分为0的会员不发通知)</span>
            </div>
            <div class="rules" style="margin-top:10px;">
              <span class="rules_label">在积分清零前</span>
              <el-radio-group v-model="wxCheckedDay">
                <el-radio label="30">30天通知</el-radio>
                <el-radio label="15">15天通知</el-radio>
                <el-radio label="10">10天通知</el-radio>
                <el-radio label="5">5天通知</el-radio>
                <el-radio label="1">1天通知</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item label="短信通知：" style="margin-left:5px;" prop="uciSmsInform">
            <div>
              <span>含且超过</span>
              <el-input v-model="ruleForm.uciSmsInform" size="mini" style="width:126px;"></el-input>
              <span>积分量(不填，则默认为不限积分，但积分为0的会员不发通知)</span>
            </div>
            <div class="rules" style="margin-top:10px;">
              <span class="rules_label">在积分清零前</span>
              <el-radio-group v-model="checkedDay">
                <el-radio label="30">30天通知</el-radio>
                <el-radio label="15">15天通知</el-radio>
                <el-radio label="10">10天通知</el-radio>
                <el-radio label="5">5天通知</el-radio>
                <el-radio label="1">1天通知</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
        </div>
      </el-form>
      <div class="memo-hints" v-if="ruleForm.uciCoinValidity ==='2'">
        <span>*为避免对同一会员多次进行清零，故一旦提交，不可更改。</span>
      </div>
      <div class="btn-father" v-if="!hasdata">
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <el-button type="primary" @click="goback">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import bus from "@/components/common/bus.js";
import {numberTest} from "@/libs/regular.js";
export default {
  data() {
    var positive = (rules, val, callback) => {
      if (numberTest(val)) {
        callback();
      } else if (val) {
        callback(new Error("请填写正整数"));
      } else {
        callback();
      }
    };
    var positive2 = (rules, val, callback) => {
      if (numberTest(val)) {
        callback();
      } else if (this.ruleForm.uciIsUseRemainCoin) {
        callback(new Error("请填写正整数"));
      } else {
        callback();
      }
    };
    return {
      hasdata: false,
      ruleForm: {
        uciCoinValidity: "1",
        uciResetRule: "",
        uciIsUseRemainCoin: false,
        uciDays: null,
        uciWechatInform: null,
        uciSmsInform: null
      },
      wxCheckedDay: 0,
      checkedDay: 0,
      miao: 86400,
      rules: {
        uciCoinValidity: [
          { required: true, message: "请选择积分有效期", trigger: "blur" }
        ],
        uciResetRule: [
          { required: true, message: "请输入清零时间", trigger: "blur" }
        ],
        uciDays: [{ validator: positive2, trigger: "blur" }],
        uciWechatInform: [{ validator: positive, trigger: "blur" }],
        uciSmsInform: [{ validator: positive, trigger: "blur" }]
      }
    };
  },
  created() {
    this.getUsersCoinValidityByMall();
  },
  methods: {
    // 提交保存
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let uciWechatInformJson = this.wxCheckedDay * this.miao;
          let uciSmsInformJson = this.checkedDay * this.miao;
          this.$httpAuth
            .post("mall/addUsersCoinValidity", {
              uciCoinValidity: this.ruleForm.uciCoinValidity, //类型：String  必有字段  备注：积分有效期(1:长期有效 2:自然年内有效)
              uciResetRule: this.ruleForm.uciResetRule, //类型：String  必有字段  备注："清零规则(每自然年的x系统自动清零(设置后会在这一天的00:00清零)) "
              uciIsUseRemainCoin: this.ruleForm.uciIsUseRemainCoin, //类型：Boolean  必有字段  备注：无
              uciDays: this.ruleForm.uciDays ? this.ruleForm.uciDays : 0, //类型：Number  必有字段  备注：x天(上面字段为true时生效)
              uciWechatInform: this.ruleForm.uciWechatInform
                ? this.ruleForm.uciWechatInform
                : 0, //类型：Number  必有字段  备注：微信通知(不填，则默认为不限积分，但积分为0的会员不发通知)
              uciWechatInformJson: uciWechatInformJson, //类型：Number  必有字段  备注："微信通知前几天通知(存秒数 json格式) "
              uciSmsInform: this.ruleForm.uciSmsInform
                ? this.ruleForm.uciSmsInform
                : 0, //类型：Number  必有字段  备注：短信通知(不填，则默认为不限积分，但积分为0的会员不发通知)
              uciSmsInformJson: uciSmsInformJson
            })
            .then(result => {
              if (result.data.code === 10000) {
                this.$message({
                  message: result.data.resp,
                  type: "success"
                });
                this.goback();
              } else {
                this.$message({
                  message: result.data.msg,
                  type: "warning"
                });
              }
            })
            .catch(err => {});
        } else {
          console.log("error submitform!!");
          return false;
        }
      });
    },
    // 获取积分有效期设定
    getUsersCoinValidityByMall() {
      this.$httpAuth
        .get("mall/getUsersCoinValidityByMall")
        .then(result => {
          if (result.data.code === 10000) {
            if (result.data.resp) {
              let resp = result.data.resp;
              this.hasdata = true;
              this.ruleForm.uciCoinValidity = resp.uciCoinValidity.toString();
              if (resp.uciCoinValidity.toString() === "2") {
                this.ruleForm.uciResetRule = resp.uciResetRule;
                this.ruleForm.uciIsUseRemainCoin = resp.uciIsUseRemainCoin;
                this.ruleForm.uciDays = resp.uciDays;
                this.ruleForm.uciWechatInform = resp.uciWechatInform;
                this.ruleForm.uciSmsInform = resp.uciSmsInform;
                this.wxCheckedDay = (
                  +resp.uciWechatInformJson / this.miao
                ).toString();
                this.checkedDay = (
                  +resp.uciSmsInformJson / this.miao
                ).toString();
              }
            }
          } else {
            this.$message({
              message: result.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    //返回
    goback() {
      bus.$emit("closetags");
      this.$router.push(
        "/member/MenberSetting/integralRule/integralAcquisition"
      );
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
#integralExchange {
  width: 100%;
  min-width: 900px;
  .integralExchange-content {
    margin-left: 70px;
    .el-form {
      .el-form-item {
        .rules {
          display: flex;
          align-items: center;
          .rules_label {
            margin-right: 10px;
          }
          .rules_right {
            margin-left: 26px;
          }
        }
      }
    }
    .memo-hints {
      font-size: 14px;
      color: #ff0000;
      text-indent: 45px;
    }
    .btn-father {
      text-indent: 30px;
      margin-top: 20px;
      margin-left: 95px;
      .el-button {
        width: 140px;
        height: 38px;
      }
    }
  }
}
</style>