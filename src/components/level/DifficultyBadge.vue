<script>
export default {
  functional: true,
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
  render(h, context) {
    const value = context.props.value
    const small = context.props.small
    const ball = context.props.ball

    let str = (small || ball) ? '' : 'Lv. '
    if (value.difficulty <= 0) str += '?'
    else if (value.difficulty >= 16) str += '15+'
    else str += value.difficulty

    const classes = {
      badge: !ball,
      ball: ball,
      small: small,
      easy: value.type === 'easy',
      hard: value.type === 'hard',
      extreme: value.type === 'extreme',
      'difficulty-badge': true,
      ...context.style,
    }
    function convertedDifficultyName(name) {
      return {
        easy: 'Easy',
        hard: 'Hard',
        extreme: 'EX',
      }[name]
    }
    return (<b-dropdown hoverable position="is-top-right" class="difficulty-badge-dropdown">
      <p slot="content" style="margin-bottom: 0; padding: 8px 16px; color: hsla(226, 68%, 6%, 1);">{value.notesCount} notes</p>
      <div class={classes} slot="trigger">
        {!context.props.ball && <span class="title">{value.name || convertedDifficultyName(value.type)}</span>}
        <span class="level">{str}</span>
      </div>
      <b-dropdown-item custom paddingless>
        <div class="box">{value.notesCount} notes</div>
      </b-dropdown-item>
    </b-dropdown>)
  },
}
</script>

<style lang="scss">
  .difficulty-badge-dropdown {
    z-index: 10;
  }
  .difficulty-badge {
    user-select: none;
    &.badge {
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

    &.small {
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

    &.ball {
      display: inline-flex;
      align-items: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      .level {
        margin: auto;
      }
    }

    &.easy {
      background: linear-gradient(to bottom right, #4ca2cd, #67B26F);
    }

    &.hard {
      background: linear-gradient(to top left, #B06AB3, #4568DC);
    }

    &.extreme {
      background: linear-gradient(to top left, #6f0000, #200122);
    }
  }
</style>
