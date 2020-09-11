<template lang="pug">
  div
    .box
      img(:src="require('@/assets/images/patreon.png')" style="width: 150px; display: block; margin-bottom: 1rem;")
      span This Cytoid ID is linked to #[b adldl]
      .level(style="padding: 2rem 0 1rem")
        .level-item.has-text-centered: div
          p.heading Membership Tier
          p.title Coffee Contributor
        .level-item.has-text-centered: div
          p.heading Monthly contribution
          p.title $5
        .level-item.has-text-centered: div
          p.heading Has been a member for
          p.title 5 years
    .box
      img(:src="require('@/assets/images/afdian.png')" style="width: 110px; display: block; margin-bottom: 1rem;")
      span Link your 爱发电 account to claim your deserved membership benefits!
      form(style="padding: 2rem 0 1rem" @submit.prevent="afdianLogin")
        b-field(label="爱发电用户名" horizontal)
          b-input(v-model="afdian.username")
        b-field(label="爱发电密码" horizontal message="您的登陆信息将仅用于验证您的身份。我们不会保存您的密码。")
          b-input(type="password" v-model="afdian.password")
        b-button.is-pulled-right(native-type="submit" :loading="afdianLoading") 链接
        .is-clearfix
</template>

<script>
export default {
  data () {
    return {
      afdian: {
        username: '',
        password: '',
      },
      adfianLoading: false,
    }
  },
  methods: {
    afdianLogin () {
      this.afdianLoading = true
      this.$axios.post('/session/external/afdian', this.afdian)
        .then((user) => {
          console.log(user)
        })
        .catch(err => this.handleErrorToast(err))
        .finally(() => {
          this.afdianLoading = false
        })
    }
  }
}
</script>
