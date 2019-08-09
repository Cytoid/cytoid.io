<template lang="pug">
  div
    div BG-TITLE
    div
      level-card(
        v-for="level in value.levels"
        :key="level.id"
        :value="level"
      )
</template>

<script>
import LevelCard from '../level/LevelCard'
export default {
  name: 'CollectionPreviewCard',
  components: {
    LevelCard
  },
  props: {
    value: {
      type: Object,
      required: true,
    }
  }
}
</script>
