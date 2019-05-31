<template>
  <div id="addActivity">
    <h3>{{activityOperation}}</h3>
    <div class="titlediv">
      <span>基本信息</span>
      <div class="titleline"></div>
    </div>
    <div id="addActivity">
      <div class="basic-infor">
        <div class="addActivity-content">
          <el-form label-width="120px" class="demo-ruleForm">
            <el-form-item label="券名称：" required>
              <div class="activity-name">
                <el-input style="width:150px;" size="small" placeholder="请填写券的名称" v-model="ruleForm.pcName"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="券logo：" required>
              <div>
                <!-- <upload @childByValue="childByValue" :ruleFormT="ruleForm" :imgurl="ruleForm.activityImageUrl"></upload> -->
                <elupload @uploadimg="upload" @delimg="delimg" :type="['jpg','png','gif']" :imglist="ruleForm.activityImageUrl"></elupload>
              </div>
              <p style="color:#999;">请上传品牌logo,文件格式png，jpg，jepg，gif,文件大小10M以内，建议尺寸120px*120px</p>
            </el-form-item>
            <el-form-item label="参与门店：" required>
              <div class="chooseShop">
                <div style="color:#64caf8;" v-if="storefromchild.length=='0'">
                  <span @click="dialogTableVisible = true">选择门店</span>
                </div>
                <div v-else>
                  <span>
                    已选择{{storefromchild.length}}家门店
                    <span @click="dialogTableVisible = true" style="color:#64caf8;">修改</span>
                  </span>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="抵扣时长" required>
              <el-input style="width:100px;" size="small" placeholder="请填写" v-model="ruleForm.pcDeductionDuration"></el-input>小时
            </el-form-item>
            <el-form-item label="领取后" required>
              <el-input style="width:100px;" size="small" placeholder="请填写" v-model="ruleForm.pcValidity"></el-input>小时内有效
            </el-form-item>
          </el-form>
        </div>

        <div class="titlediv">
          <span>规则设置</span>
          <div class="titleline"></div>
        </div>
        <div class="addActivity-content">
          <el-form label-width="120px" class="demo-ruleForm">
            <el-form-item label="每日发放上限：">
              <div class="activity-name">
                <el-input style="width:150px;" size="small" placeholder="不填写则为无上限" v-model="ruleForm.pcEverydayGrantRestrict"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="使用时段：">
              <el-select v-model="ruleForm.pcUserTime" style="width:360px;" placeholder="请选择">
                <el-option label="不限制" value="1"></el-option>
                <el-option label="指定每周使用时段" value="2"></el-option>
              </el-select>
              <div v-for="(item,index) in usedTimeOptions" :key="index" v-if="ruleForm.pcUserTime=='2'">
                <ul class="weekul" style="margin-top:10px;">
                  <el-checkbox-group v-model="item.tabdaylist" size="medium" @change="checkchang">
                    <el-checkbox-button
                      v-for="(title,num) in item.weekList"
                      :disabled="disabled(index,title.value)"
                      :label="title.value"
                      :key="title.day"
                    >周{{title.day}}</el-checkbox-button>
                  </el-checkbox-group>
                </ul>
                <div style="padding-top:10px;clear:both;">
                  <el-time-picker
                    is-range
                    v-model="item.usedDetailTime"
                    value-format="HH:mm:ss"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    placeholder="选择时间范围"
                  ></el-time-picker>
                  <span v-if="index!=0" style="color:#64caf8;font-size:14px;margin-left:20px;" @click="deleteweektime(index)">删除</span>
                  <span
                    style="color:#64caf8;font-size:14px;margin-left:10px;"
                    v-if="index==usedTimeOptions.length-1&&!adddisabled"
                    @click="setweektime(index)"
                  >添加</span>
                </div>
              </div>
              <div style="color:#999;">
                <i class="el-icon-info" style="color:#64caf8;margin-right:10px;"></i>最多设置5个时段
              </div>
            </el-form-item>
            <el-form-item label="领取限制：">
              <el-select v-model="ruleForm.pcGetRestrict" style="width:360px;" placeholder="请选择领取限制">
                <el-option label="不限制" value="1"></el-option>
                <el-option label="设定每人领取总张数" value="2"></el-option>
              </el-select>
              <div style="margin-top:10px;" v-if="ruleForm.pcGetRestrict==2">
                <span style="margin-left:20px;">最多领取
                  <el-input style="width:120px;" maxlength="60" minlength="10" size="small" placeholder="请输入张数" v-model="ruleForm.pcGetNum"></el-input>张/人
                </span>
              </div>
            </el-form-item>
            <el-form-item label="每日领取限制：">
              <el-select v-model="ruleForm.pcEverydayGetRestrict" style="width:360px;" placeholder="请选择每日领取限制">
                <el-option label="不限制" value="1"></el-option>
                <el-option label="设定每人每日领取总张数" value="2"></el-option>
              </el-select>
              <div style="margin-top:10px;" v-if="ruleForm.pcEverydayGetRestrict==2">
                <span style="margin-left:20px;">
                  <el-input
                    style="width:120px;"
                    maxlength="60"
                    minlength="10"
                    size="small"
                    placeholder="请输入张数"
                    v-model="ruleForm.pcEverydayGetNum"
                  ></el-input>张/人/日
                </span>
              </div>
            </el-form-item>
            <el-form-item label="最低消费：">
              <el-select v-model="ruleForm.pcLowestFee" style="width:360px;" placeholder="请选择最低消费">
                <el-option label="不限制" value="1"></el-option>
                <el-option label="指定金额" value="2"></el-option>
              </el-select>
              <div style="margin-top:10px;" v-if="ruleForm.pcLowestFee==2">
                <span style="margin-left:20px;">订单满
                  <el-input
                    style="width:120px;"
                    maxlength="60"
                    minlength="10"
                    size="small"
                    placeholder="请输入金额"
                    v-model="ruleForm.pcLowestFeePrices"
                  ></el-input>元可享受优惠
                </span>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div class="basic-infor">
        <div class="addActivity-content">
          <div style="margin-left:200px;">
            <el-button type="primary" style="width:80px;" @click="preservation">提交</el-button>
          </div>
        </div>
      </div>
      <!-- 门店弹框 -->
      <storeTree :storeTreeVisible='dialogTableVisible' :defaultCheckedKeys="storefromchild" @addstore='addstore' @close='cancelStore'></storeTree>
    </div>
  </div>
</template>

<script>
import elupload from "../../UploadImg/Elupload.vue";
import storeTree from "../../../common/storeTree.vue";
import {specailTest,numberTest} from "@/libs/regular.js";
export default {
  components: { elupload, storeTree },
  data() {
    return {
      apiurl: "/mall/addParkingCoupon",
      activityOperation: "创建优惠券",
      ruleForm: {
        pcDeductionDuration: null, //抵扣时长 单位:小时
        pcEverydayGetNum: null, //pcEverydayGetRestrict = 2生效 单位:张/人/日
        pcEverydayGetRestrict: "1", //每日领取限制 1=不限制 / 2=设定每人每日领取张数
        pcEverydayGrantRestrict: null, //每天发放上限
        pcGetNum: null, //pcGetRestrict = 2生效 单位:张/人
        pcGetRestrict: "1", //领取限制 1=不限制 / 2=设定每人领取总张数
        pcLowestFee: "1", //最低消费 1=不限制 / 2=指定金额
        pcLowestFeePrices: null, //pcLowestFee = 2 生效 单位:元
        pcName: null, //名称
        pcUserTime: "1", //使用时段 1=不限制 / 2=指定每周使用时段
        pcValidity: null, //领取后x小时内有效
        parkingCouponAvailableTimeList: [], //使用时段
        activityImageUrl:[]
      },
      storefromchild: [], //选择的门店
      storeLabel: true,
      timeobj: {
        weekList: [
          { weekday: false, day: "日", value: "7" },
          { weekday: false, day: "一", value: "1" },
          { weekday: false, day: "二", value: "2" },
          { weekday: false, day: "三", value: "3" },
          { weekday: false, day: "四", value: "4" },
          { weekday: false, day: "五", value: "5" },
          { weekday: false, day: "六", value: "6" }
        ],
        tabdaylist: [],
        usedDetailTime: ["00:00:00", "23:59:59"]
      },
      usedTimeOptions: [],
      adddisabled: false, //添加星期选择禁用
      tailTime: [new Date(), new Date()],
      dialogTableVisible: false, //模态弹出
      defaultCheckedKeys: [], // 左侧默认选中数据
    };
  },
  created() {
    if (this.$route.query.pcId || this.$route.query.pcId == "0") {
      this.pcId = this.$route.query.pcId;
      this.selectCouponById();
    }
    this.usedTimeOptions.push({ ...this.timeobj });
  },
  methods: {
    selectCouponById() {
      //停车券详情
      let obj = {
        pcId: this.pcId
      };
      this.apiurl = "/mall/updateParkingCoupon";
      this.activityOperation = "修改优惠券";
      this.$httpAuth({
        url: "/mall/getParkingCouponInfo",
        method: "post",
        data: obj
      })
        .then(res => {
          if (res.data.code == 10000) {
            let resp = res.data.resp;
            resp.pcGetRestrict = resp.pcGetRestrict.toString();
            resp.pcEverydayGetRestrict = resp.pcEverydayGetRestrict.toString();
            resp.pcLowestFee = resp.pcLowestFee.toString();
            resp.pcUserTime = resp.pcUserTime.toString();
            this.ruleForm = resp;
            this.ruleForm.activityImageUrl = [resp.pcLogoUrl];
            this.storefromchild = [];
            resp.parkingCouponRsMerchantList.forEach((item, index) => {
              this.storefromchild.push(item.merchantId);
              this.storeLabel = false;
            });
            // 指定时间
            resp.parkingCouponAvailableTimeList.forEach((val, index) => {
              if (resp.pcUserTime == "2") {
                this.usedTimeOptions[
                  index
                ].tabdaylist = val.pcatUsePeriod.split(",");
                this.usedTimeOptions[index].usedDetailTime[0] =
                  val.pcatUseStartTime;
                this.usedTimeOptions[index].usedDetailTime[1] =
                  val.pcatUseEndTime;
              }
            });
            // 门店信息
            resp.parkingCouponRsMerchantList.forEach(val=>{

            })
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //添加时间段
    setweektime() {
      if (this.usedTimeOptions.length < 6) {
        //最多设置5个时段
        this.usedTimeOptions.push({ ...this.timeobj });
        if (this.usedTimeOptions.length == 5) {
          this.adddisabled = true;
        }
      }
    },
    // 删除时间段
    deleteweektime(index) {
      this.adddisabled = false;
      //删除
      this.usedTimeOptions.forEach((item, ev) => {
        if (ev == index) {
          this.usedTimeOptions.splice(ev, 1);
        }
      });
    },
    // 选择中的chekbox,其他的disable
    disabled(indexs, index) {
      let dis = false;
      this.usedTimeOptions.forEach((value, num) => {
        if (indexs == num) {
          // 过滤当前选择的规则
          return;
        } else {
          // 其他选择的规则操作
          value.tabdaylist.forEach(v => {
            if (v == index) {
              dis = true;
            }
          });
        }
      });
      return dis;
    },
    // 判断是否还有时间选择
    checkchang() {
      let len = 0;
      let arr = [];
      this.usedTimeOptions.forEach((val, index) => {
        len += val.tabdaylist.length;
        if (val.tabdaylist.length === 0) {
          arr.push(index);
        }
      });
      if (len === 7) {
        this.adddisabled = true;
        let num = 0;
        if (arr.length > 0) {
          arr.forEach(val => {
            console.log(val + num);
            this.usedTimeOptions.splice(val + num, 1);
            num--;
          });
        }
      } else if (this.usedTimeOptions.length < 5) {
        this.adddisabled = false;
      }
    },
    // 保存
    preservation() {
      if (!this.ruleForm.pcName) {
        this.$message({
          message: "请输入券名称",
          type: "warning"
        });
        return;
      } else if (this.ruleForm.pcName && specailTest(this.ruleForm.pcName)) {
        this.$message({
          message: "券名称不能为特殊字符!",
          type: "warning"
        });
        return;
      } else if (this.ruleForm.activityImageUrl.length == "0") {
        this.$message({
          message: "请输入券logo",
          type: "warning"
        });
        return;
      } else if (this.storefromchild.length == 0) {
        this.$message({
          message: "门店不能为空",
          type: "warning"
        });
        return;
      }
      else if (!this.ruleForm.pcDeductionDuration) {
        this.$message({
          message: "抵扣时长不能为空",
          type: "warning"
        });
        return;
      } else if (
        this.ruleForm.pcDeductionDuration &&
        !numberTest(this.ruleForm.pcDeductionDuration)
      ) {
        this.$message({
          message: "抵扣时长请输入整数",
          type: "warning"
        });
        return;
      }else if (!this.ruleForm.pcValidity) {
        this.$message({
          message: "有效时间不能为空",
          type: "warning"
        });
        return;
      }
       else if (
        this.ruleForm.pcValidity &&
        !numberTest(this.ruleForm.pcValidity)
      ) {
        this.$message({
          message: "有效时间请输入整数",
          type: "warning"
        });
        return;
      } else if (
        this.ruleForm.pcEverydayGrantRestrict &&
        !numberTest(this.ruleForm.pcEverydayGrantRestrict)
      ) {
        this.$message({
          message: "发放上限请输入整数",
          type: "warning"
        });
        return;
      } else if (this.ruleForm.pcGetRestrict == 2) {
        if (!this.ruleForm.pcGetNum && this.ruleForm.pcGetNum != "0") {
          this.$message({
            message: "每人领取张数不能为空",
            type: "warning"
          });
          return;
        } else if (
          this.ruleForm.pcGetNum &&
          !numberTest(this.ruleForm.pcDeductionDuration)
        ) {
          this.$message({
            message: "每人领取张数请输入整数",
            type: "warning"
          });
          return;
        }
      }
      if (this.ruleForm.pcEverydayGetRestrict == 2) {
        if (!this.ruleForm.pcEverydayGetNum) {
          this.$message({
            message: "每人每日领取张数不能为空",
            type: "warning"
          });
          return;
        } else if (
          this.ruleForm.pcEverydayGetNum &&
          !numberTest(this.ruleForm.pcEverydayGetNum)
        ) {
          this.$message({
            message: "每人每日领取张数请输入整数",
            type: "warning"
          });
          return;
        }
      }
      if (this.ruleForm.pcLowestFee == 2) {
        if (!this.ruleForm.pcLowestFeePrices) {
          this.$message({
            message: "最低消费不能为空",
            type: "warning"
          });
          return;
        } else if (
          this.ruleForm.pcLowestFeePrices &&
          !numberTest(this.ruleForm.pcLowestFeePrices)
        ) {
          this.$message({
            message: "最低消费的金额输入整数",
            type: "warning"
          });
          return;
        }
      }
  
      let couponAvailableTimeList = null;
      let next = true;
      if (this.ruleForm.pcUserTime == "2") {
        couponAvailableTimeList = [];
        this.usedTimeOptions.forEach((val, index) => {
          let data = {};
          if (val.tabdaylist.length == "0") {
            this.$message({
              message: "请设置星期几",
              type: "warning"
            });
            next = false;
            return;
          } else {
            data.pcatUsePeriod = val.tabdaylist.join(",");
          }
          if (!val.usedDetailTime) {
            this.$message({
              message: "请设置时间段",
              type: "warning"
            });
            next = false;
            return;
          } else {
            data.pcatUseStartTime = val.usedDetailTime[0];
            data.pcatUseEndTime = val.usedDetailTime[1];
          }
          couponAvailableTimeList.push(data);
        });
        if (!next) {
          return;
        }
      }

      if (
        !this.ruleForm.pcEverydayGrantRestrict &&
        this.ruleForm.pcEverydayGrantRestrict != 0
      ) {
        this.ruleForm.pcEverydayGrantRestrict = null;
      }
      let obj = {
        pcDeductionDuration: this.ruleForm.pcDeductionDuration, //抵扣时长 单位:小时
        pcEverydayGetNum: this.ruleForm.pcEverydayGetNum, //pcEverydayGetRestrict = 2生效 单位:张/人/日
        pcEverydayGetRestrict: this.ruleForm.pcEverydayGetRestrict, //每日领取限制 1=不限制 / 2=设定每人每日领取张数
        pcEverydayGrantRestrict: this.ruleForm.pcEverydayGrantRestrict,
        pcGetNum: this.ruleForm.pcGetNum, //pcGetRestrict = 2生效 单位:张/人
        pcGetRestrict: this.ruleForm.pcGetRestrict, //领取限制 1=不限制 / 2=设定每人领取总张数
        pcLogoUrl: this.ruleForm.activityImageUrl[0], //logo
        pcLowestFee: this.ruleForm.pcLowestFee, //最低消费 1=不限制 / 2=指定金额
        pcLowestFeePrices: this.ruleForm.pcLowestFeePrices, //pcLowestFee = 2 生效 单位:元
        pcName: this.ruleForm.pcName, //名称
        pcUserTime: this.ruleForm.pcUserTime, //使用时段 1=不限制 / 2=指定每周使用时段
        pcValidity: this.ruleForm.pcValidity, //领取后x小时内有效
        parkingCouponAvailableTimeList: couponAvailableTimeList, //使用时段
        merchantList: this.storefromchild //关联的门店
      };
      if (this.pcId || this.pcId == "0") {
        obj.pcId = this.pcId;
      }
      this.$httpAuth({
        url: this.apiurl,
        method: "post",
        data: obj
      })
        .then(res => {
          if (res.data.code == 10000) {
            this.$router.push("/marketing/ParkingCoupon");
            this.$message({
              message: res.data.resp,
              type: "success"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 组件上传图片
    upload(val) {
      this.ruleForm.activityImageUrl.splice(0, 1, val);
    },
    // 组件删除图片
    delimg(val) {
      this.ruleForm.activityImageUrl.splice(val, 1);
    },
    // 选择门店部分（ 子级的pid要和父级的id一样，且所有对象的id都要不一样）
    cancelStore() {
      this.dialogTableVisible = false;
    },
    // 添加按钮
    addstore(fromData) {
    this.storefromchild = [...fromData];
    this.dialogTableVisible =false;
    },
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
#addActivity {
  width: auto;
  min-width: 1000px;
  padding-bottom: 20px;
  h3 {
    height: 35px;
    line-height: 35px;
    border-bottom: 1px solid #f3f3f3;
    text-indent: 15px;
    font-size: 14px;
    color: #333;
    font-weight: normal;
  }
  .titlediv {
    margin: 20px 40px;
    .titleline {
      width: 800px;
      height: 6px;
      border-top: 1px dashed #ddd;
      display: inline-block;
      margin-left: 10px;
    }
  }
  .addActivity-content {
    width: 100%;
    margin-left: 70px;
    margin-top: 10px;
    .el-form {
      .el-form-item {
        .rules {
          display: flex;
          .rules_label {
            margin-right: 10px;
          }
          .rules_right {
            margin-left: 26px;
          }
        }
        .el-button {
          width: 140px;
          height: 38px;
        }
        .activity-url {
          width: 75px;
          height: 75px;
          border: 1px solid #d9d9d9;
          border-radius: 2px;
          cursor: pointer;
          overflow: hidden;
          img {
            width: 75px;
            height: 75px;
          }
        }
        .activity-name {
          p {
            color: #999999;
            font-size: 14px;
          }
        }
        .chooseShop {
          // color: #64caf8;
          font-size: 14px;
          span {
            cursor: pointer;
          }
        }
        .weekul {
          li {
            width: 60px;
            height: 30px;
            line-height: 30px;
            float: left;
            background: #f2f2f2;
            font-size: 14px;
            border-right: 1px solid #fff;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
