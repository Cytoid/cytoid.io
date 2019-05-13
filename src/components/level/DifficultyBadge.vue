<template lang="pug">
  a-popover(placement="top" title="")
    p(slot="content" style="margin-bottom: 0; color: hsla(226, 68%, 6%, 1);") 1560 Notes
    .badge(:class="badgeClass")
      span.title(v-text="value.name || convertedDifficultyName(value.type)")
      span.level Lv. {{convertedDifficultyLevel}}
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  methods: {
    convertedDifficultyName(name) {
      return {
        easy: 'Easy',
        hard: 'Hard',
        extreme: 'EX',
      }[name]
    }
  },
  computed: {
    badgeClass() {
      return {
        'badge-easy': this.value.type === 'easy',
        'badge-hard': this.value.type === 'hard',
        'badge-extreme': this.value.type === 'extreme',
      }
    },
    convertedDifficultyLevel() {
      if (this.value.difficulty <= 0) return '?'
      if (this.value.difficulty >= 16) return '15+'
      return this.value.difficulty
    },
  },
}
</script>

<style scoped lang="less">
.badge {
  display: inline-flex;
  align-items: center;
  height: 32px;
  min-width: 104px;
  border-radius: 16px;
  margin-right: 4px;
  .title {
    font-weight: 500;
    margin-left: 16px;
    margin-right: 12px;
    color: white;
  }
  .level {
    margin-left: auto;
    margin-right: 16px;
    color: white;
  }
}

.badge-easy {
  background: linear-gradient(to bottom right, #4ca2cd, #67B26F);
}

.badge-hard {
  background: linear-gradient(to top left, #B06AB3, #4568DC);
}

.badge-extreme {
  background: linear-gradient(to top left, #6f0000, #200122);
}
</style>
