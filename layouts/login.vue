<template>
  <div>
    <nuxt/>
  </div>
</template>
<script>
  export default {
    middleware: 'auth',
    mounted(){
      console.log(123);
    }
  }
</script>
<style type="text/less" lang="less">
</style>
