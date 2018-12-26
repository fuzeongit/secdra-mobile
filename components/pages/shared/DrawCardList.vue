<template>
  <div class="content row">
    <div class="card " v-for="(draw,index) in list" :key="index">
      <nuxt-link :to="`/draw/${draw.id}`" class="img-box flex-box">
        <img :src="$img.scedra(draw.url,`specifiedWidth`)"
             style="width: 100%">
      </nuxt-link>
    </div>
  </div>
</template>

<script>
    export default {
      componentName: "DrawCardList",
      props:{
        list:{
          type:Array,
          default:[],
        }
      }
    }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../../assets/style/color.less";
  @import "../../../assets/style/config.less";
  @import "../../../assets/style/mixin";
  .card{
    width: 92vw;
    margin: 4vw;
    border-radius: @big-border-radius;
    background-color: @white;
    box-shadow: 0 0 50px rgba(150, 150, 150, 0.55);
  }
</style>
