<template lang="pug">
  #level-container
    LevelCard(v-for="level in levels", :value="level", :key="level.id")
</template>

<script>
import LevelCard from '~/components/LevelCard'
export default {
  name: 'LevelList',
  components: {
    LevelCard
  },
  asyncData({ params, $axios, error, env }) {
    return $axios.get('/levels')
      .then((res) => {
        return {
          levels: res.data
        }
      })
      .catch((err) => {
        if (err.response) {
          error({
            statusCode: err.response.status,
            message: 'Server Error'
          })
        } else if (err.request) {
          error({ statusCode: 504, message: 'Request timed out' })
        } else {
          error({ statusCode: 503, message: 'Could not communicate with the server' })
        }
      })
  },
}
</script>

<style scoped>
#level-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
#level-container .level-card {
  margin: 1rem;
  height: 20vh;
  width: 30vh;
}
</style>
