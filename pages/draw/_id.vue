<template>
  <div class="page">
    <p style="font-size: 3.4vw">这是一段文字</p>
    <p style="font-size: 3.8vw">这是一段文字</p>
    <p style="font-size: 4.2vw">这是一段文字</p>
    <p style="font-size: 4.6vw">这是一段文字</p>
    <p style="font-size: 5vw">这是一段文字</p>
  </div>
</template>
<script>
  import config from "../../assets/js/config";
  import {Pageable} from "../../assets/js/model/base";

  export default {


  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../assets/style/color";
  @import "../../assets/style/config";
  @import "../../assets/style/mixin";

  .list-content {
    margin: 0 auto;
    position: relative;
    .item {
      @info-box-height: 80px;
      position: absolute;
      transition: 0.5s;
      border-radius: @smallest-border-radius;
      background-color: @white;
      box-shadow: 0 0 50px rgba(150, 150, 150, 0.55);
      .like {
        position: absolute;
        bottom: @info-box-height + 5px;
        right: 5px;
      }
      .img-box {
        img {
          transition: 0.5s;
          width: 100%
        }
      }
      .info-box {
        @img-size: 50px;
        @padding-size: 15px;
        padding: @padding-size;
        overflow: hidden;
        .head-box {
          display: block;
          position: relative;
          transition: @default-animate-time;
          img {
            border-radius: 50%;
            width: @img-size;
          }
        }
        .user-info-box {
          width: calc(100% - @img-size);
          padding: 0 10px;
          transition: @default-animate-time;
          .nickname {
            font-size: @small-font-size;
            .ellipsis();
          }
          .introduction {
            font-size: @smallest-font-size;
            margin-top: 5px;
            .ellipsis()
          }
        }
      }
    }
    .last-card {
      height: 300px;
      img {
        width: 100%;
      }
    }
  }

  .go-top {
    position: fixed;
    right: 20px;
    bottom: 20px;
  }
</style>
