<template>
  <div class="chart-container">
     <el-select
    v-model="value11"
    multiple
    collapse-tags
    @change="change"
    style="margin:10px"
    placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
    <chart height="100%" :subList='totalList' width="100%" />
  </div>
</template>

<script>
import Chart from '@/components/Charts/MixChart'
export default {
  name: 'MixChart',
  components: { Chart },
  data(){
    return{
       options: [{
          value: 'google',
          label: 'google'
        }, {
          value: '百度',
          label: '百度'
        }, {
          value: '微博',
          label: '微博'
        }, 
      ],
      value11: ["google", "百度", "微博"],
      totalList:[
        [//接口返回的参数
          {
            channel: "google",clientPlatform: null,createTime: "2019-05-08 12:00:05",hitSection: null,
            id: 25714,ipCount: 30,ipSingle: 2,qualityScore: 6,summaryTime: "2019-05-07",type: 0
          },
         
          {
            channel: "google",clientPlatform: null,createTime: "2019-05-07 14:47:57",hitSection: null,
            id: 25565,ipCount: 32,ipSingle: 10,qualityScore: 7,summaryTime: "2019-05-07",type: 0
          },
        ],
        [ 
          {
            channel: "百度",clientPlatform: null,createTime: "2019-05-08 12:00:05",hitSection: null,
            id: 25714,ipCount: 31,ipSingle: 1,qualityScore:8,summaryTime: "2019-05-07",type: 0
          },
          
          {
            channel: "百度",clientPlatform: null,createTime: "2019-05-07 14:47:57",hitSection: null,
            id: 25565,ipCount: 34,ipSingle: 3,qualityScore: 5,summaryTime: "2019-05-07",type: 0
          },
          {
            channel: "百度",clientPlatform: null,createTime: "2019-05-08 12:00:05",hitSection: null,
            id: 25714,ipCount: 31,ipSingle: 2,qualityScore: 4,summaryTime: "2019-05-07",type: 0
          },
         
          {
            channel: "百度",clientPlatform: null,createTime: "2019-05-07 14:47:57",hitSection: null,
            id: 25565,ipCount: 35,ipSingle: 12,qualityScore: 3,summaryTime: "2019-05-06",type: 0
          },
          {
            channel: "百度",clientPlatform: null,createTime: "2019-05-07 14:47:57",hitSection: null,
            id: 25565,ipCount: 30,ipSingle: 20,qualityScore: 8,summaryTime: "2019-05-06",type: 0
          },
        ],
        [ 
          {
            channel: "微博",clientPlatform: null,createTime: "2019-05-08 12:00:05",hitSection: null,
            id: 25714,ipCount: 36,ipSingle: 2,qualityScore: 9,summaryTime: "2019-05-07",type: 0
          },
          {
            channel: "微博",clientPlatform: null,createTime: "2019-05-08 11:42:11",hitSection: null,
            id: 25640,ipCount: 13,ipSingle: 14,qualityScore: 10,summaryTime: "2019-05-08",type: 0
          },
          {
            channel: "微博",clientPlatform: null,createTime: "2019-05-08 12:00:05",hitSection: null,
            id: 25714,ipCount: 22,ipSingle: 21,qualityScore: 12,summaryTime: "2019-05-07",type: 0
          },
          {
            channel: "微博",clientPlatform: null,createTime: "2019-05-08 11:42:11",hitSection: null,
            id: 25640,ipCount: 13,ipSingle: 15,qualityScore: 19,summaryTime: "2019-05-08",type: 0
          },
        ],
      ],
      sutList:[
        [//接口返回的参数
          {
            channel: "google",clientPlatform: null,createTime: "2019-05-08 12:00:05",hitSection: null,
            id: 25714,ipCount: 30,ipSingle: 2,qualityScore: 6,summaryTime: "2019-05-07",type: 0
          },
         
          {
            channel: "google",clientPlatform: null,createTime: "2019-05-07 14:47:57",hitSection: null,
            id: 25565,ipCount: 32,ipSingle: 10,qualityScore: 7,summaryTime: "2019-05-07",type: 0
          },
        ],
        [ 
          {
            channel: "百度",clientPlatform: null,createTime: "2019-05-08 12:00:05",hitSection: null,
            id: 25714,ipCount: 31,ipSingle: 1,qualityScore:8,summaryTime: "2019-05-07",type: 0
          },
          
          {
            channel: "百度",clientPlatform: null,createTime: "2019-05-07 14:47:57",hitSection: null,
            id: 25565,ipCount: 34,ipSingle: 3,qualityScore: 5,summaryTime: "2019-05-07",type: 0
          },
          {
            channel: "百度",clientPlatform: null,createTime: "2019-05-08 12:00:05",hitSection: null,
            id: 25714,ipCount: 31,ipSingle: 2,qualityScore: 4,summaryTime: "2019-05-07",type: 0
          },
         
          {
            channel: "百度",clientPlatform: null,createTime: "2019-05-07 14:47:57",hitSection: null,
            id: 25565,ipCount: 35,ipSingle: 12,qualityScore: 3,summaryTime: "2019-05-06",type: 0
          },
          {
            channel: "百度",clientPlatform: null,createTime: "2019-05-07 14:47:57",hitSection: null,
            id: 25565,ipCount: 30,ipSingle: 20,qualityScore: 8,summaryTime: "2019-05-06",type: 0
          },
        ],
        [ 
          {
            channel: "微博",clientPlatform: null,createTime: "2019-05-08 12:00:05",hitSection: null,
            id: 25714,ipCount: 36,ipSingle: 2,qualityScore: 9,summaryTime: "2019-05-07",type: 0
          },
          {
            channel: "微博",clientPlatform: null,createTime: "2019-05-08 11:42:11",hitSection: null,
            id: 25640,ipCount: 13,ipSingle: 14,qualityScore: 10,summaryTime: "2019-05-08",type: 0
          },
          {
            channel: "微博",clientPlatform: null,createTime: "2019-05-08 12:00:05",hitSection: null,
            id: 25714,ipCount: 22,ipSingle: 21,qualityScore: 12,summaryTime: "2019-05-07",type: 0
          },
          {
            channel: "微博",clientPlatform: null,createTime: "2019-05-08 11:42:11",hitSection: null,
            id: 25640,ipCount: 13,ipSingle: 15,qualityScore: 19,summaryTime: "2019-05-08",type: 0
          },
        ],
      ],
    }
  },
  methods: {
    change(ev){
      //console.log(ev);
      var newArr = this.sutList.flat();//变成一维数组
      this.totalList =[];
      for(let i =0;i<ev.length;i++){
        newArr.forEach((item,index) => {
            if(ev[i]==item.channel){
              this.totalList.push(item)
            }
        })
      }
      //console.log(this.totalList)
    }
  }
}
</script>

<style scoped>
.chart-container{
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
</style>

