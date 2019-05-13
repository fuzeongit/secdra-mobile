<template>
  <div></div>
</template>
<script>
  import {mapActions} from "vuex"
  import config from "../../assets/script/config";


  export default {
    async asyncData({store, req, redirect, route, $axios}) {
      store.state.message.type = "settings";
      let {data: result} = await $axios.get(`${config.host}/message/getSettings`);
      let settingsForm = {
        id: result.data.id,
        commentStatus: result.data.commentStatus,
        followStatus: result.data.followStatus,
        replyStatus: result.data.replyStatus,
      };
      return {
        settingsForm
      }
    },

  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../assets/style/color";
  @import "../../assets/style/config";
  @import "../../assets/style/mixin";

</style>
