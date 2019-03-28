<template>
  <div class="content" ref="content" @touchmove="touchmove" @touchend="touchend" :class="{loading}">
    <div class="refresh" :style="{transform: `translateY(${translateY}px)`}" :class="{loading}"></div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import RefreshDown from "./RefreshDown"

  export default {
    componentName: "RefreshContent",
    components: {
      RefreshDown
    },
    data() {
      return {
        showRefresh: false,
        startY: 0,
        translateY:0,
        animate:false,
        loading:false
      }
    },
    mounted() {
      this.add()
    },
    methods: {
      add() {

      },
      touchmove(event) {
        if (!this.showRefresh) {
          if (this.$refs["content"].scrollTop === 0) {
            this.startY = event.targetTouches[0].pageY;
            this.showRefresh = true;
            this.animate = false;
          }
        } else {
          if(event.targetTouches[0].pageY - this.startY < 0){
            this.showRefresh = false;
            return
          }
          if(!this.loading){
            this.translateY = event.targetTouches[0].pageY - this.startY;
          }
        }
      },
      touchend() {
        if(this.translateY>150){
          this.loading = true;
          this.translateY = 150;
          this.close()
        }
        this.showRefresh = false;
        this.startY = 0;
      },
      close(){
        setTimeout(()=>{
          this.loading = false;
          this.translateY = 0;
        },1000)
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

    &.loading{
      touch-action: none;
      .refresh{
        transition: all @short-animate-time;
      }
    }
    .refresh{
      position: absolute;
      background-color: #0b99ff;
      width: 50px;
      height: 50px;
      top: -50px;
      left: 50%;
      margin-left: -25px;
    }
  }

</style>
