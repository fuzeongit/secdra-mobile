<template>
  <div
    :style="{ height: `${listContentOffset.height}vw` }"
    class="list-content"
  >
    <div
      v-for="(picture, index) in list"
      :key="index"
      :style="{
        left: `${offset[index].left}vw`,
        top: `${offset[index].top}vw`
      }"
      class="item card"
    >
      <nuxt-link v-ripple :to="`/picture/${picture.id}`" class="img-box">
        <img
          v-lazy="$img.secdraLazy(picture.url, 'specifiedWidth500')"
          :style="{
            width: listConstant.colWidth + `vw`,
            height: getHeight(picture) + `vw`
          }"
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

      <div
        :style="{
          width: listConstant.colWidth + `vw`,
          height: listConstant.infoHeight + `vw`
        }"
        class="flex-text info-box"
      >
        <nuxt-link v-ripple :to="`/user/${picture.user.id}`" class="head-box">
          <img v-lazy="$img.headLazy(picture.user.head, 'small50')" />
        </nuxt-link>
        <p class="nickname">
          {{ picture.user.name }}
        </p>
      </div>
    </div>
    <div
      v-if="page.last"
      :style="{
        left: `${listContentOffset.lastCardLeft}vw`,
        top: `${listContentOffset.lastCardTop}vw`,
        width: listConstant.colWidth + `vw`
      }"
      class="item last-card"
    >
      <img v-lazy="require('../../../assets/image/error/404.jpg')" />
    </div>
  </div>
</template>

<script>
import { ListConstant } from "../../../assets/script/constant"
import windowMixin from "../../../assets/script/mixin/windowMixin"

export default {
  componentName: "PictureList",
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
      for (const picture of this.list) {
        const minTopIndex = colNumberHeight.minIndex()
        const left =
          (1 + minTopIndex) * this.listConstant.widthOffset +
          this.listConstant.colWidth * minTopIndex
        const top = colNumberHeight[minTopIndex]
        colNumberHeight[minTopIndex] +=
          (picture.height / picture.width) * this.listConstant.colWidth +
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
      for (const picture of this.list) {
        colNumberHeight[minIndex] +=
          (picture.height / picture.width) * this.listConstant.colWidth +
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
    getHeight(picture) {
      return (picture.height / picture.width) * this.listConstant.colWidth
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
        object-fit: cover;
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
