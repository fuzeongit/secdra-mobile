<template>
  <section class="container bk cover">
    <form @submit.prevent="login" class="card">
      <nuxt-link to="/" replace>
        <img src="../assets/image/svg/logo.svg" />
      </nuxt-link>
      <p class="sub-logo">想你所想</p>
      <div class="input-group">
        <Field
          v-model="form.phone"
          block
          color="primary"
          placeholder="手机号码"
        ></Field>
      </div>
      <div class="input-group">
        <Field
          v-model="form.password"
          block
          color="primary"
          placeholder="密码"
          type="password"
        ></Field>
      </div>
      <div class="input-group center">
        <Btn :disabled="loginLoading" block color="primary" type="submit">{{
          !loginLoading ? `登录` : `登录中...`
        }}</Btn>
      </div>
    </form>
    <p class="center" style="position: fixed;bottom: 6vw">
      <span> © 2018-2019</span>
      <a href="http://www.miitbeian.gov.cn/" target="_blank"
        >粤ICP备18144953号-1</a
      >
    </p>
  </section>
</template>

<script>
import { mapActions, mapMutations } from "vuex"

const layout = "login"
export default {
  name: "Login",
  layout,
  head() {
    return { title: "登录 - Secdra" }
  },
  data() {
    return {
      loginLoading: false,
      form: {
        phone: "",
        password: ""
      },
      r: this.$route.query.r || "/"
    }
  },
  mounted() {
    if (this.$root.layoutName === layout) {
      this.MSetUserInfo({})
      this.$confirm({
        message: `暂时不开放注册，是否随机账号登录`,
        okCallback: (_) => {
          this.form.phone = Math.floor(Math.random() * 50).toString()
          this.login()
        }
      })
    }
  },
  methods: {
    ...mapMutations("user", ["MSetUserInfo"]),
    ...mapActions("user", ["ASignIn", "ASignUp", "AGet"]),
    async login() {
      const phone = this.form.phone
      const password = this.form.password || "123456"
      this.loginLoading = true
      const result = await this.ASignIn({ phone, password })
      if (result.status === 200) {
        this.$router.replace(this.r)
      } else {
        this.loginLoading = false
        this.$tooltip({ message: result.message })
      }
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
@import "../assets/style/color";
@import "../assets/style/config";

.bk {
  background-image: url("../assets/image/bk/login-bk.png");
  /*background-image: url("http://ph9jy186h.bkt.clouddn.com/58562464_p0.png");*/
}

.card {
  img {
    width: 60vw;
  }
  padding: 10vw 6vw;
  position: relative;
  background-size: cover;
  background: rgba(255, 255, 255, 0.92) center top;
}

.sub-logo {
  margin-bottom: 10vw;
  font-size: @small-font-size;
}
</style>
