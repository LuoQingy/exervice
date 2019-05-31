<template>
  <div>
    <div>
      <el-breadcrumb separator="/" class="content_title">
        <el-breadcrumb-item>编辑升级规则描述</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <wangeditor :editorContent="editorContent" @editorContent="onEditorChange"></wangeditor>
      <el-button class="editor-btn" type="primary" @click="submit">保存</el-button>
      <el-button class="editor-btn" type="primary" @click="goback">返回</el-button>
    </div>
  </div>
</template>

<script>
import wangeditor from "@/components/common/wangeditor";
import bus from "@/components/common/bus.js";
export default {
  name: "editor",
  data: function() {
    return {
      content: "",
      editorContent:'',
      editorOption: {
        placeholder: "Hello World"
      }
    };
  },
  components: {
    wangeditor
  },
  methods: {
    onEditorChange(html) {
      this.content = html;
    },
    // 修改保存
    submit() {
      this.$httpAuth
        .post("mall/updateOrInsertDescription", {
          mallId: 1, //类型：Number  必有字段  备注：商场ID
          description: this.content
        })
        .then(result => {
          if (result.data.code === 10000) {
            console.log(this.$route);
            this.$message.success(result.data.resp);
            this.goback();
          }
        })
        .catch(err => {});
    },
    //返回
    goback() {
      bus.$emit("closetags");
      this.$router.push("/member/MenberSetting/shipsetting");
    }
  },

  created() {
    this.$httpAuth
      .post("mall/selectByMallId", {
        mallId: 1 //类型：Number  必有字段  备注：商场ID
      })
      .then(result => {
        if (result.data.code === 10000) {
          this.editorContent = result.data.resp.description;
        }
      })
      .catch(err => {});
  }
};
</script>
<style scoped>
.editor-btn {
  margin-top: 20px;
}
</style>