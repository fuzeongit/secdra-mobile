<template>
  <div class="page">
    <div class="row content">
      <div class="card upload-content">
        <div class="image-box flex-box">
          <div class="upload-box" v-if="!drawUrl">
            <label class="btn">
              上传图片
              <input type="file" style="display: none" @change="upload($event,'button')">
            </label>
          </div>
          <div class="view-box" v-if="drawUrl">
            <label class="flex-box">
              <img :src="drawUrl" :style="{height:proportion>=1?`100%`:`auto`,width:proportion<=1?`100%`:`auto`}">
              <input type="file" style="display: none" @change="upload($event,'button')">
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import config from "../assets/script/config";
  import ioUtil from "../assets/script/util/ioUtil";
  import {mapActions} from "vuex"
    export default {
      async asyncData({store, req, redirect, route, $axios}) {
        store.state.menu.name = "upload";
        let res = await $axios.get(`${config.host}/qiniu/getUploadToken`);
        let result = res.data || {};
        if (result.status !== 200) {
          throw new Error(result)
        }
        store.state.user.uploadToken = result.data;
      },
      data() {
        return {
          drawUrl: "",
          height: 0,
          width: 0,
          file: null,
          inputTag: '',
          form: {
            url: "",
            name: '',
            introduction: '',
            isPrivate: false,
            tagList: [],
          }
        }
      },
    }
</script>

<style type="text/less" lang="less" scoped>
  @import "../assets/style/color";
  @import "../assets/style/config";
  @import "../assets/style/mixin";

  .page {
    .upload-content {
      @size:60vw;
      position: relative;
      width: 92vw;
      margin: 4vw;
      border-radius: @default-border-radius;
      background-color: @white;
      box-shadow: 0 0 50px rgba(150, 150, 150, 0.55);
      overflow: hidden;

      .image-box {
        height: @size;
        width: @size;
        margin: 0 auto;
        .upload-box {
          h3 {
            margin-top: 25px;
            line-height: 35px
          }
          p {
            font-size: @default-font-size;
          }
        }
        .view-box {
          label {
            cursor: pointer;
            width: @size;
            height: @size;
          }
        }
      }
    }
  }
</style>

