let information= function information(id=0,title=0,type=0,startTime=0,endTime=0,check=true){
  var num  = 0;
  var lists = [];
  console.log(id,title,startTime,endTime,check)
  if(Cookies.get('num')){
     num = Number(Cookies.get('num'));
  }else{
    localStorage.removeItem('lists');
    Cookies.set('num','num');
  } 
  if(localStorage.getItem('lists')){
    lists = JSON.parse(localStorage.getItem('lists'))
  }
    
    let obj = {
      id:id,
      title:title,
      type:type,
      num:0,
      startTime:0,
      endTime:0,
    }
    if(startTime){
      obj.startTime = startTime;
    }
    console.log(obj)
    if(id){
      let flag = true;
      lists.forEach((item) => {
        if(item.id==id){
          flag = false;
          if(endTime){
            item.endTime = endTime;
            item.num = countDown((item.endTime-item.startTime)/1000)
          }
          if(title){
            item.title = title;
          }
        }
      });
      if(flag){
        lists.unshift(obj);
      }
    }
   
    
    console.log(id,title),lists;
    let stringLists = JSON.stringify(lists);
    localStorage.setItem('lists',stringLists);
  
  function countDown(times){
    console.log(times)
    var day=0,
      hour=0,
      minute=0,
      second=0;//时间默认值
    if(times > 0){
      day = Math.floor(times / (60 * 60 * 24));
      hour = Math.floor(times / (60 * 60)) - (day * 24);
      minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60);
      second = Math.floor(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
    }
    if (minute <= 9) minute = '0' + minute;
    if (second <= 9) second = '0' + second;
    if(day){
      if (hour <= 9) hour = '0' + hour;
      return day+"："+hour+"："+minute+"："+second;
    }else if(hour){
      if (hour <= 9) hour = '0' + hour;
      return hour+"："+minute+"："+second;
    }else {
      return minute+"："+second;
    }
  }
  return lists;
}
  export default information