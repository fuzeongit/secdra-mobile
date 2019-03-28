<template>
  <div class="content" ref="content" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend"
       :class="{loading:openRefresh}">
    <div class="refresh flex-box" :style="{transform: `translateY(${translateY}px)`}" :class="{transitioning}"
         @transitionend="transitionend">
      <i class="icon s-shuaxin" :style="{transform: `rotate(${translateY * 2}deg)`}" v-show="!loading"></i>
      <img src="../../../assets/image/svg/loading2.svg" style="width: 6vw;position: absolute" v-show="loading">
    </div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>

  export default {
    componentName: "RefreshContent",
    props: {
      offset: {
        type: Number,
        default: 100
      }
    },
    data() {
      return {
        openRefresh: false,
        startY: 0,
        translateY: 0,
        transitioning: false,
        loading: false,
        startScrollTop: null
      }
    },
    mounted() {

    },
    methods: {
      touchstart(event) {
        // console.log(this.$refs["content"].scrollTop);
      },
      touchmove(event) {
        if(this.loading || this.transitioning){
          return
        }
        let scrollTop = this.$refs["content"].scrollTop;
        if (!this.openRefresh) {
          if (scrollTop === 0 && this.startScrollTop === 0) {
            this.openRefresh = true;
            this.startY = event.targetTouches[0].pageY;
          }
        } else {
          if (!this.loading || !this.transitioning) {
            this.translateY = event.targetTouches[0].pageY - this.startY;
          }
        }
        this.startScrollTop = scrollTop;
      },
      touchend() {
        if (this.openRefresh) {
          if (this.translateY > this.offset) {
            this.transitioning = true;
            this.loading = true;
            this.translateY = this.offset;
          } else if (0 < this.translateY < this.offset) {
            this.transitioning = true;
            this.translateY = 0;
          }
        }
        this.startScrollTop = null;
        this.startY = 0;
      },
      transitionend() {
        if (this.translateY >= this.offset) {
          this.$emit("load")
        } else {
          this.close()
        }
      },
      close() {
        this.translateY = 0;
        setTimeout(()=>{
          this.openRefresh = false;
          this.loading = false;
          this.transitioning = false;
        },200)
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @import "../../../assets/style/color.less";
  @import "../../../assets/style/config.less";

  .content {
    height: 100%;
    overflow: scroll;
    position: relative;

    &.loading {
      touch-action: none;
      overflow: hidden;
    }
    .refresh {
      position: absolute;
      box-shadow: 0 .5vw .1vw .1vw @font-color-dark-line;
      border: 1px solid @font-color-dark-line;
      width: 12vw;
      height: 12vw;
      top: -13vw;
      left: 50%;
      margin-left: -6vw;
      border-radius: 50%;
      background-color: white;
      z-index: @mask-index - 1;
      .icon {
        font-weight: 800;
        font-size: @big-font-size + .5vw;
        color: @theme-color;
      }
    }
    .transitioning {
      transition: all @short-animate-time;
    }
  }

</style>
