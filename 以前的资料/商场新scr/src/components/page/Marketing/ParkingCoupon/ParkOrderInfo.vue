<template>
    <div class="parkorderinfo">
         <h3>停车订单详情</h3>
        <div class="orderinfo">
            <div class="title">订单详情</div>
            <div class="content">
                <p>订单编号：22222222222</p>
                <p>付款时间：22222222222</p>
                <p>下单时间：22222</p>
                <p>付款方式：22222222222</p>
                <p>付款人：22222222222</p>
                <p>订单状态：22222222222</p>
            </div>
        </div>
        <div class="orderinfo">
            <div class="title">付款信息</div>
            <div class="content">
                <p>订单总价：22222222222</p>
                <p>积分抵扣：22222222222</p>
                <p>优惠券抵扣：22222</p>
                <p>买家需付款：22222222222</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    
}
</script>
<style lang="less" scoped>
.parkorderinfo{
     h3{
		height: 40px;
		line-height: 40px;
		border-bottom: 1px solid #f3f3f3;
        font-size: 14px;
        color: #333;
        font-weight: normal;
    }
    .orderinfo{
        width: 80%;
        margin: 20px;
        .title{
            height: 30px;
            line-height: 30px;
            background: #f2f2f2;
            border-bottom: 1px solid #ddd;
            padding-left: 20px;
            font-size: 16px;
        }
        .content{
            background: #fbfbfb;
            padding: 10px 0 20px 20px;
            p{
                font-size: 14px;
                margin: 4px 0;
            }
        }
    }
}
</style>
