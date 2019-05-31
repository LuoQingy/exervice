<template>
  <div class="wangeditor">
    <div :ref="tabId" class="tab"></div>
    <div :ref="textId" class="text_box"></div>
  </div>
</template>

<script type="text/ecmascript-6">
import E from "wangeditor";
export default {
  name: "wangeditor",
  data() {
    return {
      editor: Object
    };
  },
  props: {
    editorContent: {
      type: String,
      default: ""
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    tabId: {
      type: String,
      default: "tabElem"
    },
    textId: {
      type: String,
      default: "textElem"
    },
    disableEditor: {
      type: Boolean,
      default: false
    },
    customConfig: {
      type: Array,
      default: () => {
        return [
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
          "table", // 表格
          // 'video',  // 插入视频
          // 'code',  // 插入代码
          "undo", // 撤销
          "redo" // 重复
        ];
      }
    }
  },
  methods: {},
  mounted() {
    this.$nextTick(() => {
      this.editor = new E(this.$refs[this.tabId], this.$refs[this.textId]);
      this.editor.customConfig.zIndex = 10
      this.editor.customConfig.menus = this.customConfig;
      this.editor.customConfig.uploadImgServer = `${
        this.$api._baseUrl
      }/uploadImage`; //设置上传地址
      this.editor.customConfig.uploadImgParams = {
        role: 1 //额外传的数据
      };
      this.editor.customConfig.uploadFileName = "file"; //文件名字
      this.editor.customConfig.uploadImgHeaders = {
        //上传头部
        Accept: "application/json, text/plain",
        AuthToken: localStorage.getItem("token")
      };
      this.editor.customConfig.uploadImgHooks = {
        customInsert: function(insertImg, result, editor) {
          if (result.code === 10000) {
            var url = result.resp;
            insertImg(url);
          } else {
            if (result.msg == "登录已失效,请重新登录!") {
              localStorage.clear();
              router.replace("/login");
            } else {
              alert("上传图片失败!");
            }
          }
        }
      };
      this.editor.customConfig.onchange = html => {
        this.$emit("editorContent", html);
      };
      this.editor.customConfig.onblur = html => {
        this.$emit("editorContent", html);
      };
      this.editor.customConfig.onmouseover = html => {
        alert('mgdhggfklh')
        //this.$emit("editorContent", html);
      };
      this.editor.create();
      if (this.editorContent !== "" && this.isLoading) {
        console.log(this.editorContent)
        this.editor.txt.html(this.editorContent);
      }
      if (this.disableEditor) {
        this.editor.$textElem.attr("contenteditable", false);
      }
    });
  },
  watch: {
    isLoading() {
      // if(this.editorContent !== '' && this.isLoading){
      //     console.log(this.editorContent)
      //     this.editor.txt.html(this.editorContent)
      //     this.isLoading = false
      // }
    },
    editorContent() {
      this.editor.txt.html(this.editorContent);
      this.$emit("editorContent", this.editorContent);
    },
    disableEditor() {
      if (this.disableEditor) {
        this.editor.$textElem.attr("contenteditable", false);
      }
    }
  },
  components: {}
};
</script>

<style scoped>
.wangeditor{
  width: 600px;
}
.tab {
  border: 1px solid #cccccc;
}
.text_box {
  border: 1px solid #cccccc;
  min-height: 100px;
  /* height: 100px; */
}
</style>