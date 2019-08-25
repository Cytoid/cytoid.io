<template lang="pug">
  .section: .container: .columns
    .column.is-one-quarter
      aside.menu
        p.menu-label General
        ul.menu-list
          li: nuxt-link(:to="{name: 'settings-account'}")
            font-awesome-icon(icon="user-alt" fixed-width)
            | Account
          li: nuxt-link(:to="{name: 'settings-security'}")
            font-awesome-icon(icon="lock" fixed-width)
            | Security
          li: nuxt-link(:to="{name: 'settings-profile'}")
            font-awesome-icon(icon="address-card" fixed-width)
            | Profile
    .column: nuxt
</template>

<script>
export default {
  middleware: 'auth',
  fetch({ route, redirect }) {
    if (route.fullPath === '/settings') {
      redirect('/settings/account')
    }
  },
  head() {
    return {
      title: 'Settings - Cytoid'
    }
  },
}
</script>

<style scoped>
.svg-inline--fa {
  margin-right: 1rem;
}
</style>
