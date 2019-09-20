<template>
  <div class="page flex-box">
    <img
      v-if="error.statusCode === 404"
      src="../assets/image/error/404.jpg"
      style="width: 100vw"
    />
    <div v-else>
      {{ error }}
    </div>
  </div>
</template>

<script>
export default {
  name: "Error",
  props: {
    error: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
@import "../assets/style/color";
@import "../assets/style/config";

.page {
  background-color: @white;
}
</style>
