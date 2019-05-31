/**
 * Created by roySu
 */
import {
  formdata
} from '../libs/formdata';
/**
 * 格式化日期
 * @param time
 * @param cFormat
 * @return {string}
 */

export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return ''
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

/**
 * @param {String,Number} type 传进来状态
 * @param {Array} arr 校验的数组
 * @param {String} replace 可选,校验的字段
 */
/**
 * 9 轮播图模块
 * 10 单列图片模块
 * 14 公告模块
 * 15 标题模块
 * 16 楼层模块
 * 17 优惠券模块
 * 18 限时抢购模块
 */
let eleArr = [{
    name: "BannerModel",
    componentName: "轮播图模块",
    id: 9
  },
  {
    name: "ImgText",
    componentName: "单列图片模块",
    id: 10
  },
  {
    name: "NoticeMent",
    componentName: "公告模块",
    id: 14
  },
  {
    name: "VTitle",
    componentName: "标题模块",
    id: 15
  },
  {
    name: "Floor",
    componentName: "楼层模块",
    id: 16
  },
  {
    name: "CouponList",
    componentName: "优惠券模块",
    id: 17
  },
  {
    name: "FlashSale",
    componentName: "限时抢购模块",
    id: 18
  },
  {
    name: "NavTab",
    componentName: "限时抢购模块",
    id: 19
  },
]
export function getObjById(type, replace) {
  replace = replace || 'id';
  let obj = {};
  for (let i = 0; i < eleArr.length; i++) {
    if (eleArr[i][replace] == type) {
      obj = eleArr[i];
      obj.index = i;
      break;
    }
  }
  return obj;
}

/**
 * 复制一个对象
 * @param {object} obj 
 */
export function cloneObj(obj) {
  if (typeof obj !== 'object') {
    return {};
  }
  return JSON.parse(JSON.stringify(obj));
}

/**
 * 设置分页数
 */
export function setTotalSize(total, page, key) {
  key = key || '';
  if (page == 0) {
    sessionStorage.setItem('totalSize' + key, total);
    return total;
  } else {
    return parseInt(sessionStorage.getItem('totalSize' + key) || 0);
  }
}
/**
 * @param {Number} ai 传进来的价格 
 */
export function formatMoney(ai) {
  if (!ai) {
    return 0.00;
  }
  let number = ai,
    negative = number < 0 ? '-' : '',
    i = parseInt(number = Math.abs(+number || 0).toFixed(2), 10) + '';
  return negative + i + '.' + Math.abs(number - i).toFixed(2).slice(2);
}

export function dataLeftCompleting(bits, identifier, value) {
  value = Array(bits + 1).join(identifier) + value;
  return value.slice(-bits);
}

/**
 * 调用图片上传接口
 * @param url 上传地址
 * @param fileData 图片数据
 * @param callback 回调函数
 */
export function uploadPic(url, fileData, callback) {
  let _this = this
  let formData = formdata({
    'role': 1,
    'file': fileData
  })
  let xhr;
  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest();
  } else {
    xhr = new ActiveXObject('Microsoft.XMLHTTP');
  }
  xhr.open('POST', url, true);
  xhr.setRequestHeader("AuthToken", localStorage.getItem('token'));
  xhr.send(formData) //data
  xhr.onload = () => {
    if (xhr.status === 200 || xhr.status === 304) {
      if (
        JSON.parse(xhr.responseText).code === '44001' &&
        JSON.parse(xhr.responseText).msg === "登录已失效,请重新登录!"
      ) {
        localStorage.removeItem("token");
        router.replace({
          path: "/login"
        });
      } else {
        callback(JSON.parse(xhr.responseText).resp);
      }
    } else {
      _this.$message({
        message: '图片上传出错！',
        type: 'error'
      });
      _this.isShowLoading = false;
    }
  }
}
