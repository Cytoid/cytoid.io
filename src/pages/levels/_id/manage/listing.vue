<template lang="pug">
  div
    a-card.ele3
      p.heading Description
      no-ssr: markdown-editor(
        v-model="description"
        ref="markdownEditor"
        :configs="{ spellChecker: false }"
        style="margin-top: 4px;")
      p.heading Tags
      a-select(
        :style="{ width: '100%' }"
        mode="tags"
        :tokenSeparators="[' ', ',']"
      )
      p.heading(style="margin-top: 24px;") Visibility
      a-select(v-model="visibility" style="margin-right: 8px;")
        a-select-option(value="public")
          font-awesome-icon(icon="globe" style="margin-right: 4px;" fixed-width)
          span Public
        a-select-option(value="unlisted")
          font-awesome-icon(icon="eye-slash" style="margin-right: 4px;" fixed-width)
          span Unlisted
        a-select-option(value="private")
          font-awesome-icon(icon="lock" style="margin-right: 4px;" fixed-width)
          span Private
      span(v-if="visibility === 'public'") This level will be visible to everybody.
      span(v-if="visibility === 'unlisted'") This level will only be visible to anybody who has the link.
      span(v-if="visibility === 'private'") This video will be only visible to you.
      p.heading(style="margin-top: 24px;") Moderation
      a-switch(v-model="featured" style="margin-right: 8px;")
      span Featured
      a-button(class="card-button" style="width: 100%; margin-top: 24px;")
        font-awesome-icon(icon="save" fixed-width style="margin-right: 4px;")
        span Save

</template>

<script>
export default {
  name: 'LevelManageListing',
  data() {
    return {
      description: 'Hi',
      tag: '',
      tags: [],
      visibility: 'public',
      featured: false
    }
  },
}
</script>

<style lang="less" scoped>
  .ant-card {
    margin-bottom: 16px;
  }
</style>

<style lang="less">
  .ti-input {
    border: none !important;
  }
  .editor-toolbar {
    padding: 0 4px;
    border: none;
  }
  .editor-toolbar button {
    color: #fff !important;
  }
  .editor-toolbar button.active, .editor-toolbar button:hover {
    background: rgba(0, 0, 0, 0.3) !important;
    border-color: rgba(0, 0, 0, 0) !important;
  }
  .editor-toolbar.fullscreen {
    background: #343a40 !important;
  }
  .editor-toolbar.fullscreen::before, .editor-toolbar.fullscreen::after {
    background: none !important;
  }
  .editor-preview-side {
    color: #343a40 !important;
  }
  .CodeMirror {
    border: none;
    border-radius: 2px;
  }
</style>
