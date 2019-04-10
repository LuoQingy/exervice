<template>
  <div class="editmenberright">
    <div>
      <el-breadcrumb separator="/" class="content_title">
        <el-breadcrumb-item :to="{ path: '/member/MenberSetting/menberright' }">会员等级设置</el-breadcrumb-item>
        <el-breadcrumb-item>编辑会员权益</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form label-width="120px" class="demo-ruleForm">
      <el-form-item label="特权名称:" required>
        <el-input @change="setName()" v-model="selectList.umriName" style="width:400px;" size="medium" maxlength="20"></el-input>
        <span class="tiptext">{{resultname.length}}/20</span>
      </el-form-item>
      <el-form-item label="特权简介:" required>
        <el-input @change="setIntro" v-model="selectList.umriPrivilegeIntro" style="width:400px" size="medium" maxlength="20"></el-input>
        <span class="tiptext">{{resultIntro.length}}/20</span>
      </el-form-item>
      <el-form-item label="激活图标:" required>
        <upload @childByValue="childByValue" :ruleFormT="ruleForm" :imgurl="ruleForm.activityImageUrl"></upload>
        <p class="tips">请上传规格为60*60的图片</p>
      </el-form-item>
      <el-form-item label="未激活图标:" required>
        <upload @childByValue="childByValueOne" :ruleFormT="ruleForm" :imgurl="ruleForm.umriNonactivateIcon"></upload>
        <p class="tips">请上传规格为60*60的图片</p>
      </el-form-item>
      <el-form-item label="特权介绍:">
        <el-input
          v-model="selectList.umriPrivilegeIntroduce"
          type="textarea"
          style="width:400px"
          :rows="3"
          maxlength="200"
          placeholder="请输入内容"
        ></el-input>
        <span class="tiparea">{{selectList.umriPrivilegeIntroduce.length}}/200</span>
      </el-form-item>
      <el-form-item label="激活等级:" required>
        <el-checkbox-group v-model="ruleForm.type">
          <template v-for="(item,index) in cardList">
            <el-checkbox :label="item.umgId">{{item.umgName}}</el-checkbox>
          </template>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="排序:" required>
        <el-input-number v-model="selectList.umriRank" style="width:120px" controls-position="right" size="medium" type="number"></el-input-number>
      </el-form-item>
      <div class="btndiv">
        <el-button class="btnResult" type="primary" @click="comfileRight">保存</el-button>
        <el-button class="btnResult" type="primary" @click="onReset">取消</el-button>
      </div>
    </el-form>
  </div>
</template>
  
<script>
import upload from "../../UploadImg/activityUpload.vue";
import uploadone from "../../UploadImg/uploadone.vue";
import {specailTest,numberTest} from "@/libs/regular.js";
export default {
  data() {
    return {
      ruleForm: {
        name: "",
        intro: "",
        type: [],
        umriActivateIcon: "", //激活图标url
        umriNonactivateIcon: "", //未激活图标url
        umriPrivilegeIntroduce: "", //特权介绍
        otherImageUrl: "",
        activityImageUrl: ""
      },

      cardList: [], //会员卡等级
      selectList: {
        umriPrivilegeIntroduce: ""
      }, //编辑的会员权益
      selectNameList: [], //编辑时会员卡均为选中状态
      umriId: "",
      resultname: "",
      resultIntro: ""
    };
  },
  components: {
    upload,
    uploadone
  },
  created() {
    this.umriId = this.$route.query.umriId;
  },
  mounted() {
    this.$nextTick(() => {
      this.editRight();
      this.getMemberGradeAll();
    });
  },

  methods: {
    setName() {
      this.resultname = this.selectList.umriName;
    },
    setIntro() {
      this.resultIntro = this.selectList.umriPrivilegeIntro;
    },
    // 编辑会员权益部分
    childByValue(childValue) {
      // 激活图片组件传过来的值
      this.ruleForm.umriActivateIcon = childValue;
      this.selectList.umriActivateIcon = childValue;
    },
    childByValueOne(childValue) {
      // 未激活图片组件传过来的值
      this.ruleForm.umriNonactivateIcon = childValue;
      this.selectList.umriNonactivateIcon = childValue;
    },
    editRight() {
      //获取单个详情
      let _this = this;
      let data = "umriId=" + this.umriId;
      this.$xwhttpAuth({
        url: "/mall/getMemberRightsInterestsInfo",
        method: "post",
        data: data
      })
        .then(res => {
          if (res.data.code == 10000) {
            let resp = res.data.resp;
            _this.selectList = resp;
            _this.ruleForm.activityImageUrl = resp.umriActivateIcon;
            _this.ruleForm.umriNonactivateIcon = resp.umriNonactivateIcon;
            resp.usersMemberGradeList.forEach(val => {
              if (val.umgId) {
                this.ruleForm.type.push(val.umgId);
              }
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getMemberGradeAll() {
      //获取会员等级数据
      let _this = this;
      this.$httpAuth({
        url: "/gm/getMemberGradeAll",
        method: "post",
        data: {
          pageNum: null, //类型：String  必有字段  备注：无
          pageSize: null
        }
      })
        .then(res => {
          if (res.data.code == 10000) {
            let resp = res.data.resp;
            this.cardList = resp;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    comfileRight() {
      //提交编辑会员权益
      let _this = this;
      // 把会员卡id收取出来
      var typeId = this.ruleForm.type;
      let specail = /[@#\$%\^&\*]+/g; //校验特殊字符
      let numCheck = /^[0-9]*$/;
      if (_this.selectList.umriName == "") {
        this.$message.info("特权名称不能为空");
        return;
      } else if (specailTest(this.selectList.umriName)) {
        this.$message.info("特权名称不能为特殊字符");
        return;
      } else if (_this.selectList.umriPrivilegeIntro == "") {
        this.$message.info("特权简介不能为空");
        return;
      } else if (_this.selectList.umriActivateIcon == "") {
        this.$message.info("激活图标不能为空");
        return;
      } else if (_this.selectList.umriNonactivateIcon == "") {
        this.$message.info("未激活图标不能为空");
        return;
      } else if (typeId.length == 0) {
        this.$message.info("激活等级不能为空");
        return;
      } else if (_this.selectList.umriRank == null) {
        this.$message.info("排序不能为空");
        return;
      } else if (!numberTest(_this.selectList.umriRank)) {
        this.$message.info("排序只能输入数字");
        return;
      }
      var data =
        "umriId=" +
        _this.selectList.umriId +
        "&umriName=" +
        this.selectList.umriName;
      data += "&umriPrivilegeIntro=" + this.selectList.umriPrivilegeIntro;
      data += "&umriActivateIcon=" + this.selectList.umriActivateIcon;
      data += "&umriNonactivateIcon=" + this.selectList.umriNonactivateIcon;
      data +=
        "&umriPrivilegeIntroduce=" + this.selectList.umriPrivilegeIntroduce;
      data += "&umgIdArray=" + typeId.join(",");
      data += "&umriRank=" + this.selectList.umriRank;
      this.$xwhttpAuth({
        url: "/mall/updateMemberRightsInteres",
        method: "post",
        data: data
      })
        .then(res => {
          if (res.data.code == 10000) {
            this.$message.success(res.data.resp);
            this.$router.push("/member/MenberSetting/menberright");
          } else  {
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
    onReset() {
      this.$router.push("/member/MenberSetting/menberright");
    }
  }
};
</script>
  
<style lang="less" scoped>
.editmenberright {
  .demo-ruleForm {
    margin: 15px;
    .tiptext {
      position: absolute;
      left: 360px;
      top: 2px;
      color: #666;
    }
    .tiparea {
      position: absolute;
      left: 360px;
      bottom: -30px;
      color: #666;
    }
    img {
      width: 60px;
      height: 60px;
    }
  }
  .dialog-footer {
    margin-left: 200px;
  }
}
.el-checkbox + .el-checkbox {
  margin-left: 0;
}
.el-checkbox {
  margin-right: 20px;
}
.btndiv {
  width: 400px;
  margin: 40px 0 0 120px;
  .btnResult {
    width: 120px;
    height: 40px;
    font-size: 14px;
  }
}
</style>