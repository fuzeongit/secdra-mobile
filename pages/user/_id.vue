<template>
  <div class="page">
    <SelfHome v-if="isSelf"></SelfHome>
    <OtherHome v-else :user="user" @follow="follow"></OtherHome>
    <transition name="zoom" enter-active-class="zoomIn duration" leave-active-class="zoomOut duration">
      <button class="btn is-suspend go-top" v-goTop v-show="showGoTop">
        <i class="icon s-zhiding"></i></button>
    </transition>
  </div>
</template>

<script>
  import config from "../../assets/js/config";
  import SelfHome from "../../components/pages/user/SelfHome";
  import OtherHome from "../../components/pages/user/OtherHome";
  import {mapActions} from "vuex"

  export default {
    components: {
      SelfHome,
      OtherHome
    },
    //在这里不能使用httpUtil
    //并且嵌套层数超过不知道多少会报错-->坑死我了
    async asyncData({store, req, redirect, route, $axios}) {
      store.state.menu.name = "detail";
      let taskList = [];
      taskList.push($axios.get(`${config.host}/user/getInfo`, {params: {id: route.params.id}}));
      if (store.state.user.user.id === route.params.id) {
        taskList.push($axios.get(`${config.host}/qiniu/getUploadToken`));
      }
      let resultList = (await Promise.all(taskList)).map(item => item.data);

      if (resultList[0].status !== 200) {
        redirect(`/user/${store.state.user.user.id}`)
      }
      let user = resultList[0].data;

      if (store.state.user.user.id === user.id) {
        store.state.user.user = user;
        store.state.user.uploadToken = resultList[1].data;
        store.state.menu.title = user.name;
      } else {
        store.state.menu.name = "";
      }
      return {
        user
      }
    },
    data() {
      return {
        showGoTop: false
      }
    },
    watch: {
      /**
       * 如果直接用计算属性计算showGoTop的话，
       * 可能会导致渲染过度，导致页面卡顿
       */
      scrollTop(newVal, oldVal) {
        let threshold = 150;
        if (newVal > threshold && oldVal <= threshold) {
          this.showGoTop = true
        } else if (newVal <= threshold && oldVal > threshold) {
          this.showGoTop = false
        }
      }
    },
    computed: {
      isSelf() {
        return this.$store.state.user.user.id === this.$route.params.id
      },
      scrollTop() {
        return this.$store.state.window.scrollTop || 0
      }
    },
    methods: {
      ...mapActions("user", ["AFollow"]),
      async follow() {
        let result = await this.AFollow({
          followerId: this.user.id
        });
        if (result.status !== 200) {
          this.$notify({message: result.message});
          return
        }
        this.user.focus = result.data
      },
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
  }
  .go-top {
    position: fixed;
    right: 20px;
    bottom: 20px;
  }
</style>
