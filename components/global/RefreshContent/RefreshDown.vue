<template>
  <div class="refresh-mask" ref="refresh" @touchmove="touchmove">
    <div class="" style="color: #0b99ff;height: 50px;width: 50px;margin-top: -50px"></div>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        startTranslateY:0,
        translateY:0,
      }
    },
    mounted(){

    },
    methods:{
      touchmove(event){
        console.log(event);
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @import "../../../assets/style/color.less";
  @import "../../../assets/style/config.less";

  .refresh-mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
</style>
