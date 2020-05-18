<template>
  <b-autocomplete
    v-model="searchKey"
    rounded
    :data="data"
    icon="search"
    clearable
    @keydown.native.enter.prevent="submit"
  />
</template>

<script>
export default {
  name: 'Search',
  data() {
    return {
      searchKey: '',
      data: [],
    }
  },
  methods: {
    submit() {
      this.$router.push({
        name: 'search',
        query: { search: this.searchKey }
      })
    }
  }
}
</script>
