<template>
  <div class="corner-buttons">
    <div
      :class="{ active: showGoTop && scrollTop > 150 }"
      class="customize-buttons"
    >
      <slot></slot>
    </div>
    <transition
      name="zoom"
      enter-active-class="fadeInUp duration"
      leave-active-class="fadeOutDown duration"
    >
      <Btn
        v-if="showGoTop"
        v-show="scrollTop > 150"
        @click="goTop"
        icon
        big
        shadow
        color="white"
      >
        <i class="icon ali-icon-up"></i>
      </Btn>
    </transition>
  </div>
</template>

<script>
import windowMixin from "../../../assets/script/mixin/windowMixin"

export default {
  componentName: "CornerButtons",
  mixins: [windowMixin],
  props: {
    showGoTop: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    goTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      })
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
@import "../../../assets/style/color";
@import "../../../assets/style/config";
@import "../../../assets/style/mixin";

.corner-buttons {
  position: fixed;
  bottom: 6vw;
  right: 6vw;
}

.customize-buttons {
  width: @big-input-line-height;
  position: absolute;
  bottom: 0;
  right: 0;
  transition: @default-animate-time;
  &.active {
    bottom: @big-input-line-height + 2vw;
  }
}
</style>
