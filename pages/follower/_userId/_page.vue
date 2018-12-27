<template>
  <div class="page">
    <div class="content row">
      <div class="card" v-for="(follower,index) in list" :key="index">
        <nuxt-link :to="`/user/${follower.id}`" class="cover" v-lazy:background-image="$img.back(follower.background,`specifiedWidth500`)"></nuxt-link>
        <div class="flex-box info-box" v-if="follower.id!==user.id">
          <nuxt-link :to="`/user/${follower.id}`" class="head-box">
            <img v-lazy="$img.head(follower.head)" :title="follower.name">
          </nuxt-link>
          <div class="user-info-box">
            <p class="nickname">
              <nuxt-link :to="`/user/${follower.id}`" >
                {{follower.name}}
              </nuxt-link>
            </p>
          </div>
        </div>
      </div>
    </div>
    <br>
    <Pageable :totalPage="page.totalPages" :currPage="pageable.page" @go="paging"></Pageable>
    <br>
    <transition name="zoom" enter-active-class="zoomIn duration" leave-active-class="zoomOut duration">
      <button class="btn is-suspend go-top" v-goTop v-show="showGoTop">
        <i class="icon s-zhiding"></i></button>
    </transition>
  </div>
</template>
<script>
  import config from "../../../assets/js/config/index";
  import {mapActions} from "vuex"
  import {Pageable} from "../../../assets/js/model/base";

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
      ...mapActions("user", ["APagingFollower"]),
      paging(page){
        this.$router.push(`/follower/${this.$route.params.userId}/${page}`);
      },
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../../assets/style/color";
  @import "../../../assets/style/config";
  @import "../../../assets/style/mixin";
  @info-box-height: 130px;
  .card {
    @card-width:92vw;
    position: relative;
    width: @card-width;
    margin: 4vw;
    border-radius: @default-border-radius;
    background-color: @white;
    box-shadow: 0 0 50px rgba(150, 150, 150, 0.55);
    overflow: hidden;
    .cover{
      width: 100%;
      height: @card-width / 2;
      display: block;
    }

    .info-box {
      @padding-size: 20px;
      @img-size: @info-box-height - @padding-size;
      padding: @padding-size;

      .head-box {
        display: block;
        position: relative;
        transition: @default-animate-time;
        margin-top: -(@img-size/2);

        img {
          border-radius: 50%;
          width: @img-size;
          height:@img-size ;
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
    }
  }
  .go-top {
    position: fixed;
    right: 20px;
    bottom: 20px;
  }
</style>
