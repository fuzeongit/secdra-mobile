<template>
  <div class="page">
    <div style="background-color: #efefef;width: 100vw" :style="{height:`${100 * proportion}vw`} ">
      <img :src="$img.secdra(draw.url,`specifiedWidth500`)" style="width: 100%">
    </div>
    <template v-if="draw.user.id!==user.id">
      <div class="flex-box user-info-box">
        <nuxt-link :to="`/user/${draw.user.id}`" class="head-box">
          <img :src="$img.head(draw.user.head)" :title="draw.user.name">
        </nuxt-link>
        <nuxt-link :to="`/user/${draw.user.id}`" class="nickname">
          {{draw.user.name}}
        </nuxt-link>
        <div class="follower-btn-box">
          <button class="btn block" @click="follow(draw.user.id)">{{draw.user.focus?`已关注`:`关注`}}</button>
        </div>
      </div>
      <div class="line"></div>
    </template>
    <div class="info-box">
      <h3 class="name"><strong>{{draw.name}}</strong></h3>
      <p class="introduction">{{draw.introduction}}</p>
      <div class="row">
        <div class="col-15">
          <i class="icon s-eye"></i>
          <span>{{draw.viewAmount}}</span>
        </div>
        <div class="col-15">
          <i class="icon s-heart"></i>
          <span>{{draw.likeAmount}}</span>
        </div>
      </div>
      <div class="date">
        创建于：{{draw.createDate|date}}
      </div>
    </div>
    <div class="line"></div>
    <div class="tag-box">
      <div class="tag-list">
        <nuxt-link class="btn is-plain" :to="`/draw/search/${tag.name}`" slot="reference" v-for="tag in draw.tagList"
                   :key="tag.id">
          {{tag.name}}
        </nuxt-link>
      </div>
    </div>
    <template>
      <button class="btn is-suspend tool-btn" v-if="draw.user.id===user.id" @click="isShowEdit = true">
        <i class="icon s-bianji"></i></button>
      <button class="btn is-suspend tool-btn" v-else @click="collection(draw)">
        <i class="icon like" :class="{'s-heart':draw.focus,'s-hearto':!draw.focus}"
           :style="{color:draw.focus?`red`:`gray`}"></i></button>
    </template>
    <Model v-model="isShowEdit" v-loading="editLoading">
      <div class="edit-model" v-swipe:swipedown="()=>{this.isShowEdit=false}">
        <header class="edit-header">
          <nav class="row">
            <div class="col-3 center" @click="isShowEdit = false">
              <i class="icon s-fanhui"></i>
            </div>
            <div class="col-18 center title">
              编辑
            </div>
          </nav>
        </header>
        <div class="form">
          <div class="input-group">
            <h5 class="sub-name">名称：</h5>
            <input type="text" title="name" v-model="drawForm.name" class="input block big">
          </div>
          <div class="input-group">
            <h5 class="sub-name">简介：</h5>
            <textarea v-model="drawForm.introduction" class="input block" title="introduction" rows="5"></textarea>
          </div>
          <div class="input-group">
            <h5 class="sub-name">私密：</h5>
            <RadioGroup v-model="drawForm.isPrivate">
              <Radio :value="true" label="隐藏"></Radio>
              <Radio :value="false" label="显示" style="margin-left: 10px"></Radio>
            </RadioGroup>
          </div>
          <div class="input-group">
            <h5 class="sub-name">标签：</h5>
            <div class="row">
              <div class="col-27">
                <input type="text" title="name" v-model="inputTag" class="input block big">
              </div>
              <div class="col-3 center" style="line-height: 10vw;" @click="addTag">
                <i class="icon s-zengjiaxinjian color"></i>
              </div>
            </div>
          </div>
          <div style="margin-bottom: 10px">
            <Tag v-for="(tagName,index) in drawForm.tagList" @close="removeTag" :content="tagName" :key="tagName"
                 :value="index"></Tag>
          </div>
          <div class="row">
            <div class="col-15" style="padding-right: 2vw">
              <button class="btn big block" @click="save">保存</button>
            </div>
            <div class="col-15" style="padding-left: 2vw">
              <button class="btn is-plain big block" @click="reset">重置</button>
            </div>
          </div>
        </div>
      </div>
    </Model>
  </div>
</template>
<script>
  import config from "../../assets/js/config";
  import {mapActions} from "vuex"
  import Model from "../../components/global/Model"
  import Tag from "../../components/global/Tag"

  export default {
    components: {
      Model,
      Tag
    },
    async asyncData({store, req, redirect, route, $axios}) {
      store.state.menu.name = "detail";
      let id = route.params.id;
      let res = await $axios.get(`${config.host}/draw/get`, {
        params: {id}
      });
      let result = res.data;
      if (result.status !== 200) {
        throw new Error(result.message)
      }
      store.state.menu.title = result.data.name;
      let drawForm = Object.assign({}, result.data);
      drawForm.tagList = drawForm.tagList.map(item => item.name);
      drawForm.isPrivate = drawForm.private;
      return {
        draw: result.data,
        drawForm
      }
    },
    data() {
      return {
        isShowEdit: false,
        editLoading: false,
        inputTag: ""
      }
    },
    computed: {
      proportion() {
        return this.draw.height / this.draw.width
      },
      user() {
        return this.$store.state.user.user
      }
    },
    methods: {
      ...mapActions("draw", ["ACollection", "AUpdate"]),
      ...mapActions("user", ["AFollow"]),
      async collection(draw) {
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
          followerId: id
        });
        if (result.status !== 200) {
          this.$tooltip({message: result.message});
          return
        }
        this.draw.user.focus = result.data
      },
      addTag() {
        if (this.inputTag === null || this.inputTag === "") {
          this.inputTag = "";
          return
        }
        if (this.drawForm.tagList.indexOf(this.inputTag) !== -1) {
          this.inputTag = "";
          this.$tooltip({
            message: "不能重复添加"
          });
          return
        }
        this.drawForm.tagList.push(this.inputTag);
        this.inputTag = "";
      },
      removeTag({value}) {
        this.drawForm.tagList.removeIndex(value)
      },
      async save() {
        this.editLoading = true;
        let result = await this.AUpdate(this.drawForm);
        this.editLoading = false;
        if (result.status !== 200) {
          this.$tooltip({message: result.message});
          return
        }
        this.$tooltip({message: `修改成功`});
        this.isShowEdit = false;
        this.draw = result.data;
        this.reset();
      },
      reset() {
        let drawForm = Object.assign({}, this.draw);
        drawForm.tagList = drawForm.tagList.map(item => item.name);
        drawForm.isPrivate = drawForm.private;
        this.drawForm = drawForm
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../assets/style/color";
  @import "../../assets/style/config";
  @import "../../assets/style/mixin";

  .line {
    width: calc(100% - 20px - 20px);
    height: 1px;
    border-bottom: 1px dashed #ccc;
    margin: 0 20px;
  }

  .page {
    min-height: 100vh;
    margin-top: 0;
    .user-info-box {
      @info-box-height: 70px;
      @padding-size: 20px;
      @img-size: @info-box-height - @padding-size;
      @follow-btn-size: 100px;
      padding: @padding-size;
      .head-box {
        display: block;
        position: relative;
        img {
          border-radius: 50%;
          width: @img-size;
          height: @img-size;
        }
      }
      .nickname {
        width: calc(100% - @img-size - @follow-btn-size);
        padding: 0 30px;
        .left();
        .ellipsis();
      }
      .follower-btn-box {
        width: @follow-btn-size;
        .btn {
          padding: 0;
          .center();
        }
      }
    }

    .info-box {
      @padding-size: 20px;
      padding: @padding-size;
      .name {
        .ellipsis()
      }
      .introduction {
        margin-top: 10px;
        font-size: @small-font-size;
        color: @gray;
      }
      .row {
        margin-top: 10px;
        font-size: @small-font-size;
        color: @gray;
        i {
          font-size: @small-font-size;
          color: @gray;
        }
        span {
          margin-left: 10px;
          vertical-align: baseline;
        }
      }
      .date {
        margin-top: 10px;
      }
    }
    .tag-list {
      @spacing: 10px;
      margin-bottom: -@spacing;
      .btn {
        margin-right: @spacing;
        margin-bottom: @spacing;
        line-height: 30px;
        padding: 0 1em;
      }
    }
    .tag-box {
      padding: 20px;
    }
    .tool-btn {
      position: fixed;
      right: 20px;
      bottom: 20px;
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
        .title {
          color: @white;
        }
      }
    }

    .form {
      margin-top: @herder-height;
      padding: 25px;
      .sub-name {
        font-size: @small-font-size;
        color: #999;
      }
    }
  }
</style>
