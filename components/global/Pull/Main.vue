<template>
  <div class="pull" ref="pull">
    <transition name="zoom" enter-active-class="zoomIn duration" leave-active-class="zoomOut duration">
      <div class="load" :style="{transform:`translate3d(0,${y}px,0)`}" ></div>
    </transition>
    <div style="width: 100vw">
      <p v-for="item in 1000">
        {{item}}
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      threshold: {
        type: Number,
        default: 100
      }
    },
    componentName: "Pull",
    data() {
      return {
        y: 0,
        startY: 0,
        moving: false,
        loading: false,
        isShow:true,
      }
    },
    computed: {
      scrollTop() {
        return this.$store.state.window.scrollTop
      },
    },
    mounted() {
      let pull = this.$refs['pull'];
      let Hammer = require("hammerjs");
      let manager = new Hammer.Manager(pull);
      manager.add(new Hammer.Pan());
      manager.on("panstart", this.panStart);
      manager.on("pandown", this.panDown);
      manager.on("panup", this.panUp);
      manager.on("panend", this.panEnd);

    },
    methods: {
      panStart($event) {
        this.moving = true;
      },
      panDown($event) {
        if (this.scrollTop > 1 || this.loading) {
          return
        }
        this.y += $event.overallVelocityY * 10
      },
      panUp($event) {
        if (this.scrollTop > 1 || this.loading) {
          return
        }
        this.y -= $event.overallVelocityY * 10
      },
      panEnd($event) {
        this.moving = false;
        if (this.y >= this.threshold) {
          this.y = this.threshold;
          //激活
        } else {
          this.y = 0
        }
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../../assets/style/color.less";
  @import "../../../assets/style/config.less";
  @import "../../../assets/style/mixin";

  .load {
    margin: -50px auto 0;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #0b99ff;
    display: block;
    transition: @default-animate-time;
    &.animate {
      display: block;

    }
  }
</style>
