<template>
  <div>
    <section>
      <Header></Header>
      <Menu></Menu>
      <Search></Search>
      <transition name="fade" enter-active-class="fadeIn duration" leave-active-class="fadeOut duration">
        <nuxt/>
      </transition>
    </section>
  </div>
</template>
<script>
  import Header from "../components/pages/shared/Header"
  import Menu from "../components/pages/shared/Menu"
  import Search from "../components/pages/shared/Search"

  export default {
    middleware: ['auth', 'messageRedirect'],
    components: {
      Header,
      Menu,
      Search
    }
  }
</script>
<style type="text/less" lang="less">
</style>
