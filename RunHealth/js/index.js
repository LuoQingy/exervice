

function fnIndex(){
	var wrap = id('wrap');
	var box = wrap.getElementsByClassName('box')[0];
	var section = wrap.getElementsByTagName('section')
	var nav = wrap.getElementsByClassName('nav')[0];
	var list = nav.getElementsByTagName('li');
	var oA = nav.getElementsByTagName('a');	
	var iW = view().w;
	var Width = view().w/4
	var num = 0;
	var now = 0;
	var disx = 0;
	var disy = 0;
	var startx,movex,endx = null;
	var starty,movey,endy = null;
	var theCSSprop = window.getComputedStyle(box,null).width;
	var s1 = window.getComputedStyle(section[0],null).height;
	var s2 = window.getComputedStyle(section[1],null).height;
	var s3 = window.getComputedStyle(section[2],null).height;
	var s4 = window.getComputedStyle(section[3],null).height;
	console.log(iW,theCSSprop,Width);
	console.log(s1,s2,s3,s4)
	var arr = [];
	
	
	
	bind(wrap,'touchstart',start);
	bind(wrap,'touchmove',move);
	bind(wrap,'touchend',end);
	
	function start(ev){
		box.style.transition = 'none';
		ev = ev.changedTouches[0];
		now = disx;
		startx = ev.pageX;
		starty = ev.pageY;
		console.log(starty);
	};
	
	function move(ev){
		ev = ev.changedTouches[0];
		movex = ev.pageX;
		disx = now - (movex - startx);
		num = Math.ceil(disx/iW);
		if(num > section.length-1){
			num =3;
			disx = num*iW;
			box.style.transition = '1s';
			box.style.transform = 'translate3d(-'+(disx)+'px,0,0)';
		}
		//now = disx;
		//console.log(moveX);
		//console.log(disx)
		box.style.transform = 'translate3d(-'+(disx)+'px,0,0)';
	};
	
	function end(ev){
		ev = ev.changedTouches[0];
		endy = ev.pageY;
		console.log(endy)
		disy = endy-starty
		console.log(disy)
		
		num = Math.round(disx/iW);
		
		if(num >= section.length-1){			
			num =3;
		}else if(num<=0){
			num = 0;
		}
		
		//now = disx;
		disx = num*iW;
		//console.log(disx)
		box.style.transition = '1s';
		box.style.transform = 'translate3d(-'+(disx)+'px,0,0)';
		tab()
	}
	
	function tab(){
		for(var i=0;i<oA.length;i++){
			removeClass(list[i],'show');
			removeClass(oA[i],'active');
		}
		addClass(list[num],'show');
		addClass(oA[num],'active');
	}
	setClick();
	function setClick(){
		for(var i=0;i<list.length;i++){
			list[i].index = i;
				bind(list[i],'touchstart',function(){
				disx = this.index*iW;
				num = Math.round(disx/iW);
				tab();
				box.style.transition = '2s';
				box.style.transform = 'translate3d(-'+(disx)+'px,0,0)';
				})
			
		}
	}
	
	
	
	fnIntell();
	function fnIntell(){
		var intell = id('intell');
		var list = intell.getElementsByTagName('li');
		for(var i=0;i<list.length;i++){
				list[i].index = i;
				bind(list[i],'touchstart',function(){
					location.href = 'intelligentDevice.html?'+this.id;
				})
		}
		
	}
	
	
	
	
	fnFour()
	
}

function fnSecond(){
	
}

function fnThird(){
	
}
  
function fnFour(){
	var clone_first = id('clone_first');
	var fourHeaderChild = id('fourHeaderChild');
	var fourHeaderChildHeader = id('fourHeaderChildHeader');
	
    bind(clone_first,'touchstart',addFourChild)
	
	bind(fourHeaderChildHeader,'touchstart',function(){
		removeFourChild();
	})
	
	function addFourChild(){		
		removeClass(wrap,'showPage');
		addClass(fourHeaderChild,'showPage');
	}
	
	function removeFourChild(){
		addClass(wrap,'showPage');
		removeClass(fourHeaderChild,'showPage');
	}
}
