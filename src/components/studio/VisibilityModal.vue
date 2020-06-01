<template lang="pug">
.modal-card
  header.modal-card-head
    p.modal-card-title(v-text="title")
  section.modal-card-body
    template(v-if="value === 'PUBLIC'")
      p(v-t="'level_visibility_public_title'")
      i18n(path="level_visibility_public_content" tag="p")
        nuxt-link(:to="{ name: 'pages-id', params: { id: 'terms' } }") {{$t('tos')}}
        nuxt-link(:to="{ name: 'pages-id', params: { id: 'dmca' } }") {{$t('dmca')}}
    template(v-else-if="value === 'UNLISTED'")
      p(v-t="'level_visibility_unlisted_title'")
      i18n(path="level_visibility_unlisted_content" tag="p")
        b(v-text="level.title")
    template(v-else-if="value === 'PRIVATE'")
      p(v-t="'level_visibility_private_title'")
      i18n(path="level_visibility_private_content" tag="p")
        b(v-text="level.title")
    i18n(path="level_visibility_content" tag="p")
      b(v-text="level.uid" style="color: red;")
    action-confirm(
      slot="footer"
      :value="level.uid"
      :button-title="this.$t({'PRIVATE': 'visibility_action_private', 'UNLISTED': 'visibility_action_unlist', 'PUBLIC': 'visibility_action_publish'}[value])"
      :button-type="{'PRIVATE': 'is-danger', 'UNLISTED': 'is-warning', 'PUBLIC': 'is-success'}[value]"
      @click="submit"
      :loading="loading"
    )
</template>

<script>
import ActionConfirm from './ActionConfirm'
export default {
  name: 'VisibilityModal',
  components: { ActionConfirm },
  props: {
    value: {
      type: String,
      required: true,
    },
    level: {
      type: Object,
      required: true,
    }
  },
  data: () => ({
    loading: false,
  }),
  computed: {
    title() {
      const title = this.level.title
      return this.$t('level_visibility_title_' + this.value.toLowerCase(), { title })
    },
  },
  methods: {
    submit() {
      this.$emit('submit', this)
    },
  },
  i18n: {
    key: 'studio'
  }
}
</script>
