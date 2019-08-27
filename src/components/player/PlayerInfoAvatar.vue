<template functional lang="pug">
.player-info-avatar
  avatar.level-avatar.ele3(:src="props.avatar")
  a-progress.level-badge-progress(
    v-show="props.exp.totalExp >= 0"
    type="dashboard"
    :percent="((props.exp.totalExp - props.exp.currentLevelExp) / (props.exp.nextLevelExp - props.exp.currentLevelExp)) * 100"
    :format="percent => ''"
    :width="152"
    :stroke-width="3"
    :stroke-color="'hsla(226, 68%, 67%, 1)'"
  )
  .level-badge(class="ele3" v-show="props.exp.totalExp >= 0")
    .lv LV.
    .num(v-text="props.exp.currentLevel")
  .rating-badge(class="ele3" v-show="props.rating >= 0") {{ Math.floor(props.rating * 100) / 100 }} rt
</template>

<script>
export default {
  props: {
    exp: {
      type: Object,
      required: true,
    },
    avatar: {
      type: String,
      required: false,
      default: '' // TODO: default avatar image
    },
    rating: {
      type: Number,
      required: true,
    }
  },
}
</script>

<style lang="less">
@level-size: 128px;
@level-progress-size: 152px;
@level-badge-size: 48px;
@level-badge-inner-size: 36px;
@rating-badge-size: 32px;
.player-info-avatar {
  display: inline-block;
  position: relative;
  .level-avatar {
    width: @level-size;
    height: @level-size;
  }
  .level-badge-progress {
    position: absolute;
    left: (@level-size - @level-progress-size) / 2;
    top: (@level-size - @level-progress-size) / 2;
  }
  .level-badge {
    position: absolute;
    width: @level-badge-size;
    height: @level-badge-size;
    border-radius: @level-badge-size / 2;
    left: (@level-size / 2) - (@level-badge-size / 2);
    top: -@level-badge-size / 2 - 16px;
    background: #fff;
    text-align: center;
    line-height: @level-badge-inner-size / 2;
    padding-top: (@level-badge-size - @level-badge-inner-size) / 2;
    padding-bottom: (@level-badge-size - @level-badge-inner-size) / 2;
    .lv {
      font-size: 12px;
      font-weight: bold;
      color: hsla(226, 68%, 87%, 1);
      margin: auto;
    }
    .num {
      font-size: 14px;
      color: hsla(226, 68%, 67%, 1);
      margin: auto;
    }
  }
  .rating-badge {
    position: absolute;
    padding: 0 1rem;
    height: @rating-badge-size;
    line-height: @rating-badge-size;
    border-radius: @rating-badge-size / 2;
    left: @level-size / 2;
    bottom: -@rating-badge-size / 2;
    transform: translate(-50%, 0);
    background: linear-gradient(60deg, hsl(226, 68%, 57%), hsl(226, 68%, 67%));
    font-size: 14px;
    color: white;
    white-space: nowrap;
  }
}
</style>
