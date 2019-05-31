import {specailTest,numberTest} from "@/libs/regular.js";
export const rules = function (that) {
    var planName = (rules, val, callback) => {
        if (specailTest(val)) {
          callback(new Error("计划名称不能包含特殊字符和空格"));
        } else {
          callback();
        }
      };
      var sceneDay = (rules, val, callback) => {
        console.log("val",val)
        if (numberTest(val) && that.effectType === 2) {
          callback();
        } else if (that.effectType === 2) {
          callback(new Error("请填写正整数"));
        } else {
          callback();
        }
      };
    return {
        planName: [
            {
              required: true,
              message: "必填项,请输入",
              trigger: "blur"
            },
            {
              validator: planName,
              trigger: "blur"
            }
          ],
          sceneDay: [
            {
              validator: sceneDay,
              trigger: "blur"
            },
            {
              required: true,
              message: "选择项请输入天数",
              trigger: "blur"
            }
          ],
          input1: [
            {
              required: true,
              message: "请输入推送次数",
              trigger: "blur"
            },
            {
              validator: sceneDay,
              trigger: "blur"
            }
          ]
    }
  }
  