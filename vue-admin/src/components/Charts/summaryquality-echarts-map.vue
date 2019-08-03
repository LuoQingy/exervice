<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
  import echarts from 'echarts'
  require('echarts/map/js/china')
  require('echarts/lib/chart/map')

  export default {
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
        default: '500px'
      },
      height: {
        type: String,
        default: '500px'
      }
    },
    data () {
      return {
        chart: null,
        province:[],//省份数据
        toolTipData:[],
      }
    },
    mounted () {
      let list =  {
          "泰国":{"总IP":16,"百分比":"0%","独立IP":14},
          "格鲁吉亚":{"总IP":1,"百分比":"0%","独立IP":1},
          "台湾":{"总IP":69,"百分比":"0.01%","独立IP":47},
          "河南":{"总IP":58136,"百分比":"4.64%","独立IP":35714},
          "湖北":{"总IP":16368,"百分比":"1.31%","独立IP":10476},
          "江西":{"总IP":17581,"百分比":"1.4%","独立IP":11360},
          "新西兰":{"总IP":1,"百分比":"0%","独立IP":1},
          "黑龙江":{"总IP":119907,"百分比":"9.56%","独立IP":59124},
          "天津":{"总IP":23803,"百分比":"1.9%","独立IP":14992},
          "澳门":{"总IP":16,"百分比":"0%","独立IP":12},
          "越南":{"总IP":4,"百分比":"0%","独立IP":3},
          "美国":{"总IP":7,"百分比":"0%","独立IP":7},
          "西藏":{"总IP":348,"百分比":"0.03%","独立IP":255},
          "肯尼亚":{"总IP":1,"百分比":"0%","独立IP":1},
          "吉林":{"总IP":75936,"百分比":"6.06%","独立IP":36763},
          "上海":{"总IP":7395,"百分比":"0.59%","独立IP":5028},
          "山西":{"总IP":143963,"百分比":"11.48%","独立IP":77384},
          "宁夏":{"总IP":3403,"百分比":"0.27%","独立IP":2345},
          "香港":{"总IP":72,"百分比":"0.01%","独立IP":50},
          "韩国":{"总IP":9,"百分比":"0%","独立IP":7},
          "浙江":{"总IP":13037,"百分比":"1.04%","独立IP":8235},
          "英国":{"总IP":1,"百分比":"0%","独立IP":1},
          "匈牙利":{"总IP":2,"百分比":"0%","独立IP":1},
          "山东":{"总IP":87894,"百分比":"7.01%","独立IP":53245},
          "福建":{"总IP":11165,"百分比":"0.89%","独立IP":7054},
          "伊朗":{"总IP":1,"百分比":"0%","独立IP":1},
          "俄罗斯":{"总IP":5,"百分比":"0%","独立IP":4},
          "河北":{"总IP":94823,"百分比":"7.56%","独立IP":51756},
          "重庆":{"总IP":53652,"百分比":"4.28%","独立IP":30049},
          "湖南":{"总IP":21002,"百分比":"1.67%","独立IP":13617},
          "海南":{"总IP":1247,"百分比":"0.1%","独立IP":884},
          "亚太地区":{"总IP":12,"百分比":"0%","独立IP":8},
          "陕西":{"总IP":22399,"百分比":"1.79%","独立IP":13139},
          "贵州":{"总IP":5170,"百分比":"0.41%","独立IP":3512},
          "新疆":{"总IP":7389,"百分比":"0.59%","独立IP":4863},
          "江苏":{"总IP":49529,"百分比":"3.95%","独立IP":30603},
          "共享地址":{"总IP":144,"百分比":"0.01%","独立IP":108},
          "安徽":{"总IP":31269,"百分比":"2.49%","独立IP":19471},
          "甘肃":{"总IP":16127,"百分比":"1.29%","独立IP":10602},
          "四川":{"总IP":100923,"百分比":"8.05%","独立IP":58053},
          "加拿大":{"总IP":4,"百分比":"0%","独立IP":3},
          "广西":{"总IP":43536,"百分比":"3.47%","独立IP":26182},
          "日本":{"总IP":20,"百分比":"0%","独立IP":11},
          "云南":{"总IP":8788,"百分比":"0.7%","独立IP":5775},
          "内蒙古":{"总IP":35714,"百分比":"2.85%","独立IP":18138},
          "马来西亚":{"总IP":1,"百分比":"0%","独立IP":1},
          "辽宁":{"总IP":117800,"百分比":"9.39%","独立IP":63950},
          "广东":{"总IP":43983,"百分比":"3.51%","独立IP":23215},
          "局域网":{"总IP":322,"百分比":"0.03%","独立IP":273},
          "青海":{"总IP":1526,"百分比":"0.12%","独立IP":930},
          "中国":{"总IP":1868,"百分比":"0.15%","独立IP":921},
          "新加坡":{"总IP":29,"百分比":"0%","独立IP":20},
          "澳大利亚":{"总IP":3,"百分比":"0%","独立IP":3},
          "菲律宾":{"总IP":1,"百分比":"0%","独立IP":1},
          "北京":{"总IP":17597,"百分比":"1.4%","独立IP":10375}
        };
      this.initData(list)
    },
    beforeDestroy () {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    methods: {
      // 获取渠道标识
      getChannelList () {
        this.$http({
          url: this.$http.adornUrl('/biz/bizchannel/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': 1,
            'limit': 100
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.channels = data.page.list
          } else {
            this.channels = []
          }
        })
      },
      getDataList (refresh) {
        this.chart = echarts.init(document.getElementById(this.id))
        const nameTitle = '中国人民大学2017年各省市计划录取人数'
        const subname = '数据爬取自千栀网\n，\n上海、浙江无文理科录取人数'
        const nameColor = ' rgb(55, 75, 113)'
        const nameFontFamily = '等线'
        const subnameFontSize = 15
        const nameFontSize = 18
        const mapName = 'china'
        var data = [
          // {name: '北京', value: 177},
          // {name: '天津', value: 42},
          // {name: '河北', value: 102},
          // {name: '山西', value: 81},
          // {name: '内蒙古', value: 47},
          // {name: '辽宁', value: 67},
          // {name: '吉林', value: 82},
          // {name: '黑龙江', value: 66},
          // {name: '上海', value: 24},
          // {name: '江苏', value: 92},
          // {name: '浙江', value: 114},
          // {name: '安徽', value: 109},
          // {name: '福建', value: 116},
          // {name: '江西', value: 91},
          // {name: '山东', value: 119},
          // {name: '河南', value: 137},
          // {name: '湖北', value: 116},
          // {name: '湖南', value: 114},
          // {name: '重庆', value: 91},
          // {name: '四川', value: 125},
          // {name: '贵州', value: 62},
          // {name: '云南', value: 83},
          // {name: '西藏', value: 9},
          // {name: '陕西', value: 80},
          // {name: '甘肃', value: 56},
          // {name: '青海', value: 10},
          // {name: '宁夏', value: 18},
          // {name: '新疆', value: 67},
          // {name: '广东', value: 123},
          // {name: '广西', value: 59},
          // {name: '海南', value: 14}
        ]
        var geoCoordMap = {}
        var toolTipData = [
          {name: '北京', value: [{name: '文科', value: 95}, {name: '理科', value: 82}]},
          {name: '天津', value: [{name: '文科', value: 22}, {name: '理科', value: 20}]},
          {name: '河北', value: [{name: '文科', value: 60}, {name: '理科', value: 42}]},
          {name: '山西', value: [{name: '文科', value: 40}, {name: '理科', value: 41}]},
          {name: '内蒙古', value: [{name: '文科', value: 23}, {name: '理科', value: 24}]},
          {name: '辽宁', value: [{name: '文科', value: 39}, {name: '理科', value: 28}]},
          {name: '吉林', value: [{name: '文科', value: 41}, {name: '理科', value: 41}]},
          {name: '黑龙江', value: [{name: '文科', value: 35}, {name: '理科', value: 31}]},
          {name: '上海', value: [{name: '文科', value: 12}, {name: '理科', value: 12}]},
          {name: '江苏', value: [{name: '文科', value: 47}, {name: '理科', value: 45}]},
          {name: '浙江', value: [{name: '文科', value: 57}, {name: '理科', value: 57}]},
          {name: '安徽', value: [{name: '文科', value: 57}, {name: '理科', value: 52}]},
          {name: '福建', value: [{name: '文科', value: 59}, {name: '理科', value: 57}]},
          {name: '江西', value: [{name: '文科', value: 49}, {name: '理科', value: 42}]},
          {name: '山东', value: [{name: '文科', value: 67}, {name: '理科', value: 52}]},
          {name: '河南', value: [{name: '文科', value: 69}, {name: '理科', value: 68}]},
          {name: '湖北', value: [{name: '文科', value: 60}, {name: '理科', value: 56}]},
          {name: '湖南', value: [{name: '文科', value: 62}, {name: '理科', value: 52}]},
          {name: '重庆', value: [{name: '文科', value: 47}, {name: '理科', value: 44}]},
          {name: '四川', value: [{name: '文科', value: 65}, {name: '理科', value: 60}]},
          {name: '贵州', value: [{name: '文科', value: 32}, {name: '理科', value: 30}]},
          {name: '云南', value: [{name: '文科', value: 42}, {name: '理科', value: 41}]},
          {name: '西藏', value: [{name: '文科', value: 5}, {name: '理科', value: 4}]},
          {name: '陕西', value: [{name: '文科', value: 38}, {name: '理科', value: 42}]},
          {name: '甘肃', value: [{name: '文科', value: 28}, {name: '理科', value: 28}]},
          {name: '青海', value: [{name: '文科', value: 5}, {name: '理科', value: 5}]},
          {name: '宁夏', value: [{name: '文科', value: 10}, {name: '理科', value: 8}]},
          {name: '新疆', value: [{name: '文科', value: 36}, {name: '理科', value: 31}]},
          {name: '广东', value: [{name: '文科', value: 63}, {name: '理科', value: 60}]},
          {name: '广西', value: [{name: '文科', value: 29}, {name: '理科', value: 30}]},
          {name: '海南', value: [{name: '文科', value: 8}, {name: '理科', value: 6}]}
        ]
        data = this.province;
        toolTipData = this.toolTipData
        this.chart.showLoading()
        //var mapFeatures = echarts.getMap(mapName).geoJson.features
        this.chart.hideLoading()
        // mapFeatures.forEach(function (v) {
        //   // 地区名称
        //   var name = v.properties.name
        //   // 地区经纬度
        //   geoCoordMap[name] = v.properties.cp
        // })
        //console.log(data)
        //console.log(toolTipData)
        var max = 480
        var min = 9
        var maxSize4Pin = 100
        var minSize4Pin = 20

        var convertData = function (data) {
          var res = []
          for (var i = 0; i < data.length; i++) {
            var geoCoord = geoCoordMap[data[i].name]
            if (geoCoord) {
              res.push({
                name: data[i].name,
                value: geoCoord.concat(data[i].value)
              })
            }
          }
          return res
        }
        let option = {
          title: {
            text: nameTitle,
            subtext: subname,
            x: 'center',
            textStyle: {
              color: nameColor,
              fontFamily: nameFontFamily,
              fontSize: nameFontSize
            },
            subtextStyle: {
              fontSize: subnameFontSize,
              fontFamily: nameFontFamily
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: function (params) {
              if (typeof (params.value)[2] === 'undefined') {
                var toolTiphtml = ''
                for (var i = 0; i < toolTipData.length; i++) {
                  if (params.name === toolTipData[i].name) {
                    toolTiphtml += toolTipData[i].name + ':<br>'
                    for (var j = 0; j < toolTipData[i].value.length; j++) {
                      toolTiphtml += toolTipData[i].value[j].name + ':' + toolTipData[i].value[j].value + '<br>'
                    }
                  }
                }
                // console.log(convertData(data))
                return toolTiphtml
              } else {
                toolTiphtml = ''
                for (i = 0; i < toolTipData.length; i++) {
                  if (params.name === toolTipData[i].name) {
                    toolTiphtml += toolTipData[i].name + ':<br>'
                    for (j = 0; j < toolTipData[i].value.length; j++) {
                      toolTiphtml += toolTipData[i].value[j].name + ':' + toolTipData[i].value[j].value + '<br>'
                    }
                  }
                }
                console.log(toolTiphtml)
                // console.log(convertData(data))
                return toolTiphtml
              }
            }
          },
          visualMap: {
            show: true,
            min: 0,
            max: 100000,
            left: 'left',
            top: 'bottom',
            text: ['高', '低'], // 文本，默认为数值文本
            calculable: true,
            seriesIndex: [1],
            inRange: {
              color: [ '#A5CC82','#2B91B7','#00467F'] // 绿蓝
            }
          },
          geo: {
            show: true,
            map: mapName,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            roam: true,
            itemStyle: {
              normal: {
                areaColor: '#031525',//没有数据地区的背景颜色
                borderColor: '#3B5077'
              },
              emphasis: {
                areaColor: '#2B91B7'//移入的背景颜色
              }
            }
          },
          series: [{
            name: '散点',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: convertData(data),
            symbolSize: function (val) {
              return val[2] / 10
            },
            label: {
              normal: {
                formatter: '{b}',
                position: 'right',
                show: true
              },
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: '#05C3F9'
              }
            }
          },
          {
            type: 'map',
            map: mapName,
            geoIndex: 0,
            aspectScale: 0.75,
            showLegendSymbol: false,
            label: {
              normal: {
                show: true
              },
              emphasis: {
                show: false,
                textStyle: {
                  color: '#fff'
                }
              }
            },
            roam: true,
            itemStyle: {
              normal: {
                areaColor: '#031525',
                borderColor: '#3B5077'
              },
              emphasis: {
                areaColor: '#2B91B7'
              }
            },
            animation: false,
            data: data
          },
          {
            name: '点',
            type: 'scatter',
            coordinateSystem: 'geo',
            symbol: 'pin',
            symbolSize: function (val) {
              var a = (maxSize4Pin - minSize4Pin) / (max - min)
              var b = minSize4Pin - a * min
              b = maxSize4Pin - a * max
              return a * val[2] + b
            },
            label: {
              normal: {
                show: true,
                textStyle: {
                  color: '#fff',
                  fontSize: 9
                }
              }
            },
            itemStyle: {
              normal: {
                color: '#F62157'
              }
            },
            zlevel: 6,
            data: convertData(data)
          },
          {
            name: 'Top 5',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: convertData(data.sort(function (a, b) {
              return b.value - a.value
            }).slice(0, 5)),
            symbolSize: function (val) {
              return val[2] / 10
            },
            showEffectOn: 'render',
            rippleEffect: {
              brushType: 'stroke'
            },
            hoverAnimation: true,
            label: {
              normal: {
                formatter: '{b}',
                position: 'right',
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: 'yellow',
                shadowBlur: 10,
                shadowColor: 'yellow'
              }
            },
            zlevel: 1
          }]
        }
        this.chart.setOption(option)
      },
      initData(dataList){
        if(dataList instanceof Object){
          let list = dataList;
          this.province =[];
          this.toolTipData = [];
          for(let key in list){
            let obj ={
              name:key,
              value:[]
            }
            this.province.push({name:key,value:list[key]['总IP']})
            //console.log(obj)
            if(list[key] instanceof Object){
              //console.log(list[key]) 
              for(let i in list[key]){
                obj.value.push( { name:i, value:list[key][i] } )
              }
            }
            this.toolTipData.push(obj)
          }
          //console.log(this.toolTipData,this.province)
          this.getDataList();
        }else{
          return;
        }  
      }
    }
  }
</script>

<style scoped>
  .chart-box {
    min-height: 400px;
  }
</style>
