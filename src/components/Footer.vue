<template lang="pug" functional>
footer.container.footer.has-text-centered
  ul
    li: nuxt-link(:to="{ name: 'legal-id', params: { id: 'dmca' } }") {{parent.$t('dmca')}}
    li: nuxt-link(:to="{ name: 'legal-id', params: { id: 'terms' } }") {{parent.$t('tos')}}
    li: a(href="https://github.com/Cytoid/" v-t="'status'")
    li: a(href="https://github.com/Cytoid/") GitHub
    li
      b-dropdown(
        :value="parent.$store.state.locale"
        position="is-top-right"
        @change="key => parent.$store.commit('setLocale', key)"
      )
        a(slot="trigger")
          font-awesome-icon(icon="language" style="margin-right: 0.5rem;")
          span(v-t="'language'")
        b-dropdown-item(
          v-for="code in props.languages"
          :key="code"
          :value="code"
        ) {{parent.$t('self', code)}}
  p.
    #[strong Cytoid] built by
    #[strong Tiger Tang] and #[strong Zhixing Zhang].
    All rights reserved.
</template>

<script>
import { supportedLanguages } from '@/plugins/i18n'
export default {
  props: {
    languages: {
      required: false,
      type: Array,
      default: () => supportedLanguages
    }
  }
}
</script>

<style lang="scss">
.footer ul li {
  display: inline;
  &:not(:first-child)::before {
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    content: '|';
  }
}
</style>
