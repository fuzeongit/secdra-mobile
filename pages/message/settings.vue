<template>
  <div>
    <p class="list-title"><strong>消息通知开关</strong></p>
    <div>
      <div class="row">
        <div class="col-20">评论我的</div>
        <div class="col-10 right">
          <SSwitch v-model="settingsForm.commentStatus"></SSwitch>
        </div>
      </div>
      <div class="row">
        <div class="col-20">回复我的</div>
        <div class="col-10 right">
          <SSwitch v-model="settingsForm.replyStatus"></SSwitch>
        </div>
      </div>
      <div class="row">
        <div class="col-20">关注我的</div>
        <div class="col-10 right">
          <SSwitch v-model="settingsForm.followStatus"></SSwitch>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapActions} from "vuex"

  export default {
    async asyncData({store, req, redirect, route, $axios}) {
      store.commit('message/MChangeType', {type: "settings", reset: false});
      let {data: result} = await $axios.get(`/message/getSettings`);
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
    watch: {
      settingsForm: {
        handler(val) {
          this.saveSetting(val);
        },
        deep: true
      }
    },
    methods: {
      ...mapActions("message", ["ASaveSetting"]),
      async saveSetting(val) {
        await this.ASaveSetting(val)
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../assets/style/color";
  @import "../../assets/style/config";
  @import "../../assets/style/mixin";

  .list-title {
    line-height: 8vw;
    padding: 0 4vw;
    * {
      font-size: @smallest-font-size;
    }
  }

  .row {
    padding: 0 4vw;
    line-height: 12vw;
    background-color: white;
    border-bottom: 1px solid @font-color-dark-line;
    &:first-child {
      border-top: 1px solid @font-color-dark-line;
    }
  }
</style>
