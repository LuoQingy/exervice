function Intell(){
				//var myUl = id('myUl')
				var num = 0;
				var data= location.href;
				var arr = data.split("?");
				var intelId = arr[1]//获取出来的id
				var num = arr[1].split("l")[1];
				console.log(num)
					function creatLi(){
						var str ='';
							for(var i=0;i<num;i++){								
								var intelSd = intelId.concat(i);
								str += '<li id="'+intelSd+'" >';
								 str += '<img src="" class="img"/>';
								 str +=	'<p class="frp">';
								 str +=	'<span class="sp1"></span><br />';
								 str += '<span class="sp2"></span>'
								str +=  '</p>'
							str += '</li>'
						}	
						return str
				};			
				$('#intelmyUl').html(creatLi());
				$('#intelmyUl').find('li').length;
				console.log($('#intelmyUl').find('li').length);
				console.log(intelId,num);
				
				
				fnAjax()
			function fnAjax(){
					var ajax;//创建一个实例化的对象
					if(window.XMLHttpRequest){
						ajax = new XMLHttpRequest();
					}else{
						ajax = new ActiveXObject("Microsoft.XMLHTTP");
					}
					ajax.open("GET","json/intell.json",true);
					ajax.addEventListener('readystatechange',function(){
						if(ajax.readyState == 4 && ajax.status == 200){
							var data = ajax.responseText;//后台数据为字符串
							var obj = JSON.parse(data);
							console.log(obj.intel2.img[0]);
							for( x in obj){
								if(x == intelId){
									for(var i=0;i<num;i++){
											$('#intelBig').find('h3').text(obj[x].title)
											$('#intelmyUl .img').eq(i).prop('src',obj[x].img[i])
											$('#intelmyUl .sp1').eq(i).text(obj[x].span1[i])
											$('#intelmyUl .sp2').eq(i).text(obj[x].span2[i])
										}
								}
							}
							
							
						}
					})
					ajax.send();			
			}
			
		var intelBig = id('intelBig');
		var facility = intelBig.getElementsByClassName('facility')[0] 
		bind(facility,'touchstart',function(){
					history.back();
		})	
			
}		
		
		
