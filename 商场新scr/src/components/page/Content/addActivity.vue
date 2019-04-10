<template>
  <div id="addActivity">
    <h3>{{activityOperation}}</h3>
    <div class="addActivity-content">
      <el-form :model="ruleForm" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="活动标题：" required>
          <div class="activity-name">
            <input
              v-model="ruleForm.activityTitle"
              class="fl"
              maxlength="20"
              style="width:300px;"
              :style="styleColor"
              placeholder="请输入活动名称(最多输入20个字符)"
            >
            <el-color-picker class="fl" v-model="ruleForm.activityColor" @change="changeColor(3)"></el-color-picker>
          </div>
        </el-form-item>
        <el-form-item label="活动排序：" required>
          <el-input
            v-model="ruleForm.activityRank"
            maxlength="11"
            type="number"
            size="mini"
            style="width:300px;"
            placeholder="序号越低排名越靠前,相同数值按顺序排列"
          ></el-input>
        </el-form-item>
        <el-form-item label="活动图片：" required>
          <div class="fl">
            <elupload @uploadimg="upload" @delimg="delimg" :type="['jpg','png','bmp']" :imglist="ruleForm.activityImageUrl"></elupload>
          </div>
          <span class="fl" style="padding-left:60px;color:#ff0000;">为了页面效果建议添加750*276px的图片</span>
        </el-form-item>
        <el-form-item label="有效时间段：" required>
          <div class="activityIsValid">
            <el-date-picker
              v-model="value4"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :disabled="ruleForm.activityIsValidity"
            ></el-date-picker>
            <span style="padding:0px 5px;">或</span>
            <el-checkbox v-model="ruleForm.activityIsValidity" @change="Validitychang">永久有效</el-checkbox>
          </div>
        </el-form-item>
        <el-form-item label="活动启用：">
          <el-checkbox v-model="ruleForm.activityIsUse">启用</el-checkbox>
        </el-form-item>
        <el-form-item label="活动内容：" required>
          <div>
            <el-radio-group v-model="ruleForm.activityContextType" @change="changeColor(1)">
              <el-radio :label="1">链接跳转</el-radio>
              <el-radio :label="2">富文本内容</el-radio>>
            </el-radio-group>
          </div>
          <div v-show="ruleForm.activityContextType==1">
            <div>
              <el-button type="primary" style="width:125px;height:30px" @click="showPop" size="mini">关联链接</el-button>
            </div>
            <el-input size="mini" style="width:300px;margin-top:10px;" placeholder="请输入关联的链接" v-model="ruleForm.activityUrl"></el-input>
          </div>
          <div v-show="ruleForm.activityContextType==2">
            <wangeditor-one
              @editorContent="getEditorContent"
              :editorContent="editorContent"
              :customConfig="customConfig"
              :isLoading="isLoading"
              :disableEditor="disableEditor"
            ></wangeditor-one>
          </div>
        </el-form-item>
        <el-form-item>
          <div style="margin-top:10px;">
            <el-button type="primary" @click="preservation">保存</el-button>
            <el-button type="primary" @click="resetForm">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <search-pop v-if="isShowPop" @closePop="closePop" @confirmSelect="confirmSelect"></search-pop>
  </div>
</template>

<script>
import Elupload from "../UploadImg/Elupload.vue";
import SearchPop from "../allComponents/SearchPop";
import wangeditorOne from "../../common/wangeditorOne.vue";
import {specailTest,numberTest} from "@/libs/regular.js";
export default {
  components: { Elupload, wangeditorOne,SearchPop },
  data() {
    return {
      activeName: "second",
      ruleForm: {
        activityId: 2,
        mallId: 1,
        activityTitle: "",
        activityColor: "#000000",
        activityRank: 0,
        activityImageUrl: [],
        activityIsValidity: true,
        activityIsUse: true,
        activityContextType: 1,
        activityUrl: "",
        activityCreateTime: "",
        adminId: 6,
        activityContext: ""
      },

      activityOperation: "添加活动",
      radio: "true",
      styleColor: {
        color: "#000000"
      },
      isShowPop:false,
      color: "#000000",
      value4: [],
      permanent: false, //永久
      umriActivateIcon: "",
      checked: false,
      integral: "",
      limit: 10,
      parkingIntegral: 10,
      parkingLimit: 10,
      parkingChecked: false,
      list: {},
      editorContent: "", //积分指南
      Content: "", //积分指南
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
  created() {
    let activityId = this.$route.query.activityId;
    if (activityId) {
      this.getActivityDetails(activityId);
    }
  },
  methods: {
    changeColor(ev) {
      //选择链接 和副文本狂  选择改变活动标题的字体颜色
      if (ev == 3) {
        if (this.ruleForm.activityColor == null) {
          this.ruleForm.activityColor == "#ffffff";
        }
        this.styleColor.color = this.ruleForm.activityColor;
      }
    },
    Validitychang(val){
      if(val){
        this.value4=null;
      }
    },
    getEditorContent(val) {
      //富文本的值
      this.Content = val;
      this.ruleForm.activityContext = val;
    },
    //活动详情
    getActivityDetails(ev) {
      let data = "activityId=" + ev;
      this.$xwhttpAuth({
        url: "/mall/getActivityInfo",
        method: "post",
        data: data
      })
        .then(res => {
          if (res.data.code == 20000) {
          } else if (res.data.code == 10000) {
            let resp = res.data.resp;
            // console.log(resp)
            if (resp == null || resp == "") {
            } else {
              this.activityOperation = "修改活动";
              this.list = resp;
              this.styleColor.color = resp.activityColor;
              resp.activityImageUrl = [resp.activityImageUrl];
              this.ruleForm = resp;
              this.editorContent = resp.activityContext;
              this.disableEditor = true;
              if (this.ruleForm.activityContext) {
              } else {
                this.ruleForm.activityContext = "";
              }
              if (resp.activityIsValidity == false) {
                this.value4.push(resp.activityStartTime);
                this.value4.push(resp.activityEndTime);
              }
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //添加活动数据
    addActivity(ev) {
      let obj = {
        activityTitle: this.ruleForm.activityTitle, //类型：String  可有字段  备注：活动标题
        activityColor: this.ruleForm.activityColor, //类型：String  可有字段  备注：标题颜色
        activityImageUrl: this.ruleForm.activityImageUrl[0], //类型：String  可有字段  备注：图片url
        activityStartTime: this.ruleForm.activityIsValidity?null:this.value4[0], //类型：String  可有字段  备注：有效期开始
        activityEndTime:this.ruleForm.activityIsValidity?null:this.value4[1], //类型：String  可有字段  备注：有效期结束
        activityContextType: this.ruleForm.activityContextType, //类型：Number  可有字段  备注：活动内容类型(1:链接跳转 2:富文本内容)
        activityUrl: this.ruleForm.activityUrl, //类型：String  可有字段  备注：链接类型内容
        activityContext: this.ruleForm.activityContext, //类型：String  可有字段  备注：富文本内容
        activityIsUse: this.ruleForm.activityIsUse, //类型：Boolean  可有字段  备注：是否启用
        activityRank: this.ruleForm.activityRank, //类型：Number  可有字段  备注：序号
        activityIsValidity: this.ruleForm.activityIsValidity //类型：String  可有字段  备注：是否永久有效
      };
      this.$httpAuth({
        url: "/mall/addActivity",
        method: "post",
        data: obj
      })
        .then(res => {
          if (res.data.code == 20000) {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          } else if (res.data.code == 10000) {
            this.$router.push("/content/activitymanagement");
            this.$message({
              message: "添加成功",
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
    //返回
    resetForm() {
      this.$router.push("/content/activitymanagement");
    },

    editActivityData(ev) {
      //修改活动数据
      let obj = {
        activityId: this.ruleForm.activityId, //类型：Number  必有字段  备注：活动id
        activityTitle: this.ruleForm.activityTitle, //类型：String  可有字段  备注：活动标题
        activityColor: this.ruleForm.activityColor, //类型：String  可有字段  备注：标题颜色
        activityImageUrl: this.ruleForm.activityImageUrl[0], //类型：String  可有字段  备注：图片url
        activityStartTime: this.ruleForm.activityIsValidity?null:this.value4[0], //类型：String  可有字段  备注：有效期开始
        activityEndTime: this.ruleForm.activityIsValidity?null:this.value4[1], //类型：String  可有字段  备注：有效期结束
        activityContextType: this.ruleForm.activityContextType, //类型：Number  可有字段  备注：活动内容类型(1:链接跳转 2:富文本内容)
        activityUrl: this.ruleForm.activityUrl, //类型：String  可有字段  备注：链接类型内容
        activityContext: this.ruleForm.activityContext, //类型：String  可有字段  备注：富文本内容
        activityIsUse: this.ruleForm.activityIsUse, //类型：Boolean  可有字段  备注：是否启用
        activityRank: this.ruleForm.activityRank, //类型：Number  可有字段  备注：序号
        activityIsValidity: this.ruleForm.activityIsValidity //类型：String  可有字段  备注：是否永久有效
      };
      this.$httpAuth({
        url: "/mall/updateActivity",
        method: "post",
        data: obj
      })
        .then(res => {
          if (res.data.code == 10000) {
            this.$router.push("/content/activitymanagement");
            this.$message({
              message: "修改成功",
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
    //保存
    preservation() {
      if (specailTest(this.ruleForm.activityTitle)) {
        this.$message.info("活动标题不能含有特殊字符");
        return;
      }
      if (
        this.ruleForm.activityTitle == "" ||
        this.ruleForm.activityTitle == " "
      ) {
        this.$message.info("请输入活动标题");
        return;
      }
      if (
        !this.ruleForm.activityRank
      ) {
        if (this.ruleForm.activityRank == 0) {
        } else {
          this.$message.info("请输入活动序号");
          return;
        }
      } else if (!numberTest(this.ruleForm.activityRank)) {
        this.$message.info("活动序号只能输入整数");
        this.ruleForm.activityRank = Math.abs(this.ruleForm.activityRank);
        return;
      }
      if (this.ruleForm.activityImageUrl.length == "0") {
        this.$message.info("请上传活动图片");
        return;
      }

      if (this.ruleForm.activityIsValidity == false) {
        if (!this.value4) {
          this.$message.info("请选择活动的有效时间");
          return;
        } else if (
          this.value4[0] === this.value4[1]
        ) {
          this.$message.info("开始时间和结束时间不能一致");
          return;
        }
      }
      if (this.ruleForm.activityContextType == 1) {
        if (this.ruleForm.activityUrl == "") {
          this.$message.info("请输入关联的链接");
          return;
        }
      } else if (this.ruleForm.activityContextType == 2) {
        if (this.Content == "" || this.Content == "<p><br></p>") {
          this.$message.info("请输入活动内容");
          return;
        } else {
          this.ruleForm.activityContext = this.Content;
        }
      }
      if (this.ruleForm.activityColor == null) {
        this.ruleForm.activityColor = "#ff0000";
      }
      if (this.activityOperation == "添加活动") {
        this.addActivity();
      } else {
        this.editActivityData();
      }
    },
    // 组件上传图片
    upload(val) {
      this.ruleForm.activityImageUrl.splice(0, 1, val);
    },
    // 组件删除图片
    delimg(val) {
      this.ruleForm.activityImageUrl.splice(val, 1);
    },
    showPop() {
      this.isShowPop = true;
    },
    closePop() {
      this.isShowPop = false;
    },
    //确认选择商品或者分类
    confirmSelect(goodLink) {
      this.ruleForm.activityUrl = goodLink;
      this.closePop();
    },
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
        .activityIsValid {
          position: relative;
        }
      }
    }
  }
}
</style>
