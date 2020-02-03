<template>
  <div>
    <div
      v-lazy:background-image="
        $img.backLazy(user.background, `specifiedWidth500`)
      "
      class="user-bk cover"
    >
      <div class="user-bk-content"></div>
    </div>
    <div class="content card">
      <div class="head-box">
        <img v-lazy="$img.headLazy(user.head, `small100`)" />
        <div class="info-box">
          <p class="name">
            {{ user.name }}
            <i
              :class="{
                'ali-icon-female': user.gender === 'FEMALE',
                'ali-icon-male': user.gender === 'MALE'
              }"
              class="icon"
            ></i>
          </p>
          <p class="introduction">
            {{ user.introduction || "这人很懒，什么都没有留下" }}
          </p>
        </div>
      </div>
      <div class="picture-box">
        <div v-loading="worksLoading" class="works-box">
          <p class="title">
            <i class="icon s-new"></i>
            我的作品
            <Btn
              v-if="worksList.length === 8"
              :to="`/works/${user.id || ''}`"
              round
              flat
              small
              color="primary"
            >
              更多>></Btn
            >
          </p>
          <div v-if="worksList.length" class="image-grid-row">
            <div
              v-for="(picture, index) in worksList"
              :key="index"
              class="item"
            >
              <div class="img-box">
                <nuxt-link
                  v-ripple
                  :to="`/picture/${picture.id}`"
                  :title="picture.name"
                >
                  <img
                    v-lazy="$img.secdraLazy(picture, 240, true)"
                    class="cover"
                  />
                </nuxt-link>
              </div>
            </div>
          </div>
          <img
            v-if="!worksLoading && !worksList.length"
            src="../../../assets/image/default/not.png"
            class="is-not"
          />
        </div>
        <div v-loading="collectionLoading" class="collection-box">
          <p class="title" style="margin-top: 8vw">
            <i class="icon s-new"></i>
            我的收藏
            <Btn
              v-if="collectionList.length === 8"
              :to="`/works/${user.id || ''}`"
              round
              flat
              small
              color="primary"
            >
              更多>></Btn
            >
          </p>
          <div v-if="collectionList.length" class="image-grid-row">
            <div
              v-for="(picture, index) in collectionList"
              :key="index"
              class="item"
            >
              <div class="img-box">
                <nuxt-link
                  v-ripple
                  :to="`/picture/${picture.id}`"
                  :title="picture.name"
                >
                  <img
                    v-lazy="$img.secdraLazy(picture, 240, true)"
                    class="cover"
                  />
                </nuxt-link>
              </div>
            </div>
          </div>
          <img
            v-if="!collectionLoading && !collectionList.length"
            src="../../../assets/image/default/not.png"
            class="is-not"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Pageable } from "../../../assets/script/model"
import { mapActions, mapMutations, mapState } from "vuex"

export default {
  data() {
    return {
      tailoringHeadShow: false,
      tailoringBackShow: false,
      tailoringHeadImage: "",
      tailoringBackImage: "",
      headCropper: {},
      backCropper: {},
      uploadHeadLoading: false,
      uploadBackLoading: false,

      worksLoading: true,
      worksList: [],
      collectionLoading: true,
      collectionList: [],

      editShow: false,
      userForm: Object.assign({}, this.$store.state.user.user), // 需要脱离vuex
      editLoading: false
    }
  },
  computed: {
    ...mapState("user", ["user", "uploadToken"])
  },
  watch: {
    tailoringHeadImage(newVal, oldVal) {
      if (oldVal) {
        URL.revokeObjectURL(oldVal)
      }
    },
    tailoringBackImage(newVal, oldVal) {
      if (oldVal) {
        URL.revokeObjectURL(oldVal)
      }
    }
  },
  mounted() {
    this.pagingWorks()
    this.pagingCollection()
  },
  methods: {
    ...mapMutations("user", ["MSetUserInfo", "MSetUserInfoAttr"]),
    ...mapActions("user", ["APagingByFollowerId"]),
    ...mapActions("picture", ["APagingCollection", "APaging"]),
    async pagingWorks() {
      this.worksLoading = true
      const result = await this.APaging(
        Object.assign(new Pageable(0, 8, "createDate,desc"), {
          targetId: this.user.id
        })
      )
      if (result.status !== 200) {
        this.$tooltip({ message: result.message })
        return
      }
      this.worksLoading = false
      this.worksList = result.data.content
    },
    async pagingCollection() {
      this.collectionLoading = true
      const result = await this.APagingCollection(
        new Pageable(0, 8, "createDate,desc")
      )
      if (result.status !== 200) {
        this.$tooltip({ message: result.message })
        return
      }
      this.collectionLoading = false
      this.collectionList = result.data.content
    },
    async update() {
      this.editLoading = true
      const result = await this.AUpdate(this.userForm)
      this.editLoading = false
      if (result.status !== 200) {
        this.$tooltip({ message: result.message })
        return
      }
      this.editShow = false
      this.$tooltip({ message: `修改成功` })
      this.MSetUserInfo(result.data)
      this.userForm = Object.assign({}, this.user)
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
@import "../../../assets/style/color";
@import "../../../assets/style/config";

.user-bk {
  width: 100%;
  margin-top: -@herder-height;
  height: @window-min-width / 2;
  .user-bk-content {
    padding-top: @herder-height;
    width: @visual-width;
    height: 100%;
    margin: 0 auto;
    position: relative;
  }
}

.content {
  width: @visual-width;
  @head-img-height: 25vw;
  @head-img-border: 0.8vw;
  transform: translateY(0);

  .head-box {
    position: relative;
    top: -10vw;
    img {
      display: block;
      margin: 0 auto;
      height: @head-img-height;
      width: @head-img-height;
      border: @head-img-border solid white;
      border-radius: 50%;
    }
    .info-box {
      text-align: center;
      padding: 3vw 8vw;
      .name {
        font-size: @medium-font-size;
        .icon {
          margin-left: 0.5vw;
          vertical-align: baseline;
          font-size: @medium-font-size;
          &.ali-icon-female {
            color: @female-color;
          }
          &.ali-icon-male {
            color: @male-color;
          }
        }
      }
      .introduction {
        line-height: 5.5vw;
        font-size: @small-font-size;
        margin-top: 2vw;
      }
    }
  }

  .picture-box {
    .works-box,
    .collection-box {
      min-height: 50vw;
      padding-bottom: 2vw;
    }
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
    .is-not {
      display: block;
      margin: 0 auto;
    }
  }
}
</style>
