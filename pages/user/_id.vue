<template>
  <div class="page">
    <SelfHome v-if="isSelf"></SelfHome>
    <OtherHome v-else :user="user" @follow="follow"></OtherHome>
    <transition name="zoom" enter-active-class="zoomIn duration" leave-active-class="zoomOut duration">
      <Btn icon big shadow v-goTop v-show="showGoTop" class="go-top">
        <i class="icon s-up"></i>
      </Btn>
    </transition>
  </div>
</template>

<script>
  import SelfHome from "../../components/pages/user/SelfHome";
  import OtherHome from "../../components/pages/user/OtherHome";
  import {mapActions, mapState} from "vuex"

  export default {
    components: {
      SelfHome,
      OtherHome
    },
    //在这里不能使用httpUtil
    //并且嵌套层数超过不知道多少会报错-->坑死我了
    async asyncData({store, req, redirect, route, $axios}) {
      store.commit('menu/MChangeName', "detail");
      let selfUser = store.state.user.user;
      let taskList = [];
      taskList.push($axios.get(`/user/getInfo`, {params: {id: route.params.id}}));
      if (selfUser.id === route.params.id) {
        taskList.push($axios.get(`/qiniu/getUploadToken`));
      }

      let resultList = (await Promise.all(taskList)).map(item => item.data);
      if (resultList[0].status !== 200) {
        redirect(`/user/${selfUser.id}`)
      }

      let user = resultList[0].data;
      if (selfUser.id === user.id) {
        store.commit('user/MSetUserInfo', user);
        store.commit('user/MSetUploadToken', resultList[1].data);
      }
      store.commit('menu/MChangeTitle', user.name);
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
      ...mapState('window', ['scrollTop']),
      isSelf() {
        return this.$store.state.user.user.id === this.$route.params.id
      }
    },
    methods: {
      ...mapActions("user", ["AFollow"]),
      async follow() {
        let result = await this.AFollow({
          followingId: this.user.id
        });
        if (result.status !== 200) {
          this.$tooltip({message: result.message});
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
</style>
