<template lang="pug">
.section
  info(style="margin-bottom: 16px;")
  emails(style="margin-bottom: 16px;")
</template>

<script>
import Emails from '@/components/settings/Emails'
import Info from '@/components/settings/Info'
export default {
  components: {
    Emails,
    Info,
  }
}
</script>
