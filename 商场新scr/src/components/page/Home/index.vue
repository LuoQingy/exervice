<template>
        <div>
                <div>
                        <el-breadcrumb separator="/" class="content_title">
                                <el-breadcrumb-item>实时数据</el-breadcrumb-item>
                        </el-breadcrumb>
                </div>
                <div class="info">
                        <div class="data">
                                <ul class="ul_list">
                                        <li class="list">
                                                <p class="text">到店顾客总量(人) <i class="el-icon-info"></i> </p>
                                                <p class="number">135255</p>
                                        </li>
                                        <li class="list">
                                                <p class="text">到店人次总量(人次) <i class="el-icon-info"></i> </p>
                                                <p class="number">135255</p>
                                        </li>
                                        <li class="list">
                                                <p class="text">人均到访次数(次) <i class="el-icon-info"></i> </p>
                                                <p class="number">135255</p>
                                        </li>
                                        <li class="list">
                                                <p class="text">平均到店时长(分钟) <i class="el-icon-info"></i> </p>
                                                <p class="number">135255</p>
                                        </li>
                                        <li class="list">
                                                <p class="text">今日交易额(元) <i class="el-icon-info"></i> </p>
                                                <p class="number">135255</p>
                                        </li>
                                        <li class="list">
                                                <p class="text">今日核券数(张) <i class="el-icon-info"></i> </p>
                                                <p class="number">135255</p>
                                        </li>
                                </ul>
                                <!-- 数据图展示 -->
                                <div class="datagram">
                                        <div class="datagram_title">交易额统计</div>
                                        <div class="datagram_select">
                                                <el-select v-model="value" placeholder="请选择">
                                                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                                                        </el-option>
                                                </el-select>
                                        </div>
                                        <div class="myChart">
                                                <div ref="myChart" :style="{width: '100%', height: '400px'}"></div>
                                        </div>
                                </div>
                        </div>
                        <div class="thing">
                                <div class="thing_list">
                                        <p class="title">待审核</p>
                                        <ul class="ul_list">
                                                <li class="list">
                                                        <span>优惠券</span>
                                                        <span class="number">23</span>
                                                </li>
                                                <li class="list">
                                                        <span>消费营销</span>
                                                        <span class="number">23</span>
                                                </li>
                                                <li class="list">
                                                        <span>商品管理(团购)</span>
                                                        <span class="number">23</span>
                                                </li>
                                                <li class="list">
                                                        <span>商城商品</span>
                                                        <span class="number">23</span>
                                                </li>
                                        </ul>
                                </div>
                                <div class="thing_list">
                                        <p class="title">物业报修</p>
                                        <ul class="ul_list">
                                                <li class="list">
                                                        <span>未处理</span>
                                                        <span class="number">23</span>
                                                </li>
                                                <li class="list">
                                                        <span>已处理</span>
                                                        <span class="number">23</span>
                                                </li>
                                        </ul>
                                </div>
                                <div class="thing_list">
                                        <p class="title">营业额上报</p>
                                        <ul class="ul_list">
                                                <li class="list">
                                                        <span>昨日未上报</span>
                                                        <span class="number">23</span>
                                                </li>
                                                <li class="list">
                                                        <span>昨日已上报</span>
                                                        <span class="number">23</span>
                                                </li>
                                        </ul>
                                </div>
                        </div>
                </div>
        </div>
</template>
  
<script>
export default {
  data() {
    return {
      value: "近七天",
      options: [
        {
          value: "选项1",
          label: "近七天"
        },
        {
          value: "选项2",
          label: "最近半个月"
        },
        {
          value: "选项3",
          label: "最近一个月"
        },
        {
          value: "选项4",
          label: "最近三个月"
        },
        {
          value: "选项5",
          label: "今年"
        }
      ]
    };
  },
  methods: {
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
          data: ["9-13", "9-14", "9-15", "9-16", "9-17", "9-18", "9-19"]
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
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line",
            smooth: true,
            color: "orange",
            name: "新增会员"
          }
        ]
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.drawLine();
    });
  }
};
</script>
  
<style scoped lang="less">
.info {
  display: flex;
}
.data {
  flex: 1;
  .ul_list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 10px;
    margin-right: 10px;
    .list {
      width: 32%;
      border: 2px solid #f2f2f2;
      border-radius: 8px;
      margin-bottom: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      height: 150px;
    }
    .el-icon-info {
      color: #7dc5eb;
    }
  }
}
.list {
  .text {
    margin-bottom: 10px;
  }
  .number {
    color: #ff7923;
    font-size: 26px;
  }
}
.thing {
  width: 300px;
  background: #f2f2f2;
  padding: 10px;
  .thing_list {
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    background: #ffffff;
    margin-bottom: 10px;
    .title {
      height: 46px;
      line-height: 46px;
      border-bottom: 1px solid #d9d9d9;
      padding-left: 20px;
    }
    .ul_list {
      padding: 0 10px;
    }
    .list {
      height: 46px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px dashed #d9d9d9;
      &:last-child {
        border-bottom: none;
      }
    }
  }
}
.datagram {
  .datagram_title {
    border-left: 6px solid #2db7f5;
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