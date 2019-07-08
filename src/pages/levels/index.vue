<template lang="pug">
.section
  .container
    p(class="card-heading") Sort
    a-select(
      :value="filters.sort"
      style="width: 192px; top: -1px;"
      :disabled="loading"
      @change="handleSortSelector"
    )
      a-select-option(value="creation_date") Uploaded date
      a-select-option(value="modification_date") Modified date
      a-select-option(value="difficulty") Difficulty
      a-select-option(value="duration") Duration
      a-select-option(value="downloads") Downloads
      a-select-option(value="rating") Rating
    a-button(
      :disabled="loading"
      style="margin-left: 8px;"
      @click="handleOrderButton"
    )
      font-awesome-icon(:icon="filters.order === 'asc' ? 'sort-amount-up' : 'sort-amount-down'")
    .level-card-container.large
      level-card(v-for="level in levels" :key="level.id" :value="level")
    a-pagination(
      :disabled="loading"
      :current="page"
      @change="handlePagination"
      :total="totalEntries"
      :page-size="pageSize"
      show-quick-jumper
      :show-total="(total, range) => `${total} levels (${range})`"
    )
</template>

<script>
import LevelCard from '@/components/level/LevelCard'

export default {
  components: {
    LevelCard,
  },
  data() {
    return {
      loading: false,
      levels: [],
      totalEntries: 0,
      totalPages: 0,
      pageSize: 24,
    }
  },
  computed: {
    page() {
      return parseInt(this.$route.query.page, 10) || 1
    },
    filters() {
      const filters = Object.assign({}, this.$route.query)
      filters.sort = filters.sort || 'creation_date'
      filters.order = filters.order || 'desc'
      return filters
    }
  },
  watch: {
    '$route'() {
      this.loading = true
      this.$axios.get('/levels', { params: { ...this.filters, page: this.page - 1, limit: this.pageSize } })
        .then((response) => {
          this.levels = response.data
          this.totalEntries = parseInt(response.headers['x-total-entries'])
          this.totalPages = parseInt(response.headers['x-total-page'])
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
          console.log(error)
        })
    }
  },
  asyncData({ $axios, query, error }) {
    query.page = query.page || 1
    query.sort = query.sort || 'creation_date'
    query.order = query.order || 'desc'
    return $axios.get('/levels', { params: { ...query, page: query.page - 1, limit: 24 } })
      .then((response) => {
        return {
          levels: response.data,
          totalEntries: parseInt(response.headers['x-total-entries']),
          totalPages: parseInt(response.headers['x-total-page']),
        }
      })
      .catch(err => error(err.response?.data))
  },
  methods: {
    updateRoute(query) {
      window.scrollTo(0, 0)
      this.$router.replace({ query: { ...this.filters, ...query } })
    },
    handlePagination(current) {
      this.updateRoute({ ...this.filters, page: current })
    },
    handleOrderButton() {
      this.updateRoute({ order: this.filters.order === 'asc' ? 'desc' : 'asc' })
    },
    handleSortSelector(value) {
      this.updateRoute({ sort: value })
    }
  }
}
</script>
