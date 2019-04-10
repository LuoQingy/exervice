<template>
	<!--导航栏-->
	<div class="tabbar">
	
		<ul>
			<li v-for="(item,index) in tabbarlist" @click='runsection(index)' :key="index">
				<div>
					
					<img :src="tabbar.activeindex==index?item.activeimg:item.defaultimg" />
					<span :class="tabbar.activeindex==index?'lispan activespan':'lispan defaultspan'">{{item.name}}</span>
					<span class="newstate" v-if="index== 4 && userInfor.informationIsRead"></span>
				</div>
			</li>
			
		</ul>
	</div>
</template>

<script>
import store from '@/vuex/demo'//vuex
import { mapState} from 'vuex'
	export default {
		store,
		data() {
			return {
				tabbarlist:[
					{name:'我的券包',defaultimg:require('../assets/img/home/myvoucherdefault.png'),activeimg:require('../assets/img/home/myvoucheractive.png')},
					{name:'我的积分',defaultimg:require('../assets/img/home/mypointsdefault.png'),activeimg:require('../assets/img/home/mypointsactive.png')},
					{name:'我的停车',defaultimg:require('../assets/img/home/parkingdefault.png'),activeimg:require('../assets/img/home/parkingactive.png')},
					{name:'我的订单',defaultimg:require('../assets/img/home/myorderdefault.png'),activeimg:require('../assets/img/home/myorderactive.png')},
					{name:'消息中心',defaultimg:require('../assets/img/home/messagedefault.png'),activeimg:require('../assets/img/home/messageactive.png')}
				],
				
			}
		},
		props:{
			tabbar:{
				
			}
		},
		 computed:{
		...mapState(['userInfor']),
		},
		methods:{
			runsection(index){//0:我的券包 1:我的积分 2:我的停车 3:我的订单 4:消息中心
				console.log(index)
				this.tabbar.activeindex=index
				setTimeout(()=>{//预留一些时间显示选中状态
				if(index==0){
					this.$router.push({
						path: '/project/myCoupons',
						name: 'myCoupons',
						query:{
							mallId: this.$mallId
						},
					})
				}else if(index==1){
					this.$router.push({
						path: '/project/accumulatePoints',
						name: 'accumulatePoints',
						query:{
							mallId: this.$mallId
						}
					})
				}else if(index==2){
					this.$router.push({
						path: '/project/nodo',
						name: 'nodo',
						// path: '/project/parkIndex',
						// name: 'parkIndex',
						query:{
							mallId: this.$mallId
						}
					})
				}else if(index==3){
					this.$router.push({
						path: '/project/myOrder',
						name: 'myOrder',
						query:{
							mallId: this.$mallId
						}
					})
				}else if(index==4){
					this.$router.push({
						path: '/project/messageIndex',
						name: 'messageIndex',
						query:{
							mallId: this.$mallId
						}
					})
				}
				},100)
			},
			
		}
	}
</script>


<style  lang="less" scoped>
	.tabbar{
		width: 100%;
		height: 1.5rem;
		text-align: center;
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: rgba(245, 245, 245, 1);
		border-top: 1px solid rgba(215, 215, 215, 1);
		box-sizing: border-box;
		-webkit-box-sizing: border-box;
		z-index: 99;
		ul {
			display: flex;
			width: 100%;
			height: 100%;
			list-style: none;
		
			li {
				flex: 1;
				font-size: 1rem;
				color: #999999;
				text-align: center;
			
				div {
					display: inline-block;
					width: 100%;
					height: 100%;
					color: #999999;
					position: relative;
				}
				.newstate{
                        width: 6px;
						height: 6px;
						border-radius: 50%;
						background: #C80000;
						margin: 0 0.1rem;
						display: inline-block;
						vertical-align: middle;
						position: absolute;
						right: .4rem;
						top: .2rem;
                    }
				img {
					width: 0.9rem;
					display: block;
					margin: .1rem auto 0;
				}
				.lispan {
					display: block;
					font-size: .28rem;
				}
				.defaultspan{
					color: #999999;
				}
				.activespan{
					color: #DECC98
				}
			}
		}
	}
</style>