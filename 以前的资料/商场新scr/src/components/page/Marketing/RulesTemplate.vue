<template>
  <div>
    <el-dropdown>
      <el-button type="primary">抹零规则</el-button>
      <el-dropdown-menu slot="dropdown">
        <div class="ruleshowspan">
          <span>抹零规则：</span>
          <span>不自动抹零</span>
          <p>正常收款，不做抹零操作</p>
          <span>自动抹零到元</span>
          <p>
            例：打折后金额为
            <span style="color:orange">8.50</span>元，自动抹零到
            <span style="color:orange">8</span> 元
          </p>
          <span>自动抹零到角</span>
          <p>
            例：打折后金额为
            <span style="color:orange">8.58</span>元，自动抹零到
            <span style="color:orange">8.5</span>元
          </p>
          <span>四舍五入到元</span>
          <p>
            例：打折后金额为
            <span style="color:orange">8.30</span>元，自动四舍五入到
            <span style="color:orange">8</span>元
          </p>
          <p>
            打折后金额为
            <span style="color:orange">8.80</span>元，自动四舍五入到
            <span style="color:orange">9</span>元
          </p>
          <span>四舍五入到角</span>
          <p>
            例：打折后金额为
            <span style="color:orange">8.33</span>元，自动四舍五入到
            <span style="color:orange">8.3</span>元
          </p>
          <p>
            打折后金额为
            <span style="color:orange">8.38</span>元，自动四舍五入到
            <span style="color:orange">8.4</span>元
          </p>
        </div>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
  
<script>
export default {
  data() {
    return {};
  }
};
</script>
  
<style scoped>
.ruleshowspan {
  width: 200px;
  padding: 10px;
  font-size: 14px;
}
</style>