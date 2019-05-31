<template>
  <div class="addmemberright">
    <div>
      <el-breadcrumb separator="/" class="content_title">
        <el-breadcrumb-item>添加商户</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="formdiv">
      <el-form label-width="120px" class="demo-ruleForm">
        <el-form-item label="商户名称:" required>
          <el-input v-model="ruleForm.name" style="width:400px;" maxlength="20" size="medium">
            <span slot='suffix'>{{ruleForm.name.length}}/20</span>
          </el-input>
        </el-form-item>
        <el-form-item label="登录账号:" required>
          <el-input v-model="ruleForm.account" style="width:400px" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="登录密码:" required>
          <el-input v-model="ruleForm.pwd" style="width:400px" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="序号:" required>
          <el-input v-model="ruleForm.sort" style="width:400px" size="medium" placeholder="请输入排序数字，数值小的排在前边"></el-input>
        </el-form-item>
        <el-form-item label="手机号码:" required>
          <el-input v-model="ruleForm.merchantPhone" style="width:400px" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="商户logo:" required>
          <upload @childByValue="childByValue"></upload>
          <p class="tips">建议上传140x40px分辨率的图片</p>
        </el-form-item>
        <el-form-item label="铺位:" required>
          <el-input placeholder="输入商户铺位,如有多个填写如L401-L304" v-model="ruleForm.store" style="width:400px" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="经营分类:" required>
          <el-select v-model="classifyonevalue" style="width:200px;" placeholder="请选择一级分类">
            <el-option v-for="(item,index) in classifyone" :key="index" :label="item.industryName" :value="item.industryId"></el-option>
          </el-select>
          <el-select v-if="classifytwo.length>0" v-model="classifytwovalue" style="width:200px;" placeholder="请选择二级分类">
            <el-option v-for="(item,index) in classifytwo" :key="index" :label="item.industryName" :value="item.industryId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所在楼层:" required>
          <el-select v-model="floorvalue" style="width:200px;" placeholder="请选择">
            <el-option v-for="(item,index) in flooroptions" :key="index" :label="item.floorName" :value="item.floorId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商户状态:">
          <el-radio-group v-model="statecheck">
            <el-radio :label="item.value" v-for="(item,index) in userStateList" :key="index">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <div class="btndiv">
      <el-button class="btnResult" type="primary" @click="onSubmit">保存</el-button>
      <el-button class="btnResult" type="info" @click="goback">取消</el-button>
    </div>
  </div>
</template>
  
<script>
import upload from "../UploadImg/upload.vue";
import bus from "@/components/common/bus.js";
import {specailTest,numberTest,telTest} from "@/libs/regular.js";
export default {
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      ruleForm: {
        name: "",
        account: "",
        pwd: "",
        store: "",
        sort: null
      },
      umriActivateIcon: "", //激活图标url
      classifyone: [],
      classifytwo: [],
      flooroptions: [],
      userStateList: [
        {
          value: "1",
          label: "启用"
        },
        {
          value: "2",
          label: "停用"
        }
      ],
      classifyonevalue: "", //一级分类选中
      classifytwovalue: "", //二级分类选中
      floorvalue: "", //楼层选中
      statecheck: "1", //选中的单选状态

      cardList: [], //会员等级
      merchantId: 1 //店铺id
    };
  },
  created() {},
  mounted() {
    this.getSonIndustry();
    this.getMallClassifyAndFloor();
  },
  components: {
    upload
  },
  watch: {
    classifyonevalue() {
      for (let i = 0; i < this.classifyone.length; i++) {
        if (this.classifyone[i].industryId == this.classifyonevalue) {
          this.classifytwo = this.classifyone[i].categoryList;
          this.classifytwovalue = "";
          break;
        }
      }
    }
  },
  methods: {
    childByValue(childValue) {
      // 激活图标的组件传过来的值
      this.umriActivateIcon = childValue;
    },
    getSonIndustry() {
      //获取所有经营类型
      let _this = this;
      this.$httpAuth({
        url: "/mall/getSonIndustry",
        method: "post"
      })
        .then(res => {
          let resp = res.data.resp;
          resp.forEach((item, index) => {
            if (item.categoryList.length > 0) {
              this.classifyone.push(item);
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
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
        })
        .catch(err => {
          console.log(err);
        });
    },
    onSubmit() {
      let _this = this;
      let industryIds = [];
      let telCheck = /^1[34578]\d{9}$/; //校验数字
      if (_this.ruleForm.name == "") {
        this.$message.info("商户名称不能为空");
        return;
      } else if (specailTest(this.ruleForm.name)) {
        this.$message.info("商户名称不能为特殊字符");
        return;
      } else if (_this.ruleForm.account == "") {
        this.$message.info("登录账号不能为空");
        return;
      } else if (this.ruleForm.pwd == "") {
        this.$message.info("登录密码不能为空");
        return;
      } else if (this.ruleForm.sort!='0'&&!this.ruleForm.sort) {
        this.$message.info("排序不能为空");
        return;
      } else if (!numberTest(this.ruleForm.sort)) {
        this.$message.info("排序只能输入数字");
        return;
      } else if (!this.ruleForm.merchantPhone) {
        this.$message.info("手机号码不能为空");
        return;
      } else if (!telTest(this.ruleForm.merchantPhone)) {
        this.$message.info("手机号码不正确");
        return;
      } else if (_this.umriActivateIcon == null) {
        this.$message.info("商户logo不能为空");
        return;
      } else if (this.classifytwovalue == "") {
        this.$message.info("请选择完整的经营分类");
        return;
      } else if (!this.ruleForm.store) {
        this.$message.info("铺位不能为空");
        return;
      } else if (this.ruleForm.store && specailTest(this.ruleForm.store)) {
        this.$message.info("铺位不能为特殊字符");
        return;
      } else if (!this.floorvalue) {
        this.$message.info("所在楼层不能为空");
        return;
      }

      industryIds = [this.classifyonevalue, this.classifytwovalue];

      let data = {
        merchantName: this.ruleForm.name,
        username: this.ruleForm.account,
        password: this.ruleForm.pwd,
        sort: this.ruleForm.sort,
        merchantPhone: this.ruleForm.merchantPhone,
        merchantLogo: this.umriActivateIcon,
        foolId: this.floorvalue,
        merchantStatus: this.statecheck,
        industryIds: industryIds,
        merchantBunk: this.ruleForm.store
      };
      this.$httpAuth({
        url: "/mall/mallAddMerchant",
        method: "post",
        data: data
      })
        .then(res => {
          if (res.data.code == 10000) {
            let resp = res.data.resp;
            this.$message.success(res.data.resp);
            _this.$router.push("/market/comTen");
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
  
<style scoped lang='less'>
.addmemberright {
  .formdiv {
    width: 98%;
    margin-top: 20px;
    .demo-ruleForm {
      margin-top: 20px;
      position: relative;
      .tiptext {
        position: absolute;
        left: 360px;
        top: 2px;
        color: #666;
      }
      .upload_box {
        width: 100px;
        height: 100px;
        display: inline-block;
        border: 1px dashed #cccccc;
        .upload_icon {
          font-size: 30px;
          color: #969696;
          line-height: 100px;
        }
      }
      .tips {
        color: #969696;
      }
    }
  }
  .btndiv {
    width: 400px;
    margin: 40px auto;
    .btnResult {
      width: 120px;
      height: 40px;
      font-size: 14px;
    }
  }
}
</style>