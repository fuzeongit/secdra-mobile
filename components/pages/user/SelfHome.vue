<template>
  <div class="self-home">
    <div class="user-bk cover"
         :style="{backgroundImage: `url(${$img.back(user.background)})`}">
    </div>
    <div class="info-box">
      <img :src="$img.head(user.head)" class="head">
      <Btn color="primary" @click="isShowEdit=true" class="edit">
        编辑
      </Btn>
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
            <nuxt-link class="col-15 img-box center" :to="`/draw/${draw.id}`" v-for="(draw,index) in worksList"
                       :key="index" v-ripple>
              <img v-lazy:background-image="$img.secdra(draw.url,'specifiedWidth')" class="cover">
            </nuxt-link>
          </div>
          <p class="move" v-if="worksList.length===8">
            <Btn round flat small color="primary" :to="`/works/${user.id||''}`">查看更多>></Btn>
          </p>
        </div>
        <div class="collection-box" v-loading="collectionLoading">
          <h3 class="line center">
            <span>我的收藏</span>
          </h3>
          <div class="row">
            <nuxt-link class="col-15 img-box center" :to="`/draw/${draw.id}`" v-for="(draw,index) in collectionList"
                       :key="index" v-ripple>
              <img v-lazy:background-image="$img.secdra(draw.url,'specifiedWidth')" class="cover">
            </nuxt-link>
          </div>
          <p class="move" v-if="collectionList.length===8">
            <Btn round flat small color="primary" :to="`/collection/${user.id||''}`">查看更多>></Btn>
          </p>
        </div>
      </div>
    </div>
    <Model v-model="isShowEdit" v-loading="editLoading">
      <div class="edit-model" v-swipe:swipedown="()=>{this.isShowEdit=false}">
        <header class="edit-header">
          <nav class="row">
            <div class="col-3 center">
              <Btn small icon flat @click="isShowEdit = false"><i class="icon s-fanhui"></i></Btn>
            </div>
            <div class="col-18 center title">
              编辑
            </div>
          </nav>
        </header>
        <div class="form">
          <div class="input-group">
            <h5 class="sub-name">名称：</h5>
            <input type="text" v-model="userForm.name" class="input block primary-color">
          </div>
          <div class="input-group">
            <h5 class="sub-name">简介：</h5>
            <textarea v-model="userForm.introduction" class="input block primary-color" rows="5"></textarea>
          </div>
          <div class="input-group">
            <h5 class="sub-name">性别：</h5>
            <RadioGroup v-model="userForm.gender">
              <Radio value="MALE" label="男孩" color="primary"></Radio>
              <Radio value="FEMALE" label="女孩" color="primary" style="margin-left: 2vw"></Radio>
            </RadioGroup>
          </div>
          <div class="input-group">
            <Btn block color="primary" @click="update">保存</Btn>
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

  .self-home {
    background-color: @page-background-color;
    padding-bottom: 5vw
  }

  .user-bk {
    width: 100vw;
    height: 50vw;
  }

  .info-box {
    @img-size: 30vw;
    margin-top: -(@img-size/2);
    padding: 0 4vw;
    .head {
      height: @img-size;
      width: @img-size;
      border-radius: 50%;
      border: .8vw solid white;
    }
    .edit {
      margin-top: @img-size * 2 / 3;
      float: right;
    }
    .nickname {
      font-size: @big-font-size;
      margin-top: 4vw;
      font-weight: 600;
      text-align: center;
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
        background-color: @page-background-color;
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
      margin: 2vw 0;
      text-align: right;
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
      .card-box-shadow()
    }
  }

  .edit-model {
    min-height: 100%;
    background-color: @page-background-color;
    .edit-header {
      width: 100%;
      height: @herder-height;
      font-size: @big-font-size;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      box-shadow: @herder-box-shadow;
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
          color: white;
        }
        .title {
          color: white;
        }
      }
    }

    .form {
      padding: (5vw + @herder-height) 5vw 5vw 5vw;
      .sub-name {
        font-size: @small-font-size;
        color: #999;
      }
    }
  }
</style>
