<template>
  <div class="page">
    <DrawCardList :list="list" @collection="collection" :isSelf="isSelf"></DrawCardList>
    <br>
    <Pageable :totalPage="page.totalPages" :currPage="pageable.page" @go="paging"></Pageable>
    <br>
    <transition name="zoom" enter-active-class="zoomIn duration" leave-active-class="zoomOut duration">
      <button class="btn is-suspend is-white go-top" v-goTop v-show="showGoTop">
        <i class="icon s-up"></i></button>
    </transition>
  </div>
</template>
<script>
  import config from "../../../assets/script/config";
  import {Pageable} from "../../../assets/script/model/base";
  import DrawCardList from "../../../components/pages/shared/DrawCardList";
  import {mapActions} from "vuex"

  export default {
    async asyncData({store, req, redirect, route, $axios}) {
      store.state.menu.name = "works";
      let pageable = new Pageable();
      pageable.size = 16;
      pageable.page = route.params.page * 1 || 0;
      pageable.sort = "createDate,desc";
      let {data: result} = await $axios.get(`${config.host}/draw/pagingByUserId`, {
        params: Object.assign({
          id: route.params.userId
        }, pageable)
      });
      if (result.status !== 200) {
        throw new Error(result.message)
      }
      return {
        pageable,
        page: result.data,
        list: result.data.content,
      }
    },
    components:{
      DrawCardList
    },
    data(){
      return {
        showGoTop: false
      }
    },
    watch:{
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
        return this.$store.state.user.user.id === this.$route.params.userId
      },
      scrollTop() {
        return this.$store.state.window.scrollTop
      }
    },
    methods: {
      ...mapActions("draw", ["ACollection", "ABatchUpdate"]),
      ...mapActions("user", ["AFollow"]),
      paging(page) {
        this.$router.push(`/works/${this.$route.params.userId}/${page}`);
      },
      async collection(draw, index) {
        let result = await this.ACollection({
          drawId: draw.id
        });
        if (result.status !== 200) {
          this.$tooltip({message: result.message});
          return
        }
        draw.focus = result.data;
      },
      async follow(id) {
        let result = await this.AFollow({
          followingId: id
        });
        if (result.status !== 200) {
          this.$tooltip({message: result.message});
          return
        }
        for (let draw of this.list) {
          if (draw.user.id === id) {
            draw.user.focus = result.data
          }
        }
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../../assets/style/color";
  @import "../../../assets/style/config";
  @import "../../../assets/style/mixin";
</style>
