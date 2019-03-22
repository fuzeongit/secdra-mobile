<template lang="html">
  <div class="loading-page flex-box" v-if="loading">
    <div>
      <img src="../assets/image/svg/loading2.svg">
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        loading: false
      }
    },
    methods: {
      start () {
        this.loading = true
      },
      finish () {
        this.loading = false
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../assets/style/color";
  @import "../assets/style/config";
  @import "../assets/style/mixin";
  .loading-page {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    font-size: 6vw;
    z-index: @mask-index;
    div{
      width: 20vw;
      height: 20vw;
      background-color: rgba(0,0,0,.5);
      border-radius: @big-border-radius;
      padding: 5vw;
      img{
        width: 100%;
      }
    }
  }
</style>
