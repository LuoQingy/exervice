// https://lstmall.paycore.cc/index.php/Seller
import axios from 'axios'
import router from '../router'
import { Message } from 'element-ui';
var _baseUrl, _wechatBaseUrl;
switch (process.env.srconfig) {
  case 'pro': //生产
    _baseUrl = 'http://hopscaapi.paycore.cc'
    _wechatBaseUrl = 'http://hopscaapi.paycore.cc'
    break;
  case 'dev': //开发
    _baseUrl = 'http://twx3.paycore.cc'
    _wechatBaseUrl = 'http://thad.paycore.cc'
    break;
  case 'pre': //演示
    _baseUrl = 'http://ywx3.paycore.cc'
    _wechatBaseUrl = 'http://thad.paycore.cc'
    break;
  default: //默认开发
    _baseUrl = 'http://twx3.paycore.cc'
    _wechatBaseUrl = 'http://thad.paycore.cc'
    break;
}
export const api = {
  _baseUrl: _baseUrl,
  _wechatBaseUrl: _wechatBaseUrl,
  type:process.env.srconfig
}


export const instanceAuth = axios.create({
  baseURL: _baseUrl,
  headers: {
    "Content-Type": "application/json",
  }
})
export const xwinstanceAuth = axios.create({
  baseURL: _baseUrl,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  }
})


function axiosInterceptors(axiosType) {
  // 添加请求拦截器
  axiosType.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // console.log('process.env.srconfig',process.env.srconfig)
    if (localStorage.getItem('token')) {
      config.headers.AuthToken = localStorage.getItem('token');
    }
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });
  // 添加响应拦截器
  axiosType.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    // console.log('response',response)
    if (response.data.code === "44001" && response.data.msg === "登录已失效,请重新登录!") {
      localStorage.removeItem('token');
      router.replace({
        path: '/login'
      })
    }
    return response;
  }, function (error) {
    // 对响应错误做点什么
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 返回 401 清除token信息并跳转到登录页面
          router.replace({
            path: '/login'
          })
        case 403:
          // 返回 403 没权限
          if(error.response.data.code === "30000"||error.response.data.code === "30001"||error.response.data.code === "30002"){
            Message.warning(error.response.data.msg)
          }else if (error.response.data.code === "44001" && error.response.data.msg === "登录已失效,请重新登录!") {
            localStorage.removeItem('token');
            router.replace({
              path: '/login'
            })
          }
      }
    }
    return Promise.reject(error.response.data) // 返回接口返回的错误信息
  });
}

axiosInterceptors(instanceAuth)
axiosInterceptors(xwinstanceAuth)
