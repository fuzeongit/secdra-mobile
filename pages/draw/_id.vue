<template>
  <div class="page">
    <div class="img-box" :style="{height:`${100 * proportion}vw`} ">
      <img :src="$img.secdra(draw.url,`specifiedWidth500`)">
    </div>
    <template v-if="draw.user.id!==user.id">
      <div class="flex-box user-info-box">
        <nuxt-link :to="`/user/${draw.user.id}`" class="head-box" v-ripple>
          <img :src="$img.head(draw.user.head)" :title="draw.user.name">
        </nuxt-link>
        <nuxt-link :to="`/user/${draw.user.id}`" class="nickname primary-hover">
          {{draw.user.name}}
        </nuxt-link>
        <div class="following-btn-box">
          <Btn block color="primary" @click="follow(draw.user.id)">
            {{draw.user.focus?`已关注`:`关注`}}
          </Btn>
        </div>
      </div>
      <div class="line"></div>
    </template>
    <div class="info-box">
      <h3 class="name"><strong>{{draw.name}}</strong></h3>
      <p class="introduction">{{draw.introduction}}</p>
      <div class="row">
        <div class="col-15">
          <Btn flat icon small title="浏览">
            <i class="icon s-eye"></i>
          </Btn>
          <span>{{draw.viewAmount}}</span>
        </div>
        <div class="col-15">
          <Btn flat icon small :color="draw.focus?`primary`:`default`" @click="collection(draw)" title="收藏">
            <i class="icon" :class="{'s-heart':draw.focus,'s-hearto':!draw.focus}"></i>
          </Btn>
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
        <Btn outline small color="primary" :to="`/draw/search/${tag.name}`" v-for="tag in draw.tagList">
          {{tag.name}}
        </Btn>
      </div>
    </div>
    <template>
      <Btn icon big shadow color="white" class="tool-btn" v-if="draw.user.id===user.id" @click="isShowEdit = true">
        <i class="icon s-bianji"></i>
      </Btn>
      <Btn icon big shadow color="white" class="tool-btn" v-else @click="collection(draw)">
        <i class="icon" :class="{'s-heart':draw.focus,'s-hearto':!draw.focus,'primary-text':draw.focus}"></i>
      </Btn>
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
            <input type="text" v-model="drawForm.name" class="input block  primary-color">
          </div>
          <div class="input-group">
            <h5 class="sub-name">简介：</h5>
            <textarea v-model="drawForm.introduction" class="input block  primary-color" rows="5"></textarea>
          </div>
          <div class="input-group">
            <h5 class="sub-name">私密：</h5>
            <RadioGroup v-model="drawForm.isPrivate">
              <Radio :value="true" label="隐藏" color="primary"></Radio>
              <Radio :value="false" label="显示" style="margin-left: 2vw" color="primary"></Radio>
            </RadioGroup>
          </div>
          <div class="input-group">
            <h5 class="sub-name">标签：</h5>
            <div class="row">
              <div class="col-25">
                <input type="text" title="name" v-model="inputTag" class="input block primary-color">
              </div>
              <div class="col-5 center" style="line-height: 10vw;" >
                <Btn small icon flat color="primary" @click="addTag">
                  <i class="icon s-zengjiaxinjian color"></i>
                </Btn>
              </div>
            </div>
          </div>
          <div style="margin-bottom: 2vw">
            <Tag small color="primary" v-for="(tagName,index) in drawForm.tagList" @close="removeTag" :content="tagName" :key="tagName"
                 :value="index"></Tag>
          </div>
          <div class="row">
            <div class="col-15" style="padding-right: 2vw">
              <Btn block color="primary" @click="save">保存</Btn>
            </div>
            <div class="col-15" style="padding-left: 2vw">
              <Btn block outline color="primary" @click="reset">重置</Btn>
            </div>
          </div>
        </div>
      </div>
    </Model>
  </div>
</template>
<script>
  import {mapActions, mapState} from "vuex"
  import Model from "../../components/global/Model"
  import Tag from "../../components/global/Tag"

  export default {
    components: {
      Model,
      Tag
    },
    async asyncData({store, req, redirect, route, $axios}) {
      store.commit('menu/MChangeName', "detail");
      let id = route.params.id;
      let res = await $axios.get(`/draw/get`, {
        params: {id}
      });
      let result = res.data;
      if (result.status !== 200) {
        throw new Error(result.message)
      }
      store.commit('menu/MChangeTitle', result.data.name);
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
      ...mapState("user", ["user"]),
      proportion() {
        return this.draw.height / this.draw.width
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
          followingId: id
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
    width: calc(100% - 4vw - 4vw);
    height: 1px;
    border-bottom: 1px dashed @font-color-dark-line;
    margin: 0 4vw;
  }

  .page {
    min-height: 100vh;
    margin-top: 0;
    background-color: @page-background-color;
    .img-box {
      background-color: @theme-background-color;
      width: 100vw;
      img {
        width: 100%;
      }
    }
    .user-info-box {
      @info-box-height: 14vw;
      @padding-size: 4vw;
      @img-size: @info-box-height - @padding-size;
      @follow-btn-size: 20vw;
      padding: @padding-size;
      .head-box {
        display: block;
        position: relative;
        border-radius: 50%;
        img {
          border-radius: 50%;
          width: @img-size;
          height: @img-size;
        }
      }
      .nickname {
        width: calc(100% - @img-size - @follow-btn-size);
        padding: 0 6vw;
        text-align: left;
        .ellipsis();
      }
      .following-btn-box {
        width: @follow-btn-size;
        .btn {
          padding: 0;
          text-align: center;
        }
      }
    }
    .info-box {
      @padding-size: 4vw;
      padding: @padding-size;
      .name {
        .ellipsis()
      }
      .introduction {
        margin-top: 2vw;
        font-size: @small-font-size;
        color: @font-color-dark-fade;
      }
      .row {
        margin-top: 2vw;
        font-size: @small-font-size;
        color: @font-color-dark-fade;
        span {
          margin-left: 2vw;
          vertical-align: baseline;
        }
      }
      .date {
        margin-top: 2vw;
      }
    }
    .tag-list {
      @spacing: 2vw;
      margin-bottom: -@spacing;
      .btn {
        margin-right: @spacing;
        margin-bottom: @spacing;
      }
    }
    .tag-box {
      padding: 4vw;
    }
    .tool-btn {
      position: fixed;
      right: 4vw;
      bottom: 4vw;
      &.s-hearto {
        color: white
      }
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
