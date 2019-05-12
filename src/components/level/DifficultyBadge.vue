<template>
  <div class="badge" :class="badgeClass">
    <span style="font-weight: 500; margin-left: 16px; margin-right: 12px; color: white;" v-text="difficulty.name" />
    <span style="margin-left: auto; margin-right: 16px; color: white;">
      Lv.<span v-text="convertedDifficultyLevel" />
    </span>
  </div>
</template>

<script>
export default {
  props: {
    difficulty: {
      type: Object,
      required: true,
      default: () => {
        return JSON.parse('{"type": "extreme", "name": "EX"}')
      },
    },
  },
  computed: {
    badgeClass: function () {
      return {
        'badge-easy': this.difficulty.type === 'easy',
        'badge-hard': this.difficulty.type === 'hard',
        'badge-extreme': this.difficulty.type === 'extreme',
      }
    },
    convertedDifficultyLevel: function () {
      if (this.difficulty.level <= 0) return '?'
      if (this.difficulty.level >= 16) return '15+'
      return this.difficulty.level
    }
  },
}
</script>

<style scoped>
  .badge {
    display: inline-flex;
    align-items: center;
    height: 32px;
    min-width: 104px;
    border-radius: 16px;
    margin-right: 4px;
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
