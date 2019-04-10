
<template>
  <div class="shiplabel">
    <div class="title">
      <span class="titletext">会员类型</span>
      <span class="titlebtn" @click="addLabelType">
        <span>新增标签类型</span>
      </span>
    </div>
    <div>
      <div class="classify" v-for="(item,index) in tagTypelist" :key="index">
        <div class="left">
          <h5>{{item.uttName}}</h5>
          <ul>
            <li class="tags-li" v-for="(itemtags,itemindex) in item.usersTagList" :key="itemindex">
              {{itemtags.utagName}}
              <span class="tags-li-icon" @click="closeTags(item.uttId,itemtags.utagId)">
                <i v-if="item.mallId!=0" class="el-icon-close"></i>
              </span>
            </li>
            <input
              v-model="item.inputtag"
              maxlength="15"
              v-if="item.mallId!=0"
              @click="addTags(index)"
              :class="activeIndex===index?'activeaddInput':'addInput'"
              :placeholder="activeIndex===index?'':inputstr"
              @blur="leaveLabel(item.uttId,index)"
              @keyup.enter="leaveLabel(item.uttId,index)"
              :ref="'input'+index"
              type="text"
            >
          </ul>
        </div>
        <div v-if="item.mallId!=0" class="right" @click="closeAll(item.uttId)">
          <span>删除</span>
        </div>
      </div>
    </div>
    <!-- 新增标签类型的模态弹出框 -->
    <el-dialog title="新增标签类型" :visible.sync="labelTypeState" width="40%">
      <div class="formdiv">
        <el-form label-width="120px" class="demo-ruleForm">
          <el-form-item label="类型名称:" required>
            <el-input v-model="ruleForm.name" maxlength="10" style="width:80%;" size="medium">
              <span slot="suffix" class="tiptext">{{ruleForm.name.length}}/10</span>
            </el-input>
          </el-form-item>
          <el-form-item label="类型描述:" required>
            <el-input type="textarea" :rows="3" maxlength="100" v-model="ruleForm.intro" style="width:80%;" size="medium"></el-input>
            <span class="tiparea">{{ruleForm.intro.length}}/100</span>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeLabelType()">取 消</el-button>
        <el-button type="primary" @click="comfire()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { specailTest } from "@/libs/regular.js";
export default {
  data() {
    return {
      tagTypelist: [],
      inputstr: "+ 添加标签",
      labelTypeState: false, //新增标签类型的模态弹出框状态
      ruleForm: {
        name: "",
        intro: "",
        type: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个等级",
            trigger: "change"
          }
        ]
      },
      writeInput: true, //输入框处于激活状态
      inputtag: "", //输入框的值
      activeIndex: -1 //当前点击的添加新标签文字
    };
  },
  mounted() {
    this.getLabelList();
  },
  methods: {
    // 获取用户标签列表
    getLabelList() {
      let _this = this;
      var data = "mallId=" + 1;
      this.$httpAuth({
        url: "/mall/getUsersTagList",
        method: "post"
      })
        .then(data => {
          let resp = data.data.resp;
          // 系统标签放在后面
          let val = resp.splice(0, 1);
          console.log(val);
          resp.push(val[0]);
          _this.tagTypelist = resp;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 新增标签类型
    addLabelType() {
      let _this = this;
      _this.labelTypeState = true;
    },
    closeLabelType() {
      let _this = this;
      _this.labelTypeState = false;
    },
    // 新增新的类型标签
    comfire() {
      let _this = this;
      if (_this.ruleForm.name == "") {
        this.$message.info("类型名称不能为空");
        return;
      } else if (specailTest(this.ruleForm.name)) {
        this.$message.info("类型名称不能为特殊字符和空格");
        return;
      } else if (_this.ruleForm.intro == "") {
        this.$message.info("类型描述不能为空");
        return;
      }

      this.$httpAuth({
        url: "/mall/addUsersTagType",
        method: "post",
        data: {
          uttName: _this.ruleForm.name,
          uttDescribe: _this.ruleForm.intro
        }
      })
        .then(data => {
          if (data.data.code == 10000) {
            this.$message.success(data.data.resp);
            _this.getLabelList();
            _this.labelTypeState = false;
            this.ruleForm.name = "";
            this.ruleForm.intro = "";
          } else {
            this.$message.success(data.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 删除类型中的标签
    deleteHaveTags(itemtagsid) {
      let _this = this;
      let data = "utagId=" + itemtagsid;
      this.$xwhttpAuth({
        url: "/mall/deleteUsersTag",
        method: "post",
        data: data
      })
        .then(data => {
          if (data.data.code == 10000) {
            _this.getLabelList();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 关闭单个标签
    closeTags(itemid, itemtagsid) {
      let _this = this;
      this.$confirm("确认删除？")
        .then(_ => {
          _this.deleteHaveTags(itemtagsid); //关闭一行的中的某个类型标签的数据库操作
          //关闭一行的中的某个类型标签的页面操作
        })
        .catch(_ => {});
    },
    // 删除某种类型的全部标签
    deleteLabelTags(id) {
      let _this = this;
      this.$httpAuth({
        url: "/mall/deleteUsersTagType",
        method: "post",
        data: {
          uttId: id
        }
      })
        .then(data => {
          if (data.data.code == 10000) {
            _this.getLabelList();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 关闭某种类型的全部标签
    closeAll(id) {
      let _this = this;
      this.$confirm("确认删除？")
        .then(_ => {
          _this.deleteLabelTags(id); //关闭一行类型标签的数据库操作
        })
        .catch(_ => {});
    },
    // 添加类型中的标签
    addNewTags(utagType, index) {
      let _this = this;
      this.$httpAuth({
        url: "/mall/addUsersTag",
        method: "post",
        data: {
          utagName: this.tagTypelist[index].inputtag,
          utagType: utagType
        }
      })
        .then(data => {
          this.tagTypelist[index].inputtag = "";
          this.activeIndex = -1;
          if (data.data.code == 10000) {
            _this.getLabelList();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 设置标签
    addTags(index) {
      this.activeIndex = index;
    },
    //鼠标移出输入框
    leaveLabel(id, index) {
      document.activeElement.blur();
      if (
        !this.tagTypelist[index].inputtag ||
        specailTest(this.tagTypelist[index].inputtag)
      ) {
        this.activeIndex = "index";
        this.tagTypelist[index].inputtag = "";
        this.$message({
          message: "不支持空格和特殊字符",
          type: "warning"
        });
      } else {
        let hastag = this.tagTypelist[this.activeIndex].usersTagList.some(
          val => {
            return val.utagName === this.tagTypelist[index].inputtag;
          }
        );
        if (hastag) {
          this.tagTypelist[index].inputtag = "";
          this.activeIndex = -1;
          this.$message({
            message: "标签重复",
            type: "warning"
          });
          return;
        }
        this.addNewTags(id, index); //新增一行的中的某个类型标签的数据库操作
        //新增一行的中的某个类型标签的数据库操作
      }
    }
  }
};
</script>


<style lang="less" scoped>
.shiplabel {
  box-sizing: border-box;
  width: 100%;
  .title {
    width: 100%;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #f2f2f2;
    display: flex;
    .titletext {
      flex: 1;
    }
    .titlebtn {
      flex: 1;
      text-align: right;
      span {
        width: 100px;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        background: #409eff;
        display: inline-block;
        text-align: center;
        color: #fff;
        border-radius: 4px;
      }
    }
  }
  .classify {
    width: 100%;
    line-height: 60px;
    border-bottom: 1px solid #f2f2f2;
    display: flex;
    padding-bottom: 20px;
    &:last-child {
      border-bottom: none;
    }
    .left {
      flex: 4;
      ul {
        box-sizing: border-box;
        width: 100%;
      }

      .tags-li {
        float: left;
        height: 23px;
        line-height: 23px;
        margin: 3px 5px 2px 3px;
        border-radius: 3px;
        font-size: 12px;
        overflow: hidden;
        cursor: pointer;
        border: 1px solid #4296e7;
        background: #eaf4fe;
        padding: 0 5px 0 5px;
        vertical-align: middle;
        color: #4296e7;
        transition: all 0.3s ease-in;
        text-align: center;
        i {
          color: #4296e7;
        }
      }

      .activeaddInput {
        float: left;
        height: 23px;
        line-height: 23px;
        margin: 3px 5px 2px 3px;
        border-radius: 3px;
        font-size: 12px;
        border: 1px solid #4296e7;
        padding: 0 5px 0 5px;
        vertical-align: middle;
        -webkit-transition: all 0.3s ease-in;
        transition: all 0.3s ease-in;
        text-align: center;
        min-width: 66px;
        outline: none;
      }
      .addInput {
        float: left;
        height: 23px;
        line-height: 23px;
        margin: 3px 5px 2px 3px;
        border-radius: 3px;
        font-size: 12px;
        border: 1px solid #f2f2f2;
        padding: 0 5px 0 5px;
        vertical-align: middle;
        -webkit-transition: all 0.3s ease-in;
        transition: all 0.3s ease-in;
        text-align: center;
        width: 66px;
        outline: none;
      }
      .addtagsli {
        float: left;
        margin: 3px 5px 2px 3px;
        border-radius: 3px;
        font-size: 12px;
        overflow: hidden;
        cursor: pointer;
        border: 1px solid #f2f2f2;
        background: #fff;
        padding: 0 5px 0 12px;
        vertical-align: middle;
        transition: all 0.3s ease-in;
        text-align: center;
        height: 23px;
        line-height: 23px;
        color: #000;
        &:hover {
          color: #4296e7;
          border: 1px solid #4296e7;
        }
      }
    }
    .right {
      text-align: right;
      span {
        width: 50px;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        background: #fee3e8;
        display: inline-block;
        text-align: center;
        color: red;
        border-radius: 4px;
        border: 1px solid red;
      }
    }
  }
  .formdiv {
    margin: 0 auto;
    .demo-ruleForm {
      margin-top: 20px;
      .tiptext {
        position: absolute;
        right: 42%;
        top: 2px;
        color: #666;
      }
      .tiparea {
        position: absolute;
        right: 22%;
        bottom: -30px;
        color: #666;
      }
    }
  }
}
</style>
