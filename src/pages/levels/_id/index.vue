<template lang="pug">
  section.section: .container
    .tile.is-ancestor
      .tile.is-parent
        .tile.is-child.is-warning.box: p(v-html="contentMarkdown")
        .tile.is-child.is-info.box
          ul(id="properties-list")
            li(v-for="(v, key) in metadata")
              strong(v-text="key")
              template(v-if="v && (v.url || v.name)")
                a(v-if="v.url" :href="v.url" v-text="v.name" target="_blank")
                span(v-else v-text="v.name")
              span(v-else v-text="v")
</template>

<script>
import NavBar from '@/layouts/components/NavBar'
import marked from 'marked'
import moment from 'moment'
export default {
  name: 'LevelDetail',
  layout: 'blank',
  components: {
    NavBar,
  },
  props: { value: { default: null, type: Object } },
  computed: {
    contentMarkdown() {
      return marked(this.value.description)
    },
    metadata() {
      const result = Object.assign({
        duration: this.value.duration,
        modified: moment(this.value.modificationDate).calendar(),
        uploaded: moment(this.value.creationDate).calendar(),
      }, this.value.metadata)
      delete result.title_localized
      delete result.title
      return result
    }
  },
}
</script>

<style scoped>
#properties-list li strong {
  text-transform: capitalize;
  margin-right: 0.5rem;
}
</style>
