<template lang="pug">
  div
    div(class="columns")
        LevelCard(v-for="level in levels", :level="level", class="column is-one-third")
</template>

<script>
import LevelCard from '~/components/LevelCard'
export default {
  name: 'LevelList',
  asyncData({ params, $axios, error, env }) {
    return $axios.get('/levels')
      .then((res) => {
        return {
          levels: res.data.data
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
  components: {
    LevelCard
  }
}
</script>

<style scoped>

</style>
