<template>
  <div class="page">
    <DrawCardList
      :list="list"
      :page-loading="pageLoading"
      @paging="paging"
      @collection="collection"
    ></DrawCardList>
    <CornerButtons></CornerButtons>
  </div>
</template>

<script>
import { mapActions } from "vuex"
import { Pageable } from "../../../assets/script/model"
import CornerButtons from "../../../components/pages/shared/CornerButtons"
import DrawCardList from "../../../components/pages/shared/DrawCardList"

export default {
  components: { CornerButtons, DrawCardList },
  data() {
    return {
      pageLoading: false
    }
  },
  computed: {
    self() {
      return (
        !this.$route.params.userId ||
        this.$store.state.user.user.id === this.$route.params.userId
      )
    }
  },
  async asyncData({ store, redirect, route, $axios }) {
    const myself = store.state.user.user
    const taskList = []
    const pageable = new Pageable(
      route.params.page * 1 || 0,
      16,
      "createDate,desc"
    )
    taskList.push(
      $axios.get(`/user/get`, {
        params: { id: route.params.userId || myself.id }
      })
    )
    taskList.push(
      $axios.get(`/collection/paging`, {
        params: Object.assign(
          {
            targetId: route.params.userId || store.state.user.user.id
          },
          pageable
        )
      })
    )
    const resultList = (await Promise.all(taskList)).map((item) => item.data)
    if (resultList[0].status === 401) {
      redirect(`/login?r=${route.fullPath}`)
      return
    }
    const user = resultList[0].data
    const page = resultList[1].data
    if (myself.id === user.id) {
      store.commit("menu/MChangeName", "collection")
    } else {
      store.commit("menu/MChangeName", "")
    }
    return {
      user,
      pageable,
      page,
      list: page.content
    }
  },
  head() {
    const title = this.self ? "我收藏的插画" : this.user.name + "收藏的插画"
    return { title: title + " - Secdra" }
  },
  methods: {
    ...mapActions("draw", ["APagingCollection", "ACollection"]),
    async paging() {
      if (this.pageLoading || this.page.last) {
        return
      }
      const sourcePage = ++this.pageable.page
      this.pageLoading = true
      const result = await this.APagingCollection(
        Object.assign(
          {
            targetId: this.$route.params.userId || this.user.id
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
@import "../../../assets/style/color";
@import "../../../assets/style/config";
@import "../../../assets/style/mixin";
</style>
