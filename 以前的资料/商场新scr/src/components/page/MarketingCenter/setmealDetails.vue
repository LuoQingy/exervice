<template>
  <div id="addActivity">
    <div class="basic-infor">
      <div class="fl information">基本信息</div>
      <div class="addActivity-content fl">
        <el-form :model="ruleForm" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <el-form-item label="商品名称：" required>
            <div class="activity-name">
              <el-input
                style="width:340px;"
                maxlength="60"
                minlength="1"
                size="small"
                readonly
                placeholder="请输入商品名称，限1-60个字"
                v-model="ruleForm.commodityName"
              ></el-input>

              <p>请勿输入"储值卡，会员卡，vip卡，充值卡，打折卡，年卡，美容卡，美容卡，健身卡"等敏感字</p>
            </div>
          </el-form-item>
          <el-form-item label="商品价格：" required>
            <div class="OriginalPrice">商品原价
              <el-input
                v-model.number="ruleForm.commodityOriginalPrice"
                readonly
                size="mini"
                type="number"
                style="width:150px;"
                placeholder="输入原价"
              ></el-input>元，现价
              <el-input
                v-model.number="ruleForm.commodityPreferentialPrice"
                readonly
                size="mini"
                type="number"
                style="width:150px;"
                placeholder="输入现价"
              ></el-input>元
            </div>
          </el-form-item>
          <el-form-item label="商品副标题：" required>
            <el-input
              style="width:340px;"
              maxlength="60"
              minlength="10"
              size="small"
              readonly
              placeholder="请输入商品副标题，限1-60个字"
              v-model="ruleForm.commoditySubtitile"
            ></el-input>
          </el-form-item>
          <el-form-item label="商品首图：" required>
            <div>
              <upload @childByValue="childByValue" :ruleFormT="firstPicture" :disabled='true'></upload>
            </div>
            <p style="color:#999;">必须上传1张4:3商品封面首图</p>
            <p style="color:#999;">图片大小不超过5M，图片格式：png，jepg，gif。</p>
            <p style="color:#999;">建议尺寸：2000*1500以上</p>
          </el-form-item>
          <el-form-item label="商品图片：">
            <div>
              <uploadmore @fileList="getFileList" :fileList="swipeImg" :disabled='true' :commodityPic="true" :maxLen="5"></uploadmore>
            </div>
            <p style="color:#999;">最多可上传5张商品内容图片</p>
            <p style="color:#999;">图片大小不超过5M，图片格式：png，jepg，gif。</p>
            <p style="color:#999;">建议尺寸：2000*1500以上</p>
          </el-form-item>
          <el-form-item label="商品详情：" required>
            <div>
              <wangeditor-two
                @editorContent="getEditorContent"
                :editorContent="editorContent"
                :customConfig="customConfig"
                :isLoading="isLoading"
                :disableEditor="disableEditor"
              ></wangeditor-two>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="basic-infor">
      <div class="fl information">规则设置</div>
      <div class="addActivity-content fl">
        <el-form :model="ruleForm" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <el-form-item label="每个ID限购：">
            <div class="activity-name">
              <el-input
                style="width:150px;"
                maxlength="11"
                size="small"
                type="number"
                readonly
                placeholder="请输入限购数量"
                v-model.number="ruleForm.commodityRestrict"
              ></el-input>
              <span style="color:#666;">不输入则不限制</span>
            </div>
          </el-form-item>
          <el-form-item label="是否可退：" required>
            <el-checkbox v-model="ruleForm.commodityIsReturnable" disabled>是</el-checkbox>
          </el-form-item>
          <el-form-item label="发放总量：" required>
            <el-input
              style="width:340px;"
              maxlength="11"
              minlength="1"
              size="small"
              type="number"
              readonly
              placeholder="请输入发行量(只能是整数)"
              v-model.number="ruleForm.commodityProvideGross"
            ></el-input>
          </el-form-item>
          <el-form-item label="售卖日期：" required>
            <div>
              <el-date-picker
                @change="getTime"
                @focus="setTime(1)"
                @blur="setTime(2)"
                v-model="value4"
                readonly
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
              <p style="color:#666;">商品创建成功后，仅在售卖时间内才展示给用户并开放售卖</p>
            </div>
          </el-form-item>
          <el-form-item label="有效期：" required>
            <el-select v-model="relativeTime" style="width:340px;" disabled @change="changeType" placeholder="请选择">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <div v-if="relativeTime==1" style="margin-top:20px;color:#666;">购买后
              <el-input
                style="width:100px;"
                maxlength="60"
                minlength="10"
                size="small"
                type="number"
                readonly
                placeholder="请输入天数(只能是整数)"
                v-model.number="ruleForm.commodityDay"
              ></el-input>日内有效
            </div>
            <div style="margin-top:20px;" v-else>
              <el-date-picker
                @change="termValidity"
                @focus="setTime(1)"
                @blur="setTime(2)"
                v-model="value3"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="basic-infor">
      <div class="fl information">其他设置</div>
      <div class="addActivity-content fl">
        <el-form :model="ruleForm" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <el-form-item label="备注：">
            <div class="activity-name">
              <el-input
                style="width:340px;"
                maxlength="60"
                minlength="10"
                size="small"
                readonly
                placeholder="仅作管理使用，不会展示给用户"
                v-model="ruleForm.commodityRemark"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item label="驳回理由：" required v-if="ruleForm.commodityStatus==5||ruleForm.commodityStatus==1">
            <div class="reject">
              <el-input
                style="width:400px;"
                type="textarea"
                :autosize="{ minRows: 10, maxRows: 20}"
                placeholder="驳回理由"
                v-model="ruleForm.commodityRefuseExplain"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item>
            <div style="margin-top:10px;">
              <el-button type="primary" v-if="ruleForm.commodityStatus==1" @click="toExamine(ruleForm.commodityId,2)">通过审核</el-button>
              <el-button type="primary" v-if="ruleForm.commodityStatus==1" @click="toExamine(ruleForm.commodityId,5)">驳回</el-button>
              <el-button type="primary" @click="returnEvent">返回</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import upload from "../UploadImg/commodityUpload.vue";
import wangeditorTwo from "./wangeditorTwo.vue";
import uploadmore from "../UploadImg/commodUploadmore.vue";
import { specailTest } from "@/libs/regular.js";
export default {
  components: { upload, wangeditorTwo, uploadmore },
  data() {
    return {
      ruleForm: {
        commodityType: 1, //类型：Number  必有字段  备注：类型 1:团购商品 2:售卖代金券
        commodityName: "", //类型：String  必有字段  备注：名称
        commoditySubtitile: "", //类型：String  必有字段  备注：副标题
        commodityOriginalPrice: "", //类型：Number  必有字段  备注：原价
        commodityPreferentialPrice: "", //类型：Number  必有字段  备注：现价
        commodityRestrict: "", //类型：Mixed  可有字段  备注：每个id限购 (不输入代表不限制)
        commodityIsReturnable: false, //类型：Boolean  必有字段  备注：是否可退
        commodityProvideGross: 100, //类型：Number  必有字段  备注：发放总量
        commoditySellStartTime: "", //类型：String  必有字段  备注：售卖开始日期
        commoditySellEndTime: "", //类型：String  必有字段  备注：售卖结束日期
        commodityValidity: "1", //类型：String  必有字段  备注：1:相对时间 2:规定时间
        commodityDay: 30, //类型：String  可有字段  备注：相对时间xx天(相对时间生效)
        commodityPeriodStartTime: "", //类型：Mixed  可有字段  备注：规定开始时间(规定时间生效)
        commodityPeriodEndTime: "", //类型：Mixed  可有字段  备注：规定结束时间(规定时间生效)
        commodityVoucherRestrict: 1, //类型：Number  可有字段  备注：核销限制(每个订单核销,代金卷生效)
        commodityRemark: "", //类型：String  可有字段  备注：备注
        commodityRefuseExplain: "",
        commodityCommodityDetails: "", //类型：String  必有字段  备注：商品详情/须知
        commodityImgList: [
          //类型：Array  必有字段  备注：图片list
        ]
      },
      firstPicture: "", //首图
      textarea3: "", //驳回理由
      fileList: [], //接收其他图片
      swipeImg: [], //传递其他图片
      value4: [], //售卖时间
      value3: [], //规定时间
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
      timestate: true, //避免时间和富文本遮盖问题
      relativeTime: 1, //相对时间 和规定时间
      radio2: 1,
      activityOperation: "创建商品",
      parkingChecked: false,
      dialogTableVisible: false,
      loading: false,
      list: {},
      editorContent: "", //积分指南
      orContent: "", //积分指南
      isLoading: false,
      disableEditor: true,
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
  mounted() {
    let commodityId = this.$route.query.commodityId;
    let routerName = this.$route.name;
    if (commodityId) {
      this.getCommodityDetails(commodityId);
    }
  },
  methods: {
    changeType() {
      //选择时间类型
      this.ruleForm.commodityValidity = this.relativeTime;
    },
    setTime(ev) {
      if (ev == 1) {
        this.timestate = false;
      } else {
        this.timestate = true;
      }
    },
    toExamine(itemId, status) {
      //审核
      let obj = {
        commodityId: itemId,
        commodityStatus: status,
        commodityRefuseExplain: ""
      };
      if (status == 5) {
        if (specailTest(this.ruleForm.commodityRefuseExplain)) {
          this.$message.info("驳回理由不能含有特殊字符");
          return;
        }

        if (
          this.ruleForm.commodityRefuseExplain == "" ||
          this.ruleForm.commodityRefuseExplain == " "
        ) {
          this.$message.info("请输入驳回理由");
          return;
        }
        if (
          this.ruleForm.commodityRefuseExplain == "" ||
          this.ruleForm.commodityRefuseExplain == " "
        ) {
          this.$message.info("请输入驳回理由");
          return;
        }
        obj.commodityRefuseExplain = this.ruleForm.commodityRefuseExplain;
      }
      this.$httpAuth({
        url: "/gm/auditCommodity",
        method: "post",
        data: obj
      })
        .then(res => {
          if (res.data.code == 10000) {
            let resp = res.data.resp;
            //console.log(resp)
            this.$message({
              message: resp,
              type: "success"
            });
            this.$router.push("/marketing/groupPurchaseManagement");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    returnEvent() {
      //返回
      this.$router.push("/marketing/groupPurchaseManagement");
    },

    getCommodityDetails(ev) {
      //团购详情
      let data = {
        commodityId: ev
      };
      this.$httpAuth({
        url: "/gm/getCommodityInfo",
        method: "post",
        data: data
      })
        .then(res => {
          if (res.data.code == 10000) {
            let resp = res.data.resp;
            // console.log(resp)
            if (resp == null || resp == "") {
            } else {
              // console.log(ev)
              this.activityOperation = "修改活动";
              this.list = resp;
              this.ruleForm = resp;
              if (resp.commodityRefuseExplain) {
                this.ruleForm.commodityRefuseExplain =
                  resp.commodityRefuseExplain;
              } else {
                this.ruleForm.commodityRefuseExplain = "";
              }

              console.log(this.ruleForm.commodityRefuseExplain);
              this.editorContent = resp.commodityCommodityDetails;
              this.relativeTime = resp.commodityValidity;
              this.value4 = [];
              this.value3 = [];
              this.value4.push(resp.commoditySellStartTime);
              this.value4.push(resp.commoditySellEndTime);
              if (resp.commodityValidity == 2) {
                this.value3.push(resp.commodityPeriodStartTime);
                this.value3.push(resp.commodityPeriodEndTime);
              }
              this.swipeImg = [];
              resp.commodityImgList.forEach((item, index) => {
                if (item.ciIsFirst == true) {
                  this.firstPicture = item.ciImagerUrl;
                } else {
                  if (this.swipeImg.length >= 5) {
                    return;
                  } else {
                    this.swipeImg.push(item);
                  }
                }
              });
              // if(resp.activityIsValidity == false){
              //
              // }
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    addCommodity(ev) {
      //添加团购商品数据
      let obj = {
        commodityType: this.ruleForm.commodityType, //类型：Number  必有字段  备注：类型 1:团购商品 2:售卖代金券
        commodityName: this.ruleForm.commodityName, //类型：String  必有字段  备注：名称
        commoditySubtitile: this.ruleForm.commoditySubtitile, //类型：String  必有字段  备注：副标题
        commodityOriginalPrice: this.ruleForm.commodityOriginalPrice, //类型：Number  必有字段  备注：原价
        commodityPreferentialPrice: this.ruleForm.commodityPreferentialPrice, //类型：Number  必有字段  备注：现价
        commodityRestrict: this.ruleForm.commodityRestrict, //类型：Mixed  可有字段  备注：每个id限购 (不输入代表不限制)
        commodityIsReturnable: this.ruleForm.commodityIsReturnable, //类型：Boolean  必有字段  备注：是否可退
        commodityProvideGross: this.ruleForm.commodityProvideGross, //类型：Number  必有字段  备注：发放总量
        commoditySellStartTime: this.ruleForm.commoditySellStartTime, //类型：String  必有字段  备注：售卖开始日期
        commoditySellEndTime: this.ruleForm.commoditySellEndTime, //类型：String  必有字段  备注：售卖结束日期
        commodityValidity: this.ruleForm.commodityValidity, //类型：String  必有字段  备注：1:相对时间 2:规定时间
        commodityDay: this.ruleForm.commodityDay, //类型：String  可有字段  备注：相对时间xx天(相对时间生效)
        commodityPeriodStartTime: this.ruleForm.commodityPeriodStartTime, //类型：Mixed  可有字段  备注：规定开始时间(规定时间生效)
        commodityPeriodEndTime: this.ruleForm.commodityPeriodEndTime, //类型：Mixed  可有字段  备注：规定结束时间(规定时间生效)
        commodityVoucherRestrict: this.ruleForm.commodityVoucherRestrict, //类型：Number  可有字段  备注：核销限制(每个订单核销,代金卷生效)
        commodityRemark: this.ruleForm.commodityRemark, //类型：String  可有字段  备注：备注
        commodityCommodityDetails: this.ruleForm.commodityCommodityDetails, //类型：String  必有字段  备注：商品详情/须知
        commodityImgList: this.ruleForm.commodityImgList //类型：Array  必有字段  备注：图片list            //类型：String  可有字段  备注：是否永久有效
      };
      this.$httpAuth({
        url: "/gm/addCommodity",
        method: "post",
        data: obj
      })
        .then(res => {
          if (res.data.code == 10000) {
            this.$router.push("/marketing/groupPurchaseManagement");
            this.$message({
              message: "添加成功",
              type: "success"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    editCommodityData(ev) {
      //修改团购商品数据
      let obj = {
        commodityId: this.ruleForm.commodityId,
        commodityType: this.ruleForm.commodityType, //类型：Number  必有字段  备注：类型 1:团购商品 2:售卖代金券
        commodityName: this.ruleForm.commodityName, //类型：String  必有字段  备注：名称
        commoditySubtitile: this.ruleForm.commoditySubtitile, //类型：String  必有字段  备注：副标题
        commodityOriginalPrice: this.ruleForm.commodityOriginalPrice, //类型：Number  必有字段  备注：原价
        commodityPreferentialPrice: this.ruleForm.commodityPreferentialPrice, //类型：Number  必有字段  备注：现价
        commodityRestrict: this.ruleForm.commodityRestrict, //类型：Mixed  可有字段  备注：每个id限购 (不输入代表不限制)
        commodityIsReturnable: this.ruleForm.commodityIsReturnable, //类型：Boolean  必有字段  备注：是否可退
        commodityProvideGross: this.ruleForm.commodityProvideGross, //类型：Number  必有字段  备注：发放总量
        commoditySellStartTime: this.ruleForm.commoditySellStartTime, //类型：String  必有字段  备注：售卖开始日期
        commoditySellEndTime: this.ruleForm.commoditySellEndTime, //类型：String  必有字段  备注：售卖结束日期
        commodityValidity: this.ruleForm.commodityValidity, //类型：String  必有字段  备注：1:相对时间 2:规定时间
        commodityDay: this.ruleForm.commodityDay, //类型：String  可有字段  备注：相对时间xx天(相对时间生效)
        commodityPeriodStartTime: this.ruleForm.commodityPeriodStartTime, //类型：Mixed  可有字段  备注：规定开始时间(规定时间生效)
        commodityPeriodEndTime: this.ruleForm.commodityPeriodEndTime, //类型：Mixed  可有字段  备注：规定结束时间(规定时间生效)
        commodityVoucherRestrict: this.ruleForm.commodityVoucherRestrict, //类型：Number  可有字段  备注：核销限制(每个订单核销,代金卷生效)
        commodityRemark: this.ruleForm.commodityRemark, //类型：String  可有字段  备注：备注
        commodityCommodityDetails: this.ruleForm.commodityCommodityDetails, //类型：String  必有字段  备注：商品详情/须知
        commodityImgList: this.ruleForm.commodityImgList //类型：Array  必有字段  备注：图片list            //类型：String  可有字段  备注：是否永久有效
      };
      this.$httpAuth({
        url: "/gm/updateCommodity",
        method: "post",
        data: obj
      })
        .then(res => {
          if (res.data.code == 10000) {
            this.$router.push("/marketing/groupPurchaseManagement");
            this.$message({
              message: "修改成功",
              type: "success"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getTime(ev) {
      //售卖时间
      //console.log(ev)
      if (this.value4 == null || this.value4.length == 0) {
        this.ruleForm.commoditySellStartTime = "";
        this.ruleForm.commoditySellEndTime = "";
      } else {
        let num1 = this.value4[0];
        let num2 = this.value4[1];
        this.ruleForm.commoditySellStartTime = this.forlataTime(num1);
        this.ruleForm.commoditySellEndTime = this.forlataTime(num2);
      }
    },
    termValidity(ev) {
      //规定时间
      if (this.value3 == null || this.value4.length == 0) {
        this.ruleForm.commodityPeriodStartTime = "";
        this.ruleForm.commodityPeriodEndTime = "";
      } else {
        let num1 = this.value3[0];
        let num2 = this.value3[1];
        this.ruleForm.commodityPeriodStartTime = this.forlataTime(num1);
        this.ruleForm.commodityPeriodEndTime = this.forlataTime(num2);
      }
    },
    forlataTime(time) {
      //解析时间的函数
      //参数time为从后台取到的毫秒数
      //console.log(time)
      var dataTime = new Date(time);
      var y = dataTime.getFullYear(); //显示年
      var m = dataTime.getMonth() + 1; //显示月
      m = m < 10 ? "0" + m : m;
      var d = dataTime.getDate(); //显示日
      d = d < 10 ? "0" + d : d;
      var h = dataTime.getHours(); //显示小时
      h = h < 10 ? "0" + h : h;
      var minute = dataTime.getMinutes(); //显示分钟
      minute = minute < 10 ? "0" + minute : minute;
      var second = dataTime.getSeconds(); //显示秒
      second = second < 10 ? "0" + second : second;
      return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
      // return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;     //返回最终时间y-m-d h-m
    },

    childByValue(childValue) {
      //首图
      // 激活图标的组件传过来的值
      console.log(childValue);
      this.firstPicture = childValue;
    },
    getEditorContent(val) {
      //富文本的值
      this.orContent = val;
    },
    getFileList(data) {
      //其他图片
      this.fileList = data;
    }
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
  h3 {
    height: 35px;
    line-height: 35px;
    border-bottom: 1px solid #f3f3f3;
    text-indent: 15px;
    font-size: 14px;
    color: #333;
    font-weight: normal;
  }
  .information {
    width: 100px;
    font-size: 14px;
    color: #333;
    text-indent: 9px;
    border-left: 8px solid #00aaee;
  }
  .addActivity-content {
    width: 100%;
    margin-left: 55px;
    margin-top: 10px;
    .basic-infor {
      overflow: hidden;
    }
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
        .OriginalPrice {
          color: #999999;
          font-size: 14px;
        }
        .chooseShop {
          color: #64caf8;
          font-size: 14px;
          span {
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
