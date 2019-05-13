<template>
  <div class="list">

  </div>
</template>

<script>
  import config from "../../assets/script/config";

  export default {
    async asyncData({store, req, redirect, route, $axios}) {
      let type = "follow";
      store.state.message.type = type;
      store.state.message[type+"Count"] = 0;
      let {data: result} = await $axios.get(`${config.host}/message/list`, {
        params: {
          messageType: type.toUpperCase()
        }
      });
      if (result.status !== 200) {
        throw new Error(result.message)
      }
      return {
        list: result.data
      }
    }
  }
</script>


<style type="text/less" lang="less" scoped>
  @import "../../assets/style/color";
  @import "../../assets/style/config";
  @import "../../assets/style/mixin";


</style>
