<template>
    <div class="addPublicMenu">
        <div class="formdiv">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
                <el-form-item label="菜单名称:" prop="name">
                    <el-input v-model="ruleForm.name" style="width:400px;" size="medium" maxlength="5"></el-input>
                    <span class="tiptext">{{ruleForm.name.length}}/5</span>
                </el-form-item>
                <el-form-item label="菜单内容:" required>
                    <el-radio-group v-model="ruleForm.type">
                        <el-radio :label="item.value" v-for="(item,index) in menuContent" :key="index">{{item.label}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="网页地址:" required v-if="ruleForm.type==='view'">
                    <el-input v-model="ruleForm.urlname" style="width:400px;" size="medium"></el-input>
                    <span class="urltip">订阅者点击该菜单会跳转到以下链接</span>
                </el-form-item>
                <el-form-item label="文本内容:" required v-if="ruleForm.type==='click'">
                    <el-input type="textarea" rows="5" v-model="ruleForm.textMsg" style="width:400px;"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="comfileRight()">保存</el-button>
                <el-button type="primary" @click="goback">返回</el-button>
            </div>
        </div>
    </div>
</template>
  
<script>
import upload from "../UploadImg/publicMenuUpload.vue";
import bus from "@/components/common/bus.js";
import {numberTest,specailTest,websiteTest} from "@/libs/regular.js";
export default {
  data() {
    return {
      ruleForm: {
        name: "",
        urlname: "",
        content: "",
        type: "view",
        activityImageUrl: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入菜单名称", trigger: "blur" },
          { min: 1, max: 5, message: "长度在 1 到 5 个字符", trigger: "blur" }
        ],
        urlname: [
          { required: true, message: "请输入网页地址", trigger: "blur" },
          {
            min: 1,
            max: 5,
            message: "请以http://或https://开头",
            trigger: "blur"
          }
        ]
      },
      menuContent: [
        //菜单类型
        { label: "网址", value: "view" },
        { label: "文本", value: "click" }
      ],
      inLinkValue: "",
      inLinkValue1: "",
    };
  },
  components: {
    upload
  },
  created() {
    this.parentid = this.$route.query.parentid;
  },
  methods: {
    //返回
    goback() {
      bus.$emit("closetags");
      this.$router.push("/system/publicmenu");
    },
    // 保存
    comfileRight() {
      //提交编辑
      let _this = this;
      var data = {
        name: this.ruleForm.name,
        type: this.ruleForm.type,
        parentId: this.parentid
      };
      let specail = /[@#\$%\^&\*\s]+/g; //校验特殊字符
      if (this.ruleForm.name == "") {
        this.$message.info("菜单名称不能为空");
        return;
      } else if (specailTest(this.ruleForm.name)) {
        this.$message.info("菜单名称不能包含特殊字符和空格");
        return;
      }
      if (this.ruleForm.type==='view') {
        if (this.ruleForm.urlname == "") {
          this.$message.info("网址不能为空");
          return;
        } else if (!websiteTest(this.ruleForm.urlname)) {
          this.$message.info("输入的网址需以http://或https://开头");
          return;
        }
        data.url = this.ruleForm.urlname;
      } else if (this.ruleForm.type==='click') {
        if (this.ruleForm.textMsg == "") {
          this.$message.info("文本不能为空");
          return;
        }
        data.textMsg = this.ruleForm.textMsg;
      }

      this.$httpAuth({
        url: "/mall/addNopublic",
        method: "post",
        data: data
      })
        .then(res => {
          if (res.data.code == 10000) {
            this.$message.success(res.data.resp);
            this.goback();
          } else {
            this.$message.success(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
  
<style lang="less" scoped>
.addPublicMenu {
  .formdiv {
    margin-top: 20px;
    .demo-ruleForm {
      margin-top: 20px;
      .tiptext {
        position: absolute;
        left: 360px;
        top: 2px;
        color: #666;
      }
      .urltip {
        color: #666;
      }
    }
    .dialog-footer {
      margin-left: 120px;
      margin-bottom: 40px;
    }
  }
  .footerblock {
    margin-top: 20px;
    text-align: right;
  }
}
</style>