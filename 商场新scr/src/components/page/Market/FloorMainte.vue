<template>
  <div class="floorMainte">
    <div class="tablediv">
      <div class="btn">
        <el-button type="primary" @click="addFloor">新增楼层</el-button>
      </div>
      <div class="table">
        <el-table
          :data="tabledata"
          ref="tabledata"
          border
          :cell-style="()=>'text-align: center;'"
          :header-cell-style="()=>'text-align: center;'"
        >
          <el-table-column label="楼层名称" >
            <template slot-scope="{row}">
              {{row.floorName?row.floorName:'无'}}
            </template>
          </el-table-column>
          <el-table-column label="楼层主营" >
            <template slot-scope="{row}">
              {{row.floorMain?row.floorMain:'无'}}
            </template>
          </el-table-column>
          <el-table-column label="操作" >
            <template slot-scope="{row}">
              <el-button type="text" @click="editRight(row.floorId)">编辑</el-button>
              <el-popover placement="top" width="160" v-model="row.visible">
                <p>确定删除吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="row.visible = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="deleteRight(row.floorId)">确定</el-button>
                </div>
                <el-button type="text" slot="reference">删除</el-button>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
        <!--<div class="thead">-->
          <!--<ul>-->
            <!--<li v-for="(item,index) in tableheader" :key="index">{{item.label}}</li>-->
          <!--</ul>-->
        <!--</div>-->
        <!--<div class="body">-->
          <!--<ul>-->
            <!--<li v-for="(item,index) in tabledata" :key="index">-->
              <!--<div class="bushuang">{{item.floorName?item.floorName:'无'}}</div>-->
              <!--<div class="bushuang">{{item.floorMain?item.floorMain:'无'}}</div>-->
              <!--<div class="bushuang">-->
                <!--<strong @click="editRight(item.floorId)">编辑</strong>-->
                <!--<el-popover placement="top" width="160" v-model="item.visible">-->
                  <!--<p>确定删除吗？</p>-->
                  <!--<div style="text-align: right; margin: 0">-->
                    <!--<el-button size="mini" type="text" @click="item.visible = false">取消</el-button>-->
                    <!--<el-button type="primary" size="mini" @click="deleteRight(item.floorId)">确定</el-button>-->
                  <!--</div>-->
                  <!--<strong slot="reference">删除</strong>-->
                <!--</el-popover>-->
              <!--</div>-->
            <!--</li>-->
          <!--</ul>-->
        <!--</div>-->
      </div>
    </div>
  </div>
</template>

<script>
import upload from "../UploadImg/upload.vue";
import uploadone from "../UploadImg/uploadone.vue";
export default {
  data() {
    return {
      tableheader: [
        { label: "楼层名称" },
        { label: "楼层主营" },
        { label: "操作" }
      ],
      tabledata: [] //会员权益列表
    };
  },
  components: {
    upload,
    uploadone
  },
  created() {
    this.getMallClassifyAndFloor();
  },
  methods: {
    getMallClassifyAndFloor() {
      //获取楼层和一级分类
      let _this = this;
      this.$httpAuth({
        url: "/mall/getMallClassificationAndFloor",
        method: "post"
      })
        .then(res => {
          if (res.data.code == 10000) {
            let resp = res.data.resp;
            if (resp == null || resp.length == 0) {
            } else {
                resp.floor.forEach(val=>{
                  val.visible=false;
              })
              this.tabledata = resp.floor;
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    addFloor() {
      this.$router.push("/market/addFloor");
    },
    editRight(floorId) {
      let _this = this;
      this.$router.push({
        name: "editFloor",
        query: {
          floorId: floorId
        }
      });
    },

    deleteRight(floorId) {
      //删除楼层
      let _this = this;
      this.$xwhttpAuth({
        url: "/mall/deleteFloor",
        method: "get",
        params: {
          floorId: floorId
        }
      })
        .then(res => {
          if (res.data.code == 10000) {
            this.$message.success("删除成功");
          } else {
            this.$message.info("删除失败");
          }
          this.getMallClassifyAndFloor();
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="less" scoped>
.floorMainte {
  .tablediv {
    padding: 20px;
    min-width: 600px;
    .btn {
      padding-top: 20px;
      text-align: right;
    }
    .table {
      margin-top: 20px;
      .thead {
        width: 100%;
        ul {
          width: 100%;
          height: 40px;
          line-height: 40px;
          background: #f2f2f2;
          li {
            float: left;
            width: 33%;
            height: 40px;
            line-height: 40px;
            text-align: center;
            color: #666;
            font-size: 14px;
          }
        }
      }
      .body {
        width: 100%;
        ul {
          width: 100%;
          background: #fff;
          li {
            overflow: hidden;
            width: 100%;
            height: 60px;
            line-height: 60px;
            color: #666;
            border-bottom: 1px solid #f2f2f2;
            .bushuang {
              float: left;
              width: 33%;
              height: 60px;
              line-height: 60px;
              text-align: center;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              font-size: 14px;
              img {
                width: 50px;
                margin-top: 5px;
              }
              .rankinput {
                width: 80px;
                height: 30px;
                line-height: 30px;
                border: 1px solid #f2f2f2;
                outline: none;
                text-align: center;
              }
              i {
                font-size: 18px;
                margin-right: 4px;
              }
              strong {
                color: #409eff;
                margin: 0 10px;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }
}
</style>
