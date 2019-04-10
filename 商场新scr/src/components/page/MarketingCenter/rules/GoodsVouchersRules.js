import { specailTest, moneyTest, numberTest } from "@/libs/regular.js"
export const rules = function (that) {
    var commodityNameTest = (rules, val, callback) => {
        if (val && specailTest(val)) {
            callback(new Error("商品名称不能含有特殊字符"));
        } else if (val) {
            let judge = that.sensitiveList.some((item, index) => {
                return val.indexOf(item) > -1;
            });
            if (judge) {
                callback(new Error("商品名称不能含有敏感字"));
            } else {
                callback();
            }
        } else {
            callback();
        }
    };
    var commodityOriginalPriceTest = (rules, val, callback) => {
        if (val && !moneyTest(val)) {
            callback(new Error("金额格式不正确"));
        } else {
            callback();
        }
    };
    var commodityPreferentialPriceTest = (rules, val, callback) => {
        if (val && !moneyTest(val)) {
            callback(new Error("金额格式不正确"));
        } else {
            callback();
        }
    };
    var commoditySubtitileTest = (rules, val, callback) => {
        if (val && specailTest(val)) {
            callback(new Error("商品副标题不能含有特殊字符"));
        } else {
            callback();
        }
    };
    var commodityRestrictTest = (rules, val, callback) => {
        if (val && !numberTest(val)) {
            callback(new Error("请输入整数"));
        } else {
            callback();
        }
    };
    var commodityProvideGrossTest = (rules, val, callback) => {
        if (val && !numberTest(val)) {
            callback(new Error("请输入整数"));
        } else {
            callback();
        }
    };
    var commodityDayTest = (rules, val, callback) => {
        if (that.relativeTime===1&&val && !numberTest(val)) {
            callback(new Error("请输入整数"));
        } else if(that.relativeTime===1&&!val&&val!='0') {
            callback(new Error("必填项,请输入"));
        }else{
            callback();
        }
    };
    var commodityVoucherRestrictTest = (rules, val, callback) => {
        if (val && !numberTest(val)) {
            callback(new Error("请输入整数"));
        } else {
            callback();
        }
    };
    return {
        commodityName: [{
            required: true,
            message: "必填项,请输入",
            trigger: "blur"
        },
        {
            validator: commodityNameTest,
            trigger: "blur"
        }
        ],
        commodityOriginalPrice: [{
            required: true,
            message: "必填项,请输入",
            trigger: "blur"
        },
        {
            validator: commodityOriginalPriceTest,
            trigger: "blur"
        }
        ],
        commodityPreferentialPrice: [{
            required: true,
            message: "必填项,请输入",
            trigger: "blur"
        },
        {
            validator: commodityPreferentialPriceTest,
            trigger: "blur"
        }
        ],
        commoditySubtitile: [{
            required: true,
            message: "必填项,请输入",
            trigger: "blur"
        },
        {
            validator: commoditySubtitileTest,
            trigger: "blur"
        }
        ],
        firstPicture: [{
            required: true,
            message: "必填项,请输入",
            trigger: "change"
        }
        ],
        commodityRestrict: [{
            validator: commodityRestrictTest,
            trigger: "blur"
        }],
        commodityProvideGross: [{
                required: true,
                message: "必填项,请输入",
                trigger: "blur"
            }, {
                validator: commodityProvideGrossTest,
                trigger: "blur"
            }],
        commodityDay: [{
            validator: commodityDayTest,
            trigger: "blur"
        }],
        commodityVoucherRestrict: [{
            required: true,
            message: "必填项,请输入",
            trigger: "blur"
        }, {
            validator: commodityVoucherRestrictTest,
            trigger: "blur"
        }]
    }
}
