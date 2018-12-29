<template>
  <div class="page">
    <div style="background-color: #efefef;width: 100vw" :style="{height:`${100 * proportion}vw`} ">
      <img :src="$img.secdra(draw.url,`specifiedWidth500`)" style="width: 100%">
    </div>
    <template v-if="draw.user.id!==user.id">
      <div class="flex-box user-info-box" >
        <nuxt-link :to="`/user/${draw.user.id}`" class="head-box">
          <img :src="$img.head(draw.user.head)" :title="draw.user.name">
        </nuxt-link>
        <nuxt-link :to="`/user/${draw.user.id}`" class="nickname">
          {{draw.user.name}}
        </nuxt-link>
        <div class="follower-btn-box">
          <button class="btn block" @click="follow(draw.user.id)">{{draw.user.focus?`已关注`:`关注`}}</button>
        </div>
      </div>
      <div class="line"></div>
    </template>
    <div class="info-box">
      <h3 class="name"><strong>{{draw.name}}</strong></h3>
      <p class="introduction">{{draw.introduction}}</p>
      <div class="row">
        <div class="col-15">
          <i class="icon s-eye"></i>
          <span>{{draw.viewAmount}}</span>
        </div>
        <div class="col-15">
          <i class="icon s-heart"></i>
          <span>{{draw.likeAmount}}</span>
        </div>
      </div>
      <div class="date">
        创建于：{{draw.createDate|date}}
      </div>
    </div>
    <div class="line"></div>
    <div class="tag-box">
      <div class="tag-list">
        <nuxt-link class="btn is-plain" :to="`/draw/search/${tag.name}`" slot="reference" v-for="tag in draw.tagList"
                   :key="tag.id">
          {{tag.name}}
        </nuxt-link>
      </div>
    </div>
    <template>
      <button class="btn is-suspend tool-btn" v-if="draw.user.id===user.id">
        <i class="icon s-bianji"></i></button>
      <button class="btn is-suspend tool-btn" v-else @click="collection(draw)">
        <i class="icon like" :class="{'s-heart':draw.focus,'s-hearto':!draw.focus}"
           :style="{color:draw.focus?`red`:`gray`}"></i></button>
    </template>
  </div>
</template>
<script>
  import config from "../../assets/js/config";
  import {mapActions} from "vuex"

  export default {
    async asyncData({store, req, redirect, route, $axios}) {
      store.state.menu.name = "detail";
      let id = route.params.id;
      let res = await $axios.get(`${config.host}/draw/get`, {
        params: {id}
      });
      let result = res.data;
      if (result.status !== 200) {
        throw new Error(result.message)
      }
      store.state.menu.title = result.data.name;
      let drawForm = Object.assign({}, result.data);
      drawForm.tagList = drawForm.tagList.map(item => item.name);
      drawForm.isPrivate = drawForm.private;
      return {
        draw: result.data,
        drawForm
      }
    },
    computed: {
      proportion() {
        return this.draw.height / this.draw.width
      },
      user() {
        return this.$store.state.user.user
      }
    },
    methods: {
      ...mapActions("draw", ["ACollection"]),
      ...mapActions("user", ["AFollow"]),
      async collection(draw) {
        let result = await this.ACollection({
          drawId: draw.id
        });
        if (result.status !== 200) {
          this.$tooltip({message: result.message});
          return
        }
        draw.focus = result.data;
      },
      async follow(id) {
        let result = await this.AFollow({
          followerId: id
        });
        if (result.status !== 200) {
          this.$tooltip({message: result.message});
          return
        }
        this.draw.user.focus = result.data
      },
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../assets/style/color";
  @import "../../assets/style/config";
  @import "../../assets/style/mixin";

  .line {
    width: calc(100% - 20px - 20px);
    height: 1px;
    border-bottom: 1px dashed #ccc;
    margin: 0 20px;
  }

  .page {
    min-height: 100vh;
    margin-top: 0;
    .user-info-box {
      @info-box-height: 70px;
      @padding-size: 20px;
      @img-size: @info-box-height - @padding-size;
      @follow-btn-size: 100px;
      padding: @padding-size;
      .head-box {
        display: block;
        position: relative;
        img {
          border-radius: 50%;
          width: @img-size;
          height: @img-size;
        }
      }
      .nickname {
        width: calc(100% - @img-size - @follow-btn-size);
        padding: 0 30px;
        .left();
        .ellipsis();
      }
      .follower-btn-box {
        width: @follow-btn-size;
        .btn {
          padding: 0;
          .center();
        }
      }
    }

    .info-box {
      @padding-size: 20px;
      padding: @padding-size;
      .name {
        .ellipsis()
      }
      .introduction {
        margin-top: 10px;
        font-size: @small-font-size;
        color: @gray;
      }
      .row {
        margin-top: 10px;
        font-size: @small-font-size;
        color: @gray;
        i {
          font-size: @small-font-size;
          color: @gray;
        }
        span {
          margin-left: 10px;
          vertical-align: baseline;
        }
      }
      .date {
        margin-top: 10px;
      }
    }
    .tag-list {
      @spacing: 10px;
      margin-bottom: -@spacing;
      .btn {
        margin-right: @spacing;
        margin-bottom: @spacing;
        line-height: 30px;
        padding: 0 1em;
      }
    }
    .tag-box{
      padding: 20px;
    }
    .tool-btn {
      position: fixed;
      right: 20px;
      bottom: 20px;
    }
  }
</style>
