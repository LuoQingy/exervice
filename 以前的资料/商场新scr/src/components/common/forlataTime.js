let forlataTime=function forlataTime(time) {
    //解析时间的函数
    //参数time为从后台取到的毫秒数
    //console.log(time)
    var dataTime = new Date(time);
    var y = dataTime.getFullYear(); //显示年
    var m = dataTime.getMonth() + 1; //显示月
    m = m < 10 ? "0" + m : m;
    var d = dataTime.getDate(); //显示日
    d = d < 10 ? "0" + d : d;
    var h = dataTime.getHours(); //显示小时
    h = h < 10 ? "0" + h : h;
    var minute = dataTime.getMinutes(); //显示分钟
    minute = minute < 10 ? "0" + minute : minute;
    var second = dataTime.getSeconds(); //显示秒
    second = second < 10 ? "0" + second : second;
    return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
    // return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;     //返回最终时间y-m-d h-m
  }
  export default forlataTime