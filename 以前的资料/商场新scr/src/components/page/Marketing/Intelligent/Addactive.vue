<template>
  <div>
    <el-form ref="planform" class="form" :rules="planrules" :model="planform" label-width="100px">
      <div class="condition">
        <!-- 内容设置 -->
        <div class="plan">
          <el-breadcrumb separator="/" class="content_title">
            <el-breadcrumb-item>计划内容设置</el-breadcrumb-item>
          </el-breadcrumb>

          <div class="plan_form">
            <el-form-item label="计划名称:" prop="planName">
              <el-input type="text" v-model="planform.planName" style="width:300px;" maxlength="9">
                <template slot="suffix">{{planform.planName.length}}/9</template>
              </el-input>
            </el-form-item>
            <el-form-item label="时效" prop="time">
              <el-radio-group v-model="effectType">
                <el-radio :label="1">实时</el-radio>
                <el-radio :label="2">每天</el-radio>
                <el-time-picker
                  v-if="effectType === 2"
                  style="margin:0 10px;"
                  @change="(val)=>{effectEverydayTimetest(val,2)}"
                  v-model="planform.effectEverydayTime"
                  value-format="HH:mm:ss"
                  size="mini"
                ></el-time-picker>
                <el-radio :label="3">指定时间</el-radio>
                <el-date-picker
                  v-model="planform.effectSpecifiedTime"
                  v-if="effectType===3"
                  @change="(val)=>{effectEverydayTimetest(val,3)}"
                  type="datetime"
                  placeholder="选择日期时间"
                  size="mini"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="effectType ===1" label="触发行为:" prop="orderStatus">
              <el-select v-model="planform.tbId" style="width:300px;">
                <el-option v-for="item in TriggeredBehavior" :key="item.tbId" :label="item.tbName" :value="item.tbId"></el-option>
              </el-select>
            </el-form-item>
            <div v-if="effectType ===2" class="everyday">
              <p class="everyday_title">常用场景 选填，勾选后生效</p>
              <div class="day">
                <div class="list">
                  <el-form-item style="display:flex;align-items: center;" label-width="0px">
                    <el-radio v-model="sceneType" label="1">会员生日前</el-radio>
                  </el-form-item>
                  <el-form-item style="display:flex;align-items: center;" label-width="0px">
                    <el-radio v-model="sceneType" label="2">关注时长超过</el-radio>
                  </el-form-item>
                  <el-form-item style="display:flex;align-items: center;" label-width="0px">
                    <el-radio v-model="sceneType" label="3">最近消费间隔</el-radio>
                  </el-form-item>
                </div>
                <div class="list">
                  <el-form-item label-width="0px" prop="sceneDay" style="display:flex;align-items: center;">
                    <el-input-number v-model="planform.sceneDay" :disabled="sceneType!='1'" controls-position="right" :min="0"></el-input-number>天
                  </el-form-item>
                  <el-form-item label-width="0px" prop="sceneDay" style="display:flex;align-items: center;">
                    <el-input-number v-model="planform.sceneDay" :disabled="sceneType!='2'" controls-position="right" :min="0"></el-input-number>天
                  </el-form-item>
                  <el-form-item label-width="0px" prop="sceneDay" style="display:flex;align-items: center;">
                    <el-input-number v-model="planform.sceneDay" :disabled="sceneType!='3'" controls-position="right" :min="0"></el-input-number>天
                  </el-form-item>
                </div>
                <!-- <div class="list">
                  <el-form-item label="推送" prop="input1">
                    <el-input-number v-model="planform.input1" style="width:100px" controls-position="right" :min="0"></el-input-number>次
                  </el-form-item>
                </div>-->
              </div>
            </div>
          </div>
        </div>
        <!-- 适用人群 -->
        <div class="person">
          <el-breadcrumb separator="/" class="content_title">
            <el-breadcrumb-item>适用人群</el-breadcrumb-item>
          </el-breadcrumb>
          <div>
            <div class="person_list">
              <el-radio v-model="condition" @change="rediochang" label="1">选择分组</el-radio>
              <el-select v-model="planform.mgId" style="width:200px;margin-left:10px;">
                <el-option v-for="item in groupList" :key="item.mgId" :label="item.mgName" :value="item.mgId"></el-option>
              </el-select>
            </div>
            <div class="person_list">
              <el-radio v-model="condition" @change="rediochang" label="2">
                <!-- 占位元素 -->
                <span style="display:none;"></span>
              </el-radio>
              <AddMember class="AddMember" :isaddactive="true" :details="mgSearchChinese" @senddata="getdata"></AddMember>
            </div>
          </div>
        </div>
      </div>
      <div class="marketing">
        <div class="chek_mar">
          <el-breadcrumb separator="/" class="content_title">
            <el-breadcrumb-item>营销方式</el-breadcrumb-item>
          </el-breadcrumb>
          <div>
            <div class="radio-group">
              <el-radio-group v-model="marketingType" @change="marketingTypeChang">
                <el-radio :label="1">短信营销</el-radio>
                <el-radio :label="2">卡券营销</el-radio>
              </el-radio-group>
            </div>
            <div class="message" v-if="marketingType===1">
              <p class="input">
                选择短信模板(共{{total}}条)
                <el-input
                  style="width:200px;margin-left:10px;"
                  size="mini"
                  v-model="message"
                  type="text"
                  placeholder="请输入标题"
                  @keyup.enter.native="marketingPlanBySmsAll('enter')"
                ></el-input>
              </p>
              <div class="table">
                <el-table :data="tableData" style="width: 100%" :header-cell-style="headerstyle">
                  <el-table-column label="模板名称" width="220">
                    <template slot-scope="scope">
                      <el-radio v-model="marketingTypeId" :label="scope.row.stId">{{scope.row.stName}}</el-radio>
                    </template>
                  </el-table-column>
                  <el-table-column label="模板类型" width="220">
                    <template slot-scope="scope">
                      <span v-if="scope.row.stType===1">普通短信</span>
                      
                      <span v-else-if="scope.row.stType===2">营销短信</span>
                      
                      <span v-else-if="scope.row.stType===3">验证码短信</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="stContent" label="模板内容"></el-table-column>
                </el-table>
                <div class="pagination">
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="pageSize"
                    background
                    layout="total, sizes, prev, pager, next"
                    :total="total"
                  ></el-pagination>
                </div>
              </div>
            </div>
            <AddVoucher v-else :isaddactive="true" @getcoupon="getcoupon" :couid="couid"></AddVoucher>
          </div>
        </div>
      </div>
      <div class="btn_list">
        <el-button type="primary" @click="createMarketingPlan('planform')">保存</el-button>
        <el-button type="primary" @click="goback">返回</el-button>
      </div>
    </el-form>
  </div>
</template>
  
<script>
import AddMember from "../Member/AddMember";
import AddVoucher from "../VoucherCenter/AddVoucher";
import bus from "@/components/common/bus.js";
import { rules } from "./rules.js";
import { mapState } from "vuex";
export default {
  components: {
    AddMember,
    AddVoucher
  },
  data() {
    return {
      mpId: "",
      couid: 0, //修改智能营销时的id
      effectType: 1, //时效类型：1=实时 2=每天 3=指定时间
      sceneType: "1", //常用场景：1=会员生日前N天 2=关注时长超过N天 3=最近消费间隔N天
      condition: "1", //选择人群筛选 还是已有的分组
      marketingType: 1, //营销方式：1=短信营销 2=卡券营销
      marketingTypeId: "", //类型：Number  必有字段  备注：营销方式对应的ID(短信模板或优惠券的ID）
      planform: {
        planName: "", //计划名称
        tbId: "", //触发行为ID（时效类型为1时生效）
        effectEverydayTime: "09:00:00", //每天的时间（时效类型为2时生效）
        effectSpecifiedTime: "", //指定时间（时效类型为3时生效）
        sceneDay: 0, //对应日常场景的天数
        input1: "1", //推送次数
        mgId: "" //人群分组ID
      },
      TriggeredBehavior: [], //触发行为
      groupList: [], //人群分组
      tableData: [], //短信营销列表
      mgSearchChinese: {}, //筛选详情
      message: "", //短信名称查询
      planrules: rules(this), //表单验证规则
      currentPage: 1,
      pageSize: 5,
      total: 10
    };
  },
  computed: {
    ...mapState(["AllMemberGroup", "AllCoupon"])
  },
  created() {
    // console.log(this.$route.query.mpId);
    let mpId = this.$route.query.mpId;
    if (mpId) {
      this.mpId = mpId;
    }
    this.getTriggeredBehavior();
    this.getMembersGroupList();
    this.marketingPlanBySmsAll();
  },

  methods: {
    // 表格头部样式
    headerstyle({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0 && columnIndex === 0) {
        return "background: #f2f3f7;padding-left:30px;";
      } else {
        return "background: #f2f3f7;";
      }
    },
    // 获取智能营销详情
    marketingPlanById() {
      this.$httpAuth
        .post("mall/marketingPlanById", {
          mpId: this.mpId
        })
        .then(result => {
          if (result.data.code === 10000) {
            let data = result.data.resp;
            let effectEverydayTime = "";
            let mgType = data.memberGroup.mgType;
            this.planform.planName = data.planName;
            if (data.effectEverydayTime) {
              effectEverydayTime = data.effectEverydayTime.split(" ")[1];
            }

            // 获取筛选详情
            if (mgType === 2) {
              this.mgSearchChinese = data.memberGroup;
              // this.getdata({ isedit: true, ...data.memberGroup });
            } else {
              this.planform.mgId = data.mgId;
            }
            // 获取卡券详情
            if (data.marketingType === 2) {
              this.couid = data.marketingTypeId;
            }
            this.effectType = data.effectType;
            this.sceneType = data.sceneType ? data.sceneType.toString() : "1";
            this.planform.tbId = data.tbId ? data.tbId : this.planform.tbId;
            this.planform.effectEverydayTime = effectEverydayTime;
            this.planform.effectSpecifiedTime = data.effectSpecifiedTime
              ? data.effectSpecifiedTime
              : "";
            this.planform.sceneDay = data.sceneDay ? data.sceneDay : 0;
            this.condition = data.memberGroup.mgType.toString();
            this.marketingType = data.marketingType;
            this.marketingTypeId = data.marketingTypeId
              ? data.marketingTypeId
              : this.marketingTypeId;
          }
        })
        .catch(err => {});
    },
    // 确认新建智能营销方式
    createMarketingPlan(planform) {
      this.$refs[planform].validate(vilid => {
        if (vilid) {
          let effectEverydayTime = this.planform.effectEverydayTime;
          let effectSpecifiedTime = this.planform.effectSpecifiedTime;
          if (
            this.effectEverydayTimetest(effectEverydayTime, 2) &&
            this.effectEverydayTimetest(effectSpecifiedTime, 3)
          ) {
            // 修改上传的effectEverydayTime 格式  改为 2018-15-5 10:10:00
            let dataTime = new Date();
            var y = dataTime.getFullYear();
            var m = dataTime.getMonth() + 1;
            m = m < 10 ? "0" + m : m;
            var d = dataTime.getDate();
            d = d < 10 ? "0" + d : d;
            effectEverydayTime = `${y}-${m}-${d} ${effectEverydayTime}`;
          } else {
            return false;
          }
          // 判断是否用人群筛选器
          if (this.condition === "2") {
            bus.$emit("MenberCreatePlan");
          }
          // 判断是否未卡券营销
          if (this.marketingType == 2) {
            bus.$emit("createPlan");
          }
          // return false;
          let url = "/mall/createMarketingPlan";
          if (this.mpId) {
            url = "/mall/modifyMarketingPlan";
          }
          // console.log('分组判断',this.AllMemberGroup)
          if (!this.AllMemberGroup || !this.AllCoupon) {
            return;
          } else if (this.AllMemberGroup) {
            let data = this.$store.state.activememberGroup;
            data.mgName = this.planform.planName;
            this.$store.commit("changActiveMemberGroup", data);
          }
          this.$httpAuth
            .post(url, {
              mpId: this.mpId ? this.mpId : null,
              planName: this.planform.planName, //类型：String  必有字段  备注：计划名称
              effectType: this.effectType, //类型：Number  必有字段  备注：时效类型：1=实时 2=每天 3=指定时间
              tbId: this.planform.tbId, //类型：Number  可有字段  备注：触发行为ID（时效类型为1时生效）
              effectEverydayTime: effectEverydayTime, //类型：String  可有字段  备注：每天的时间（时效类型为2时生效）
              effectSpecifiedTime: this.planform.effectSpecifiedTime, //类型：String  可有字段  备注：指定时间（时效类型为3时生效）
              sceneType: this.sceneType, //类型：Number  可有字段  备注：常用场景：1=会员生日前N天 2=关注时长超过N天 3=最近消费间隔N天
              sceneDay: this.planform.sceneDay, //类型：String  可有字段  备注：对应日常场景的天数
              mgId: this.condition === "1" ? this.planform.mgId : null, //类型：Number  可有字段  备注：适用人群ID
              memberGroup:
                this.condition === "2"
                  ? this.$store.state.activememberGroup
                  : null,
              marketingType: this.marketingType,
              marketingTypeId: this.marketingTypeId,
              coupon:
                this.marketingType == 2 ? this.$store.state.activecoupon : null
            })
            .then(result => {
              if (result.data.code === 10000) {
                this.$message({
                  message: result.data.resp,
                  type: "success"
                });
                bus.$emit("closetags");
                this.$router.push("/marketing/intelligentlist");
              } else {
                this.$message({
                  message: result.data.msg,
                  type: "warning"
                });
              }
            })
            .catch(err => {
              console.log(err.data.msg);
            });
        }
      });
    },
    // 时效时间验证
    effectEverydayTimetest(val, type) {
      if (!val && this.effectType === type) {
        this.$message({
          message: "请输入时间",

          type: "warning"
        });
        return false;
      } else {
        return true;
      }
    },
    //获取触发行为
    getTriggeredBehavior() {
      this.$httpAuth
        .post("/mall/getTriggeredBehavior")
        .then(result => {
          if (result.data.code === 10000) {
            this.TriggeredBehavior = result.data.resp; //触发行为
            this.planform.tbId = result.data.resp[0].tbId; //选择第一个触发行为
          }
        })
        .catch(err => {});
    },
    // 人群选择
    rediochang(val) {
      if (val === "1") {
        bus.$emit("init");
        this.$store.commit("changAllMemberGroup", true);
      } else {
        this.$store.commit("changAllMemberGroup", false);
      }
    },
    // 营销方式选择
    marketingTypeChang(val) {
      if (val === 1) {
        this.$store.commit("changAllCoupon", true);
      } else {
        this.$store.commit("changAllCoupon", false);
      }
    },
    // 获取人群分组
    getMembersGroupList() {
      this.$httpAuth
        .post("mall/getMembersGroupList", {
          pageNum: 1, //类型：String  可有字段  备注：页 默认1
          pageSize: 200 //类型：String  可有字段  备注：页数 默认20
        })
        .then(result => {
          if (result.data.code === 10000) {
            this.groupList = result.data.resp.list;
            this.planform.mgId = result.data.resp.list[0].mgId;
          }
        })
        .catch(err => {});
    },
    // 短信营销
    marketingPlanBySmsAll(enter) {
      if(enter){
        this.currentPage = 1;
      }
      this.$httpAuth
        .post("mall/selectMallSmsTemplateAll", {
          pageNum: this.currentPage, //类型：Number  必有字段  备注：无
          pageSize: this.pageSize,
          stName: this.message
        })
        .then(result => {
          if (result.data.code === 10000) {
            this.tableData = result.data.resp.list;
            this.total = result.data.resp.total;
            if (this.mpId && !enter) {
              this.marketingPlanById();
            } else {
              this.marketingTypeId = result.data.resp.list[0].stId;
            }
          }
        })
        .catch(err => {});
    },
    //获取人群筛选条件的数据
    getdata(data) {
      if (data.isedit) {
        // 是编辑状态改变 memberGroup的值
        this.memberGroup.mgName = "智能营销会员分组";
        this.memberGroup.mgIntro = this.planform.planName;
        this.memberGroup.mgSearchCondition = data.mgSearchCondition;
        this.memberGroup.mgSearchNum = data.mgSearchNum;
        this.memberGroup.mgSpendingTime = data.mgSpendingTime;
        this.memberGroup.mgEchoText = data.mgEchoText;
      }
    },
    // 获取卡券营销的数据
    getcoupon(data) {
      this.coupon = data;
    },
    // 取消
    goback() {
      bus.$emit("closetags");
      this.$router.push("/marketing/intelligentlist");
    },
    // 短信列表分页
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.marketingPlanBySmsAll('enter');
    },
    // 短信列表分页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.marketingPlanBySmsAll('enter');
    }
  }
};
</script>
  
<style scoped lang="less">
.content_title {
  padding-left: 20px;
}

.condition {
  background: #f1f3f6;
  padding: 10px;
  .plan {
    background: #ffffff;
  }
}

.plan_form {
  padding: 20px 0 50px 30px;
}

.everyday {
  .everyday_title {
    font-size: 14px;
    color: #606266;
    padding-left: 40px;
    margin-bottom: 10px;
  }
  .day {
    padding-left: 70px;
    display: flex;
    .list {
      display: flex;
      flex-direction: column;
      margin-right: 20px;
      height: 150px;
      justify-content: space-around;
      .input {
        margin: 0 10px;
        width: 30px;
        height: 30px;
        line-height: 30px;
        box-sizing: border-box;
        text-align: center;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
      }
    }
  }
}

.person {
  background: #ffffff;
  margin-top: 20px;
  .person_list {
    display: flex;
    align-items: center;
    padding: 10px;
    .menber {
      height: 50px;
      background: #f3f3f5;
      flex: 1;
    }
  }
}

.marketing {
  padding: 10px;
  background: #f1f2f6;
  margin-top: 20px;
  .chek_mar {
    background: #ffffff;
  }
  .radio-group {
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
  }
  .message {
    border: 2px solid #f1f2f6;
    margin: 0 20px;
    padding: 10px;
    padding-bottom: 0;
    .input {
      display: flex;
      align-items: center;
    }
    .table {
      margin-top: 10px;
    }
  }
}

.AddMember {
  flex: 1;
}

.person_list /deep/ .info {
  padding-left: 0;
  padding-bottom: 0;
}

.btn_list {
  text-align: center;
  padding: 20px;
}
</style>