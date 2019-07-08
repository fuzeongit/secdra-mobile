<template>
  <div class="page">
    <DrawCardList :list="list" @collection="collection" :isSelf="isSelf"></DrawCardList>
    <br>
    <Pageable :totalPage="page.totalPages" :currPage="pageable.page" @go="paging"></Pageable>
    <br>
    <transition name="zoom" enter-active-class="zoomIn duration" leave-active-class="zoomOut duration">
      <Btn icon big shadow v-goTop v-show="showGoTop" class="go-top">
        <i class="icon s-up"></i>
      </Btn>
    </transition>
  </div>
</template>
<script>
  import {Pageable} from "../../../assets/script/model/base";
  import DrawCardList from "../../../components/pages/shared/DrawCardList";
  import {mapActions, mapState} from "vuex"

  export default {
    async asyncData({store, req, redirect, route, $axios}) {
      store.commit('menu/MChangeName', "works");
      let pageable = new Pageable();
      pageable.size = 16;
      pageable.page = route.params.page * 1 || 0;
      pageable.sort = "createDate,desc";
      let {data: result} = await $axios.get(`/draw/pagingByUserId`, {
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
    components: {
      DrawCardList
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
        return this.$store.state.user.user.id === this.$route.params.userId
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
