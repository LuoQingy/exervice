import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    home: null,
    loginMsg: null,
    nav: null,
    scrollTop: 0,
    loading: {
      text: '加载中',
      isShow: false
    },
    dragContent: [],
    allChildren: 0,
    curIndex: 0,
    saveContent: {},
    AllMemberGroup: true,  //智能营销 分组刷选
    AllCoupon: true, //智能营销 卡券
    activememberGroup: {}, //分组数据
    activecoupon: {},//卡券数据
  },
  getters: {
    getHome: (state) => {
      return state.home;
    },
    getDragContent(state) {
      return state.dragContent
    },
    getCurIndex(state) {
      return state.curIndex
    }
  },
  mutations: {
    setScrollTop(state, val) {
      state.scrollTop = val
    },
    setLoading(state, val) {
      state.loading.text = val.text
      state.loading.isShow = val.isShow
    },
    newDrag(state, val) {
      if (val.data) {
        let obj = {};
        for (let k in val.data.drag) {
          obj[k] = val.data.drag[k];
          obj.index = state.dragContent.length;
          if (val.data.drag.dragcomponentName) {
            this.commit('addData', val.data.drag.dragcomponentName)
            obj.dataJson = state.saveContent;
            obj.component = {
              componentName: val.data.drag.componentName,
              ccId: val.data.drag.ccId,
              componentId: val.data.drag.componentId
            }
          }
        }
        if (val.newpage) {
          if (val.data.index == 0) {
            state.dragContent = []
          }
          state.dragContent.splice(val.data.index, 0, obj);
        } else {
          state.dragContent.splice(val.data.index, 0, obj);
        }
      }else{
        state.dragContent=[];
      }
    },
    addData(state, name) {
      let obj = {};
      switch (name) {
        case 'BannerModel':
          obj.autoplay = 3000;
          obj.hideBlank = true;
          obj.swiperImg = [{
            showAdd: false,
            imgRequired: false,
            srcImg: 'https://gw.alicdn.com/tfs/TB1nkM1SXXXXXXmaXXXXXXXXXXX-750-359.gif',
            url: '',
          }];
          break;
        case 'ImgText':
          obj.imgUrl = 'https://img.alicdn.com/simba/img/TB1nJqZCk9WBuNjSspeSuuz5VXa.jpg';
          obj.textContent = '文字...';
          obj.url = '';
          obj.hideBlank = true;
          break;
        case 'VTitle':
          obj.title = '标题...';
          obj.url = '';
          obj.hideBlank = true;
          break;
        case 'NoticeMent':
          obj.imgUrl = 'https://img.alicdn.com/simba/img/TB1nJqZCk9WBuNjSspeSuuz5VXa.jpg';
          obj.isAuto = false;
          obj.anIdList = [];
          obj.hideBlank = true;
          break;
        case 'NavTab':
          obj.navList = [{
            navImg: "https://img.alicdn.com/simba/img/TB1nJqZCk9WBuNjSspeSuuz5VXa.jpg",
            navTitle: "这个链接暂时手写",
            navUrl: ""
          },
          {
            navImg: "https://img.alicdn.com/simba/img/TB1nJqZCk9WBuNjSspeSuuz5VXa.jpg",
            navTitle: "不清楚问开发",
            navUrl: ""
          },
          {
            navImg: "https://img.alicdn.com/simba/img/TB1nJqZCk9WBuNjSspeSuuz5VXa.jpg",
            navTitle: "这个链接暂时手写",
            navUrl: ""
          }, {
            navImg: "https://img.alicdn.com/simba/img/TB1nJqZCk9WBuNjSspeSuuz5VXa.jpg",
            navTitle: "不清楚问开发",
            navUrl: ""
          }
          ]
      }
      state.saveContent = obj
    },
    updateData(state, data) {
      state.dragContent[data.index].dataJson = data
    },
    changeCurIndex(state, newIndex) {
      state.curIndex = newIndex
    },
    goUp(state, index) {
      let temArr = state.dragContent;
      if (index == 0) {
        return false;
      } else {
        let data = state.dragContent.splice(index - 1, 2);
        state.dragContent.splice(index - 1, 0, ...data.reverse())
      }
      state.curIndex = index - 1;
    },
    goDown(state, index) {
      let temArr = state.dragContent;
      if (index == (temArr.length - 1)) {
        return false;
      } else {
        let data = state.dragContent.splice(index, 2);
        state.dragContent.splice(index, 0, ...data.reverse())
      }
      state.curIndex = index + 1;
    },
    deleteThis(state, index) {
      state.dragContent.splice(index, 1);
    },
    //轮播图鼠标移入显示上传按钮
    mouseover(state, res) {
      Vue.set(state.dragContent[res.pIndex].dataJson[res.key][res.index], 'showAdd', true)
    },
    //轮播图鼠标移出隐藏上传按钮
    mouseout(state, res) {
      state.dragContent[res.pIndex].dataJson[res.key][res.index].showAdd = false;
    },
    uploadPic(state, res) {
      state.dragContent[res.pIndex].dataJson.swiperImg = res.swiperImg;
    },
    //轮播图上移
    bannerToUp(state, res) {
      if (res.index == 0) {
        return false;
      } else {
        let index = res.index - 1;
        let data = state.dragContent[res.pIndex].dataJson[res.type].splice(index, 2);
        state.dragContent[res.pIndex].dataJson[res.type].splice(index, 0, ...data.reverse());
      }
    },
    //轮播图下移  res.index 图片的位置index pindex组件的位置index
    bannerToDown(state, res) {
      let tempArr = state.dragContent[res.pIndex].dataJson[res.type];
      if (res.index == (tempArr.length - 1)) {
        return false;
      } else {

        let data = state.dragContent[res.pIndex].dataJson[res.type].splice(res.index, 2);
        state.dragContent[res.pIndex].dataJson[res.type].splice(res.index, 0, ...data.reverse());
      }
    },
    changAllMemberGroup(state, res) {
      state.AllMemberGroup = res;
    },
    changAllCoupon(state, res) {
      state.AllCoupon = res;
    },
    changActiveMemberGroup(state, res) {
      state.activememberGroup = res;
    },
    changActiveCoupon(state, res) {
      state.activecoupon = res;
    }
  },
  actions: {}
})
