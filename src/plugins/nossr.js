import Vue from 'vue'
import VueSimplemde from 'vue-easymde'
import marked from 'marked'

Vue.component('MarkdownEditor', {
  name: 'MarkdownEditor',
  functional: true,
  render (h, ctx) {
    return <VueSimplemde
      value={ctx.props.value}
      vOn:input={ctx.listeners.input}
      configs={{
        previewClass: ['editor-preview', 'content']
      }}
      previewRender={marked}
      previewClass="content"
    />
  }
})
