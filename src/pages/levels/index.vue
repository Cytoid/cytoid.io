<template>
  <div style="padding: 16px;">
    <a-row type="flex" justify="center">
      <a-col
        v-for="level in levels"
        :key="level.id"
        :xs="{ span: 24 }"
        :sm="{ span: 12 }"
        :lg="{ span: 8 }"
        :xxl="{ span: 6 }"
      >
        <level-card :level="level" />
      </a-col>
    </a-row>
    <a-pagination
      v-model="page"
      :total="totalEntries"
      :page-size="pageSize"
      show-quick-jumper
      show-size-changer
      :show-total="(total, range) => `${total} levels (${range})`"
    />
  </div>
</template>

<script>
import LevelCard from '@/components/level/LevelCard'

export default {
  components: {
    LevelCard,
  },
  data() {
    return {
      levels: [],
      page: 1,
      totalEntries: 0,
      totalPages: 0,
      pageSize: 30,
    }
  },
  watch: {
    page(pageNum) {
      this.$router.replace({ query: { page: pageNum } })
      this.$axios.get('/levels', { params: { page: pageNum - 1 } })
        .then((response) => {
          this.levels = response.data
          this.totalEntries = parseInt(response.headers['x-total-entries'])
          this.totalPages = parseInt(response.headers['x-total-page'])
        })
    }
  },
  asyncData({ $axios, query }) {
    const page = parseInt(query.page) || 1
    return $axios.get('/levels', { params: { page: page - 1 } })
      .then((response) => {
        return {
          levels: response.data,
          page: page,
          totalEntries: parseInt(response.headers['x-total-entries']),
          totalPages: parseInt(response.headers['x-total-page']),
        }
      })
  },
  mounted() {
    this.$root.$emit('background', { source: '/images/blank.png' })
  }
}
</script>
