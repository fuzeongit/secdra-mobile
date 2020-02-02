<template>
  <div class="page">
    <UserList
      :list="list"
      :page-loading="pageLoading"
      @follow="follow"
      @paging="paging"
    ></UserList>
    <CornerButtons></CornerButtons>
  </div>
</template>

<script>
import { Pageable } from "../../../assets/script/model"
import UserList from "../../../components/pages/shared/UserList"
import CornerButtons from "../../../components/pages/shared/CornerButtons"
import { mapActions } from "vuex"

export default {
  components: { CornerButtons, UserList },
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
  // 在这里不能使用httpUtil
  // 并且嵌套层数超过不知道多少会报错-->坑死我了
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
      $axios.get(`/follower/paging`, {
        params: Object.assign(
          {
            id: route.params.userId
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
      store.commit("menu/MChangeName", "follower")
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
    const title = this.self ? "我的粉丝" : this.user.name + "的粉丝"
    return { title: title + " - Secdra" }
  },
  methods: {
    ...mapActions("user", ["APagingFollower", "AFollow"]),
    async paging() {
      if (this.pageLoading || this.page.last) {
        return
      }
      const sourcePage = ++this.pageable.page
      this.pageLoading = true
      const result = await this.APagingFollower(
        Object.assign(
          {
            id: this.$route.params.userId
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
    async follow(follower) {
      const result = await this.AFollow({
        followingId: follower.id
      })
      if (result.status !== 200) {
        this.$tooltip({ message: result.message })
        return
      }
      follower.focus = result.data
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
@import "../../../assets/style/color";
@import "../../../assets/style/config";
@import "../../../assets/style/mixin";
</style>
