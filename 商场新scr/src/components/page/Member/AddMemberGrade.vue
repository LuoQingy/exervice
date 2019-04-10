<template>
  <div>
    <div>
      <el-breadcrumb separator="/" class="content_title">
        <el-breadcrumb-item :to="{ path: '/member/MenberSetting/shipsetting' }">会员等级设置</el-breadcrumb-item>
        <el-breadcrumb-item>添加会员等级</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="升级条件:" prop="umgUpgradeCondition">
          <span>累计消费积分达</span>
          <el-input v-model.number="ruleForm.umgUpgradeCondition" style="width:150px;" size="mini"></el-input>
          <span>积分</span>
        </el-form-item>
        <el-form-item label="会员等级名称:" prop="umgName">
          <el-input v-model="ruleForm.umgName" style="width:30%;" size="mini" maxlength="6">
            <span slot='suffix'>{{ruleForm.umgName.length}}/6</span>
          </el-input>
          <p class="tips">名称不能为空，且长度不能超过6个汉字</p>
        </el-form-item>
        <el-form-item label="会员卡图片:" required>
          <div style="display:flex;">
            <elupload @uploadimg="upload" @delimg="delimg" :size="0.3" :type="['jpg','png']" :imglist="imglist"></elupload>
          </div>
          <p class="tips">建议尺寸680*280px,上传jpg,png类型图片，大小不超过300kb.</p>
        </el-form-item>
        <el-form-item label="会员卡特权:">
          <el-form-item label-width="0" prop="umgDiscount">
            <div>
              <el-checkbox v-model="umgIsDiscount"></el-checkbox>
              <el-input v-model="ruleForm.umgDiscount" style="width:150px;" size="mini"></el-input>
              <span>折&nbsp;&nbsp;会员折扣</span>
            </div>
            <p class="tips">&nbsp;&nbsp;&nbsp;&nbsp;请填写1.1-9.9之间的的数字，保留一位小数</p>
          </el-form-item>
          <el-form-item label-width="0" prop="umgCoinExpedite">
            <div>
              <el-checkbox v-model="umgIsCoinExpedite"></el-checkbox>
              <el-input v-model="ruleForm.umgCoinExpedite" style="width:150px;" size="mini"></el-input>
              <span>倍积分加速</span>
            </div>
            <p class="tips">&nbsp;&nbsp;&nbsp;&nbsp;请填写1.1-99.9之间的的数字，保留一位小数</p>
          </el-form-item>
          <div>
            <div>
              <el-checkbox v-model="umgIsGivePark"></el-checkbox>
              <span>消费后获取积分送免费停车时长</span>
              <el-button type="primary" size="mini" v-show="umgIsGivePark" :disabled="adddisabled" @click="addGivePark">添加规则</el-button>
            </div>
            <ul v-if="umgIsGivePark">
              <template v-for="(item,index) in usersMemberGradeGiveParkList">
                <li class="rules_list">
                  <div class="rules">
                    <span class="rules_label">规则{{index+1}}:限定</span>
                    <el-checkbox-group v-model="types[index]" @change="checkchang">
                      <el-checkbox label="1" name="type" :disabled="disabled(index,1)">周一</el-checkbox>
                      <el-checkbox label="2" name="type" :disabled="disabled(index,2)">周二</el-checkbox>
                      <el-checkbox label="3" name="type" :disabled="disabled(index,3)">周三</el-checkbox>
                      <el-checkbox label="4" name="type" :disabled="disabled(index,4)">周四</el-checkbox>
                      <el-checkbox label="5" name="type" :disabled="disabled(index,5)">周五</el-checkbox>
                      <el-checkbox label="6" name="type" :disabled="disabled(index,6)">周六</el-checkbox>
                      <el-checkbox label="7" name="type" :disabled="disabled(index,7)">周日</el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <el-form-item label="消费后获取">
                    <span class="rules_input">
                      <el-input v-model="item.umggpCoin" @blur="umggpCoinBlur(index,item.umggpCoin)" style="width:80px;" size="mini"></el-input>
                      <span>分</span>
                      <span class="rules_text">请填写1-99999之间的整数</span>
                    </span>
                    <span>赠送当日免费停车</span>
                    <span class="rules_input">
                      <el-input
                        v-model="item.umggpParkDuration"
                        @blur="umggpParkDurationBlur(index,item.umggpParkDuration)"
                        style="width:80px;"
                        size="mini"
                      ></el-input>
                      <span class="rules_text">请填写1-24之间的整数</span>
                    </span>
                    <span>小时</span>
                    <el-button type="text" size="small" @click="delGivePark(index)">删除</el-button>
                  </el-form-item>
                </li>
              </template>
            </ul>
          </div>
        </el-form-item>
        <el-form-item prop="umgUpgradeGiveCoin">
          <div>
            <el-checkbox v-model="umgIsUpgradeGiveCoin"></el-checkbox>
            <span>升级送</span>
            <el-input v-model="ruleForm.umgUpgradeGiveCoin" style="width:150px;" size="mini"></el-input>
            <span>积分</span>
          </div>
          <p class="tips">&nbsp;&nbsp;&nbsp;&nbsp;请填写1-99999之间的的数字</p>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
          <el-button type="primary" @click="resetForm('ruleForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
  
<script>
import { rules } from "@/libs/rules/AddMemberGrade.js";
import { formdata } from "@/libs/formdata.js";
import bus from "@/components/common/bus.js";
import elupload from "../UploadImg/Elupload";
import {fiveNumberTest,hourTest} from "@/libs/regular.js";
export default {
  components: {
    elupload
  },
  data() {
    return {
      path: "mall/addMemberGrade",
      umgId: "",
      imglist: [],
      umgIsDiscount: false,
      umgIsCoinExpedite: false,
      umgIsGivePark: false,
      umgIsUpgradeGiveCoin: false,
      types: [[]],
      adddisabled: false,
      usersMemberGradeGiveParkList: [
        {
          umggpCoin: "",
          umggpParkDuration: "",
          umggpPeriod: ""
        }
      ],
      ruleForm: {
        umgUpgradeCondition: "",
        umgName: "",
        umgDiscount: "",
        umgCoinExpedite: "",
        umggpCoin: "",
        umggpParkDuration: "",
        umgUpgradeGiveCoin: ""
      },
      rules: rules(this)
    };
  },
  methods: {
    // 编辑时获取会员等级信息
    getMemberGradeInfo(umgId) {
      this.$httpAuth
        .post("mall/getMemberGradeInfo", {
          mall: 1,
          umgId
        })
        .then(result => {
          if (result.data.code === 10000) {
            let data = result.data.resp;
            this.imglist.splice(0, 1, data.umgImagesUrl);
            this.umgIsDiscount = data.umgIsDiscount;
            this.umgIsCoinExpedite = data.umgIsCoinExpedite;
            this.umgIsGivePark = data.umgIsGivePark;
            this.umgIsUpgradeGiveCoin = data.umgIsUpgradeGiveCoin;
            this.usersMemberGradeGiveParkList =
              data.usersMemberGradeGiveParkList;
            this.ruleForm.umgUpgradeCondition = data.umgUpgradeCondition;
            this.ruleForm.umgName = data.umgName;
            this.ruleForm.umgDiscount = data.umgDiscount;
            this.ruleForm.umgCoinExpedite = data.umgCoinExpedite;
            this.ruleForm.umggpCoin = data.umggpCoin;
            this.ruleForm.umggpParkDuration = data.umggpParkDuration;
            this.ruleForm.umgUpgradeGiveCoin = data.umgUpgradeGiveCoin;
            if (data.umgIsGivePark) {
              data.usersMemberGradeGiveParkList.forEach((val, index) => {
                this.types[index] = val.umggpPeriod.split(",");
              });
            }
          } else {
          }
        })
        .catch(err => {});
    },
    // 赠送积分
    umggpCoinBlur(index, val) {
      if (!fiveNumberTest(val)) {
        this.usersMemberGradeGiveParkList[index].umggpCoin = "";
        this.$message({
          message: "请填写1-99999之间的整数",
          type: "warning"
        });
      }
    },
    // 赠送停车时长
    umggpParkDurationBlur(index, val) {
      if (!hourTest(val)) {
        this.usersMemberGradeGiveParkList[index].umggpParkDuration = "";
        this.$message({
          message: "请填写1-24之间的整数",
          type: "warning"
        });
      }
    },
    // 组件上传图片
    upload(val) {
      this.imglist.splice(0, 1, val);
    },
    // 组件删除图片
    delimg(val) {
      this.imglist.splice(val, 1);
    },
    // 添加规则
    addGivePark() {
      if (this.umgIsGivePark) {
        this.usersMemberGradeGiveParkList.push({
          umggpCoin: "",
          umggpParkDuration: "",
          umggpPeriod: ""
        });
        this.types.push([]);
      } else {
        return;
      }
    },
    //删除规则
    delGivePark(index) {
      this.usersMemberGradeGiveParkList.splice(index, 1);
      this.types.splice(index, 1);
    },
    // 选择中的chekbox,其他的disable
    disabled(indexs, index) {
      let dis = false;
      this.types.forEach((value, num) => {
        if (indexs == num) {
          // 过滤当前选择的规则
          return;
        } else {
          // 其他选择的规则操作
          value.forEach(v => {
            if (v == index) {
              dis = true;
            }
          });
        }
      });
      return dis;
    },
    // 判断是否还有时间选择
    checkchang() {
      let len = 0;
      let arr = [];
      this.types.forEach((val, index) => {
        len += val.length;
        if (val.length === 0) {
          arr.push(index);
        }
      });
      if (len === 7) {
        this.adddisabled = true;
        let num = 0;
        if (arr.length > 0) {
          arr.forEach(val => {
            console.log(val + num);
            this.types.splice(val + num, 1);
            this.usersMemberGradeGiveParkList.splice(val + num, 1);
            num--;
          });
        }
      } else {
        this.adddisabled = false;
      }
    },
    // 提交修改 添加
    submitForm(formName) {
      let allvalue;
      this.types.forEach((value, index) => {
        if (this.umgIsGivePark && !value.toString()) {
          this.$message({
            message: "请选择规则实行的日期",
            type: "warning"
          });
          allvalue = false;
          return false;
        }
        if (
          this.umgIsGivePark &&
          (!this.usersMemberGradeGiveParkList[index].umggpCoin ||
            !this.usersMemberGradeGiveParkList[index].umggpParkDuration)
        ) {
          this.$message({
            message: "请设置消费获取积分和停车时长",
            type: "warning"
          });
          allvalue = false;
          return false;
        }
        this.usersMemberGradeGiveParkList[index].umggpPeriod = value.toString();
        allvalue = true;
        return true;
      });
      if (!allvalue) {
        return false;
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.imglist[0]) {
            this.$message({
              message: "请添加图片",
              type: "warning"
            });
          }
          this.$httpAuth
            .post(this.path, {
              umgId: this.umgId,
              umgCoinExpedite:this.umgIsCoinExpedite?this.ruleForm.umgCoinExpedite:null,
              umgImagesUrl: this.imglist[0],
              umgIsCoinExpedite: this.umgIsCoinExpedite,
              umgDiscount:this.umgIsDiscount?this.ruleForm.umgDiscount:null,
              umgIsDiscount: this.umgIsDiscount,
              umgIsGivePark: this.umgIsGivePark,
              umgIsUpgradeGiveCoin: this.umgIsUpgradeGiveCoin,
              umgName: this.ruleForm.umgName,
              umgSerialNumber: 1,
              umgUpgradeCondition:this.ruleForm.umgUpgradeCondition,
              umgUpgradeGiveCoin:this.umgIsUpgradeGiveCoin ? this.ruleForm.umgUpgradeGiveCoin:null,
              usersMemberGradeGiveParkList: this.umgIsGivePark
                ? this.usersMemberGradeGiveParkList
                : []
            })
            .then(res => {
              if (res.data.code === 10000) {
                this.$message({
                  message: res.data.resp,
                  type: "success"
                });
                this.resetForm("ruleForm");
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "warning"
                });
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 重置并返回列表页面
    resetForm(formName) {
      this.$refs[formName].resetFields();
      bus.$emit("closetags");
      this.$router.push("/member/MenberSetting/shipsetting");
    }
  },
  created() {
    const umgId = this.$route.query.umgId;
    if (umgId) {
      this.path = "/mall/updateMemberGrade";
      this.umgId = umgId;
      this.getMemberGradeInfo(umgId);
    }
  }
};
</script>
  
<style scoped lang='less'>
.demo-ruleForm {
  margin-top: 15px;
  margin-left: 40px;
}
.upload_box {
  width: 100px;
  height: 100px;
  display: inline-block;
  border: 1px dashed #cccccc;
  .upload_icon {
    font-size: 30px;
    color: #969696;
    line-height: 100px;
  }
}
.upload_img {
  width: 100px;
  height: 100px;
}
.tips {
  color: #969696;
  font-size: 12px;
}
.rules_list {
  margin-bottom: 30px;
  .rules {
    display: flex;
    .rules_label {
      margin-right: 10px;
    }
  }
}
.rules_input {
  position: relative;
  margin-right: 10px;
  .rules_text {
    position: absolute;
    bottom: -38px;
    left: 0;
    width: 200px;
    color: #969696;
    font-size: 12px;
  }
}
</style>