<template>
  <div>
    <el-breadcrumb separator="/" class="content_title">
      <el-breadcrumb-item>卡券营销</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="coupon_list">
      <p class="title">活动信息</p>
      <ul class="list_info">
        <li class="list">
          <span class="list_title">活动名称</span>
          <span class="text">{{coupondata.planName}}</span>
        </li>
        <li class="list">
          <span class="list_title">发送时间</span>
          <span class="text">{{coupondata.creationTime}}</span>
        </li>
        <li class="list">
          <span class="list_title">发送人</span>
          <span class="text">商场</span>
        </li>
      </ul>
    </div>
    <div class="coupon_list">
      <p class="title">营销效果</p>
      <ul class="list_info">
        <li class="list">
          <span class="list_title">送达人数</span>
          <span class="text">{{CouponStatistics.mpcsDeliveryNum}}</span>
        </li>
        <li class="list">
          <span class="list_title">今日核销</span>
          <span class="text">{{CouponStatistics.mpcsUseToday}}</span>
        </li>
        <li class="list">
          <span class="list_title">核销总数</span>
          <span class="text">{{CouponStatistics.mpcsTotalUse}}</span>
        </li>
        <li class="list">
          <span class="list_title">核销率</span>
          <span class="text">{{number}}%</span>
        </li>
      </ul>
    </div>
    <!-- 数据图展示 -->
    <div class="datagram">
      <div class="datagram_title">营销统计</div>
      <div class="datagram_select">
        <el-select v-model="value" placeholder="请选择" @change="valueChang">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="myChart">
        <div ref="myChart" :style="{width: '100%', height: '400px'}"></div>
      </div>
    </div>
  </div>
</template>
  
<script>
export default {
  data() {
    return {
      CouponStatistics: "",
      coupondata: {},
      value: "7",
      options: [
        {
          value: "7",
          label: "近七天"
        },
        {
          value: "30",
          label: "最近30天"
        },
        {
          value: "90",
          label: "最近90天"
        }
      ],
      xAxisdata: [], //统计数据日期
      seriesdata: [] //统计数据
    };
  },
  created() {
    this.PlanCouponDetails();
  },
  methods: {
    PlanCouponDetails() {
      this.$httpAuth
        .post("/mall/selectMarketingPlanCouponDetails", {
          mpId: this.$route.query.mpId,
          statisticalDays: this.value
        })
        .then(result => {
          if (result.data.code === 10000) {
            this.coupondata = result.data.resp;
            this.CouponStatistics =
              result.data.resp.marketingPlanCouponStatistics;
            let xAxisdata = [];
            let seriesdata = [];
            result.data.resp.marketingPlanCouponStatisticsHistoryList.forEach(
              val => {
                let date = val.mpcshDate.split(" ")[0].split("-");
                xAxisdata.push([date[1], date[2]].join("-"));
                seriesdata.push(val.mpcshUse);
              }
            );
            this.xAxisdata = xAxisdata;
            this.seriesdata = seriesdata;
            this.drawLine();
          }
        })
        .catch(err => {});
    },
    valueChang() {
      this.PlanCouponDetails();
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(this.$refs.myChart);
      let _this = this;
      // 指定图表的配置项和数据
      myChart.setOption({
        grid: {
          top: "4%",
          left: "0%",
          right: "4%",
          bottom: "10%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: _this.xAxisdata
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "line" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        yAxis: {
          type: "value"
        },
        legend: {
          data: ["核销数量"],
          y: "bottom",
          icon: "rect"
        },
        series: [
          {
            data: _this.seriesdata,
            type: "line",
            smooth: true,
            color: "orange",
            name: "核销数量"
          }
        ]
      });
    }
  },
  computed: {
    number() {
      if (
        this.CouponStatistics.mpcsTotalUse &&
        this.CouponStatistics.mpcsDeliveryNum
      ) {
        return (
          (this.CouponStatistics.mpcsTotalUse /
            this.CouponStatistics.mpcsDeliveryNum) *
          100
        ).toFixed(2);
      } else {
        return "0";
      }
    }
  }
};
</script>
  
<style scoped lang="less">
.coupon_list {
  padding-bottom: 20px;
  .title {
    margin: 20px 0;
  }
  .list_info {
    display: flex;
    height: 40px;
    border: 1px solid #ccc;
    line-height: 40px;
    .list {
      flex: 1;
      display: flex;
    }
    .list_title {
      background: #f2f2f2;
      padding: 0 20px;
      border-right: 1px solid #ccc;
      border-left: 1px solid #ccc;
    }
    .text {
      flex: 1;
      padding-left: 20px;
    }
  }
}
.datagram {
  .datagram_title {
    padding-left: 10px;
  }
  .datagram_select {
    display: flex;
    justify-content: space-between;
    padding-right: 50px;
    margin-top: 20px;
  }
}
</style>