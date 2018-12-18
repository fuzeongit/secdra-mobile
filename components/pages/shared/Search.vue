<template>
  <div class="model" :class="{active:isShow}" ref="model" v-swipe:swipedown="close">
    <header >
      <nav class="row">
        <div class="col-3 center">
          <a class="icon s-fanhui" @click="close"></a>
        </div>
        <div class="col-27 center title">

        </div>
      </nav>
    </header>
  </div>
</template>

<script>
  export default {
    componentName: "Search",
    mounted(){
    },
    computed: {
      isShow: {
        get() {
          return this.$store.state.menu.searchIsShow
        },
        set(val) {
          this.$store.state.menu.searchIsShow = val
        }
      }
    },
    methods:{
      close($event){
        this.isShow = false
        console.log(this.$refs["model"].manager);
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../../assets/style/color.less";
  @import "../../../assets/style/config.less";
  @import "../../../assets/style/mixin";

  .model {
    height: 100vh;
    width: 100vw;
    background-color: white;
    position: fixed;
    top: 0;
    left: 0;
    transform: translateY(100vh);
    transition: @short-animate-time;
    z-index: @mask-index+1;
    &.active {
      transform: translateX(0);
    }

    header {
      width: 100%;
      height: @herder-height;
      font-size: @big-font-size;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      box-shadow: 0 0 4px rgba(202, 202, 202, 0.55);
      border-bottom: 1px solid #e2e2e2;
      background-color: @theme-color;
      z-index: 10;
      user-select: none;
      nav {
        width: 100%;
        margin: 0 auto;
        font-size: 0;
        height: @herder-nav-height;
        line-height: @herder-nav-height;
        .icon {
          font-size: @big-font-size + 4px;
          color:@white;
        }
        .title {
          .ellipsis();
          font-size: @big-font-size+4px;
          color:@white;
        }
      }
    }
  }
</style>
