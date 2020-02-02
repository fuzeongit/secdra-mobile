<template>
  <header
    :class="{
      fadeInDown: show && hid,
      fadeOutUp: !show,
      transparent: activeName === `detail`
    }"
    class="animated duration"
  >
    <nav class="flex-text">
      <template>
        <Btn v-if="canBack" @click="$router.back()" icon flat>
          <i class="icon ali-icon-back"></i>
        </Btn>
        <Btn v-else @click="changeMenu" icon flat>
          <i class="icon ali-icon-menu"></i>
        </Btn>
      </template>
      <div class="center title">
        {{ menuList[activeName] || title }}
      </div>
      <Btn icon flat to="/">
        <i
          :class="{ active: activeName === `home` }"
          class="icon ali-icon-home"
        ></i>
      </Btn>
      <Btn icon flat to="/find">
        <i
          :class="{ active: activeName === `find` }"
          class="icon ali-icon-hot"
        ></i>
      </Btn>
      <Btn @click="MChangeSearchShow(true)" icon flat>
        <i class="icon ali-icon-search"></i>
      </Btn>
    </nav>
  </header>
</template>

<script>
import { Menu } from "../../../assets/script/constant"
import windowMixin from "../../../assets/script/mixin/windowMixin"
import { mapState, mapActions, mapMutations } from "vuex"

export default {
  componentName: "Header",
  mixins: [windowMixin],
  props: {
    offset: {
      type: Number,
      default: 150
    }
  },
  data() {
    return {
      hid: false,
      show: true,
      tag: "",
      menuList: new Menu()
    }
  },
  computed: {
    ...mapState("menu", { activeName: "name", title: "title" }),
    ...mapState("user", ["user"]),
    canBack() {
      const canBackList = ["detail"]
      return canBackList.includes(this.activeName)
    },
    signedIn() {
      return this.user && this.user.id
    }
  },
  watch: {
    $route() {
      window.scrollTo(0, 0)
    },
    scrollTop(newVal, oldVal) {
      const line = newVal < this.offset
      if (line) {
        this.show = true
      } else {
        if (!this.hid) {
          this.hid = true
        }
        this.show = newVal <= oldVal
      }
    }
  },
  mounted() {
    this.signedIn && this.countUnread()
  },
  methods: {
    ...mapMutations("window", ["MChangesScroll"]),
    ...mapMutations("message", ["MChangeCount"]),
    ...mapMutations("menu", ["MChangeShow", "MChangeSearchShow"]),
    ...mapActions("message", ["ACount"]),
    search() {
      this.$router.push(`/picture/search/${this.tag}`)
    },
    async countUnread() {
      const result = await this.ACount()
      if (result.status !== 200) {
        return
      }
      this.MChangeCount({ type: "comment", count: result.data.COMMENT })
      this.MChangeCount({ type: "reply", count: result.data.REPLY })
      this.MChangeCount({ type: "follow", count: result.data.FOLLOW })
      this.MChangeCount({ type: "system", count: result.data.SYSTEM })
    },
    changeMenu() {
      if (!this.signedIn) {
        return this.$router.replace(`/login?r=${this.$route.fullPath}`)
      }
      this.MChangeShow(true)
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
  background-color: @theme-color;
  z-index: 10;
  user-select: none;
  &.transparent {
    background-color: transparent;
    border-bottom: none;
    box-shadow: none;
    text-shadow: 0.2vw 0.2vw 0.6vw @font-color-dark;
    button,
    a {
      text-shadow: 0.2vw 0.2vw 0.6vw @font-color-dark;
    }
  }
  nav {
    width: 100%;
    margin: 0 auto;
    font-size: 0;
    height: @herder-height;
    line-height: @herder-height;
    padding: 0 3vw;
    .icon {
      font-size: @big-font-size;
      color: white;
    }
    .title {
      flex: 1;
      font-size: @big-font-size;
      color: white;
      .ellipsis();
    }
    .active {
      color: rgba(255, 255, 255, 0.6);
    }
  }
}
</style>
