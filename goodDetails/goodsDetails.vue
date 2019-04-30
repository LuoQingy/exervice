<template>
    <div class="boss" :style="alertStyle" v-wechat-title="$route.meta.title">
        <div class="header">
            <home-header></home-header>
        </div>
        <div class="search">
            <search></search>
        </div>
        <div class="content">
            <content-header></content-header>
            <div class="goods-Details-Information">
                <goodsDetails-information></goodsDetails-information>
            </div>
            <div class="same-information">
                <same-and-introdution></same-and-introdution>
            </div>
        </div>
        <div class="footer">
            <public-footer></public-footer>
        </div>
      <side-bar></side-bar>
    </div>
</template>

<script>
 import homeHeader from './../public/header';
 import search from './../public/search';
 import contentHeader from './../public/header-nav';
 import goodsDetailsInformation from './goodsDetails_information';
 import sameAndIntrodution from './same_and_introdution'
 import publicFooter from '../public/public_footer';
 import store from '@/vuex/goodClassListStore'//vuex
import { mapState} from 'vuex'
 import sideBar from '../home/sideBar/sideBar'
export default {
    components: {homeHeader,search,contentHeader,goodsDetailsInformation,sameAndIntrodution,publicFooter,sideBar},
    store,
    data(){
        return{
             ScrollTo:'',		
        }
    },
    
    mounted(){
          window.addEventListener('scroll', this.handleScrol)
    },
    methods:{
        handleScrol(){
            var winScrollTop = document.body.scrollTop||window.pageYOffset||document.documentElement.scrollTop;	
           // console.log(winScrollTop )
        },
    },
    destroyed(){
         window.removeEventListener('scroll', this.handleScrol);
    },
    computed:{
         ...mapState(['alertStyle'])
     }
}
</script>

<style scoped>
*{
    margin: 0;
	padding: 0;
	list-style: none;
}
*{
    margin: 0;
    padding: 0;
    font-size: 14px;
}
input,button{
    border: none;
    outline: none;
}
.boss{
    width: 100%;
    background: #ffffff;
    margin: 0 auto;
    overflow-x: hidden;
}
/* .boss .header{
    width: 1200px;
    margin: 0 auto;
    background: #fff;
} */
.boss .goods-Details-Information{
    width: 1200px;
    margin: 0 auto;
    background: #ffffff;
}
.same-information{
    width: 1200px; 
    margin: 0 auto; 
    padding-bottom: 50px;
}
.footer{
    background: #f8f8f8;
}
</style>

