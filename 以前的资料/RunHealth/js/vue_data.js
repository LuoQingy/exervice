
new Vue({
	data:{
		nav:{
			list:[
			{value:'首页',classA:'show'},
			{value:'发现',classA:''},
			{value:'健康',classA:''},
			{value:'我的',classA:''}
			],
			oA:[
				{classA:'active'},
				{classA:''},
				{classA:''},
				{classA:''}
			]
		},
		first:{
			
		},
		fourHeaderChild:{
			child_message:[
				{name:'消息',src:'img/frChild4.png'},
				{name:'好友',src:'img/frChild5.png'},
				{name:'扫一扫',src:'img/frChild6.png'}			
			],
			isShow:false,
			HuaWeiSever_Ul1:[
				{name:'应用市场',src:'img/frChild8.png'},
				{name:'钱包',src:'img/frChild9.png'}
			],
			HuaWeiSever_Ul2:[
				{name:'华为商城',src:'img/frChild10.png'},
				{name:'会员服务',src:'img/frChild11.png'},
				{name:'音乐',src:'img/frChild12.png'},
				{name:'优酷视频',src:'img/frChild13.png'},
				{name:'主题',src:'img/frChild14.png'},
				{name:'亲情关怀',src:'img/frChild15.png'},
				{name:'文件管理',src:'img/frChild16.png'},
				{name:'生活服务',src:'img/frChild17.png'},
				{name:'天际通',src:'img/frChild18.png'}
			]
		}
		
	},
	methods:{
		show:function(){   
	     this.fourHeaderChild.isShow=this.fourHeaderChild.isShow==true?false:true;
			}
	}
}).$mount('#big')