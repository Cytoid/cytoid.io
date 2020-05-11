<template lang="pug">
.modal-card
  header.modal-card-head
    p.modal-card-title(v-t="{ path: 'level_delete_confirm_title', args: { name: level.title } }")
  section.modal-card-body
    i18n(path="level_delete_confirm_content1" tag="p")
      b(v-text="level.title") ({{level.uid}})
    p(v-t="{ path: 'level_delete_confirm_content2', args: { count: level.plays }}")
    i18n(path="level_delete_confirm_content3" tag="p")
      b(v-text="level.uid" style="color: red;")
    action-confirm(
      slot="footer"
      :value="level.uid"
      :button-title="$t('delete_btn')"
      button-type="is-danger"
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
    level: {
      type: Object,
      required: true,
    }
  },
  data: () => ({
    loading: false,
  }),
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
