<script setup lang="ts">
import EasyMDE from 'easymde'
import 'easymde/dist/easymde.min.css'

const content = defineModel<string>({ required: true })

const editorDom = ref<HTMLElement>()

onMounted(() => {
  nextTick(() => {
    if (editorDom.value) {
      const editor = new EasyMDE({
        element: editorDom.value,
        previewClass: 'prose',
        previewRender: useMarked,
        spellChecker: false,
        initialValue: content.value,
      })
      editor.codemirror.on('change', () => {
        content.value = editor.value()
      })
    }
  })
})
</script>

<template>
  <div>
    <textarea v-bind="$attrs" ref="editorDom" />
  </div>
</template>

<style>
.EasyMDEContainer .CodeMirror {
  border: 1px solid #ced4da;
  @apply bg-base-100 text-base-content !important
}

.EasyMDEContainer .CodeMirror-fullscreen {
  @apply bg-base-100
}

.CodeMirror-cursor {
  @apply border-l border-base-content border-r-0 w-0
}

.EasyMDEContainer .CodeMirror-placeholder {
  opacity: .5;
}

.EasyMDEContainer .CodeMirror-focused .CodeMirror-selected {
  @apply bg-base-content bg-opacity-25 !important
}

.editor-toolbar {
  @apply bg-base-200;
  border-top: 1px solid #ced4da;
  border-left: 1px solid #ced4da;
  border-right: 1px solid #ced4da;
}

.editor-preview-full {
  @apply bg-base-100 p-4 max-w-none
}

.editor-toolbar.fullscreen {
  z-index: 10 !important;
  @apply bg-base-100
}

.editor-toolbar.fullscreen::before {
  background: -moz-linear-gradient(left, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
  background: -webkit-gradient(linear, left top, right top, color-stop(0%, rgba(255, 255, 255, 1)), color-stop(100%, rgba(255, 255, 255, 0)));
  background: -webkit-linear-gradient(left, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
  background: -o-linear-gradient(left, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
  background: -ms-linear-gradient(left, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
  background: linear-gradient(to right, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);

}

.editor-toolbar.fullscreen::after {
  background: -moz-linear-gradient(left, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%);
  background: -webkit-gradient(linear, left top, right top, color-stop(0%, rgba(255, 255, 255, 0)), color-stop(100%, rgba(255, 255, 255, 1)));
  background: -webkit-linear-gradient(left, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%);
  background: -o-linear-gradient(left, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%);
  background: -ms-linear-gradient(left, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%);
  background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%);
}

.editor-toolbar button.active,
.editor-toolbar button:hover {
  @apply bg-neutral
}

.editor-toolbar i.separator {
  border-left: 1px solid #d9d9d9;
  border-right: 1px solid #fff;
  color: transparent;
}

.editor-statusbar {
  color: #959694;
}

.editor-preview-side {
  border: 1px solid #ddd;
  @apply bg-base-100 p-6
}

.editor-preview {
  background: #fafafa;
}

.editor-preview pre {
  background: #eee;
}

.editor-preview table td,
.editor-preview table th {
  border: 1px solid #ddd;
}

.cm-s-easymde .cm-tag {
  color: #63a35c;
}

.cm-s-easymde .cm-attribute {
  color: #795da3;
}

.cm-s-easymde .cm-string {
  color: #183691;
}

.cm-s-easymde .cm-comment {
  background: rgba(0, 0, 0, .05);
}

.cm-s-easymde .cm-link {
  color: #7f8c8d;
}

.cm-s-easymde .cm-url {
  color: #aab2b3;
}

.cm-s-easymde .cm-quote {
  color: #7f8c8d;
}

.editor-toolbar .easymde-dropdown {
  background: linear-gradient(to bottom right, #fff 0%, #fff 84%, #333 50%, #333 100%);
  border: 1px solid #fff;
}

.editor-toolbar .easymde-dropdown:hover {
  background: linear-gradient(to bottom right, #fff 0%, #fff 84%, #333 50%, #333 100%);
}

.easymde-dropdown-content {
  background-color: #f9f9f9;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}
</style>
