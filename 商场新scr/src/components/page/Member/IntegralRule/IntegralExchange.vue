<template>
  <div id="integralExchange">
    <div class="word-title">
      <p class="warning"> <span class="el-icon-warning"> </span> 在订单结算时，会员可直接用积分抵扣金额(到分)，该部分抵扣金额，由平台承担。当配置为0时，表示积分不能抵扣金额。</p>
    </div>
    <div class="integralExchange-content">
      <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm">
        <el-form-item label="消费抵现：">
          <el-checkbox v-model="ruleForm.uccrIsUseSpendCash">开启</el-checkbox>
        </el-form-item>
        <el-form-item label="兑换规则：" style="margin-left:5px;" prop="uccrSpendConversion">
          <span>每</span>
          <el-input-number size="small"  v-model="ruleForm.uccrSpendConversion" controls-position="right" :disabled="!ruleForm.uccrIsUseSpendCash" style="width:150px;" :min="0" type="number"></el-input-number>
          <span>积分可抵扣一元</span>
        </el-form-item>
        <el-form-item label="兑换限制：" style="margin-left:5px;" prop="uccrSpendRestrict">
          <div>
            <span>积分抵扣金额不能超过订单实付金额的</span>
            <el-input-number size="small" v-model="ruleForm.uccrSpendRestrict" controls-position="right" :disabled="!ruleForm.uccrIsUseSpendCash" style="width:150px;" :min="0" :max="100" type="number"></el-input-number>
            <span>%</span>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="rules" style="margin-top:5px;">
            <span class="rules_label">仅限</span>
            <el-checkbox-group :disabled="!ruleForm.uccrIsUseSpendCash" v-model="ruleForm.uccrUseWeek">
              <el-checkbox label="1" name="type">周一</el-checkbox>
              <el-checkbox label="2" name="type">周二</el-checkbox>
              <el-checkbox label="3" name="type">周三</el-checkbox>
              <el-checkbox label="4" name="type">周四</el-checkbox>
              <el-checkbox label="5" name="type">周五</el-checkbox>
              <el-checkbox label="6" name="type">周六</el-checkbox>
              <el-checkbox label="7" name="type">周日</el-checkbox>
            </el-checkbox-group>
            <span class="rules_right">可使用</span>
          </div>
        </el-form-item>
        <el-form-item label="停车抵现：">
          <el-checkbox v-model="ruleForm.uccrIsUseParkDeduction">开启</el-checkbox>
        </el-form-item>
        <el-form-item label="兑换规则：" style="margin-left:5px;" prop="uccrParkConversion">
          <div>
            <span>每</span>
            <el-input-number size="small" v-model="ruleForm.uccrParkConversion" controls-position="right" :disabled="!ruleForm.uccrIsUseParkDeduction" style="width:150px;" :min="0" type="number"></el-input-number>
            <span>积分可抵扣1小时停车费,不足1小时的均按1小时算</span>
          </div>
        </el-form-item>
        <el-form-item label="兑换限制：" style="margin-left:5px;" prop="uccrParkRestrict">
          <div>
            <span>每日积分可抵扣停车时长为</span>
            <el-input-number size="small"  v-model="ruleForm.uccrParkRestrict" controls-position="right" :disabled="!ruleForm.uccrIsUseParkDeduction" style="width:150px;" :min="0" :max="24" type="number"></el-input-number>
            <span>小时</span>
            <span style="margin-left:40px;">注：抵扣时长为整数。</span>
          </div>
        </el-form-item>
        <el-form-item>
          <div style="margin-top:10px;">
            <el-button type="primary" @click="modifyThePointsRedemptionRules('ruleForm')">保存</el-button>
            <el-button type="primary" @click="goback">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import bus from "@/components/common/bus.js";
import {numberTest} from "@/libs/regular.js";
export default {
  data() {
    var positiveinteger = (rules, val, callback) => {
      if (numberTest(val) && this.ruleForm.uccrIsUseSpendCash) {
        callback();
      } else if (this.ruleForm.uccrIsUseSpendCash) {
        callback(new Error("请填写正整数"));
      } else {
        callback();
      }
    };
    var positiveinteger2 = (rules, val, callback) => {
      if (numberTest(val) && this.ruleForm.uccrIsUseParkDeduction) {
        callback();
      } else if (this.ruleForm.uccrIsUseParkDeduction) {
        callback(new Error("请填写正整数"));
      } else {
        callback();
      }
    };
    return {
      activeName: "second",
      ruleForm: {
        uccrIsUseSpendCash: false,
        uccrSpendConversion: "",
        uccrSpendRestrict: "",
        uccrIsUseParkDeduction: false,
        uccrParkConversion: "",
        uccrParkRestrict: "",
        uccrUseWeek: ["1", "3"]
      },
      rules: {
        uccrSpendConversion: [{ validator: positiveinteger, trigger: "blur" }],
        uccrSpendRestrict: [{ validator: positiveinteger, trigger: "blur" }],
        uccrParkConversion: [{ validator: positiveinteger2, trigger: "blur" }],
        uccrParkRestrict: [{ validator: positiveinteger2, trigger: "blur" }]
      }
    };
  },
  created() {
    this.getMemberPointsRedemptionRules();
  },
  methods: {
    // 获取积分兑换规则
    getMemberPointsRedemptionRules() {
      this.$xwhttpAuth
        .post("/mall/getMemberPointsRedemptionRules")
        .then(result => {
          if (result.data.code === 10000) {
            let resp = result.data.resp;
            this.ruleForm.uccrIsUseSpendCash = resp.uccrIsUseSpendCash;
            this.ruleForm.uccrSpendConversion = resp.uccrSpendConversion;
            this.ruleForm.uccrSpendRestrict = resp.uccrSpendRestrict;
            this.ruleForm.uccrIsUseParkDeduction = resp.uccrIsUseParkDeduction;
            this.ruleForm.uccrParkConversion = resp.uccrParkConversion;
            this.ruleForm.uccrParkRestrict = resp.uccrParkRestrict;
            this.uccrId = resp.uccrId;
            this.ruleForm.uccrUseWeek = resp.uccrUseWeek.split(",");
          }
        })
        .catch(err => {});
    },
    // 设置积分兑换规则
    modifyThePointsRedemptionRules() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$httpAuth
            .post("mall/modifyThePointsRedemptionRules", {
              uccrId: this.uccrId, //类型：Number  必有字段  备注：无
              mallId: 1, //类型：Number  必有字段  备注：无
              uccrIsUseSpendCash: this.ruleForm.uccrIsUseSpendCash, //类型：Boolean  必有字段  备注：是否开启消费抵现
              uccrSpendConversion: this.ruleForm.uccrSpendConversion, //类型：Number  必有字段  备注：消费兑换规则(每x积分可抵扣一元)
              uccrSpendRestrict: this.ruleForm.uccrSpendRestrict, //类型：Number  必有字段  备注：消费兑换限制(积分抵扣金额不能超过订单实付金额x%)
              uccrIsUseParkDeduction: this.ruleForm.uccrIsUseParkDeduction, //类型：Boolean  必有字段  备注：是否开启停车抵扣
              uccrParkConversion: this.ruleForm.uccrParkConversion, //类型：Number  必有字段  备注：停车兑换规则(每x积分可抵扣1小时停车费)
              uccrParkRestrict: this.ruleForm.uccrParkRestrict, //类型：Number  必有字段  备注：停车兑换限制(每日积分可抵扣停车时长为x小时)
              uccrUseWeek: this.ruleForm.uccrUseWeek.join(",")
            })
            .then(result => {
              if (result.data.code === 10000) {
                this.$message({
                  message: '保存成功',
                  type: "success"
                });
                this.goback()
              }
            })
            .catch(err => {});
        }
      });
    },
    //返回
    goback() {
      bus.$emit("closetags");
      this.$router.push("/member/MenberSetting/integralRule/integralAcquisition");
    }
  }
};
</script>

<style lang="less" scoped>
.warning{
  background: #f9f9f9;
  padding-left: 15px;
}
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
  .word-title {
    line-height: 40px;
    font-size: 15px;
    color: #666;
    span {
      padding: 0px 3px;
    }
  }
  .integralExchange-content {
    margin-left: 70px;
    .el-form {
      .el-form-item {
        .rules {
          display: flex;
          .rules_label {
            margin-right: 10px;
          }
          .rules_right {
            margin-left: 26px;
          }
        }
        .el-button {
          width: 140px;
          height: 38px;
        }
      }
    }
  }
}
</style>