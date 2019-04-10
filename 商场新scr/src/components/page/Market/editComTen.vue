<template>
  <div class="editComTen">
    <!-- 编辑权益 -->
    <div style="min-width:600px;" class="formdiv">
      <el-form :model="ruleForm" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="商户名称:" required>
          <el-input v-model="ruleForm.merchantName" style="width:400px;" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="商户logo:" required>
          <upload @childByValue="childByValue" :ruleFormT="ruleForm" :imgurl="ruleForm.activityImageUrl"></upload>
          <p class="tips">建议上传140x40px分辨率的图片</p>
        </el-form-item>
        <el-form-item label="铺位:" required>
          <el-input placeholder="输入商户铺位,如有多个填写如L401-L304" v-model="ruleForm.merchantBunk" style="width:400px" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="经营类型:" required>
          <el-select v-model="classifyonevalue" @change="classifyonechang" style="width:200px;" placeholder="请选择">
            <el-option v-for="(item,index) in classifyone" :key="index" :label="item.industryName" :value="item.industryId"></el-option>
          </el-select>
          <el-select v-model="classifytwovalue" style="width:200px;" placeholder="请选择">
            <el-option v-for="(item,index) in classifytwo" :key="index" :label="item.industryName" :value="item.industryId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所在楼层:" required>
          <el-select v-model="ruleForm.floorName" style="width:200px;" placeholder="请选择">
            <el-option v-for="(item,index) in flooroptions" :key="index" :label="item.floorName" :value="item.floorId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式:" required>
          <el-input v-model="ruleForm.merchantPhone" style="width:400px" size="medium"></el-input>
          <span>只可输入数字和'-'</span>
        </el-form-item>
        <el-form-item label="营业时间:" required>
          <el-time-picker
            is-range
            v-model="usedDetailTime"
            value-format="HH:mm:ss"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
          ></el-time-picker>
        </el-form-item>
        <el-form-item label="商户图片:">
          <uploadmore @fileList="getFileList" :fileList="swipeImg" :commodityPic="true" :maxLen="5"></uploadmore>
          <p class="tips">建议上传140x40px分辨率的图片,最多可上传5张</p>
        </el-form-item>
        <el-form-item label="商户简介:">
          <el-input type="textarea" rows="3" v-model="ruleForm.merchantIntro" style="width:400px" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="会员权益:">
          <el-checkbox v-model="statecheck">会员折扣</el-checkbox>
        </el-form-item>
      </el-form>
      <div class="btndiv">
        <el-button class="btnResult" type="primary" @click="onSubmit">保存</el-button>
        <el-button class="btnResult" type="info" @click="goback">取消</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import upload from "../UploadImg/activityUpload.vue";
import uploadmore from "../UploadImg/uploadmore.vue";
import bus from "@/components/common/bus.js";
import {specailTest} from "@/libs/regular.js";
export default {
  data() {
    return {
      classifyoptions: [
        {
          value: "1",
          label: "全部"
        },
        {
          value: "2",
          label: "B1"
        }
      ],
      usedDetailTime: ["00:00:00", "23:59:59"],
      classifyvalue: 1, //分类选中
      ruleForm: {
        name: "",
        intro: "",
        type: []
      },
      classifyone: [],
      classifytwo: [],
      flooroptions: [],
      classifyonevalue:'', //一级分类选中
      classifytwovalue:'', //二级分类选中
      floorvalue: 1, //楼层选中
      statecheck: false, //选中的单选状态
      fileList: [], //多个图片
      swipeImg: [] //商户轮播图
    };
  },
  components: {
    upload,
    uploadmore
  },
  created() {
    this.merchantId = this.$route.query.merchantId;
    this.merchantEcho();
  },
  watch: {
    classifyonevalue() {
      this.getSonIndustry();
    }
  },
  methods: {
    childByValue(childValue) {
      // 激活图标的组件传过来的值
      this.ruleForm.merchantLogo = childValue;
    },
    //获取选择的商品图片信息
    getFileList(data) {
      this.fileList = data;
    },
    merchantEcho() {
      //获取商户数据
      let _this = this;
      this.$httpAuth({
        url: "/gm/merchantEcho",
        method: "get",
        params: {
          merchantId: this.merchantId
        }
      })
        .then(res => {
          this.getMallClassifyAndFloor();
          this.ruleForm = res.data.resp;
          this.ruleForm.activityImageUrl = res.data.resp.merchantLogo;
          this.classifyonevalue =res.data.resp.industryMalls[0]?res.data.resp.industryMalls[0].industryId:null;
          this.classifytwovalue = res.data.resp.industryMalls[1]?res.data.resp.industryMalls[1].industryId:null;
          this.swipeImg = res.data.resp.merchantSlideshows;
          this.statecheck = res.data.resp.merchantIsDiscount;
          if(res.data.resp.merchantBusinessHours){
            this.usedDetailTime = res.data.resp.merchantBusinessHours.split("~");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getSonIndustry() {
      //获取所有经营类型
      let _this = this;
      this.$httpAuth({
        url: "/mall/getSonIndustry",
        method: "post"
      })
        .then(res => {
          res.data.resp.forEach((item, index) => {
            if (item.categoryList.length > 0) {
              this.classifyone.push(item);
            }
          });
          for (let i = 0; i < this.classifyone.length; i++) {
            if (this.classifyone[i].industryId == this.classifyonevalue) {
              this.classifytwo = this.classifyone[i].categoryList;
              break;
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    classifyonechang(val) {
      for (let i = 0; i < this.classifyone.length; i++) {
        if (this.classifyone[i].industryId == val) {
          this.classifytwo = this.classifyone[i].categoryList;
          this.classifytwovalue = this.classifyone[i].categoryList[0].industryId
          break;
        }
      }
    },
    getMallClassifyAndFloor() {
      //获取所有楼层
      let _this = this;
      this.$httpAuth({
        url: "/mall/getMallClassificationAndFloor",
        method: "post"
      })
        .then(res => {
          _this.flooroptions = res.data.resp.floor;
          for (let i = 0; i < _this.flooroptions.length; i++) {
            if (_this.flooroptions[i].floorName == this.ruleForm.floorName) {
              this.ruleForm.floorName = _this.flooroptions[i].floorId;
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    onSubmit() {
      let _this = this;
      let fileList = [];
      for (let i = 0; i < this.fileList.length; i++) {
        //获取改变的商户图片
        fileList.push(this.fileList[i].msUrl);
      }
      let telCheck = /^[\d\-]+$/; //校验数字和—
      if (_this.ruleForm.merchantName == "") {
        this.$message.info("商户名称不能为空");
        return;
      } else if (specailTest(this.ruleForm.merchantName)) {
        this.$message.info("商户名称不能为特殊字符");
        return;
      } else if (_this.ruleForm.merchantLogo == "") {
        this.$message.info("商户logo不能为空");
        return;
      } else if (this.ruleForm.merchantBunk == "") {
        this.$message.info("铺位不能为空");
        return;
      } else if (this.ruleForm.merchantBunk&&specailTest(this.ruleForm.merchantBunk)) {
        this.$message.info("铺位不能为特殊字符");
        return;
      }else if (!this.ruleForm.merchantPhone) {
        this.$message.info("手机号码不能为空");
        return;
      } else if (!telCheck.test(this.ruleForm.merchantPhone)) {
        this.$message.info("手机号码不正确");
        return;
      } else if (!this.ruleForm.floorName) {
        this.$message.info("所在楼层不能为空");
        return;
      }
      let merchantBusinessHours;
      if (!this.usedDetailTime) {
        this.$message.info("营业时间不能为空");
        return;
      } else {
        let arr = [...this.usedDetailTime];
        merchantBusinessHours = arr.join("~");
      }
      this.$httpAuth({
        url: "/gm/updateMerchantShop",
        method: "post",
        data: {
          merchantId: this.merchantId,
          merchantName: this.ruleForm.merchantName,
          merchantLogo: this.ruleForm.merchantLogo,
          merchantBunk: this.ruleForm.merchantBunk,
          industryId: this.classifytwovalue,
          foolId: this.ruleForm.floorName,
          merchantPhone: this.ruleForm.merchantPhone,
          merchantBusinessHours,
          merchantIntro: this.ruleForm.merchantIntro,
          merchantSlideshowsUrl: fileList,
          merchantIsDiscount: this.statecheck
        }
      })
        .then(res => {
          if (res.data.code == 10000) {
            this.$message.success(res.data.resp);
            this.$router.push("/market/comTen");
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //返回
    goback() {
      bus.$emit("closetags");
      this.$router.push("/market/comTen");
    }
  }
};
</script>
<style lang="less" scoped>
.btndiv {
  width: 200px;
  margin: auto;
}
.editComTen {
  padding-bottom: 20px;
}
</style>
