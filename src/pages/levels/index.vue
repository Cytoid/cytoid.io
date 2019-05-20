<template>
  <div>
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
    </div>
  </div>
</template>

<script>
import LevelCard from '@/components/level/LevelCard'

export default {
  components: {
    LevelCard,
  },
  data: () => ({
    levels: []
  }),
  asyncData({ $axios }) {
    return $axios.get('/levels')
      .then((response) => {
        return {
          levels: response.data
        }
      })
  },
  computed: {
    pageNum: {
      get() {
        return this.$route.query.page || 0
      },
      set(val) {
        this.$route.query.page = val
      }
    },
    pageLimit: {
      get() {
        return this.$route.query.limit || 30
      },
      set(val) {
        this.$route.query.limit = val
      }
    }
  },
  mounted() {
    this.$root.$emit('background', { source: '/images/blank.png' })
  }
}
</script>
