// 订单状态 
// 买单订单状态：1:待支付、2:支付成功、3:已退款、4:交易关闭。 
export const status1 = [{
    orderType: "",
    name: "全部"
  },
  {
    orderType: 1,
    name: "待支付"
  },
  {
    orderType: 2,
    name: "支付成功"
  },
  {
    orderType: 3,
    name: "已退款"
  },
  {
    orderType: 4,
    name: "交易关闭"
  },
]
// 团购券、兑换券订单状态：1:待支付、2:支付成功/可使用、3:已退款、4:交易关闭、5:已使用、6:已过期
export const status2 = [{
    orderType: "",
    name: "全部"
  },
  {
    orderType: 1,
    name: "待支付"
  },
  {
    orderType: 2,
    name: "支付成功/可使用"
  },
  {
    orderType: 3,
    name: "已退款"
  },
  {
    orderType: 4,
    name: "交易关闭"
  },
  {
    orderType: 5,
    name: "已使用"
  },
  {
    orderType: 6,
    name: "已过期"
  },
]
