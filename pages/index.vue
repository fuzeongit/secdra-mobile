<template>
  <div class="page">
    <p class="title">
      <i class="icon s-faxian"></i>
      发现
      <nuxt-link to="/find">
        更多>>
      </nuxt-link>
    </p>
    <div class="row">
      <div class="col-15 img-box center" v-for="(draw,index) in likeList" :key="index">
        <nuxt-link :to="`/draw/${draw.id}`" class="cover"
                   v-lazy:background-image="$img.secdra(draw.url,'specifiedWidth')">
        </nuxt-link>
        <a class="icon like" :class="{'s-heart':draw.focus,'s-hearto':!draw.focus}" title="收藏" @click="collection(draw)"
        ></a>
      </div>
    </div>
    <p class="title">
      <i class="icon s-new"></i>
      最新
      <nuxt-link to="/new">
        更多>>
      </nuxt-link>
    </p>
    <div class="row">
      <div class="col-15 img-box center" v-for="(draw,index) in newList" :key="index">
        <nuxt-link :to="`/draw/${draw.id}`" class="cover"
                   v-lazy:background-image="$img.secdra(draw.url,'specifiedWidth')">
        </nuxt-link>
        <a class="icon like" :class="{'s-heart':draw.focus,'s-hearto':!draw.focus}" title="收藏" @click="collection(draw)"
        ></a>
      </div>
    </div>
    <p class="center" style="line-height: 6vw">
      <span> © 2018-2019</span>
      <a href="http://www.miitbeian.gov.cn/" target="_blank">粤ICP备18144953号-1</a>
    </p>
    <transition name="zoom" enter-active-class="zoomIn duration" leave-active-class="zoomOut duration">
      <button class="btn is-suspend  go-top" v-goTop v-show="showGoTop">
        <i class="icon s-up"></i></button>
    </transition>
  </div>
</template>
<script>
  import config from "../assets/script/config";
  import {Pageable} from "../assets/script/model/base";
  import {mapActions} from "vuex"

  export default {
    //在这里不能使用httpUtil
    async asyncData({store, req, redirect, route, $axios}) {
      store.state.menu.name = "home";
      let taskList = [];
      taskList.push($axios.get(`${config.host}/draw/pagingByRecommend`, {params: new Pageable(0, 10)}));
      taskList.push($axios.get(`${config.host}/draw/paging`, {params: new Pageable(0, 10, "createDate,desc")}));
      let resultList = (await Promise.all(taskList)).map(item => item.data);
      return {
        likeList: resultList[0].data.content,
        newList: resultList[1].data.content,
      }
    },
    data() {
      return {
        showGoTop: false
      }
    },
    watch: {
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
    computed: {
      scrollTop() {
        return this.$store.state.window.scrollTop
      },
    },
    methods: {
      ...mapActions("draw", ["ACollection"]),
      async collection(draw) {
        let result = await this.ACollection({
          drawId: draw.id
        });
        if (result.status !== 200) {
          this.$tooltip({message: result.message});
          return
        }
        draw.focus = result.data;
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../assets/style/color";
  @import "../assets/style/config";
  @import "../assets/style/mixin";

  .title {
    line-height: 10vw;
    padding: 0 4vw;
    .icon {
      font-size: @medium-font-size;
    }
    a {
      vertical-align: baseline;
      display: inline-block;
      float: right;
      color: @theme-color
    }
  }

  .img-box {
    @size: 50vw;
    height: @size;
    position: relative;
    .cover {
      width: 98%;
      height: 98%;
      margin: 1%;
      display: block;
    }
    .like {
      position: absolute;
      right: 1vw;
      bottom: 1vw;
      font-size: @big-font-size;
      &.s-heart {
        color: @red;
      }
      &.s-hearto {
        color: @icon-color-dark
      }
    }
  }
</style>
