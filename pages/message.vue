<template>
  <div class="page" id="test" style="height: calc(100vh - (12vw + 1px));">
    <RefreshContent>
      <p v-for="item in 100">{{item}}</p>
    </RefreshContent>
  </div>
</template>

<script>
  import RefreshContent from "../components/global/RefreshContent"

  class Menu {
    constructor(type, name) {
      this.type = type;
      this.name = name;
    }
  }

  export default {
    asyncData({store}) {
      store.state.menu.name = "message";
    },
    data() {
      return {
        menuList: {
          comment: '评论我的',
          reply: '回复我的',
          follow: '关注我的',
          system: '系统通知',
          settings: '消息设置',
        },
      }
    },
    components:{
      RefreshContent
    },
    computed: {
      type() {
        return this.$store.state.message.type
      }
    },
    mounted() {


    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../assets/style/color";
  @import "../assets/style/config";
  @import "../assets/style/mixin";

</style>
