<template>
  <div class="page">
    <div class="img-box" :style="{ height: `${100 * proportion}vw` }">
      <img :src="$img.secdra(draw.url, `specifiedWidth500`)" />
    </div>
    <template v-if="draw.user.id !== user.id">
      <div class="flex-text user-info-box">
        <nuxt-link v-ripple :to="`/user/${draw.user.id}`" class="head-box">
          <img
            :src="$img.head(draw.user.head, 'small50')"
            :title="draw.user.name"
          />
        </nuxt-link>
        <nuxt-link :to="`/user/${draw.user.id}`" class="nickname primary-hover">
          {{ draw.user.name }}
        </nuxt-link>
        <Btn
          block
          color="primary"
          class="following-btn"
          @click="follow(draw.user.id)"
        >
          {{
            draw.user.focus === $enum.FollowState.CONCERNED.key
              ? `已关注`
              : `关注`
          }}
        </Btn>
      </div>
      <div class="line"></div>
    </template>
    <div class="info-box">
      <h3 class="name">
        <strong>{{ draw.name }}</strong>
      </h3>
      <p class="introduction">{{ draw.introduction }}</p>
      <div class="flex-text tool-row">
        <div class="flex-text">
          <Btn flat icon small title="浏览">
            <i class="icon ali-icon-attention"></i>
          </Btn>
          <span>{{ draw.viewAmount }}</span>
        </div>
        <div class="flex-text">
          <Btn
            flat
            icon
            small
            :color="
              draw.focus === $enum.CollectState.CONCERNED.key
                ? `primary`
                : `default`
            "
            title="收藏"
            @click="collection(draw)"
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
          <span>{{ draw.likeAmount }}</span>
        </div>
      </div>
      <div class="date">创建于：{{ draw.createDate | date }}</div>
    </div>
    <div class="line"></div>
    <div class="tag-list">
      <Tag
        v-for="(item, index) in draw.tagList"
        :key="index"
        class="tag"
        :content="item"
        color="primary"
        clickable
        @click="$router.push(`/draw/search/${encodeURIComponent(item)}`)"
      ></Tag>
    </div>
    <CornerButtons>
      <Btn
        v-if="draw.user.id === user.id"
        icon
        big
        shadow
        color="white"
        @click="editShow = true"
      >
        <i class="icon ali-icon-edit"></i>
      </Btn>
      <Btn v-else icon big shadow color="white" @click="collection(draw)">
        <i
          class="icon"
          :class="{
            'ali-icon-likefill':
              draw.focus === $enum.CollectState.CONCERNED.key,
            'ali-icon-like': draw.focus !== $enum.CollectState.CONCERNED.key,
            'primary-text': draw.focus === $enum.CollectState.CONCERNED.key
          }"
        ></i> </Btn
    ></CornerButtons>
    <Model v-model="editShow" v-loading="editLoading">
      <div class="edit-model">
        <header class="edit-header">
          <nav class="row">
            <div class="col-3 center" @click="editShow = false">
              <i class="icon ali-icon-edit"></i>
            </div>
            <div class="col-18 center title">
              编辑
            </div>
          </nav>
        </header>
      </div>
    </Model>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex"
import Model from "../../components/global/Model"
import Tag from "../../components/global/Tag"
import CornerButtons from "../../components/pages/shared/CornerButtons"
import { CommentForm } from "../../assets/script/model"
export default {
  components: {
    Model,
    Tag,
    CornerButtons
  },
  data() {
    return {
      editShow: false,
      editLoading: false,
      inputTag: ""
    }
  },
  computed: {
    ...mapState("user", ["user"]),
    signedIn() {
      return this.user && this.user.id
    },
    proportion() {
      return this.draw.height / this.draw.width
    }
  },
  async asyncData({ store, route, $axios }) {
    store.commit("menu/MChangeName", "detail")
    const id = route.params.id
    const res = await $axios.get(`/draw/get`, {
      params: { id }
    })
    const result = res.data
    let drawForm
    let inputTag
    let commentForm
    if (result.status === 200) {
      drawForm = Object.assign({}, result.data)
      inputTag = drawForm.tagList.join(" ")
      commentForm = new CommentForm(result.data.user.id, result.data.id)
    }
    return {
      status: result.status,
      draw: result.data,
      drawForm,
      inputTag,
      commentForm
    }
  },
  head() {
    let title = "想你所想 - Secdra"
    if (this.status === 200) {
      title = this.draw.name + " - Secdra"
    } else if (this.status === 403) {
      title = "无权查看该图片"
    } else if (this.status === 404) {
      title = "图片不存在"
    }
    return { title }
  },
  mounted() {
    // 写入足迹
    this.status === 200 &&
      this.signedIn &&
      this.ASaveFootprint({ drawId: this.draw.id })
  },
  methods: {
    ...mapActions("draw", ["ACollection", "AUpdate"]),
    ...mapActions("footprint", { ASaveFootprint: "ASave" }),
    ...mapActions("user", ["AFollow"]),
    async collection(draw) {
      const result = await this.ACollection({
        drawId: draw.id
      })
      if (result.status !== 200) {
        this.$tooltip({ message: result.message })
        return
      }
      draw.focus = result.data
    },
    async follow(id) {
      const result = await this.AFollow({
        followingId: id
      })
      if (result.status !== 200) {
        this.$tooltip({ message: result.message })
        return
      }
      this.draw.user.focus = result.data
    },
    async save() {
      this.editLoading = true
      const tagList = this.inputTag.split(" ").filter((item) => item !== "")
      this.drawForm.tagList = [...new Set(tagList)]
      const result = await this.AUpdate(this.drawForm)
      this.editLoading = false
      if (result.status !== 200) {
        this.$tooltip({ message: result.message })
        return
      }
      this.$tooltip({ message: `修改成功` })
      this.editShow = false
      this.draw = result.data
      this.reset()
    },
    reset() {
      this.drawForm = Object.assign({}, this.draw)
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
@import "../../assets/style/color";
@import "../../assets/style/config";
@import "../../assets/style/mixin";
.page {
  min-height: 100vh;
  margin-top: 0;
  .img-box {
    background-color: @img-background-color;
    width: 100vw;
    img {
      width: 100%;
    }
  }
  @padding-size: 4vw;
  .user-info-box {
    @info-box-height: 14vw;
    @img-size: @info-box-height - @padding-size;
    @follow-btn-size: 20vw;
    padding: @padding-size;
    .head-box {
      display: block;
      position: relative;
      border-radius: 50%;
      img {
        border-radius: 50%;
        width: @img-size;
        height: @img-size;
      }
    }
    .nickname {
      padding: 0 6vw;
      flex: 1;
      .ellipsis();
    }
    .following-btn {
      padding: 0;
      width: @follow-btn-size;
    }
  }
  .info-box {
    padding: @padding-size;
    .name {
      .ellipsis();
    }
    @margin-top: 2vw;
    .introduction {
      margin-top: @margin-top;
      font-size: @smallest-font-size;
      color: @font-color-dark-fade;
    }
    .tool-row {
      margin-top: @margin-top;
      > div {
        flex: 1;
      }
    }
    .date {
      margin-top: @margin-top;
      font-size: @smallest-font-size;
      color: @font-color-dark-fade;
    }
  }
  .tag-list {
    padding: @padding-size;
    .tag {
      margin-right: 1.5vw;
      margin-bottom: 1.5vw;
    }
  }
}
</style>
