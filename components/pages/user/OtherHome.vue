<template>
  <div style="padding-bottom: 5vw">
    <div class="user-bk cover"
         :style="{backgroundImage: `url(${$img.back(user.background)})`}">
    </div>
    <div class="info-box">
      <img :src="$img.head(user.head)">
      <button class="btn is-plain following"  @click="$emit('follow')">{{user.focus?"已关注":"关注"}}</button>
      <p class="nickname">
        {{user.name}}
        <i class="icon" :class="{'s-xingbie-nv':user.gender==='FEMALE','s-xingbie-nan':user.gender==='MALE'}"></i>
      </p>
      <p class="introduction">
        {{user.introduction}}
      </p>
      <div class="draw-box">
        <div class="works-box" v-loading="worksLoading">
          <h3 class="line center">
            <span>{{user.gender==='FEMALE'?"她":"他"}}的作品</span>
          </h3>
          <div class="row">
            <div class="col-15 img-box center" v-for="(draw,index) in worksList" :key="index">
              <nuxt-link :to="`/draw/${draw.id}`" class="cover"
                         v-lazy:background-image="$img.secdra(draw.url,'specifiedWidth')">
              </nuxt-link>
            </div>
          </div>
          <p class="move" v-if="worksList.length===8">
            <nuxt-link :to="`/works/${user.id||''}`">查看更多>></nuxt-link>
          </p>
        </div>
        <div class="collection-box" v-loading="collectionLoading">
          <h3 class="line center">
            <span>{{user.gender==='FEMALE'?"她":"他"}}的收藏</span>
          </h3>
          <div class="row">
            <div class="col-15 img-box center" v-for="(draw,index) in collectionList" :key="index">
              <nuxt-link :to="`/draw/${draw.id}`" class="cover"
                         v-lazy:background-image="$img.secdra(draw.url,'specifiedWidth')">
              </nuxt-link>
            </div>
          </div>
          <p class="move" v-if="collectionList.length===8">
            <nuxt-link :to="`/collection/${user.id||''}`">查看更多>></nuxt-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapActions} from "vuex"
  import {Pageable} from "../../../assets/script/model/base";

  export default {
    props: ["user"],
    data() {
      return {
        worksLoading: false,
        worksList: [],
        collectionLoading: false,
        collectionList: [],
        followingLoading: false,
        followingList: []
      }
    },
    computed: {
      scrollTop: {
        get() {
          return this.$store.state.window.scrollTop || 0
        },
        set(val) {
          this.$store.state.window.scrollTop = val || 0
        }
      }
    }, mounted() {
      this.pagingWorks();
      this.pagingCollection();
      this.pagingFollowing();
    },
    methods: {
      ...mapActions("user", ["APagingFollowing"]),
      ...mapActions("draw", ["APagingCollection", "APagingByUserId"]),
      async pagingWorks() {
        this.worksLoading = true;
        let result = await this.APagingByUserId(Object.assign(new Pageable(0, 8, "createDate,desc"), {id: this.user.id}));
        if (result.status !== 200) {
          this.$tooltip({message: result.message});
          return
        }
        this.worksLoading = false;
        this.worksList = result.data.content;
      },
      async pagingCollection() {
        this.collectionLoading = true;
        let result = await this.APagingCollection(Object.assign(new Pageable(0, 8, "createDate,desc"), {id: this.user.id}));
        if (result.status !== 200) {
          this.$tooltip({message: result.message});
          return
        }
        this.collectionLoading = false;
        this.collectionList = result.data.content;
      },
      async pagingFollowing() {
        this.followingLoading = true;
        let result = await this.APagingFollowing(Object.assign(new Pageable(0, 8, "createDate,desc"), {id: this.user.id}));
        if (result.status !== 200) {
          this.$tooltip({message: result.message});
          return
        }
        this.followingLoading = false;
        this.followingList = result.data.content;
      },
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../../assets/style/color";
  @import "../../../assets/style/config";
  @import "../../../assets/style/mixin";

  .user-bk {
    width: 100vw;
    height: 50vw;
  }

  .info-box {
    @img-size: 30vw;
    margin-top: -(@img-size/2);
    padding: 0 4vw;
    img {
      height: @img-size;
      width: @img-size;
      border-radius: 50%;
      border: .8vw solid @white;
    }
    .following{
      margin-top: @img-size * 2 / 3;
      float: right;
    }
    .nickname {
      font-size: @big-font-size;
      margin-top: 4vw;
      font-weight: 600;
      .center();
      .ellipsis();
      .icon {
        margin-left: 2vw;
        vertical-align: baseline;
        &.s-xingbie-nv {
          color: #ff74cd;
        }
        &.s-xingbie-nan {
          color: #0b99ff;
        }
      }
    }
    .introduction {
      font-size: @smallest-font-size;
      line-height: 6vw;
      margin-top: 4vw;
      color: @gray;
      padding: 0 12vw;
    }
  }

  .works-box, .collection-box {
    margin-top: 6vw;
    .line {
      width: 100%;
      border-bottom: 1px dashed @font-color-dark-line;
      margin-bottom: 6vw;
      span {
        vertical-align: middle;
        background-color: @white;
        margin-bottom: -4vw;
        display: inline-block;
        padding: 0 3vw;
      }
    }
    .row {
      min-height: 50vw;
      margin: 0 -4vw;
      width: 100vw;
    }

    .move {
      .right();
      a {
        color: @theme-color;
        font-size: @small-font-size;
      }
    }
  }

  .img-box {
    @size: 50vw;
    height: @size;
    position: relative;
    .cover {
      width: 98%;
      height: 98%;
      margin: 1%;
      display: block;
    }
  }

</style>
