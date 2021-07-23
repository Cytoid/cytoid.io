<script>
function draw (size, progress) {
  const margin = size * 0.025
  const radius = (size / 2) - margin
  const angle = Math.PI * (1 / 4)
  const curveAngle = (Math.PI - angle) * 2 * progress
  const endpointAngle = curveAngle - Math.PI * 1.5 + angle
  return `\
  M ${(size / 2 - radius * Math.sin(angle))},${radius * Math.cos(angle) + size / 2}\
  A ${radius},${radius} 0 ${curveAngle > Math.PI ? '1' : '0'} 1 ${size / 2 + radius * Math.cos(endpointAngle)}, ${size / 2 + radius * Math.sin(endpointAngle)}\
  `
}
export default {
  functional: true,
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
  render (h, { props }) {
    const exp = props.exp
    const progress = (exp.totalExp - exp.currentLevelExp) / (exp.nextLevelExp - exp.currentLevelExp)
    return (
      <div class="player-info-avatar">
        <avatar class="level-avatar ele3" src={props.avatar} />
        {(exp.totalExp >= 0) && <svg class="level-badge-progress" viewBox="0 0 152 152">
          <path class="trail" d={draw(152, 1)}/>
          <path class="progress" d={draw(152, progress)}/>
        </svg>}
        {(exp.totalExp >= 0) && <div class="level-badge ele3">
          <div class="lv">LV.</div>
          <div class="num">{exp.currentLevel}</div>
        </div>}
        {(props.rating >= 0) && <div class="rating-badge">
          { Math.floor(props.rating * 100) / 100 } rt
        </div>
        }
      </div>
    )
  }
}
</script>

<style lang="scss">
$level-size: 128px;
$level-progress-padding: 12px;
$level-badge-size: 48px;
$level-badge-inner-size: 36px;
$rating-badge-size: 32px;

.player-info-avatar {
  display: inline-block;
  position: relative;
  user-select: none;
  .level-avatar {
    width: $level-size;
    height: $level-size;
  }
  .level-badge-progress {
    position: absolute;
    left: -$level-progress-padding;
    top: -$level-progress-padding;
    width: $level-size + $level-progress-padding * 2;
    height: $level-size + $level-progress-padding * 2;
    path.trail, path.progress {
      stroke-width: 5px;
      stroke-linecap: round;
      fill-opacity: 0;
    }
    path.trail {
      stroke: white;
    }
    path.progress {
      stroke: $theme5;
    }
  }
  .level-badge {
    position: absolute;
    width: $level-badge-size;
    height: $level-badge-size;
    border-radius: $level-badge-size * 0.5;
    left: ($level-size - $level-badge-size) * 0.5;
    top: -$level-badge-size * 0.5 - 16px;
    background: white;
    text-align: center;
    line-height: $level-badge-inner-size * 0.5;
    padding-top: ($level-badge-size - $level-badge-inner-size) * 0.5;
    padding-bottom: ($level-badge-size - $level-badge-inner-size) * 0.5;
    .lv {
      font-size: 12px;
      font-weight: bold;
      color: $theme7;
      margin: auto;
    }
    .num {
      font-size: 14px;
      color: $theme5;
      margin: auto;
    }
  }
  .rating-badge {
    position: absolute;
    padding: 0 1rem;
    height: $rating-badge-size;
    line-height: $rating-badge-size;
    border-radius: $rating-badge-size * 0.5;
    left: $level-size * 0.5;
    bottom: -$rating-badge-size * 0.5;
    transform: translate(-50%, 0);
    background: linear-gradient(60deg, hsl(226, 68%, 57%), hsl(226, 68%, 67%));
    font-size: 14px;
    color: white;
    white-space: nowrap;
  }
}
</style>
