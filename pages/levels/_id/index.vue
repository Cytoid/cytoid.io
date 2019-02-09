<template lang="pug">
  section.section: .container
    h1.title dfdfdf
    h2.subtitle aldkjf
</template>

<script>
import NavBar from '@/layouts/components/NavBar'
export default {
  name: 'LevelDetail',
  layout: 'blank',
  components: {
    NavBar,
  },
  computed: {
    backgroundImage() {
      return 'https://cytoid.io/browse/flina.touhou.ccmoon/header.jpg'
    }
  },
}
</script>
