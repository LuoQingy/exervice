<template>
  <!-- <section class="news-item news-item-s2"> -->
    <!-- <a class="J-news" :href="itemContent.url" style="padding: 15px 10px"> -->
    <router-link
      class="J-news"
      style="padding: 15px 10px"
      :to="{
        name: 'artical',
        params: { id: itemContent.id, type: $route.params.type }
      }"
    >
      <div class="news-wrap">
        <h3>{{ itemContent.title }}</h3>
        <div class="img-wrap">
          <div
            class="img"
            v-for="(itemImage, index) in itemContent.images.slice(0, 3)"
            :key="index"
          >
            <div
              :imgurl="itemImage"
              class="pic"
              style="background-image: url(https://static.dzkandian.com/images/loadwap.png)"
            >
            </div>
          </div>
        </div>
        <p class="tags clearfix">
          <em class="tag tag-src">{{ itemContent.source }}</em>
          <em class="tag tag-view">{{
            itemContent.updateTime.substring(0, 10)
          }}</em>
        </p>
      </div>
      <!-- </a> -->
    </router-link>
  <!-- </section> -->
</template>

<script>
export default {
  props: {
    itemContent: {
      type: Object,
      default: () => {
        return {
          url: "",
          title: "",
          images: "",
          source: "",
          updateTime: ""
        };
      }
    },
  },
  data() {
    return {};
  }
};
</script>

<style lang="less" scoped>
// .news-item,
// .news-item-s2,
// .news-ad {
//   height: auto;
//   position: relative;
//   &:before {
//     content: "";
//     position: absolute;
//     width: 187.5%;
//     height: 1px;
//     bottom: 0;
//     left: 3%;
//     right: 0;
//     top: 0;
//     margin: 0 auto;
//     // transform: translateX(-50%);
//     border-bottom: 1px solid #e6e6e6;
//     transform-origin: 0 0;
//     transform: scale(0.5, 0.5);
//     box-sizing: border-box;
//   }
//   a {
//     display: block;
//     padding: 10px 0;
//     // border-bottom: 1px solid #f5f5f5;
//     color: #333;
//     text-decoration: none;
//     .news-wrap {
//       position: relative;
//       min-height: 115px;
//       h3 {
//         font-size: 15px;
//         line-height: 1.2em;
//         overflow: hidden;
//         width: 100%;
//         max-height: 40px;
//         margin-bottom: 15px;
//         font-weight: 800;
//         color: #222222;
//       }
//       .img-wrap {
//         display: -webkit-box;
//         display: -ms-flexbox;
//         display: flex;
//         display: -webkit-flex;
//         overflow: hidden;
//         height: 2rem;
//         .img {
//           width: 33.33%;
//           padding-right: 2px;
//           div {
//             width: 100%;
//             background-color: rgba(150, 150, 150, 0.1);
//             background-repeat: no-repeat;
//             background-position: center;
//             background-size: cover;
//             height: 100%;
//             border-radius: 2px;
//             img {
//               width: 100%;
//               height: 100%;
//             }
//           }
//         }
//       }
//       .tags {
//         margin-top: 15px;
//         color: #999999;
//         overflow: hidden;
//         font-size: 12px;
//         font-family: PingFang-SC-Medium;
//         .tag {
//           display: inline-block;
//           line-height: 12px;
//           margin-right: 5px;
//         }
//         .tag-view {
//           float: right;
//           margin-right: 0px;
//         }
//       }
//     }
//   }
// }
</style>
