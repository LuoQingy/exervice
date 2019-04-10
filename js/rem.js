// (function(d, w) {
//   const doc = d.documentElement;
//   function rem() {
//     const width = doc.getBoundingClientRect().width;
//     doc.style.fontSize = width / 10.8 + 'px';
//   }
//   rem();
//   w.addEventListener('resize', rem);
// })(document, window);


// “()()”表示自执行函数
(function(doc, win) {
	var docEl = doc.documentElement,
		// 手机旋转事件,大部分手机浏览器都支持 onorientationchange 如果不支持，可以使用原始的 resize
		resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
		recalc = function() {
			//clientWidth: 获取对象可见内容的宽度，不包括滚动条，不包括边框
      		var width = docEl.getBoundingClientRect().width;
      		//console.log(width)
			docEl.style.fontSize =width/ 10 + 'px';
			//      切换屏幕获取的fontsize值
			//console.log("切换屏幕获取的fontsize值")
			//console.log(docEl.style.fontSize)
		};

	recalc();
	//判断是否支持监听事件 ，不支持则停止
	if(!doc.addEventListener) return;
	//注册翻转事件
	win.addEventListener(resizeEvt, recalc, false);

})(document, window);
