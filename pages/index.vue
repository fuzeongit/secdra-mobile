<template>
  <div class="page">
    <p class="title">
      <i class="icon s-faxian"></i>
      发现
      <Btn round flat small color="primary" to="/find"> 更多>></Btn>
    </p>
    <div class="image-grid-row">
      <div v-for="(draw, index) in likeList" :key="index" class="item">
        <div class="img-box">
          <nuxt-link v-ripple :to="`/draw/${draw.id}`" :title="draw.name">
            <img
              v-lazy="$img.secdra(draw.url, 'specifiedWidth')"
              class="cover"
            />
          </nuxt-link>
        </div>
        <div class="tool">
          <nuxt-link
            slot="reference"
            v-ripple
            :to="`/draw/${draw.id}`"
            class="head-image"
            :title="draw.user.name"
          >
            <img v-lazy="$img.head(draw.user.head, 'small50')" />
          </nuxt-link>
          <div class="tool-btn-group">
            <Btn flat icon small title="浏览">
              <i class="icon ali-icon-attention"></i>
            </Btn>
            <span>{{ draw.viewAmount }}</span>
            <Btn
              flat
              icon
              :color="
                draw.focus === $enum.CollectState.CONCERNED.key
                  ? `primary`
                  : `default`
              "
              small
              title="收藏"
              @click.stop="collection(draw)"
            >
              <i
                class="icon"
                :class="{
                  'ali-icon-likefill':
                    draw.focus === $enum.CollectState.CONCERNED.key,
                  'ali-icon-like':
                    draw.focus !== $enum.CollectState.CONCERNED.key
                }"
              ></i>
            </Btn>
            <span>{{ draw.likeAmount }}</span>
          </div>
        </div>
      </div>
    </div>
    <p class="title">
      <i class="icon s-new"></i>
      最新
      <Btn round flat small color="primary" to="/new"> 更多>></Btn>
    </p>
    <div class="image-grid-row">
      <div v-for="(draw, index) in newList" :key="index" class="item">
        <div class="img-box">
          <nuxt-link v-ripple :to="`/draw/${draw.id}`" :title="draw.name">
            <img
              v-lazy="$img.secdra(draw.url, 'specifiedWidth')"
              class="cover"
            />
          </nuxt-link>
        </div>
        <div class="tool flex-text">
          <nuxt-link
            v-ripple
            :to="`/draw/${draw.id}`"
            class="head-image"
            :title="draw.user.name"
          >
            <img v-lazy="$img.head(draw.user.head, 'small50')" />
          </nuxt-link>
          <div class="tool-btn-group">
            <Btn flat icon small title="浏览">
              <i class="icon ali-icon-attention"></i>
            </Btn>
            <span>{{ draw.viewAmount }}</span>
            <Btn
              flat
              icon
              :color="
                draw.focus === $enum.CollectState.CONCERNED.key
                  ? `primary`
                  : `default`
              "
              small
              title="收藏"
              @click.stop="collection(draw)"
            >
              <i
                class="icon"
                :class="{
                  'ali-icon-likefill':
                    draw.focus === $enum.CollectState.CONCERNED.key,
                  'ali-icon-like':
                    draw.focus !== $enum.CollectState.CONCERNED.key
                }"
              ></i>
            </Btn>
            <span>{{ draw.likeAmount }}</span>
          </div>
        </div>
      </div>
    </div>
    <p class="center" style="line-height: 6vw;margin-top: 6vw">
      <span> © 2018-2019</span>
      <a href="http://www.miitbeian.gov.cn/" target="_blank"
        >粤ICP备18144953号-1</a
      >
    </p>
  </div>
</template>
<script>
import { mapActions } from "vuex"
import { Pageable } from "../assets/script/model"

export default {
  data() {
    return {
      showGoTop: false
    }
  },
  // 在这里不能使用httpUtil
  async asyncData({ store, req, redirect, route, $axios }) {
    store.commit("menu/MChangeName", "home")
    const taskList = []
    taskList.push(
      $axios.get(`/draw/pagingByRecommend`, { params: new Pageable(0, 10) })
    )
    taskList.push(
      $axios.get(`/draw/paging`, {
        params: new Pageable(0, 10, "createDate,desc")
      })
    )
    const resultList = (await Promise.all(taskList)).map((item) => item.data)
    return {
      likeList: resultList[0].data.content,
      newList: resultList[1].data.content
    }
  },
  methods: {
    ...mapActions("draw", ["ACollection"]),
    async collection(draw) {
      const result = await this.ACollection({
        drawId: draw.id
      })
      if (result.status !== 200) {
        this.$tooltip({ message: result.message })
        return
      }
      draw.focus = result.data
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
@import "../assets/style/color";
@import "../assets/style/config";
@import "../assets/style/mixin";

.title {
  line-height: 8vw;
  padding: 1vw 4vw;
  > .icon {
    font-size: @medium-font-size;
  }
  .btn {
    float: right;
  }
}
.image-grid-row {
  @img-size: 48vw;
  display: grid;
  width: 100%;
  margin: 0 auto;
  justify-content: space-evenly;
  grid-template-columns: repeat(2, @img-size);
  grid-row-gap: 2vw;

  .img-box {
    position: relative;
    a {
      width: @img-size;
      height: @img-size;
      display: block;
    }
    .cover {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .tool {
    margin: 1vw 0;
    text-align: right;
    .head-image {
      @head-size: 8vw;
      width: @head-size;
      height: @head-size;
      border-radius: 50%;
      overflow: hidden;
      display: inline-block;
      float: left;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .tool-btn-group {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      span {
        margin-left: 0.5vw;
        margin-right: 1vw;
      }
    }
  }
}
</style>
