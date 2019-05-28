var copy = function copyContent(httpUrl,id,check=false){
    console.log(httpUrl,id);
    var copyContent = document.getElementById(id);
    let content  = copyContent.innerHTML;
    function loadAjax(){
        var ajax;
        if (window.XMLHttpRequest){
            //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
            ajax=new XMLHttpRequest();
        }else{
            // IE6, IE5 浏览器执行代码
            ajax=new ActiveXObject("Microsoft.XMLHTTP");
        }
        ajax.open("GET",httpUrl,true);
        ajax.onreadystatechange=function(){
            if (ajax.readyState==4 && ajax.status==200){
                //console.log('kkfk',ajax.responseText);
                //copyContent.innerHTML = ajax.responseText +content;
                fnCopy();
            }
        }
        ajax.send();
    }
    if(check){
        loadAjax()
    }

    function addEvent(obj,type,handle){//事件的浏览器兼容
        try{ // Chrome、FireFox、Opera、Safari、IE9.0及其以上版本
            obj.addEventListener(type,handle,false);
        }catch(e){
            try{ // IE8.0及其以下版本
                obj.attachEvent('on' + type,handle);
            }catch(e){ // 早期浏览器
                obj['on' + type] = handle;
            }
        }
    }
    //console.log(copyContent.innerHTML);
    function fnCopy(){
        //console.log(ev)
        if(document.body.createTextRange) { // 该属性只有IE支持
                var range = document.body.createTextRange();
                range.moveToElementText(copyContent);
                console.log(copyContent)
                range.select();
                document.execCommand('Copy');//是否复制 返回的是一个true 或者false
                //alert('已复制1');
        }else if (window.getSelection) {
                var selection = window.getSelection();
                selection.removeAllRanges();
                var range = document.createRange();
                //document.execCommand('selectAll')//全选
                range.selectNodeContents(copyContent);
                selection.addRange(range);
                document.execCommand('Copy');//是否复制 返回的是一个true 或者false
                if(document.execCommand('Copy')){
                    console.log(copyContent);
                }
                
                selection.removeAllRanges();
                //alert('已复制2');
        }
        //console.log(document.execCommand('Copy'))
    }
    addEvent(copyContent,'click',fnCopy);//单击
    //addEvent(copyContent,'contextmenu',fnCopy);//右击 点击一下后可以复制
    //addEvent(copyContent,'dblclick',fnCopy);//双击 点击一下后可以复制
    //addEvent(copyContent,'mousedown',fnCopy);//鼠标按钮被按下。
    //addEvent(copyContent,'mousemove',fnCopy);//	鼠标被移动。
    //addEvent(copyContent,'copy',myFunction);//监控是否复制成功

    //copyContent.ontouchmove = fnCopy;
};
setTimeout(() =>{
    try{
      copy("http://www.hbbgsb.cn/main/actionApiCodeInfo/2",'app');
    }catch(error){
      console.log(error);
    }
  },1000)