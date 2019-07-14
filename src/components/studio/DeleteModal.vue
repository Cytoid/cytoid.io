<template lang="pug">
  a-modal(
    :title="'Delete ' + level.title"
    v-model="modalVisible"
    v-if="level && modalVisible"
    :closable="false"
  )
    p.
      Are you sure that you want to delete #[b(v-text="level.title")] ({{level.uid}})?
      All records related to this level will be purged from our database,
      including {{level.plays}} playing records.
      Players will see a reduction on their statistics as well.
    p Please input the uid of the level #[b(v-text="level.uid" style="color: red;")] to proceed.
    action-confirm(
      slot="footer"
      :value="level.uid"
      button-title="Delete"
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
