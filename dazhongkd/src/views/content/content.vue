<template>
    <div>
        <div ref="mescroll" class="mescroll" id="mescroll">
            <div v-if="componentshow" style="padding:0 0px;">
                <div class="news-list-wrap" v-for="(item,index) in dataList" :key='index'>   
                    <modular-second v-if="item.images.length>=3" :itemContent='item'></modular-second>
                    <modular-first v-else :itemContent='item'></modular-first>
                </div>
            </div>    
        </div>
    </div>
</template>

<script>
import modularFirst from '../modular/modularFirst';
import modularSecond from '../modular/modularSecond';
export default {
    components: {modularFirst,modularSecond},
    name: "Home",
    data(){
        return{
            dataList:[],
            componentshow:true,
        }
    },
    mounted(){
        let type = this.$route.params.id;
        this.type = type;
        console.log("首页进来的栏目:" + this.type);
        this.getDetailList(type);
        //window.addEventListener("scroll", this.handleScroll, true);

    //下拉加载初始化
        // let self = this;
        // self.mescroll = new MeScroll("mescroll", {
        // //请至少在vue的mounted生命周期初始化mescroll,以确保您配置的id能够被找到
        //     down: {
        //         auto: false, //是否在初始化完毕之后自动执行下拉回调callback; 默认true
        //         callback: self.downCallback, //下拉刷新的回调
        //         lazyLoad: {
        //         use: true,
        //         attr: "imgurl", // 网络地址的属性名 (图片加载成功会移除该属性): <img imgurl='网络图  src='占位图''/>
        //         // showClass: '', // 图片加载成功的显示动画: 渐变显示,参见mescroll.css
        //         delay: 0, // 列表滚动的过程中每500ms检查一次图片是否在可视区域,如果在可视区域则加载图片
        //         offset: 0 // 超出可视区域200px的图片仍可触发懒加载,目的是提前加载部分图片
        //         }
        //     },
        //     up: {
        //         auto: false, //初始化完毕,是否自动触发上拉加载的回调
        //         isBoth: false, //上拉加载时,如果滑动到列表顶部是否可以同时触发下拉刷新;默认false,两者不可同时触发; 这里为了演示改为true,不必等列表加载完毕才可下拉;
        //         isBounce: true, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
        //         callback: self.upCallback, //上拉加载的回调
        //         toTop: {
        //         //配置回到顶部按钮
        //         src: self.topimage.src //默认滚动到1000px显示,可配置offset修改
        //         //offset : 1000
        //         },
        //         lazyLoad: {
        //         use: true,
        //         attr: "imgurl", // 网络地址的属性名 (图片加载成功会移除该属性): <img imgurl='网络图  src='占位图''/>
        //         // showClass: '', // 图片加载成功的显示动画: 渐变显示,参见mescroll.css
        //         delay: 0, // 列表滚动的过程中每500ms检查一次图片是否在可视区域,如果在可视区域则加载图片
        //         offset: 0 // 超出可视区域200px的图片仍可触发懒加载,目的是提前加载部分图片
        //         }
        //     }
        // });
    },
    methods:{
        getDetailList(type) {
            var type = type == "推荐" ? "看点" : type

            let that = this;
            console.log(type)
            //数据请求 获取第一条的数据
            console.log(246)
            console.log(type)
            this.$ajax({
                url: "http://test.prculture.cn/a/news.html",
                params: {
                    type
                },
                method: "get"
            }).then(res => {
                this.dataList = res.data
                console.log(this.dataList)
                //.getDetailLists(res.data[0].id, type);
            });
        },
    }
}
</script>

<style lang="less" scoped>
.mescroll {
  position: fixed;
  top: 35px;
  bottom: 0;
  left: 0px;
  height: auto; /*如设置bottom:50px,则需height:auto才能生效*/
  max-width: 750px;
}
</style>
