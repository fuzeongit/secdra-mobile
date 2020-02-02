<template>
  <div class="page">
    <p class="title">
      <i class="icon s-faxian"></i>
      发现
      <Btn round flat small color="primary" to="/find">更多>></Btn>
    </p>
    <div class="image-grid-row">
      <div v-for="(picture, index) in likeList" :key="index" class="item">
        <div class="img-box">
          <nuxt-link
            v-ripple
            :to="`/picture/${picture.id}`"
            :title="picture.name"
          >
            <img
              v-lazy="$img.secdra(picture.url, 'specifiedWidth')"
              class="cover"
            />
          </nuxt-link>
        </div>
        <div class="tool">
          <nuxt-link
            slot="reference"
            v-ripple
            :to="`/user/${picture.user.id}`"
            :title="picture.user.name"
            class="head-image"
          >
            <img v-lazy="$img.head(picture.user.head, 'small50')" />
          </nuxt-link>
          <div class="tool-btn-group">
            <Btn flat icon small title="浏览">
              <i class="icon ali-icon-attention"></i>
            </Btn>
            <span>{{ picture.viewAmount }}</span>
            <Btn
              :color="
                picture.focus === $enum.CollectState.CONCERNED.key
                  ? `primary`
                  : `default`
              "
              @click.stop="collection(picture)"
              flat
              icon
              small
              title="收藏"
            >
              <i
                :class="{
                  'ali-icon-likefill':
                    picture.focus === $enum.CollectState.CONCERNED.key,
                  'ali-icon-like':
                    picture.focus !== $enum.CollectState.CONCERNED.key
                }"
                class="icon"
              ></i>
            </Btn>
            <span>{{ picture.likeAmount }}</span>
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
      <div v-for="(picture, index) in newList" :key="index" class="item">
        <div class="img-box">
          <nuxt-link
            v-ripple
            :to="`/picture/${picture.id}`"
            :title="picture.name"
          >
            <img
              v-lazy="$img.secdra(picture.url, 'specifiedWidth')"
              class="cover"
            />
          </nuxt-link>
        </div>
        <div class="tool flex-text">
          <nuxt-link
            v-ripple
            :to="`/user/${picture.user.id}`"
            :title="picture.user.name"
            class="head-image"
          >
            <img v-lazy="$img.head(picture.user.head, 'small50')" />
          </nuxt-link>
          <div class="tool-btn-group">
            <Btn flat icon small title="浏览">
              <i class="icon ali-icon-attention"></i>
            </Btn>
            <span>{{ picture.viewAmount }}</span>
            <Btn
              :color="
                picture.focus === $enum.CollectState.CONCERNED.key
                  ? `primary`
                  : `default`
              "
              @click.stop="collection(picture)"
              flat
              icon
              small
              title="收藏"
            >
              <i
                :class="{
                  'ali-icon-likefill':
                    picture.focus === $enum.CollectState.CONCERNED.key,
                  'ali-icon-like':
                    picture.focus !== $enum.CollectState.CONCERNED.key
                }"
                class="icon"
              ></i>
            </Btn>
            <span>{{ picture.likeAmount }}</span>
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
import { Pageable } from "../assets/script/model"
import { mapActions } from "vuex"

export default {
  data() {
    return {
      showGoTop: false
    }
  },
  // 在这里不能使用httpUtil
  async asyncData({ store, $axios }) {
    store.commit("menu/MChangeName", "home")
    const taskList = []
    taskList.push(
      $axios.get(`/picture/pagingByRecommend`, { params: new Pageable(0, 10) })
    )
    taskList.push(
      $axios.get(`/picture/paging`, {
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
    ...mapActions("picture", ["ACollection"]),
    async collection(picture) {
      const result = await this.ACollection({
        pictureId: picture.id
      })
      if (result.status !== 200) {
        this.$tooltip({ message: result.message })
        return
      }
      picture.focus = result.data
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
