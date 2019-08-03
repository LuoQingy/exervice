<template>
    <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
// import resize from './mixins/resize'

export default {
  // mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    subList:{
      type: Array,
      default:[]
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
     
      lists:[],//接口返回的参数
      baidu:[],
      totalList:[],
      parameterList:['ipCount', 'ipSingle', 'qualityScore'],//参数数组
      dataList:[],//处理存储的数据
      timeList:[],//时间数组
    }
  },
  mounted() {
     this.changelist(this.parameterList)
    
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    changelist(arr,channel){
      //console.log(this.subList)
      //console.log('this.subList')
      this.dataList= []
      for(let i=0;i<arr.length;i++){
        let obj = {
          name:arr[i],
          data:[],
        }
        this.dataList.push(obj)
      }
      var newArr = this.subList.flat();//变成一维数组
      let getTime = function (date) {
        return new Date(date).getTime();
      };
      newArr.sort(function (a, b) {//按照大到小的时间排序
        return getTime(b.summaryTime) - getTime(a.summaryTime);
      }) 
      //console.log(newArr)
      this.timeList = []
       this.dataList.forEach((val,first) => { 
        val.data = [];
        newArr.forEach((item,index) => {
          val.data.push(item[val.name]) 
          //console.log(val.name +':'+item[val.name]);
             if(this.timeList.length<newArr.length) {
                 this.timeList.push(item.channel+item.summaryTime)                    
             }               
        });
      });
      
      //console.log(this.dataList)
      //console.log(this.timeList)
      this.initChart()
    },

    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      this.chart.setOption({
        backgroundColor: '#344b58',
        title: {
          text: 'statistics',
          x: '20',
          top: '20',
          textStyle: {
            color: '#fff',
            fontSize: '22'
          },
          subtextStyle: {
            color: '#90979c',
            fontSize: '16'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            textStyle: {
              color: '#fff'
            }
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          borderWidth: 0,
          top: 150,
          bottom: 95,
          textStyle: {
            color: '#fff'
          }
        },
        legend: {
          x: '5%',
          top: '10%',
          textStyle: {
            color: '#90979c'
          },
          data: this.parameterList
        },
        calculable: true,
        xAxis: [{
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLabel: {
            interval: 0

          },
          data: this.timeList//底部时间
        }],
        yAxis: [{
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0
          },
          splitArea: {
            show: false
          }
        }],
        series: [//注意series数组对象的name要对应
          {
            name: 'ipCount',
            type: 'bar',
            stack: 'total',
            barMaxWidth: 35,
            barCateGoryGap:10,
            barGap: '10%',
            itemStyle: {
              normal: {
                color: 'rgba(255,144,128,1)',
                label: {
                  show: true,
                  textStyle: {
                    color: '#fff'
                  },
                  position: 'insideTop',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data: this.dataList[0].data//放ipCount的数据
          },

        {
          name: 'ipSingle',
          type: 'bar',
          stack: 'total',
          itemStyle: {
            normal: {
              color: 'rgba(0,191,183,1)',
              barBorderRadius: 0,
              label: {
                show: true,
                position: 'top',
                formatter(p) {
                  return p.value > 0 ? p.value : ''
                }
              }
            }
          },
          data: this.dataList[1].data//放ipSingle的数据
        }, {
          name: 'qualityScore',
          type: 'line',
          stack: 'total',
          symbolSize: 10,
          symbol: 'circle',
          itemStyle: {
            normal: {
              color: 'rgba(252,230,48,1)',
              barBorderRadius: 0,
              label: {
                show: true,
                position: 'top',
                formatter(p) {
                  return p.value > 0 ? p.value : ''
                }
              }
            }
          },
          data: this.dataList[2].data//放qualityScore的数据
        }
        ]
      })
    }
  },
  watch: {
    subList(){
      this.changelist(this.parameterList)
    }
  }
}
</script>
