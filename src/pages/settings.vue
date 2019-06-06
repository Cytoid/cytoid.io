<template lang="pug">
  .section: .container: .columns
    .column.is-one-quarter
      aside.menu
        p.menu-label General
        ul.menu-list
          li: nuxt-link(:to="{name: 'settings-account'}")
            font-awesome-icon(icon="user-alt")
            | Account
          li: nuxt-link(:to="{name: 'settings-security'}")
            font-awesome-icon(icon="lock")
            | Security
          li: nuxt-link(:to="{name: 'settings-profile'}")
            font-awesome-icon(icon="address-card")
            | Profile
          li: a
            font-awesome-icon(icon="user-friends")
            | Friends
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
