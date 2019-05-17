<template lang="pug">
  .card-container
    div(
      ref="card"
      class="card-wrap"
      @mousemove="handleMouseMove"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @click="enter"
    )
      .card(:style="cardStyle")
        .card-bg(:style="[cardBgTransform, cardBgImage]")
        .card-bottom
          h1(style="margin-bottom: 0px;" v-text="level.title")
          p(v-if="level.metadata.title_localized !== null" v-text="level.metadata.title_localized" style="margin-bottom: 0px;")
          a-row(type="flex" align="middle")
            a-col(:span="20" style="display: flex; align-items: center;")
              span(style="display: flex; align-items: center;")
                a-avatar(:size="24" icon="user" style="margin-right: 8px;")
                span(v-text="level.metadata.charter.name")
            a-col(:span="4" style="display: flex; align-items: center; justify-content: flex-end;")
              play-button(:src="level.bundle.music_preview")
        .card-top
          difficulty-badge(v-for="chart in charts" :key="getRandomInt()" :value="chart" :ball="true" :name="false" style="margin-right: 4px;")
</template>

<script>
import PlayButton from '@/components/level/PlayButton'
import DifficultyBadge from '@/components/level/DifficultyBadge'
const charts = [
  {
    name: 'Mousou',
    type: 'extreme',
    difficulty: 13
  },
  {
    name: null,
    type: 'hard',
    difficulty: 9
  }
]
export default {
  components: {
    DifficultyBadge,
    PlayButton,
  },
  props: {
    level: {
      type: Object,
      required: true
    },
  },
  data: () => ({
    mouseX: null,
    mouseY: null,
    charts
  }),
  computed: {
    mousePX() {
      return this.mouseX / this.$refs.card.offsetWidth
    },
    mousePY() {
      return this.mouseY / this.$refs.card.offsetHeight
    },
    cardStyle() {
      if (this.mouseX === null || this.mouseY === null) {
        return {}
      }
      const rX = this.mousePX * 6
      const rY = this.mousePY * -6
      return {
        transform: `rotateY(${rX}deg) rotateX(${rY}deg)`,
      }
    },
    cardBgTransform() {
      if (this.mouseX === null || this.mouseY === null) {
        return {}
      }
      const tX = this.mousePX * -10
      const tY = this.mousePY * -10
      return {
        '--translate-x': tX + 'px',
        '--translate-y': tY + 'px',
      }
    },
    cardBgImage() {
      return {
        backgroundImage: `url(${this.level.bundle.background})`,
      }
    },
  },
  beforeDestroy() {
    if (this.mouseLeaveDelayTimeout) {
      clearTimeout(this.mouseLeaveDelayTimeut)
      this.mouseLeaveDelayTimeout = null
    }
  },
  methods: {
    getRandomInt() {
      return Math.random() * 1000
    },
    handleMouseMove(e) {
      if (!this.$refs.card) {
        // Bugfix for vue routing bug. Event sent after component destruction.
        return
      }
      this.mouseX = e.pageX - this.$refs.card.offsetLeft - this.$refs.card.offsetWidth / 2
      this.mouseY = e.pageY - this.$refs.card.offsetTop - this.$refs.card.offsetHeight / 2
    },
    handleMouseEnter() {
      clearTimeout(this.mouseLeaveDelayTimeout)
      this.mouseLeaveDelayTimeout = null
    },
    handleMouseLeave() {
      this.mouseLeaveDelayTimeout = setTimeout(() => {
        this.mouseX = null
        this.mouseY = null
        this.mouseLeaveDelayTimeout = null
      }, 200)
    },
    enter() {
      this.$router.push({ name: 'levels-id', params: { id: this.level.uid } })
    }
  },
}
</script>

<style scoped lang="less">
h1 {
  margin-bottom: 0;
}
p {
  margin-bottom: 0;
}
@card-background-gutter: 1rem;

.card-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.card-wrap {
  margin: 10px;
  transform: perspective(800px);
  transform-style: preserve-3d;
  cursor: default;
  &:hover {
    .card-info {
      transform: translateY(0);
      transition: 0.6s @hoverEasing;
      p {
        opacity: 1;
        transition: 0.6s @hoverEasing;
      }
      &:after {
        transition: 5s @hoverEasing;
        opacity: 1;
        transform: translateY(0);
      }
    }
    .card {
      transition: 0.6s @hoverEasing, box-shadow 2s @hoverEasing;
      box-shadow: @ele3; //rgba(255, 255, 255, 0.2) 0 0 40px 5px, white 0 0 0 1px, rgba(0, 0, 0, 0.66) 0 30px 60px 0, inset #333 0 0 0 5px, inset white 0 0 0 6px;
    }
    .card-bg {
      transition: 0.6s @hoverEasing, opacity 0.4s 0s @hoverEasing;
      transform: scale(1.02, 1.02) translateX(var(--translate-x, 0)) translateY(var(--translate-y, 0));
      opacity: 0.8;
    }
  }
}
.card {
  position: relative;
  flex: 0 0 240px;
  width: 384px;
  height: 240px;
  background-color: #333;
  overflow: hidden;
  border-radius: 4px;
  box-shadow: @ele2; //rgba(0, 0, 0, 0.66) 0 px 60px 0, inset #333 0 0 0 5px, inset rgba(255, 255, 255, 0.5) 0 0 0 6px;
  transition: 1s @returnEasing;
  &:active {
    transform: scale(0.98, 0.98) !important;
  }
}

.card-bg {
  opacity: 0.5;
  position: relative;
  top: -@card-background-gutter;
  left: -@card-background-gutter;
  width: 100%;
  height: 100%;
  padding: @card-background-gutter;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  transition: 1s @returnEasing, opacity 0.4s 0s @returnEasing;
  pointer-events: none;
  box-sizing: unset;
}

.card-top {
  width: 100%;
  padding: 16px;
  position: absolute;
  top: 0;
  color: #fff;
  p {
    transition: 0.6s 1.6s @hoverEasing;
  }
  * {
    position: relative;
    z-index: 1;
  }
}

.card-bottom {
  width: 100%;
  padding: 16px;
  position: absolute;
  bottom: 0;
  color: #fff;
  transition: 0.6s 1.6s @hoverEasing;
  h1 {
    font-size: 20px;
    font-weight: 300;
    color: white;
    //text-shadow: rgba(0, 0, 0, 0.5) 0 10px 10px;
  }
  p {
    transition: 0.6s 1.6s @hoverEasing;
  }
  * {
    position: relative;
    z-index: 1;
  }
  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.6) 100%);
    background-blend-mode: overlay;
    transition: 5s 1s @returnEasing;
  }
}
</style>
