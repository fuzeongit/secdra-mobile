<template>
  <header class="animated duration" :class="{fadeInDown:isShow&&hid,fadeOutUp:!isShow}">
    <nav class="row">
      <div class="col-3 center">
        <i class="icon s-guanzhu1" @click="menuIsShow=true"></i>
      </div>
      <div class="col-18 center title">
        测试
      </div>
      <div class="col-3 center"><i class="icon s-guanzhu1"></i></div>
      <div class="col-3 center"><i class="icon s-guanzhu1"></i></div>
      <div class="col-3 center"><i class="icon s-guanzhu1"></i></div>
    </nav>
  </header>
</template>

<script>
  import Cookie from 'js-cookie'

  export default {
    componentName: "Header",
    props: {
      offset: {
        type: Number,
        default: 150
      }
    },
    data() {
      return {
        hid: false,
        tag: "",
      }
    },
    watch: {
      $route() {
        this.scrollTop = 0;
        document.documentElement.scrollTop = 0
      },
    },
    computed: {
      isShow() {
        let isShow = this.scrollTop < this.offset;
        if (!isShow && !this.hid) {
          this.hid = true
        }
        return isShow
      },
      menuIsShow: {
        get() {
          return this.$store.state.menu.isShow
        },
        set(val) {
          this.$store.state.menu.isShow = val
        }
      },
      user() {
        return this.$store.state.user.user || {}
      },
      activeName() {
        return this.$store.state.menu.name
      },
      scrollTop: {
        get() {
          return this.$store.state.window.scrollTop || 0
        },
        set(val) {
          this.$store.state.window.scrollTop = val || 0
        }
      }
    },
    mounted() {
      document.addEventListener('scroll', this.documentScroll);
    },
    beforeDestroy() {
      document.removeEventListener('scroll', this.documentScroll);
    },
    methods: {
      documentScroll(event) {
        this.scrollTop = event.target.documentElement.scrollTop;
        this.$store.state.window.scrollBottom = event.target.documentElement.scrollHeight - this.scrollTop - event.target.documentElement.clientHeight
      },
      search() {
        this.$router.push(`/draw/search/${this.tag}`)
      },
      logout() {
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

  header {
    width: 100%;
    height: @herder-height;
    font-size: @big-font-size;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    box-shadow: 0 0 4px rgba(202, 202, 202, 0.55);
    border-bottom: 1px solid #e2e2e2;
    background-color: @white;
    z-index: 10;
    user-select: none;
    nav {
      width: 100%;
      margin: 0 auto;
      font-size: 0;
      height: @herder-nav-height;
      line-height: @herder-nav-height;
      color: @font-color;
      .icon {
        font-size: @big-font-size + 4px;
      }
      .title {
        .ellipsis();
        font-size: @big-font-size+4px;
      }
    }
  }
</style>

