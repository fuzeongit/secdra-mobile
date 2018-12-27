<template>
  <div class="content row">
    <div class="card " v-for="(draw,index) in list" :key="index">
      <nuxt-link :to="`/draw/${draw.id}`" class="img-box flex-box">
        <img v-lazy="$img.secdra(draw.url,`specifiedWidth500`)"
             style="width: 100%">
      </nuxt-link>
      <a class="icon like" :class="{'s-heart':draw.focus,'s-hearto':!draw.focus}"
         :style="{color:draw.focus?`red`:`gray`}" title="收藏" v-if="!isSelf"
         @click.stop="$emit(`collection`,draw,index)"></a>
      <div class="flex-box info-box" v-if="draw.user.id&&!isSelf">
        <nuxt-link :to="`/user/${draw.user.id}`" class="head-box">
          <img :src="$img.head(draw.user.head)" :title="draw.user.name">
        </nuxt-link>
        <div class="user-info-box">
          <p class="nickname">
            {{draw.user.name}}
          </p>
          <p class="introduction" :title="draw.user.introduction">
            {{draw.user.introduction}}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    componentName: "DrawCardList",
    props: {
      list: {
        type: Array,
        default: [],
      },
      isSelf: {
        type: Boolean,
        default: false,
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../../assets/style/color.less";
  @import "../../../assets/style/config.less";
  @import "../../../assets/style/mixin";

  @info-box-height: 130px;
  .card {
    position: relative;
    width: 92vw;
    margin: 4vw;
    border-radius: @default-border-radius;
    background-color: @white;
    box-shadow: 0 0 50px rgba(150, 150, 150, 0.55);
    overflow: hidden;
    .like {
      position: absolute;
      bottom: @info-box-height + @big-font-size;
      right: 5px;
      font-size: @big-font-size + 8px;
    }
    .info-box {
      @img-size: 110px;
      @padding-size: 20px;
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
        padding: 0 30px;
        transition: @default-animate-time;

        .nickname {
          .ellipsis()
        }
        .introduction {
          font-size: @small-font-size;
          margin-top: 10px;
          color: @gray;
          .ellipsis()
        }
      }
      .follow-box {
        position: absolute;
        height: @info-box-height;
        bottom: 0;
        width: calc(100% - @img-size - @padding-size);
        right: 0;
        padding: 15px;
        transition: @default-animate-time;
        opacity: 0;
        transform: translateY(10px);
      }
    }
  }
</style>
