<template>
  <div id="addActivity">
    <h3>修改公告</h3>
    <div class="addActivity-content">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="公告标题：" required>
          <div class="activity-name">
            <input
              ref="inputref"
              maxlength="20"
              v-model="ruleForm.annTitle"
              class="fl"
              style="width:300px;color:#fff;"
              :style="styleColor"
              placeholder="请输入公告名称(最多输入20个字符)"
            >
            <el-color-picker class="fl" v-model="color" @change="changeColor"></el-color-picker>
          </div>
        </el-form-item>
        <el-form-item label="公告排序：" required>
          <el-input v-model="ruleForm.annRank" size="mini" style="width:300px;" placeholder="序号越低排名越靠前,相同数值按顺序排列"></el-input>
        </el-form-item>
        <el-form-item label="公告启用：" required>
          <el-radio-group v-model="radioChecked">
            <el-radio label="1">启用</el-radio>
            <el-radio label="2">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="有效时间段：" required>
          <div>
            <el-date-picker
              @focus="setTime"
              @blur="leaveTime"
              v-model="value4"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="公告内容：" required>
          <div>
            <el-radio-group v-model="radioChecked2">
              <el-radio label="1">链接跳转</el-radio>
              <el-radio label="2">富文本内容</el-radio>
            </el-radio-group>
          </div>
          <div v-show="radioChecked2=='1'">
            <div>
              <el-button type="primary" @click="showPop" style="width:125px;height:30px" size="mini">关联链接</el-button>
            </div>
            <el-input size="mini" style="width:300px;margin-top:10px;" placeholder="请输入关联的链接" v-model="ruleForm.annUrl"></el-input>
          </div>
          <div v-show="radioChecked2=='2'&& timestate">
            <wangeditor
              @editorContent="getEditorContent"
              :editorContent="editorContent"
              :customConfig="customConfig"
              :isLoading="isLoading"
              :disableEditor="disableEditor"
            ></wangeditor>
          </div>
        </el-form-item>
        <el-form-item>
          <div style="margin-top:10px;">
            <el-button type="primary" @click="submitForm()">保存</el-button>
            <el-button type="info" @click="onReset">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <search-pop v-if="isShowPop" @closePop="closePop" @confirmSelect="confirmSelect"></search-pop>
  </div>
</template>

<script>
import wangeditor from "../../common/wangeditor.vue";
import SearchPop from "../allComponents/SearchPop";
import forlataTime from "../../../../static/js/forlataTime.js";
import { specailTest, numberTest } from "@/libs/regular.js";
export default {
  components: { wangeditor, SearchPop },
  data() {
    return {
      isShowPop: false,
      ruleForm: {
        annTitle: "", //公告名
        annRank: "", //公告排名
        annStartTime: "",
        annEndTime: "",
        isuse: false, //公告停用启用状态传值
        activityStartTime: "", //开始时间传值
        activityEndTime: "" //结束时间传值
      },
      styleColor: {
        color: "#ff0000" //控制当前页面的标题颜色显示
      },
      color: "#ff0000", //更改的样色
      radioChecked: null, //停用启用状态
      radioChecked2: null, //链接或文本的选择
      rules: {
        name: [
          { required: true, message: "请输入公告名称", trigger: "blur" },
          { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" }
        ],
        intro: [
          { required: true, message: "请输入特权简介", trigger: "blur" },
          { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" }
        ]
      },
      value4: [], //开始和结束时间
      richtext: "", //富文本的值
      // permanent:false,//永久有效状态
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
      timestate: true //避免时间和富文本遮盖问题
    };
  },
  created() {
    this.annId = this.$route.query.anId;
  },
  mounted() {
    this.getAnInfo();
  },
  methods: {
    changeColor() {
      //选择链接 和副文本狂  选择改变公告标题的字体颜色
      this.styleColor.color = this.color;
    },
    getEditorContent(val) {
      //富文本的值
      this.orContent = val;
    },
    setTime() {
      this.timestate = false;
    },
    leaveTime() {
      this.timestate = true;
    },
    getAnInfo() {
      let _this = this;
      let data = "annId=" + _this.annId;
      this.$xwhttpAuth({
        url: "/mall/getAnnouncementInfo",
        method: "post",
        data: data
      })
        .then(data => {
          let resp = data.data.resp;
          _this.ruleForm = resp;
          _this.styleColor.color = resp.annColor;
          _this.color = resp.annColor;
          this.value4.push(resp.annCreateTime);
          this.value4.push(resp.annEndTime);
          if (resp.annIsUse) {
            _this.radioChecked = "1";
          } else {
            _this.radioChecked = "2";
          }
          if (resp.annContextType == 1) {
            _this.radioChecked2 = "1";
          } else {
            _this.radioChecked2 = "2";
          }
          _this.editorContent = resp.annContext;
        })
        .catch(err => {
          console.log(err);
        });
    },
    submitForm() {
      let _this = this;
      if (_this.radioChecked == "1") {
        _this.ruleForm.isuse = true;
      } else if (_this.radioChecked == "2") {
        _this.ruleForm.isuse = false;
      }

      if (this.value4 == null || this.value4.length == 0) {
        this.ruleForm.activityStartTime = this.ruleForm.annStartTime;
        this.ruleForm.activityEndTime = this.ruleForm.annEndTime;
      } else {
        this.ruleForm.activityStartTime = forlataTime(this.value4[0]);
        this.ruleForm.activityEndTime = forlataTime(this.value4[1]);
      }
      if (_this.ruleForm.annTitle == "") {
        this.$message.info("公告标题不能为空");
        return;
      } else if (specailTest(this.ruleForm.annTitle)) {
        this.$message.info("公告标题不能为特殊字符");
        return;
      } else if (_this.ruleForm.annRank != "0" && !_this.ruleForm.annRank) {
        this.$message.info("公告排序不能为空");
        return;
      } else if (!numberTest(this.ruleForm.annRank)) {
        this.$message.info("公告排序请输入正数");
        return;
      } else if (_this.radioChecked == null) {
        this.$message.info("公告启用状态不能为空");
        return;
      } else if (_this.ruleForm.color == "") {
        this.$message.info("公告显示颜色不能为空");
        return;
      } else if (
        this.ruleForm.activityStartTime == "" ||
        this.ruleForm.activityEndTime == ""
      ) {
        this.$message.info("开始时间和结束时间不能为空");
        return;
      } else if (
        this.ruleForm.activityStartTime == this.ruleForm.activityEndTime
      ) {
        this.$message.info("开始时间不能和结束时间一样");
        return;
      } else if (_this.radioChecked2 == null) {
        this.$message.info("公告内容不能为空");
        return;
      } else if (_this.radioChecked2 == "1") {
        if (_this.ruleForm.annUrl == "") {
          this.$message.info("公告关联链接不能为空");
          return;
        }
      } else if (_this.radioChecked2 == "2") {
        if (
          _this.orContent == "" ||
          _this.orContent == undefined ||
          _this.orContent == "<p><br></p>"
        ) {
          this.$message.info("公告富文本内容不能为空");
          return;
        }
      }
      let data = {};
      if (_this.radioChecked2 == "1") {
        data = {
          annId: _this.annId,
          annTitle: _this.ruleForm.annTitle,
          annRank: _this.ruleForm.annRank,
          annColor: _this.styleColor.color,
          annIsUse: _this.ruleForm.isuse,
          annStartTime: _this.ruleForm.activityStartTime,
          annEndTime: _this.ruleForm.activityEndTime,
          annContextType: _this.radioChecked2,
          annUrl: _this.ruleForm.annUrl
        };
      } else if (_this.radioChecked2 == "2") {
        data = {
          annId: _this.annId,
          annTitle: _this.ruleForm.annTitle,
          annRank: _this.ruleForm.annRank,
          annColor: _this.styleColor.color,
          annIsUse: _this.ruleForm.isuse,
          annStartTime: _this.ruleForm.activityStartTime,
          annEndTime: _this.ruleForm.activityEndTime,
          annContextType: _this.radioChecked2,
          annContext: _this.orContent
        };
      }
      this.$httpAuth({
        url: "/mall/updateAnnouncement",
        method: "post",
        data: data
      })
        .then(data => {
          if (data.data.code == 10000) {
            _this.$message.success(data.data.resp);
            _this.$router.push("/content/anmanagement");
          } else {
            _this.$message.info(data.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    showPop() {
      this.isShowPop = true;
    },
    closePop() {
      this.isShowPop = false;
    },
    //确认选择商品或者分类
    confirmSelect(goodLink) {
      this.ruleForm.annUrl = goodLink;
      this.closePop();
    },
    onReset() {
      this.$router.push("/content/anmanagement");
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
        .activity-name {
          input {
            width: 300px;
            height: 30px;
            border: 1px solid #f3f3f3;
            text-indent: 5px;
            margin-right: 5px;
            border-radius: 5px;
            -webkit-border-radius: 5px;
          }
        }
      }
    }
  }
}
</style>
