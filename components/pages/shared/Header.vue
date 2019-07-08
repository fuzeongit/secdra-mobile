<template>
  <header class="animated duration"
          :class="{fadeInDown:isShow&&hid,fadeOutUp:!isShow,transparent:activeName===`detail`}">
    <nav class="row">
      <template v-if="canBack">
        <div class="col-3 center">
          <Btn small icon flat @click="$router.back()">
            <i class="icon s-left"></i>
          </Btn>
        </div>
      </template>
      <template v-else>
        <div class="col-3 center">
          <Btn small icon flat @click="MChangeShow(true)">
            <i class="icon s-menu"></i>
          </Btn>
        </div>
      </template>
      <div class="col-18 center title">
        {{menuList[activeName]||title}}
      </div>
      <div class="col-3 center">
        <Btn small icon flat to="/">
          <i class="icon s-home" :class="{active:activeName===`home`}"></i>
        </Btn>
      </div>
      <div class="col-3 center">
        <Btn small icon flat to="/find">
          <i class="icon s-faxian" :class="{active:activeName===`find`}"></i>
        </Btn>
      </div>
      <div class="col-3 center" >
        <Btn small icon flat @click="MChangeSearchShow(true)">
          <i class="icon s-chaxun"></i>
        </Btn>
      </div>
    </nav>
  </header>
</template>

<script>
  import {Menu} from '../../../assets/script/constant/base'
  import {mapState, mapActions, mapMutations} from "vuex"

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
        menuList: new Menu()
      }
    },
    watch: {
      $route() {
        window.scrollTo(0, 0)
      },
    },
    computed: {
      ...mapState('menu', {activeName: 'name', title: 'title'}),
      ...mapState('user', ['user']),
      ...mapState('window', ['scrollTop']),
      canBack() {
        let canBackList = ["detail"];
        return canBackList.indexOf(this.activeName) !== -1;
      },
      isShow() {
        let isShow = this.scrollTop < this.offset;
        if (!isShow && !this.hid) {
          this.hid = true
        }
        return isShow
      }
    },
    mounted() {
      this.countUnread();
      document.addEventListener('scroll', this.documentScroll);
    },
    beforeDestroy() {
      document.removeEventListener('scroll', this.documentScroll);
    },
    methods: {
      ...mapMutations("window", ["MChangesScroll"]),
      ...mapMutations("message", ["MChangeCount"]),
      ...mapMutations("menu", ["MChangeShow", "MChangeSearchShow"]),
      ...mapActions("message", ["ACount"]),
      documentScroll(event) {
        let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        let scrollBottom = document.body.scrollHeight - this.scrollTop - event.target.documentElement.clientHeight;
        this.MChangesScroll({scrollTop, scrollBottom})
      },
      search() {
        this.$router.push(`/draw/search/${this.tag}`)
      },
      async countUnread() {
        let result = await this.ACount();
        if (result.status !== 200) {
          return
        }
        this.MChangeCount({type: 'comment', count: result.data.COMMENT});
        this.MChangeCount({type: 'reply', count: result.data.REPLY});
        this.MChangeCount({type: 'follow', count: result.data.FOLLOW});
        this.MChangeCount({type: 'system', count: result.data.SYSTEM});
      }
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
    box-shadow: @herder-box-shadow;
    border-bottom: 1px solid @font-color-dark-line;
    background-color: @theme-color;
    z-index: 10;
    user-select: none;
    &.transparent {
      background-color: transparent;
      border-bottom: none;
      box-shadow: none;
      text-shadow: 1px 1px 3px @font-color-dark;
      button,a{
        text-shadow: 1px 1px 3px @font-color-dark;
      }
    }
    nav {
      width: 100%;
      margin: 0 auto;
      font-size: 0;
      height: @herder-nav-height;
      line-height: @herder-nav-height;
      .icon {
        font-size: @big-font-size;
        color: white;
      }
      .title {
        .ellipsis();
        font-size: @big-font-size;
        color: white;
      }
      .active {
        color: rgba(255, 255, 255, .6)
      }
    }
  }
</style>

