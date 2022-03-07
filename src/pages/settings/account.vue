<template lang="pug">
div
  <!--info-panel(style="margin-bottom: 16px;")-->
  avatar-panel(style="margin-bottom: 16px;" :captchaFunc="getCaptcha")
  emails-panel(style="margin-bottom: 16px;" :captchaFunc="getCaptcha")
  captcha(ref="captcha")
</template>

<script>
import EmailsPanel from '@/components/settings/Emails'
import InfoPanel from '@/components/settings/Info'
import AvatarPanel from '@/components/settings/Avatar'
import Captcha from '@/components/Captcha'
export default {
  components: {
    EmailsPanel,
    InfoPanel,
    AvatarPanel,
    Captcha,
  },
  methods: {
    getCaptcha () {
      return this.$refs.captcha.execute()
    },
  }
}
</script>
