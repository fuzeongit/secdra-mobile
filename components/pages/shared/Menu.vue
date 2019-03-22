<template>
  <div v-swipe:swipeleft="close">
    <transition name="fade" enter-active-class="fadeIn mask-duration" leave-active-class="fadeOut mask-duration">
      <div class="mask" v-show="isShow" @click.stop="close">
      </div>
    </transition>
    <div class="menu" :class="{active:isShow}">
      <div class="cover"
           :style="{backgroundImage: `url(${$img.back(user.background,`backCard`)})`}">
      </div>
      <div class="center" style="margin-top: -10vw;margin-bottom: 5vw">
        <a @click="to(`/user/${user.id}`)" class="head-box">
          <img :src="$img.head(user.head)">
        </a>
      </div>
      <ul class="list">
        <li :class="{active:activeName===`new`}">
          <a @click="to(`/new`)">
            <i class="icon s-new"></i>
            最新发现
          </a>
        </li>
        <li :class="{active:activeName===`collection`}">
          <a @click="to(`/collection/${user.id||''}`)">
            <i class="icon s-hearto"></i>
            我的收藏
          </a>
        </li>
        <li :class="{active:activeName===`works`}">
          <a @click="to(`/works/${user.id||''}`)">
            <i class="icon s-zhuanyeyukecheng"></i>
            我的作品
          </a>
        </li>
        <li :class="{active:activeName===`footprint`}">
          <a @click="to(`/footprint`)">
            <i class="icon s-zuji"></i>
            我的足迹
          </a>
        </li>
        <li :class="{active:activeName===`following`}">
          <a @click="to(`/following/${user.id||''}`)">
            <i class="icon s-guanzhu1"></i>
            关注用户
          </a>
        </li>
        <li :class="{active:activeName===`upload`}">
          <a @click="to(`/upload`)">
            <i class="icon s-upload"></i>
            我要上传
          </a>
        </li>
        <li>
          <a @click="logout">
            <i class="icon s-zhuxiao"></i>
            退出登录
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import Cookie from 'js-cookie'

  export default {
    componentName: "Menu",

    computed: {
      user() {
        return this.$store.state.user.user || {}
      },
      isShow: {
        get() {
          return this.$store.state.menu.isShow
        },
        set(val) {
          this.$store.state.menu.isShow = val
        }
      },
      activeName() {
        return this.$store.state.menu.name
      },
    },
    methods: {
      close() {
        this.isShow = false
      },
      to(path) {
        if (this.$route.path === path) return;
        this.close();
        this.$router.push(path);
      },
      logout() {
        this.close();
        this.$confirm({
          message: `你确定要退出登录吗？`,
          okCallback: () => {
            Cookie.remove("token");
            this.$router.replace("/login")
          }
        });
      },
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../../assets/style/color.less";
  @import "../../../assets/style/config.less";
  @import "../../../assets/style/mixin";

  .menu {
    @width: 70vw;
    height: 100vh;
    width: @width;
    background-color: white;
    position: fixed;
    top: 0;
    left: 0;
    transform: translateX(-@width - 1vw);
    transition: @short-animate-time;
    z-index: @mask-index+1;
    &.active {
      transform: translateX(0);
    }
    .cover {
      height: @width / 2;
    }
    .head-box {
      display: block;
      position: relative;
      img {
        border-radius: 50%;
        width: @width / 3;
      }
    }
    .list {
      li {
        line-height: 10vw;
        a {
          font-size: @medium-font-size;
          display: block;
          padding: 0 12vw;
        }
        .icon {
          margin-right: 6vw;
          font-size: @big-font-size;
        }
        &.active {
          background-color: #f8f8f8;
          a {
            color: @theme-color;
          }
          .icon {
            color: @theme-color;
          }
        }
      }
    }
  }
</style>
