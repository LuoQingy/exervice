<template>
	<div class="goodsDetails-information">

		<p class="goodType">
			<span @click="goBreadUrl(index)" v-for="(item,index) in classList" :key="index"><i :class="item.className"></i>{{item.cateName}}</span>
		</p>
		<div class="goodsDetails-information-content">
			<div class="fl content-img">
				<div class="big-img" @mouseover="moveBoxMouseover()" @mouseout="moveBoxMouseout" v-on:mousemove="moveBoxMousemove($event)" ref="previewBox">
					<div id="movebox" class="movebox" v-show="moveboxCheck" ref="hoverBox"></div>
					<img :src="list.ImgSrc" width="296" height="296">
				</div>
				<div class="small-img">
					<ul>
						<li class="fl" v-for="(item,index) in list.imagesList" :key="index" @mouseover="smallBoxMouseover(index)">
							<img :src="item.imageUrl">
						</li>
					</ul>
				</div>
				<div class="content-img-footer">
					<p class="fl commodity-number">商品编号：<span>{{list.gMercode}}</span></p>
					<p class="fl collection" @click="joinInCollectionEvent"><i class="fa fa-heart" v-if="isCollectionCheck"> </i> <i class="fa fa-heart-o" v-else> </i> <span :class="jionCollectionClassName">加入收藏</span></p>

					<div class="fl shareStateHover">
						<p class="fl share lastshare"><i class="fa fa-share-square-o"></i> 分享</p>
						<!--分享展示-->
						<div class="sharediv">
							<div ref="shareimgdiv" class="shareimgdiv"></div>
							<div id="qrcode"></div>
							<!--<img src="../../assets/gengxin.jpg"/>-->
							<p @click="loadshareimg">下载二维码</p>
							<p v-clipboard:copy="qrcodehrefPC" v-clipboard:success="onCopy" v-clipboard:error="onError">复制链接</p>
							<span></span>
						</div>
					</div>

					<!--@mouseleave="hideShare"-->
				</div>
				<!-- 放大镜的开始 -->
				<div class="magnifierImgbox" v-show="magnifierImgBoxCheck" ref="zoomBox">
					<div>
						<img :src="list.ImgSrc" ref="bigImg" width="600" height="600">
					</div>
				</div>
			</div>
			<div class="fl content-information">
				<div class="drug-attribute-and-title">
					<h3>
                        <p class="fl drug-attribute"></p>
                        <p class="drug-main-title">{{list.name}}</p>
                    </h3>
					<div class="drug-sub-title">{{list.subName}}</div>
				</div>
				<div class="drug-detailed-information">
					<div class="sales-price-and-discount">
						<div class="sales-price">
							<p class="fl salse-name">销售价</p>
							<p :class="okLogin?'fl present-price':'fl nologinpresent-price'">{{list.price}}</p>
						</div>

						<div class="discount" v-if='couponList.length'>
							<p class="fl discount-name">优惠</p>
							<p class="fl coupon-name">优惠券</p>
							<p class="fl discount-information">{{firstCouponList.name}}</p>
							<p class="fl coupon-receive">
								<button :class="firstCouponList.isCanCoupon?'canCoupun':''" @click="getCouponRevoke(0,firstCouponList.couponId,goodsId)">领取</button>
							</p>
							<p v-if='!discountMoreState && otherCouponList.length' class="fl more-favorable" @click="getDiscountMore(true)">更多优惠 <i class="fa fa-angle-down"></i></p>
						</div>
						<!--更多优惠的隐藏部分-->
						<div class="discountMore" v-if='discountMoreState'>
							<div class="discountMg">
								<p class="itemOne" v-for='(item,index) in otherCouponList' :key="index">
									<span class="coupon-name itemCoupon">优惠券</span>
									<span class="discount-information">{{item.name}}</span>
									<span class="coupon-receive">
                               		 <button :class="item.isCanCoupon?'canCoupun':''" @click="getCouponRevoke(index,item.couponId,goodsId)">领取</button>
                            		</span>
								</p>
							</div>
							<p class="fl more-favorable" @click="getDiscountMore(false)">收起<i class="fa fa-angle-down"></i></p>
						</div>
						<div class="activity" v-if='activityGoodIds.length||flasgSaleGoodIds.length'>
							<p class="fl activity-name">参与活动</p>
							<div class="fl" style="width: 80%;">
								<div class="fl" v-if='activityGoodIds.length>0'> 
									<p class="fl activity-label"><span>多件优惠</span></p>
									<p class="fl activity-information">{{firstActivityGoodIds.activityName}}</p>
								</div>
								<div class="fl" v-if='flasgSaleGoodIds.length>0'> 
									<p class="fl activity-label"><span>限时抢购</span></p>
									<p class="fl activity-information">{{firstFlasgSaleGoodIds.fsName}}</p>
								</div>
							</div>
							<p v-if='!activityMoreState && (otherActivityGoodIds.length||otherFlasgSaleGoodIds.length)' class="fl more-favorable" @click="getActivityMore(true)">更多活动 <i class="fa fa-angle-down"></i></p>
						</div>
						<!--更多活动的隐藏部分-->
						<div class="discountMore activityMore" v-if='activityMoreState'>
							<div class="discountMg">
								<p v-if='otherActivityGoodIds.length' class="itemOne" v-for="(item,index) in otherActivityGoodIds">
									<span class="activity-label">多件优惠</span>
									<span class="discount-information">{{item.activityName}}</span>
								</p>
								<p v-if='otherFlasgSaleGoodIds.length' class="itemOne" v-for="(item,index) in otherFlasgSaleGoodIds">
									<span class="activity-label">限时抢购</span>
									<span class="discount-information">{{item.fsName}}</span>
								</p>
							</div>

							<p class="fl more-favorable" @click="getActivityMore(false)">收起<i class="fa fa-angle-down"></i></p>
						</div>
					</div>
					<!--添加的商品属性-->
					<div class="attrGoods">
						<p v-for='(item,index) in attrGoods' :key='index'><span>{{item.cpName}}</span><span>{{item.value}}</span></p>
					</div>
					<div class="flow-process">
						<div v-for="(item,index) in attrList" :key="index">
							<div class="packing-line" v-if="item.isCheck">
								<div class="fl attributeFirst-name">{{item.name}}</div>
								<div class="fl packing-type">
									<p class="fl" v-for="(title,index2) in item.specList" :key="index2">
										<span class="fl" @click="attributeClick(index,index2,1)" :class="title.className" :title='title.gciRemark'>{{title.value}} <i v-show="title.seclectCheck"></i></span>
									</p>
								</div>
							</div>
							<div class="packing-line-name" v-else>
								<div class="fl attributeFirst-name">{{item.name}}</div>
								<div class="fl packing-Img">
									<div class="fl" v-for="(title,index2) in item.specList" :key="index2" :title='title.gciRemark'>
										<img :class="title.className" :src="title.gciUrl" @click="attributeClick(index,index2,2)">
										<i v-show="title.seclectCheck"></i>
									</div>
								</div>
							</div>
						</div>
						<div class="stock-number">
							<div class="fl number-name">数量</div>
							<div class="fl stock" id="stock">
								<div class="add-and-reduce">
									<button class="btn reduce" title='减1' @click="reduceClick"><i class="fa fa-minus"></i></button>
									<input type="text" placeholder="请输入购买量" @click="inputEvent" @blur="modifyBlur" @input="modifyBlur" title="请输入购买量" class="number" v-model="purchaseNumber">
									<button class="btn add-to" title='加1' @click="addClick"><i class="fa fa-plus"></i></button>
									<span> 库存  {{goodsStock}}</span>
								</div>
								<div class="immediate-and-joining">

									<button class="btn" title="点击此按钮，到下一步确认购买信息" @click="atOncePurchse">立即购买</button>

									<button class="btn joining" title="加入购物车" @click="submitPurchse"><i class="fa fa-cart-plus"></i> 加入购物车</button>
								</div>
							</div>
						</div>
						<div class="show-choice-commodity" v-show="incompleteCheck">
							<div id="choiceCommodity">
								<h3>请选择您要的商品信息 <i class="fr fa fa-remove" @click="cloneIncomplete"></i></h3>
								<div v-for="(item,index) in attrList" :key="index">
									<div class="packing-line" v-if="item.isCheck">
										<div class="fl attributeFirst-name">{{item.name}}</div>
										<div class="fl packing-type">
											<p class="fl" v-for="(title,index2) in item.specList" :key="index2">
												<span class="fl" @click="attributeClick(index,index2)" :class="title.className" :title='title.gciRemark'>{{title.value}} <i v-show="title.seclectCheck"></i></span>
											</p>
										</div>
									</div>
									<div class="packing-line-name" v-else>
										<div class="fl attributeFirst-name">{{item.name}}</div>
										<div class="fl packing-Img">
											<div class="fl" v-for="(title,index2) in item.specList" :key="index2" :title='title.gciRemark'>
												<img :class="title.className" :src="title.gciUrl" @click="attributeClick(index,index2,2)">
												<i v-show="title.seclectCheck"></i>
											</div>
										</div>
									</div>
								</div>
								<div class="stock-number">
									<div class="fl number-name">数量</div>
									<div class="fl stock" id="stock">
										<div class="add-and-reduce">
											<button class="btn reduce" title='减1' @click="reduceClick"><i class="fa fa-minus"></i></button>
											<input type="text" placeholder="请输入购买量" title="请输入购买量" class="number" v-model="purchaseNumber">
											<button class="btn add-to" title='加1' @click="addClick"><i class="fa fa-plus"></i></button>
											<span> 库存  {{goodsStock}}</span>
										</div>
										<div class="btn-moddle" v-show="btnCheck">
											<button v-if="isAtonceCheck" @click="atOncePurchse">确定</button>
											<button v-if="!isAtonceCheck" @click="submitPurchse">确定</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="promise-information">
						<div class="fl promise-name">承诺</div>
						<div class="fl customer-service">
							<p class="fl" v-for="(item,index) in list.tabs" :key="index">
								<i class="fa fa-check-circle-o" aria-hidden="true"></i>
								<span> {{item.name}}</span>
							</p>
						</div>
					</div>
				</div>
			</div>
			<div style="clear:both"></div>
		</div>
		<div v-if="drugTable.receiveCheck">
			<div :style='alertStyle'>
				<div :style='alertAll'>
					<div class="receive-coupon-success">
						<div class="success-first">
							<i class="fr fa fa-remove" @click="receiveSuccess"></i>
						</div>
						<div class="success-second">
							<div class="fl success-second-left"> <i class="fa fa-check"></i></div>
							<div class="fl success-second-right">
								<p class="coupon-use-condition">恭喜，您已成功领取<span>{{receiveCoupon.name}}</span>优惠券</p>
								<p class="coupon-use-time">使用时间：{{receiveCoupon.useStartTime}}至{{receiveCoupon.useEndTime}}</p>
								<button @click="receiveSuccess">确定</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import QRCode from 'qrcodejs2'
	import Vue from 'vue'
	import VueClipboard from 'vue-clipboard2'
	Vue.use(VueClipboard)

	function offset(el) {
		let top = el.offsetTop;
		let left = el.offsetLeft;
		while(el.offsetParent) {
			el = el.offsetParent;
			top += el.offsetTop;
			left += el.offsetLeft;
		}
		return {
			left: left,
			top: top
		}
	}
	export default {
		data() {
			return {
				alertStyle: {
					'width': document.documentElement.clientWidth + 'px',
					'height': document.documentElement.clientHeight + 'px',
					'position': 'fixed',
					'top': 0,
					'left': 0,
					'z-index': 31,
					'background': 'rgba(0,0,0,0.4)',
					'overflow': 'hidden'
				},
				alertAll: {
					'position': 'relative',
					'width': '533px',
					'height': '176px',
					'top': window.innerHeight / 2 - 176 / 2 + 'px',
					'left': window.innerWidth / 2 - 533 / 2 + 'px',
					'background': '#fff',
					'overflow': 'hidden',
				},
				classList: [], //商品的的分类名称
				moveboxCheck: false, //鼠标移动盒子的显示和隐藏
				magnifierImgBoxCheck: false, //放大镜盒子的显示和隐藏
				commodityNumber: '2581577', //商品编号
				isCollectionCheck: false, //是否加入收藏
				jionCollectionClassName: ' ', //加入收藏的状态
				drugTable: { //商品信息
					property: 'OTC甲药', //属性
					name: {
						m: 2
					},
					mainTitle: '999感冒灵颗粒', //主标题
					subTitle: '感冒灵颗粒', //副标题
					presentPrice: '398.00', //现价
					activityLabel: '促销优惠', //活动标签
					originalPrice: '原价￥429', //原价
					receiveCheck: false, //显示领卷成功的弹出框
					discountInformation: '10元新手优惠卷，满158元可用',
					couponContent: '满158减10元', //使用优惠卷的条件
					couponUseTime: '2018.03.06-2018.06.29', //优惠卷使用时间范围
					attributeFirst: '包装',
					attributeSecond: '剂型',

					stock: 0, //库存
					commodityName: '999感冒灵颗粒', //商品名称
					commoditySpecification: '5g*9袋', //商品规格
					generalName: '999感冒灵颗粒', //通用名称
					termOfValidity: '30个月', //有效期
					approvalNumber: '国药准字Z2028739', //批准文号
					indication: '风热感冒', //适应症/功能主治
					reminder: '刷机过程中请保持电脑不断电，使用适配器和电池一起供', //温馨提示
				},
				incompleteCheck: false, //立即购物选择不全时显示
				btnCheck: false, ///立即购物选择不全时按钮的显示
				goodsId: '', //商品Id
				userId: '',
				token: '',
				isSingleCheck: true, //是否是单品
				isGoodSkuIdCheck: false, //是否已经选择了规格
				isAtonceCheck: false, //是否可以立即购买
				noSecletCheck: false, //弹出请选择商品属性
				list: {}, //商品详情
				attrList: [], //规格属性和属性值
				attrImgList: [], //属性图列表
				specIdList: [], //规格Id列表
				arrList: [], //存储选择的规格的Id
				relateAttr: [], //相关属性
				stockCheck: true, //显示库存
				specPrice: '', //选择规格产生的价格
				stock: '', //选择规格相应的库存
				selSpec: '', //有那些属性
				goodsStock: '', //民信库存
				collId: '', //收藏Id
				purchaseNumber: 1, //购买数量
				storageNum: '', //存储数量
				selectNum: 0, //选中多少个
				discountMoreState: false, //更多优惠展开/关闭状态
				activityMoreState: false, //更多活动展开/关闭状态
				loginType: false, //批发商/会员类型颜色变化
				wholesalerText: '立即购买', //批发商购买单品满500文字显示
				couponList: [], //商品优惠券
				firstCouponList: {}, //首个商品优惠券
				otherCouponList: [], //更多部分商品优惠券
				activityGoodIds: [], //多件优惠活动
				firstActivityGoodIds: {}, //首个多件优惠活动
				otherActivityGoodIds: [], //更多部分多件优惠活动
				flasgSaleGoodIds: [], //限时抢购活动
				firstFlasgSaleGoodIds: {}, //首个限时抢购活动
				otherFlasgSaleGoodIds: [], //更多部分限时抢购活动
				receiveCoupon: {}, //领取到的优惠券
				attrGoods: [], //领取到的优惠券
				qrcodehref: '', //手机分享二维码
				qrcodehrefPC: '', //PC分享二维码
				shareimg: '',
				okLogin:false,//批发商是否登录

			}
		},
		created() {
			this.userId = this.$cookies.get('userId');
			this.token = this.$cookies.get('token');
			this.getParams()
		},
		mounted() {
			this.$nextTick(() => {
				if(this.goodsId != null || this.goodsId != "") {
					console.log('goodsId:' + this.goodsId)
					this.isLogin()
					this.getGoodDetails();
					this.getCateName();
					this.getAttr();
					if(this.$cookies.get('userId') && this.$cookies.get('token')) {
						this.userId = this.$cookies.get('userId');
						this.token = this.$cookies.get('token');
						this.collecGood();
					} else {

					}
				}
				if(this.userId && this.token) {
					this.getCoupon()
					this.getActivityByGoodIds()
					this.getflasgSaleByGoodIds()
				}

			})
			this.shareEvent()
		},
		methods: {
			isLogin(){
				 if(this.$cookies.get('userId')){
           		 	console.log(this.$cookies.get('userId'))
              	  	this.okLogin = true;
       		 	}else{
               		 this.okLogin = false;
        		}
			},
			//二维码生成
			qrcode() {
				var obj={
					width: 100,
					height: 100, // 高度
					text: this.qrcodehref // 二维码内容
					// render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
					// background: '#f0f'
					// foreground: '#ff0'
				}
				
				let qrcode = new QRCode('qrcode', obj)
				console.log('获取图片-----')
				console.log(qrcode)
				//console.log(qrcode._oDrawing._elImage)
				this.$refs.shareimgdiv.append(qrcode._oDrawing._elImage)

			},
			//		   点击下载图片
			loadshareimg() {
				// 通过选择器获取img元素
				var img = document.querySelector('.sharediv img')
				// 将图片的src属性作为URL地址
				var url = img.src
				console.log('点击下载图片')
				console.log(url)
				var a = document.createElement('a')
				var event = new MouseEvent('click')
				a.download = '民信商品分享'
				a.href = url
				a.dispatchEvent(event)
			},
			shareEvent() { //分享商品
				//pc端分享
				this.qrcodehrefPC = window.location.href  
				//手机端分享
				let hrefSe=window.location.href.split('#')[1]
				let hrefFi=this.$phoneURL+'/#'
				let shareHref=hrefFi+hrefSe
				this.qrcodehref = shareHref  
				console.log('分享的链接手机')
				console.log(this.$phoneURL)
				console.log(this.qrcodehref)
				console.log('分享的链接pc')
				console.log(this.qrcodehrefPC)
				
				this.qrcode()
			},
			// 复制成功
			onCopy(e) {
				console.log(e);
				console.log(this.qrcodehrefPC);

				if(this.qrcodehrefPC!=''){
					this.$message({
					message: '复制成功',
					type: 'success'
				})
				}else{
					this.$message({
					message: '复制失败',
					type: 'error'
				})
				}

			},
			// 复制失败
			onError(e) {
				alert("失败");
			},

			//		区分批发商和普通会员，判断批发商是否满足起送价
			getWholesalerText() {
				let userType = this.$cookies.get('4806dadc9d5788d18e5c7705e7643333')
				console.log('区分批发商和普通会员，判断批发商是否满足起送价')
				console.log(userType)
				if(userType == 'b326') {
					this.loginType = false
					this.wholesalerText = '立即购买'
				} else {
					console.log('批发商进入---------')
					
					let allSum = this.list.price * this.purchaseNumber
					
					if(allSum == 0||this.list.price=='审核后显示') {
						this.loginType = true
						this.wholesalerText = '满500元起送'
					} else if(allSum > 0 && allSum < 500) {
						this.loginType = true
						let leave = 500 - allSum
						this.wholesalerText = '还差' + leave + '元起送'
					} else if(allSum >= 500) {
						this.loginType = false
						this.wholesalerText = '立即购买'
					}
				}

			},
			getParams() { //获取到路由带过来的参数
				var _this = this;
				let routerParams = this.$route.params.goodsId;
				var routerQuery = this.$route.query.goodsId;
				this.msg = this.$route.params.goodsId;
				this.query = this.$route.query.goodsId;
				//将数据放在当前组件的数据内
				if(routerParams == routerQuery) { //参数的保存商品Id
					this.goodsId = routerQuery;
					//console.log('goodsId:' + this.goodsId)
				} else {
					this.goodsId = routerParams;
					//	console.log('goodsId:' + this.goodsId)
				}
				if(localStorage.getItem('userId')) { //获取用户Id
					this.userId = 'userId=' + localStorage.getItem('userId');
					//alert('授权后获取的用户Id'+localStorage.getItem('userId'))
				}
				if(this.goodsId) { //当有无参数的判断
					//	console.log(this.goodsId)

				} else {
					//console.log('no')
					this.$dialog.alert({
						title: 'goodsId不能为空参数'
					}).then((res) => { // on close
						_this.$router.back()
					});
					//console.log('6')
				}
			},

			getGoodDetails() { //商品详情
				var _this = this;
				var user = {
					goodId: this.goodsId,
					userType: '',
					tel: '',
				}
				if(_this.$cookies.get('4806dadc9d5788d18e5c7705e7643333') == 'b326b5062b2f0e69046810717534cb09') {
					user.userType = 2
				} else {
					user.userType = 1
				}
				if(_this.$cookies.get('tel')) {
					user.tel = _this.$cookies.get('tel')
				} else {
					user.tel = ''
				}
				this.$getAxios({
					url: '/mall/getGoodInfo',
					method: 'get',
					params: user,
				}).then(function(res) {
					console.log(res.data)
					console.log('商品详情' + res.data.msg);
					if(res.data.code == 20000) {
						console.log(res.data.msg)
					} else if(res.data.code == 10000) {
						var success = res.data.extend.success;
						let obj = {
							cateId: success.cateId, //分类Id
							goodId: success.goodId, //商品Id
							gMercode: success.gMercode, //商品Id
							introduction: success.introduction, //产品介绍
							isBargain: success.isBargain, //是否是特价商品 true为是 false为否
							isMemberDiscount: success.isMemberDiscount, //是否使用会员价 true为是 false为否
							isShelf: success.isShelf, //是否是上架商品 true为是 false为否
							memberPrice: success.memberPrice, //会员价
							name: success.name, //商品名
							originalPrice: success.originalPrice, //原价
							sales: success.sales, //销量
							totalStock: success.totalStock, //总库存
							tradePrice: success.tradePrice, //批发价
							actCheck: false,
							subName: success.subName //副标题
						}

						if(_this.$cookies.get('4806dadc9d5788d18e5c7705e7643333') == 'b326b5062b2f0e69046810717534cb09') {
							if(success.tradePrice == ' ' || success.tradePrice == null || success.tradePrice < 0) {
								obj.price = '审核后显示';
								obj.storagePrice = '审核后显示';
								// if(success.tradePrice==0){
								// 	obj.price = success.tradePrice;
								// 	_this.specPrice = success.tradePrice;//批发价
								// }
							} else {
								obj.price = success.tradePrice; //批发价
								obj.storagePrice = success.tradePrice; //批发价
							}
						} else {
							if(success.memberPrice == ' ' || success.memberPrice == null || success.tradePrice < 0) {
								obj.price = '审核后显示';
								obj.storagePrice = '审核后显示';
								// if(success.memberPrice==0){
								// 	obj.price= success.memberPrice;//当前价
								// 	_this.specPrice = success.memberPrice;//当前价
								// }
							} else {
								obj.price = success.memberPrice; //当前价
								obj.storagePrice = success.memberPrice; //当前价
							}
						}
						obj.brand = '';
						if(success.brand == '' || success.brand == null) {

						} else {
							obj.brand = '品牌' + success.brand; //品牌
						}
						if(success.detailContent == '' || success.detailContent == null) {
							obj.detailContent = ''
						} else {
							var detailContent = success.detailContent.toLowerCase();
							console.log(detailContent);
							var isImg = detailContent.indexOf('png') > -1 || detailContent.indexOf('tiff') > -1 || detailContent.indexOf('gif') > -1 || detailContent.indexOf('jpg') > -1 || detailContent.indexOf('webp') > -1 || detailContent.indexOf('bmp') > -1;
							//webp，bmp,jpg,png,tiff,gif
							console.log(isImg)
							if(isImg) {
								obj.isImgCheck = true
								obj.detailContent = success.detailContent
							} else {
								obj.isImgCheck = false;
								obj.detailContent = success.detailContent
							}
							//var
						}
						obj.imagesList = [];
						//	console.log(res.data.extend.success.goods_images.length);
						if(success.goods_images.length == 0 || success.goods_images == null) {
							var imgObj = {}
							imgObj.imageUrl = require('../../assets/gengxin.jpg');
							obj.ImgSrc = require('../../assets/gengxin.jpg');
							obj.imagesList.push(imgObj);
						} else {
							for(var i = 0; i < success.goods_images.length; i++) {
								var imgObj = {
									goodsId: success.goods_images[i].goodsId,
									imageId: success.goods_images[i].imageId,
									imageUrl: success.goods_images[i].imageUrl,
									isHead: success.goods_images[i].isHead,
								}
								if(success.goods_images[i].isHead == true) {
									obj.ImgSrc = success.goods_images[i].imageUrl
								}
								obj.imageUrl = success.goods_images[i].imageUrl;

								if(obj.imagesList.length >= 5) {} else {
									obj.imagesList.push(imgObj)
								}
							}
						}
						obj.tabs = [];
						for(var j = 0; j < success.goods_tabs.length; j++) {
							if(success.goods_tabs.length > 0) {
								var objTab = {

								}
								if(success.goods_tabs[j].tab == null || success.goods_tabs[j].tab == '' || success.goods_tabs[j].tab == {}) {
									objTab.name = ''
								} else {
									objTab.name = success.goods_tabs[j].tab.name;

								}
								//objTab = success.goods_tabs[j].tab
								obj.tabs.push(objTab);
							}
						}
						_this.list = obj;

						//						添加的商品属性
						_this.attrGoods = success.detailCpropertyVo
						//                          区分批发商和普通会员，判断批发商是否满足起送价
						_this.getWholesalerText()
					}
				}).catch(function(err) {
					console.log(err)
				});
			},

			getCateName() { //根据商品Id获取商品所属的分类名称
				var vm = this;
				var user = {
					goodId: this.goodsId
				}
				this.$getAxios({
					url: '/mall/getPrantsCateByGoodId',
					method: 'get',
					params: user,
				}).then(function(res) {
					console.log(res.data)
					console.log('分类名称' + res.data.msg);
					if(res.data.code == 20000) {
						console.log(res.data.msg)
					} else if(res.data.code == 10000) {
						var success = res.data.extend.success;
						vm.classList = []
						if(success == null || success.length == 0) {

						} else {
							for(var i = 0; i < success.length; i++) {
								var obj = {
									cateId: success[i].cateId,
									cateName: success[i].cateName,
									className: 'fa fa-angle-right',
								}
								if(i == 0) {
									obj.className = '';
								}
								vm.classList.push(obj);
							}
						}
					}
				}).catch(function(err) {
					console.log(err)
				});
			},
			//      面包屑跳转
			goBreadUrl(index) {
				console.log('面包屑对应的条目')
				console.log(index)
				console.log(this.classList)
				let first
				let second
				let third
				for (let i=0;i<this.classList.length;i++) {
					if(i==0){
						first=this.classList[i].cateId
					}else if(i==1){
						second=this.classList[i].cateId
					}else if(i==2){
						third=this.classList[i].cateId
					}
				}
				
				
				if(index==0){
					this.$router.push({
						path:'/goods',
						name:'goods', 
						params:{
							cateId:first
						},
						query:{
		                    firstId:first,
						}
					})	
				}else if(index==1){
					this.$router.push({
						path:'/goods',
						name:'goods', 
						params:{
							cateId:first
						},
						query:{
		                    firstId:first,
		                    secondId:second
						}
					})	
				}else if(index==2){
					this.$router.push({
						path:'/goods',
						name:'goods', 
						params:{
							cateId:first
						},
						query:{
		                    firstId:first,
		                    secondId:second,
		                    thirdId:third
						}
					})	
				}
				
			},
			getAttr() { //商品的销售属性和属性值
				var _this = this;
				var spec = {
					goodId: this.goodsId
				}
				console.log(spec);
				//alert('有规格');
				this.$getAxios({
					url: '/mall/getGoodPropertyAndValue',
					method: 'get',
					params: spec,
				}).then(function(res) {
					console.log(res.data)
					console.log('商品的属性和属性值' + res.data.msg);
					if(res.data.code == 20000) {
						console.log(res.data.msg)
					} else if(res.data.code == 10000) {
						//alert('有规格');
						var success = res.data.extend.success;
						console.log(success)
						if(success == null || success.length == 0) {
							console.log('success长度为空');
							_this.isSingleCheck = true;
							_this.getSpec();
						} else if(success[0] == null) {
							console.log('success长度为空');
							_this.isSingleCheck = true;
							_this.getSpec();
						} else {
							_this.isSingleCheck = false;
							_this.stockCheck = false;
							_this.attrList = []
							for(var i = 0; i < success.length; i++) {
								var obj = {
									name: success[i].name, //属性名
									isCheck: true, //true为文字 false图片
									isSelCheck: false, //是否已经选择
								}
								_this.arrList.push('new');
								obj.specList = []
								for(var j = 0; j < success[i].valueList.length; j++) {
									var spec = {
										cpvId: success[i].valueList[j].cpvId,
										value: success[i].valueList[j].value, //属性值
										gciUrl: '', //属性图片
										gciRemark: '', //属性备注
										active: ' ',
										className: '',
										seclectCheck: false,

									}
									if(success[i].valueList[j].goods_cpv_img.length > 0 || success[i].valueList[j].goods_cpv_img != null) {
										for(var k = 0; k < success[i].valueList[j].goods_cpv_img.length; k++) {
											spec.gciRemark = success[i].valueList[j].goods_cpv_img[k].gciRemark
											if(success[i].valueList[j].goods_cpv_img[k].gciUrl == null || success[i].valueList[j].goods_cpv_img[k].gciUrl == '') {

											} else {
												obj.isCheck = false;
												spec.gciUrl = success[i].valueList[j].goods_cpv_img[k].gciUrl;
											}
										}
									}
									obj.specList.push(spec)
								}
								_this.attrList.push(obj);
							}
							console.log(_this.attrList);
						}
						_this.getSpec();
					}
				}).catch(function(err) {
					console.log(err)
				});
			},
			forendTime(time) {
				var str = time.trim();
				var arr = str.split(" ");
				return arr[0];
			},
			getCoupon() { //是否有优惠券数据
				var u = navigator.userAgent;
				var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
				var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
				var _this = this;
				var user = {
					userId: this.userId,
					goodId: this.goodsId
				}
				this.couponList = [];
				this.firstCouponList = {};
				this.otherCouponList = [];
				this.$getAxios({
					url: '/mall/coupon/getCouponByGoods',
					method: 'get',
					params: user,
				}).then(function(res) {
					console.log(res.data);
					console.log('判断是否有优惠券');
					if(res.data.code == 20000) {
						//console.log(res.data.msg)
					} else if(res.data.code == 10000) {
						var resp = res.data.extend.resp;

						if(resp.length == 0 || resp == null) {
							console.log('no')
						} else {
							_this.isReceiveCheck = true;
							for(var i = 0; i < resp.length; i++) {
								var isCanCoupon = false
								if(resp[i].limitNumber <= resp[i].tokenNumber) { //优惠券本身数量
									isCanCoupon = true
								} else if(resp[i].isTokenNumberLimit) { //限制领取数量
									if(resp[i].limitTokenNumber <= resp[i].already_received_num) {
										isCanCoupon = true
									}
								}

								var obj = {
									isCanCoupon: isCanCoupon,
									couponId: resp[i].couponId,
									name: resp[i].name,
									// useStartTime:"2018-06-01 00:00:00",
									// useEndTime:"2018-06-29 00:00:00",
									limitNumber: resp[i].limitNumber,
									tokenNumber: resp[i].tokenNumber,
									useRange: resp[i].useRange,
									directOrPercent: resp[i].directOrPercent,
									conditionMoney: resp[i].conditionMoney,
									discountMoney: resp[i].discountMoney,
									discountPercent: resp[i].discountPercent,
									couponStatus: resp[i].couponStatus,
									// getStartTime:"2018-05-01 00:00:00",
									// getEndTime:"2018-06-20 00:00:00",
									isTokenNumberLimit: resp[i].isTokenNumberLimit,
									limitTokenNumber: resp[i].limitTokenNumber,
									couponVisibleUserType: resp[i].couponVisibleUserType,
									couponIsDelete: resp[i].couponIsDelete,
									couponConsumedCount: resp[i].couponConsumedCount,
									already_received_num: resp[i].already_received_num,
									discountMoneyed: resp[i].discountMoneyed,
									couponTemp1: resp[i].couponTemp1,
								}
								if(1 > 2) {

									obj.useStartTime = _this.forendTime(resp[i].useStartTime);
									obj.useEndTime = _this.forendTime(resp[i].useEndTime);
									obj.getEndTime = _this.forendTime(resp[i].getEndTime);
									obj.getStartTime = _this.forendTime(resp[i].getStartTime);
									//	console.log('1111111111111111')

								} else {
									obj.useStartTime = _this.forendTime(resp[i].useStartTime);
									obj.useEndTime = _this.forendTime(resp[i].useEndTime);
									obj.getEndTime = _this.forendTime(resp[i].getEndTime);
									obj.getStartTime = _this.forendTime(resp[i].getStartTime);
									//	console.log('2')
									//	console.log((obj.useStartTime))
								}
								var dataNew = new Date();
								//console.log(dataNew.getTime())
								//console.log(obj.useStartTime+"")
								//alert(obj.useStartTime)
								//alert(obj.useEndTime)
								//alert(dataNew.getTime())

								var getEnd = new Date(resp[i].getEndTime);
								//	console.log(getEnd.getTime())
								if(dataNew.getTime() > getEnd.getTime()) {
									obj.pastDate = true;
								} else {
									obj.pastDate = false;
								}
								//console.log(dataNew);
								//console.log(getEnd);
								_this.couponList.push(obj);

							}
							_this.firstCouponList = _this.couponList[0]
							for(let i = 1; i < _this.couponList.length; i++) {
								_this.otherCouponList.push(_this.couponList[i]);
							}
							console.log('优惠券----------')
							console.log(_this.couponList)

							// for(var i=0;i<resp.length;i++){
							// 	var obj ={
							// 		couponId:resp[i].couponId,//优惠券Id
							// 		name:resp[i].name,//优惠券名
							// 		useStartTime:resp[i].useStartTime,//优惠券开始使用的时间
							// 		useEndTime:resp[i].useEndTime,//优惠券结束时间
							// 		directOrPercent:resp[i].directOrPercent,// 0满减，1百分比
							// 		conditionMoney:resp[i].conditionMoney,//优惠券满足条件的金额
							// 		getStartTime:resp[i].getStartTime,//领取开取时间
							// 		getEndTime:resp[i].getEndTime,//领取结束时间
							// 		couponStatus:resp[i].couponStatus,//优惠券状态
							// 	}
							// 	if(resp[i].directOrPercent==0){//0满减 减多少
							// 		obj.discount = resp[i].discountMoney;
							// 	}else if(resp[i].directOrPercent==1){//1百分比 打折
							// 		obj.discount = resp[i].discountPercent;
							// 	}
							// 	_this.couponList.push(obj);
							// }
						}
					}
				}).catch(function(err) {
					console.log(err)
				});

			},
			receiveSuccess() { //领取优惠券事件
				if(this.drugTable.receiveCheck == false) {
					this.$goodClassListStore.state.alertStyle.overflow = 'hidden';
					this.drugTable.receiveCheck = true;
					console.log('1');
				} else if(this.drugTable.receiveCheck == true) {
					this.$goodClassListStore.state.alertStyle.overflow = 'auto';
					this.drugTable.receiveCheck = false;
					console.log('0');
				}
			},

			getCouponRevoke(index, couponId, goodId) { //领取优惠劵
				var _this = this
				var user = {
					couponId: couponId
				}

				user.userId = this.userId,
					user.token = this.token,
					console.log(user)
				this.$getAxios({
					url: '/mall/coupon/getCoupon',
					method: 'get',
					params: user
				}).then(function(res) {
					console.log(res.data)
					if(res.data.code == 20000) {
						var msg = res.data.msg;
						let fail = msg.indexOf('卡券已领完') > -1;
						if(fail) {
							_this.$message({
								message: msg,
								type: 'info'
							});
							
							//_this.getCoupon()

						}
					} else if(res.data.code == 10000) {

						var resp = res.data.extend.resp;
						_this.couponList[index].already_received_num++
							//      最终展示的优惠券
							for(let i = 0; i < _this.couponList.length; i++) {

								if(user.couponId == _this.couponList[i].couponId) {
									_this.receiveCoupon = _this.couponList[i]
								}
							}

						_this.receiveSuccess()

					}
				}).catch(function(err) {
					console.log(err)
				})
			},
			getActivityByGoodIds() { //获取多件优惠活动
				var _this = this
				var data = 'userId=' + this.userId + '&token=' + this.token +
					'&goodId[]=' + this.goodsId

				this.$postAxios({
					url: '/mall/active/getActivityByGoodIds',
					method: 'post',
					data: data
				}).then(function(res) {
					console.log('获取多件优惠活动-----')
					console.log(res.data.extend.resp)
						
					if(res.data.extend.resp.length) {
						
						_this.activityGoodIds = res.data.extend.resp
						
						console.log(_this.activityGoodIds)
						_this.firstActivityGoodIds = _this.activityGoodIds[0]
						
						for(let i = 1; i < _this.activityGoodIds.length; i++) {
							_this.otherActivityGoodIds.push(_this.activityGoodIds[i]);
						}
					}

				})
			},
			getflasgSaleByGoodIds() { //限时活动
				var _this = this;
				var data = 'userId=' + this.userId + '&token=' + this.token +
					'&goodId[]=' + this.goodsId

				this.$postAxios({
					url: '/mall/flasgSale/getflasgSaleByGoodIds',
					method: 'post',
					data: data
				}).then(function(res) {
					console.log(res.data.extend)
					if(res.data.extend.resp.length) {
						_this.flasgSaleGoodIds = res.data.extend.resp
						console.log('获取限时活动-----')
						console.log(_this.flasgSaleGoodIds)
						_this.firstFlasgSaleGoodIds = _this.flasgSaleGoodIds[0]
						
						console.log(_this.flasgSaleGoodIds[0]!=null)
						for(let i = 1; i < _this.flasgSaleGoodIds.length; i++) {
							_this.otherFlasgSaleGoodIds.push(_this.flasgSaleGoodIds[i]);
						}
					}

				})

			},
			getSpec() { //获取商品的规格
				var _this = this;
				var vm = this;
				var spec = {
					goodId: this.goodsId
				}
				if(vm.$cookies.get('4806dadc9d5788d18e5c7705e7643333') == 'b326b5062b2f0e69046810717534cb09') {
					spec.userType = 2;
					//console.log('you')
				} else {
					spec.userType = 1;
					//console.log('no')
				}
				if(vm.$cookies.get('tel')) {
					spec.tel = vm.$cookies.get('tel');
					//console.log('youu')
				} else {
					spec.tel = ''
					//console.log('noo')
				}
				console.log(spec);
				this.$getAxios({
					url: '/mall/getGoodPropertyAndValueTwo',
					method: 'get',
					params: spec,
				}).then(function(res) {
					console.log(res.data)
					console.log('商品规格' + res.data.msg);
					if(res.data.code == 20000) {
						console.log(res.data.msg)
					} else if(res.data.code == 10000) {
						//alert('有规格');
						var success = res.data.extend.resp;
						//console.log(success)
						if(success.calculate.length == 0) {
							console.log('success为空')
						} else {
							if(_this.isSingleCheck) { //是否是单品
								for(var i = 0; i < success.calculate.length; i++) {
									_this.goodsSkuId = success.calculate[i].goodsSkuValueId;
									if(success.calculate[i].stock == null || success.calculate[i].stock == '') {
										_this.goodsStock = 0;
									} else {
										_this.goodsStock = success.calculate[i].stock; //总库存
									}
								}
							} else {
								_this.specIdList = [];
								for(var i = 0; i < success.calculate.length; i++) {
									var sku = {
										tradePrice: success.calculate[i].tradePrice, //批发价
										goodsSkuValueId: success.calculate[i].goodsSkuValueId,
										stock: success.calculate[i].stock, //批发价
									}
									_this.goodsStock = success.calculate[0].stock; //总库存
									if(vm.$cookies.get('4806dadc9d5788d18e5c7705e7643333') == 'b326b5062b2f0e69046810717534cb09') {
										////价格
										if(success.calculate[i].tradePrice == ' ' || success.calculate[i].tradePrice == null) {
											sku.price = '审核后显示';
											// if(success[i].tradePrice==0){
											// 	sku.price = success[i].tradePrice;
											// }
										} else {
											sku.price = success.calculate[i].tradePrice; //批发商的价格
										}
									} else {
										if(success.calculate[i].price == '' || success.calculate[i].price == null) {
											sku.price = '审核后显示';
											// if(success[i].memberPrice==0){
											// 	sku.price = success[i].memberPrice;
											// }
										} else {
											sku.price = success.calculate[i].price; //现价
										}
									}
									sku.cpvIdList = []
									for(var j = 0; j < success.calculate[i].goods_sku_sell_properties.length; j++) {
										sku.cpvIdList.push(success.calculate[i].goods_sku_sell_properties[j].cpvId)
									}
									console.log(sku.cpvIdList)
									_this.specIdList.push(sku);
								}
								console.log(_this.specIdList)
							}

						}
					}
				}).catch(function(err) {
					console.log(err)
				});

			},
//			getSpec() { //获取商品的规格
//				var _this = this;
//				var vm = this;
//				var spec = {
//					goodId: this.goodsId
//				}
//				if(vm.$cookies.get('4806dadc9d5788d18e5c7705e7643333') == 'b326b5062b2f0e69046810717534cb09') {
//					spec.userType = 2;
//					//console.log('you')
//				} else {
//					spec.userType = 1;
//					//console.log('no')
//				}
//				if(vm.$cookies.get('tel')) {
//					spec.tel = vm.$cookies.get('tel');
//					//console.log('youu')
//				} else {
//					spec.tel = ''
//					//console.log('noo')
//				}
//				console.log(spec);
//				this.$getAxios({
//					url: '/mall/getGoods_Sku_Value',
//					method: 'get',
//					params: spec,
//				}).then(function(res) {
//					console.log(res.data)
//					console.log('商品规格' + res.data.msg);
//					if(res.data.code == 20000) {
//						console.log(res.data.msg)
//					} else if(res.data.code == 10000) {
//						//alert('有规格');
//						var success = res.data.extend.success;
//						//console.log(success)
//						if(res.data.extend.success.length == 0) {
//							console.log('success为空')
//						} else {
//							if(_this.isSingleCheck) { //是否是单品
//								for(var i = 0; i < success.length; i++) {
//									_this.goodsSkuId = success[i].goodsSkuValueId;
//									if(success[i].stock == null || success[i].stock == '') {
//										_this.goodsStock = 0;
//									} else {
//										_this.goodsStock = success[i].stock; //总库存
//									}
//								}
//							} else {
//								_this.specIdList = [];
//								for(var i = 0; i < success.length; i++) {
//									var sku = {
//										tradePrice: success[i].tradePrice, //批发价
//										goodsSkuValueId: success[i].goodsSkuValueId,
//										stock: success[i].stock, //批发价
//									}
//									_this.goodsStock = success[0].stock; //总库存
//									if(vm.$cookies.get('4806dadc9d5788d18e5c7705e7643333') == 'b326b5062b2f0e69046810717534cb09') {
//										////价格
//										if(success[i].tradePrice == ' ' || success[i].tradePrice == null) {
//											sku.price = '审核后显示';
//											// if(success[i].tradePrice==0){
//											// 	sku.price = success[i].tradePrice;
//											// }
//										} else {
//											sku.price = success[i].tradePrice; //批发商的价格
//										}
//									} else {
//										if(success[i].price == '' || success[i].price == null) {
//											sku.price = '审核后显示';
//											// if(success[i].memberPrice==0){
//											// 	sku.price = success[i].memberPrice;
//											// }
//										} else {
//											sku.price = success[i].price; //现价
//										}
//									}
//									sku.cpvIdList = []
//									for(var j = 0; j < success[i].goods_sku_sell_properties.length; j++) {
//										sku.cpvIdList.push(success[i].goods_sku_sell_properties[j].cpvId)
//									}
//									console.log(sku.cpvIdList)
//									_this.specIdList.push(sku);
//								}
//								console.log(_this.specIdList)
//							}
//
//						}
//					}
//				}).catch(function(err) {
//					console.log(err)
//				});
//
//			},
			getGoodSku() { //获取相关属性
				var _this = this;
				var vm = this;
				var spec = {
					goodId: this.goodsId
				}

				console.log(spec);
				this.$getAxios({
					url: '/mall/getGoodsKu',
					method: 'get',
					params: spec,
				}).then(function(res) {

					console.log('获取相关商品属性' + res.data.msg);
					console.log(res.data)
					if(res.data.code == 20000) {
						console.log(res.data.msg)
					} else if(res.data.code == 10000) {
						var success = res.data.extend.success;
						//console.log(success)
						if(res.data.extend.success.length == 0) {
							console.log('success为空')
						} else {
							for(var i = 0; i < success.length; i++) {

							}

						}
					}
				}).catch(function(err) {
					console.log(err)
				});
			},

			getSkuNum() { //获取民信商品库存
				var _this = this;
				var data = {
					goodId: this.goodsId,
					good_sku_id: this.goodsSkuId
				}
				console.log(data);
				this.$getAxios({
					url: '/mall/getSkuSum',
					method: 'get',
					params: data,
				}).then(function(res) {
					console.log(res.data);
					if(res.data.code == 20000) {
						//	console.log('获取民信商品库存失败，请刷新')
					} else if(res.data.code == 10000) {
						//console.log('获取民信商品库存成功，请刷新');
						if(res.data.extend.success == '' || res.data.extend.success == null) {
							//	console.log('获取民信商品库存为0');
							_this.goodsStock = 0;
							if(res.data.extend.success == 0) {
								_this.goodsStock = res.data.extend.success
							}
						} else {
							if(res.data.extend.success > 0) {
								_this.goodsStock = res.data.extend.success;
							} else {
								_this.goodsStock = 0
							}
							console.log('获取民信商品库存为' + _this.goodsStock);
						}
					}
				}).catch(function(err) {
					console.log(err)
				})

			},

			collecGood() { //此商品是否已经收藏
				var _this = this;
				var data = 'userId=' + this.userId + '&token=' + this.token + '&goodId=' + this.goodsId
				console.log(this.$cookies.get('userId') && this.$cookies.get('token'));
				console.log(data);
				this.$postAxios({
					url: '/mall/isCollecGood',
					method: 'post',
					data: data,
				}).then(function(res) {
					console.log(res.data);
					if(res.data.code == 20000) {
						let err_code = res.data.extend.err_code;
						let token = err_code.indexOf('令牌失效') > -1;
						if(token) {

						}
						console.log('请求此商品是否已经收藏失败，请刷新')
					} else if(res.data.code == 10000) {
						console.log('请求此商品是否已经收藏成功，请刷新');
						if(res.data.extend.success != 0) {
							_this.collId = res.data.extend.success
							_this.isCollectionCheck = true
							_this.jionCollectionClassName = 'jionCollection';
						} else if(res.data.extend.success == 0 || res.data.extend.success == null) {
							_this.isCollectionCheck = false
							_this.jionCollectionClassName = '';
						}
					}
				}).catch(function(err) {
					console.log(err)
				})

			},

			joinInCollectionEvent() { //是否加入收藏
				if(this.$cookies.get('userId') && this.$cookies.get('token')) {
					if(!this.isCollectionCheck) {
						this.heart()
					} else {
						this.deteleEvent()
					}
				} else {
					this.$confirm('', '登录后才能操作加入收藏', {
						confirmButtonText: '登录',
						cancelButtonText: '取消',
						//  type: 'warning',
						center: true
					}).then(() => {
						this.$router.push({
							path: '/login'
						})
					}).catch(() => {

					});
				}
				console.log(this.isCollectionCheck)
			},

			heart() { //收藏
				var _this = this;
				if(this.$cookies.get('userId') && this.$cookies.get('token')) {
					var vm = this;
					var data = 'userId=' + this.userId + '&token=' + this.token;
					data += '&goodId=' + this.goodsId;
					console.log(data);
					this.$postAxios({
						url: '/mall/addUserGoodCollecGoods',
						method: 'post',
						data: data,
					}).then(function(res) {
						console.log(res.data);
						if(res.data.code == 20000) {
							console.log('收藏失败')
							_this.isCollectionCheck = false;
							let err_code = res.data.extend.err_code
							let token = err_code.indexOf('令牌失效') > -1
							if(token) {
								_this.$confirm('', '登录后才能收藏', {
									confirmButtonText: '登录',
									cancelButtonText: '取消',
									// type: 'warning',
									center: true
								}).then(() => {
									_this.$router.push({
										path: '/login'
									})
								}).catch(() => {

								});
							}
						} else if(res.data.code == 10000) {
							_this.collId = res.data.extend.success;
							_this.isCollectionCheck = true
							_this.jionCollectionClassName = 'jionCollection';
							_this.$message({
								message: '成功加入收藏',
								type: 'success'
							});
						}
					}).catch(function(err) {
						console.log(err)
					})
				} else {
					_this.$confirm('', '登录后才能收藏', {
						confirmButtonText: '登录',
						cancelButtonText: '取消',
						//  type: 'warning',
						center: true
					}).then(() => {
						_this.$router.push({
							path: '/login'
						})
					}).catch(() => {

					});
				}
			},

			deteleEvent() { //单个移除收藏商品
				this.collectionCheck = !this.collectionCheck
				var _this = this;
				let collId = this.collId;
				var data = 'userId=' + this.userId + '&token=' + this.token + '&collId[]=' + collId;
				console.log(data)
				this.$postAxios({
					url: '/mall/delUserCollecGoods',
					method: 'post',
					data: data,
				}).then(function(res) {
					console.log(res.data)
					console.log('收藏' + res.data.msg);
					if(res.data.code == 20000) {
						_this.collectionCheck = true;
						let err_code = res.data.extend.err_code
						let token = err_code.indexOf('令牌失效') > -1
						if(token) {
							_this.$confirm('', '登录后才能收藏', {
								confirmButtonText: '登录',
								cancelButtonText: '取消',
								// type: 'warning',
								center: true
							}).then(() => {
								_this.$router.push({
									path: '/login'
								})
							}).catch(() => {

							});
						}
					} else if(res.data.code == 10000) {
						_this.isCollectionCheck = false
						_this.jionCollectionClassName = ' ';
						_this.$message({
							message: '移除收藏成功',
							type: 'success'
						});
						console.log(res.data.msg);
					}
				}).catch(function(err) {
					console.log(err)
				});
			},

			//      更多优惠券的展示
			getDiscountMore(type){
				if(type) {
					this.discountMoreState = true
					this.activityMoreState = false
				} else {
					this.discountMoreState = false
				}
			},

			//      更多活动的展示
			getActivityMore(type){
				if(type) {
					this.activityMoreState = true
					this.discountMoreState = false
				} else {
					this.activityMoreState = false
				}
			},
			attributeClick(ev, index2, check){ //选择销售属性
				var _this = this;
				if(check == 2) {
					this.list.ImgSrc = this.attrList[ev].specList[index2].gciUrl;
				}
				// console.log(this.arrList);
				if(this.attrList[ev].specList[index2].seclectCheck == false) {
					this.listfor(this.attrList[ev].specList);
					this.attrList[ev].specList[index2].className = 'show';
					this.attrList[ev].specList[index2].seclectCheck = true;
					this.arrList.splice(ev, 1, this.attrList[ev].specList[index2].cpvId)

					if(this.attrList[ev].isSelCheck) {} else {
						this.attrList[ev].isSelCheck = true;
						this.selectNum++;
					}

				} else {
					this.listfor(this.attrList[ev].specList);
					this.attrList[ev].specList[index2].className = ' ';
					this.attrList[ev].specList[index2].seclectCheck = false;
					this.attrList[ev].isSelCheck = false;
					this.arrList.splice(ev, 1, 'new');
					this.selectNum--;
				}
				if(this.selectNum == 0) {
					this.list.price = this.list.storagePrice
				}
				if(this.arrList.length == this.attrList.length) {
					getSkuid(this.arrList, this.specIdList);
				}
				console.log(this.arrList);

				function getSkuid(user_cpids, sku_arry) {
					for(var s = 0; s < sku_arry.length; s++) {
						let sku_cpids = new Set(sku_arry[s].cpvIdList)
						var flag = true;
						for(var i = 0; i < user_cpids.length; i++) {
							if(!sku_cpids.has(user_cpids[i])) {

								flag = false;
								console.log(false)
								break;
							}
						}
						if(!flag) {
							continue;
						} else {
							_this.list.price = sku_arry[s].price;
							// _this.specPrice = sku_arry[s].price;
							_this.goodsStock = sku_arry[s].stock;
							_this.goodsSkuId = sku_arry[s].goodsSkuValueId;
							var goodsSkuId = sku_arry[s].goodsSkuValueId;
							break;
						}
					}
					if(goodsSkuId == undefined || goodsSkuId == '') {
						_this.isGoodSkuIdCheck = false;
						_this.btnCheck = false;
						if(_this.selectNum == _this.attrList.length) {
							_this.isGoodSkuIdCheck = true;
						}
						console.log(_this.isGoodSkuIdCheck)
					} else {
						_this.stockCheck = true;
						_this.isGoodSkuIdCheck = true;
						_this.btnCheck = true;
					}
					console.log(goodsSkuId);
					return goodsSkuId
				}

			},

			suitClick(index){
				if(this.suitList[index].seclectCheck == false) {
					this.listfor(this.suitList);
					this.prohibit(this.suitList);
					this.suitList[index].className = 'show';
					this.suitList[index].seclectCheck = true;
				} else {
					this.listfor(this.suitList);
					this.suitList[index].className = ' ';
					this.suitList[index].seclectCheck = false;
				}
			},

			listfor(ev){ //默认状态
				// console.log(ev)
				for(var i = 0; i < ev.length; i++) {
					ev[i].className = ' ';
					ev[i].seclectCheck = false;
				}
			},

			prohibit(ev){ //禁止状态
				for(var i = 0; i < ev.length; i++) {
					ev[i].className = 'active';
					ev[i].seclectCheck = false;
				}
			},

			addClick(){ //添加数量
				this.storageNum = this.purchaseNumber;
				var sengh = String(this.purchaseNumber);
				//	console.log(typeof(sengh));
				var falg = true;
				var reg = new RegExp("^[0-9]+([.]{1}[0-9]+){0,1}$");
				var zhEng = new RegExp("^-?\\d+$")　　 //正整数
				if(!reg.test(sengh)) {
					this.purchaseNumber = 1;
					this.$message({
						showClose: true,
						message: '只能输入数字和小数点'
					});
					return
				} else {
					var leixing = Number(sengh);
					if(!zhEng.test(leixing)) {
						var firstdecimal = Math.round(leixing * 10) / 10;
						if(firstdecimal == leixing) {
							leixing++;
							leixing = leixing.toFixed(1);
							//console.log('one');
						} else {
							leixing++;
							leixing = leixing.toFixed(2);
						}
						//console.log(leixing)
					} else {
						leixing++;
					}
					if(leixing > this.goodsStock) {
						// this.purchaseNumber = this.storageNum
						falg = false;
						this.$message({
							showClose: true,
							message: '已到达最大购买量'
						});
						return;
					}
					if(leixing <= 0) {
						// this.purchaseNumber = this.storageNum
						falg = false;
						this.$message({
							showClose: true,
							message: '购买量不能小于或等于0'
						});
						return
					}
				}
				if(falg) {
					this.purchaseNumber = leixing;
				}
				//           区分批发商和普通会员，判断批发商是否满足起送价
				this.getWholesalerText()
			},

			reduceClick(){ //减少数量
				var sengh = String(this.purchaseNumber);
				//	console.log(typeof(sengh));
				var falg = true;
				var reg = new RegExp("^[0-9]+([.]{1}[0-9]+){0,1}$");
				var zhEng = new RegExp("^-?\\d+$")　　 //正整数
				if(!reg.test(sengh)) {
					this.purchaseNumber = 1;
					this.$message({
						showClose: true,
						message: '只能输入数字和小数点'
					});
					return
				} else {
					var leixing = Number(sengh);
					if(!zhEng.test(leixing)) {
						var firstdecimal = Math.round(leixing * 10) / 10;
						if(firstdecimal == leixing) {
							leixing--;
							leixing = leixing.toFixed(1);
							//console.log('one');
						} else {
							leixing--;
							leixing = leixing.toFixed(2);
						}
						//console.log(leixing)
					} else {
						leixing--;
					}
					if(leixing > this.goodsStock) {
						falg = false;
						this.$message({
							showClose: true,
							message: '最大购买量为' + this.goodsStock
						});
						return;
					}
					if(leixing <= 0) {
						falg = false;
						this.$message({
							showClose: true,
							message: '购买量不能小于或等于0'
						});
						return
					}
				}
				if(falg) {
					this.purchaseNumber = leixing;
				}
				//           区分批发商和普通会员，判断批发商是否满足起送价
				this.getWholesalerText()

			},

			inputEvent(){
				this.storageNum = this.purchaseNumber;
			},

			modifyBlur(){ //输入修改数量
				var sengh = String(this.purchaseNumber);
				//console.log(typeof(sengh));
				var falg = true;
				var reg = new RegExp("^[0-9]+([.]{1}[0-9]+){0,1}$");
				var zhEng = new RegExp("^-?\\d+$")　　 //正整数
				if(!reg.test(sengh)) {
					this.purchaseNumber = this.storageNum;
					this.$message({
						showClose: true,
						message: '只能输入数字和小数点'
					});
					return
				} else {
					var leixing = Number(sengh);
					if(!zhEng.test(leixing)) {
						var firstdecimal = Math.round(leixing * 10) / 10;
						if(firstdecimal == leixing) {
							leixing = leixing.toFixed(1);
							console.log('one');
						} else {
							leixing = leixing.toFixed(2);
						}
						//console.log(leixing)
					} else {

					}
					if(leixing > this.goodsStock) {
						this.purchaseNumber = this.goodsStock;
						falg = false;
						this.$message({
							showClose: true,
							message: '最大购买量为' + this.goodsStock
						});
						return;
					}
					if(leixing <= 0) {
						this.purchaseNumber = 1
						falg = false;
						this.$message({
							showClose: true,
							message: '购买量不能小于或等于0'
						});
						return
					}
				}
				if(falg) {
					this.purchaseNumber = leixing;
				}
				//           区分批发商和普通会员，判断批发商是否满足起送价
				this.getWholesalerText()
			},

			addCart() { //添加商品的请求 是给立即购买用的
				var _this = this;
				//console.log('立即')
				var data = 'userId=' + this.userId + '&token=' + this.token + '&goodId=' + this.goodsId + '&goodsSkuId=' + this.goodsSkuId + '&amount=' + this.purchaseNumber;
				if(this.goodsSkuId == '' || this.goodsSkuId == undefined) {
					_this.$message({
						message: 'skuId为空',
						type: 'load'
					});
					return
				}
				//console.log(data)
				this.$postAxios({
					url: '/mall/addShoppingCart',
					method: 'post',
					data: data,
				}).then(function(res) {
					_this.showAddCart = false;
					console.log(res.data);
					if(res.data.code == 20000) {
						//console.log(res.data.msg)
						let err_code = res.data.extend.err_code
						let token = err_code.indexOf('令牌失效') > -1
						if(token) {
							_this.$dialog.alert({
								title: '登录后才能购买',
								message: ' '
							}).then(() => {
								_this.$router.push({
									path: '/login'
								})
							});
						}
					} else if(res.data.code == 10000) {
						console.log(res.data.msg)
						sessionStorage.setItem('dteailsNum', _this.purchaseNumber);
						 _this.$countStore.state.cartList.getCountDate();//异步获取的购物数据
						// _this.$message({
						// 	message: '添加成功',
						// 	type: 'success'
						// });
						// _this.$router.push({
						//     path:'/infor/pay'
						// })

					}
				}).catch(function(err) {
					console.log(err)
				});
			},

			atOncePurchse(){ //立即购买
				var _this = this;
				// 批发商不满足满500起送条件
				
				var u = navigator.userAgent;
				var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
				var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
				let ua = navigator.userAgent.toLowerCase();
				console.log('12324')
				if(this.$cookies.get('userId') && this.$cookies.get('token')) {
					if(this.isSingleCheck) { //是单品
						if(this.goodsStock <= 0 || this.goodsStock == null) {
							this.$message({
								message: '此商品此时没有库存不能购买',
								showClose: true,
							});
							return
						} else if(this.goodsSkuId == '' || this.goodsSkuId == undefined) {
							this.$message({
								message: '此没有sku',
								showClose: true,
							});
							return
						} else if(this.list.price == 0 || this.list.price == '审核后显示' || this.list.price == null) {
							this.$message({
								message: '此商品此时没有价格不能购买',
								showClose: true,
							});
							return
						}
					} else {
						if(this.isGoodSkuIdCheck) {
							if(this.goodsStock <= 0 || this.goodsStock == null) {
								this.$message({
									message: '此商品此时没有库存不能购买',
									showClose: true,
								});
								return
							} else if(this.goodsSkuId == '' || this.goodsSkuId == undefined) {
								this.$message({
									message: '此没有sku',
									showClose: true,
								});
								return
							} else if(this.list.price == 0 || this.list.price == '审核后显示' || this.list.price == null) {
								this.$message({
									message: '此商品此时没有价格不能购买',
									showClose: true,
								});
								return
							}
						} else {
							this.incompleteCheck = true;
							this.isAtonceCheck = true;

							console.log('one');
							return
						}
					}
					// console.log('12324')
					this.addCart();
					//跳转到立即购买页面
					localStorage.setItem('atOnce', true);
					localStorage.setItem('goodsSkuIdArr', this.goodsSkuId + '&');
					localStorage.setItem('goodsIdArr', this.goodsId + '&');
					localStorage.setItem('dteailsNum',_this.purchaseNumber);
					localStorage.removeItem('itemIds');
					this.$router.push('/ordercheck')


				} else {
					_this.$confirm('', '登录后才能购买', {
						confirmButtonText: '登录',
						cancelButtonText: '取消',
						//  type: 'warning',
						center: true
					}).then(() => {
						_this.$router.push({
							path: '/login'
						})
					}).catch(() => {

					});

				}

			},

			cloneIncomplete(){ //关闭选择不全信息框
				this.incompleteCheck = false;
			},

			submitPurchse(){ //加入购物车方法 var data是加入购物车需要传的参数 需要传的参数有 用户Id 商品Id 数量
				var _this = this;
				console.log('加入')
				if(this.$cookies.get('userId') && this.$cookies.get('token')) {
					if(this.isSingleCheck) { //是单品执行
						var data = 'userId=' + this.userId + '&token=' + this.token + '&goodId=' + this.goodsId + '&goodsSkuId=' + this.goodsSkuId + '&amount=' + this.purchaseNumber;
						if(this.goodsStock <= 0 || this.goodsStock == null) {
							this.$message({
								message: '此商品此时没有库存不能购买',
								showClose: true,
							});
							return;
						} else if(this.goodsSkuId == '' || this.goodsSkuId == undefined) {
							this.$message({
								message: '没有sku',
								showClose: true,
							});
						} else if(this.list.price == 0 || this.list.price == '审核后显示' || this.list.price == null) {
							this.$message({
								message: '此商品价格审核中,敬请期待',
								showClose: true,
							});
							return;
						} else {
							addShopping(data)
						}
						console.log(data);
					} else {
						if(this.isGoodSkuIdCheck) {
							var data = 'userId=' + this.userId + '&token=' + this.token + '&goodId=' + this.goodsId + '&goodsSkuId=' + this.goodsSkuId + '&amount=' + this.purchaseNumber;
							if(this.goodsStock <= 0 || this.goodsStock == null) {
								this.$message({
									message: '此商品此时没有库存不能购买',
									showClose: true,
								});
								return;
							} else if(this.goodsSkuId == '' || this.goodsSkuId == undefined) {
								this.$message({
									message: '没有sku',
									showClose: true,
								});
							} else if(this.list.price == 0 || this.list.price == '审核后显示' || this.list.price == null) {
								this.$message({
									message: '此商品价格审核中,敬请期待',
									showClose: true,
								});
								return;
							} else {
								addShopping(data)
							}
						} else {
							if(this.incompleteCheck) {
								this.$message({
									message: '请选择商品属性',
									type: 'success'
								});
							} else {
								this.incompleteCheck = true;
								this.isAtonceCheck = false;
							}
						}

					}
				} else {
					_this.$confirm('', '登录后才能购买', {
						confirmButtonText: '登录',
						cancelButtonText: '取消',
						//  type: 'warning',
						center: true
					}).then(() => {
						_this.$router.push({
							path: '/login'
						})
					}).catch(() => {

					});
				}

				function addShopping(data) {
					_this.$postAxios({
						url: '/mall/addShoppingCart',
						method: 'post',
						data: data,
					}).then(function(res) {
						_this.showAddCart = false;
						console.log(res.data);
						if(res.data.code == 20000) {
							console.log('添加商品失败，请刷新');
							let err_code = res.data.extend.err_code
							let token = err_code.indexOf('令牌失效') > -1
							if(token) {
								_this.$confirm('', '登录后才能购买', {
									confirmButtonText: '登录',
									cancelButtonText: '取消',
									//  type: 'warning',
									center: true
								}).then(() => {
									_this.$router.push({
										path: '/login'
									})
								}).catch(() => {

								});
							}
						} else if(res.data.code == 10000) {
							_this.$message({
								message: '成功加入购物车',
								type: 'success'
							});							
							_this.$countStore.state.cartList.getCountDate();//异步获取的购物车商品件数
							_this.$cartListStore.state.cartList.getListDate();//异步获取的购物商品数据
						}
					}).catch(function(err) {
						console.log(err)
					})
				}
			},

			moveBoxMouseover(){ //鼠标悬浮到图片上出现滑块和放大镜大图片
				this.moveboxCheck = true;
				this.magnifierImgBoxCheck = true;
			},

			moveBoxMouseout(){ //鼠标离开让滑块和大图片消失
				this.moveboxCheck = false;
				this.magnifierImgBoxCheck = false;
			},

			moveBoxMousemove(event){ //鼠标移动事件
				var ev = event || window.event;
				this.init();
				// 鼠标距离屏幕距离
				let moveX = ev.clientX;
				let moveY = ev.clientY;
				//      console.log("ev"+moveX,moveY)
				var sImgBoxLeft = offset(this.oPreviewBox).left; //获取小div距离屏幕左边的距离
				var sImgBoxTop = offset(this.oPreviewBox).top; //获取小div距离屏幕最顶部的距离
				//  console.log(sImgBoxLeft,sImgBoxTop);
				var moveLastLeft = 0,
					moveLastTop = 0; //滑块最终的移动量
				var maxWidth = this.pWidth - this.houverWidth; //计算滑块最大的移动宽度
				var maxHeight = this.pHeight - this.houverHeight; //获取滑块最大的移动高度
				//  console.log(maxWidth,maxHeight);
				moveLastLeft = ev.clientX - sImgBoxLeft - this.houverWidth / 2;

				//  console.log("滑块最终的移动量"+ moveLastLeft,moveLastTop)//滑块最终的移动量
				if(this.scroll > 0) {
					moveLastTop = moveY - sImgBoxTop + this.scroll - this.houverHeight / 2;
				} else {
					moveLastTop = ev.clientY - sImgBoxTop - this.houverHeight / 2;
				}
				//判断滑块是否移除小div
				if(moveLastLeft < 0) {
					moveLastLeft = 0;
				} else if(moveLastLeft > maxWidth) {
					moveLastLeft = maxWidth;
				}

				if(moveLastTop < 0) {
					moveLastTop = 0;
				} else if(moveLastTop > maxHeight) {
					moveLastTop = maxHeight;
				}
				//使滑块移动
				this.oHoverBox.style.left = moveLastLeft + "px";
				this.oHoverBox.style.top = moveLastTop + "px";
				//使大图片移动
				//计算大图片移动的比例
				var ratioX = moveLastLeft / (this.pWidth - this.houverWidth);
				var ratioY = moveLastTop / (this.pHeight - this.houverHeight);
				// console.log(ratioX)
				// console.log(ratioY)
				//	console.log('计算大图片移动的比例x'+ratioX ,'计算大图片移动的比例y'+ratioY)
				this.oBigImg.style.left = ratioX * (this.bWidth - this.imgWidth) + "px";
				this.oBigImg.style.top = ratioY * (this.bHeight - this.imgHeight) + "px";
				//  console.log("计算大图片移动"+this.oBigImg.style.left,this.oBigImg.style.top);

			},

			init(){
				this.oHoverBox = this.$refs.hoverBox;
				this.oPreviewBox = this.$refs.previewBox;
				this.oBigImg = this.$refs.bigImg;
				this.imgBox = this.$refs.zoomBox;
				this.houverWidth = this.oHoverBox.offsetWidth;
				this.houverHeight = this.oHoverBox.offsetHeight;
				// console.log(this.houverWidth,this.houverHeight);
				this.pWidth = this.oPreviewBox.offsetWidth;
				this.pHeight = this.oPreviewBox.offsetHeight;
				// console.log(this.pWidth,this.pHeight)
				this.imgWidth = this.oBigImg.offsetWidth;
				this.imgHeight = this.oBigImg.offsetHeight;
				//  console.log(this.imgWidth,this.imgHeight)
				this.bWidth = this.imgBox.offsetWidth;
				this.bHeight = this.imgBox.offsetHeight;
				//   console.log(this.bWidth,this.bHeight)
				this.scroll = document.documentElement.scrollTop || document.body.scrollTop;
				// console.log("scroll"+this.scroll);
			},

			smallBoxMouseover(index) { //鼠标悬浮到小图片上换取图片
				this.list.ImgSrc = this.list.imagesList[index].imageUrl
			},
		}
	}
</script>

<style scoped>
	div,
	img,
	a,
	li,
	ul,
	p,
	span,
	h3,
	input,
	button,
	section {
		margin: 0;
		padding: 0;
	}

	img {
		border: none;
	}

	li {
		list-style: none;
	}

	.fl {
		float: left;
	}

	.fr {
		float: right;
	}

	input,
	button {
		outline: none;
		border: none;
		background: #ffffff;
	}

	.goodsDetails-information {
		width: 1200px;
	}

	.goodsDetails-information .goodType {
		width: 100%;
		line-height: 39px;
		border-bottom: 1px solid #E4E4E4;
	}

	.goodsDetails-information .goodType span {
		font-size: 15px;
		color: #666666;
		/* cursor: pointer; */
		/* font-weight: bold; */
	}

	.goodsDetails-information .goodType span:last-child {
		color: #FF3300;
	}

	.goodsDetails-information .goodType span i {
		padding: 0px 4px;
		font-size: 15px;
		color: #666666;
	}

	.goodsDetails-information .goodsDetails-information-content {
		width: 1200px;
		padding-top: 10px;
		position: relative;
	}

	.goodsDetails-information-content .content-img {
		width: 300px;
		height: 406px;
		margin-right: 20px;
	}

	.goodsDetails-information-content .content-img .magnifierImgbox {
		/* 放大镜 */
		width: 300px;
		height: 300px;
		border: 1px solid #f2f2f2;
		background: #fff;
		overflow: hidden;
		position: absolute;
		left: 310px;
		top: 10px;
		z-index: 33;
	}

	.magnifierImgbox img {
		position: absolute;
		left: 0px;
		top: 0px;
	}

	.goodsDetails-information-content .content-img .big-img {
		width: 296px;
		height: 296px;
		text-align: center;
		line-height: 296px;
		position: relative;
		border: 2px solid #fff;
		cursor: pointer;
	}

	.goodsDetails-information-content .content-img .big-img .movebox {
		width: 150px;
		height: 150px;
		background: #4fc1b0;
		opacity: .4;
		cursor: pointer;
		position: absolute;
		z-index: 2;
	}

	.goodsDetails-information-content .content-img .small-img {
		/*width: 268px;*/
		width: 290px;
		height: 52px;
		/*padding: 10px 0px 0px 32px;*/
	}

	.goodsDetails-information-content .content-img .small-img ul {
		width: 100%;
		height: 100%;
	}

	.content-img .small-img ul li {
		width: 52px;
		height: 52px;
		/*margin-left: 12px;*/
		margin-left: 5px;
		border: 2px solid #ffffff;
		-moz-box-sizing: border-box;
		-webkit-box-sizing: border-box;
		-o-box-sizing: border-box;
		-ms-box-sizing: border-box;
		box-sizing: border-box;
	}

	.content-img .small-img ul li:nth-of-type(1) {
		margin-left: 0px;
	}

	.content-img .small-img ul li img {
		width: 100%;
		height: 100%;
	}

	.content-img .small-img ul li:hover {
		border: 2px solid #cccccc;
	}

	.content-img .content-img-footer {
		width: 330px;
		height: 16px;
		line-height: 16px;
		padding-top: 30px;
		position: relative;
	}

	.content-img .content-img-footer p {
		padding-left: 26px;
		cursor: pointer;
		color: #999999;
		font-size: 12px;
	}

	.content-img .content-img-footer .collection,
	.content-img .content-img-footer .share {
		font-size: 14px;
		position: relative;
	}
	/*.content-img .content-img-footer .share:hover {
		color: #16a086;
	}*/

	.content-img .content-img-footer .collection .jionCollection {
		color: #ffa847;
	}

	.content-img .content-img-footer .fa-heart {
		color: #ffa847;
	}

	.content-img .content-img-footer p:nth-of-type(1) {
		padding-left: 0px;
		cursor: default;
	}

	.goodsDetails-information-content .content-information {
		width: 880px;
	}

	.content-information .drug-attribute-and-title {
		width: 100%;
		height: 60px;
	}

	.content-information h3 {
		height: 35px;
		line-height: 35px;
	}

	.content-information h3 .drug-attribute {
		/* min-width: 72px; */
		height: 17px;
		color: #ff6666;
		/* padding-right: 5px; */
	}

	.content-information h3 .drug-main-title {
		font-size: 18px;
		color: #333;
		font-weight: bold;
	}

	.drug-attribute-and-title .drug-sub-title {
		line-height: 25px;
		font-size: 12px;
		color: #ff6666;
	}

	.content-information .drug-detailed-information {
		width: 880px;
		position: relative;
	}

	.drug-detailed-information .sales-price-and-discount {
		width: 880px;
		/* height: 118px; */
		background: #f1f1f1;
	}

	.sales-price-and-discount .sales-price {
		height: 75px;
		line-height: 75px;
	}

	.sales-price .salse-name {
		width: 108px;
		height: 75px;
		line-height: 75px;
		font-size: 14px;
		color: #666;
		text-indent: 20px;
	}

	.sales-price .present-price {
		font-size: 32px;
		color: #FF3300;
	}
	.sales-price .nologinpresent-price {
		font-size: 22px;
		color: #FF3300;
	}
	.sales-price .present-price .yenSpan{
		font-size: 24px;
    float: left;
    margin-right: 4px;
	}
	.sales-price .activity-label {
		padding: 0px 13px;
	}

	.sales-price .activity-label span {
		padding: 5px 10px;
		font-size: 14px;
		color: #fff;
		background: #ffa847;
	}

	.sales-price .original-price {
		padding: 0px 13px;
		font-size: 14px;
		color: #999;
		text-decoration: line-through;
	}

	.sales-price-and-discount .discount {
		height: 43px;
		position: relative;
	}

	.discount .discount-name {
		width: 98px;
		height: 43px;
		text-indent: 20px;
		font-size: 14px;
		color: #666;
	}

	.discount .coupon-name {
		width: 50px;
		height: 24px;
		text-align: center;
		line-height: 24px;
		border: 1px dashed #FF3300;
		color: #FF3300;
	}

	.discount .discount-information {
		width: 100px;
		height: 26px;
		line-height: 26px;
		padding: 0px 20px;
		font-size: 14px;
		color: #666;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.discount .coupon-receive {
		height: 26px;
		line-height: 26px;
	}

	.discount .more-favorable {
		padding: 0px 0px 0px 40px;
		height: 26px;
		line-height: 26px;
		position: absolute;
		right: 20px;
		color: #0099FF;
	}

	.discount .coupon-receive button {
		width: 38px;
		height: 18px;
		font-size: 12px;
		color: #fff;
		text-align: center;
		background: #F04844;
		cursor: pointer;
	}

	.discount .coupon-receive .canCoupun {
		background: rgba(204, 204, 204, 1);
	}
	/*优惠隐藏的更多内容*/

	.discountMore {
		width: 878px;
		background: #fff;
		border: 1px solid rgba(201, 201, 201, 1);
		z-index: 10;
		position: absolute;
		top: 110px;
		left: 0;
		padding-top: 4px;
	}

	.discountMore .discount-name {
		width: 98px;
		height: 43px;
		text-indent: 20px;
		font-size: 14px;
		color: #666;
	}

	.discountMore .coupon-name {
		width: 50px;
		height: 24px;
		text-align: center;
		line-height: 24px;
		border: 1px dashed #FF3300;
		color: #FF3300;
	}

	.discountMore .discount-information {
		width: 400px;
		height: 26px;
		line-height: 26px;
		padding: 0px 12px 0px 20px;
		font-size: 14px;
		color: #666;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: inline-block;
		vertical-align: middle;
	}

	.discountMore .coupon-receive {
		height: 26px;
		line-height: 26px;
	}

	.discountMore .more-favorable {
		padding: 0px 0px 0px 40px;
		height: 26px;
		line-height: 26px;
		position: absolute;
		right: 20px;
		color: #0099FF;
		bottom: 10px;
	}

	.discountMore .coupon-receive button {
		width: 38px;
		height: 18px;
		font-size: 12px;
		color: #fff;
		text-align: center;
		background: #F04844;
		cursor: pointer;
	}

	.discountMore .coupon-receive .canCoupun {
		background: rgba(204, 204, 204, 1);
	}

	.discountMore .discountMg {
		margin-left: 97px;
	}

	.discountMore .itemOne {
		margin: 6px 0;
	}

	.discountMore .itemOne .itemCoupon {
		padding: 4px;
	}

	.activityMore {
		top: 178px;
	}

	.activityMore .activity-label {
		width: 71px;
		height: 20px;
		background: inherit;
		background-color: rgba(255, 168, 71, 1);
		text-align: center;
		color: #fff;
		font-size: 12px;
		line-height: 20px;
		display: inline-block;
	}
	/*活动*/

	.activity {
		height: 60px;
		position: relative;
	}

	.activity .activity-name {
		width: 98px;
		height: 43px;
		text-indent: 20px;
		font-size: 14px;
		color: #666;
	}

	.activity .coupon-name {
		width: 50px;
		height: 24px;
		text-align: center;
		line-height: 24px;
		border: 1px dashed #FF3300;
		color: #FF3300;
	}

	.activity .activity-information {
		max-width: 490px;
		height: 26px;
		line-height: 26px;
		padding: 0px 20px;
		font-size: 14px;
		color: #666;
		width: 400px;
	}

	.activity .activity-label {
		width: 71px;
		height: 20px;
		background: inherit;
		background-color: rgba(255, 168, 71, 1);
		text-align: center;
		color: #fff;
		font-size: 12px;
		line-height: 20px;
	}

	.activity .more-favorable {
		padding: 0px 0px 0px 40px;
		height: 26px;
		line-height: 26px;
		position: absolute;
		right: 20px;
		bottom: 10px;
		color: #0099FF;
	}

	.activity .coupon-receive button {
		width: 38px;
		height: 18px;
		font-size: 12px;
		color: #fff;
		text-align: center;
		background: #F04844;
		cursor: pointer;
	}

	.activity .coupon-receive .canCoupun {
		background: rgba(204, 204, 204, 1);
	}

	.receive-coupon-success {
		width: 533px;
		height: 176px;
		background: #fff;
		border: 1px solid #e4e4e4;
	}

	.receive-coupon-success .success-first {
		width: 100%;
		height: 39px;
		line-height: 39px;
	}

	.receive-coupon-success .success-first i {
		width: 39px;
		height: 39px;
		line-height: 39px;
		text-align: center;
		font-size: 20px;
		color: #a1a1a1;
		cursor: pointer;
	}

	.receive-coupon-success .success-second {
		/*padding-top: 20px;*/
	}

	.receive-coupon-success .success-second .success-second-left {
		width: 72px;
		height: 116px;
		text-align: center;
	}

	.receive-coupon-success .success-second .success-second-left i {
		padding: 5px 5px;
		background: #6ec70c;
		color: #fff;
		font-size: 16px;
		border-radius: 13px;
	}

	.receive-coupon-success .success-second .success-second-right {
		width: 460px;
		height: 116px;
	}

	.success-second-right .coupon-use-condition {
		height: 26px;
		color: #333;
		font-size: 14px
	}

	.success-second-right .coupon-use-condition span {
		color: #FF6666;
	}

	.success-second-right .coupon-use-time {
		height: 20px;
		line-height: 20px;
		color: #666;
		font-size: 12px;
	}

	.success-second-right button {
		margin-top: 20px;
		line-height: 30px;
		padding: 0px 18px;
		border: 1px solid #e1e1e1;
		font-size: 12px;
		color: #333;
		background: #fff;
	}

	.content-information .packing-line,
	.content-information .dosage-form,
	.content-information .stock-number,
	.content-information .promise-information {
		width: 100%;
		/*overflow: auto;*/
		zoom: 1;
	}

	.content-information .attrGoods {
		width: 100%;
	}

	.content-information .attrGoods p {
		margin: 10px 0 10px 20px;
	}

	.content-information .attrGoods p span:nth-child(2) {
		margin-left: 30px;
	}

	.content-information .flow-process {
		position: relative;
	}

	.content-information .flow-process .show-choice-commodity {
		min-width: 660px;
		max-width: 876px;
		border: 2px solid #cc3333;
		background: #fff;
		position: absolute;
		left: 0px;
		top: 0px;
		z-index: 3;
		overflow-x: hidden;
	}

	#choiceCommodity {
		width: 660px;
		overflow-x: hidden;
	}

	.content-information .show-choice-commodity .suit {
		padding-top: 10px;
	}

	.content-information .show-choice-commodity h3 {
		height: 26px;
		background: #cc3333;
		color: #fff;
		font-size: 14px;
		line-height: 26px;
		text-indent: 8px;
		font-weight: normal;
	}

	.content-information .show-choice-commodity h3 i {
		height: 26px;
		line-height: 26px;
		padding-right: 5px;
	}

	.content-information .show-choice-commodity .btn-moddle {
		height: 40px;
	}

	.content-information .show-choice-commodity .btn-moddle button {
		width: 86px;
		height: 40px;
		background: #cc3333;
		font-size: 14px;
		color: #fff;
	}

	.stock-number .number-name,
	.promise-information .promise-name {
		width: 108px;
		padding-top: 10px;
		line-height: 30px;
		text-indent: 30px;
		font-size: 14px;
		color: #666;
	}

	.stock-number {
		position: relative;
	}

	.stock-number:before {
		content: '';
		position: absolute;
		width: 840px;
		height: 1px;
		left: 20px;
		top: 10px;
		/*border-top: 1px dashed rgba(171, 159, 159, 0.3);*/
	}

	.packing-line .attributeFirst-name {
		width: 108px;
		padding-top: 10px;
		line-height: 30px;
		height: 30px;
		/* text-align: center; */
		text-indent: 20px;
		font-size: 14px;
		color: #666;
		overflow: hidden;
	}

	.packing-line-name .attributeFirst-name {
		width: 108px;
		padding-top: 10px;
		line-height: 36px;
		height: 36px;
		/* text-align: center; */
		text-indent: 20px;
		font-size: 14px;
		color: #666;
		overflow: hidden;
	}

	.packing-line-name .packing-Img {
		width: 80%;
	}

	.dosage-form .attributeSecond-name {
		width: 98px;
		padding-top: 10px;
		line-height: 30px;
		height: 30px;
		text-indent: 20px;
		font-size: 14px;
		color: #666;
		overflow: hidden;
	}

	.promise-information .promise-name {
		padding-top: 0px;
	}

	.stock-number .stock,
	.promise-information .customer-service {
		width: 80%;
	}

	.packing-line .packing-type,
	.dosage-form .medicament-type {
		width: 80%;
	}

	.packing-line .packing-type p,
	.medicament-type p {
		padding: 10px 10px 0px 0px;
	}

	.customer-service p {
		padding: 5px 10px 0px 10px;
	}

	.packing-line .packing-type p span {
		height: 28px;
		color: #333;
		font-size: 12px;
		text-align: center;
		line-height: 28px;
		padding: 0px 5px;
		border: 1px solid #cccccc;
		cursor: pointer;
		position: relative;
	}

	.packing-line-name .packing-Img div {
		width: 36px;
		height: 36px;
		line-height: 36px;
		position: relative;
		margin: 10px 15px 0px 0px;
		cursor: pointer;
	}

	.packing-line-name .packing-Img div img {
		width: 35px;
		height: 35px;
		border: 1px solid #ccc;
	}

	.packing-line-name .packing-Img div img:hover {
		border: 1px solid #FF3300;
	}

	.packing-line-name .packing-Img div .show {
		border: 1px solid #FF3300;
	}

	.packing-line-name .packing-Img div .active {
		border: 1px dashed #cccccc;
	}

	.packing-line-name .packing-Img div i {
		width: 13px;
		height: 13px;
		background: url('../../assets/goodDetails/check-logo.png') no-repeat;
		background-size: 13px 13px;
		position: absolute;
		bottom: 0px;
		right: 0px;
	}

	.medicament-type p span {
		width: 58px;
		color: #333;
		font-size: 12px;
		text-align: center;
		line-height: 28px;
		border: 1px solid #cccccc;
		cursor: pointer;
		position: relative;
	}

	.packing-line .packing-type p span:hover {
		border: 1px solid #FF3300;
	}

	.packing-line .packing-type p .show,
	.medicament-type p .show {
		border: 1px solid #FF3300;
	}

	.packing-line .packing-type p .active,
	.medicament-type p .active {
		border: 1px dashed #cccccc;
	}

	.packing-line .packing-type p span i,
	.medicament-type p span i {
		width: 13px;
		height: 13px;
		background: url('../../assets/goodDetails/check-logo.png') no-repeat;
		background-size: 13px 13px;
		position: absolute;
		bottom: 0px;
		right: 0px;
	}

	.stock-number {
		padding-top: 10px;
	}

	#stock {
		padding: 10px 0px;
	}

	#stock .add-and-reduce {
		height: 50px;
	}

	#stock .add-and-reduce .btn {
		width: 28px;
		height: 28px;
		font-size: 18px;
		color: #cccccc;
		border: 1px solid #cccccc;
		line-height: 28px;
		text-align: center;
		cursor: pointer;
		background: #fff;
	}

	#stock .add-and-reduce .number {
		width: 50px;
		height: 30px;
		color: #333;
		line-height: 30px;
		font-size: 14px;
		text-align: center;
	}

	#stock .add-and-reduce span {
		padding: 0px 20px;
	}

	#stock .immediate-and-joining .btn {
		width: 160px;
		height: 46px;
		line-height: 46px;
		text-align: center;
		font-size: 18px;
		color: #fff;
		background: #f04844;
		cursor: pointer;
	}

	#stock .immediate-and-joining .defaultbg {
		background: rgba(102, 102, 102, 1);
		width: 160px;
		height: 46px;
		line-height: 46px;
		text-align: center;
		font-size: 18px;
		color: #fff;
		cursor: pointer;
		    margin-right: 1rem;
	}

	#stock .immediate-and-joining .btn i {
		font-size: 20px;
	}

	#stock .immediate-and-joining .btn:nth-of-type(1) {
		margin-right: 20px;
	}

	.customer-service p span {
		padding: 0px 18px 0px 0px;
		color: #666;
		font-size: 14px;
		/* cursor: pointer; */
	}

	.customer-service p span:hover {
		color: #42b197;
	}

	.customer-service p span i {
		color: #42b197;
		font-size: 16px;
	}

	.fa-check-circle-o {
		font-size: 16px;
		color: #42b197;
	}
	/*分享展示*/

	.shareStateHover {
		/*width: 120px;*/
		height: 20px;
		margin-top: -10px;
		margin-left: 30px;
		position: relative;
	}

	.shareStateHover .lastshare {
		margin-top: 10px !important;
		/*margin-left: 30px;*/
	}

	.shareStateHover:hover .share {
		color: #16a086;
	}

	.shareStateHover:hover .sharediv {
		display: block;
	}

	.sharediv {
		width: 120px;
		height: 147px;
		border: 1px solid #999;
		position: absolute;
		left: -50px;
    	top: -150px;
		background: #fff;
		text-align: center;
		display: none;
		z-index: 9999;
		/*display: block;*/
	}

	.shareimgdiv {
		width: 100px;
		margin: 5px auto;
	}

	.sharediv #qrcode {
		margin: 5px auto;
		width: 100px;
	}

	.sharediv img {
		margin-left: 10px;
		margin-top: 5px;
	}

	.sharediv p {
		width: 100%;
		padding-left: 0 !important;
		cursor: pointer !important;
		color: #333 !important;
	}

	.sharediv span {
		width: 10px;
		height: 10px;
		background: #fff;
		transform: rotate(45deg);
		display: inline-block;
		border-right: 1px solid #999;
		border-bottom: 1px solid #999;
		position: absolute;
		left: 54px;
		bottom: -6px;
	}
</style>
