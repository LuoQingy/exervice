<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    }
  },
  data() {
    return {
      chart: null,
      lists:[//接口返回的参数
        {channel: "google",
        clientPlatform: null,
        createTime: "2019-05-08 12:00:05",
        hitSection: null,
        id: 25714,
        ipCount: 32,
        ipSingle: 2,
        qualityScore: 6.25,
        summaryTime: "2019-05-07",
        type: 0},
        {channel: "google",
        clientPlatform: null,
        createTime: "2019-05-08 11:42:11",
        hitSection: null,
        id: 25640,
        ipCount: 0,
        ipSingle: 0,
        qualityScore: 0,
        summaryTime: "2019-05-08",
        type: 0},
      {channel: "google",
        clientPlatform: null,
        createTime: "2019-05-07 14:47:57",
        hitSection: null,
        id: 25565,
        ipCount: 32,
        ipSingle: 2,
        qualityScore: 6.25,
        summaryTime: "2019-05-07",
        type: 0},
        {
          channel: "google",
          clientPlatform: null,
          createTime: "2019-05-07 14:46:23",
          hitSection: null,
          id: 25492,
          ipCount: 0,
          ipSingle: 3,
          qualityScore: 0,
          summaryTime: "2019-05-06",
          type: 0},
          {channel: "google",
            clientPlatform: null,
            createTime: "2019-05-06 19:31:49",
            hitSection: null,
            id: 25418,
            ipCount: 45,
            ipSingle: 4,
            qualityScore: 0.09,
            summaryTime: "2019-05-06",
            type: 0}
          ],
        dataList:[],//处理存储的数据
        parameterList:[//参数数组
          {name:'ipCount',color:'rgba(193,35,43,1)',show:true},
          {name:'ipSingle',color:'rgba(181,195,52,1)',show:true},
          {name:'qualityScore',color:'rgba(252,206,16,1)',show:true},
        ],
        timeList:[],//时间数组
    }
  },
  mounted() {
    
    this.changelist(this.parameterList,this.lists[0].channel);//执行处理数据函数
    this.$nextTick(()=>{
      this.initChart();//处理好数据在生成图表
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null;
    
  },
  methods: {
    changelist(arr,google){
      this.dataList= []
      for(let i=0;i<arr.length;i++){
        let obj = {
          name:arr[i].name,
          type:'bar',//图表类型
          itemStyle: {normal: {color:arr[i].color, label:{show:arr[i].show}}},
          data:[]
        }
        this.dataList.push(obj)
      }
      this.timeList = [];
      this.dataList.forEach((val,first) => {       
        this.lists.forEach((item,index) => {
          val.data.push(item[val.name]) 
          console.log(val.name +':'+item[val.name]);
             if(this.timeList.length<this.lists.length) {
               this.timeList.push(item.createTime)
             }               
        });
      });
      
      console.log(this.dataList)
      console.log(this.timeList)
    },
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      const xAxisData = []
      const data = []
      const data2 = []
      for (let i = 0; i < 50; i++) {
        xAxisData.push(i)
        data.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5)
        data2.push((Math.sin(i / 5) * (i / 5 + 10) + i / 6) * 3)
      }
      console.log(this.echList)
      console.log(this.dataList)
      this.chart.setOption({
        
        text: 'ECharts2 vs ECharts1',
        subtext: 'Chrome下测试数据',
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:[
                'ipCount2','ipSingle2','qualityScore3','',
                'ipCount1','ipSingle1','qualityScore1','',
                'ipCount','ipSingle','qualityScore'
            ]
        },
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable : true,
        // grid: {y: 70, y2:30, x2:20},
        xAxis : [
            {
                type : 'category',
                data :this.timeList//x轴的底部时间
            },
            {
                type : 'category',
                axisLine: {show:false},
                axisTick: {show:false},
                axisLabel: {show:false},
                splitArea: {show:false},
                splitLine: {show:false},
                data : this.timeList
            },
            {
                type : 'category',
                axisLine: {show:false},
                axisTick: {show:false},
                axisLabel: {show:false},
                splitArea: {show:false},
                splitLine: {show:false},
                data : this.timeList
            }
        ],
        yAxis : [
            {
                type : 'value',
                axisLabel:{formatter:'{value} ms'}//ms是放单位的
            }
        ],
        series : this.dataList
        
      })
    }
  }
}
</script>
