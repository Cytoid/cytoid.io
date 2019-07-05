<template>
  <a-select
    :style="{ width: '100%' }"
    mode="tags"
    :token-separators="[',']"
    placeholder="Soundtrack, Touhou, Acoustic..."
    :value="value"
    @search="handleSearch"
    @focus="initialKeywords"
    @change="change"
  >
    <a-select-option v-for="d in data" :key="d">
      {{ d }}
    </a-select-option>
  </a-select>
</template>

<script>
export default {
  name: 'TagInput',
  props: {
    value: {
      type: Array,
      required: true,
    }
  },
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
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.timer = setTimeout(this.search.bind(this, keyword), 300)
    },
    search(keyword = '') {
      this.$axios.get('/tags', { params: { search: keyword } })
        .then((res) => {
          this.data = res.data
        })
    },
    change(val) {
      this.$emit('change', val)
    }
  }
}
</script>

<style scoped>

</style>
