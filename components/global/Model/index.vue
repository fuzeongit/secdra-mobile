<template>
  <transition name="fade" enter-active-class="fadeInUp short-duration" leave-active-class="fadeOutDown short-duration">
    <div class="model" v-show="visible">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
  export default {
    componentName: "Model",
    props: {
      isShow: {
        type: Boolean,
        default: false
      }
    },
    model: {
      prop: 'isShow',
      event: 'change'
    },
    watch: {
      isShow(newVal) {
        this.visible = newVal
      },
      closed(newVal) {
        if (newVal) {
          this.visible = false;
          this.$emit("change", false);
          this.$el.firstElementChild.addEventListener('transitionend', this.destroyElement);
          this.$el.firstElementChild.addEventListener('animationend', this.destroyElement);
        }
      }
    },
    data() {
      return {
        visible: false,
        closed: false,
      }
    },
    methods: {
      destroyElement() {
        this.$el.firstElementChild.removeEventListener('transitionend', this.destroyElement);
        this.$el.firstElementChild.removeEventListener('animationend', this.destroyElement);
        this.closed = false;
      },
      close() {
        this.closed = true;
      }
    }
  }
</script>


<style scoped lang="less" type="text/less">
  @import "../../../assets/style/color.less";
  @import "../../../assets/style/config.less";

  .model {
    height: 100vh;
    width: 100vw;
    background-color: @theme-background-color;
    position: fixed;
    top: 0;
    left: 0;
    z-index: @mask-index+1;
    overflow: auto;
  }
</style>

