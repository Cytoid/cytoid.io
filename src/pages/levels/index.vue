<template>
  <div>
    <a-row type="flex" justify="center">
      <a-col v-for="level in levels" :key="level.id">
        <level-card :level="level" />
      </a-col>
    </a-row>
    <a-pagination showSizeChanger :pageSize.sync="pageLimit" :total="500" v-model="pageNum"/>
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
