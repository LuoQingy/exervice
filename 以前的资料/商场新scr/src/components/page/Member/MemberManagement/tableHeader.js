export const headers = [
  [],
  // 积分记录
  [{
      prop: "usersId",
      label: "ID"
    },
    {
      prop: "crUnknown",
      label: "来源/消耗",
      fliter: true
    },
    {
      prop: "crCoin",
      label: "积分"
    },
    {
      prop: "crRecordTime",
      label: "时间"
    },
    {
      prop: "crAlterationType",
      label: "变更类型"
    },
    {
      prop: "crRemark",
      label: "备注信息"
    }
  ],
  // 等级名称
  [{
      prop: "grId",
      label: "ID"
    },
    {
      prop: "umgName",
      label: "等级名称"
    },
    {
      prop: "umgUpgradeCondition",
      label: "升级条件"
    },
    {
      prop: "grAcquireTime",
      label: "升级时间"
    }
  ],
  // 消费记录
  [{
      prop: "merchantId",
      label: "ID"
    },
    {
      prop: "orderNumber",
      label: "订单编号"
    },
    {
      prop: "merchantName",
      label: "消费门店"
    },
    {
      prop: "orderFactPrices",
      label: "订单金额"
    },
    {
      prop: "orderType",
      label: "订单类型",
      fliter: true
    },
    {
      prop: "orderPayTime",
      label: "付款时间"
    },
    {
      prop: "orderId",
      label: "操作",
      fliter: true
    }
  ],
  // 卡券记录
  [{
      prop: "ucouId",
      label: "ID"
    },
    {
      prop: "commodity.commodityName",
      label: "卡券类型"
    },
    {
      prop: "commodity.commodityName",
      label: "卡券名称"
    },
    {
      prop: "ucouStatus",
      label: "卡券状态"
    },
    {
      prop: "ucouCreateTime",
      label: "领取时间",
      fliter: true
    },
    {
      prop: "ucouSource",
      label: "领取来源"
    },
    {
      prop: "ucouSourceDetail",
      label: "来源明细",
      fliter: true
    },
    {
      label: "操作明细",
    }
  ],
  // 团购记录
  [{
      prop: "odId",
      label: "ID"
    },
    {
      prop: "commodityName",
      label: "商品名称"
    },
    {
      prop: "commodityStatus",
      label: "活动状态",
      fliter: true
    },
    {
      prop: "commoditySellStartTime",
      label: "开始时间"
    },
    {
      prop: "commoditySellEndTime",
      label: "结束时间",
    },
    {
      prop: "ucouStatus",
      label: "已核销",
      fliter: true
    },
    {
      label: "操作明细"
    }
  ],
  // 收藏商户
  [{
      prop: "merchantId",
      label: "ID"
    },
    {
      prop: "commodityName",
      label: "商户名称"
    },
   
    {
      prop: "ucollCreateTime",
      label: "收藏时间"
    },
    {
      prop: "commoditySellEndTime",
      label: "最后一次访问该商户",
    }
  ],
  // 浏览记录
  [{
      prop: "brId",
      label: "ID"
    },
    {
      prop: "brTimeSurfed",
      label: "浏览时间"
    },
   
    {
      prop: "brSkimEntrance",
      label: "浏览入口"
    },
    {
      prop: "brStayTimed",
      label: "停留时间",
    }
  ],
  // 线下到访记录
  [{
      prop: "ovrId",
      label: "ID"
    },
    {
      prop: "ovrVisitTime",
      label: "到访时间"
    },
    {
      prop: "ovrVisitEntrance",
      label: "到访入口"
    },
    {
      label: "操作",
    }
  ]
]
