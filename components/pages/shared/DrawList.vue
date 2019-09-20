<template>
  <div
    class="list-content"
    :style="{ height: `${listContentOffset.height}vw` }"
  >
    <div
      v-for="(draw, index) in list"
      :key="index"
      class="item card"
      :style="{
        left: `${offset[index].left}vw`,
        top: `${offset[index].top}vw`
      }"
    >
      <nuxt-link v-ripple :to="`/draw/${draw.id}`" class="img-box">
        <img
          v-lazy="$img.secdra(draw.url, `specifiedWidth`)"
          :style="{
            width: listConstant.colWidth + `vw`,
            height: getHeight(draw) + `vw`
          }"
        />
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

      <div
        class="flex-text info-box"
        :style="{
          width: listConstant.colWidth + `vw`,
          height: listConstant.infoHeight + `vw`
        }"
      >
        <nuxt-link v-ripple :to="`/user/${draw.user.id}`" class="head-box">
          <img v-lazy="$img.head(draw.user.head, 'small50')" />
        </nuxt-link>
        <p class="nickname">
          {{ draw.user.name }}
        </p>
      </div>
    </div>
    <div
      v-if="page.last"
      class="item last-card"
      :style="{
        left: `${listContentOffset.lastCardLeft}vw`,
        top: `${listContentOffset.lastCardTop}vw`,
        width: listConstant.colWidth + `vw`
      }"
    >
      <img v-lazy="require('../../../assets/image/error/404.jpg')" />
    </div>
  </div>
</template>

<script>
import { ListConstant } from "../../../assets/script/constant"
import windowMixin from "../../../assets/script/mixin/windowMixin"

export default {
  componentName: "DrawList",
  mixins: [windowMixin],
  props: {
    page: {
      type: Object,
      default: null
    },
    list: {
      type: Array,
      default: () => []
    },
    pageLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      listConstant: new ListConstant()
    }
  },
  computed: {
    // 计算偏移
    offset() {
      const o = []
      const colNumberHeight = this.initColNumberHeight(this.listConstant)
      // eslint-disable-next-line no-unused-vars
      for (const draw of this.list) {
        const minTopIndex = colNumberHeight.minIndex()
        const left =
          (1 + minTopIndex) * this.listConstant.widthOffset +
          this.listConstant.colWidth * minTopIndex
        const top = colNumberHeight[minTopIndex]
        colNumberHeight[minTopIndex] +=
          (draw.height / draw.width) * this.listConstant.colWidth +
          this.listConstant.heightOffset +
          this.listConstant.infoHeight
        o.push({ left, top })
      }
      return o
    },
    // 计算盒子属性
    listContentOffset() {
      const colNumberHeight = this.initColNumberHeight(this.listConstant)
      let minIndex = 0
      // eslint-disable-next-line no-unused-vars
      for (const draw of this.list) {
        colNumberHeight[minIndex] +=
          (draw.height / draw.width) * this.listConstant.colWidth +
          this.listConstant.heightOffset +
          this.listConstant.infoHeight
        minIndex = colNumberHeight.minIndex()
      }
      const offset = {
        height: colNumberHeight.max()
      }
      if (this.page.last) {
        const lastCardHeight = 300
        offset.lastCardLeft =
          (1 + minIndex) * this.listConstant.widthOffset +
          this.listConstant.colWidth * minIndex
        offset.lastCardTop = colNumberHeight.min()
        const h =
          colNumberHeight.min() +
          lastCardHeight +
          this.listConstant.heightOffset
        if (h > offset.height) {
          offset.height = h
        }
        return offset
      } else {
        return offset
      }
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
  },
  methods: {
    // 初始化高度数组
    initColNumberHeight(listConstant) {
      const t = []
      for (let i = 0; i < listConstant.colNumber; i++) {
        t[i] = listConstant.heightOffset
      }
      return t
    },
    getHeight(draw) {
      return (draw.height / draw.width) * this.listConstant.colWidth
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
@import "../../../assets/style/color";
@import "../../../assets/style/config";
@import "../../../assets/style/mixin";

.list-content {
  margin: 0 auto;
  position: relative;
  height: calc(100vh - @herder-height);
  .item {
    @info-box-height: 16vw;
    position: absolute;
    transition: @short-animate-time;

    .like {
      position: absolute;
      bottom: @info-box-height + 1vw;
      right: 1vw;
    }
    .img-box {
      display: block;
      img {
        transition: 0.5s;
        width: 100%;
      }
    }
    .info-box {
      @img-size: 10vw;
      @padding-size: 3vw;
      padding: @padding-size;
      overflow: hidden;
      .head-box {
        display: block;
        position: relative;
        transition: @default-animate-time;
        border-radius: 50%;
        img {
          border-radius: 50%;
          width: @img-size;
        }
      }
      .nickname {
        .ellipsis();
        flex: 1;
        margin-left: 2vw;
      }
    }
  }
  .last-card {
    height: 60vw;
    img {
      width: 100%;
    }
  }
}
</style>
