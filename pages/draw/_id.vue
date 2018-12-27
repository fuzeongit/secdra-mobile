<template>
  <div class="page">
    <div style="background-color: #efefef;width: 100vw" :style="{height:`${100 * proportion}vw`} ">
      <img :src="$img.secdra(draw.url)" style="width: 100%">
    </div>
  </div>
</template>
<script>
  import config from "../../assets/js/config";

  export default {
    async asyncData({store, req, redirect, route, $axios}) {
      store.state.menu.name = "detail";

      let id = route.params.id;
      let res = await $axios.get(`${config.host}/draw/get`, {
        params: {id}
      });
      let result = res.data;
      if (result.status !== 200) {
        throw new Error(result.message)
      }
      store.state.menu.title = result.data.name;
      let drawForm = Object.assign({}, result.data);
      drawForm.tagList = drawForm.tagList.map(item => item.name);
      drawForm.isPrivate = drawForm.private;
      return {
        draw: result.data,
        drawForm
      }
    },
    computed: {
      proportion() {
        return this.draw.height / this.draw.width
      },
      user() {
        return this.$store.state.user.user
      }
    },
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../assets/style/color";
  @import "../../assets/style/config";
  @import "../../assets/style/mixin";

  .page{
    min-height: 100vh;
    margin-top: 0;
  }
</style>
