<template>
  <Model v-model="searchShow">
    <header>
      <nav class="flex-text">
        <Btn @click="close" icon flat>
          <i class="icon ali-icon-back"></i>
        </Btn>
        <form @submit.prevent="search()" class="search-box">
          <Field
            ref="search"
            v-model="tag"
            color="primary"
            placeholder="请输入标签搜索"
            big
            block
            not-line
            type="search"
          >
            <Btn slot="right" @click.stop="() => {}" flat icon type="submit">
              <i class="icon ali-icon-search"></i>
            </Btn>
          </Field>
        </form>
      </nav>
    </header>
    <div class="page">
      <div>
        <h6>搜索历史</h6>
        <Tag
          v-for="(item, index) in searchHistoryReverse"
          :key="index"
          :closable="false"
          :content="item"
          @click="search(item)"
          clickable
          round
          class="tag"
        ></Tag>
      </div>

      <div style="margin-top: 5vw">
        <h6>热门推荐</h6>
        <Tag
          v-for="(item, index) in tagList"
          :key="index"
          :closable="false"
          :content="item"
          @click="search(item)"
          clickable
          round
          class="tag"
        ></Tag>
      </div>
    </div>
  </Model>
</template>

<script>
import Model from "../../global/Model"
import storageUtil from "../../../assets/script/util/storageUtil"
import { mapActions, mapMutations } from "vuex"

export default {
  componentName: "Search",
  components: {
    Model
  },
  data() {
    return {
      tag: "",
      tagList: [],
      searchHistory: []
    }
  },
  computed: {
    searchShow: {
      get() {
        return this.$store.state.menu.searchShow
      },
      set(val) {
        this.MChangeSearchShow(val)
      }
    },
    searchHistoryReverse() {
      return this.searchHistory.reverse()
    }
  },
  watch: {
    searchShow(val) {
      if (val) {
        this.$refs.search.triggerFocus()
      }
    }
  },

  mounted() {
    this.listTagTop30()
    this.$nextTick(() => {
      this.searchHistory = storageUtil.localGet("searchHistory", [])
    })
  },
  methods: {
    ...mapMutations("menu", ["MChangeSearchShow"]),
    ...mapActions("picture", ["AListTagTop30"]),
    close() {
      this.MChangeSearchShow(false)
    },
    search(tag = this.tag) {
      this.close()
      if (tag) {
        const searchHistorySet = new Set(this.searchHistory)
        searchHistorySet.delete(tag)
        searchHistorySet.add(tag)
        this.searchHistory = storageUtil.localSet("searchHistory", [
          ...searchHistorySet
        ])
      }
      this.$router.push(`/picture/search/${encodeURIComponent(tag)}`)
    },
    async listTagTop30() {
      const result = await this.AListTagTop30()
      if (result.status !== 200) {
        this.$tooltip({ message: result.error })
        return
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
@padding: 3vw;
header {
  width: 100%;
  height: @herder-height;
  font-size: @big-font-size;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  box-shadow: 0 0 0.2vw 0 rgba(0, 0, 0, 0.2);
  z-index: 10;
  user-select: none;
  nav {
    width: 100%;
    margin: 0 auto;
    font-size: 0;
    height: @herder-height;
    line-height: @herder-height;
    padding: 0 @padding;
    background-color: white;
    .search-box {
      flex: 1;
      height: 100%;
      .input {
        height: 100%;
      }
    }
  }
}

.page {
  padding: 0 @padding;
  overflow: auto;
  h6 {
    margin-top: 2vw;
    font-size: @smallest-font-size;
    color: @font-color-dark-fade;
  }
  .tag {
    margin-right: 1.5vw;
    margin-top: 1.5vw;
  }
}
</style>
