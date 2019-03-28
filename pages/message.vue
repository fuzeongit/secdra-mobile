<template>
  <div class="page" id="test" style="height: calc(100vh - (12vw + 1px));">
    <RefreshContent @load="load" ref="refresh">
      <p v-for="item in list" style="margin: 20px ">{{item}}</p>
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
        list: [1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
      }
    },
    components: {
      RefreshContent
    },
    computed: {
      type() {
        return this.$store.state.message.type
      }
    },
    mounted() {

    }, methods: {
      load() {

        setTimeout(()=>{
          this.list.push(this.list.max() + 1);
          this.$refs["refresh"].close()
        },1000)

      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../assets/style/color";
  @import "../assets/style/config";
  @import "../assets/style/mixin";

</style>
