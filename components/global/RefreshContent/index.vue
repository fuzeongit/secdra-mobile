<template>
  <div class="content" ref="content" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend"
       :class="{loading:openRefresh}"
       @scroll="scroll">
    <div class="refresh flex-box" :style="{transform:refreshTransform,opacity:closing?0:1}" ref="refresh"
         :class="{transitioning}">
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
      downOffset: {
        type: Number,
        default: 120
      },
      upOffset: {
        type: Number,
        default: 200
      }
    },
    data() {
      return {
        openRefresh: false,
        startY: 0,
        translateY: 0,
        transitioning: false,
        loading: false,
        startScrollTop: null,
        closing: false
      }
    },
    computed: {
      refreshTransform() {
        if (this.closing) {
          return `translateY(${this.translateY}px) scale3d(.3, .3, .3)`
        }
        return `translateY(${this.translateY}px) `
      }
    },
    mounted() {
    },
    methods: {
      scroll(event) {
        let scrollBottom = event.target.scrollHeight - event.target.scrollTop - event.target.clientHeight;
        if (scrollBottom > 200) {
          return
        }
        this.$emit("upLoad");
      },
      touchstart() {

      },
      touchmove(event) {
        if (this.loading || this.transitioning || this.closing) {
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
            if (event.targetTouches[0].pageY - this.startY > this.downOffset + 50) {
              this.translateY = this.downOffset + 50;
            } else {
              this.translateY = event.targetTouches[0].pageY - this.startY
            }
          }
        }
        this.startScrollTop = scrollTop;
      },
      touchend() {
        if (this.openRefresh) {
          if (this.translateY >= this.downOffset) {
            this.transitioning = true;
            this.loading = true;
            this.translateY = this.downOffset;
          } else if (0 <= this.translateY < this.downOffset) {
            this.transitioning = true;
            this.translateY = 0;
          }
        }
        this.$refs["refresh"].addEventListener("transitionend", this.loadingTransitionEnd);
        this.startScrollTop = null;
        this.startY = 0;
      },
      loadingTransitionEnd() {
        this.$refs["refresh"].removeEventListener("transitionend", this.loadingTransitionEnd);
        if (this.translateY >= this.downOffset) {
          this.$emit("downLoad")
        } else {
          this.openRefresh = false;
          this.startY = 0;
          this.translateY = 0;
          this.transitioning = false;
          this.loading = false;
          this.startScrollTop = null;
          this.closing = false;
        }
      },
      close() {
        this.$refs["refresh"].addEventListener("transitionend", this.closeTransitionEnd);
        this.closing = true;
      },
      closeTransitionEnd() {
        this.$refs["refresh"].removeEventListener("transitionend", this.closeTransitionEnd);
        this.openRefresh = false;
        this.startY = 0;
        this.translateY = 0;
        this.transitioning = false;
        this.loading = false;
        this.startScrollTop = null;
        this.closing = false;
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
    contain: layout size style;
    will-change: scroll-position;
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
      background-color: @white;
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
