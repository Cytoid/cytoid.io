<template>
  <div>ghjkj</div>
</template>

<script>
export default {
  name: 'Collection',
  asyncData({ $axios, params, error }) {
    $axios.get('/collections/' + params.id)
  }
}
</script>
