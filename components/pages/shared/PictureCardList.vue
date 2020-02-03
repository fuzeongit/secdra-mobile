<template>
  <div class="grid-column">
    <div v-for="(picture, index) in list" :key="index" class="card">
      <nuxt-link
        v-ripple
        :to="`/picture/${picture.id}`"
        style="display: block;"
      >
        <img
          v-lazy="$img.secdraLazy(picture.url, 'specifiedWidth500')"
          class="cover"
        />
      </nuxt-link>
      <Btn
        :color="
          picture.focus === $enum.CollectState.CONCERNED.key
            ? `primary`
            : `default`
        "
        @click.stop="$emit(`collection`, picture, index)"
        flat
        icon
        class="like"
      >
        <i
          :class="{
            'ali-icon-likefill':
              picture.focus === $enum.CollectState.CONCERNED.key,
            'ali-icon-like': picture.focus !== $enum.CollectState.CONCERNED.key
          }"
          class="icon"
        ></i>
      </Btn>
    </div>
  </div>
</template>

<script>
import windowMixin from "../../../assets/script/mixin/windowMixin"

export default {
  componentName: "PictureCardList",
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
    position: relative;
    .cover {
      width: 100%;
      display: block;
    }
    .like {
      position: absolute;
      bottom: 1vw;
      right: 1vw;
    }
  }
}
</style>
