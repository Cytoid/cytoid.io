<template lang="pug">
div
  .box
    a-form(:form="form" @submit.prevent="submit(form)")
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
  .box(v-if="$store.state.user.role === 'admin' || $store.state.user.role === 'moderator'")
    p.heading Censorship
    a-form-item(:label-col="{ span: 5 }" :wrapper-col="{ span: 19 }")
      a-input(v-model="adminForm.censored")
      template(slot="extra") Input anything here, and the level will be invisible to the users.
    p.heading Category
    a-form-item(:label-col="{ span: 5 }" :wrapper-col="{ span: 19 }")
      a-select(
        mode="multiple"
        :style="{ width: '100%' }"
        v-model="adminForm.category"
      )
        a-select-option(key="featured") Featured
    a-button.card-button(
      block
      :loading="loading"
      style="margin-top: 2rem;"
      @click="submit(adminForm)"
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
      adminForm: {
        censored: this.value.censored,
        category: this.value.category,
      }
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
    submit(form) {
      if (form.censored === '') {
        form.censored = null
      }
      this.loading = true
      this.$axios.patch('/levels/' + this.value.uid, form)
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
