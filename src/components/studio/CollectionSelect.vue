<template>
  <b-autocomplete
    v-model="text"
    icon="album-collection"
    :data="options"
    :loading="loading"
    field="uid"
    clearable
    open-on-focus
    :custom-formatter="obj => obj.title + '(' + obj.uid + ')'"
    @typing="loadCollectionUids"
    @focus="onFocus"
    @select="selected"
  >
    <template slot="empty">
      No results found
    </template>
  </b-autocomplete>
</template>

<script>
export default {
  name: 'CollectionSelect',
  props: {
    value: {
      type: Object,
      required: false,
      default: null,
    }
  },
  data() {
    return {
      text: null,
      loading: false,
      options: [],
    }
  },
  mounted() {
    if (this.value) {
      this.text = this.value.title + '(' + this.value.uid + ')'
    }
  },
  methods: {
    onFocus() {
      this.$emit('input', null)
      this.text = null
      this.options = []
      this.loadCollectionUids()
    },
    loadCollectionUids(key) {
      this.loading = true
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.timer = setTimeout(() => {
        this.$axios.get('/search/collection_uids', {
          params: {
            search: key
          }
        })
          .then((res) => {
            this.loading = false
            this.options = res.data
          })
      }, 300)
    },
    selected(option) {
      this.$emit('input', option)
    },
  }
}
</script>
