<template>
  <transition name="fade" enter-active-class="fadeIn mask-duration" leave-active-class="fadeOut mask-duration" >
    <div class="mask " v-show="visible">
      <transition name="zoom" enter-active-class="zoomIn duration" leave-active-class="zoomOut duration">
        <div class="card" v-show="visible">
          <h3>
            {{title}}
          </h3>
          <p>
            {{message}}
          </p>
          <div class="confirm-btn-group">
            <button class="btn is-plain" @click.stop="no">
              {{noDesc}}
            </button>
            <button class="btn" @click.stop="ok">
              {{okDesc}}
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
  export default {
    componentName:"Confirm",
    watch: {
      closed(newVal) {
        if (newVal) {
          this.visible = false;
          this.$el.firstElementChild.addEventListener('transitionend', this.destroyElement);
          this.$el.firstElementChild.addEventListener('animationend', this.destroyElement);
        }
      }
    },
    data() {
      return {
        visible: false,
        closed: false,
        title: "提示",
        okDesc: `确定`,
        noDesc: `取消`,
        okCallback: function () {
        },
        noCallback: function () {
        }
      }
    },
    methods: {
      destroyElement() {
        this.$el.firstElementChild.removeEventListener('transitionend', this.destroyElement);
        this.$el.firstElementChild.removeEventListener('animationend', this.destroyElement);
        this.$destroy(true);
        this.$el.parentNode.removeChild(this.$el);
      },
      ok() {
        this.closed = true;
        this.okCallback && this.okCallback(this)
      },
      no() {
        this.closed = true;
        this.noCallback && this.noCallback(this)
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @import "../../../assets/style/color.less";
  @import "../../../assets/style/config.less";

  .card {
    width: 7vw;
    margin: 0 auto;
    vertical-align: middle;
    display: inline-block;
    padding:3vw;
    h3 {
      text-align: left;
      line-height: 8vw;
    }
    p {
      text-align: left;
      padding: 2vw 0;
      line-height: 5vw;
      color: @font-color-dark;
    }
    .confirm-btn-group {
      margin-top: 2vw;
      text-align: right;
    }
  }
</style>
