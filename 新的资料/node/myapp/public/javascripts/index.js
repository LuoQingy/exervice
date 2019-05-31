function getData(str){   //获取到的数据有杂乱..需要把前面部分去掉,只需要data（<em>......<em>  data)
          if(str){
            return str.slice(str.lastIndexOf(">")+1);
        }
    }

    document.getElementById("btn1").style.visibility = "hidden";
     document.getElementById("btn2").style.visibility = "hidden";
    var currentPage = 0;  //page初始0
    // setInterval(()=>{
    //     cheerFetch(1,"http://wap1.prculture.cn/#/home/artical/aae81d48e9a5300198ec654147bfda21/%E6%97%B6%E5%B0%9A")
    //     cheerFetch(1,"http://wap1.prculture.cn/#/home/index/%E5%81%A5%E5%BA%B7")
    // },1000)
   function cheerFetch(_page,_shezhi){  //抓取数据处理函数
       if(_page == 1){ 
           currentPage  = 1;      //开始抓取则更改page
       }
       $(document).ajaxSend(function(event, xhr, settings) {  //抓取中...
             $(".fetching").css("display","block");
         });
        $(document).ajaxSuccess(function(event, xhr, settings) {  //抓取成功
         $(".fetching").css("display","none");
         });
        $.ajax({   //开始发送ajax请求至路径 /getJobs  进而作页面抓取处理
            data:{
              page:'http://hao1.91nzh.com/q/32/'
            },  //参数 page = _page
            dataType: "json",
             type: "get",
            url: "/getJobs",
            success: function(data){   //收到返回的json数据
                console.log(data);
                 var html = "";
              $(".container").empty();
               if(data.jobs.length == 0){ 
                    alert("Error2: 未找到数据..");
                  return;
                }
                for(var i=0;i<data.jobs.length;i++){   //遍历数据并提取处理
                     var job = data.jobs[i];
                    html += "<div class='jobs'><p><span >岗位序号：</span>  "+((i+1)+15*(currentPage-1))+"</p>"+
                   "<p>岗位名称：<a href='"+job.src+"'target='_blank'>"+job.name+"</a></p>"+
                     "<p><span >岗位所在公司：</span>  "+job.company+"</p>"+
                  "<p><span>公司阶段：</span>  "+getData(job.period)+"</p>"+
                   "<p><span>岗位规模：</span>  "+getData(job.scale)+"</p>"+
                  "<p><span>岗位所在城市：</span>  "+job.city+"</p>"+
                "<p><span>岗位薪资：</span>  "+getData(job.salary)+"</p>"+
                "<p><span>岗位最低经验要求：</span>  "+getData(job.exp)+"</p>"+
                 "<p><span>岗位发布时间：</span>  "+getData(job.time)+"</p>"+
                 "</div>"
            }
 
               $(".container").append(html);  //展现至页面
            if(_page == 1){ 
                document.getElementById("btn1").style.visibility = "hidden";
                 document.getElementById("btn2").style.visibility = "visible";
           }else if(_page > 1){ 
                document.getElementById("btn1").style.visibility = "visible";
                 document.getElementById("btn2").style.visibility = "visible";
            }
         },
       error: function(){ 
            //  alert("Error1: 未找到数据..");
        }
     });
 }