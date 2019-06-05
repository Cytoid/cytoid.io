<template lang="pug">
.section
  .container
    a-select(v-model="filters.sort" @change="updateRoute" style="width: 192px;" :disabled="loading")
      a-select-option(value="creation_date") Uploaded date
      a-select-option(value="modification_date") Modified date
      a-select-option(value="difficulty") Difficulty
      a-select-option(value="duration") Duration
      a-select-option(value="downloads") Downloads
      a-select-option(value="rating") Rating
    a-button(@click="(filters.order = (filters.order === 'asc' ? 'desc' : 'asc')) && updateRoute()" :disabled="loading" style="margin-left: 8px;")
      font-awesome-icon(:icon="filters.order === 'asc' ? 'sort-up' : 'sort-down'")
    .level-card-container
        level-card(v-for="level in levels" :key="level.id" :level="level")
    a-pagination(
      :disabled="loading"
      v-model="page"
      :total="totalEntries"
      :page-size="pageSize"
      show-quick-jumper
      show-size-changer
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
      page: 1,
      totalEntries: 0,
      totalPages: 0,
      pageSize: 30,
      filters: {
        sort: 'creation_date',
        order: 'desc',
      }
    }
  },
  watch: {
    page() {
      this.updateRoute()
    },
  },
  asyncData({ $axios, query }) {
    query.page = query.page || 1
    query.page -= 1
    query.sort = query.sort || 'creation_date'
    query.order = query.order || 'desc'
    return $axios.get('/levels', { params: query })
      .then((response) => {
        const page = query.page
        delete query.page
        return {
          levels: response.data,
          page: page + 1,
          filters: query,
          totalEntries: parseInt(response.headers['x-total-entries']),
          totalPages: parseInt(response.headers['x-total-page']),
        }
      })
  },
  mounted() {
    this.$root.$emit('background', { source: '/images/blank.png' })
  },
  methods: {
    updateRoute() {
      this.$router.replace({ query: { page: this.page, ...this.filters } })
      this.loading = true
      this.$axios.get('/levels', { params: { page: this.page - 1, ...this.filters } })
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
  }
}
</script>

<style lang="scss">
.level-card-container {
  margin-top: 16px;
  margin-bottom: 16px;

  @include mobile {
    .card-wrap {
      margin: 8px;
    }
  }
  @include tablet {
    display: grid;
    grid-gap: 16px 16px;
    grid-auto-flow: row;
  }
  @include tablet-only {
    grid-template-columns: repeat(2, 1fr);
  }
  @include desktop-only {
    grid-template-columns: repeat(3, auto);
  }
  @include widescreen-only {
    grid-template-columns: repeat(3, auto);
  }
  @include fullhd {
    grid-template-columns: repeat(4, auto);
  }
}
</style>
