<template lang="pug" functional>
footer.container.footer.has-text-centered
  ul
    li Terms & Services
    li Status
    li: a(href="https://github.com/Cytoid/" target="_blank") GitHub
    li Glory Wall
    li
      a-dropdown(:trigger="['click']")
        a.ant-dropdown-link
          font-awesome-icon(icon="language")
          | &nbsp
          | Language
        a-menu(
          selectable
          slot="overlay"
          :selectedKeys="[parent.$store.state.locale]"
          @select="({ key }) => parent.$store.commit('setLocale', key)"
        )
          a-menu-item(v-for="code in Object.keys(props.languages)" :key="code") {{props.languages[code]}}
  p.
    #[strong Cytoid] built by
    #[strong Tiger Tang] and #[strong Zhixing Zhang].
    All rights reserved.
</template>

<script>
import { supportedLanguages } from '@/utils/i18n'
export default {
  props: {
    languages: {
      required: false,
      type: Object,
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
