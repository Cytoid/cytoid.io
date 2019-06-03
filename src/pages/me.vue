<template lang="pug">
  .section: .container: .columns
    .column.is-one-quarter
      aside.menu
        p.menu-label General
        ul.menu-list
          li: nuxt-link(:to="{name: 'me-account'}")
            font-awesome-icon(icon="user-alt")
            | Account
          li: a
            font-awesome-icon(icon="lock")
            | Security
          li: a
            font-awesome-icon(icon="address-card")
            | Profile
          li: a
            font-awesome-icon(icon="user-friends")
            | Friends
        p.menu-label My Content
        ul.menu-list
          li: a
            font-awesome-icon(icon="dice-d6")
            | Levels
          li: a
            font-awesome-icon(icon="archive")
            | Collections
          li: nuxt-link(:to="{name: 'me-upload'}")
            font-awesome-icon(icon="cloud-upload-alt")
            | Upload
    .column: nuxt
</template>

<script>
export default {
  middleware: 'auth'
}
</script>

<style scoped>
.svg-inline--fa {
  margin-right: 1rem;
}
</style>
