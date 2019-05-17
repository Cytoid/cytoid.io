<template>
  <a-badge :count="scoreGrade(value)" :class="scoreBadgeClass(value)" />
</template>
<script>
export default {
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  methods: {
    scoreGrade(score) {
      const cutoffs = [
        [0, 'F'],
        [600000, 'D'],
        [700000, 'C'],
        [800000, 'B'],
        [900000, 'A'],
        [950000, 'S'],
        [990000, 'SS'],
        [999500, 'SSS'],
        [1000000, 'MAX'],
      ]
      return cutoffs.reduce((prev, [cutoff, str]) => (score > cutoff) ? str : prev, 'F')
    },
    scoreBadgeClass(score) {
      if (score === 1000000) {
        return 'badge-score-max'
      } else if (score >= 999500) {
        return 'badge-score-sss'
      } else {
        return 'badge-score'
      }
    },
    rowClass(record) {
      if (record.score === 1000000) {
        return 'row-score-max'
      } else if (record.score >= 999500) {
        return 'row-score-sss'
      } else {
        return 'row-score'
      }
    }
  }
}
</script>

<style scoped>

</style>
