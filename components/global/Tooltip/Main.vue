<template>
  <transition
    name="fade"
    enter-active-class="fadeInUp duration"
    leave-active-class="fadeOutDown duration"
  >
    <div v-show="visible" class="card">
      <div class="flex-box">
        <p class="message">
          {{ message }}
        </p>
        <div>
          <Btn @click="close" small icon flat>
            <i class="icon s-close"> </i>
          </Btn>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  componentName: "Tooltip",
  data() {
    return {
      closeTimeout: null,
      waitTime: 5000,
      visible: false,
      closed: false,
      callback: () => {}
    }
  },
  watch: {
    closed(newVal) {
      if (newVal) {
        this.visible = false
        this.$el.addEventListener("transitionend", this.destroyElement)
        this.$el.addEventListener("animationend", this.destroyElement)
      }
    }
  },
  mounted() {
    if (this.waitTime) {
      this.closeTimeout = setTimeout(() => {
        this.close()
      }, this.waitTime)
    }
  },
  methods: {
    destroyElement() {
      this.$el.firstElementChild.removeEventListener(
        "transitionend",
        this.destroyElement
      )
      this.$el.firstElementChild.removeEventListener(
        "animationend",
        this.destroyElement
      )
      this.$destroy(true)
      this.$el.parentNode.removeChild(this.$el)
    },
    close() {
      this.closed = true
      window.clearTimeout(this.closeTimeout)
      this.callback && this.callback(this)
    }
  }
}
</script>

<style scoped lang="less" type="text/less">
@import "../../../assets/style/color.less";
@import "../../../assets/style/config.less";
@import "../../../assets/style/mixin.less";

.card {
  width: 100%;
  position: fixed;
  z-index: @mask-index + 1;
  display: inline-block;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 3vw;
  background-color: @black;
  .message {
    .ellipsis();
    text-align: left;
    width: 100%;
    font-size: @default-font-size;
    color: #eee;
  }
  .icon {
    color: #eee;
  }
}
</style>
