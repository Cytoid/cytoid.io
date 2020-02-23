<i18n locale="en" src="@/locale/en/levels.json" />
<i18n locale="zh-cn" src="@/locale/zh-CN/levels.json" />

<template lang="pug">
.section
  .container
    div(style="display: flex; flex-direction: row;")
      div(style="margin-left: 4px; margin-right: 24px;")
        p(class="card-heading" v-t="'sort_select_title'")
        a-select(
          :value="filters.sort"
          style="width: 192px; top: -1px;"
          :disabled="loading"
          @change="handleSortSelector"
        )
          a-select-option(value="creation_date") {{$t('sort_select_upload_date')}}
          a-select-option(value="modification_date") {{$t('sort_select_modification_date')}}
          a-select-option(value="difficulty") {{$t('sort_select_difficulty')}}
          a-select-option(value="duration") {{$t('sort_select_duration')}}
          a-select-option(value="downloads") {{$t('sort_select_downloads')}}
          a-select-option(value="rating") {{$t('sort_select_rating')}}
        a-button(
          :disabled="loading"
          style="margin-left: 8px;"
          @click="handleOrderButton"
        )
          font-awesome-icon(:icon="filters.order === 'asc' ? 'sort-amount-up' : 'sort-amount-down'")
      b-field(:label="$t('category_select_title')")
        .field.has-addons
          b-radio-button(
            size="is-small"
            type="is-white"
            :value="filters.category"
            @input="handleFilterSelector"
            native-value="all") {{$t('category_select_item_all')}}
          b-radio-button(
            size="is-small"
            type="is-white"
            :value="filters.category"
            @input="handleFilterSelector"
            native-value="featured") {{$t('category_select_item_featured')}}
    .level-card-container.large(style="margin-top: 16px; margin-bottom: 16px;")
      level-card(v-for="level in levels" :key="level.id" :value="level")
    b-pagination(
      :total="totalEntries"
      :per-page="pageSize"
      :current="page"
      @change="handlePagination")
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
  head() {
    return {
      title: 'Levels - Cytoid'
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
      filters.category = filters.category || 'all'
      return filters
    }
  },
  watch: {
    '$route'() {
      this.loading = true
      const mappedFilters = JSON.parse(JSON.stringify(this.filters))
      if (mappedFilters.category) {
        if (mappedFilters.category === 'featured') {
          mappedFilters.featured = true
        }
        delete mappedFilters.category
      }
      this.$axios.get('/levels', { params: { ...mappedFilters, page: this.page - 1, limit: this.pageSize } })
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
    },
    handleFilterSelector(value) {
      console.log(value)
      this.updateRoute({ category: value })
    }
  }
}
</script>

<style>
.category-radio-container {
  display: flex;
  flex-direction: row;
}
</style>
