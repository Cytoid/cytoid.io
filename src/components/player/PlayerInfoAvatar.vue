<template functional lang="pug">
.player-info-avatar
  a-avatar.level-avatar(src="https://cytoid.io/api/avatar.php?id=tigerhix&size=512")
  a-progress.level-badge-progress(
    type="dashboard"
    :percent="((props.exp - props.prev_level_exp) / (props.next_level_exp - props.prev_level_exp)) * 100"
    :format="percent => ''"
    :width="152"
    :stroke-width="4"
    :stroke-color="'hsla(226, 68%, 67%, 1)'"
  )
  .level-badge
    .lv LV.
    .num(v-text="props.level")
  .rating-badge {{ props.rating }} rt
</template>

<script>
export default {
  props: {
    exp: {
      type: Number,
      required: true,
    },
    prevExp: {
      type: Number,
      required: true,
    },
    nextExp: {
      type: Number,
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      required: true
    },
  }
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
    top: -@level-badge-size / 2;
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
    background: linear-gradient(to left, #B06AB3, #4568DC);
    font-size: 14px;
    color: white;
    white-space: nowrap;
  }
}
</style>
