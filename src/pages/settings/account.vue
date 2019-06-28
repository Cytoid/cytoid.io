<template lang="pug">
.section
  info(style="margin-bottom: 16px;")
  avatar(style="margin-bottom: 16px;")
  emails(style="margin-bottom: 16px;")
</template>

<script>
import Emails from '@/components/settings/Emails'
import Info from '@/components/settings/Info'
import Avatar from '@/components/settings/Avatar'
export default {
  components: {
    Emails,
    Info,
    Avatar,
  }
}
</script>
