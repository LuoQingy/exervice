<template>
  <div>
    <div>
      <el-breadcrumb separator="/" class="content_title">
        <el-breadcrumb-item>设置返券规则</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="mode">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="返券方式:">
          <el-radio-group v-model="form.rules">
            <el-radio :label="1">智能返券</el-radio>
            <el-radio :label="2">限定范围返券</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-form-item label="参与门店" required v-if='form.rules===2'>
            <div class="chooseShop">
              <div style="color:#64caf8;" v-if="storefromchild.length=='0'">
                <span @click="dialogTableVisible = true">配置门店</span>
              </div>
              <div v-else>
                <span>
                  已选择{{storefromchild.length}}家门店
                  <span @click="dialogTableVisible = true" style="color:#64caf8;">修改</span>
                </span>
              </div>
              <p>该券只能在选择的门店范围里赠送</p>
            </div>
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">保存</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 门店弹框 -->
    <storeTree :storeTreeVisible="dialogTableVisible" :defaultCheckedKeys="storefromchild" @addstore="addstore" @close="cancelStore"></storeTree>
  </div>
</template>
  
<script>
import storeTree from "../../../common/storeTree.vue";
export default {
  components: { storeTree },
  data() {
    return {
      form: {
        rules: 1
      },
      storefromchild: [],
      dialogTableVisible: false
    };
  },
  methods:{
      // 添加按钮
    addstore(fromData) {
      this.storefromchild = [...fromData];
      this.dialogTableVisible = false;
    },
     cancelStore() {
      this.dialogTableVisible = false;
    },
  }
};
</script>
  
<style scoped>
.mode {
  /* width: 400px; */
  margin: 100px 0 0 150px;
}
.chooseShop {
  font-size: 14px;
}
.chooseShop span {
  cursor: pointer;
}
</style>