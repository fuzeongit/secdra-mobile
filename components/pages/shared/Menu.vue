<template>
  <div :class="{mask:isShow}">
    <div class="menu" :class="{active:isShow}">

    </div>
  </div>
</template>

<script>
  export default {
    componentName: "Menu",
    computed: {
      isShow() {
        return this.$store.state.menu.isShow
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../../assets/style/color.less";
  @import "../../../assets/style/config.less";
  @import "../../../assets/style/mixin";

  .menu {
    height: 100vh;
    width: 70vw;
    background-color: white;
    position: fixed;
    top: 0;
    left: 0;
    transition: @short-animate-time;
    transform: translateX(-70vw);
    z-index: @mask-index+1;
    &.active {
      transform: translateX(0);
    }
  }
</style>
