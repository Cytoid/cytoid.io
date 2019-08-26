<template lang="pug">
div
  <!--info-panel(style="margin-bottom: 16px;")-->
  avatar-panel(style="margin-bottom: 16px;")
  emails-panel(style="margin-bottom: 16px;")
</template>

<script>
import EmailsPanel from '@/components/settings/Emails'
import InfoPanel from '@/components/settings/Info'
import AvatarPanel from '@/components/settings/Avatar'
export default {
  components: {
    EmailsPanel,
    InfoPanel,
    AvatarPanel,
  }
}
</script>
