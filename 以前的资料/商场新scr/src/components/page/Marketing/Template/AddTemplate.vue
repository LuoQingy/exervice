<template>
  <div class="template">
    <div>
      <el-breadcrumb separator="/" class="content_title">
        <el-breadcrumb-item>营销中心</el-breadcrumb-item>
        <el-breadcrumb-item>模板消息</el-breadcrumb-item>
        <el-breadcrumb-item>编辑模板</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 基础信息 -->
    <div class="base">
      <p class="tem_title">基础信息</p>
      <div class="base_list">
        <p class="list">
          <span>标题:</span>
          <span>礼品领取成功通知</span>
        </p>
        <p class="list">
          <span>行业:</span>
          <span>消费品</span>
        </p>
        <p class="list">
          <span>url类型:</span>
          <span>H5类型</span>
        </p>
        <!-- <p class="list">
          <span>触发条件:</span>
          <el-select v-model="value" size="mini" style="flex:1" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </p>-->
      </div>
      <!-- <div class="base_list">
        <p class="list">
          <span>url类型:</span>
          <span>H5类型</span>
        </p>
      </div>-->
    </div>
    <!-- 详情内容 -->
    <div class="details">
      <p class="tem_title">详情内容</p>
      <div style="display: flex;">
        <el-form class="form" ref="form" :model="form" label-width="80px">
          <el-form-item label="头部文案:">
            <el-input type="textarea" v-model="form.desc" maxlength="200"></el-input>
            <div class="textarea_foot">
              <p class="message2">
                <el-color-picker v-model="color"></el-color-picker>插入变量
              </p>
              <span>0/200</span>
            </div>
          </el-form-item>
          <el-form-item label="领取人:">
            <p class="message">显示接收人领取人:
              <el-color-picker v-model="color" style="margin-left:20px;"></el-color-picker>
            </p>
          </el-form-item>
          <el-form-item label="领取人:">
            <p class="message">礼品:
              <el-color-picker v-model="color" style="margin-left:20px;"></el-color-picker>
            </p>
          </el-form-item>
          <el-form-item label="领取人:">
            <p class="message">领取时间:
              <el-color-picker v-model="color" style="margin-left:20px;"></el-color-picker>
            </p>
          </el-form-item>
          <el-form-item label="尾部文案:">
            <el-input type="textarea" v-model="form.desc"></el-input>
            <div class="textarea_foot">
              <p class="message2">
                <el-color-picker v-model="color"></el-color-picker>插入变量
              </p>
              <span>0/200</span>
            </div>
          </el-form-item>
        </el-form>
        <div class="wechat">
          <div class="tem_header">
            <img src="../../../../../static/img/temheader.png" alt>
          </div>
          <div>
            <div class="tem_content">
              <ul>
                <li class="con_title">
                  <p>礼品领取成功通知</p>
                  <p class="time">未知时间</p>
                </li>
                <li>你好对对对</li>
                <li>
                  <span>领取人</span>
                  <span>领取人</span>
                </li>
                <li>
                  <span>领取人</span>
                  <span>领取人</span>
                </li>
                <li>
                  <span>领取人</span>
                  <span>领取人</span>
                </li>
                <li class="content_foot">请及时确认，如有问题请及时联系</li>
              </ul>
              <p class="bottom">
                <span>详情</span>
                <i class="el-icon-arrow-right"></i>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 跳转设置 -->
    <div class="base">
      <p class="tem_title">
        <span>跳转设置</span>
        <span style="color:#ccc;margin-left:20px;">跳转设置跳转设置跳转设置跳转设置跳转设置</span>
      </p>
      <div class="select_box">
        <p>跳转H5页面</p>
        <div class="select">
          <el-radio-group v-model="radio2">
            <el-radio :label="3">内部跳转</el-radio>
            <el-radio :label="6">网址</el-radio>
          </el-radio-group>
          <p>已选择链接:名称【大姐姐】</p>
        </div>
        <el-input size="mini" style="width:200px;" v-model="input" placeholder="请输入内容"></el-input>
      </div>
    </div>
    <el-row class="foot_btn">
      <el-button type="primary">保存</el-button>
      <el-button>返回</el-button>
    </el-row>
  </div>
</template>
  
<script>
export default {
  data() {
    return {
      value: "",
      options: [
        {
          label: "积分提醒",
          value: "1"
        }
      ],
      color: "#153172",
      form: {},
      radio2: 3,
      input: ""
    };
  }
};
</script>
  
<style scoped lang="less">
.template {
  font-size: 14px;
  padding-bottom: 30px;
}
.base {
  margin-top: 15px;
  border: 5px solid #f1f2f6;
  .tem_title {
    height: 38px;
    line-height: 38px;
    padding-left: 20px;
    border-bottom: 2px solid #f1f2f6;
  }
  .base_list {
    display: flex;
    flex-wrap: wrap;
    .list {
      flex: 1;
      padding: 0 20px;
      display: flex;
      height: 38px;
      align-items: center;
    }
  }
}
.details {
  margin-top: 15px;
  .tem_title {
    height: 38px;
    line-height: 38px;
    padding-left: 20px;
    border-bottom: 2px solid #f1f2f6;
  }
  .form {
    width: 350px;
    margin-top: 15px;
    border: 3px solid #f1f2f6;
    padding: 10px;
    .message {
      display: flex;
      align-items: center;
    }
    .textarea_foot {
      display: flex;
      justify-content: space-between;
      background: #f1f2f6;
      padding: 5px 10px;
    }
    .message2 {
      display: flex;
      align-items: center;
    }
  }
  .wechat {
    background: #f6f7fb;
    margin-left: 20px;
    margin-top: 15px;
  }
  .tem_header {
    img {
      width: 300px;
      height: 40px;
    }
  }
  .tem_content {
    background: #ffffff;
    border: 1px solid #f1f2f6;
    border-radius: 6px;
    margin: 20px;
    padding: 0 5px;
    font-size: 12px;
    li {
      margin-top: 10px;
    }
    .con_title {
      padding-top: 5px;
      font-size: 14px;
      font-weight: 600;
      .time {
        font-size: 10px;
        color: #ccc;
        font-weight: normal;
      }
    }
    .bottom {
      height: 30px;
      border-top: 1px solid #f1f2f6;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
.select_box {
  padding: 30px 20px;
  .select {
    margin-top: 15px;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
  }
}
.foot_btn {
  margin-top: 15px;
  text-align: center;
}
</style>