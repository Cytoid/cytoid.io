<template>
  <div>
    <a-row type="flex" justify="center">
      <a-col v-for="level in levels" :key="level.id">
        <nuxt-link :to="{ name: 'levels-id', params: { id: level.uid } }">
          <level-card :level="level" />
        </nuxt-link>
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
  }
}
</script>
