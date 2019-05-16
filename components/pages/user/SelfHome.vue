<template>
  <div style="padding-bottom: 5vw">
    <div class="user-bk cover"
         :style="{backgroundImage: `url(${$img.back(user.background)})`}">
    </div>
    <div class="info-box">
      <img :src="$img.head(user.head)">
      <button class="btn is-plain edit" @click="isShowEdit=true">编辑</button>
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
            <span>我的作品</span>
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
            <span>我的收藏</span>
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
    <Model v-model="isShowEdit" v-loading="editLoading">
      <div class="edit-model" v-swipe:swipedown="()=>{this.isShowEdit=false}">
        <header class="edit-header">
          <nav class="row">
            <div class="col-3 center">
              <a class="icon s-fanhui" @click="isShowEdit = false"></a>
            </div>
            <div class="col-18 center title">
              编辑
            </div>
          </nav>
        </header>
        <div class="form">
          <div class="input-group">
            <h5 class="sub-name">名称：</h5>
            <input type="text" title="name" v-model="userForm.name" class="input block big">
          </div>
          <div class="input-group">
            <h5 class="sub-name">简介：</h5>
            <textarea v-model="userForm.introduction" class="input block" title="introduction" rows="5"></textarea>
          </div>
          <div class="input-group">
            <h5 class="sub-name">性别：</h5>
            <RadioGroup v-model="userForm.gender">
              <Radio value="MALE" label="男孩"></Radio>
              <Radio value="FEMALE" label="女孩" style="margin-left: 2vw"></Radio>
            </RadioGroup>
          </div>
          <div class="input-group">
            <button class="btn block big" @click="update">保存</button>
          </div>
        </div>
      </div>
    </Model>
  </div>
</template>

<script>
  import {mapState, mapMutations, mapActions} from "vuex"
  import {Pageable} from "../../../assets/script/model/base";
  import Model from "../../global/Model"

  export default {
    components: {
      Model
    },
    data() {
      return {
        worksLoading: false,
        worksList: [],
        collectionLoading: false,
        collectionList: [],
        isShowEdit: false,
        userForm: Object.assign({}, this.$store.state.user.user), //需要脱离vuex
        editLoading: false
      }
    },
    computed: {
      ...mapState('user', ['user'])
    },
    mounted() {
      this.pagingWorks();
      this.pagingCollection();
    },
    methods: {
      ...mapMutations("user", ["MSetUserInfo"]),
      ...mapActions("user", ["AUpdate"]),
      ...mapActions("draw", ["APagingCollection", "APagingByUserId"]),
      async pagingWorks() {
        this.worksLoading = true;
        let result = await this.APagingByUserId(new Pageable(0, 8, "createDate,desc"));
        if (result.status !== 200) {
          this.$tooltip({message: result.message});
          return
        }
        this.worksLoading = false;
        this.worksList = result.data.content;
      },
      async pagingCollection() {
        this.collectionLoading = true;
        let result = await this.APagingCollection(new Pageable(0, 8, "createDate,desc"));
        if (result.status !== 200) {
          this.$tooltip({message: result.message});
          return
        }
        this.collectionLoading = false;
        this.collectionList = result.data.content;
      },
      async update() {
        this.editLoading = true;
        let result = await this.AUpdate(this.userForm);
        this.editLoading = false;
        if (result.status !== 200) {
          this.$tooltip({message: result.message});
          return
        }
        this.isShowEdit = false;
        this.$tooltip({message: `修改成功`});
        this.MSetUserInfo(result.data);
        this.userForm = Object.assign({}, this.user);
      }
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
    .edit {
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

  .edit-model {
    .edit-header {
      width: 100%;
      height: @herder-height;
      font-size: @big-font-size;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      box-shadow: 0 0 4px rgba(202, 202, 202, 0.55);
      border-bottom: 1px solid @font-color-dark-line;
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
        .title {
          color: @white;
        }
      }
    }

    .form {
      margin-top: @herder-height;
      padding: 5vw;
      .sub-name {
        font-size: @small-font-size;
        color: #999;
      }
    }
  }
</style>
