<template>
  <div>
    <a-row type="flex" justify="center">
      <a-col v-for="level in levels" :key="level.id">
        <level-card :level="level" />
      </a-col>
    </a-row>
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
  mounted() {
    this.$root.$emit('background', { source: '/images/blank.png' })
  }
}
</script>
