<template>
  <el-form-item v-if="info.list" :label="info.list[0].widgetName">
    <template v-for="(i,num) in info.list">
      <!-- 下拉框 com001 -->
      <el-select style="width:150px;margin-right:10px;" v-if='i.widgetTemplateCode === "com001"||i.widgetTemplateCode === "com002"' :multiple="i.widgetTemplateCode === 'com002'" v-model="i.value" @change="(val)=>{selectTap(val,num,i.widgetIsNext)}">
        <el-option v-for="item in parse(i.widgetValues)" :key="item.key" :label="item.value" :value="item.key">
        </el-option>
      </el-select>
      <!-- 输入框 com003 -->
      <el-input style="width:80px;margin-right:10px;" @blur="(event)=>{inputB(event,num)}" v-else-if='i.widgetTemplateCode === "com003"||i.widgetTemplateCode === "com013"' type="text" v-model="i.value"></el-input>
      <el-input style="width:80px;margin-right:10px;" @blur="(event)=>{inputB(event,num)}" v-if='i.widgetTemplateCode === "com013"' type="text" v-model="i.value2"></el-input>
      <!-- 搜索输入框 com005-->
      <el-select v-else-if='i.widgetTemplateCode === "com005"' @change="(val)=>{getvalue(val,num,'search')}" v-model="i.value" autocomplete multiple filterable remote placeholder="请输入关键词" :remote-method="(val)=>{remoteMethod(val,num)}" :loading="loading">
        <el-option v-if="item.cityid" v-for="(item,number) in parse(i.widgetValues)" :key="number+1" :label="item.city" :value="item.cityid">
        </el-option>
      </el-select>
      <!-- 请求接口下拉 多选框 com007 -->
      <el-select style="min-width:0px;margin-right:10px;" v-if='i.widgetTemplateCode === "com007"'  multiple v-model="i.value" @change="(val)=>{getvalue(val,num)}">
        <el-option v-for="item in i.widgetValues" :key="item.umgId" :label="item.umgName" :value="item.umgId">
        </el-option>
      </el-select>
      <!-- 时间选择 com008-->
      <el-date-picker v-else-if='i.widgetTemplateCode === "com008"' @change="(val)=>{getvalue(val,num)}" v-model="i.value" value-format="yyyy-MM-dd" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
      </el-date-picker>
    </template>
  </el-form-item>
</template>
  
<script>
import { formdata } from "../../../../../libs/formdata.js";
import { isArray } from "util";
export default {
  data() {
    return {
      content: {},
      loading: false, //城市搜索
      cityvalue: "",
      widgetValues: []
    };
  },
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    // 解析字符串
    parse(val) {
      let data = JSON.parse(val);
      if (data[0].key === "字段名") {
        data = [
          {
            city: "",
            cityId: "",
            cityid: "",
            fatherid: ""
          }
        ];
      }
      return data;
    },
    // 请求接口
    getHttp(url, index) {
      this.$httpAuth
        .post("gm/getMemberGradeAll", {
          mallId: 1,
          pageNum: null, //类型：String  必有字段  备注：无
          pageSize: null
        })
        .then(result => {
          if (result.data.code === 10000) {
            this.info.list[index + 1].widgetValues = result.data.resp;
          }
        })
        .catch(err => {});
    },
    // 选择条件
    selectTap(val, index, next) {
      // console.log(val, index, next);
      if (next) {
        // 有下一个组件就请求接口
        let formData = formdata({ screeningWidgetFieldKey: val });
        this.$xwhttpAuth
          .post("mall/getScreeningChainDetail", formData)
          .then(result => {
            if (result.data.code === 10000) {
              let resp = result.data.resp;
              let number = this.info.list.length - 1 - index;
              this.info.list.splice(index + 1, number); //先删除下拉框后面的组件，等视图更新在增加一条数据上去
              // 插入筛选条件组件
              this.$nextTick(() => {
                //不等视图更新插入数据 下拉框和可搜索下拉框有冲突  视图更新插入组件
                this.info.list.push(resp.widget);
                if (
                  resp.widget.widgetSourceFlag === 1 &&
                  resp.widget.widgetTemplateCode === "com007"
                ) {
                  // 需要请求接口
                  let urlarr = JSON.parse(resp.widget.widgetParam);
                  this.getHttp(urlarr[0].value, index);
                }
              });
              let data = {};
              if (resp.screeningColumnKey !== "null") {
                data.key = resp.screeningColumnKey;
                this.info.list.key = resp.screeningColumnKey;
              };
              if (resp.screeningComputeCharacter !== "null") {
                data.compute = resp.screeningComputeCharacter;
              }
              // 保存数据
              this.$emit("keepdata", data,this.info.list);
            }
          })
          .catch(err => {});
      } else {
        let value = val;
        if (Array.isArray(val)) {
          value = val.join(",");
        }
        this.$emit("keepdata", { value: value },this.info.list);
      }
    },
    // 输入框
    inputB(e, index) {
      let arr = [];
      let value =this.info.list[index].value;
      let value2 =this.info.list[index].value2;
      if (value) {
        arr.push(value);
      }
      let str = true;
      if (value2) {
        if(+value>=+value2){
          this.$message({
            message: '第一个区间不能大于第二个区间',
            type: 'warning'
          });
          this.info.list[index].value = '';
          this.info.list[index].value2 = '';
          str = false;
        }
        arr.push(value2);
      }
      if(str){
        this.$emit("keepdata", {
                value: arr.join(",")
              },this.info.list);
      }
    },
    // 获取下拉框的值
    getvalue(val, index,search) {
      let widgetValues = JSON.parse(this.info.list[index].widgetValues);
      let arr =[{}];
      val.forEach(value=>{
        widgetValues.some(item=>{
          if(value==item.cityid){
            arr.push(item);
            return value==item.cityid;
          }
        })
      })
      this.info.list[index].widgetValues = JSON.stringify(arr);
      // console.log(arr)
      this.$emit("keepdata", {
        value: val.join(",")
      },this.info.list);
    },
    // 城市搜索
    remoteMethod(word, index) {
      if (word) {
        this.loading = true;
        let formData = formdata({ cityName: word });
        this.$xwhttpAuth
          .post("mall/getCityByName", formData)
          .then(result => {
            if (result.data.code === 10000) {
              let arr;
              let widgetValues = JSON.parse(this.info.list[index].widgetValues);
              if(widgetValues[0].key){
                  arr =[]
              }else{
                arr = widgetValues;
              }
              // console.log(arr)
              result.data.resp.forEach(element => {
                arr.push(element);
              });
              this.info.list[index].widgetValues = JSON.stringify(arr);
              this.loading = false;
              console.log(arr)
            }
          })
          .catch(err => {});
      }
    }
  }
};
</script>
  
<style scoped>
</style>