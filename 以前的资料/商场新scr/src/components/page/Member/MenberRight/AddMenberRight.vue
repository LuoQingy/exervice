<template>
  <div class="addmemberright">
    <div>
      <el-breadcrumb separator="/" class="content_title">
        <el-breadcrumb-item :to="{ path: '/member/MenberSetting/menberright' }">会员等级设置</el-breadcrumb-item>
        <el-breadcrumb-item>添加会员权益</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="formdiv">
      <el-form ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="特权名称:" required>
          <el-input v-model="ruleForm.name" style="width:400px;" size="medium" maxlength="20"></el-input>
          <span class="tiptext">{{ruleForm.name.length}}/20</span>
        </el-form-item>
        <el-form-item label="特权简介:" required>
          <el-input v-model="ruleForm.intro" style="width:400px" size="medium" maxlength="20"></el-input>
          <span class="tiptext">{{ruleForm.intro.length}}/20</span>
        </el-form-item>
        <el-form-item label="激活图标:" required>
          <upload @childByValue="childByValue" :checksize="checksize"></upload>
          <p class="tips">请上传规格为60*60的图片</p>
        </el-form-item>
        <el-form-item label="未激活图标:" required>
          <uploadone @childByValueOne="childByValueOne" :checksize="checksize" :ruleFormT="ruleForm"></uploadone>
          <p class="tips">请上传规格为60*60的图片</p>
        </el-form-item>
        <el-form-item label="特权介绍:">
          <el-input type="textarea" style="width:400px" :rows="3" placeholder="请输入内容" maxlength="200" v-model="umriPrivilegeIntroduce"></el-input>
          <span class="tiparea">{{umriPrivilegeIntroduce.length}}/200</span>
        </el-form-item>
        <el-form-item label="激活等级:" required>
          <el-checkbox-group v-model="ruleForm.type">
            <template v-for="(item,index) in cardList">
              <el-checkbox :label="item.umgId">{{item.umgName}}</el-checkbox>
            </template>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="排序:" required>
          <el-input-number v-model="ruleForm.umriRank" style="width:120px" controls-position="right" size="medium" type="number"></el-input-number>
        </el-form-item>
      </el-form>
    </div>
    <div class="btndiv">
      <el-button class="btnResult" type="primary" @click="onSubmit">保存</el-button>
      <el-button class="btnResult" type="primary" @click="onReset">取消</el-button>
    </div>
  </div>
</template>
  
<script>
import upload from "../../UploadImg/upload.vue";
import uploadone from "../../UploadImg/uploadone.vue";
import {specailTest,numberTest} from "@/libs/regular.js";
export default {
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      checksize: true,
      ruleForm: {
        name: "",
        intro: "",
        type: [],
        otherImageUrl: "",
        umriRank: null
      },

      umriActivateIcon: "", //激活图标url
      umriNonactivateIcon: "", //未激活图标url
      umriPrivilegeIntroduce: "", //特权介绍
      cardList: [] //会员等级
    };
  },
  mounted() {
    this.getMemberGradeAll();
  },
  components: {
    upload,
    uploadone
  },
  methods: {
    childByValue(childValue) {
      // 激活图标的组件传过来的值
      this.umriActivateIcon = childValue;
    },
    childByValueOne(childValue) {
      // 未激活图标的组件传过来的值
      this.umriNonactivateIcon = childValue;
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
            _this.cardList = resp;
          } else  {
           this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    onSubmit() {
      let _this = this;
      // 提取选中的会员卡的id
      let typeId = this.ruleForm.type;
      if (_this.ruleForm.name == "") {
        this.$message.info("特权名称不能为空");
        return;
      } else if (specailTest(this.ruleForm.name)) {
        this.$message.info("特权名称不能为特殊字符和空格");
        return;
      } else if (_this.ruleForm.intro == "") {
        this.$message.info("特权简介不能为空");
        return;
      } else if (specailTest(this.ruleForm.intro)) {
        this.$message.info("特权简介不能为特殊字符和空格");
        return;
      } else if (_this.umriActivateIcon == "") {
        this.$message.info("激活图标不能为空");
        return;
      } else if (_this.umriNonactivateIcon == "") {
        this.$message.info("未激活图标不能为空");
        return;
      } else if (typeId.length == 0) {
        this.$message.info("激活等级不能为空");
        return;
      } else if (_this.ruleForm.umriRank == null) {
        this.$message.info("排序不能为空");
        return;
      } else if (!numberTest(_this.ruleForm.umriRank)) {
        this.$message.info("排序只能输入数字");
        return;
      }
      var data = "&umriName=" + this.ruleForm.name;
      data += "&umriPrivilegeIntro=" + this.ruleForm.intro;
      data += "&umriActivateIcon=" + this.umriActivateIcon;
      data += "&umriNonactivateIcon=" + this.umriNonactivateIcon;
      data += "&umriPrivilegeIntroduce=" + this.umriPrivilegeIntroduce;
      data += "&umgIdArray=" + typeId.join(",");
      data += "&umriRank=" + this.ruleForm.umriRank;
      console.log(data);
      this.$xwhttpAuth({
        url: "/mall/addMemberRightsInterests",
        method: "post",
        data: data
      })
        .then(res => {
           if (res.data.code == 10000) {
            let resp = res.data.resp;
            this.$message({
              showClose: true,
              message: "添加成功",
              type: "success"
            });
            _this.$router.push("/member/MenberSetting/menberright");
          }else{
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
  
<style scoped lang='less'>
.addmemberright {
  .formdiv {
    width: 98%;
    margin-top: 15px;
    .demo-ruleForm {
      margin-top: 20px;
      position: relative;
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
    margin: 40px 0 0 120px;
    .btnResult {
      width: 120px;
      height: 40px;
      font-size: 14px;
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