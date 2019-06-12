

var list = document.getElementById('list');
var shop = document.getElementById('shop');
var arr = window.localStorage.getItem('listLi')?window.localStorage.getItem('listLi').split(','):[];

createLi();

window.onstorage = function(){
	arr = window.localStorage.getItem('listLi')?window.localStorage.getItem('listLi').split(','):[];
	console.log(arr)
	createLi();
}

list.onclick = function(ev){
	if(!cq(arr,ev.target.innerHTML)){
		arr.push(ev.target.innerHTML)
	}
	createLi();
	window.localStorage.setItem('listLi',arr);
}

shop.onclick = function(ev){
	var n = arr.indexOf(ev.target.innerHTML);
	arr.splice(n,1);
	window.localStorage.setItem('listLi',arr);
	createLi();
}


function cq(arr,value){
	var n = arr.some(function(item,index){
		return item == value
	})
	return n;
}


function createLi(){
	console.log(arr)
	shop.innerHTML = '';
	for(var i=0;i<arr.length;i++){
		var li = document.createElement('li');
		li.innerHTML = arr[i];
		shop.appendChild(li)
	}
}

