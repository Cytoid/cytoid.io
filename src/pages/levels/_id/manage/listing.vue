<template lang="pug">
  a-card.ele3
    a-form(:form="form" @submit.prevent="submit")
      p.heading Description
      a-form-item
        no-ssr: markdown-editor(v-model="form.description")
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
      const index = [false, null, true].indexOf(this.value.published)
      return [
        'This video will be only visible to you.',
        'This level will only be visible to anybody who has the link.',
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

<style lang="less">
  .editor-toolbar {
    padding: 0 4px;
    border: none;
  }
  .editor-toolbar button {
    color: #fff !important;
  }
  .editor-toolbar button.active, .editor-toolbar button:hover {
    background: @shade4 !important;
    border-color: rgba(0, 0, 0, 0) !important;
  }
  .editor-toolbar.fullscreen {
    background: #343a40 !important;
  }
  .CodeMirror-cursor {
    border-left: 1px solid @text-color;
  }
  .editor-preview-side {
    color: #343a40 !important;
    background-color: @shade3;
    border: none;
  }
  .CodeMirror {
    border-color: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
    background: @shade4;
    color: @text-color;
    transition: all 0.3s ease;
  }
  .CodeMirror:focus-within {
    border-color: #6d8ee8;
    box-shadow: 0 0 0 2px rgba(69, 104, 220, 0.2);
  }
  .markdown-editor {
    line-height: initial;
  }
</style>
