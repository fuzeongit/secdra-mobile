<template>
  <transition
    @after-leave="destroyElement"
    name="fade"
    enter-active-class="fadeInUp short-duration"
    leave-active-class="fadeOutDown short-duration"
  >
    <div v-show="visible" class="model">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
import dialogMixin from "../../../assets/script/mixin/dialogMixin"
import { addClass, removeClass } from "../../../assets/script/util/domUtil"

export default {
  componentName: "Dialog",
  mixins: [dialogMixin],
  model: {
    prop: "show",
    event: "change"
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    enterActiveClass: {
      type: String,
      default: "fadeInUp"
    },
    leaveActiveClass: {
      type: String,
      default: "fadeOutDown"
    },
    padding: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visible: false
    }
  },
  watch: {
    show(newVal) {
      this.visible = newVal
      if (newVal) {
        addClass(document.body, "not-scroll")
      }
    }
  },
  methods: {
    destroyElement() {
      window.removeEventListener("popstate", this.pushState())
      removeClass(document.body, "not-scroll")
      this.$emit("change", false)
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
