<template lang="pug">
  a-card.ele3
    a-form(:form="form" @submit.prevent="submit")
      p.heading Description
      a-form-item
        client-only: markdown-editor(v-model="form.description")
      p.heading Tags
      a-form-item(:label-col="{ span: 5 }" :wrapper-col="{ span: 19 }")
        tag-input(:value="form.tags" @change="form.tags=$event")
      p.heading Visibility
      a-form-item(
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 19 }"
        :help="visibilityText"
      )
        visibility-select(:value="form.published" bordered @change="form.published=$event")
      a-button.card-button(
        block
        :loading="loading"
        style="margin-top: 2rem;"
        html-type="submit"
        size="large"
      )
        font-awesome-icon(icon="save" fixed-width style="margin-right: 4px;")
        | Save

</template>

<script>
import TagInput from '@/components/TagInput'
import VisibilitySelect from '@/components/studio/VisibilitySelect'
export default {
  name: 'LevelManageListing',
  background: null,
  components: {
    TagInput,
    VisibilitySelect,
  },
  props: {
    value: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      loading: false,
      form: {
        tags: this.value.tags,
        description: this.value.description,
        published: this.value.published,
      },
    }
  },
  computed: {
    visibilityText() {
      const index = [false, null, true].indexOf(this.form.published)
      return [
        'This level will be visible to nobody but you.',
        'This level will only be visible through the URL.',
        'This level will be visible to everybody.'
      ][index]
    }
  },
  methods: {
    submit() {
      this.loading = true
      this.$axios.patch('/levels/' + this.value.uid, this.form)
        .then(() => {
          this.$message.success('Level Listing Saved')
        })
        .catch((error) => {
          this.handleErrorToast(error)
        })
        .then(() => {
          this.loading = false
        })
    },
  }
}
</script>

<style lang="less" scoped>
  .ant-card {
    margin-bottom: 16px;
  }
</style>
