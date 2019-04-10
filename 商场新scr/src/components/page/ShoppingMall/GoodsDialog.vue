<template>
    <el-dialog title="审核商品" :visible.sync="dialogFormVisible" @close="closeTap" style="z-index:999999">
        <el-form>
            <el-form-item>
                <el-button class="btn" type="primary" size="mini" @click="GoodsReview(1)">通过审核</el-button>
                <el-button class="btn" type="primary" size="mini" @click="GoodsReview(2)">驳回</el-button>
            </el-form-item>
            <el-form-item label="驳回原因">
                <el-input type="textarea" :autosize="{ minRows: 4, }" placeholder="驳回原因" v-model="textarea">
                </el-input>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>
  
<script>
export default {
  data() {
    return {
      dialogFormVisible: false,
      textarea: ""
    };
  },
  props: {
    show: {
      type: Boolean
    },
    mgId:''
  },
  watch: {
    show(val) {
      this.dialogFormVisible = val;
    }
  },
  methods: {
    closeTap() {
      this.$emit("close");
    },
    GoodsReview(mgStatus) {
      this.$httpAuth
        .post("gm/mallGoodsReview", {
          mgId: this.mgId, //类型：Number  必有字段  备注：商品ID
          mgStatus, //类型：Number  必有字段  备注：审核商品状态：1=通过 2=驳回，需要带上原因
          mgRejectExplain:mgStatus==2?this.textarea:''
        })
        .then(result => {
            if(result.data.code === 10000){
                this.$message({
                    message:result.data.resp,
                    type: "success"
                });
                this.$emit("close",'back');
            }else{
                this.$message({
                    message:result.data.msg,
                    type: "warning"
                });
            }
        })
        .catch(err => {});
    }
  }
};
</script>
  
<style scoped>
.el-dialog__wrapper {
  z-index: 99999 !important;
}
</style>