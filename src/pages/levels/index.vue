<template lang="pug">
.section
  .container
    div(style="display: flex; flex-direction: row;")
      b-field(:label="$t('sort_select_title')" :addons="false")
        b-dropdown(:value="filters.sort" @change="handleSortSelector" :disabled="loading")
          button.button(slot="trigger" slot-scope="{ active }")
            | {{sortingCriteriaTitle(filters.sort)}}
            font-awesome-icon(:icon="active ? 'caret-up' : 'caret-down'" style="margin-left: 0.5rem;")
          b-dropdown-item(value="relevance" v-if="$route.query.search") {{$t('sort_select_relevance')}}
          b-dropdown-item(value="creation_date") {{$t('sort_select_upload_date')}}
          b-dropdown-item(value="modification_date") {{$t('sort_select_modification_date')}}
          b-dropdown-item(value="difficulty") {{$t('sort_select_difficulty')}}
          b-dropdown-item(value="duration") {{$t('sort_select_duration')}}
          b-dropdown-item(value="downloads") {{$t('sort_select_downloads')}}
          b-dropdown-item(value="rating") {{$t('sort_select_rating')}}
        b-button(
          :disabled="loading"
          style="margin-left: 1rem;"
          @click="handleOrderButton"
        )
          font-awesome-icon(:icon="filters.order === 'asc' ? 'sort-amount-up' : 'sort-amount-down'")
      b-field(:label="$t('category_select_title')" style="margin-left: 1rem;")
        .field.has-addons
          b-radio-button(
            type="is-white"
            :value="filters.category"
            @input="handleFilterSelector"
            native-value="all") {{$t('category_select_item_all')}}
          b-radio-button(
            type="is-white"
            :value="filters.category"
            @input="handleFilterSelector"
            native-value="featured") {{$t('category_select_item_featured')}}
          b-radio-button(
            type="is-white"
            :value="filters.category"
            @input="handleFilterSelector"
            native-value="qualified") {{$t('category_select_item_qualified')}}
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
import { handleErrorBlock } from '@/plugins/antd'

function baseURL (query) {
  if (query.search) {
    return '/search/levels'
  }
  if (query.sort && !['creation_date', 'modification_date', 'duration', 'difficulty'].includes(query.sort)) {
    return '/search/levels'
  }
  return '/levels'
}
export default {
  components: {
    LevelCard,
  },
  asyncData ({ $axios, query, error }) {
    query.page = query.page || 1
    if (!query.sort) {
      if (!query.search) { query.sort = 'creation_date' }
    } else if (query.sort === 'relevance') {
      query.sort = undefined
    }
    query.order = query.order || 'desc'
    return $axios.get(baseURL(query), { params: { ...query, page: query.page - 1, limit: 24 } })
      .then((response) => {
        return {
          levels: response.data,
          totalEntries: parseInt(response.headers['x-total-entries']),
          totalPages: parseInt(response.headers['x-total-page']),
        }
      })
      .catch(err => handleErrorBlock(err, error))
  },
  data () {
    return {
      loading: false,
      levels: [],
      totalEntries: 0,
      totalPages: 0,
      pageSize: 24,
    }
  },
  computed: {
    page () {
      return parseInt(this.$route.query.page, 10) || 1
    },
    filters () {
      const filters = Object.assign({}, this.$route.query)
      if (!filters.sort) {
        filters.sort = this.$route.query.search ? 'relevance' : 'creation_date'
      }
      filters.order = filters.order || 'desc'
      filters.category = filters.category || 'all'
      return filters
    }
  },
  watch: {
    '$route' () {
      this.loading = true
      const mappedFilters = Object.assign({}, this.filters)
      if (mappedFilters.category) {
        if (mappedFilters.category === 'featured') {
          mappedFilters.featured = true
        }
        if (mappedFilters.category === 'qualified') {
          mappedFilters.qualified = true
        }
        delete mappedFilters.category
      }
      if (mappedFilters.sort === 'relevance') {
        mappedFilters.sort = undefined
      }
      this.$axios.get(baseURL(mappedFilters), { params: { ...mappedFilters, page: this.page - 1, limit: this.pageSize } })
        .then((response) => {
          this.levels = response.data
          this.totalEntries = parseInt(response.headers['x-total-entries'])
          this.totalPages = parseInt(response.headers['x-total-page'])
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
          this.handleErrorToast(error)
        })
    }
  },
  methods: {
    updateRoute (query) {
      window.scrollTo(0, 0)
      this.$router.replace({ query: { ...this.filters, ...query } })
    },
    handlePagination (current) {
      this.updateRoute({ ...this.filters, page: current })
    },
    handleOrderButton () {
      this.updateRoute({ order: this.filters.order === 'asc' ? 'desc' : 'asc' })
    },
    handleSortSelector (value) {
      this.updateRoute({ sort: value })
    },
    handleFilterSelector (value) {
      this.updateRoute({ category: value })
    },
    sortingCriteriaTitle (key) {
      switch (key) {
        case 'creation_date': return this.$t('sort_select_upload_date')
        case 'modification_date': return this.$t('sort_select_modification_date')
        case 'difficulty': return this.$t('sort_select_difficulty')
        case 'duration': return this.$t('sort_select_duration')
        case 'downloads': return this.$t('sort_select_downloads')
        case 'rating': return this.$t('sort_select_rating')
        case 'relevance': return this.$t('sort_select_relevance')
      }
    }
  },
  head () {
    return {
      title: 'Levels - Cytoid'
    }
  },
  i18n: {
    key: 'levels'
  }
}
</script>
