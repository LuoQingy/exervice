<template>
  <div>
    <el-dialog title="参与门店" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <el-input placeholder="输入关键字进行过滤" v-model="filterText" style="width:40%;margin:20px 0;"></el-input>
      <div style="display:flex;justify-content: space-between;">
        <div class="tree_box">
          <div class="allChec">
            <el-checkbox v-model="allChecked" :indeterminate="indeterminate" @change="allchang">全选 &nbsp; 共{{total}}</el-checkbox>
          </div>
          <div class="tree">
            <el-tree
              :data="treeData"
              ref="initTree"
              show-checkbox
              default-expand-all
              node-key="useId"
              :default-checked-keys="checkedkeys"
              :filter-node-method="filterNode"
              :props="props"
              @check="change"
            ></el-tree>
          </div>
        </div>
        <div class="tree_box">
          <div class="allChec">已选&nbsp; {{checkTotal}}</div>
          <div class="tree">
            <el-tree
              :data="checkData"
              ref="tree"
              show-checkbox
              default-expand-all
              node-key="useId"
              :default-checked-keys="treecheckedkeys"
              :props="props2"
            ></el-tree>
          </div>
        </div>
      </div>
      <div class="btnList">
        <el-button type="primary" @click="getCheckedKeys" size="small">保存</el-button>
        <el-button type="primary" size="small" @click="handleClose">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
  
<script>
export default {
  data() {
    var _this = this;
    return {
      filterText: "", //搜索过滤
      dialogVisible: false, //是否弹框
      indeterminate: false, //选择判断，不全选
      treeData: [], //可选择的门店数据
      parentIds: [], //一级分类的id
      checkData: [], //选择的门店数据
      total: 0, //可选择的门店数量
      checkTotal: 0, //可选择的门店数量
      checkedkeys: [], //默认选择的门店id
      treecheckedkeys: [], //选择的门店id
      allChecked: false, //全选
      listLen: 0, //可选门店的所有id 包括一级分类 二级分类 门店
      props: {
        children: "children",
        label: (data, node) => {
          return this.getlabel(data, node);
        }
      },
      props2: {
        children: "children",
        label: (data, node) => {
          return this.getlabel(data, node);
        },
        disabled: () => {
          return true;
        }
      }
    };
  },
  props: {
    storeTreeVisible: {
      type: Boolean,
      default: false
    },
    defaultCheckedKeys:{
      type:Array,
      default:()=> []
    }
  },
  watch: {
    filterText(val) {
      this.$refs.initTree.filter(val);
    },
    storeTreeVisible(val) {
      this.dialogVisible = val;
      this.$nextTick(() => {
        this.getNodes();
      });
    }
  },
  created() {
    this.findIndustryAndMerchant();
  },
  methods: {
    // 获取门店的数据
    findIndustryAndMerchant() {
      this.$xwhttpAuth({
        url: "/mall/findIndustryAndMerchant",
        method: "post"
      })
        .then(res => {
          if (res.data.code == 10000) {
            let data = res.data.resp;
            let arr = []; //储存有门店数据的index  会有重复的index
            let treeData = []; //过滤数据剩下有门店的tree数据
            let total = 0; //treeData拥有的industryId数 全选判断
            let all = 0; //可选的门店数量
            let checkedkeys = [];
            // 遍历门店数据  是否有门店数组项
            data.forEach((dataVal, dataIndex) => {
              if (dataVal.children.length > 0) {
                let forArr = dataVal.children;
                // 过没有门店的二级分类
                for (let index = 0; index < forArr.length; index++) {
                  if (forArr[index].merchantList.length > 0) {
                    //有门店的二级分类
                    all += forArr[index].merchantList.length;
                    forArr[index].useId = `${dataIndex}_${
                      forArr[index].industryId
                    }`; //tree唯一的id   industryId不是唯一的
                    forArr[index].children = [...forArr[index].merchantList];
                    forArr[index].merchantList.forEach(value => {
                      if (this.defaultCheckedKeys.indexOf(value.merchantId) > -1) {
                        checkedkeys.push(
                          `${dataIndex}_${index}_${value.merchantId}`
                        );
                      }
                      //门店加industryId industryName useId kee值  接口数据是没有的
                      value.industryId = value.merchantId;
                      value.industryName = value.merchantName;
                      value.useId = `${dataIndex}_${index}_${value.merchantId}`;
                    });
                    // 保存有门店数据的index
                    arr.push(dataIndex);
                  } else {
                    // 没有门店数组项删除
                    dataVal.children.splice(index, 1);
                    index--;
                  }
                }
              }
            });
            this.total = all;

            // 设置过滤数据剩下有门店的tree数据
            let setArr = Array.from(new Set(arr));
            setArr.forEach(val => {
              data[val].useId = data[val].industryId;
              treeData.push(data[val]);
              this.parentIds.push(data[val].industryId);
            });
            // 获取treeData拥有的industryId数
            total = treeData.length;
            treeData.forEach(val => {
              if (val.children) {
                total += val.children.length;
                val.children.forEach(value => {
                  if (value.children) {
                    total += value.children.length;
                  }
                });
              }
            });
            this.listLen = total;
            this.treeData = treeData;
            this.checkedkeys = checkedkeys;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // tree industryName设置
    getlabel(data, node) {
      let total = 0;
      if (this.parentIds.indexOf(data.useId) > -1) {
        data.children.forEach(val => {
          total += val.children.length;
        });
        return `${data.industryName}(${total})`;
      } else if (data.parentId > 0) {
        total += data.children.length;
        return `${data.industryName}(${total})`;
      } else {
        return `${data.industryName}`;
      }
    },
    // 过滤条件
    filterNode(value, data) {
      if (!value) return true;
      return data.industryName.indexOf(value) !== -1;
    },
    // 权限全选
    allchang(val) {
      let arr = [];
      if (val) {
        this.treeData.forEach(val => {
          arr.push(val.useId);
        });
        this.$refs.initTree.setCheckedKeys(arr);
      } else {
        this.$refs.initTree.setCheckedKeys([]);
      }
      this.getNodes();
    },
    // 点击chekbox
    change(data, val) {
      this.getNodes();
      if (val.checkedKeys.length === this.listLen) {
        this.allChecked = true;
        this.indeterminate = false;
      } else if (val.checkedKeys.length > 0) {
        this.allChecked = false;
        this.indeterminate = true;
      } else {
        this.indeterminate = false;
      }
    },
    // 获取选择的元素数据
    getNodes() {
      let data = this.$refs.initTree.getCheckedNodes(false, true);
      let newData = []; //选择的数据
      let treecheckedkeys = []; //选择的id
      let all = 0; //选择的门店数量
      data.forEach(val => {
        if (this.parentIds.indexOf(val.useId) > -1) {
          //判断该条数据是否为一级分类数据
          let obj = { ...val };
          obj.children = [];
          newData.push(obj);
          treecheckedkeys.push(val.useId);
        } else if (val.parentId) {
          //判断该条数据是否为二级分类数据
          let newDataparentIds = [];
          newData.forEach(val => {
            //添加选择的一级分类id
            newDataparentIds.push(val.useId);
          });
          let index = newDataparentIds.indexOf(val.parentId); //获取一级分类的在 newData index排序
          let obj = { ...val };
          let childrenIds = [];
          //  循环获取下级industryId
          obj.merchantList.forEach(val => {
            childrenIds.push(val.useId);
          });
          //  判断是否有选择自己的下级industryId
          obj.children = [];
          data.forEach(val => {
            if (childrenIds.indexOf(val.useId) > -1) {
              obj.children.push(val);
              treecheckedkeys.push(val.useId);
              all += 1;
            }
          });
          newData[index].children.push(obj);
          treecheckedkeys.push(val.useId);
        }
      });
      this.checkData = newData;
      this.treecheckedkeys = treecheckedkeys;
      this.checkTotal = all;
    },
    // 获取选择的id
    getCheckedKeys() {
      let data = this.$refs.initTree.getCheckedKeys(true);
      let arr = [];
      data.forEach(val=>{
        arr.push(+val.split('_')[2]);
      })
      this.$emit('addstore',arr)
    },
    // 关闭弹框
    handleClose() {
      this.$emit("close");
    }
  }
};
</script>
  
<style scoped lang="less">
.tree_box {
  border: 1px solid #969696;
  width: 45%;
  height: 400px;
  overflow-y: scroll;
  .allChec {
    height: 40px;
    line-height: 40px;
    padding-left: 24px;
    border-bottom: 1px solid #969696;
  }
  .tree {
    padding: 10px 0;
  }
}
.btnList {
  margin: 20px auto;
  text-align: center;
}
</style>