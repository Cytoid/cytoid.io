<template lang="pug">
div
  .box
    form(:form="form" @submit.prevent="submit(form)")
      b-field(:label="$t('manage.description_field')")
        client-only: markdown-editor(v-model="form.description")
      b-field(:label="$t('manage.tags_field')")
        tag-input(v-model="form.tags")
      b-field(:label="$t('manage.visibility_field')")
        visibility-select(:value="form.published" bordered @change="form.published=$event")
      a-button.card-button(
        block
        :loading="loading"
        style="margin-top: 2rem;"
        html-type="submit"
        size="large"
      )
        font-awesome-icon(icon="save" fixed-width style="margin-right: 4px;")
        span(v-t="'save_btn'")
  form.box(v-if="$store.state.user.role === 'admin' || $store.state.user.role === 'moderator'")
    b-field(grouped)
      b-field(:label="$t('manage.admin.censorship_title')")
        b-switch(v-model="censored" type="is-danger") {{$t('manage.admin.censorship_checkbox_title')}}
      b-field(label="Reason" expanded :message="$t('manage.admin.censorship_reason_hint')")
        b-input(v-model="adminForm.censored" expanded :disabled="!censored")
    b-field(:label="$t('manage.admin.category_title')")
      b-taginput(
        v-model="adminForm.category"
        :data="['featured']"
        autocomplete
        open-on-focus
        icon="tag"
        :placeholder="$t('manage.admin.category_placeholder')")
    a-button.card-button(
      block
      :loading="loading"
      style="margin-top: 2rem;"
      @click="submit(adminForm)"
      size="large"
    )
      font-awesome-icon(icon="save" fixed-width style="margin-right: 4px;")
      span(v-t="'save_btn'")
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
    censored: {
      get() { return this.adminForm.censored !== null },
      set(val) { this.adminForm.censored = val ? '' : null },
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
  },
  i18n: {
    key: 'level_details'
  }
}
</script>
