<template>
  <div class="grid-column">
    <div v-for="(draw, index) in list" :key="index" class="card">
      <nuxt-link v-ripple :to="`/draw/${draw.id}`" style="display: block;">
        <img v-lazy="$img.secdra(draw.url, 'specifiedWidth')" class="cover" />
      </nuxt-link>
      <Btn
        flat
        icon
        :color="
          draw.focus === $enum.CollectState.CONCERNED.key
            ? `primary`
            : `default`
        "
        class="like"
        @click.stop="$emit(`collection`, draw, index)"
      >
        <i
          class="icon"
          :class="{
            'ali-icon-likefill':
              draw.focus === $enum.CollectState.CONCERNED.key,
            'ali-icon-like': draw.focus !== $enum.CollectState.CONCERNED.key
          }"
        ></i>
      </Btn>
    </div>
  </div>
</template>

<script>
import windowMixin from "../../../assets/script/mixin/windowMixin"

export default {
  componentName: "DrawCardList",
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
