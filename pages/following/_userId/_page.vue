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
import { mapActions, mapState } from "vuex"
import { Pageable } from "../../../assets/script/model"
import UserList from "../../../components/pages/shared/UserList"
import CornerButtons from "../../../components/pages/shared/CornerButtons"

export default {
  components: { CornerButtons, UserList },
  data() {
    return {
      pageLoading: false
    }
  },
  computed: {
    ...mapState("user", ["user"])
  },
  // 在这里不能使用httpUtil
  // 并且嵌套层数超过不知道多少会报错-->坑死我了
  async asyncData({ store, req, redirect, route, $axios }) {
    store.commit("menu/MChangeName", "following")
    const pageable = new Pageable(
      route.params.page * 1 || 0,
      10,
      "createDate,desc"
    )
    const { data: result } = await $axios.get(`/following/paging`, {
      params: Object.assign(
        {
          id: route.params.userId
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
  methods: {
    ...mapActions("user", ["APagingFollowing", "AFollow"]),
    async paging() {
      if (this.pageLoading || this.page.last) {
        return
      }
      const sourcePage = ++this.pageable.page
      this.pageLoading = true
      const result = await this.APagingFollowing(
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
