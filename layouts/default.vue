<template>
  <div>
    <section>
      <Header></Header>
      <Menu></Menu>
        <transition name="fade" enter-active-class="fadeIn duration" leave-active-class="fadeOut duration">
          <nuxt />
        </transition>
    </section>
  </div>
</template>
<script>
  import Header from "../components/pages/shared/Header"
  import Menu from "../components/pages/shared/Menu"
  export default {
    middleware: 'auth',
    components: {
      Header,
      Menu
    }
  }
</script>
<style type="text/less" lang="less">
  @import "//at.alicdn.com/t/font_896802_48n1sgou2yi.css";
</style>
