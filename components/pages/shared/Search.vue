<template>
  <Model v-model="isShow">
    <header>
      <nav class="row">
        <div class="col-3 center" @click="close">
          <i class="icon s-fanhui" ></i>
        </div>
        <div class="col-24 center search-box">
          <input type="text" title="search" class="input" v-model="tag"
                 placeholder="输入标签搜索" ref="search">
        </div>
        <div class="col-3 center" @click="search()">
          <i class="icon s-chaxun" ></i>
        </div>
      </nav>
    </header>
    <div class="page" v-swipe:swipedown="close">
      <button v-for="item in tagList" class="btn" style="margin: 2vw 2vw 0 2vw;" @click="search(item.name)">{{item.name}}</button>
    </div>
  </Model>
</template>

<script>
  import {mapActions} from "vuex"
  import Model from "../../global/Model"

  export default {
    componentName: "Search",
    components:{
      Model
    },
    data() {
      return {
        tag: "",
        tagList:[]
      }
    },
    watch: {
      "$store.state.menu.searchIsShow": function (val) {
        if (val) {
          this.$refs["search"].focus()
        }
      }
    },
    computed: {
      isShow: {
        get() {
          return this.$store.state.menu.searchIsShow
        },
        set(val) {
          this.$store.state.menu.searchIsShow = val
        }
      }
    },
    mounted() {
      this.listTagOrderByLikeAmount()
    },
    methods: {
      ...mapActions("draw", ["AListTagOrderByLikeAmount"]),
      close($event) {
        this.isShow = false;
      },
      search(tag) {
        this.close();
        if(tag){
          this.$router.push(`/draw/search/${tag}`)
        }else{
          this.$router.push(`/draw/search/${this.tag}`)
        }

      },
      async listTagOrderByLikeAmount() {
        let result = await this.AListTagOrderByLikeAmount();
        if (result.status !== 200) {
          this.$tooltip({message: result.error});
          return;
        }
        this.tagList = result.data
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../../assets/style/color.less";
  @import "../../../assets/style/config.less";
  @import "../../../assets/style/mixin";

  header {
    width: 100%;
    height: @herder-height;
    font-size: @big-font-size;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    box-shadow: 0 0 4px rgba(202, 202, 202, 0.55);
    border-bottom: 1px solid #e2e2e2;
    background-color: @theme-color;
    z-index: 10;
    user-select: none;
    nav {
      width: 100%;
      margin: 0 auto;
      font-size: 0;
      height: @herder-nav-height;
      line-height: @herder-nav-height;
      .icon {
        font-size: @big-font-size;
        color: @white;
      }
      .search-box {
        padding: 0 30px;
        input {
          width: 100%;
        }
      }
    }
  }
</style>
