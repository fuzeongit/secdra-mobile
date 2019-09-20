<template>
  <transition
    name="fade"
    enter-active-class="fadeIn mask-duration"
    leave-active-class="fadeOut mask-duration"
  >
    <div v-show="visible" class="mask">
      <transition
        name="zoom"
        enter-active-class="zoomIn duration"
        leave-active-class="zoomOut duration"
        @after-leave="destroyElement"
      >
        <div
          v-show="visible"
          class="card"
          :class="{
            'dialog-persistent-animate': persistentAnimate,
            duration: persistentAnimate
          }"
          @animationend="persistentAnimationend()"
          @click.stop="(_) => {}"
        >
          <h3>{{ title }}</h3>
          <p>
            {{ message }}
          </p>
          <div class="btn-group">
            <Btn flat color="primary" @click="close">
              {{ btnDesc }}
            </Btn>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import dialogMixin from "../../../assets/script/mixin/dialogMixin"
import { on, addClass } from "../../../assets/script/util/domUtil"

export default {
  componentName: "Alert",
  mixins: [dialogMixin],

  data() {
    return {
      visible: false,
      closed: false,
      title: "提示",
      btnDesc: `确定`,
      callback: () => {}
    }
  },
  mounted() {
    on(document, "keydown", this.onEsc)
    addClass(document.body, "not-scroll")
  },
  methods: {
    close() {
      this.closed = true
      this.callback && this.callback(this)
    }
  }
}
</script>

<style scoped lang="less" type="text/less">
@import "../../../assets/style/color";
@import "../../../assets/style/config";

.card {
  width: 80vw;
  margin: 0 auto;
  vertical-align: middle;
  display: inline-block;
  padding: 3vw;
  h3 {
    text-align: left;
    line-height: 8vw;
  }
  p {
    text-align: left;
    padding: 2vw 0;
    line-height: 5vw;
    color: @gray;
  }
  .btn-group {
    margin-top: 2vw;
    text-align: right;
  }
}
</style>
