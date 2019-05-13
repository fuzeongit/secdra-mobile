<template>
  <div class="page">
    <div v-popover:popover class="active-name row">
      <div class="col-20">{{menuList[type]}}</div>
      <div class="col-10 right">
        <i class="icon s-down" :class="{open:popperStatus}"></i>
      </div>
    </div>
    <Popper ref="popover" trigger="click" @show="popperStatus = true" @hide="popperStatus = false">
      <ul class="options">
        <li @click="to(key)" :class="{active:(type===key),settings:(key===`settings`)}"
            v-for="(item,key) in menuList" :key="key">
          <i class="icon s-shezhi" v-if="key===`settings`"></i>
          {{item}}
          <span class="message-count" v-if="key!==`settings`&&$store.state.message[key+`Count`]">
              {{$store.state.message[key+"Count"]|toMore}}
          </span>
        </li>
      </ul>
    </Popper>
    <transition name="fade" enter-active-class="fadeIn duration" leave-active-class="fadeOut duration">
      <nuxt-child/>
    </transition>
  </div>
</template>

<script>
  class Menu {
    constructor(type, name) {
      this.type = type;
      this.name = name;
    }
  }

  export default {
    asyncData({store}) {
      store.state.menu.name = "message";
    },
    data() {
      return {
        menuList: {
          comment: '评论我的',
          reply: '回复我的',
          follow: '关注我的',
          system: '系统通知',
          settings: '消息设置',
        },
        popperStatus: false
      }
    },
    computed: {
      type() {
        return this.$store.state.message.type
      }
    },
    mounted() {
    },
    methods: {
      to(key) {
        this.$refs["popover"].doClose();
        this.$router.push(key)
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../assets/style/color";
  @import "../assets/style/config";
  @import "../assets/style/mixin";

  .active-name {
    line-height: @herder-height;
    font-size: @default-font-size;
    padding: 0 5vw;
    border-bottom: 1px solid @font-color-dark-line;
    box-shadow: 0 0 0.8vw @font-color-dark-line;
    .s-down{
      display: inline-block;
      transition: @short-animate-time all;
      &.open{
        transform: rotate(-180deg);
      }
    }
  }

  .options {
    width: 90vw;
    padding: 1vw 6vw;
    li {
      user-select: none;
      font-size: @default-font-size;
      color: @font-color-dark-fade;
      display: block;
      line-height: 8vw;
      cursor: pointer;
      text-align: left;
      font-weight: 400;
      &:before {
        content: " ";
        display: inline-block;
        margin-right: 2.5vw;
        width: 2.5vw;
        height: 2.5vw;
        border-radius: 50%;
        background-color: darken(@gray, 10%);
      }
      &.active {
        color: @theme-color;
        &:before {
          background-color: @theme-color;
        }
      }
      &.settings {
        padding-left: 3.6vw;
        border-top: 1px solid white;
        margin-left: -4vw;
        &:before {
          display: none;
        }
        .icon {
          margin-right: 1.4vw;
        }
      }
      .message-count {
        font-size: @smallest-font-size;
        height: 3.2vw;
        line-height: 3.2vw;
        color: #ffffff;
        background-color: #fb7299;
        padding: 0 2vw;
        border-radius: 2.5vw;
        margin-left: 3vw;
      }
    }
  }

</style>
