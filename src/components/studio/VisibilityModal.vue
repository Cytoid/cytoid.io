<i18n locale="en" src="@/locale/en/studio.json" />
<i18n locale="zh-cn" src="@/locale/zh-CN/studio.json" />
<i18n locale="zh-tw" src="@/locale/zh-TW/studio.json" />

<template lang="pug">
a-modal(
  :title="title"
  v-model="modalVisible"
  v-if="level && modalVisible"
  :closable="false"
)
  template(v-if="value === 2")
    p(v-t="'level_visibility_public_title'")
    i18n(path="level_visibility_public_content" tag="p")
      nuxt-link(:to="{ name: 'legal-id', params: { id: 'terms' } }" v-t="'tos'")
      nuxt-link(:to="{ name: 'legal-id', params: { id: 'dmca' } }" v-t="'dmca'")
  template(v-if="value === 1")
    p(v-t="'level_visibility_unlisted_title'")
    i18n(path="level_visibility_unlisted_content" tag="p")
      b(v-text="level.title")
  template(v-if="value === 0")
    p(v-t="'level_visibility_private_title'")
    i18n(path="level_visibility_private_content" tag="p")
      b(v-text="level.title")
  i18n(path="level_visibility_content" tag="p")
    b(v-text="level.uid" style="color: red;")
  action-confirm(
    slot="footer"
    :value="level.uid"
    :button-title="this.$t(['visibility_action_private', 'visibility_action_unlist', 'visibility_action_publish'][value])"
    :button-type="['danger', 'dashed', 'primary'][value]"
    @click="submit"
    :loading="loading"
  )
</template>

<script>
import ActionConfirm from './ActionConfirm'
export default {
  name: 'VisibilityModal',
  components: { ActionConfirm },
  data: () => ({
    modalVisible: false,
    level: null,
    value: null,
    loading: false,
  }),
  computed: {
    title() {
      const title = this.level.title
      return this.$t([
        'level_visibility_title_private',
        'level_visibility_title_unlisted',
        'level_visibility_title_public'
      ][this.value], title)
    },
  },
  methods: {
    show(level, visibility) {
      this.level = level
      this.value = [false, null, true].indexOf(visibility)
      this.modalVisible = true
    },
    submit() {
      this.$emit('change', [this.level, [false, null, true][this.value]])
    },
  },
}
</script>
