<script>
export default {
  name: 'ScoreBadge',
  functional: true,
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  render(h, context) {
    const scoreGrade = [
      [0, 'F'],
      [600000, 'D'],
      [700000, 'C'],
      [800000, 'B'],
      [900000, 'A'],
      [990000, 'S'],
      [995000, 'SS'],
      [999000, 'SSS'],
      [1000000, 'MAX'],
    ].reduce((prev, [cutoff, str]) => (context.props.value >= cutoff) ? str : prev, 'F')
    return h('div', {
      class: {
        'badge-score-max': scoreGrade === 'MAX',
        'badge-score-sss': scoreGrade === 'SSS',
        'badge-score': true,
      },
      ...context.data
    }, scoreGrade)
  },
}
</script>

<style lang="scss">
.badge-score {
  display: inline;
  height: 20px;
  line-height: 20px;
  min-width: unset;
  border-radius: 10px;
  padding-left: .5rem;
  padding-right: .5rem;
  font-size: 12px;
  background: linear-gradient(to right bottom, $grey-light, $grey-lighter);
  color: white;
}
.badge-score-max {
  background: linear-gradient(to right bottom, hsl(45, 100%, 50%), hsl(45, 100%, 70%));
  color: $grey-darker;
  font-weight: bold;
}

.badge-score-sss {
  background: linear-gradient(to right bottom, hsl(211, 100%, 50%), hsl(211, 100%, 70%));
  color: white;
  font-weight: bold;
}
</style>
