<template>
  <div class="list">
    <div class="item" v-for="item in list" :key="item.id">
      <div class="row">
        <div class="col-6 head">
          <nuxt-link :to="`/user/${item.critic.id}`">
            <img :src="$img.head(item.critic.head,'small50')">
          </nuxt-link>
        </div>
        <div class="col-24 desc">
          <p class="name">
            <nuxt-link :to="`/user/${item.critic.id}`">
              {{item.critic.name}}
            </nuxt-link>
            <span>评论了我的</span>
            <nuxt-link :to="`/draw/${item.drawId}`">
              作品
            </nuxt-link>
          </p>
          <p class="time">{{item.createDate}}</p>
          <p class="content">
            {{item.content}}
          </p>
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
      let type = "comment";
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
      color:@font-color-dark;
      background-color: white;
      .head {
        img {
          border-radius: 50%;
        }
      }
      .desc {
        line-height: 6.5vw;
        .name {
          a {
            font-weight: bold;
            color: @theme-color;
          }
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
