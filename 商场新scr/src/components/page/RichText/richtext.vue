<template>
    <div>
        <div class="container">{{getFunction}}
           
        </div>
    </div>
</template>

<script>

export default {
  props: ['text'],
  name: "editor",
  data: function() {
    return {
      content: "",
      editorOption: {
        placeholder: "Hello World"
      }
    };
  },
  methods: {
    onEditorChange({ editor, html, text }) {
      this.content = html;
      this.$emit('getrichtext',this.content)
    },
  },
  computed:{
      getFunction(){
        this.content = this.text
      }
  }
}
</script>
<style scoped>
    .container{
        padding: 0 !important;
        border: none !important;
        width: 80%;
        margin-top: 20px;
    }
</style>