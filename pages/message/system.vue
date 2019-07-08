<template>
  <div class="list">
    <div class="item card" v-for="item in list" :key="item.id">
      <div class="row">
        <div class="col-30 desc">
          <p class="name">
            <span>{{item.title}}</span>
          </p>
          <p class="time">{{item.createDate}}</p>
          <div class="content" v-html="item.content">
          </div>
        </div>
      </div>
    </div>
    <div class="not" v-if="!list.length">
      <img src="../../assets/image/default/not.png">
    </div>
  </div>
</template>

<script>

  export default {
    async asyncData({store, req, redirect, route, $axios}) {
      let type = "system";
      store.commit('message/MChangeType', {type, reset: true});
      let {data: result} = await $axios.get(`/message/list`, {
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

  .list {
    .item {
      padding: 4vw 6vw;
      text-align: left;
      border-bottom: 1px solid @font-color-dark-line;
      color: @font-color-dark;
      background-color: white;
      .desc {
        line-height: 6.5vw;
        .name {
          font-weight: bold;
        }
        .time {
          color: @font-color-dark-fade;
        }
      }
    }
    .not {
      text-align: center;
    }
  }
</style>
