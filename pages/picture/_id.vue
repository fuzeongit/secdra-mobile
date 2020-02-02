<template>
  <div class="page">
    <div :style="{ height: `${100 * proportion}vw` }" class="img-box">
      <img :src="$img.secdra(picture.url, `specifiedWidth500`)" />
    </div>
    <template v-if="picture.user.id !== user.id">
      <div class="flex-text user-info-box">
        <nuxt-link v-ripple :to="`/user/${picture.user.id}`" class="head-box">
          <img
            :src="$img.head(picture.user.head, 'small50')"
            :title="picture.user.name"
          />
        </nuxt-link>
        <nuxt-link
          :to="`/user/${picture.user.id}`"
          class="nickname primary-hover"
        >
          {{ picture.user.name }}
        </nuxt-link>
        <Btn
          @click="follow(picture.user.id)"
          block
          color="primary"
          class="following-btn"
        >
          {{
            picture.user.focus === $enum.FollowState.CONCERNED.key
              ? `已关注`
              : `关注`
          }}
        </Btn>
      </div>
      <div class="line"></div>
    </template>
    <div class="info-box">
      <h3 class="name">
        <strong>{{ picture.name }}</strong>
      </h3>
      <p class="introduction">{{ picture.introduction }}</p>
      <div class="flex-text tool-row">
        <div class="flex-text">
          <Btn flat icon small title="浏览">
            <i class="icon ali-icon-attention"></i>
          </Btn>
          <span>{{ picture.viewAmount }}</span>
        </div>
        <div class="flex-text">
          <Btn
            :color="
              picture.focus === $enum.CollectState.CONCERNED.key
                ? `primary`
                : `default`
            "
            @click="collection(picture)"
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
      <div class="date">创建于：{{ picture.createDate | date }}</div>
    </div>
    <div class="line"></div>
    <div class="tag-list">
      <Tag
        v-for="(item, index) in picture.tagList"
        :key="index"
        :content="item"
        @click="$router.push(`/picture/search/${encodeURIComponent(item)}`)"
        class="tag"
        color="primary"
        clickable
      ></Tag>
    </div>
    <CornerButtons>
      <Btn
        v-if="picture.user.id === user.id"
        @click="editShow = true"
        icon
        big
        shadow
        color="white"
      >
        <i class="icon ali-icon-edit"></i>
      </Btn>
      <Btn v-else @click="collection(picture)" icon big shadow color="white">
        <i
          :class="{
            'ali-icon-likefill':
              picture.focus === $enum.CollectState.CONCERNED.key,
            'ali-icon-like': picture.focus !== $enum.CollectState.CONCERNED.key,
            'primary-text': picture.focus === $enum.CollectState.CONCERNED.key
          }"
          class="icon"
        ></i> </Btn
    ></CornerButtons>
    <Model v-model="editShow" v-loading="editLoading">
      <div class="edit-model">
        <header class="edit-header">
          <nav class="row">
            <div @click="editShow = false" class="col-3 center">
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
import Model from "../../components/global/Model"
import Tag from "../../components/global/Tag"
import CornerButtons from "../../components/pages/shared/CornerButtons"
import { CommentForm } from "../../assets/script/model"
import { mapActions, mapState } from "vuex"
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
      return this.picture.height / this.picture.width
    }
  },
  async asyncData({ store, route, $axios }) {
    store.commit("menu/MChangeName", "detail")
    const id = route.params.id
    const res = await $axios.get(`/picture/get`, {
      params: { id }
    })
    const result = res.data
    let pictureForm
    let inputTag
    let commentForm
    if (result.status === 200) {
      pictureForm = Object.assign({}, result.data)
      inputTag = pictureForm.tagList.join(" ")
      commentForm = new CommentForm(result.data.user.id, result.data.id)
    }
    return {
      status: result.status,
      picture: result.data,
      pictureForm,
      inputTag,
      commentForm
    }
  },
  head() {
    let title = "想你所想 - Secdra"
    if (this.status === 200) {
      title = this.picture.name + " - Secdra"
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
      this.ASaveFootprint({ pictureId: this.picture.id })
  },
  methods: {
    ...mapActions("picture", ["ACollection", "AUpdate"]),
    ...mapActions("footprint", { ASaveFootprint: "ASave" }),
    ...mapActions("user", ["AFollow"]),
    async collection(picture) {
      const result = await this.ACollection({
        pictureId: picture.id
      })
      if (result.status !== 200) {
        this.$tooltip({ message: result.message })
        return
      }
      picture.focus = result.data
    },
    async follow(id) {
      const result = await this.AFollow({
        followingId: id
      })
      if (result.status !== 200) {
        this.$tooltip({ message: result.message })
        return
      }
      this.picture.user.focus = result.data
    },
    async save() {
      this.editLoading = true
      const tagList = this.inputTag.split(" ").filter((item) => item !== "")
      this.pictureForm.tagList = [...new Set(tagList)]
      const result = await this.AUpdate(this.pictureForm)
      this.editLoading = false
      if (result.status !== 200) {
        this.$tooltip({ message: result.message })
        return
      }
      this.$tooltip({ message: `修改成功` })
      this.editShow = false
      this.picture = result.data
      this.reset()
    },
    reset() {
      this.pictureForm = Object.assign({}, this.picture)
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
