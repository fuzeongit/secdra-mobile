<template>
  <div class="page">
    <RefreshContent @upLoad="paging" @downLoad="refresh" ref="refresh">
      <DrawList :page="page" :list="list" :pageLoading="pageLoading" @collection="collection"></DrawList>
    </RefreshContent>

    <transition name="zoom" enter-active-class="zoomIn duration" leave-active-class="zoomOut duration">
      <button class="btn is-suspend is-white go-top" v-goTop v-show="showGoTop">
        <i class="icon s-zhiding"></i></button>
    </transition>
  </div>
</template>
<script>
  import config from "../assets/script/config/index";
  import {Pageable} from "../assets/script/model/base";
  import {mapActions} from "vuex"
  import DrawList from "../components/pages/shared/DrawList"
  import RefreshContent from "../components/global/RefreshContent"
  export default {
    components:{
      DrawList,
      RefreshContent
    },
    async asyncData({store, req, redirect, route, $axios}) {
      store.state.menu.name = "find";
      let pageable = new Pageable();
      pageable.size = 16;
      let {data: result} = await $axios.get(`${config.host}/draw/pagingByRecommend`, {
        params: Object.assign({
          tag: route.params.tag
        }, pageable)
      });
      if (result.status !== 200) {
        throw new Error(result.message)
      }
      return {
        page: result.data,
        list: result.data.content,
        pageable
      }
    },
    data() {
      return {
        pageLoading: false,
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
      scrollTop() {
        return this.$store.state.window.scrollTop
      }
    },
    methods: {
      ...mapActions("draw", ["APagingByRecommend", "AListByRecommend", "ACollection"]),
      async refresh(){
        this.pageable = new Pageable();
        this.pageable.size = 16;
        let result = await this.APagingByRecommend(Object.assign({
            tag: this.$route.params.tag
          }, this.pageable)
        );
        this.$refs["refresh"].close();
        let data = result.data;
        if (result.status !== 200) {
          this.$tooltip({message: result.message});
          return
        }
        this.page = data;
        this.list = data.content;
      },

      /**
       * 获取分页数据
       * @returns {Promise<void>}
       */
      async paging() {
        if (this.pageLoading || this.page.last) {
          return
        }
        let sourcePage = ++this.pageable.page;
        this.pageLoading = true;
        let result = await this.APagingByRecommend(Object.assign({
            tag: this.$route.params.tag
          }, this.pageable)
        );
        this.pageLoading = false;
        let data = result.data;
        if (result.status !== 200) {
          this.$tooltip({message: result.message});
          this.pageable.page = sourcePage;
          return
        }
        this.page = data;
        this.list.merge(data.content)
      },
      async listByRecommend(index) {
        let result = await this.AListByRecommend();
        result.data.reverse();
        for (let item of  result.data) {
          this.list.splice(index + 1, 0, item);
        }
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
        if (draw.focus) {
          this.listByRecommend(index)
        }
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../assets/style/color";
  @import "../assets/style/config";
  @import "../assets/style/mixin";

  .page{
    height: @page-height;
  }
</style>
