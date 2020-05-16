export default {
  name: 'TagInput',
  props: {
    value: {
      type: Array,
      required: true,
    }
  },
  render(h) {
    return h('b-taginput', {
      props: {
        autocomplete: true,
        allowNew: true,
        openOnFocus: true,
        value: this.value,
        data: this.tagsCandidates,
        placeholder: 'Add a tag...',
        icon: 'plus',
      },
      on: {
        typing: this.typing,
        input: (val) => {
          this.$emit('input', val)
        }
      }
    })
  },
  data() {
    return {
      tagsCandidates: [],
    }
  },
  methods: {
    typing(keyword) {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.timer = setTimeout(this.search.bind(this, keyword), 500)
    },
    search(keyword) {
      this.$axios.get('/search/level_tags', { params: { search: keyword } })
        .then((res) => {
          this.tagsCandidates = res.data
        })
    }
  },
}
