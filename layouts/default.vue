<template>
  <div>
    <section>
        <transition name="fade" enter-active-class="fadeIn duration" leave-active-class="fadeOut duration">
          <nuxt />
        </transition>
    </section>
  </div>
</template>
<script>
  export default {
    middleware: 'auth',
    components: {
    }
  }
</script>
<style type="text/less" lang="less">
  @import "//at.alicdn.com/t/font_896802_48n1sgou2yi.css";
</style>
