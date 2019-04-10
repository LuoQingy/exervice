<template>
  <div>
    <!-- 页面顶部标题 -->
    <div>
      <el-breadcrumb separator="/" class="content_title">
        <el-breadcrumb-item :to="{ path: '/member/management' }">会员管理</el-breadcrumb-item>
        <el-breadcrumb-item>会员总览</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 页面数据展示 -->
    <div class="data">
      <!--  -->
      <div class="data_lists">
        <!-- 单个数据内容 -->
        <ul class="list">
          <li class="lsit_chil">
            <div>
              <span>会员总数</span>
              <span class="big_number">{{dataInfo.usersCount}}</span>
            </div>
            <div>
              <span>
                <el-tooltip class="item" effect="dark" content="粉丝为关注了公众号的用户" placement="top">
                  <span>
                    粉丝
                    <i class="el-icon-warning"></i>
                  </span>
                </el-tooltip>
              </span>
              <span class="big_number">{{dataInfo.fans}}</span>
            </div>
          </li>
          <li class="lsit_chil">
            <div>
              <span>
                <el-tooltip class="item" effect="dark" content="顾客是有过消费的用户" placement="top">
                  <span>
                    顾客
                    <i class="el-icon-warning"></i>
                  </span>
                </el-tooltip>
              </span>
              <span class="big_number">{{dataInfo.guest}}</span>
            </div>
            <div>
              <span>
                <el-tooltip class="item" effect="dark" content="访客是访问了综合体的页面" placement="top">
                  <span>
                    访客
                    <i class="el-icon-warning"></i>
                  </span>
                </el-tooltip>
              </span>
              <span class="big_number">{{dataInfo.visitor}}</span>
            </div>
          </li>
        </ul>
        <!-- 单个数据内容 -->
        <ul class="list blue">
          <li class="lsit_chil">
            <div>
              <span>昨日新增</span>
              <span class="big_number">{{dataInfo.yesterdayAddUsers}}</span>
            </div>
            <div>
              <span>今日新增</span>
              <span class="big_number">{{dataInfo.todayAddUsers}}</span>
            </div>
          </li>
          <li class="lsit_chil">
            <div>
              <span>上月新增</span>
              <span class="small_number">{{dataInfo.lastMonthAddUsers}}</span>
            </div>
            <div>
              <span>本月新增</span>
              <span class="small_number">{{dataInfo.thisMonthAddUsers}}</span>
            </div>
          </li>
        </ul>
        <!-- 单个数据内容 -->
        <ul class="list green">
          <li class="lsit_chil">
            <div>
              <span>
                <el-tooltip class="item" effect="dark" content="线下商场7天内到访人数" placement="top">
                  <span>
                    近7天到访人数
                    <i class="el-icon-warning"></i>
                  </span>
                </el-tooltip>
              </span>
              <span class="small_number">{{dataInfo.sevenDaysVisit}}</span>
            </div>
            <div>
              <span>
                <el-tooltip class="item" effect="dark" content="本月1号开始截止到当前时间h5页面的访问人数" placement="top">
                  <span>
                    本月Mall访问量
                    <i class="el-icon-warning"></i>
                  </span>
                </el-tooltip>
              </span>
              <span class="small_number">{{dataInfo.thisMonthMallVisit}}</span>
            </div>
          </li>
          <li class="lsit_chil">
            <div>
              <span>近30天到访人数</span>
              <span class="small_number">{{dataInfo.thirtyDaysVisit}}</span>
            </div>
            <div>
              <span>上月Mall访问量</span>
              <span class="small_number">{{dataInfo.lastMonthMallVisit}}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 数据图展示 -->
    <div class="datagram">
      <div class="datagram_title">会员趋势</div>
      <div class="datagram_select">
        <el-select v-model="value" @change="valueChang" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <!-- <div class="select_btn">
          <el-button type="success">新增会员</el-button>
        </div> -->
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
      value: "7",
      dataInfo: {},
      options: [
        {
          value: "7",
          label: "近七天"
        },
        {
          value: "30",
          label: "最近一个月"
        }
      ],
      seriesData: [],
      xAxisData: []
    };
  },
  created() {
    this.getUsersOutline();
    this.getUsersOutlineImage();
  },
  methods: {
    // 用户数据
    getUsersOutline() {
      this.$xwhttpAuth
        .post("/mall/getUsersOutline")
        .then(result => {
          if (result.data.code === 10000) {
            this.dataInfo = result.data.resp;
          } else {
            this.$message({
              message: result.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    // 图表数据
    getUsersOutlineImage() {
      let formdata = new FormData();
      formdata.append("day", this.value);
      this.$httpAuth
        .post("/mall/getUsersOutlineImage", formdata)
        .then(result => {
          if (result.data.code === 10000) {
            let seriesData = [];
            let xAxisData = [];
            result.data.resp.forEach(val => {
              seriesData.push(val.addUsers);
              xAxisData.push(val.everyday.substr(5, 5));
            });
            this.seriesData = seriesData;
            this.xAxisData = xAxisData;
            this.drawLine();
          } else {
            this.$message({
              message: result.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    valueChang() {
      this.getUsersOutlineImage();
    },
    // 数据图
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(this.$refs.myChart);
      let _this = this;
      // 指定图表的配置项和数据
      myChart.setOption({
        title: {
          text: "单位(人)"
        },
        grid: {
          left: "0%",
          right: "4%",
          bottom: "10%",
          containLabel: true
        },
        legend: {
          x: "center",
          y: "bottom",
          icon: "rect",
          data: ["新增会员"]
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "line" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.xAxisData
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: this.seriesData,
            type: "line",
            smooth: true,
            name: "新增会员",
            itemStyle: {
              color:'#a3ce6c'
            }
          }
        ]
      });
    }
  }
};
</script>
  
<style scoped>
.data {
  padding: 30px 10px 0;
}

.data_lists {
  display: flex;
  justify-content: space-around;
  margin-bottom: 40px;
}

.data_lists .list {
  width: 32%;
  height: 180px;
  background: #8544e0;
  color: #ffffff;
  padding: 20px;
  display: flex;
  flex-flow: column;
  box-sizing: border-box;
}
.data_lists .green {
  background: #13c2c3;
}
.data_lists .blue {
  background: #1890ff;
}
.menber_number {
  display: flex;
  justify-content: space-between;
}

.big_number {
  font-size: 25px;
  margin-top: 5px;
}
.small_number {
  font-size: 18px;
  margin-top: 10px;
}
.lsit_chil {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
}

.lsit_chil > div {
  flex: 1;
  display: flex;
  flex-flow: column;
  justify-content: space-around;
}
.datagram .datagram_title {
  border-left: 6px solid #2db7f5;
  padding-left: 10px;
}
.datagram .datagram_select {
  display: flex;
  justify-content: space-between;
  padding-right: 50px;
  margin-top: 20px;
}
.datagram .select_btn {
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
  padding-bottom: 30px;
}
</style>