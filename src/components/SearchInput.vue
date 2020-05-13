<template>
  <b-autocomplete
    v-model="searchKey"
    rounded
    :data="data"
    icon="search"
    clearable
  />
</template>

<script>
export default {
  name: 'Search',
  data() {
    return {
      data: [],
      searchKey: '',
      overlay: false
    }
  },
  methods: {
    submit() {
      this.overlay = false
      this.$router.push({
        name: 'levels',
        query: { search: this.searchKey }
      })
    }
  }
}
</script>
