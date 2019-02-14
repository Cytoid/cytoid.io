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
                a(v-if="v.url" :href="v.url" v-text="v.name")
                span(v-else v-text="v.name")
              span(v-else v-text="v")
</template>

<script>
import NavBar from '@/layouts/components/NavBar'
import marked from 'marked'
export default {
  name: 'LevelDetail',
  layout: 'blank',
  components: {
    NavBar,
  },
  props: { value: { default: null, type: Object } },
  computed: {
    contentMarkdown() {
      return marked(this.value.content)
    },
    metadata() {
      return Object.assign({
        duration: this.value.duration,
        modified: this.value.last_modified,
        uploaded: this.value.creation_date,
      }, this.value.metadata)
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
