<template lang="pug">
  .section: .container: .columns
    .column.is-one-quarter
      aside.menu
        ul.menu-list
          li: nuxt-link(:to="{name: 'settings-account'}")
            font-awesome-icon(:icon="['fas', 'user-alt']" fixed-width)
            span.menu-text(v-t="'account_menu'")
          li: nuxt-link(:to="{name: 'settings-security'}")
            font-awesome-icon(:icon="['fas', 'lock']" fixed-width)
            span.menu-text(v-t="'security_menu'")
          li: nuxt-link(:to="{name: 'settings-profile'}")
            font-awesome-icon(:icon="['fas', 'address-card']" fixed-width)
            span.menu-text(v-t="'profile_menu'")
          li: nuxt-link(:to="{name: 'settings-sponsorship'}")
            font-awesome-icon(:icon="['fad', 'crown']" fixed-width)
            span.menu-text(v-t="'sponsorship_menu'")
    .column: nuxt
</template>

<script>
export default {
  middleware: 'auth',
  fetch ({ route, redirect }) {
    if (route.fullPath === '/settings') {
      redirect('/settings/account')
    }
  },
  head () {
    return {
      title: this.$t('settings') + ' - Cytoid'
    }
  },
  i18n: {
    key: 'settings'
  }
}
</script>

<style lang="scss" scoped>
.menu-text {
  font-size: 14px;
  font-weight: normal;
  margin-left: 8px;
}
a.is-active .menu-text {
  font-weight: bold;
}
.menu-list {
  li {
    margin-bottom: 8px;
  }
  a {
    padding: 12px 16px;
    color: rgba(255, 255, 255, 0.5);
    background-color: transparent;
    transition: 0.2s $hoverEasing;
  &:hover {
     color: rgba(255, 255, 255, 1);
     background-color: hsla(226, 15%, 19%, 0.3);
   }
  }
  a.is-active {
    color: rgba(255, 255, 255, 1);
    background: linear-gradient(to right, $theme4, $theme5);
    box-shadow: $ele4;
  }
}
</style>
