<template>
  <div class="page">
    <SelfHome v-if="self"></SelfHome>
    <OtherHome v-else :user="user" @follow="follow"></OtherHome>
    <CornerButtons></CornerButtons>
  </div>
</template>

<script>
import CornerButtons from "../../components/pages/shared/CornerButtons"
import SelfHome from "../../components/pages/user/SelfHome"
import OtherHome from "../../components/pages/user/OtherHome"
import { mapActions, mapMutations } from "vuex"
export default {
  components: { CornerButtons, SelfHome, OtherHome },
  computed: {
    self() {
      return (
        !this.$route.params.id ||
        this.$store.state.user.user.id === this.$route.params.id
      )
    }
  },
  // 在这里不能使用httpUtil
  async asyncData({ store, redirect, route, $axios }) {
    store.commit("menu/MChangeName", "detail")
    const myself = store.state.user.user
    const taskList = []
    taskList.push(
      $axios.get(`/user/get`, {
        params: { id: route.params.id || myself.id }
      })
    )
    if (myself.id && myself.id === route.params.id) {
      taskList.push($axios.get(`/qiniu/getUploadToken`))
    }
    const resultList = (await Promise.all(taskList)).map((item) => item.data)
    if (resultList[0].status === 401) {
      redirect(`/login?r=${route.fullPath}`)
      return
    }
    const user = resultList[0].data
    if (myself.id === user.id) {
      store.commit("user/MSetUserInfo", user)
      store.commit(
        "user/MSetUploadToken",
        resultList[1] ? resultList[1].data : null
      )
    }
    return {
      user
    }
  },
  head() {
    const title = this.self ? "我的个人中心" : this.user.name + "的个人中心"
    this.MChangeTitle(this.user.name)
    return { title: title + " - Secdra" }
  },
  methods: {
    ...mapMutations("menu", ["MChangeTitle"]),
    ...mapActions("user", ["AFollow"]),
    async follow() {
      const result = await this.AFollow({
        followingId: this.user.id
      })
      if (result.status !== 200) {
        this.$tooltip({ message: result.message })
        return
      }
      this.user.focus = result.data
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
@import "../../assets/style/color";
@import "../../assets/style/config";
@import "../../assets/style/mixin";
</style>
