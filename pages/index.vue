<template>
  <div class="page">
    <p class="title">
      <i class="icon s-faxian"></i>
      发现
      <Btn round flat small color="primary"  to="/find"> 更多>></Btn>
    </p>
    <div class="image-grid-row">
      <div v-for="(draw,index) in likeList" class="item" :key="index">
        <div class="img-box">
          <nuxt-link :to="`/draw/${draw.id}`" v-ripple :title="draw.name">
            <img v-lazy="$img.secdra(draw.url,'specifiedWidth')" class="cover">
          </nuxt-link>
        </div>
        <div class="tool">
          <nuxt-link :to="`/draw/${draw.id}`" v-ripple class="head-image" slot="reference"
                     :title="draw.user.name">
            <img v-lazy="$img.head(draw.user.head,'small50')">
          </nuxt-link>
          <Btn flat icon small title="浏览">
            <i class="icon s-eye"></i>
          </Btn>
          <span>{{draw.viewAmount}}</span>
          <Btn flat icon :color="draw.focus?`primary`:`default`" @click.stop="collection(draw)" small title="收藏">
            <i class="icon" :class="{'s-heart':draw.focus,'s-hearto':!draw.focus}"></i>
          </Btn>
          <span>{{draw.likeAmount}}</span>
        </div>
      </div>
    </div>
    <p class="title">
      <i class="icon s-new"></i>
      最新
      <Btn round flat small color="primary"  to="/new"> 更多>></Btn>
    </p>
    <div class="image-grid-row">
      <div v-for="(draw,index) in newList" class="item" :key="index">
        <div class="img-box">
          <nuxt-link :to="`/draw/${draw.id}`" v-ripple :title="draw.name">
            <img v-lazy="$img.secdra(draw.url,'specifiedWidth')" class="cover">
          </nuxt-link>
        </div>
        <div class="tool">
          <nuxt-link :to="`/draw/${draw.id}`" v-ripple class="head-image" slot="reference"
                     :title="draw.user.name">
            <img v-lazy="$img.head(draw.user.head,'small50')">
          </nuxt-link>
          <Btn flat icon small title="浏览">
            <i class="icon s-eye"></i>
          </Btn>
          <span>{{draw.viewAmount}}</span>
          <Btn flat icon :color="draw.focus?`primary`:`default`" @click.stop="collection(draw)" small title="收藏">
            <i class="icon" :class="{'s-heart':draw.focus,'s-hearto':!draw.focus}"></i>
          </Btn>
          <span>{{draw.likeAmount}}</span>
        </div>
      </div>
    </div>
    <p class="center" style="line-height: 6vw;margin-top: 6vw">
      <span> © 2018-2019</span>
      <a href="http://www.miitbeian.gov.cn/" target="_blank">粤ICP备18144953号-1</a>
    </p>
    <transition name="zoom" enter-active-class="zoomIn duration" leave-active-class="zoomOut duration">
      <Btn icon big shadow v-goTop v-show="showGoTop" class="go-top">
        <i class="icon s-up"></i>
      </Btn>
    </transition>
  </div>
</template>
<script>
  import {Pageable} from "../assets/script/model/base";
  import {mapActions, mapState} from "vuex"

  export default {
    //在这里不能使用httpUtil
    async asyncData({store, req, redirect, route, $axios}) {
      store.commit('menu/MChangeName',"home");
      let taskList = [];
      taskList.push($axios.get(`/draw/pagingByRecommend`, {params: new Pageable(0, 10)}));
      taskList.push($axios.get(`/draw/paging`, {params: new Pageable(0, 10, "createDate,desc")}));
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
      ...mapState('window',['scrollTop'])
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
    line-height: 8vw;
    padding:1vw 4vw;
    >.icon {
      font-size: @medium-font-size;
    }
    .btn{
      float: right;
    }
  }
  .image-grid-row {
    @img-size: 48vw;
    display: grid;
    width: 100%;
    margin: 0 auto;
    justify-content:space-evenly;
    grid-template-columns: repeat(2, @img-size);
    grid-row-gap: 2vw;

    .img-box {
      position: relative;
      a {
        width: @img-size;
        height: @img-size;
        display: block
      }
      .cover {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .tool {
      margin: 1vw 0;
      text-align: right;
      .head-image {
        @head-size: 8vw;
        width: @head-size;
        height: @head-size;
        border-radius: 50%;
        overflow: hidden;
        display: inline-block;
        float: left;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
    }
  }
 // .img-box {
 //   @size: 50vw;
 //   height: @size;
 //   position: relative;
 //   .cover {
 //     width: 98%;
 //     height: 98%;
 //     margin: 1%;
 //     display: block;
 //   }
 //   .like {
 //     position: absolute;
 //     right: 1vw;
 //     bottom: 1vw;
 //     font-size: @big-font-size;
 //     &.s-heart {
 //       color: @red;
 //     }
 //     &.s-hearto {
 //       color: @icon-color-dark
 //     }
 //   }
 // }
</style>
