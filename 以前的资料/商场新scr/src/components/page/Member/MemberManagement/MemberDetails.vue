<template>
  <div style="padding-bottom:20px;">
    <div>
      <el-breadcrumb separator="/" class="content_title">
        <el-breadcrumb-item :to="{ path: '/member/management' }">会员管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/member/lists' }">会员列表</el-breadcrumb-item>
        <el-breadcrumb-item>会员详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="details">
      <!-- 详情左边 -->
      <div class="details_left">
        <!-- 个人头像 -->
        <div>
          <div style="text-align: center;height: 250px;">
            <img class="user_img" :src="userInfo.usersPortrait" alt>
          </div>
          <div class="left_lists">
            <div class="list">
              <p>积分</p>
              <p>{{userBehaviorRecord.ubrAvailableCoin}}</p>
            </div>
            <div class="list">
              <p>等级</p>
              <p>{{usersMemberGrade.umgName}}</p>
            </div>
            <div class="list">
              <p>卡券</p>
              <p>{{userBehaviorRecord.couponCount?userBehaviorRecord.couponCount:0}}</p>
            </div>
          </div>
        </div>
        <!-- 关联渠道 关联时间 -->
        <ul class="creat">
          <li class="creat_list">
            <span>首次领取渠道:</span>
            <span>{{userInfo.usersFirstPlace}}</span>
          </li>
          <li class="creat_list">
            <span>关联渠道:</span>
            <span>{{userInfo.usersRelevancePlace}}</span>
          </li>
          <li class="creat_list">
            <span>开卡时间:</span>
            <span>{{userInfo.usersActivateTime}}</span>
          </li>
          <li class="creat_list">
            <span>关注时间:</span>
            <span>{{userInfo.usersConcernTime}}</span>
          </li>
          <li class="creat_list">
            <span>关注来源:</span>
            <span>{{userInfo.usersCancelSource}}</span>
          </li>
          <li class="creat_list">
            <span>取关时间:</span>
            <span>{{userInfo.usersCancelTime}}</span>
          </li>
          <li class="creat_list">
            <span>会员状态:</span>
            <span>{{ userInfo.usersStatus| status}}</span>
          </li>
        </ul>
      </div>
      <div class="details_right">
        <!-- 基本信息 -->
        <div class="details_right_list">
          <div class="title">
            <span>基本信息</span>
            <el-button type="primary" @click="editTap" size="mini">{{btntext}}</el-button>
          </div>
          <div class="mflex">
            <ul class="r_details">
              <li class="r_details_list">
                <span>会员卡号:</span>
                <span>{{usersMemberCardList.umcNum}}</span>
              </li>
              <li class="r_details_list">
                <span>昵称:</span>
                <span v-if="!edit">{{userInfo.usersNickName}}</span>
                <el-input v-else v-model="userInfo.usersNickName" :readonly="!edit" size="mini" style="flex:1;"></el-input>
              </li>
              <li class="r_details_list">
                <span>性别:</span>
                <span v-if="!edit">{{usersSex}}</span>
                <p v-else style="flex:1;">
                  <el-select v-model="userInfo.usersSex" size="mini" style="width:100%;">
                    <el-option label="男" :value="1"></el-option>
                    <el-option label="女" :value="2"></el-option>
                    <el-option label="其他" :value="3"></el-option>
                  </el-select>
                </p>
              </li>
              <li class="r_details_list">
                <span>出生日期:</span>
                <el-date-picker  :readonly='!edit' v-model="userInfo.usersBirthdate" size="mini" style="flex:1;" type="date" placeholder="选择日期"></el-date-picker>
              </li>
              <li class="r_details_list">
                <span>车辆信息:</span>
                <div v-if="!edit">
                  <template v-for="item in usercarlist">
                    <el-tag style="color:#ffffff;margin-right:5px;" color="#169bd5">{{item}}</el-tag>
                  </template>
                </div>
                <div v-if="edit">
                  <div>
                    <template v-for="(item,index) in usercarlist">
                      <span @click="tagTap(index)">
                        <el-tag style="color:#ffffff;margin-right:5px;" color="#169bd5">{{item}}</el-tag>
                      </span>
                    </template>
                    <span v-if="usercarlist.length<3" @click="dialogVisible = true">
                      <el-tag style="color:#ffffff;" color="#169bd5">新增车牌</el-tag>
                    </span>
                  </div>
                </div>
              </li>
              <li class="r_details_list">
                <span>婚姻状态:</span>
                <span v-if="!edit">{{userInfo.usersIsMarriageStatus?'已婚':'未婚'}}</span>
                <p v-else style="flex:1;">
                  <el-select v-model="userInfo.IsMarriageStatus" size="mini" style="width:100%;">
                    <el-option label="已婚" :value="1"></el-option>
                    <el-option label="未婚" :value="0"></el-option>
                  </el-select>
                </p>
              </li>
              <li class="r_details_list">
                <span>子女1年龄:</span>
                <span v-if="!edit">{{OffspringOne}}</span>
                <el-date-picker
                  v-else
                  v-model="userInfo.usersOffspringOne"
                  value-format="timestamp"
                  size="mini"
                  style="flex:1;"
                  type="date"
                  placeholder="选择日期"
                  :readonly="userInfo.OffspringMessage=='0'"
                ></el-date-picker>
              </li>
              <li class="r_details_list">
                <span>所在城市:</span>
                <div style="flex:1;display:flex;">
                  <el-select
                    v-model="province"
                    placeholder="请选择"
                    @change="(val)=>{provinceChang(val,'city_list')}"
                    style="margin-right:5px;"
                    :disabled="!edit"
                  >
                    <el-option v-for="items in AllArea.province_list" :key="items.val" :label="items.label" :value="items.val"></el-option>
                  </el-select>
                  <el-select
                    v-model="city"
                    placeholder="请选择"
                    :disabled="!edit"
                    @change="(val)=>{provinceChang(val,'county_list')}"
                    style="margin-right:5px;"
                  >
                    <el-option v-for="items in city_list" :key="items.val" :label="items.label" :value="items.val"></el-option>
                  </el-select>
                  <el-select v-model="county" placeholder="请选择" :disabled="!edit" style="margin-right:5px;">
                    <el-option v-for="items in county_list" :key="items.val" :label="items.label" :value="items.val"></el-option>
                  </el-select>
                </div>
              </li>
            </ul>
            <ul class="r_details">
              <li class="r_details_list">
                <span>手机号:</span>
                <span>{{userInfo.usersPhoneNumber}}</span>
              </li>
              <li class="r_details_list">
                <span>姓名:</span>
                <span v-if="!edit">{{userInfo.usersName}}</span>
                <el-input v-else v-model="userInfo.usersName" size="mini" style="flex:1;"></el-input>
              </li>
              <li class="r_details_list">
                <span>身份证号:</span>
                <span v-if="!edit">{{userInfo.usersIdCard}}</span>
                <el-input v-else v-model="userInfo.usersIdCard" size="mini" style="flex:1;"></el-input>
              </li>
              <li class="r_details_list">
                <span>电子邮箱:</span>
                <span v-if="!edit">{{userInfo.usersMail}}</span>
                <el-input v-else v-model="userInfo.usersMail" size="mini" style="flex:1;"></el-input>
              </li>
              <li class="r_details_list">
                <span>人脸状态:</span>
                <span>{{userInfo.usersIsVerifaceStatus?'已绑定':'未绑定'}}</span>
              </li>
              <li class="r_details_list">
                <span>子女信息:</span>
                <span v-if="!edit">{{userInfo.usersIsOffspringMessage?'有子女':'无子女'}}</span>
                <p v-else style="flex:1;">
                  <el-select v-model="userInfo.OffspringMessage" @change="OffspringMessageChang" size="mini" style="width:100%;">
                    <el-option label="有子女" :value="1"></el-option>
                    <el-option label="无子女" :value="0"></el-option>
                  </el-select>
                </p>
              </li>
              <li class="r_details_list">
                <span>子女2年龄:</span>
                <span v-if="!edit">{{OffspringTwo}}</span>
                <el-date-picker
                  v-else
                  v-model="userInfo.usersOffspringTwo"
                  value-format="timestamp"
                  size="mini"
                  style="flex:1;"
                  type="date"
                  placeholder="选择日期"
                  :readonly="userInfo.OffspringMessage=='0'"
                ></el-date-picker>
              </li>
              <li class="r_details_list">
                <span>详细地址:</span>
                <span v-if="!edit">{{userInfo.usersDetailedAddress}}</span>
                <el-input v-else v-model="userInfo.usersDetailedAddress" size="mini" style="flex:1;"></el-input>
              </li>
            </ul>
          </div>
        </div>
        <!-- 消费及行为记录 -->
        <div class="details_right_list">
          <div class="title">
            <span>消费及行为记录</span>
          </div>
          <ul class="behavior">
            <li class="behavior_list" @click="functioTap(1)">
              <p class="behaviornumber">{{userBehaviorRecord.ubrAvailableCoin}}</p>
              <p>可用积分</p>
            </li>
            <li class="behavior_list" @click="functioTap(1)">
              <p class="behaviornumber">{{userBehaviorRecord.ubrAccumulateCoin}}</p>
              <p>累计积分</p>
            </li>
            <li class="behavior_list" @click="functioTap(3)">
              <p class="behaviornumber">{{userBehaviorRecord.ubrTotal}}</p>
              <p>消费总额</p>
            </li>
            <li class="behavior_list" @click="functioTap(3)">
              <p class="behaviornumber">{{userBehaviorRecord.ubrExpenditureNum}}</p>
              <p>消费次数</p>
            </li>
            <li class="behavior_list" @click="functioTap(5)">
              <p class="behaviornumber">{{userBehaviorRecord.ubrGroupOrder}}</p>
              <p>团购订单</p>
            </li>
            <li class="behavior_list" @click="functioTap(6)">
              <p class="behaviornumber">{{userBehaviorRecord.ubrCollectMerchant}}</p>
              <p>收藏商户</p>
            </li>
            <li class="behavior_list" @click="functioTap(7)">
              <p class="behaviornumber">{{userBehaviorRecord.ubrBrowseNum}}</p>
              <p>浏览次数</p>
            </li>
            <li class="behavior_list" @click="functioTap(8)">
              <p class="behaviornumber">{{userBehaviorRecord.ubrOfflineNum}}</p>
              <p>线下到访次数</p>
            </li>
          </ul>
        </div>
        <!-- 会员标签 -->
        <div class="details_right_list">
          <div class="title">
            <span>会员标签</span>
            <el-button type="primary" size="mini" @click="showdialog">新增</el-button>
          </div>
          <div class="label">
            <div class="label_list">
              <p class="label_title">———————— &nbsp;手动标签&nbsp; ————————</p>
              <div>
                <template v-for="item in UsersTagList">
                  <span v-if="item!==null&&item.mallId!==0">
                    <template v-for="items in item.usersTagList">
                      <el-tag style="color:#ffffff;margin:10px;" color="#169bd5">{{items.utagName}}</el-tag>
                    </template>
                  </span>
                </template>
              </div>
            </div>
            <div class="label_list">
              <p class="label_title">———————— &nbsp;系统默认标签&nbsp; ————————</p>
              <div>
                <template v-if="item" v-for="item in UsersTagList">
                  <span v-if="item!==null&&item.mallId===0">
                    <template v-for="items in item.usersTagList">
                      <el-tag style="color:#ffffff;margin:10px;" color="#169bd5">{{items.utagName}}</el-tag>
                    </template>
                  </span>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="table">
      <el-table :data="logList" style="width: 100%" :header-cell-style="log_header">
        <el-table-column prop="ulogOperationTime" label="时间" width="180"></el-table-column>
        <el-table-column prop="ulogType" label="日志类型" width="180"></el-table-column>
        <el-table-column prop="ulogDetails" label="日志详情" width="180"></el-table-column>
        <el-table-column prop="ulogReasons" label="事由"></el-table-column>
        <el-table-column prop="ulogRemark" label="备注"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          background
          layout="total, sizes, prev, pager, next"
          :total="logData.total"
        ></el-pagination>
      </div>
    </div>
    <!-- 标签 -->
    <update-tag
      :tabFormVisible="tabFormVisible"
      @updateUsersTag="getUsersTagListByUsersId"
      :updateUsers="updateUsers"
      :usersName="userInfo.usersName"
      @delusers="updateUsers=''"
      @closedialogForm="tabFormVisible =false"
    ></update-tag>
    <!-- 车牌 -->
    <el-dialog title="车辆信息" :visible.sync="dialogVisible" width="50%">
      <div style="text-align:center;">
        <el-input v-model="carlist[0]" maxlength="1" style="width:70px;"></el-input>
        <el-input v-model="carlist[1]" maxlength="1" style="width:70px;"></el-input>
        <span class="dian"></span>
        <el-input v-model="carlist[2]" maxlength="1" style="width:70px;"></el-input>
        <el-input v-model="carlist[3]" maxlength="1" style="width:70px;"></el-input>
        <el-input v-model="carlist[4]" maxlength="1" style="width:70px;"></el-input>
        <el-input v-model="carlist[5]" maxlength="1" style="width:70px;"></el-input>
        <el-input v-model="carlist[6]" maxlength="1" style="width:70px;"></el-input>
        <el-input v-model="carlist[7]" maxlength="1" style="width:70px;" placeholder="新能源"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="addcar">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
  
<script>
import { formdata } from "@/libs/formdata.js";
import updateTag from "./MenberList/UpdateUsersTag";
import {specailTest,mailTest,IDTest,cardTest} from "@/libs/regular.js";
export default {
  components: {
    updateTag
  },
  data() {
    return {
      userid: "",
      updateUsers: "",
      tabFormVisible: false,
      edit: false, //是否编辑用户信息
      btntext: "编辑",
      dialogVisible: false,
      AllArea: {},
      province: "",
      city_list: [],
      city: "",
      county_list: [],
      county: "",
      editcar: "",
      carlist: ["", "", "", "", "", "", "", ""],
      usercarlist: [],
      val: "",
      userInfo: {
        usersOffspringOne: ""
      }, //用户信息
      OffspringOne: "",
      OffspringTwo: "",
      UsersTagList: [], //用户标签
      usersMemberGrade: "",
      usersMemberCardList: "",
      userBehaviorRecord: "",
      logList: [],
      logData: "",
      pageSize: 10,
      radio: "",
      log_header: {
        "background-color": "#f1f3f7",
        "border-bottom": "1px #cccccc solid"
      },
      currentPage: 1
    };
  },
  created() {
    this.userid = this.$route.query.userid;
    this.getuserinfo(this.$route.query.userid);
    this.getUsersTagListByUsersId();
    this.getUsersRecord(this.$route.query.userid);
    this.getArea();
  },
  methods: {
    //   获取用户的所有信息
    getuserinfo(userid) {
      let formData = formdata({
        usersId: userid
      });
      this.$httpAuth
        .post("mall/getUsersInfo", formData)
        .then(result => {
          const data = result.data.resp;
          if (result.data.code === 10000) {
            data.IsMarriageStatus = data.usersIsVerifaceStatus ? 1 : 0;
            data.OffspringMessage = data.usersIsOffspringMessage ? 1 : 0;
            if(data.usersOffspringOne){
              this.OffspringOne =
              new Date().getFullYear() -
              new Date(data.usersOffspringOne).getFullYear();
              data.usersOffspringOne = new Date(data.usersOffspringOne).getTime();
            }
            if(data.usersOffspringTwo){
              this.OffspringTwo =
              new Date().getFullYear() -
              new Date(data.usersOffspringTwo).getFullYear();
              data.usersOffspringTwo = new Date(data.usersOffspringTwo).getTime();
            }
            if (data.usersVehicleInformation) {
              this.usercarlist = data.usersVehicleInformation.split(",");
            }
            this.userInfo = data;
            // console.log(data);
            this.usersMemberCardList = data.usersMemberCardList[0];
            this.userBehaviorRecord = data.userBehaviorRecord;
            this.usersMemberGrade =
              data.usersMemberCardList[0].usersMemberGrade;
          } else {
          }
        })
        .catch(err => {});
    },
    // 获取用户的标签
    getUsersTagListByUsersId() {
      let formData = formdata({
        usersId: this.userid
      });
      this.$httpAuth
        .post("mall/getUsersTagListByUsersId", formData)
        .then(result => {
          const data = result.data.resp;
          if (result.data.code === 10000) {
            // console.log(data);
            this.UsersTagList = data;
          } else {
          }
        })
        .catch(err => {});
    },
    // 获取用户的日子记录
    getUsersRecord(usersId) {
      let formData = formdata({
        usersId: usersId,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      });
      this.$httpAuth
        .post("mall/getUsersLog", formData)
        .then(result => {
          if (result.data.code === 10000) {
            this.logList = result.data.resp.list;
            this.logData = result.data.resp;
          }
        })
        .catch(err => {});
    },
    // 省市区数据
    getArea() {
      let formData = formdata({
        usersId: this.userid
      });
      this.$httpAuth
        .get("/open/getArea")
        .then(result => {
          const data = result.data.resp;
          if (result.data.code === 10000) {
            let obj = [];
            let info = {};
            for (var key in data) {
              let arr = [];
              for (var k in data[key]) {
                arr.push({ label: data[key][k], val: k });
              }
              info[key] = arr;
            }
            this.AllArea = info;
            this.province = this.userInfo.periodid.toString();
            this.provinceChang(this.province,'city_list');
            this.city = this.userInfo.cityid.toString();
            this.provinceChang(this.city,'county_list');
            this.county = this.userInfo.areaid.toString();
          } else {
          }
        })
        .catch(err => {});
    },
    // 选择省
    provinceChang(val, key) {
      if (val) {
        let num;
        let arr = [];
        if (key === "city_list") {
          num = 0;
        }
        if (key === "county_list") {
          num = 2;
        }
        let str = val.slice(0, num + 2);
        this.AllArea[key].forEach(value => {
          if (value.val.slice(0, num + 2) === str) {
            arr.push(value);
          }
        });
        this[key] = arr;
        if (key === "city_list") {
          this.city = "";
          this.county = "";
        }
        if (key === "county_list") {
          this.county = "";
        }
      } else {
        return;
      }
    },
    // 点击显示用户功能页
    functioTap(val) {
      this.$router.push({
        name: "function",
        query: { type: val, userId: Number(this.userid) }
      });
    },
    // 编辑保存用户的详细信息
    editTap() {
      if (this.edit) {
        if (
          this.userInfo.usersNickName &&
          specailTest(this.userInfo.usersNickName)
        ) {
          this.$message({
            message: "昵称不能有特殊字符",
            type: "warning"
          });
          return;
        } else if (!this.userInfo.usersBirthdate) {
          this.$message({
            message: "请选择生日日期",
            type: "warning"
          });
          return;
        }
        if (!this.userInfo.usersName) {
          this.$message({
            message: "请输入姓名",
            type: "warning"
          });
          return;
        } else if (
          this.userInfo.usersName &&
          specailTest(this.userInfo.usersName)
        ) {
          this.$message({
            message: "姓名不能有特殊字符",
            type: "warning"
          });
          return;
        } else if (
          this.userInfo.usersIdCard &&
          !IDTest(this.userInfo.usersIdCard)
        ) {
          this.$message({
            message: "身份证格式错误",
            type: "warning"
          });
          return;
        } else if (
          this.userInfo.usersMail &&
          !mailTest(this.userInfo.usersMail)
        ) {
          this.$message({
            message: "邮箱格式错误",
            type: "warning"
          });
          return;
        } else if (
          this.userInfo.usersDetailedAddress &&
          specailTest(this.userInfo.usersDetailedAddress)
        ) {
          this.$message({
            message: "详细地址不能有特殊字符",
            type: "warning"
          });
          return;
        }
        if (
          this.userInfo.OffspringMessage == 1 &&
          this.userInfo.usersOffspringOne
        ) {
          let year = new Date(this.userInfo.usersOffspringOne).getFullYear();
          let now = new Date().getFullYear();
          if (now - year < 0) {
            this.$message({
              message: "年龄不能为负数",
              type: "warning"
            });
            return;
          }
        }
        if (
          this.userInfo.OffspringMessage == 1 &&
          this.userInfo.usersOffspringTwo
        ) {
          let year = new Date(this.userInfo.usersOffspringTwo).getFullYear();
          let now = new Date().getFullYear();
          if (now - year < 0) {
            this.$message({
              message: "年龄不能为负数",
              type: "warning"
            });
            return;
          }
        }
        if (this.userInfo.OffspringMessage == "0") {
          this.userInfo.usersOffspringOne = null;
          this.userInfo.usersOffspringTwo = null;
        }
        this.$httpAuth
          .post("mall/updateUsersInfo", {
            usersId: this.userid, //类型：String  必有字段  备注：无
            usersNickName: this.userInfo.usersNickName?this.userInfo.usersNickName:this.userInfo.usersName, //类型：String  可有字段  备注：昵称
            usersPhoneNumber: this.userInfo.usersPhoneNumber, //类型：String  可有字段  备注：手机号
            usersName: this.userInfo.usersName, //类型：String  可有字段  备注：姓名
            usersSex: this.userInfo.usersSex, //类型：String  可有字段  备注：性别(1:男 2女 3:未知)
            usersIdCard: this.userInfo.usersIdCard, //类型：String  可有字段  备注：身份证号
            usersBirthdate: new Date(this.userInfo.usersBirthdate).getTime(), //类型：String  可有字段  备注：出生日期
            usersMail: this.userInfo.usersMail, //类型：String  可有字段  备注：电子邮箱
            usersLivingCity: this.userInfo.usersLivingCity, //类型：String  可有字段  备注：居住城市
            usersDetailedAddress: this.userInfo.usersDetailedAddress, //类型：String  可有字段  备注：详细地址
            usersVehicleInformation: this.usercarlist.join(","),
            usersIsOffspringMessage:
              this.userInfo.OffspringMessage == 1 ? true : false,
            usersOffspringOne: this.userInfo.usersOffspringOne,
            usersOffspringTwo: this.userInfo.usersOffspringTwo,
            usersIsMarriageStatus:
              this.userInfo.IsMarriageStatus == 1 ? true : false,
            periodid: this.province, //类型：String  可有字段  备注：省
            cityid: this.city, //类型：String  可有字段  备注：市
            areaid: this.county //类型：String  可有字段  备注：区
          })
          .then(result => {
            if (result.data.code === 10000) {
              this.$message.success(result.data.resp);
              this.getuserinfo(this.$route.query.userid);
            } else {
              this.$message.warning(result.data.resp);
            }
          })
          .catch(err => {});
      } else {
        this.btntext = "保存";
      }
      this.edit = !this.edit;
      this.btntext = this.edit?'保存':'编辑';
    },
    OffspringMessageChang(val){
        if(val=='0'){
          this.userInfo.usersOffspringOne =null;
          this.userInfo.usersOffspringTwo =null;
        }
    },
    // 点击车牌修改车牌
    tagTap(index) {
      this.dialogVisible = true;
      this.editcar = index;
      this.carlist = this.usercarlist[index].split("");
    },
    // 添加车牌
    addcar() {
      let car = this.carlist.join("");
      if (!cardTest(car)) {
        this.$message({
          message: "车牌填写格式有误",
          type: "warning"
        });
      } else if (!this.editcar && this.editcar !== 0) {
        this.usercarlist.push(car);
      } else {
        this.usercarlist.splice(this.editcar, 1, car);
      }
      this.carlist = ["", "", "", "", "", "", "", ""];
      this.dialogVisible = false;
      this.editcar = "";
    },
    // 取消
    close() {
      this.carlist = ["", "", "", "", "", "", "", ""];
      this.dialogVisible = false;
      this.editcar = "";
    },
    showdialog() {
      this.tabFormVisible = true;
      this.updateUsers = this.userid;
    },
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getUsersRecord(this.$route.query.userid);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getUsersRecord(this.$route.query.userid);
    }
  },
  computed: {
    usersSex() {
      if (this.userInfo.usersSex == 1) {
        return "男";
      } else if (this.userInfo.usersSex == 2) {
        return "女";
      } else {
        return "未知";
      }
    }
  },
  filters: {
    status(val) {
      if (val === 1) {
        return "正常";
      } else if (val === 2) {
        return "冻结";
      } else {
        return "异常";
      }
    },
    sex(val) {
      if (val === 1) {
        return "男";
      } else if (val === 2) {
        return "女";
      }
    }
  }
};
</script>
  
<style scoped lang="less">
.details {
  margin-left: 10px;
  margin-top: 10px;
  display: flex;
  font-size: 14px;
}
.details .details_left {
  width: 300px;
  background: #ffffff;
  padding-top: 20px;
  border: 1px solid #cccccc;
}
.details_left .user_img {
  width: 250px;
  height: 250px;
  text-align: center;
  box-shadow: 4px 4px 2px #cccccc;
}
.details_left .left_lists {
  display: flex;
}
.details_left .left_lists .list {
  flex: 1;
  text-align: center;
  font-size: 14px;
  height: 58px;
  display: flex;
  flex-flow: column;
  justify-content: space-around;
}
.details_left .creat {
  border-top: 1px solid #cccccc;
  padding: 30px 20px;
}
.details_left .creat .creat_list {
  height: 38px;
  display: flex;
  justify-content: space-between;
}
.details_right {
  background: #ffffff;
  flex: 1;
  margin-left: 10px;
}
.details_right_list {
  padding-bottom: 30px;
  border: 1px solid #cccccc;
  margin-bottom: 15px;
}
.details_right .details_right_list:nth-of-type(3) {
  margin-bottom: 0;
}
.details_right .title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  height: 38px;
  background: #f2f2f2;
}
.details_right .r_details {
  flex: 1;
  padding-top: 20px;
  el-input {
    flex: 1;
  }
}
.details_right .r_details:nth-of-type(2) {
  margin-left: 40px;
  padding-right: 10px;
}
.details_right .r_details .r_details_list {
  display: flex;
  height: 38px;
  align-items: center;
}
.r_details_list > span:nth-of-type(1) {
  width: 100px;
  text-align: right;
  margin-right: 15px;
}
.details_right_list {
  .behavior {
    display: flex;
    flex-wrap: wrap;
    padding-top: 10px;
    .behavior_list {
      text-align: center;
      width: 25%;
      margin: 10px 0;
      color: #ccc;
      cursor: pointer;
      .behaviornumber {
        font-size: 18px;
        font-weight: bold;
        color: #000;
      }
      > p {
        height: 30px;
        line-height: 30px;
      }
    }
  }
}
.label {
  margin-top: 10px;
  .label_list:nth-of-type(1) {
    margin-bottom: 30px;
  }
  .label_title {
    margin-bottom: 20px;
    text-align: center;
  }
}
.table {
  margin-left: 10px;
  padding: 10px;
  margin-top: 20px;
  background: #ffffff;
  .pagination {
    text-align: right;
    margin: 20px 0 0;
  }
}
.dian {
  display: inline-block;
  width: 10px;
  height: 10px;
  background: #000;
  border-radius: 50%;
}
/deep/ .el-dialog__body .el-input__inner {
  text-align: center;
}
</style>