<template>
  <div id="activity-management">
    <h3>查看结果</h3>
    <div class="activity-content main">
      <div class="title">商品券信息</div>
      <div style="width:100%" class="tableInfo">
        <ul>
          <li>商品名称</li>
          <li>{{info.couponName}}</li>
          <li>领取时间</li>
          <li>{{info.couponReceiveStartTime}}至{{info.couponReceiveEndTime}}</li>
          <li>券状态</li>
          <li>{{info.couponStatus|getstatus}}</li>
          <li>券类型</li>
          <li>{{info.couponType==1?'满减券':'折扣券'}}</li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
      <div class="activity-content main">
        <div class="title">营销效果</div>
        <div style="width:100%" class="tableresult">
          <ul>
            <li>发券数量</li>
            <li>不限制</li>
            <li>领券数量</li>
            <li>{{info.receiveNum}}张</li>
            <li>使用数量</li>
            <li>{{info.totalUse}}张</li>
            <li>使用率</li>
            <li>{{number}}%</li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 数据图展示 营销统计 各门店使用券对比-->
    <div class="datagram">
      <div class="datagram_title">营销统计</div>
      <div class="datagram_select">
        <el-select v-model="daychoose" placeholder="请选择" @change="daychooseChang">
          <el-option v-for="item in dayoptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <div class="select_btn">
          <el-checkbox-group v-model="tabPosition" style="margin-bottom: 30px;" @change="tabPositionChang">
            <el-checkbox-button  label="left">领取数量</el-checkbox-button>
            <el-checkbox-button  label="right">使用数量</el-checkbox-button>
          </el-checkbox-group>
        </div>
      </div>
      <div class="myChart">
        <div ref="myChart" :style="{width: '100%', height: '400px'}"></div>
      </div>
    </div>

    <!-- <div class="datagram">
      <div class="datagram_title">各门店使用券对比</div>
      <div class="condition">
        <el-select v-model="commercialchoose" placeholder="请选择业态">
          <el-option v-for="item in commercialoptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-select v-model="storechoose" placeholder="请选择门店">
          <el-option v-for="item in storeoptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-select v-model="rankchoose" placeholder="请选择排名">
          <el-option v-for="item in rankoptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="myChart">
        <div ref="myChartTwo" :style="{width: '100%', height: '400px'}"></div>
      </div>
    </div> -->
  </div>
</template>
  
<script>
var _this;
export default {
  data() {
    _this = this;
    return {
      daychoose: 7, //选择天数
      dayoptions: [
        { label: "最近7天", value: 7 },
        { label: "最近30天", value: 30 },
        { label: "最近90天", value: 90 }
      ],
      tabPosition: ["left",'right'],
      commercialchoose: "", //选择业态
      commercialoptions: [],
      storechoose: "", //选择门店
      storeoptions: [],
      rankchoose: "", //选择排名
      rankoptions: [],
      couponId: 1,
      info: {},
      status: [
        //状态备注：状态：1=待审核 2=上架 3=下架 4=驳回 5=暂停 6=已审核
        {
          value: 0,
          label: "全部"
        },
        {
          value: 1,
          label: "待审核"
        },
        {
          value: 2,
          label: "已上架"
        },
        {
          value: 3,
          label: "已下架"
        },
        {
          value: 4,
          label: "被驳回"
        },
        {
          value: 5,
          label: "暂停"
        }
      ],
      xAxisdata: [],
      seriesdata1: [],
      seriesdata1: []
    };
  },
  computed: {
    number() {
      if (this.info.mpcsTotalUse && this.info.mpcsDeliveryNum) {
        return ((this.info.totalUse / this.info.receiveNum) * 100).toFixed(2);
      } else {
        return "0";
      }
    }
  },
  filters: {
    getstatus(value) {
      let str;
      _this.status.some(val => {
        if (value == val.value) {
          str = val.label;
          return true;
        }
      });
      return str;
    }
  },
  created() {
    this.couponId = this.$route.query.couponId;
  },
  mounted() {
    this.$nextTick(() => {
      this.activityData();
    //   this.compareBar();
    });
  },
  methods: {
    //   获取活动数据
    activityData() {
      this.$httpAuth({
        url: "/gm/selectCouponActivityData",
        method: "post",
        data: {
          couponId: this.couponId,
          statisticalDays: this.daychoose
        }
      })
        .then(res => {
          if (res.data.code == 10000) {
            let resp = res.data.resp;
            let xAxisdata = [];
            let seriesdata1 = [];
            let seriesdata2 = [];
            resp.couponStatisticsHistoryList.forEach(val => {
              xAxisdata.push(val.cshDate.substr(5,5));
              seriesdata1.push(val.cshReceive);
              seriesdata2.push(val.cshUse);
            });
            resp.seriesdata1 = seriesdata1;
            resp.seriesdata2 = seriesdata2;
            this.xAxisdata = xAxisdata;
            this.seriesdata1 = seriesdata1;
            this.seriesdata2 = seriesdata2;
             this.info = resp;
            this.drawLine();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 选择显示领取数量 使用数量
    tabPositionChang(val){
        if(val.indexOf('left')<0){
            this.seriesdata1=[];
        }else if(val.indexOf('left')>-1){
            this.seriesdata1=this.info.seriesdata1;
        }
        if(val.indexOf('right')<0){
            this.seriesdata2=[];
        }else if(val.indexOf('right')>-1){
            this.seriesdata2=this.info.seriesdata2;
        }
        this.drawLine();
    },
    // 选择天数
    daychooseChang() {
      this.activityData();
    },
    // 营销统计
    drawLine() {
      var myChart = this.$echarts.init(this.$refs.myChart);
      let _this = this;
      myChart.setOption({
        title: {
          text: "单位(张)"
        },
        tooltip: {
          trigger: "axis"
        },
        grid: {
          left: "2%",
          right: "4%",
          bottom: "10%",
          containLabel: true
        },
        legend: [
          {
            x: "center",
            y: "bottom",
            data: [
              {
                name: "领取数量",
                icon: "rect",
                textStyle: {
                  color: "orange"
                }
              },
              {
                name: "使用数量",
                icon: "rect",
                textStyle: {
                  color: "green"
                }
              }
            ]
          }
        ],
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: _this.xAxisdata
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: _this.seriesdata1,
            type: "line",
            smooth: true,
            name: "领取数量",
            color: "orange"
          },
          {
            data: _this.seriesdata2,
            type: "line",
            smooth: true,
            name: "使用数量",
            color: "green"
          }
        ]
      });
    },
    compareBar() {
      // 营销统计的图形
      var myChartTwo = this.$echarts.init(this.$refs.myChartTwo);
      let _this = this;
      myChartTwo.setOption({
        title: {
          text: "单位(张)"
        },
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          axisTick: {
            alignWithLabel: true
          },
          data: ["门店1", "门店1", "门店1", "门店1", "门店1", "门店1", "门店1"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [20, 92, 13, 34, 90, 130, 120],
            type: "bar",
            barWidth: "20%",
            name: "领取数量",
            color: "#3398DB"
          }
        ]
      });
    }
  }
};
</script>

  
<style lang="less" scoped>
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
}
#activity-management {
  h3 {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #f3f3f3;
    font-size: 14px;
    color: #333;
    font-weight: normal;
  }

  .activity-content {
    width: 100%;
    margin: 10px 0;
    overflow: hidden;
    .title {
      margin: 10px;
    }
    .tableInfo {
      width: 100%;
      height: 100px;
      ul {
        li {
          float: left;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-right: 1px solid #ddd;
          border-bottom: 1px solid #ddd;
        }
        li:nth-child(1) {
          border-left: 1px solid #ddd;
        }
        li:nth-child(7) {
          border-left: 1px solid #ddd;
        }
        li:nth-child(n + 1):nth-child(-n + 6) {
          border-top: 1px solid #ddd;
        }
        li:nth-child(2n + 1) {
          background: #f2f2f2;
          width: 12%;
        }
        li:nth-child(2n) {
          width: 20%;
        }
      }
    }
    .tableresult {
      width: 100%;
      height: 50px;
      ul {
        li {
          // width: 33%;
          float: left;
          height: 50px;
          line-height: 50px;
          text-align: center;
          border-top: 1px solid #ddd;
          border-right: 1px solid #ddd;
          border-bottom: 1px solid #ddd;
        }
        li:nth-child(1) {
          border-left: 1px solid #ddd;
        }
        li:nth-child(2n + 1) {
          background: #f2f2f2;
          width: 10%;
        }
        li:nth-child(2n) {
          width: 14%;
        }
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
      height: 40px;
    }
    .condition {
      margin-top: 20px;
    }
    .select_btn {
      display: flex;
    }
    .el-button + .el-button {
      margin-left: 0;
      border-radius: 0;
    }
    .el-button--small {
      border-radius: 0px;
    }
    .myChart {
      margin-top: 20px;
    }
  }
}
</style>
