<template>
  <div class="page">
    <PictureCardList
      :list="list"
      :page-loading="pageLoading"
      @paging="paging"
      @collection="collection"
    ></PictureCardList>
    <CornerButtons></CornerButtons>
  </div>
</template>

<script>
import { Pageable } from "../../assets/script/model"
import CornerButtons from "../../components/pages/shared/CornerButtons"
import PictureCardList from "../../components/pages/shared/PictureCardList"
import { mapState, mapActions } from "vuex"

export default {
  components: { CornerButtons, PictureCardList },
  data() {
    return {
      pageLoading: false
    }
  },
  computed: {
    ...mapState("user", ["user"]),
    self() {
      return this.$store.state.user.user.id === this.$route.params.userId
    }
  },
  async asyncData({ store, route, $axios }) {
    store.commit("menu/MChangeName", "footprint")
    const pageable = new Pageable(
      route.params.page * 1 || 0,
      16,
      "createDate,desc"
    )
    const { data: result } = await $axios.get(`/footprint/paging`, {
      params: Object.assign(
        {
          targetId: store.state.user.user.id
        },
        pageable
      )
    })
    return {
      pageable,
      page: result.data,
      list: result.data.content
    }
  },
  head() {
    return { title: "我的足迹 - Secdra" }
  },
  methods: {
    ...mapActions("picture", ["APagingFootprint", "ACollection"]),
    async paging() {
      if (this.pageLoading || this.page.last) {
        return
      }
      const sourcePage = ++this.pageable.page
      this.pageLoading = true
      const result = await this.APagingFootprint(
        Object.assign(
          {
            targetId: this.user.id
          },
          this.pageable
        )
      )
      this.pageLoading = false
      const data = result.data
      if (result.status !== 200) {
        this.$tooltip({ message: result.message })
        this.pageable.page = sourcePage
        return
      }
      this.page = data
      this.list.push(...data.content)
    },
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
@import "../../assets/style/color";
@import "../../assets/style/config";
@import "../../assets/style/mixin";
</style>
