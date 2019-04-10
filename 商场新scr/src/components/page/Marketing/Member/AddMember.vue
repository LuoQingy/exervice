<template>
  <div>
    <div v-if="!isaddactive" style="margin-bottom: 20px;">
      <el-breadcrumb separator="/" class="content_title">
        <el-breadcrumb-item :to="{ path: '/marketing/member' }">会员分组</el-breadcrumb-item>
        <el-breadcrumb-item>新增分组</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="info">
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <div v-if="!isaddactive">
          <p>分组内容</p>
          <div class="input_list">
            <el-form-item label="分组名称" prop="name" style="margin-bottom:30px;">
              <el-input class="input" v-model="form.name" maxlength="20">
                <span slot="suffix">{{form.name.length}}/20</span>
              </el-input>
            </el-form-item>
            <el-form-item label="分组简介">
              <el-input class="input" v-model="form.details" maxlength="40">
                <span slot="suffix">{{form.details.length}}/40</span>
              </el-input>
            </el-form-item>
            <el-form-item>
              <div v-if="mgId&&!isedit">
                <el-button class="surebtn" type="primary" @click="sureTap('form')">确定</el-button>
              </div>
            </el-form-item>
          </div>
        </div>
        <div class="rules">
          <div style="margin-bottom:20px;" v-if="!isaddactive">
            <el-breadcrumb separator="/" class="content_title">
              <el-breadcrumb-item>人群筛选器</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div v-if="isedit">
            <div class="rules_title" v-if="isinit">
              <span>筛选条件</span>
              <!-- 选择按钮 -->
              <BtnGroup @updata="updata"></BtnGroup>
            </div>
            <div v-else>
              <div class="select_box">
                <span style="width:70px; height: 50px;line-height: 50px;">筛选条件</span>
                <div style="flex:1">
                  <div style="margin:30px 0;">
                    <el-form-item label="消费时间段" label-width="90px">
                      <el-select v-model="form.mgSpendingTime" style="width:150px;">
                        <template v-for="item in mgSpendingTimes">
                          <el-option :label="item.label" :value="item.type"></el-option>
                        </template>
                      </el-select>
                    </el-form-item>
                  </div>
                  <template v-for="(items,indexs) in Condition">
                    <div class="select">
                      <!-- 筛选条件 选择器 -->
                      <BasicInfo :info="items" @keepdata="(data,list) => {keepdata(data,list,indexs)}"></BasicInfo>
                      <i class="el-icon-close" @click="deland(indexs)"></i>
                    </div>
                    <div class="or_list" v-if="items.orlist">
                      <template v-for="(item,index) in items.orlist">
                        <p class="title">或者</p>
                        <div class="select">
                          <!-- 筛选条件 选择器 -->
                          <BasicInfo :info="item" @keepdata="(data,list) => {keepdata(data,list,indexs,index)}"></BasicInfo>
                          <i class="el-icon-close" @click="delor(indexs,index)"></i>
                        </div>
                      </template>
                    </div>
                    <div class="or_title" v-if="!items.orlist||items.orlist.length<2">
                      <span>或者</span>
                      <!-- 选择按钮 -->
                      <BtnGroup @updata="updata" btntype="or" :index="indexs"></BtnGroup>
                    </div>
                    <div class="an_title" v-if="indexs<4">
                      <span>并且</span>
                      <!-- 选择按钮 -->
                      <BtnGroup v-if="indexs === Condition.length-1" @updata="updata" btntype="and"></BtnGroup>
                    </div>
                  </template>
                  <div v-if="!isaddactive">
                    <el-button class="surebtn" type="primary" @click="sureTap('form')">确定</el-button>
                    <el-button class="surebtn" v-if="mgId" type="primary" @click="isedit =false">取消</el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="detalis">
            <p class="mgSearchChinese">
              <span>{{this.mgSearchChinese}}</span>
              <i class="el-icon-edit" @click="edit"></i>
            </p>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>
  
<script>
import { formdata } from "../../../../libs/formdata.js";
import BtnGroup from "./Components/BtnGroup";
import BasicInfo from "./Components/BasicInfo";
import bus from "@/components/common/bus.js";
import { specailTest } from "@/libs/regular.js";
export default {
  components: {
    BtnGroup,
    BasicInfo
  },
  props: {
    isaddactive: {
      //是否在添加智能营销页面调用
      type: Boolean,
      default: false
    },
    details: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    var name = (rules, val, callback) => {
      if (specailTest(val)) {
        callback(new Error("分组名称不能包含特殊字符和空格"));
      } else {
        callback();
      }
    };
    return {
      mgId: "",
      mgSearchChinese: "",
      isedit: true,
      form: {
        name: "",
        details: "",
        mgSpendingTime: 0
      },
      rules: {
        name: [
          {
            validator: name,
            trigger: "blur"
          },
          { required: true, message: "请输入分组名称", trigger: "blur" }
        ]
      },
      isinit: true, //基础筛选
      Condition: [], //可筛选的条件
      mgEchoText: [], //选择的全部数据，到时用来做查看的详情的
      datalist: [], //选中的条件
      mgSpendingTimes: [
        //0 = 不限制 / 7 = 7天内 / 30 = 30天内 / 90 = 90天内 / 180 = 180天内
        { type: 0, label: "不限制" },
        { type: 7, label: "7天内" },
        { type: 30, label: "30天内" },
        { type: 90, label: "90天内" },
        { type: 180, label: "180天内" }
      ],
      mgSearchCondition: {
        type: "and",
        list: []
      } //筛选的条件
    };
  },
  watch: {
    details(val) {
      // this.mgSearchChinese = val;
      // this.isedit = false;
      let mgEchoText = JSON.parse(val.mgEchoText);
      this.form.name = val.mgName;
      this.form.details = val.mgIntro;
      this.form.mgSpendingTime = val.mgSpendingTime;
      this.mgSearchChinese = val.mgSearchChinese;
      this.Condition = mgEchoText.Condition;
      this.datalist = mgEchoText.datalist;
      this.isedit = false;
    }
  },
  created() {
    this.mgId = this.$route.query.mgId;
    if (this.mgId) {
      this.getMembersGroupInfo();
    }
  },
  methods: {
    // 改变刷选的条件
    updata(val, type, index) {
      // console.log(val);
      // console.log(type);
      // console.log(index);
      if (type === "base" || type === "and") {
        // 增加并且
        // console.log("添加并且");
        let data = { list: [] };
        data.list.push(val);
        this.Condition.push(data);
        this.datalist.push({ data: [] }); //
      } else if (type === "or" && index !== null) {
        // 增加或者
        if (!this.Condition[index].orlist) {
          // 再次添加或者
          let data = { list: this.Condition[index].list, orlist: [] };
          data.orlist.push({ list: [val] });
          this.Condition.splice(index, 1, data);
          // this.datalist.push({});
          this.datalist[index].data.push({});
        } else {
          // 第一次添加或者
          let data = { list: [val] };
          this.Condition[index].orlist.push(data);
          this.datalist[index].data.push({});
        }
      } else {
        console.error("BtnGroup type, index is notfined");
      }
      this.isinit = false;
    },
    // 获取数据 保存起来
    keepdata(data, list, indexs, index) {
      // console.log(data)
      // console.log(indexs);
      // console.log(index);
      if (data && indexs !== undefined && index === undefined) {
        if (data.key) {
          // 清空数据再添加
          this.datalist[indexs].compute && delete this.datalist[indexs].compute;
          this.datalist[indexs].value && delete this.datalist[indexs].value;
        } else if (data.compute) {
          // 清空数据再添加
          this.datalist[indexs].value && delete this.datalist[indexs].value;
        }
        this.datalist[indexs] = { ...this.datalist[indexs], ...data };
      } else if (data && indexs !== undefined && index !== undefined) {
        if (data.key) {
          // 清空数据再添加
          this.datalist[indexs].data[index].compute &&
            delete this.datalist[indexs].data[index].compute;
          this.datalist[indexs].data[index].value &&
            delete this.datalist[indexs].data[index].value;
        } else if (data.compute) {
          // 清空数据再添加
          this.datalist[indexs].data[index].value &&
            delete this.datalist[indexs].data[index].value;
        }
        this.datalist[indexs].data[index] = {
          ...this.datalist[indexs].data[index],
          ...data
        };
      }
    },
    // 确定
    sureTap(formName) {
      console.log("分组", this.$refs[formName]);
      this.$refs[formName].validate(valid => {
        if (valid) {
          let total = 0;
          let alldatalist = true;
          let alldata = true;
          // 筛选条件判断
          this.datalist.forEach((val, index) => {
            if (!val.value && val.value != 0) {
              this.$message({
                message: "请完善筛选条件",
                type: "warning"
              });
              alldatalist = false;
              return;
            }
            this.mgSearchCondition.list.push({
              type: "or",
              list: [{ type: "data", data: val }]
            });
            val.data.forEach(value => {
              // console.log(!value.value && value.value != 0);
              if (!value.value && value.value != 0) {
                this.$message({
                  message: "请完善筛选条件",
                  type: "warning"
                });
                alldata = false;
                return;
              }
              this.mgSearchCondition.list[index].list.push({
                type: "data",
                data: value
              });
              total += 1;
            });
            total += 1;
          });
          if (!alldata || !alldatalist) {
            return;
          }
          let url;
          let data = {
            mgName: this.form.name, //类型：String  必有字段  备注：名称
            mgIntro: this.form.details, //类型：String  可有字段  备注：简介
            mgSearchCondition: JSON.stringify(this.mgSearchCondition), //类型：String  必有字段  备注：筛选条件json
            mgSearchNum: total, //类型：Number  必有字段  备注：筛选条件x项
            mgSpendingTime: this.form.mgSpendingTime, //类型：String  必有字段  备注：0 = 不限制 / 7 = 7天内 / 30 = 30天内 / 90 = 90天内 / 180 = 180天内
            mgEchoText: JSON.stringify({
              Condition: this.Condition,
              datalist: this.datalist
            }) //类型：String  必有字段  备注：回显
          };

          // 判断是否父组件调用
          if (this.isaddactive) {
            data.mgIntro = "智能营销会员分组";
            this.$store.commit("changAllMemberGroup", true);
            this.$store.commit("changActiveMemberGroup", data);
            return;
          }
          if (this.mgId || this.mgId == 0) {
            url = "mall/updateMembersGroup";
            data.mgId = this.mgId;
          } else {
            url = "/mall/addMembersGroup";
          }
          this.$httpAuth
            .post(url, data)
            .then(result => {
              if (result.data.code === 10000) {
                this.$message({
                  message: result.data.msg,
                  type: "success"
                });
                this.$router.push({
                  path: "/marketing/member"
                });
              } else {
                this.$message({
                  message: result.data.msg,
                  type: "warning"
                });
              }
            })
            .catch(err => {});
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 删除并且
    deland(indexs) {
      if (this.Condition.length === 1) {
        this.isinit = true;
      }
      this.datalist.splice(indexs, 1);
      this.Condition.splice(indexs, 1);
    },
    // 删除或者
    delor(indexs, index) {
      this.datalist[indexs].data.splice(index, 1);
      this.Condition[indexs].orlist.splice(index, 1);
    },
    // 获取分组详情
    getMembersGroupInfo() {
      this.$httpAuth
        .post("/mall/getMembersGroupInfo", {
          mgId: this.mgId
        })
        .then(res => {
          if (res.data.code === 10000) {
            let mgEchoText = JSON.parse(res.data.resp.mgEchoText);
            this.form.name = res.data.resp.mgName;
            this.form.details = res.data.resp.mgIntro;
            this.form.mgSpendingTime = res.data.resp.mgSpendingTime;
            this.mgSearchChinese = res.data.resp.mgSearchChinese;
            this.Condition = mgEchoText.Condition;
            this.datalist = mgEchoText.datalist;
            this.isedit = false;
          }
        });
    },
    // 编辑修改
    edit() {
      this.isedit = true;
      this.isinit = false;
    }
  },
  mounted() {
    // 父组件触发
    bus.$on("init", () => {
      this.isinit = true;
      this.Condition = [];
      this.datalist = [];
    });
    // 父组件选择人群筛选器 保存时触发
    bus.$on("MenberCreatePlan", () => {
      // console.log('父组件点击保存')
      this.sureTap("form");
    });
  },
  destroy() {
    bus.$off();
  },
  filters: {
    getcomponnet(val) {
      // console.log(val);
      switch (val) {
        case 1:
          return "Consume";
          break;
        case 2:
          return "Consume";
          break;
        case 3:
          return "Consume";
          break;
        default:
          return "";
          break;
      }
    }
  }
};
</script>
  
<style scoped lang="less">
.info {
  padding-left: 40px;
  padding-bottom: 30px;
  .input_list {
    padding-left: 70px;
    margin: 50px 0;
    .input {
      width: 300px;
    }
  }
  .rules {
    .rules_title {
      display: flex;
    }
    .detalis {
      padding: 20px;
      .mgSearchChinese {
        background: #f2f3f4;
        padding: 20px 40px;
      }
    }
  }
  .select_box {
    display: flex;
    .select {
      flex: 1;
      display: flex;
      position: relative;
      background: #f2f2f2;
      padding: 10px 0;
      align-items: center;
      border-left: 8px solid #0099ff;
    }
    .select /deep/ .el-form-item {
      display: flex;
      align-items: center;
    }
    .select /deep/ .el-form-item .el-form-item__content {
      margin-left: 0 !important;
    }
    .or_title {
      display: flex;
      height: 50px;
      align-items: center;
      border-left: 8px solid #0099ff;
      padding-left: 10px;
      .btn_list {
        padding-left: 20px;
      }
    }
    .or_list {
      border-left: 8px solid #0099ff;
      .select {
        border: none;
      }
      .title {
        height: 30px;
        line-height: 30px;
        background: #ffffff;
        padding-left: 10px;
      }
    }
    .an_title {
      display: flex;
      height: 40px;
      align-items: center;
      .btn_list {
        padding-left: 20px;
      }
    }
  }
}

.surebtn {
  margin-top: 40px;
}
.el-form-item--small.el-form-item {
  margin-bottom: 0;
}
.el-form-item {
  margin-bottom: 0;
}
.el-icon-close {
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  font-weight: bolder;
  position: absolute;
  top: 10px;
  right: 0;
}
</style>