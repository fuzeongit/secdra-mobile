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
import { PictureForm, Pageable } from "../../../assets/script/model"
import CornerButtons from "../../../components/pages/shared/CornerButtons"
import PictureCardList from "../../../components/pages/shared/PictureCardList"
import { mapActions } from "vuex"

export default {
  components: { CornerButtons, PictureCardList },
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
  watch: {
    selectList(newVal) {
      if (newVal.isEmpty()) {
        this.editShow = false
      }
    }
  },
  async asyncData({ store, redirect, route, $axios }) {
    store.commit("menu/MChangeName", "works")
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
      $axios.get(`/picture/paging`, {
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
      store.commit("menu/MChangeName", "works")
    } else {
      store.commit("menu/MChangeName", "")
    }
    return {
      user,
      pageable,
      page,
      list: page.content,
      selectList: [],
      editShow: false,
      editLoading: false,
      inputTag: "",
      pictureForm: new PictureForm()
    }
  },
  head() {
    const title = this.self ? "我的作品" : this.user.name + "的作品"
    return { title: title + " - Secdra" }
  },
  mounted() {
    this.$tooltip({
      message: `说是作品，其实都是从p站下载的，侵删`
    })
  },
  methods: {
    ...mapActions("picture", ["APaging", "ACollection", "ABatchUpdate"]),
    ...mapActions("user", ["AFollow"]),
    async paging() {
      if (this.pageLoading || this.page.last) {
        return
      }
      const sourcePage = ++this.pageable.page
      this.pageLoading = true
      const result = await this.APaging(
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
@import "../../../assets/style/color";
@import "../../../assets/style/config";
@import "../../../assets/style/mixin";
</style>
