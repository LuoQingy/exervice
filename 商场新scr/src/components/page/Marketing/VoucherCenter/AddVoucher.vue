<template>
  <div id="addActivity">
    <h3>{{activityOperation}}</h3>
    <div class="addActivity-content">
      <el-form label-width="120px" class="demo-ruleForm">
        <el-form-item label="券种类：" required>
          <div class="activity-name">
            <el-radio-group v-model="ruleForm.radio2" :disabled="chakan">
              <el-radio :label="1">代金券</el-radio>
              <el-radio :label="2">折扣券</el-radio>
            </el-radio-group>
            <div>
              <el-checkbox v-model="ruleForm.vouchersType" :disabled="chakan">可与商户优惠券叠加使用</el-checkbox>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div id="addActivity">
      <div class="basic-infor">
        <div class="addActivity-content">
          <el-form label-width="120px" class="demo-ruleForm">
            <el-form-item label="券面额：" required v-if="ruleForm.radio2=='1'">
              <div class="activity-name">
                <el-input style="width:100px;" :readonly="chakan" size="small" placeholder="请填写" v-model="ruleForm.commodityMoney"></el-input>元
              </div>
            </el-form-item>
            <el-form-item label="折扣力度：" required v-if="ruleForm.radio2=='2'">
              <div class="activity-name">
                <el-input
                  type="number"
                  :readonly="chakan"
                  style="width:160px;"
                  size="small"
                  placeholder="请填写"
                  v-model="ruleForm.couponDiscount"
                ></el-input>折,且收款时
                <el-select v-model="ruleForm.discount" style="width:240px;" :disabled="chakan">
                  <el-option v-for="(item,index) in discountOptions" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <!-- 抹零规则 -->
                <RulesTemplate style="display: inline-block;"></RulesTemplate>
                <div>
                  折扣范围1.1折至9.9折。例：设置
                  <span style="color:orange;">2折</span>后,原价10元,用户仅需付
                  <span style="color:orange;">2元</span>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="参与门店：" required>
              <div class="chooseShop">
                <div style="color:#64caf8;" v-if="storefromchild.length=='0'">
                  <span @click="dialogTableVisible = true">配置门店</span>
                </div>
                <div v-else>
                  <span>
                    已选择{{storefromchild.length}}家门店
                    <span @click="dialogTableVisible = true" style="color:#64caf8;">修改</span>
                  </span>
                </div>
                <p>用户在参与门店消费后即可收到活动优惠券</p>
              </div>
            </el-form-item>
            <el-form-item label="券名称：" required>
              <div class="activity-name">
                <el-input style="width:150px;" :readonly="chakan" size="small" placeholder="请填写券的名称" v-model="ruleForm.commodityName"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="券副标题：" required>
              <div class="activity-name">
                <el-input style="width:150px;" :readonly="chakan" size="small" placeholder="请填写券的副标题" v-model="ruleForm.commoditySubName"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="最低消费：" required>
              <el-select v-model="ruleForm.minconsum" :disabled="chakan" style="width:140px;" placeholder="请选择">
                <el-option label="设置最低消费" value="1"></el-option>
                <el-option label="不设置最低消费" value="2"></el-option>
              </el-select>
              <el-input
                :readonly="chakan"
                v-if="ruleForm.minconsum=='1'"
                style="width:100px;"
                size="small"
                placeholder="请填写"
                v-model="ruleForm.minconsumInput"
              ></el-input>
              <span v-if="ruleForm.minconsum=='1'">元</span>
            </el-form-item>
            <el-form-item label="有效期：" required>
              <el-select v-model="relativeTime" style="width:140px;" :disabled="chakan" placeholder="请选择">
                <el-option label="相对时间" value="1"></el-option>
                <el-option label="指定时间" value="2"></el-option>
              </el-select>
              <span v-if="relativeTime==1" style="margin-left:20px;">购买后
                <el-input style="width:120px;" :readonly="chakan" size="small" placeholder="请输入天数" v-model="ruleForm.commodityDay"></el-input>日内有效
              </span>
              <span style="margin-left:20px;" v-else>
                <el-date-picker
                  :readonly="chakan"
                  v-model="validtime"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </span>
            </el-form-item>
            <el-form-item label="领取时间：" required>
              <div>
                <el-date-picker
                  :readonly="chakan"
                  v-model="shelftime"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </div>
            </el-form-item>
            <el-form-item label="券logo：" required>
              <div>
                <elupload @uploadimg="upload" :uploadDisabled='chakan' @delimg="delimg" :imglist="ruleForm.activityImageUrl"></elupload>
              </div>
              <p style="color:#999;">请上传品牌logo,文件格式png，jpg，jepg，gif,文件大小10M以内，建议尺寸120px*120px</p>
            </el-form-item>
            <el-form-item label="使用说明：" required>
              <div>
                <wangeditor
                  @editorContent="getEditorContent"
                  :editorContent="editorContent"
                  :customConfig="customConfig"
                  :isLoading="isLoading"
                  :disableEditor="chakan"
                ></wangeditor>
              </div>
            </el-form-item>
            <el-form-item label="领取上限：" required>
              <el-select v-model="ruleForm.maxreceiveInput" :disabled='chakan' style="width:360px;" placeholder="请选择">
                <el-option label="设置领取上限" value="1"></el-option>
                <el-option label="不设置领取上限" value="2"></el-option>
              </el-select>
              <div style="margin-top:10px;" v-if="ruleForm.maxreceiveInput=='1'">每人
                <el-select v-model="ruleForm.maxreceive" :disabled='chakan' style="width:100px;" placeholder="请选择">
                  <el-option v-for="(item,index) in maxreceiveOptions" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <span style="margin-left:20px;">最多领取
                  <el-input style="width:120px;" size="small" :readonly="chakan" placeholder="请输入张数" v-model="ruleForm.receiveNmu"></el-input>张
                </span>
              </div>
            </el-form-item>
            <el-form-item label="使用时段：" required>
              <el-select v-model="usedTime" style="width:360px;" :disabled='chakan' placeholder="请选择">
                <el-option label="指定每周使用时段" value="true"></el-option>
                <el-option label="不指定每周使用时段" value="false"></el-option>
              </el-select>
              <div v-for="(item,index) in usedTimeOptions" :class="chakan?'weekul_chakan':''" :key="index" v-if="usedTime=='true'">
                <div class="weekul_hiden" v-if='chakan'></div>
                <ul class="weekul" style="margin-top:10px;">
                  <el-checkbox-group v-model="item.tabdaylist"  size="medium" @change="checkchang">
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
                    :readonly="chakan"
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
          </el-form>
        </div>
      </div>

      <div class="basic-infor" v-if="!isaddactive">
        <div class="addActivity-content">
          <div style="margin-left:200px;" v-if="couponStatus!=1">
            <el-button type="primary" style="width:80px;" @click="preservation" v-if="!couponId">提交</el-button>
            <el-button
              v-if="couponId&&couponStatus==4&&!chakan"
              type="primary"
              style="width:80px;margin-right:20px;"
              @click="preservation"
            >保存修改</el-button>
          </div>
          <div style="margin-left:120px;" v-else>
            <div>
              <el-input type="textarea" style="width:300px;margin-bottom:20px;" v-model="rejectreason" rows="5" placeholder="请填写驳回理由"></el-input>
            </div>
            <el-button type="primary" style="width:80px;margin-right:20px;" @click="reviewCoupon">驳回</el-button>
          </div>
        </div>
      </div>
      <!-- 门店弹框 -->
      <storeTree
        :storeTreeVisible="dialogTableVisible"
        v-if="!chakan"
        :defaultCheckedKeys="storefromchild"
        @addstore="addstore"
        @close="cancelStore"
      ></storeTree>
    </div>
  </div>
</template>

<script>
import Elupload from "../../UploadImg/Elupload.vue";
import RulesTemplate from "../RulesTemplate.vue";
import wangeditor from "../../../common/wangeditor.vue";
import storeTree from "../../../common/storeTree.vue";
import bus from "@/components/common/bus.js";
import { specailTest, numberTest, numberRangeTest } from "@/libs/regular.js";
export default {
  components: { Elupload, wangeditor, storeTree, RulesTemplate },
  data() {
    return {
      apiurl: "/gm/addCoupon",
      activityOperation: "创建优惠券",
      couponId: "",
      chakan: false,
      couponStatus: "",
      ruleForm: {
        radio2: 1, //现金1  还是折扣券2
        vouchersType: false, //可与商户优惠券叠加使用状态
        commodityMoney: "", //券面额
        discount: 1, //折扣换算
        couponDiscount: "", //折扣
        commodityName: "", //类型：String  必有字段  备注：名称
        commoditySubName: "", //类型：String  必有字段  备注：副标题
        minconsum: "1", //1设置最低消费 2 不设置最低消费
        minconsumInput: "", //最低消费的输入框
        maxreceiveInput: "2", //领取上限的输入框
        maxreceive: 1, //领取上限的选择时间
        receiveNmu: "", //领取张数
        activityImageUrl: [] //logo图片
      },
      storefromchild: [], //选择的门店
      relativeTime: "1", //有效期选择 相对时间  指定时间
      shelftime: [], //领取时间
      couponAvailableTimeList: [], //设置时间段
      usedTime: "false", //是否设置使用时间段
      validtime: [], //有效期
      editorContent: "", //富文本内容
      Content: "", //富文本内容
      rejectreason: "", //驳回理由
      ruleshow: false,
      statusOptions: [
        //1:团购商品 2:售卖代金券 劵类型
        {
          value: 1,
          label: "相对时间"
        },
        {
          value: 2,
          label: "规定时间"
        }
      ],
      discountOptions: [
        //领取上限
        {
          value: 1,
          label: "不自动抹零"
        },
        {
          value: 2,
          label: "自动抹零到元"
        },
        {
          value: 3,
          label: "自动抹零到角"
        },
        {
          value: 4,
          label: "四舍五入到元"
        },
        {
          value: 5,
          label: "四舍五入到角"
        }
      ],
      maxreceiveOptions: [
        //领取上限
        {
          value: 1,
          label: "每天"
        },
        {
          value: 2,
          label: "每周"
        },
        {
          value: 3,
          label: "每月"
        }
      ],
      weekIndex: false,
      weektabbg: {
        background: "rgb(100, 202, 248)",
        color: "#fff"
      },
      finalTime: [],
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
      dialogTableVisible: false, //模态弹出框
      isLoading: false,
      disableEditor: false,
      customConfig: [
        //副文本编辑器功能配置
        "head", // 标题
        "bold", // 粗体
        "fontSize", // 字号
        "fontName", // 字体
        "italic", // 斜体
        "underline", // 下划线
        "strikeThrough", // 删除线
        "foreColor", // 文字颜色
        "backColor", // 背景颜色
        // 'link',  // 插入链接
        "list", // 列表
        "justify", // 对齐方式
        // 'quote',  // 引用
        // 'emoticon',  // 表情
        "image", // 插入图片
        // 'table',  // 表格
        // 'video',  // 插入视频
        // 'code',  // 插入代码
        "undo", // 撤销
        "redo" // 重复
      ]
    };
  },
  props: {
    isaddactive: {
      type: Boolean,
      default: false
    },
    couid: {
      type: Number,
      default: 0
    }
  },
  created() {
    if (this.couid !== 0) {
      this.couponId = this.couid;
      this.selectCouponById();
    } else {
      this.couponId = this.$route.query.couponId;
      this.chakan = this.$route.query.chakan ? true : false;
    }
    this.usedTimeOptions.push({ ...this.timeobj });
  },
  watch: {
    couid(val) {
      this.couponId = this.couid;
      this.selectCouponById();
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.couid === 0) {
        setTimeout(() => {
          this.selectCouponById();
        }, 20);
      }
    });
    bus.$on("createPlan", this.preservation);
  },
  methods: {
    selectCouponById() {
      //优惠券详情
      if (this.couponId || this.couponId == "0") {
        this.apiurl = "/gm/updateCoupon";
        this.activityOperation = "查看修改优惠券";
        this.$httpAuth({
          url: "/gm/selectCouponById",
          method: "post",
          data: {
            couponId: this.couponId
          }
        })
          .then(res => {
            if (res.data.code == 10000) {
              let resp = res.data.resp;
              this.ruleForm.radio2 = resp.couponType;
              this.ruleForm.vouchersType = resp.couponIsSuperposition;
              if (resp.couponType == 1) {
                this.ruleForm.commodityMoney = resp.couponDenomination;
              } else {
                this.ruleForm.couponDiscount = resp.couponDenomination;
              }
              this.ruleForm.discount = resp.couponPreferentialRules;
              this.ruleForm.commodityName = resp.couponName;
              this.ruleForm.commoditySubName = resp.couponSubhead;
              this.ruleForm.minconsum = resp.couponIsMinimumCharge ? "1" : "2";
              this.ruleForm.minconsumInput = resp.couponMinimumCharge;
              this.relativeTime = resp.couponValidityType.toString();
              this.ruleForm.commodityDay = resp.couponGetDays;
              this.couponStatus = resp.couponStatus;
              this.ruleForm.maxreceiveInput = resp.couponIsRestriction
                ? "1"
                : "2";
              if (resp.couponValidityStartTime) {
                this.validtime = [
                  resp.couponValidityStartTime,
                  resp.couponValidityEndTime
                ];
              } else {
                this.validtime = [];
              }
              if (resp.couponReceiveStartTime) {
                this.shelftime = [
                  resp.couponReceiveStartTime,
                  resp.couponReceiveEndTime
                ];
              }

              this.ruleForm.activityImageUrl = [resp.couponBrandLogo];
              this.editorContent = resp.couponInstructions;
              this.ruleForm.maxreceive = resp.couponGetQuotaType;
              this.ruleForm.receiveNmu = resp.couponGetQuotaNum;
              this.storefromchild = [];
              resp.couponRsObjectList.forEach((item, index) => {
                //选中的门店
                if (item.croObjectType == 2) {
                  this.storefromchild.push(item.merchant.merchantId);
                }
              });
              // 指定时间
              resp.couponAvailableTimeList.forEach((val, index) => {
                if (val.catId || val.catId == "0") {
                  if (index !== 0) {
                    this.usedTimeOptions.push({ ...this.timeobj });
                  }
                  this.usedTime = "true";
                  this.usedTimeOptions[
                    index
                  ].tabdaylist = val.catUsePeriod.split(",");
                  this.usedTimeOptions[index].usedDetailTime[0] =
                    val.catUseStartTime;
                  this.usedTimeOptions[index].usedDetailTime[1] =
                    val.catUseEndTime;
                } else {
                  this.usedTime = "false";
                }
              });
              return;
            } else {
              this.$message({
                message: res.data.msg,
                type: "warning"
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    //富文本的值
    getEditorContent(val) {
      this.Content = val;
    },
    //添加时间段
    setweektime() {
      if(this.chakan){
        return;
      }
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
      if(this.chakan){
        return;
      }
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
            this.usedTimeOptions.splice(val + num, 1);
            num--;
          });
        }
      } else if (this.usedTimeOptions.length < 5) {
        this.adddisabled = false;
      }
    },
    //保存
    preservation() {
      //券类型
      if (this.ruleForm.radio2 === 1) {
        if (!this.ruleForm.commodityMoney) {
          this.$message({
            message: "请输入券面额",
            type: "warning"
          });
          return;
        } else if (
          this.ruleForm.commodityMoney &&
          !numberTest(this.ruleForm.commodityMoney)
        ) {
          this.$message({
            message: "请输入整数",
            type: "warning"
          });
          return;
        }
      } else if (this.ruleForm.radio2 === 2) {
        if (!this.ruleForm.couponDiscount) {
          this.$message.info("折扣不能为空");
          return;
        } else if (
          !numberRangeTest(this.ruleForm.couponDiscount) ||
          this.ruleForm.couponDiscount < 1.1
        ) {
          this.$message.info("折扣要在1.1到9.9之间");
          return;
        }
      }
      /**                    */
      if (this.storefromchild.length == 0) {
        // 是否选择门店
        this.$message({
          message: "请选择参与的门店",
          type: "warning"
        });
        return;
      } else if (!this.ruleForm.commodityName) {
        //券名称
        this.$message({
          message: "请输入券名称",
          type: "warning"
        });
        return;
      } else if (
        this.ruleForm.commodityName &&
        specailTest(this.ruleForm.commodityName)
      ) {
        this.$message({
          message: "券名称不能有特殊字符",
          type: "warning"
        });
        return;
      } else if (!this.ruleForm.commoditySubName) {
        //券副标题
        this.$message({
          message: "请输入券副标题",
          type: "warning"
        });
        return;
      } else if (
        this.ruleForm.commoditySubName &&
        specailTest(this.ruleForm.commoditySubName)
      ) {
        this.$message({
          message: "券副标题不能有特殊字符",
          type: "warning"
        });
        return;
      } else if (this.ruleForm.minconsum == "1") {
        if (!this.ruleForm.minconsumInput) {
          this.$message({
            message: "请输入最低消费",
            type: "warning"
          });
          return;
        } else if (!numberTest(this.ruleForm.minconsumInput)) {
          this.$message({
            message: "请输入正数",
            type: "warning"
          });
          return;
        }
      }
      /**                    */
      if (this.relativeTime == "1") {
        if (!this.ruleForm.commodityDay) {
          this.$message({
            message: "请输入相对时间",
            type: "warning"
          });
          return;
        }
      } else if (this.relativeTime == "2") {
        if (this.validtime.length == 0) {
          this.$message({
            message: "请输入指定时间",
            type: "warning"
          });
          return;
        }
      }
      /**                    */
      if (this.shelftime.length == 0) {
        this.$message({
          message: "请选择领取时间",
          type: "warning"
        });
        return;
      } else if (this.shelftime.length != 0) {
        if (this.shelftime[0] == this.shelftime[1]) {
          this.$message({
            message: "领取开始时间和结束时间不能一样",
            type: "warning"
          });
          return;
        }
      }
      /**                    */

      if (this.ruleForm.activityImageUrl.length == "0") {
        this.$message({
          message: "请选择券logo",
          type: "warning"
        });
        return;
      } else if (!this.Content || this.Content == "<p><br></p>") {
        this.$message({
          message: "请输入使用说明",
          type: "warning"
        });
        return;
      } else if (this.ruleForm.maxreceiveInput == "1") {
        if (!this.ruleForm.receiveNmu) {
          this.$message({
            message: "请输入领取张数",
            type: "warning"
          });
          return;
        }
      }
      /**                    */
      let couponAvailableTimeList = null;
      let next = true;
      if (this.usedTime == "true") {
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
            data.catUsePeriod = val.tabdaylist.join(",");
          }
          if (!val.usedDetailTime) {
            this.$message({
              message: "请设置时间段",
              type: "warning"
            });
            next = false;
            return;
          } else {
            data.catUseStartTime = val.usedDetailTime[0];
            data.catUseEndTime = val.usedDetailTime[1];
          }
          couponAvailableTimeList.push(data);
        });
        if (!next) {
          return;
        }
      }
      let obj = {
        couponType: this.ruleForm.radio2, //类型：Number  必有字段  备注：券类型(1:满减券 2折扣券)
        couponIsSuperposition: this.ruleForm.vouchersType, //类型：Boolean  必有字段  备注：是否和商户优惠卷叠加使用
        couponDenomination:
          this.ruleForm.radio2 === 1
            ? this.ruleForm.commodityMoney
            : this.ruleForm.couponDiscount, //类型：String  必有字段  备注：券面额(根据券类型 1:金额 2:x.x折)
        couponPreferentialRules: this.ruleForm.discount, //类型：Number  必有字段  备注：抹零规则：1=不自动抹零 2=自动抹零到元 3=自动抹零到角 4=四舍五入到元 5=四舍五入到角
        couponName: this.ruleForm.commodityName, //类型：String  必有字段  备注：券名称
        couponSubhead: this.ruleForm.commoditySubName, //类型：String  必有字段  备注：券副标题
        couponIsMinimumCharge: this.ruleForm.minconsum == 1 ? true : false, //类型：Boolean  必有字段  备注：是否有最低消费(true:设置最低消费 false:不设置最低消费)
        couponMinimumCharge: this.ruleForm.minconsumInput, //类型：String  必有字段  备注：最低消费xx元(在是否有最低消费字段为1时生效)
        couponValidityType: this.relativeTime, //类型：Number  必有字段  备注：卷有效期类型(1:相对时间 2:指定时间)
        couponGetDays: this.ruleForm.commodityDay, //类型：String  必有字段  备注：领取后xxx天内有效(在卷有效期类型为1时生效)
        couponValidityStartTime: this.validtime[0],
        couponValidityEndTime: this.validtime[1],
        couponReceiveStartTime: this.shelftime[0], //类型：String  必有字段  备注：领取时间段开始
        couponReceiveEndTime: this.shelftime[1], //类型：String  必有字段  备注：领取时间段结束
        couponBrandLogo: this.ruleForm.activityImageUrl[0], //类型：String  必有字段  备注：券Logo
        couponInstructions: this.Content, //类型：String  必有字段  备注：使用说明
        couponIsRestriction: this.ruleForm.maxreceiveInput == 1 ? true : false, //类型：Boolean  必有字段  备注：开启领取上限：false=关 true=开
        couponGetQuotaType: this.ruleForm.maxreceive, //类型：Number  必有字段  备注：领取上限方式：1=每天 2=每周 3=每月
        couponGetQuotaNum: this.ruleForm.receiveNmu, //类型：Number  必有字段  备注：领取上限张数
        merchantList: this.storefromchild,
        couponAvailableTimeList: couponAvailableTimeList
      };
      if (this.couponId || this.couponId == "0") {
        obj.couponId = this.couponId;
      }
      if (this.isaddactive) {
        this.$store.commit("changAllCoupon", true);
        this.$store.commit("changActiveCoupon", obj);
        return;
      }
      this.$httpAuth({
        url: this.apiurl,
        method: "post",
        data: obj
      })
        .then(res => {
          if (res.data.code == 10000) {
            this.goback();
            this.$message({
              message: res.data.resp,
              type: "success"
            });
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
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
      if(this.chakan){
        return;
      }
      this.ruleForm.activityImageUrl.splice(val, 1);
    },
    // 驳回申请
    reviewCoupon() {
      this.$httpAuth
        .post("/gm/reviewCoupon", {
          couponId: this.couponId,
          couponStatus: 2,
          couponRejectExplain: this.rejectreason
        })
        .then(result => {
          if (result.data.code === 10000) {
            this.goback();
            this.$message({
              type: "success",
              message: result.data.resp
            });
          } else {
            this.$message({
              type: "warning",
              message: result.data.msg
            });
          }
        })
        .catch(err => {});
    },
    // 添加按钮
    addstore(fromData) {
      this.storefromchild = [...fromData];
      this.dialogTableVisible = false;
    },
    cancelStore() {
      this.dialogTableVisible = false;
    },
    goback() {
      bus.$emit("closetags");
      this.$router.push("/marketing/voucherCenter");
    }
  }
};
</script>

<style lang="less" scoped>
input,
button {
  outline: none;
  border: none;
}
#addActivity {
  width: auto;
  min-width: 1000px;
  h3 {
    height: 35px;
    line-height: 35px;
    border-bottom: 1px solid #f3f3f3;
    text-indent: 15px;
    font-size: 14px;
    color: #333;
    font-weight: normal;
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
.weekul_chakan{
  position: relative;
  .weekul_hiden{
    position: absolute;
    height: 100%;
    width: 500px;
    z-index: 999;
    cursor: not-allowed;
  }
}
</style>
