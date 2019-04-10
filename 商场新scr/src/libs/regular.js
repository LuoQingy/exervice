
let specailReg= /[@#\$%\^&\*\s]+/;                //校验特殊字符和空格

let allSpecailReg = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、\s]/;   //校验绝大部分的特殊字符和空格
 
let bracketsReg= /[【】]+/;                       //校验特特殊字符【】

let telReg=/^1[34578]\d{9}$/;                    //校验十一位手机

let phoneReg = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;  //手机检验，不知道是不是最全的

let numberReg =/^[0-9]*$/;                        //数字检验

let fiveNumberReg = /^[1-9]\d{0,4}$/;             //检验1-99999之间的整数

let numberRangeReg = /^(?=1\.[1-9]|\d{1}\.\d).{2,3}$|^([1-9])\d{0,1}$/;   //1.0到9.9 可以有一位小数

let oneDecimalReg = /^(([0-9]*)|(([0]\.\d{1}|[1-9][0-9]*\.\d{1})))$/;     //数字 可以有一位小数

let hourReg = /^(([1-9])|(1\d)|(2[0-4]))$/;                               //检验24小时

let moneyReg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;  //检验金额

let mailReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;    //检验邮箱

let websiteReg = /^(http|https):\/\/.*/;    //http|https网址检验

let passwordReg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,}$/;

let IDReg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/; //检验身份证

let cardReg = /([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼领]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼领]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})/;

export const numberTest = (str)=> numberReg.test(str);             //数字检验
export const specailTest = (str)=> specailReg.test(str);           //校验特殊字符和空格
export const phoneTest = (str)=> telReg.test(str);                 //校验手机
export const telTest = (str)=> phoneReg.test(str);                 //校验十一位手机
export const numberRangeTest = (str)=> numberRangeReg.test(str);   //1.0到9.9 可以有一位小数
export const bracketsTest = (str)=> bracketsReg.test(str);         //校验特特殊字符【】
export const fiveNumberTest = (str)=> fiveNumberReg.test(str);     //检验1-99999之间的整数
export const hourTest = (str)=> hourReg.test(str);                 //检验24小时
export const oneDecimalTest = (str)=> oneDecimalReg.test(str);     //数字 可以有一位小数
export const mailTest = (str)=> mailReg.test(str);                 //检验24小时
export const IDTest = (str)=> IDReg.test(str);                     //检验身份证
export const cardTest = (str)=> cardReg.test(str);                 //检验车牌号
export const moneyTest = (str)=> moneyReg.test(str);               //检验金额
export const websiteTest = (str)=> websiteReg.test(str);           //检验http https 网址
export const passwordTest = (str)=> passwordReg.test(str);         //密码检验