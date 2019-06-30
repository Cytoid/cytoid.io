<template>
  <a-select
    :style="{ width: '100%' }"
    mode="tags"
    :token-separators="[',']"
    placeholder="Soundtrack, Touhou, Acoustic..."
    @search="handleSearch"
    @focus="initialKeywords"
  >
    <a-select-option v-for="d in data" :key="d">
      {{ d }}
    </a-select-option>
  </a-select>
</template>

<script>
export default {
  name: 'TagInput',
  data() {
    return {
      data: null,
    }
  },
  methods: {
    initialKeywords() {
      if (!this.data) {
        this.search()
      }
    },
    handleSearch(keyword) {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
        this.searchTimeout = null
      }
      this.searchTimeout = setTimeout(this.search.bind(this, keyword), 300)
    },
    search(keyword = '') {
      this.$axios.get('/tags', { params: { search: keyword } })
        .then((res) => {
          this.data = res.data
        })
    }
  }
}
</script>

<style scoped>

</style>
