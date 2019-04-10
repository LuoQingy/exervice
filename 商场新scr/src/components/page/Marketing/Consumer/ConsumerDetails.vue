<template>
  <div class="ConsumerDetails">
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px">
      <div class="setting_list">
        <p class="title">活动设置</p>
        <div class="list">
          <el-form-item label="活动名称:" prop="name">
            <el-input v-model="ruleForm.name" style="width:300px;"></el-input>
          </el-form-item>
          <el-form-item label="活动时间:" required>
            <el-date-picker
              v-model="activityDate"
              @change="activityDateChang"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00','23:59:59']"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="commodityDay" label="活动对象:">消费满
            <el-input-number controls-position="right" style="width:120px;" placeholder="请输入" :min="0" v-model="ruleForm.commodityDay"></el-input-number>元的顾客
          </el-form-item>
        </div>
      </div>
      <div class="setting_list">
        <p class="title">优惠券设置</p>
        <div class="list">
          <el-form-item label="领取上限:" prop="name">
            <el-select v-model="ruleForm.memberGradeId" style="width:150px;">
              <el-option label="每日" value="1"></el-option>
              <el-option label="每周" value="2"></el-option>
              <el-option label="每月" value="3"></el-option>
            </el-select>
            <el-input-number controls-position="right" style="width:120px;" :min="0" v-model="ruleForm.commodityDay"></el-input-number>张/人
          </el-form-item>
          <el-form-item label="发放数量:" prop="name">
            <el-select v-model="ruleForm.memberGradeId" style="width:150px;">
              <el-option label="不限制" value="1"></el-option>
              <el-option label="限制数量" value="2"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </div>
      <div class="Coupon">
        <el-form-item label="券种类：" required>
          <el-radio-group v-model="ruleForm.radio2">
            <el-radio :label="1">代金券</el-radio>
            <el-radio :label="2">折扣券</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="券面额：" required v-if="ruleForm.radio2===1">
          <div class="activity-name">
            <el-input-number controls-position="right" style="width:120px;" :min="0" placeholder="请填写" v-model="ruleForm.commodityMoney"></el-input-number>元
          </div>
        </el-form-item>
        <el-form-item label="折扣力度：" required v-if="ruleForm.radio2===2">
          <div class="activity-name">
            <el-input-number controls-position="right" style="width:120px;" :min="0" placeholder="请填写" v-model="ruleForm.commodityMoney"></el-input-number>折,且收款时
            <el-select v-model="ruleForm.discount" style="width:150px;">
              <el-option v-for="(item,index) in discountOptions" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <!-- 抹零规则 -->
            <RulesTemplate style="display: inline-block;"></RulesTemplate>
            <div>
              折扣范围1.1折至9.9折。例：设置
              <span style="color:orange;">2折</span>后,原价10元,用户仅需付
              <span style="color:orange;">2元</span>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="最低消费：" required>
          <el-select v-model="ruleForm.minconsum" style="width:140px;" placeholder="请选择">
            <el-option label="设置最低消费" value="1"></el-option>
            <el-option label="不设置最低消费" value="2"></el-option>
          </el-select>
          <el-input-number
            controls-position="right"
            v-if="ruleForm.minconsum=='1'"
            :min="0"
            style="width:120px;"
            v-model="ruleForm.minconsumInput"
          ></el-input-number>
          <span v-if="ruleForm.minconsum=='1'">元</span>
        </el-form-item>
        <el-form-item label="有效期：" required>
          <el-select v-model="relativeTime" style="width:140px;" placeholder="请选择">
            <el-option label="相对时间" value="1"></el-option>
            <el-option label="指定时间" value="2"></el-option>
          </el-select>
          <span v-if="relativeTime==1" style="margin-left:20px;">购买后
            <el-input-number controls-position="right" style="width:120px;" :min="0" placeholder="请填写" v-model="ruleForm.commodityMoney"></el-input-number>日内有效
          </span>
          <span style="margin-left:20px;" v-else>
            <el-date-picker
              v-model="validtime"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00','23:59:59']"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </span>
        </el-form-item>
        <el-form-item label="券名称：" required>
          <div class="activity-name">
            <el-input style="width:150px;" size="small" placeholder="请填写券的名称" v-model="ruleForm.commodityName"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="券副标题：" required>
          <div class="activity-name">
            <el-input style="width:150px;" size="small" placeholder="请填写券的副标题" v-model="ruleForm.commoditySubName"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="券logo：" required>
          <div>
            <elupload @uploadimg="upload" @delimg="delimg" :imglist="ruleForm.activityImageUrl"></elupload>
          </div>
          <p style="color:#999;">请上传品牌logo,文件格式png，jpg，jepg，gif,文件大小10M以内，建议尺寸120px*120px</p>
        </el-form-item>
        <el-form-item label="使用说明：" required>
          <el-input v-model="ruleForm.name" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button>取消</el-button>
          <el-button type="primary">提交</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
  
<script>
import Elupload from "../../UploadImg/Elupload.vue";
import RulesTemplate from "../RulesTemplate.vue";
export default {
  components: { Elupload, RulesTemplate },
  data() {
    return {
      ruleForm: {
        name: "",
        commodityDay: "",
        commodityMoney: "",
        minconsumInput: "",
        radio2: 1,
        minconsum: "2"
      },
      ruleshow: false,
      activityDate: [],
      validtime: [],
      grade: [],
      discountOptions: [],
      rules: [],
      relativeTime: "1"
    };
  },
  methods: {
    activityDateChang() {},
    // 组件上传图片
    upload(val) {
      this.ruleForm.activityImageUrl.splice(0, 1, val);
    },
    // 组件删除图片
    delimg(val) {
      this.ruleForm.activityImageUrl.splice(val, 1);
    }
  }
};
</script>
  
<style scoped lang="less">
.ConsumerDetails {
  margin: 30px 0 0 20px;
  padding-bottom: 30px;
}
.setting_list {
  .title {
    border-left: 8px solid #2db7f5;
    padding-left: 5px;
  }
  .list {
    margin-left: 55px;
    margin-top: 15px;
  }
}
.Coupon {
  border-top: 1px solid #ccc;
  margin-left: 55px;
  padding-top: 10px;
}
</style>