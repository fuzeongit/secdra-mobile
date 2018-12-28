<template>
  <div class="page">
    <div class="user-bk cover"
         :style="{backgroundImage: `url(${$img.back(user.background)})`}">
    </div>
    <div class="info-box">
      <img :src="$img.head(user.head)">
      <p class="nickname">
        {{user.name}}
        <i class="icon" :class="{'s-xingbie-nv':user.gender==='FEMALE','s-xingbie-nan':user.gender==='MALE'}"></i>
      </p>
      <p class="introduction">
        {{user.introduction}}
      </p>
    </div>
  </div>
</template>

<script>
  import {mapActions} from "vuex"
  import {Pageable} from "../../../assets/js/model/base";

  export default {
    props: ["user"],
    data() {
      return {
        worksLoading: false,
        worksList: [],
        collectionLoading: false,
        collectionList: [],
        followerLoading: false,
        followerList: []
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
      this.pagingFollower();
    },
    methods: {
      ...mapActions("user", ["APagingFollower"]),
      ...mapActions("draw", ["APagingCollection", "APagingByUserId"]),
      getProportion(draw) {
        return draw.height / draw.width
      },
      async pagingWorks() {
        this.worksLoading = true;
        let result = await this.APagingByUserId(Object.assign(new Pageable(0, 8, "createDate,desc"), {id: this.user.id}));
        if (result.status !== 200) {
          this.$notify({message: result.message});
          return
        }
        this.worksLoading = false;
        this.worksList = result.data.content;
      },
      async pagingCollection() {
        this.collectionLoading = true;
        let result = await this.APagingCollection(Object.assign(new Pageable(0, 8, "createDate,desc"), {id: this.user.id}));
        if (result.status !== 200) {
          this.$notify({message: result.message});
          return
        }
        this.collectionLoading = false;
        this.collectionList = result.data.content;
      },
      async pagingFollower() {
        this.followerLoading = true;
        let result = await this.APagingFollower(Object.assign(new Pageable(0, 8, "createDate,desc"), {id: this.user.id}));
        if (result.status !== 200) {
          this.$notify({message: result.message});
          return
        }
        this.followerLoading = false;
        this.followerList = result.data.content;
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
    @img-size: 150px;
    margin-top: -(@img-size/2);
    padding: 0 20px;
    .center();
    img {
      height: @img-size;
      width: @img-size;
      border-radius: 50%;
      border: @small-border-radius solid @white;
    }
    .nickname{
      font-size: @big-font-size;
      margin-top: 20px;
      font-weight: 600;
      .center();
      .ellipsis();
      .icon {
        margin-left: 10px;
        vertical-align: baseline;
        &.s-xingbie-nv {
          color: #ff74cd;
        }
        &.s-xingbie-nan {
          color: #0b99ff;
        }
      }
    }
    .introduction{
      font-size: @smallest-font-size;
      line-height: 30px;
      margin-top: 20px;
      color:@gray;
      padding: 0 60px;
    }
  }
</style>
