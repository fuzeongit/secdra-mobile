<template>
  <div class="page">
    <div class="content row">
      <div class="card" v-for="(item,index) in list" :key="index">
        <nuxt-link :to="`/user/${item.id}`" class="cover"
                   v-lazy:background-image="$img.back(item.background,`specifiedWidth500`)"></nuxt-link>
        <div class="flex-box user-info-box" v-if="item.id!==user.id">
          <nuxt-link :to="`/user/${item.id}`" class="head-box">
            <img v-lazy="$img.head(item.head)" :title="item.name">
          </nuxt-link>
          <nuxt-link :to="`/user/${item.id}`" class="nickname">
            {{item.name}}
          </nuxt-link>
          <div class="follower-btn-box">
            <button class="btn block" @click="follow(item)">{{item.focus?`已关注`:`关注`}}</button>
          </div>
        </div>
      </div>
    </div>
    <br>
    <Pageable :totalPage="page.totalPages" :currPage="pageable.page" @go="paging"></Pageable>
    <br>
    <transition name="zoom" enter-active-class="zoomIn duration" leave-active-class="zoomOut duration">
      <button class="btn is-suspend is-white go-top" v-goTop v-show="showGoTop">
        <i class="icon s-up"></i></button>
    </transition>
  </div>
</template>

<script>
  import config from "../../../assets/script/config/index";
  import {mapActions} from "vuex"
  import {Pageable} from "../../../assets/script/model/base";

  export default {
    //在这里不能使用httpUtil
    //并且嵌套层数超过不知道多少会报错-->坑死我了
    async asyncData({store, req, redirect, route, $axios}) {
      store.state.menu.name = "follower";
      let pageable = new Pageable(route.params.page * 1 || 0, 16, "createDate,desc");
      let {data: result} = await $axios.get(`${config.host}/follower/paging`, {
        params: Object.assign({
          id: route.params.userId
        }, pageable)
      });
      if (result.status !== 200) {
        throw new Error(result.message)
      }
      return {
        pageable: pageable,
        page: result.data,
        list: result.data.content
      }
    },
    watch:{
      /**
       * 如果直接用计算属性计算showGoTop的话，
       * 可能会导致渲染过度，导致页面卡顿
       */
      scrollTop(newVal, oldVal) {
        let threshold = 150;
        if (newVal > threshold && oldVal <= threshold) {
          this.showGoTop = true
        } else if (newVal <= threshold && oldVal > threshold) {
          this.showGoTop = false
        }
      }
    },
    computed:{
      scrollTop() {
        return this.$store.state.window.scrollTop
      },
      user() {
        return this.$store.state.user.user
      },
    },
    data() {
      return {
        showGoTop: false
      }
    },
    methods: {
      ...mapActions("user", ["APagingFollowing","AFollow"]),
      paging(page){
        this.$router.push(`/follower/${this.$route.params.userId}/${page}`);
      },
      async follow(follower) {
        let result = await this.AFollow({
          followingId: follower.id
        });
        if (result.status !== 200) {
          this.$tooltip({message: result.message});
          return
        }
        follower.focus = result.data
      },
    }
  }
</script>


<style type="text/less" lang="less" scoped>
  @import "../../../assets/style/color";
  @import "../../../assets/style/config";
  @import "../../../assets/style/mixin";

  .card {
    @card-width:92vw;
    position: relative;
    width: @card-width;
    margin: 4vw;
    border-radius: @default-border-radius;
    background-color: @white;
    box-shadow: 0 0 10vw rgba(150, 150, 150, 0.55);
    overflow: hidden;
    .cover{
      width: 100%;
      height: @card-width / 2;
      display: block;
    }

    .user-info-box {
      @info-box-height: 26vw;
      @padding-size: 4vw;
      @img-size: @info-box-height - @padding-size;
      @follow-btn-size:20vw;
      padding: @padding-size;
      .head-box{
        display: block;
        position: relative;
        margin-top: -(@img-size / 2);
        img {
          border-radius: 50%;
          width: @img-size;
          height:@img-size ;
        }
      }
      .nickname {
        width: calc(100% - @img-size - @follow-btn-size);
        padding: 0 6vw;
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

  }
</style>
