<template>
  <div id="guide">
    <div class="guide-content">
      <div style="width:80px;">
        <span class="integral-word">积分指南</span>
      </div>
      <div style="width:500px;">
        <wangeditor
          @editorContent="getEditorContent"
          :editorContent="editorContent"
          :customConfig="customConfig"
          :isLoading="isLoading"
          :disableEditor="disableEditor"
        ></wangeditor>
      </div>
    </div>
    <div class="btn-father" style="margin-left:80px;">
      <el-button type="primary" @click="submitForm()">保存</el-button>
      <el-button type="primary" @click="resetForm()">取消</el-button>
    </div>
  </div>
</template>

<script>
import wangeditor from "../../../common/wangeditor.vue";
import bus from "@/components/common/bus.js";
export default {
  components: { wangeditor },
  data() {
    return {
      editorContent: "", //积分指南
      torContent:'',
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
  mounted() {
    this.getMallCoinGuide();
  },
  methods: {
    getEditorContent(val) {
      this.torContent = val;
    },
    getMallCoinGuide() {
      this.$httpAuth
        .post("/mall/getMallCoinGuide")
        .then(result => {
          if (result.data.code === 10000) {
            this.editorContent = result.data.resp.ugContext
              ? result.data.resp.ugContext
              : "";
          }
        })
        .catch(err => {});
    },
    // 保存
    submitForm() {
      this.$httpAuth
        .post("/mall/addOrUpdateCoinGuide", {
          ugContext: this.torContent
        })
        .then(result => {
          if (result.data.code === 10000) {
            this.$message({
              message: result.data.resp,
              type: "success"
            });
            this.resetForm();
          } else {
            this.$message({
              message: result.data.msg,
              type: "warnig"
            });
          }
        })
        .catch(err => {});
    },
    // 取消
    resetForm() {
      bus.$emit("closetags");
      this.$router.push("/member/MenberSetting/integralRule/integralAcquisition");
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
#guide {
  width: 100%;
  min-width: 900px;
  padding-bottom: 50px;
  .guide-content {
    display: flex;
    margin-top: 50px;
    margin-left: 70px;
    .integral-word {
      color: #333;
      font-size: 14px;
    }
  }
  .btn-father {
    text-indent: 70px;
    margin-top: 20px;
    .el-button {
      width: 140px;
      height: 42px;
    }
  }
}
</style>