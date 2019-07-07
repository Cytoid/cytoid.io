<template lang="pug">
  a-popover(placement="top" title="")
    p(slot="content" style="margin-bottom: 0; padding: 8px 16px; color: hsla(226, 68%, 6%, 1);") {{value.notesCount}} notes
    div(:class="badgeClass")
      span.title(v-if="!ball" v-text="value.name || convertedDifficultyName(value.type)")
      span.level {{convertedDifficultyLevel}}
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      required: true,
    },
    small: {
      type: Boolean,
      default: () => false,
    },
    ball: {
      type: Boolean,
      default: () => false,
    }
  },
  computed: {
    badgeClass() {
      return {
        'badge': !this.ball,
        'badge-ball': this.ball,
        'badge-small': this.small,
        'badge-easy': this.value.type === 'easy',
        'badge-hard': this.value.type === 'hard',
        'badge-extreme': this.value.type === 'extreme',
      }
    },
    convertedDifficultyLevel() {
      const str = (this.small || this.ball) ? '' : 'Lv. '
      if (this.value.difficulty <= 0) return str + '?'
      if (this.value.difficulty >= 16) return str + '15+'
      return str + this.value.difficulty
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
}
</script>

<style scoped lang="less">
.badge {
  display: inline-flex;
  align-items: center;
  height: 32px;
  min-width: 104px;
  border-radius: 16px;
  .title {
    font-weight: 500;
    margin-left: 16px;
    margin-right: 12px;
    color: rgba(255, 255, 255, 0.9);
  }
  .level {
    margin-left: auto;
    margin-right: 16px;
    color: rgba(255, 255, 255, 0.9);
  }
}

.badge-small {
  height: 20px;
  min-width: unset;
  border-radius: 10px;
  font-size: 12px;
  .title {
    font-weight: unset;
    margin-left: 8px;
    margin-right: 4px;
    color: rgba(255, 255, 255, 0.9);
  }
  .level {
    margin-left: unset;
    margin-right: 8px;
    color: rgba(255, 255, 255, 0.9);
  }
}

.badge-ball {
  display: inline-flex;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  .level {
    margin: auto;
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
