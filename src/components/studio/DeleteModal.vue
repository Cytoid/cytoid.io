<i18n locale="en" src="@/locale/en/studio.json" />
<i18n locale="zh-cn" src="@/locale/zh-CN/studio.json" />

<template lang="pug">
  a-modal(
    :title="$t('level_delete_confirm_title', { name: level.title })"
    v-model="modalVisible"
    v-if="level && modalVisible"
    :closable="false"
  )
    i18n(path="level_delete_confirm_content1" tag="p")
      b(v-text="level.title") ({{level.uid}})
    p(v-t="{ path: 'level_delete_confirm_content2', args: { count: level.plays }}")
    i18n(path="level_delete_confirm_content3" tag="p")
      b(v-text="level.uid" style="color: red;")
    action-confirm(
      slot="footer"
      :value="level.uid"
      :button-title="$t('delete_btn')"
      button-type="danger"
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
    loading: false,
  }),
  methods: {
    show(level) {
      this.level = level
      this.modalVisible = true
    },
    submit() {
      this.$emit('change', this.level)
    },
  },
}
</script>
