<template>
  <div>
    <div>
      <el-breadcrumb separator="/" class="content_title">
        <el-breadcrumb-item>发布商品</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="商品类型">
          <el-select v-model="form.mgstId" :disabled="chakan">
            <template v-for="item in mgstList">
              <el-option :label="item.mgstName" :value="item.mgstId"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" prop="mgName">
          <el-input style="width:300px;" :readonly="chakan" v-model="form.mgName" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="会员销量" prop="mgSales">
          <span>商品真实销量加</span>
          <el-input style="width:80px;" :readonly="chakan" type="text" size="mini" v-model="form.mgSales"></el-input>
        </el-form-item>
        <el-form-item label="商品主图">
          <elupload @uploadimg="upload" @delimg="delimg" :uploadDisabled="chakan" :imglist="imglist"></elupload>
          <p>请上传品牌logo，文件格式GIF,JPG,JPEG,PNG文件大小10M以内</p>
          <p>建议尺寸120px*120px,主要展示在商品列表页</p>
        </el-form-item>
        <el-form-item label="商品图片">
          <elupload @uploadimg="uploadlist" @delimg="moredelimg" :uploadDisabled="chakan" :imglist="moreimglist"></elupload>
          <p>请上传品牌logo，文件格式GIF,JPG,JPEG,PNG文件大小10M以内</p>
          <p>建议尺寸300px*120px主要展示在商品详情页。最多5张</p>
        </el-form-item>
        <el-form-item label="商品简介">
          <wangeditor
            editorId="abstract"
            textId="abstract"
            :isLoading="isLoading"
            :editorContent="mgGoodsDetails"
            @editorContent="abstractchang"
            :disableEditor="chakan"
          ></wangeditor>
        </el-form-item>
        <el-form-item label="商品说明">
          <wangeditor @editorContent="explainchang" :disableEditor="chakan" :isLoading="isLoading" :editorContent="mgUsageRule"></wangeditor>
        </el-form-item>
        <el-form-item label="购买权限">
          <el-checkbox-group v-model="umgIdlist" :disabled="chakan">
            <template v-for="item in membergradelist">
              <el-checkbox :label="item.umgId">{{item.umgName}}</el-checkbox>
            </template>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="出售方式">
          <el-radio-group v-model="mgGoodsType" @change="mgGoodsTypeChang" :disabled="chakan">
            <el-radio label="1">现金</el-radio>
            <el-radio label="2">积分</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="price">
          <el-form-item label="现价" prop="mgCurrentPrice">
            <el-input
              style="width:80px;"
              type="text"
              :readonly="chakan"
              :disabled="mgGoodsType!=='1'"
              size="mini"
              v-model="form.mgCurrentPrice"
            ></el-input>
            <span>元</span>
          </el-form-item>
          <el-form-item label="积分" class="price_r" prop="mgCurrentConin">
            <el-input
              style="width:80px;"
              type="text"
              :readonly="chakan"
              :disabled="mgGoodsType!=='2'"
              size="mini"
              v-model="form.mgCurrentConin"
            ></el-input>
            <span>分</span>
          </el-form-item>
        </div>
        <div class="price">
          <el-form-item label="原价" prop="mgOriginalPrice">
            <el-input
              style="width:80px;"
              type="text"
              :readonly="chakan"
              :disabled="mgGoodsType!=='1'"
              size="mini"
              v-model="form.mgOriginalPrice"
            ></el-input>
            <span>元</span>
          </el-form-item>
          <el-form-item label="原价" class="price_r" prop="mgOriginalCoin">
            <el-input
              style="width:80px;"
              type="text"
              :readonly="chakan"
              :disabled="mgGoodsType!=='2'"
              size="mini"
              v-model="form.mgOriginalCoin"
            ></el-input>
            <span>分</span>
          </el-form-item>
        </div>
        <el-form-item label="限购数量" prop="mgQuotaNum">
          <el-input style="width:80px;" type="text" :readonly="chakan" size="mini" v-model="form.mgQuotaNum"></el-input>
        </el-form-item>
        <el-form-item label="取货方式">
          <el-checkbox v-model="form.mgClaimGoodsType" :disabled="true">自提</el-checkbox>
        </el-form-item>
        <el-form-item label="可使用优惠">
          <el-checkbox v-model="form.mgIsUseRightsInterests" :disabled="chakan">会员权益</el-checkbox>
          <el-checkbox v-model="form.mgIsUseCoinDeduction" :disabled="chakan">积分抵扣</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button v-if="mgStatus !=1&&!chakan" type="primary" @click="onSubmit('form')" size="medium">提交申请</el-button>
          <el-button v-if="mgStatus ==1&&GoodsReview" type="primary" @click="showdialog" size="medium">审核商品</el-button>
        </el-form-item>
      </el-form>
    </div>
    <GoodsDialog :show="showdia" :mgId="goodsid" @close="closedialog"></GoodsDialog>
  </div>
</template>
  
<script>
import wangeditor from "../../common/wangeditor";
import elupload from "../UploadImg/Elupload";
import GoodsDialog from "./GoodsDialog";
import bus from "@/components/common/bus.js";
import { moneyTest, numberTest } from "@/libs/regular.js";
export default {
  components: {
    wangeditor,
    elupload,
    GoodsDialog
  },
  data() {
    var coinNumbertest = (rules, val, callback) => {
      if (numberTest(val)) {
        callback();
      } else if (val) {
        callback(new Error("请输入整数"));
      } else {
        callback();
      }
    };
    var Conintest = (rules, val, callback) => {
      if (this.mgGoodsType === "2") {
        if (numberTest(val)) {
          callback();
        } else if (val) {
          callback(new Error("请输入整数"));
        } else {
          callback(new Error("请输入积分"));
        }
      } else {
        callback();
      }
    };
    var price = (rules, val, callback) => {
      if (this.mgGoodsType === "1") {
        if (moneyTest(val)) {
          callback();
        } else if (val) {
          callback(new Error("请输入正确的金额"));
        } else {
          callback(new Error("请输入金额"));
        }
      } else {
        callback();
      }
    };
    return {
      chakan: false,
      GoodsReview: false,
      showdia: false, //显示审核窗口
      goodsid: "", //商品id
      imglist: [], //商品主图
      moreimglist: [], //商品图片
      mgstList: [], //商品分类
      mgGoodsType: "1",
      isLoading: true, //富文本编辑是否显示loading
      membergradelist: [], //选择会员
      mgGoodsDetails: "", //商品简介
      GoodsDetails: "", //商品简介
      mgUsageRule: "", //商品说明
      UsageRule: "", //商品说明
      mgStatus: "", //商品状态
      form: {
        mgstId: "", //分类id
        mgSales: "", //销量
        mgName: "", //商品名称
        mgOriginalPrice: "", //原价
        mgCurrentPrice: "", //现价
        mgOriginalCoin: "", //原积分
        mgCurrentConin: "", //现积分
        mgIsQuota: true, //是否限购
        mgQuotaNum: "", //限购数量
        mgClaimGoodsType: 1, //购买方式
        mgIsUseRightsInterests: false, //会员权益
        mgIsUseCoinDeduction: false //积分抵扣
      },
      rules: {
        mgName: [
          {
            required: true,
            message: "必填项,请输入",
            trigger: "blur"
          }
        ],
        mgSales: [{ validator: coinNumbertest, trigger: "blur" }],
        mgQuotaNum: [{ validator: coinNumbertest, trigger: "blur" }],
        mgOriginalCoin: [{ validator: Conintest, trigger: "change" }], //现积分
        mgCurrentConin: [{ validator: Conintest, trigger: "change" }], //原积分
        mgCurrentPrice: [{ validator: price, trigger: "change" }], //原价
        mgOriginalPrice: [{ validator: price, trigger: "change" }] //现价
      },
      checkList: [], //
      umgIdlist: [], //
      checked: "" //
    };
  },
  created() {
    if (this.$route.query.goodsid) {
      this.goodsid = this.$route.query.goodsid;
      this.chakan = this.$route.query.chakan ? true : false;
      this.GoodsReview = this.$route.query.GoodsReview ? true : false;
      this.getMallGoodsById();
    }
    this.getMallGoodsShowType();
    this.getMemberGradeAll();
  },
  methods: {
    // 添加商品或更新商品
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        let form = this.form;
        let goodsRsUsersMemberGradeList = [];
        this.umgIdlist.forEach(val => {
          goodsRsUsersMemberGradeList.push({ umgId: val });
        });
        if (valid) {
          let url;
          let formData;
          let goods = {
            mgName: form.mgName, //类型：String  必有字段  备注：商品名称
            mgSales: form.mgSales, //类型：Number  必有字段  备注：商品销量
            mgGoodsDetails: this.GoodsDetails, //类型：String  必有字段  备注：商品简介
            mgUsageRule: this.UsageRule, //类型：String  必有字段  备注：商品说明
            mgGoodsType: this.mgGoodsType, //类型：Number  必有字段  备注：商品类型：1=现金 2=积分
            mgOriginalPrice: form.mgOriginalPrice, //类型：Number  必有字段  备注：原价金额
            mgCurrentPrice: form.mgCurrentPrice, //类型：Number  必有字段  备注：现价金额
            mgOriginalCoin: form.mgOriginalCoin, //类型：Number  必有字段  备注：原价积分
            mgCurrentConin: form.mgCurrentConin, //类型：Number  必有字段  备注：现价积分
            mgIsQuota: form.mgQuotaNum ? true : false, //类型：Boolean  必有字段  备注：是否限购
            mgQuotaNum: form.mgQuotaNum, //类型：Number  必有字段  备注：限购数量
            mgClaimGoodsType: 1, //类型：Number  必有字段  备注：取货方式(1:自提 )
            mgIsUseRightsInterests: form.mgIsUseRightsInterests, //类型：Boolean  必有字段  备注：是否开启会员权益
            mgIsUseCoinDeduction: form.mgIsUseCoinDeduction //类型：Boolean  必有字段  备注：是否开启积分抵扣
          };
          if (this.goodsid) {
            url = "gm/updateMallGoods";
            formData = {
              mgId: this.goodsid,
              ...goods,
              mallGoodsShowTypeRsMallGoods: {
                mgstId: form.mgstId
              },
              mallGoodsImagesList: [...this.imglist, ...this.moreimglist],
              mallGoodsRsUsersMemberGradeList: [...goodsRsUsersMemberGradeList]
            };
          } else {
            url = "gm/addMallGoods";
            formData = {
              mgstId: form.mgstId,
              goods: goods,
              goodsImagesList: [...this.imglist, ...this.moreimglist],
              goodsRsUsersMemberGradeList
            };
          }
          this.$httpAuth.post(url, formData).then(res => {
            if (res.data.code === 10000) {
              this.$message({
                message: res.data.resp,
                type: "success"
              });
              bus.$emit("closetags");
              this.$router.push("/shoppingmall/release");
            } else {
              this.$message({
                message: res.data.msg,
                type: "warning"
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 获取商品分类
    getMallGoodsShowType() {
      this.$httpAuth
        .post("gm/getMallGoodsShowType")
        .then(result => {
          if (result.data.code === 10000) {
            this.mgstList = result.data.resp;
            this.form.mgstId = result.data.resp[0].mgstId;
          }
        })
        .catch(err => {});
    },
    // 获取会员等级
    getMemberGradeAll() {
      this.$httpAuth
        .post("gm/getMemberGradeAll", {
          mallId: 1,
          pageNum: null, //类型：String  必有字段  备注：无
          pageSize: null
        })
        .then(result => {
          if (result.data.code === 10000) {
            this.membergradelist = result.data.resp;
          }
        })
        .catch(err => {});
    },
    // 获取商品详情
    getMallGoodsById() {
      this.$httpAuth
        .post("gm/getMallGoodsById", {
          mgId: this.goodsid
        })
        .then(result => {
          if (result.data.code === 10000) {
            let data = result.data.resp;
            let umgIdlist = [];
            let imglist = [];
            let moreimglist = [];
            data.mallGoodsRsUsersMemberGradeList.forEach(val => {
              umgIdlist.push(val.umgId);
            });
            data.mallGoodsImagesList.forEach(val => {
              if (val.mgiIsChiefly) {
                imglist.push(val);
              } else {
                moreimglist.push(val);
              }
            });
            this.mgGoodsType = data.mgGoodsType.toString();
            this.mgGoodsDetails = data.mgGoodsDetails;
            this.mgUsageRule = data.mgUsageRule;
            this.umgIdlist = umgIdlist;
            this.imglist = imglist;
            this.moreimglist = moreimglist;
            this.mgStatus = data.mgStatus;
            this.form = {
              mgstId: data.mallGoodsShowTypeRsMallGoods.mgstId,
              mgName: data.mgName,
              mgSales: data.mgSales,
              mgIsUseRightsInterests: data.mgIsUseRightsInterests,
              mgIsUseCoinDeduction: data.mgIsUseCoinDeduction,
              mgClaimGoodsType: data.mgClaimGoodsType,
              mgCurrentPrice: data.mgCurrentPrice,
              mgCurrentConin: data.mgCurrentConin,
              mgOriginalPrice: data.mgOriginalPrice,
              mgOriginalCoin: data.mgOriginalCoin,
              mgQuotaNum: data.mgIsQuota ? data.mgQuotaNum : ""
            };
          } else {
            this.$message({
              message: result.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    // 商品主图
    upload(val) {
      this.imglist.splice(0, 1, { mgiImagesUrl: val, mgiIsChiefly: true });
    },
    delimg(val) {
      if (this.chakan) {
        return;
      }
      this.imglist.splice(val, 1);
    },
    // 商品图片
    uploadlist(val) {
      if (this.moreimglist.length >= 5) {
        this.uploadDisabled = true;
        this.$message({
          message: "最多5张图片",
          type: "warning"
        });
      } else {
        this.moreimglist.push({ mgiImagesUrl: val, mgiIsChiefly: false });
      }
    },
    moredelimg(val) {
      if (this.chakan) {
        return;
      }
      this.moreimglist.splice(val, 1);
      this.uploadDisabled = false;
    },
    // 商品简介
    abstractchang(html) {
      this.GoodsDetails = html;
    },
    // 商品说明
    explainchang(html) {
      this.UsageRule = html;
    },
    mgGoodsTypeChang(val) {
      if (val === "1") {
        this.form.mgOriginalCoin = null;
        this.form.mgCurrentConin = null;
      } else if (val === "2") {
        this.form.mgOriginalPrice = null;
        this.form.mgCurrentPrice = null;
      }
    },
    closedialog(back){
      this.showdia = !this.showdia;
      if (back) {
        bus.$emit("closetags");
        this.$router.push("/shoppingmall/release");
      }
    },
    // 显示审核窗口
    showdialog() {
      this.showdia = !this.showdia;
    }
  }
};
</script>
  
<style scoped lang="less">
.form {
  margin-top: 20px;
  .price {
    display: flex;
    .price_r {
      margin-left: 40px;
    }
  }
}
.el-checkbox + .el-checkbox {
  margin-left: 0;
}
.el-checkbox {
  margin-right: 20px;
}
</style>