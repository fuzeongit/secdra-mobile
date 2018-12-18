<template>
  <div class="page">
    <p style="line-height: 50px">发现</p>
    <div class="row">
      <div class="col-15 img-box center"  v-for="(draw,index) in likeList" :key="index">
        <nuxt-link :to="`/draw/${draw.id}`" class="cover"
                   :style="{backgroundImage: `url(${$img.scedra(draw.url,'specifiedWidth')})`}">
        </nuxt-link>
        <a class="icon like" :class="{'s-heart':draw.focus,'s-hearto':!draw.focus}" :style="{color:draw.focus?`red`:`gray`}" title="收藏"
          ></a>
      </div>
    </div>
    <p style="line-height: 50px">最新</p>
    <div class="row">
      <div class="col-15 img-box center"  v-for="(draw,index) in newList" :key="index">
        <nuxt-link :to="`/draw/${draw.id}`" class="cover"
                   :style="{backgroundImage: `url(${$img.scedra(draw.url,'specifiedWidth')})`}">
        </nuxt-link>
        <a class="icon like" :class="{'s-heart':draw.focus,'s-hearto':!draw.focus}" :style="{color:draw.focus?`red`:`gray`}" title="收藏"
        ></a>
      </div>
    </div>
    <p class="center" style="line-height: 50px">
      <span> © 2018-2019</span>
      <a href="http://www.miitbeian.gov.cn/" target="_blank">粤ICP备18144953号-1</a>
    </p>
  </div>
</template>
<script>
  import config from "../assets/js/config";
  import {Pageable} from "../assets/js/model/base";

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
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../assets/style/color";
  @import "../assets/style/config";
  @import "../assets/style/mixin";
  .img-box{
    @size:50vw;
    height: @size;
    position: relative;
    .cover{
      width: 98%;
      height: 98%;
      margin: 1%;
      display:block;
    }
    .like {
      position: absolute;
      right: 5px;
      bottom: 5px;
      font-size: @big-font-size + 8px;
    }
  }
</style>
