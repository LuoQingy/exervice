import Main from '@/components/common/Main.vue';

export const routes = [{
  path: '/',
  redirect: '/home/index'
},
// 首页
{
  path: '/home',
  component: Main,
  meta: {
    title: '系统首页'
  },
  imgurl: '../../../static/img/home.png',
  children: [{
    path: '/home/index',
    name: 'home',
    icon: 'el-icon-menu',
    imgurl: '../../../static/img/home.png',
    component: resolve => require(['../components/page/Home/index.vue'], resolve),
    meta: {
      title: '系统首页'
    }
  }]
},
// 会员管理
{
  path: '/Member',
  icon: 'el-icon-tickets',
  imgurl: '../../../static/img/menber.png',
  component: Main,
  meta: {
    title: '会员管理'
  },
  children: [{
    path: '/member/management',
    component: resolve => require(['../components/page/Member/MemberManagement/MemberManagement.vue'], resolve),
    meta: {
      title: '会员总览'
    }
  },
  {
    path: '/member/lists',
    component: resolve => require(['../components/page/Member/MemberManagement/MenberList/MenberLists.vue'], resolve),
    meta: {
      title: '会员管理'
    }
  },
  {
    path: '/member/details',
    name: "memberDetails",
    component: resolve => require(['../components/page/Member/MemberManagement/MemberDetails.vue'], resolve),
    meta: {
      title: '会员详情'
    },
    ishide: true
  },
  {
    path: '/member/function',
    name: 'function',
    component: resolve => require(['../components/page/Member/MemberManagement/MemberFunction.vue'], resolve),
    meta: {
      title: '会员操作记录'
    },
    ishide: true
  },
  {
    path: '/member/MenberSetting',
    name: 'menbersetting',
    component: resolve => require(['../components/page/Member/MenberSetting.vue'], resolve),
    meta: {
      title: '会员设置'
    },
    redirect: '/member/MenberSetting/shipsetting',
    children: [{
      path: 'shipsetting',
      name: 'shipsetting',
      component: resolve => require(['../components/page/Member/MemberShipsetting.vue'], resolve),
      meta: {
        title: '会员等级设置'
      }
    },
    {
      path: 'menberright',
      name:'menberright',
      component: resolve => require(['../components/page/Member/MenberRight/MenberRight.vue'], resolve),
      meta: {
        title: '会员权益'
      }
    },
    {
      name:'integralRule',
      path: 'integralRule',
      component: resolve => require(['../components/page/Member/IntegralRule/MemberIntegralRule.vue'], resolve),
      meta: {
        title: '积分规则'
      },
      redirect: '/member/MenberSetting/integralRule/integralAcquisition',
      children: [{
        path: 'integralAcquisition',
        component: resolve => require(['../components/page/Member/IntegralRule/IntegralAcquisition.vue'], resolve),
        meta: {
          title: '积分获取规则'
        },
      },
      {
        path: 'integralExchange',
        component: resolve => require(['../components/page/Member/IntegralRule/IntegralExchange.vue'], resolve),
        meta: {
          title: '积分兑换规则'
        },
      },
      {
        path: 'integralValidityPeriod',
        component: resolve => require(['../components/page/Member/IntegralRule/IntegralValidityPeriod.vue'], resolve),
        meta: {
          title: '积分有效期'
        },
      },
      {
        path: 'integralguide',
        component: resolve => require(['../components/page/Member/IntegralRule/IntegralGuide.vue'], resolve),
        meta: {
          title: '积分指南'
        },
      },
      ]
    },
  ]
  },
  {
    path: '/member/addmembergrade',
    name: 'addmembergrade',
    component: resolve => require(['../components/page/Member/AddMemberGrade.vue'], resolve),
    meta: {
      title: '添加会员等级'
    },
    ishide: true
  },
  {
    path: '/member/memberrules',
    name: 'memberrules',
    component: resolve => require(['../components/page/Member/MemberRules.vue'], resolve),
    meta: {
      title: '升级规则描述'
    },
    ishide: true
  },
  
  {
    path: '/member/addmenberright',
    component: resolve => require(['../components/page/Member/MenberRight/AddMenberRight.vue'], resolve),
    meta: {
      title: '添加会员权益'
    },
    ishide: true
  },
  {
    path: '/member/editMenberRight',
    name: 'editMenberRight',
    component: resolve => require(['../components/page/Member/MenberRight/editMenberRight.vue'], resolve),
    meta: {
      title: '编辑会员权益'
    },
    ishide: true
  },
  {
    path: '/member/shipLabel',
    component: resolve => require(['../components/page/Member/MemberShipLabel.vue'], resolve),
    meta: {
      title: '会员标签'
    }
  },
  ]
},
// 内容管理
{
  path: '/content',
  component: Main,
  meta: {
    title: '内容管理'
  },
  icon: 'el-icon-document',
  imgurl: '../../../static/img/content.png',
  children: [{
    path: '/content/renovation',
    component: resolve => require(['../components/page/customPages/pageDecorationSetting.vue'], resolve),
    meta: {
      title: '商场装修'
    }
  },
  {
    path: '/content/pageModelSetting',
    component: resolve => require(['../components/page/customPages/pageModelSetting'], resolve),
    meta: {
      title: '装修详情'
    },
    ishide: true
  },
  {
    path: '/content/anmanagement',
    name: 'anmanagement',
    component: resolve => require(['../components/page/Content/AnManagement.vue'], resolve),
    meta: {
      title: '公告管理'
    }
  },
  {
    path: '/content/addAnnouncement',
    name: 'addAnnouncement',
    component: resolve => require(['../components/page/Content/addAnnouncement.vue'], resolve),
    meta: {
      title: '添加公告'
    },
    ishide: true
  },
  {
    path: '/content/editAnnouncement',
    name: 'editAnnouncement',
    component: resolve => require(['../components/page/Content/editAnnouncement.vue'], resolve),
    meta: {
      title: '修改公告'
    },
    ishide: true
  },
  {
    path: '/content/activitymanagement',
    component: resolve => require(['../components/page/Content/ActivityManagement.vue'], resolve),
    meta: {
      title: '活动管理'
    },
  },
  {
    path: '/content/addActivity',
    component: resolve => require(['../components/page/Content/addActivity.vue'], resolve),
    meta: {
      title: '添加活动'
    },
    ishide: true
  }
  ]
},
// 商场管理
{
  path: '/market',
  component: Main,
  meta: {
    title: '商场管理'
  },
  icon: 'el-icon-document',
  imgurl: '../../../static/img/market.png',
  children: [{
    path: '/market/comTen',
    component: resolve => require(['../components/page/Market/ComTen.vue'], resolve),
    meta: {
      title: '商户管理'
    }
  },
  {
    path: '/market/editComTen',
    name: 'editComTen',
    component: resolve => require(['../components/page/Market/editComTen.vue'], resolve),
    meta: {
      title: '修改商户'
    },
    ishide: true
  },
  {
    path: '/market/addComTen',
    component: resolve => require(['../components/page/Market/AddComTen.vue'], resolve),
    meta: {
      title: '添加商户'
    },
    ishide: true
  },
  {
    path: '/market/classifyMainte',
    component: resolve => require(['../components/page/Market/ClassifyMainte.vue'], resolve),
    meta: {
      title: '分类维护'
    }
  },
  {
    path: '/market/addClassify',
    name: 'addClassify',
    component: resolve => require(['../components/page/Market/addClassify.vue'], resolve),
    meta: {
      title: '添加分类'
    },
    ishide: true
  },
  {
    path: '/market/editClassify',
    name: 'editClassify',
    component: resolve => require(['../components/page/Market/editClassify.vue'], resolve),
    meta: {
      title: '编辑分类'
    },
    ishide: true
  },
  {
    path: '/market/floorMainte',
    'name': 'floorMainte',
    component: resolve => require(['../components/page/Market/FloorMainte.vue'], resolve),
    meta: {
      title: '楼层维护'
    }
  },
  {
    path: '/market/addFloor',
    component: resolve => require(['../components/page/Market/addFloor.vue'], resolve),
    meta: {
      title: '添加楼层'
    },
    ishide: true
  },
  {
    path: '/market/editFloor',
    name: 'editFloor',
    component: resolve => require(['../components/page/Market/editFloor.vue'], resolve),
    meta: {
      title: '修改楼层'
    },
    ishide: true
  },
  ]
},
// 商户服务
{
  path: '/merchant',
  component: Main,
  meta: {
    title: '商户服务'
  },
  icon: 'el-icon-setting',
  imgurl: '../../../static/img/merchant.png',
  children: [{
    path: '/merchant/turnoverlist',
    component: resolve => require(['../components/page/Merchant/TurnoverList.vue'], resolve),
    meta: {
      title: '营业额上报'
    }
  },
  {
    path: '/merchant/TurnoverDetails',
    component: resolve => require(['../components/page/Merchant/TurnoverDetails.vue'], resolve),
    meta: {
      title: '上报明细'
    },
    ishide: true
  },
  {
    path: '/merchant/repairlist',
    component: resolve => require(['../components/page/Merchant/Repair/RepairList.vue'], resolve),
    meta: {
      title: '物业报修'
    }
  },
  {
    path: '/merchant/editingproject',
    name: 'editingproject',
    component: resolve => require(['../components/page/Merchant/Repair/EditingProject.vue'], resolve),
    meta: {
      title: '编辑报修项目'
    },
    ishide: true
  }
  ,
  {
    path: '/merchant/repairdetails',
    name: 'repairdetails',
    component: resolve => require(['../components/page/Merchant/Repair/RepairDetails.vue'], resolve),
    meta: {
      title: '报修详情'
    },
    ishide: true
  }
  ]
},
// 系统管理
{
  path: '/system',
  component: Main,
  meta: {
    title: '系统管理'
  },
  icon: 'el-icon-setting',
  imgurl: '../../../static/img/system.png',
  children: [{
    path: '/system/log',
    component: resolve => require(['../components/page/System/SystemLog.vue'], resolve),
    meta: {
      title: '日志管理'
    }
  },
  {
    path: '/system/admin',
    component: resolve => require(['../components/page/System/Admin/Admin.vue'], resolve),
    meta: {
      title: '账号管理'
    },
  },
  {
    path: '/system/role',
    component: resolve => require(['../components/page/System/Role.vue'], resolve),
    meta: {
      title: '角色管理'
    }
  },
  {
    path: '/system/addrole',
    name: 'addrole',
    component: resolve => require(['../components/page/System/AddRole.vue'], resolve),
    meta: {
      title: '新建角色/修改角色'
    },
    ishide: true
  },
  {
    path: '/system/publicmenu',
    name: 'publicmenu',
    component: resolve => require(['../components/page/System/PublicMenu.vue'], resolve),
    meta: {
      title: '公众号管理'
    },
  },
  {
    path: '/system/addPublicMenu',
    name: 'addPublicMenu',
    component: resolve => require(['../components/page/System/addPublicMenu.vue'], resolve),
    meta: {
      title: '新建菜单'
    },
    ishide: true
  },
  {
    path: '/system/editPublicMenu',
    name: 'editPublicMenu',
    component: resolve => require(['../components/page/System/editPublicMenu.vue'], resolve),
    meta: {
      title: '修改菜单'
    },
    ishide: true
  },
  {
    path: '/system/graphicMessage',
    name: 'graphicMessage',
    component: resolve => require(['../components/page/System/MaterialLibrary/GraphicMessage.vue'], resolve),
    meta: {
      title: '素材库图文'
    },
    ishide: true
  },
  {
    path: '/system/addGraphicMessage',
    name: 'addGraphicMessage',
    component: resolve => require(['../components/page/System/MaterialLibrary/AddGraphicMessage.vue'], resolve),
    meta: {
      title: '添加图文'
    },
    ishide: true
  },
  {
    path: '/system/materialPicture',
    name: 'materialPicture',
    component: resolve => require(['../components/page/System/MaterialLibrary/MaterialPicture.vue'], resolve),
    meta: {
      title: '素材库图片'
    },
    ishide: true
  },

  ]
},
// 营销中心
{
  path: '/Marketing',
  component: Main,
  meta: {
    title: '营销中心'
  },
  icon: 'el-icon-sold-out',
  imgurl: '../../../static/img/Marketing.png',
  children: [{
    path: '/marketing/intelligentlist',
    component: resolve => require(['../components/page/Marketing/Intelligent/IntelligentList.vue'], resolve),
    meta: {
      title: '智能营销'
    }
  },
  {
    path: '/marketing/messageList',
    name: 'messageList',
    component: resolve => require(['../components/page/Marketing/Intelligent/messageList.vue'], resolve),
    meta: {
      title: '短信营销'
    },
    ishide: true
  },
  {
    path: '/marketing/PlanCouponDetails',
    name: 'PlanCouponDetails',
    component: resolve => require(['../components/page/Marketing/Intelligent/PlanCouponDetails.vue'], resolve),
    meta: {
      title: '卡券营销'
    },
    ishide: true
  },
  {
    path: '/marketing/addactive',
    name: 'addactive',
    component: resolve => require(['../components/page/Marketing/Intelligent/Addactive.vue'], resolve),
    meta: {
      title: '新建/修改活动'
    },
    ishide: true
  },
  {
    path: '/marketing/member',
    component: resolve => require(['../components/page/Marketing/Member/Member.vue'], resolve),
    meta: {
      title: '会员分组'
    }
  },
  {
    path: '/marketing/addmember',
    name: 'addmember',
    component: resolve => require(['../components/page/Marketing/Member/AddMember.vue'], resolve),
    meta: {
      title: '新建/编辑分组'
    },
    ishide: true
  },
  {
    path: '/marketing/memberlist',
    name: 'memberlist',
    component: resolve => require(['../components/page/Marketing/Member/MemberList.vue'], resolve),
    meta: {
      title: '会员分组列表'
    },
    ishide: true
  },
  {
    path: '/marketing/voucherCenter',
    name: 'voucherCenter',
    component: resolve => require(['../components/page/Marketing/VoucherCenter/VoucherCenter.vue'], resolve),
    meta: {
      title: '领券中心'
    }
  },
  {
    path: '/marketing/addVoucher',
    name: 'addVoucher',
    component: resolve => require(['../components/page/Marketing/VoucherCenter/AddVoucher.vue'], resolve),
    meta: {
      title: '创建/修改优惠券'
    },
    ishide: true

  },
  {
    path: '/marketing/couponTurnover',
    name: 'couponTurnover',
    component: resolve => require(['../components/page/Marketing/VoucherCenter/CouponTurnover.vue'], resolve),
    meta: {
      title: '活动数据'
    },
    ishide: true
  },
  {
    path: '/marketing/ParkingCoupon',
    name: 'ParkingCoupon',
    component: resolve => require(['../components/page/Marketing/ParkingCoupon/ParkingCoupon.vue'], resolve),
    meta: {
      title: '停车券'
    }
  },
  {
    path: '/marketing/addParkingCoupon',
    name: 'addParkingCoupon',
    component: resolve => require(['../components/page/Marketing/ParkingCoupon/AddParkingCoupon.vue'], resolve),
    meta: {
      title: '创建/修改停车券'
    },
    ishide: true

  },
  {
    path: '/marketing/ParkOrder',
    name: 'ParkOrder',
    component: resolve => require(['../components/page/Marketing/ParkingCoupon/ParkOrder.vue'], resolve),
    meta: {
      title: '停车订单'
    },
  },
  {
    path: '/marketing/ParkOrderInfo',
    name: 'ParkOrderInfo',
    component: resolve => require(['../components/page/Marketing/ParkingCoupon/ParkOrderInfo.vue'], resolve),
    meta: {
      title: '停车券详情'
    },
    ishide: true
  },
  {
    path: '/marketing/groupPurchaseManagement',
    name: 'grouppurchasemanagement',
    component: resolve => require(['../components/page/MarketingCenter/groupPurchaseManagement.vue'], resolve),
    meta: {
      title: '团购商品管理'
    }
  },
  {
    path: '/marketing/createGoods',
    name: 'creategoods',
    component: resolve => require(['../components/page/MarketingCenter/createGoods.vue'], resolve),
    meta: {
      title: '创建商品'
    },
    ishide: true
  },
  {
    path: '/marketing/modifyGoods',
    name: 'modifyGoods',
    component: resolve => require(['../components/page/MarketingCenter/modifyGoods.vue'], resolve),
    meta: {
      title: '修改商品'
    },
    ishide: true
  },
  {
    path: '/marketing/consumerlist',
    name: 'consumerlist',
    component: resolve => require(['../components/page/Marketing/Consumer/ConsumerList.vue'], resolve),
    meta: {
      title: '消费营销'
    }
  },
  {
    path: '/marketing/consumerdetails',
    name: 'consumerdetails',
    component: resolve => require(['../components/page/Marketing/Consumer/ConsumerDetails.vue'], resolve),
    meta: {
      title: '送券活动详情'
    }
  },
  {
    path: '/marketing/consumerrules',
    name: 'consumerrules',
    component: resolve => require(['../components/page/Marketing/Consumer/ConsumerRules.vue'], resolve),
    meta: {
      title: '设置返券规则'
    }
  },
  {
    path: '/marketing/messageTemplate',
    name: 'messageTemplate',
    component: resolve => require(['../components/page/MarketingCenter/messageTemplate.vue'], resolve),
    meta: {
      title: '短信模板'
    },
  },
  {
    path: '/marketing/addMessage',
    name: 'addMessage',
    component: resolve => require(['../components/page/MarketingCenter/addMessage.vue'], resolve),
    meta: {
      title: '新建短信模板'
    },
    ishide: true
  },
  {
    path: '/marketing/templatelist',
    component: resolve => require(['../components/page/Marketing/Template/TemplateList.vue'], resolve),
    meta: {
      title: '模板消息'
    }
  },
  {
    path: '/marketing/addtemplate',
    name: 'addtemplate',
    component: resolve => require(['../components/page/Marketing/Template/AddTemplate.vue'], resolve),
    meta: {
      title: '新建/编辑模板'
    }
  },
  {
    path: '/marketing/voucherDetails',
    name: 'voucherDetails',
    component: resolve => require(['../components/page/MarketingCenter/voucherDetails.vue'], resolve),
    meta: {
      title: '劵详情'
    },
    ishide: true
  },
  {
    path: '/marketing/verification',
    name: 'verification',
    component: resolve => require(['../components/page/Marketing/verification/verification.vue'], resolve),
    meta: {
      title: '劵核销'
    },
  },
  
  ]
},
// 订单管理
{
  path: '/OrderManage',
  component: Main,
  meta: {
    title: '订单管理'
  },
  icon: 'el-icon-goods',
  imgurl: '../../../static/img/OrderManage.png',
  children: [{
    path: '/OrderManage/FinancialIndex',
    name: 'FinancialIndex',
    component: resolve => require(['../components/page/OrderManage/FinancialSituation/FinancialIndex.vue'], resolve),
    meta: {
      title: '财务概况'
    },
  },
  {
    path: '/OrderManage/MerchantDetails',
    name: 'MerchantDetails',
    component: resolve => require(['../components/page/OrderManage/FinancialSituation/MerchantDetails.vue'], resolve),
    meta: {
      title: '商户交易明细'
    },
    ishide: true
  },
  {
    path: '/OrderManage/TradeDetails',
    name: 'TradeDetails',
    component: resolve => require(['../components/page/OrderManage/FinancialSituation/TradeDetails.vue'], resolve),
    meta: {
      title: '交易方式明细'
    },
    ishide: true
  },
  {
    path: '/OrderManage/DayDetails',
    name: 'DayDetails',
    component: resolve => require(['../components/page/OrderManage/FinancialSituation/DayDetails.vue'], resolve),
    meta: {
      title: '每天收入明细'
    },
    ishide: true
  },

  ]
},
// 商城管理
{
  path: '/ShoppingMall',
  component: Main,
  meta: {
    title: '商城管理'
  },
  icon: 'el-icon-goods',
  imgurl: '../../../static/img/ShoppingMall.png',
  children: [
    {
      path: '/shoppingmall/goodslists',
      name: 'goodslists',
      component: resolve => require(['../components/page/ShoppingMall/GoodsLists.vue'], resolve),
      meta: {
        title: '商品管理'
      }
    },
    {
      path: '/shoppingmall/release',
      name: 'release',
      component: resolve => require(['../components/page/ShoppingMall/Release.vue'], resolve),
      meta: {
        title: '发布商品'
      }
    },
    {
      path: '/shoppingmall/goods',
      name: 'goods',
      component: resolve => require(['../components/page/ShoppingMall/Goods.vue'], resolve),
      meta: {
        title: '添加/修改商品'
      },
      ishide: true
    },
    {
      path: '/shoppingmall/orderType1',
      name: 'orderType1',
      component: resolve => require(['../components/page/ShoppingMall/OrderList.vue'], resolve),
      meta: {
        title: '买单订单'
      }
    },
    {
      path: '/shoppingmall/orderType3',
      name: 'orderType3',
      component: resolve => require(['../components/page/ShoppingMall/OrderList.vue'], resolve),
      meta: {
        title: '商城订单'
      }
    },
    {
      path: '/shoppingmall/orderType2',
      name: 'orderType2',
      component: resolve => require(['../components/page/ShoppingMall/OrderList.vue'], resolve),
      meta: {
        title: '团购订单'
      }
    },
    {
      path: '/shoppingmall/OrderDetails',
      name: 'orderdetails',
      component: resolve => require(['../components/page/ShoppingMall/OrderDetails.vue'], resolve),
      meta: {
        title: '订单详情'
      },
      ishide: true
    },
  ]
},
// 登录
{
  path: '/login',
  component: resolve => require(['../components/page/Login.vue'], resolve)
},
// 404
{
  path: '/404',
  component: resolve => require(['../components/page/Error/404.vue'], resolve)
},
// 403
{
  path: '/403',
  component: resolve => require(['../components/page/Error/403.vue'], resolve)
},
{
  path: '*',
  redirect: '/404'
}
]
