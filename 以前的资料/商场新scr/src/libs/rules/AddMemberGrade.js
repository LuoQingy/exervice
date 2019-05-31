export const rules = function (that) {
  var umgNametest = (rules, val, callback) => {
    let test = /^[\u4e00-\u9fa5]{1,6}$/;
    if (test.test(val)) {
      callback();
    } else {
      if(val.length>6){
        callback(new Error("长度不能超过6个汉字"));
      }else{
        callback(new Error("不支持特殊字符"));
      }
    }
  };
  var umgDiscounttest = (rules, val, callback) => {
    let test = /^(?=1\.[1-9]|[2-9]\.\d).{3}$|^([1-9])$/;
    if (that.umgIsDiscount) {
      if (test.test(val)) {
        that.ruleForm.umgDiscount = Number(val).toFixed(1);
        callback();
      } else {
        callback(new Error("请填写1.1-9.9之间的的数字，保留一位小数"));
      }
    } else {
      callback();
    }
  };
  var umgCoinExpeditetest = (rules, val, callback) => {
    let test = /^(?=1\.[1-9]|\d{1,2}\.\d).{3,4}$|^([1-9])\d{0,1}$/;
    if (that.umgIsCoinExpedite) {
      if (test.test(val) && val > 1) {
        that.ruleForm.umgCoinExpedite = Number(val).toFixed(1);
        callback();
      } else {
        callback(new Error("请填写1.1-99.9之间的的数字，保留一位小数"));
      }
    } else {
      callback();
    }
  };
  var umgUpgradeGiveCointest = (rules, val, callback) => {
    let test = /^[1-9]\d{0,4}$/;
    if (that.umgIsUpgradeGiveCoin) {
      if (test.test(val)) {
        callback();
      } else {
        callback(new Error("请填写1-99999之间的的数字"));
      }
    } else {
      callback();
    }
  };
  var positive = (rules, val, callback) => {
    let test = /^[1-9]\d{0,}$/;
    if (test.test(val)) {
      callback();
    } else {
      callback(new Error("请填写正整数"));
    }
  };
  return {
    umgUpgradeCondition: [{
        required: true,
        message: "必填项,请输入",
        trigger: "blur"
      },
      {
        validator: positive,
        trigger: "blur"
      }
    ],
    umgName: [{
        required: true,
        message: "必填项,请输入",
        trigger: "blur"
      },
      {
        validator: umgNametest,
        trigger: "blur"
      }
    ],
    umgDiscount: [{
      validator: umgDiscounttest,
      trigger: "blur"
    }],
    umgCoinExpedite: [{
      validator: umgCoinExpeditetest,
      trigger: "blur"
    }],
    umgUpgradeGiveCoin: [{
      validator: umgUpgradeGiveCointest,
      trigger: "blur"
    }],
  }
}
