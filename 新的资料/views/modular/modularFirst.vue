<template>
  <!-- <section class="news-item news-item-s1"> -->
  <!-- <a class="J-news" :href="itemContent.url" style="padding: 15px 10px"> -->
  <!-- <router-link
    class="J-news"
    style="padding: 15px 10px"
    :to="{
      name: 'artical',
      params: { id: itemContent.id, type: $root.formatType(itemContent.url) }
    }"
  > -->
  <router-link
    class="J-news"
    style="padding: 15px 10px"
    :to="{
      name: 'artical',
      params: { id: itemContent.id, type: $route.params.type }
    }"
  >
    <div class="news-wrap">
      <div
        class="img-wrap"
        v-for="(itemImage, index) in itemContent.images.slice(0, 1)"
        :key="index"
      >
        <div
          :imgurl="itemImage"
          class="pic"
          style="background-image: url(https://static.dzkandian.com/images/loadwap.png)"
        ></div>
      </div>
      <div class="txt-wrap">
        <h3>{{ itemContent.title }}</h3>
        <p class="tags clearfix">
          <em class="tag tag-src">{{ itemContent.source }}</em>
          <em class="tag tag-view">{{
            itemContent.updateTime.substring(0, 10)
          }}</em>
        </p>
      </div>
    </div>
  </router-link>
  <!-- </a> -->
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
    }
  },
  data() {
    return {};
  },
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
//             // background-image: url(//mini.eastday.com/toutiaoh5/img/img_preview.png);
//             background-repeat: no-repeat;
//             background-position: center;
//             background-size: cover;
//             height: 100%;
//             //   height: 100px;
//             border-radius: 2px;
//             img {
//               width: 100%;
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
.news-item-s1 {
  a {
    .news-wrap {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      display: -webkit-flex;
      min-height: 0;
      .txt-wrap {
        position: relative;
        width: 67%;
        h3 {
          font-size: 15px;
          line-height: 1.2em;
          overflow: hidden;
          margin-right: 12px;
          height: 38px;
          color: #222222;
          font-weight: 800;
          text-overflow: ellipsis;
          word-wrap: break-word;
          word-break: break-all;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;

          .tags {
            position: absolute;
            bottom: 0;
            color: #999999;
            overflow: hidden;
            font-size: 12px;
            font-family: PingFang-SC-Medium;
          }
        }
        p {
          width: 100%;
          position: absolute;
          bottom: 0;
          .tag-view {
            float: right;
            font-family: PingFang-SC-Medium;
          }
        }
      }
      .img-wrap {
        overflow: hidden;
        width: 33%;
        height: 2rem;
        margin-right: 10px;
        div {
          width: 100%;
          background-color: rgba(150, 150, 150, 0.1);
          // background-image: url(//mini.eastday.com/toutiaoh5/img/img_preview.png);
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
          height: 100%;
          border-radius: 2px;
        }
      }
    }
  }
}
</style>
