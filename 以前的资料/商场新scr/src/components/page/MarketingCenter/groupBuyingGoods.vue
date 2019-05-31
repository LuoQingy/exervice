<template>
  <div id="addActivity">
    <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm">
      <div class="basic-infor">
        <div class="fl information">基本信息</div>
        <div class="addActivity-content fl">
          <el-form-item label="商品名称：" prop="commodityName">
            <div class="activity-name">
              <el-input style="width:340px;" maxlength="60" size="small" placeholder="请输入商品名称，限1-60个字" v-model="ruleForm.commodityName"></el-input>
              <p>请勿输入"储值卡，会员卡，vip卡，充值卡，打折卡，年卡，美容卡，美容卡，健身卡"等敏感字</p>
            </div>
          </el-form-item>
          <el-form-item label="商品价格：">
            <div class="OriginalPrice">商品原价
              <el-form-item prop="commodityOriginalPrice">
                <el-input
                  v-model.number="ruleForm.commodityOriginalPrice"
                  size="mini"
                  type="number"
                  style="width:150px;"
                  placeholder="输入原价"
                ></el-input>
              </el-form-item>元，现价
              <el-form-item prop="commodityPreferentialPrice">
                <el-input
                  v-model.number="ruleForm.commodityPreferentialPrice"
                  size="mini"
                  type="number"
                  style="width:150px;"
                  placeholder="输入现价"
                ></el-input>
              </el-form-item>元
            </div>
          </el-form-item>
          <el-form-item label="商品副标题：" prop="commoditySubtitile">
            <el-input style="width:340px;" maxlength="60" size="small" placeholder="请输入商品副标题，限1-60个字" v-model="ruleForm.commoditySubtitile"></el-input>
          </el-form-item>
          <el-form-item label="商品首图：" prop="firstPicture">
            <div>
              <upload @childByValue="childByValue" :ruleFormT="ruleForm.firstPicture"></upload>
              <!-- 表单验证 -->
              <el-input v-model="ruleForm.firstPicture" style="display:none;"></el-input>
            </div>
            <p style="color:#999;">必须上传1张4:3商品封面首图</p>
            <p style="color:#999;">图片大小不超过5M，图片格式：png，jepg，gif。</p>
            <p style="color:#999;">建议尺寸：2000*1500以上</p>
          </el-form-item>
          <el-form-item label="商品图片：">
            <div>
              <uploadmore @fileList="getFileList" :fileList="swipeImg" :commodityPic="true" :maxLen="5"></uploadmore>
            </div>
            <p style="color:#999;">最多可上传5张商品内容图片</p>
            <p style="color:#999;">图片大小不超过5M，图片格式：png，jepg，gif。</p>
            <p style="color:#999;">建议尺寸：2000*1500以上</p>
          </el-form-item>
          <el-form-item label="商品详情：" required>
            <div>
              <wangeditor
                @editorContent="getEditorContent"
                :editorContent="editorContent"
                :customConfig="customConfig"
                :isLoading="isLoading"
                :disableEditor="disableEditor"
              ></wangeditor>
            </div>
          </el-form-item>
        </div>
      </div>
      <div class="basic-infor">
        <div class="fl information">规则设置</div>
        <div class="addActivity-content fl">
          <el-form-item label="每个ID限购:" prop="commodityRestrict">
            <div class="activity-name">
              <el-input
                style="width:150px;"
                maxlength="11"
                size="small"
                type="number"
                placeholder="请输入限购数量"
                v-model.number="ruleForm.commodityRestrict"
              ></el-input>
              <span style="color:#666;">不输入则不限制</span>
            </div>
          </el-form-item>
          <el-form-item label="是否可退：">
            <el-checkbox v-model="ruleForm.commodityIsReturnable">是</el-checkbox>
          </el-form-item>
          <el-form-item label="发放总量：" prop="commodityProvideGross">
            <el-input
              style="width:340px;"
              maxlength="11"
              size="small"
              type="number"
              placeholder="请输入发行量(只能是整数)"
              v-model.number="ruleForm.commodityProvideGross"
            ></el-input>
          </el-form-item>
          <el-form-item label="售卖日期：" required>
            <div>
              <el-date-picker
                @change="value4Chang"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00','23:59:59']"
                v-model="value4"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
              <p style="color:#666;">商品创建成功后，仅在售卖时间内才展示给用户并开放售卖</p>
            </div>
          </el-form-item>
          <el-form-item label="有效期：" required>
            <el-select v-model="relativeTime" style="width:340px;" @change="changeType" placeholder="请选择">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <div v-if="relativeTime==1" style="margin-top:20px;color:#666;">
              <el-form-item prop="commodityDay">购买后
                <el-input
                  style="width:100px;"
                  maxlength="60"
                  size="small"
                  type="number"
                  placeholder="请输入天数(只能是整数)"
                  v-model.number="ruleForm.commodityDay"
                ></el-input>日内有效
              </el-form-item>
            </div>
            <div style="margin-top:20px;" v-else>
              <el-date-picker
                @change="value3Chang"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00','23:59:59']"
                v-model="value3"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </div>
          </el-form-item>
        </div>
      </div>

      <div class="basic-infor">
        <div class="fl information">其他设置</div>
        <div class="addActivity-content fl">
          <el-form-item label="备注：">
            <div class="activity-name">
              <el-input style="width:340px;" maxlength="60" size="small" placeholder="仅作管理使用，不会展示给用户" v-model="ruleForm.commodityRemark"></el-input>
            </div>
          </el-form-item>
          <el-form-item>
            <div style="margin-top:10px;">
              <el-button type="primary" style="width:80px;" @click="preservation('ruleForm')">提交</el-button>
            </div>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import upload from "../UploadImg/commodityUpload.vue";
import wangeditor from "../../common/wangeditorOne.vue";
import uploadmore from "../UploadImg/commodUploadmore.vue";
import { specailTest, numberTest } from "@/libs/regular.js";
import { rules } from "./rules/GoodsVouchersRules";
export default {
  components: { upload, wangeditor, uploadmore },
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
        commodityCommodityDetails: "", //类型：String  必有字段  备注：商品详情/须知
        firstPicture: "", //首图
        commodityImgList: [
          //类型：Array  必有字段  备注：图片list
        ]
      },
      fileList: [], //接收其他图片
      swipeImg: [], //传递其他图片
      value4: [], //售卖时间
      value3: [], //规定时间
      sensitiveList: [
        "储值卡",
        "会员卡",
        "vip卡",
        "充值卡",
        "打折卡",
        "年卡",
        "美容卡",
        "健身卡"
      ], //敏感字数组 储值卡，会员卡，vip卡，充值卡，打折卡，年卡，美容卡，健身卡
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
      ],
      rules: rules(this)
    };
  },
  created() {},
  mounted() {
    let commodityId = this.$route.query.commodityId;
    let routerName = this.$route.name;
    if (routerName == "modifyGoods") {
      if (commodityId) {
        this.timestate = false;
        this.getCommodityDetails(commodityId);
      }
    }
    //console.log(this.$route.name)
  },
  methods: {
    changeType() {
      //选择时间类型
      this.ruleForm.commodityValidity = this.relativeTime;
      //console.log(this.relativeTime)
    },
    // 售卖日期判断
    value4Chang(val) {
      if (val && val.length > "0") {
        if (val[0] === val[1]) {
          this.$message({
            message: "售卖日期开始时间不能和结束时间相同",
            type: "warning"
          });
          return false;
        } else {
          return true;
        }
      } else {
        this.$message({
          message: "售卖日期不能为空",
          type: "warning"
        });
        return false;
      }
    },
    // 有效期日期判断
    value3Chang(val) {
      if (this.relativeTime === 2 && val && val.length > "0") {
        if (val[0] === val[1]) {
          this.$message({
            message: "有效期开始时间不能和结束时间相同",
            type: "warning"
          });
          return false;
        } else {
          return true;
        }
      } else if (this.relativeTime === 2) {
        this.$message({
          message: "有效期不能为空",
          type: "warning"
        });
        return false;
      } else {
        return true;
      }
    },
    //团购详情
    getCommodityDetails(ev) {
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
              //console.log(ev)
              this.activityOperation = "修改活动";
              this.list = resp;
              this.ruleForm = resp;
              this.editorContent = resp.commodityCommodityDetails;
              this.relativeTime = resp.commodityValidity;
              this.value4 = [];
              this.value3 = [];
              this.disableEditor = true;
              this.value4.push(resp.commoditySellStartTime);
              this.value4.push(resp.commoditySellEndTime);
              if (resp.commodityValidity == 2) {
                this.value3.push(resp.commodityPeriodStartTime);
                this.value3.push(resp.commodityPeriodEndTime);
              }
              this.swipeImg = [];
              resp.commodityImgList.forEach((item, index) => {
                if (item.ciIsFirst == true) {
                  this.ruleForm.firstPicture = item.ciImagerUrl;
                } else {
                  if (this.swipeImg.length >= 5) {
                    return;
                  } else {
                    this.swipeImg.push(item);
                  }
                }
              });
              setTimeout(() => {
                this.timestate = true;
              }, 100);
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //添加团购商品数据
    addCommodity(ev) {
      let obj = {
        commodityType: this.ruleForm.commodityType, //类型：Number  必有字段  备注：类型 1:团购商品 2:售卖代金券
        commodityName: this.ruleForm.commodityName, //类型：String  必有字段  备注：名称
        commoditySubtitile: this.ruleForm.commoditySubtitile, //类型：String  必有字段  备注：副标题
        commodityOriginalPrice: this.ruleForm.commodityOriginalPrice, //类型：Number  必有字段  备注：原价
        commodityPreferentialPrice: this.ruleForm.commodityPreferentialPrice, //类型：Number  必有字段  备注：现价
        commodityRestrict: this.ruleForm.commodityRestrict, //类型：Mixed  可有字段  备注：每个id限购 (不输入代表不限制)
        commodityIsReturnable: this.ruleForm.commodityIsReturnable, //类型：Boolean  必有字段  备注：是否可退
        commodityProvideGross: this.ruleForm.commodityProvideGross, //类型：Number  必有字段  备注：发放总量
        commoditySellStartTime: this.value4[0], //类型：String  必有字段  备注：售卖开始日期
        commoditySellEndTime: this.value4[1], //类型：String  必有字段  备注：售卖结束日期
        commodityValidity: this.ruleForm.commodityValidity, //类型：String  必有字段  备注：1:相对时间 2:规定时间
        commodityDay: this.ruleForm.commodityDay, //类型：String  可有字段  备注：相对时间xx天(相对时间生效)
        commodityPeriodStartTime: this.value3[0], //类型：Mixed  可有字段  备注：规定开始时间(规定时间生效)
        commodityPeriodEndTime: this.value3[1], //类型：Mixed  可有字段  备注：规定结束时间(规定时间生效)
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
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //修改团购商品数据
    editCommodityData(ev) {
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
        commoditySellStartTime: this.value4[0], //类型：String  必有字段  备注：售卖开始日期
        commoditySellEndTime: this.value4[1], //类型：String  必有字段  备注：售卖结束日期
        commodityValidity: this.ruleForm.commodityValidity, //类型：String  必有字段  备注：1:相对时间 2:规定时间
        commodityDay: this.ruleForm.commodityDay, //类型：String  可有字段  备注：相对时间xx天(相对时间生效)
        commodityPeriodStartTime: this.value3[0], //类型：Mixed  可有字段  备注：规定开始时间(规定时间生效)
        commodityPeriodEndTime: this.value3[1], //类型：Mixed  可有字段  备注：规定结束时间(规定时间生效)
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
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //保存
    preservation(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (
            this.ruleForm.commodityOriginalPrice <
            this.ruleForm.commodityPreferentialPrice
          ) {
            this.$message.warning("原价不能低于现价");
            return;
          }
          // 首图
          this.ruleForm.commodityImgList = [];
          let objImg = {
            ciImagerUrl: this.ruleForm.firstPicture,
            ciIsFirst: true
          };
          this.ruleForm.commodityImgList.push(objImg);

          // 商品图片
          this.fileList.forEach((item, index) => {
            let objSecond = {
              ciImagerUrl: item.ciImagerUrl,
              ciIsFirst: false
            };
            this.ruleForm.commodityImgList.push(objSecond);
          });
          // 富文本判断
          if (!this.orContent || this.orContent == "<p><br></p>") {
            this.$message.warning("请输入商品详情");
            return;
          } else if (specailTest(this.orContent)) {
            this.$message.warning("富文本内容不能包含特殊字符");
            return;
          } else {
            this.ruleForm.commodityCommodityDetails = this.orContent;
          }
          //   出售时间和有效期日期判断
          if (
            !this.value4Chang(this.value4) ||
            !this.value3Chang(this.value3)
          ) {
            return;
          }
          //   备注
          if (specailTest(this.ruleForm.commodityRemark)) {
            this.$message.warning("备注内容不能包含特殊字符");
          }
          let commodityId = this.$route.query.commodityId;
          if (commodityId) {
            this.editCommodityData();
          } else {
            this.addCommodity();
          }
        }
      });
    },

    childByValue(childValue) {
      //首图
      this.ruleForm.firstPicture = childValue;
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
.OriginalPrice {
  display: flex;
  color: #999999;
  font-size: 14px;
}
</style>
