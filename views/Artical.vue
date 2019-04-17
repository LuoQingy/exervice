<template>
  <div class="artical">
    <h1>{{ dataList.title }}</h1>
    <div class="source">
      <span>{{ dataList.sourceName }}</span>
      <span>{{ dataList.pubTime }}</span>
    </div>
    <div v-html="content[currentPage - 1]" id="content" class="content"></div>
    <div v-if="currentPage == content.length" class="copyright">
      版权声明：本文内容的组织和采编均来自{{ dataList.sourceName }}。
    </div>
    <pagination
      @pageForward="pageForward"
      v-model="currentPage"
      :page-size="content.length"
    ></pagination>
    <button @click="backHome" class="backhome-btn align-center">
      返回首页查看更多
      <img src="@/assets/image/组 7@2x.png" width="20" height="20" alt />
    </button>
    <h3 class="more-list">热点推荐{{ $route.params.type }}</h3>
    <more-content v-justify ref="moreContent" :father="true"></more-content>
  </div>
</template>
<script>
import Pagination from "@/components/pagination.vue";
import MoreContent from "@/views/content/content.vue"
export default {
  components: {
    Pagination,
    MoreContent
  },
  data() {
    return {
      dataList: {},
      moreList: [],
      currentPage: 1,
      content: [],
    };
  },
  watch: {
    $route(to, from) {
      this.freshPage(to.params.id, to.params.type)
      this.$refs.moreContent.getDataList(to.params.type, to.params.id, false)
    }
  },
  methods: {
    pageForward() {
      //下一篇
      this.$router.push({        name: 'artical',
        params: { id: this.moreList[0]["id"], type: this.$route.params.type }      })
    },
    async freshPage(id, type) {//刷新页面视图
      this.loadingDialog("show")
      await this.getDataList(id, type);
      this.$set(this, "currentPage", 1);
      this.getMoreList(id, type);
    },
    async getDataList(id, type) {//获取文章信息
      await this.$http.get("/news-" + id + ".html", { params: { type, id, tpl: "json" } })
        .then(res => {
          if (res.status === 200) {
            this.$set(this, "dataList", res.data);
            /**
             * 正则替换：1.替换data-src=>imgurl，使用mescroll lazyload格式
             *          2.匹配<img>，增加占位图
             *          3.替换figure标签为p标签
             */
            res.data.content = res.data.content
              // .replace(/data-src="([\s\S]*?)"/g, "v-lazy=\"'$1'\"")
              .replace(/data-src/g, "imgurl")
              .replace(/<img/g, "<img src\=\'https\:\/\/static\.dzkandian\.com\/images\/loadwap\.png\'")
              .replace(/figure/g, "p");
            // this.content = res.data.content.match(
            //   /(<p\b[^<>]*?>[\s\S]*?<\/p>[\s\S]*?<p\b[^<>]*?>[\s\S]*?<\/p>)|(<p\b[^<>]*?>[\s\S]*?<\/p>)|(<img[\s\S]*?>)/g
            // );
            /**
             * 正则匹配：规则1：匹配两个<p>，并且两个<p>其中不含单独Img标签，
             *          规则2：匹配单个<p>,
             *          规则3：匹配无<p>包裹的单独<img>
             */
            let tempArr = res.data.content.match(
              /(<p\b[^<>]*?>[\s\S]*?<\/p>[\s\S]*?[^<img[\s\S]*?>][\s\S]*?<p\b[^<>]*?>[\s\S]*?<\/p>)|(<p\b[^<>]*?>[\s\S]*?<\/p>)|(<img[\s\S]*?>)/g
            );
            // 图片无<p>包裹特殊处理
            let regP = /<p\b[^<>]*?>[\s\S]*?<\/p>/,
              regImg = /<img[\s\S]*?>/
            tempArr.forEach((item, index) => {
              let res = regImg.test(item)
              if (regImg.test(item) && !regP.test(item)) {
                // this.log(index, res)
                tempArr[index] = item.replace(/(<img[\s\S]*?>)/, "<p> $1 <\/p>")
              }
            })
            this.content = tempArr.join("").match(
              /(<p\b[^<>]*?>[\s\S]*?<\/p>[\s\S]*?<p\b[^<>]*?>[\s\S]*?<\/p>)|(<p\b[^<>]*?>[\s\S]*?<\/p>)|(<img[\s\S]*?>)/g
            )
            // this.log('tempArr', tempArr)
            // this.log('content', this.content)
            // this.content = res.data.content.split(/<p\b[^<>]*>.*?<\/p>/);
            // let tempArr = res.data.content.split(/<\/p>/);
            // tempArr.forEach((item, index) => {
            //   if (index % 2 != 0) {
            //     this.content.push(tempArr[index - 1] + tempArr[index]);
            //   }
            // });
            // if (tempArr.length % 2 != 0) {
            //   this.content.push(tempArr[tempArr.length - 1]);
            // }
          }
        });
      this.loadingDialog("hide")
    },
    getMoreList(beforeId, type) {//获取加载更多
      this.$http
        .get("/news.html", {
          params: {
            type,
            beforeId
          }
        })
        .then(res => {
          if (res.status === 200) {
            this.$set(this, "moreList", res.data.data);
            // this.log('moreList', this.moreList)
          }
        });
    },
    downCallback() {
      this.$refs.moreContent.downCallback()
    },
    upCallback() {
      this.$refs.moreContent.upCallback()
    },
    backHome() {
      this.$router.push('/')
    }
  },
  created() {
    window.scrollTo(0, 0)
    let id = this.$route.params.id,
      type = this.$route.params.type;
    // let id = "66a730d1f15f82d65473e0cde6874886",
    // type = "看点"
    this.getDataList(id, type);
    this.getMoreList(id, type);
    // 触发监控上拉加载    
    this.bus.$on('upCallback', this.upCallback)
    // this.log('lockdown','artical')
    // this.bus.$emit('lockDown')
  },
  directives: {
    justify: {//更多组件居中
      inserted: function (el) {
        el.style.margin = '0 -12px'
      }
    }
  },
  destroyed() {
    // 卸载监控上拉加载
    this.bus.$off('upCallback', this.upCallback)
    // this.bus.$emit('unlockDown')
  },
};
</script>
<style lang="less" scoped>
.artical {
  padding: 12px;
  h1 {
    font-size: 20px;
    color: #333;
    // font-weight: 600;
    font-weight: bolder;
    line-height: 1.5;
    margin-bottom: 20px;
  }
  .source {
    font-size: 13px;
    color: #666;
    margin-bottom: 27px;
    > span:first-child {
      margin-right: 15px;
    }
  }
  .backhome-btn {
    background-color: transparent;
    width: 100%;
    height: 40px;
    border: 1px solid rgba(229, 4, 7, 1);
    border-radius: 4px;
    color: #e50407;
    font-size: 16px;
    margin: 20px 0;
  }
  .more-list {
    font-size: 16px;
    line-height: 16px;
    font-weight: bold;
    color: #333333;
    text-indent: 7px;
    position: relative;
    &:after {
      content: "";
      display: block;
      width: 2px;
      height: 13px;
      background: #c3362a;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
<style>
#content p {
  word-wrap: break-word;
  font-size: 16px;
  color: #333;
  line-height: 30px;
  margin-bottom: 30px;
}
#content img {
  width: 100%;
  border-radius: 4px;
}
.copyright {
  margin-bottom: 10px;
  font-size: 18px;
}
.align-center {
  display: flex;
  display: -webkit-flex;
  display: -moz-flex;
  justify-content: center;
  align-items: center;
}
</style>
