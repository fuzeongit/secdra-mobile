<template>
  <div class="grid-column">
    <div v-for="(item, index) in list" :key="index" class="card">
      <nuxt-link v-ripple :to="`/user/${item.id}`" style="display: block;">
        <img
          v-lazy="$img.back(item.background, `specifiedWidth500`)"
          class="cover"
        />
      </nuxt-link>
      <div class="flex-text user-info-box">
        <nuxt-link v-ripple :to="`/user/${item.id}`" class="head-box">
          <img v-lazy="$img.head(item.head)" :title="item.name" />
        </nuxt-link>
        <nuxt-link :to="`/user/${item.id}`" class="nickname primary-hover">
          {{ item.name }}
        </nuxt-link>
        <Btn
          @click="$emit(`follow`, item, index)"
          class="follower-btn"
          block
          color="primary"
          >{{
            item.focus === $enum.FollowState.CONCERNED.key ? `已关注` : `关注`
          }}</Btn
        >
      </div>
    </div>
  </div>
</template>

<script>
import windowMixin from "../../../assets/script/mixin/windowMixin"

export default {
  componentName: "UserList",
  mixins: [windowMixin],
  props: {
    list: {
      type: Array,
      default: () => []
    },
    pageLoading: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    scrollBottom(newVal) {
      if (this.pageLoading) {
        return
      }
      if (newVal > 200) {
        return
      }
      this.$emit("paging")
    }
  }
}
</script>
<style type="text/less" lang="less" scoped>
@import "../../../assets/style/color";
@import "../../../assets/style/config";
@import "../../../assets/style/mixin";

.grid-column {
  @card-width: 92vw;
  @row-gap: 5vw;
  padding: @row-gap 0;
  display: grid;
  grid-template-columns: repeat(1, @card-width);
  grid-row-gap: @row-gap;
  justify-content: center;
  .card {
    .cover {
      width: 100%;
      height: @card-width / 2;
      display: block;
    }
    .user-info-box {
      @info-box-height: 26vw;
      @padding-size: 4vw;
      @img-size: @info-box-height - @padding-size;
      @follow-btn-size: 20vw;
      padding: @padding-size;
      .head-box {
        display: block;
        position: relative;
        border-radius: 50%;
        margin-top: -(@img-size / 2);
        img {
          border-radius: 50%;
          width: @img-size;
          height: @img-size;
        }
      }
      .nickname {
        flex: 1;
        padding: 0 6vw;
        .ellipsis();
      }
      .follower-btn {
        width: @follow-btn-size;
        padding: 0;
      }
    }
  }
}
</style>
