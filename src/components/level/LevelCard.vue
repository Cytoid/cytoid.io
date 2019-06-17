<template lang="pug">
.card-wrap(
  ref="card"
  @mousemove="handleMouseMove"
  @mouseenter="handleMouseEnter"
  @mouseleave="handleMouseLeave"
)
  .card
    .card-bg(:style="[cardBgTransform, cardBgImage]")
    nuxt-link.card-overlay(:to="{ name: 'levels-id', params: { id: value.uid } }")
    .card-top
      difficulty-badge(class="ele3" v-for="chart in value.charts" :key="chart.id" :value="chart" :ball="true" :name="false" style="margin-right: 4px;")
    .card-bottom
      .info-text
        p.artist(v-text="value.metadata.artist.name")
        h1.title(v-text="value.title")
        p.title-localized(v-if="value.metadata.title_localized" v-text="value.metadata.title_localized")
        nuxt-link.profile-link(
          v-if="value.owner"
          :to="{name: 'profile-id', params: { id: value.owner.uid || value.owner.id }}"
        )
          a-avatar(:size="24" :src="value.owner.avatarURL" style="margin-right: 8px;")
          span(v-text="value.owner.name || value.owner.uid")

      play-button(:src="value.bundle.music_preview")
</template>

<script>
import PlayButton from '@/components/level/PlayButton'
import DifficultyBadge from '@/components/level/DifficultyBadge'
export default {
  components: {
    DifficultyBadge,
    PlayButton,
  },
  props: {
    value: {
      type: Object,
      required: true
    },
  },
  data: () => ({
    mouseX: null,
    mouseY: null,
    offsetTop: null,
    offsetLeft: null,
  }),
  computed: {
    mousePX() {
      return this.mouseX / this.$refs.card.offsetWidth
    },
    mousePY() {
      return this.mouseY / this.$refs.card.offsetHeight
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
        backgroundImage: `url(${
          this.$img(this.value.bundle.background, {
            maxWidth: 320,
            maxHeight: 200,
            fitMode: 'crop',
            cropMode: 'entropy',
          })
        })`,
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
    handleMouseMove(e) {
      const target = this.$refs.card
      if (!target) {
        // Bugfix for vue routing bug. Event sent after component destruction.
        return
      }
      const offset = this.getOffset(this.$refs.card)
      this.offsetLeft = offset.left
      this.offsetTop = offset.top
      this.mouseX = e.pageX - this.offsetLeft - target.offsetWidth / 2
      this.mouseY = e.pageY - this.offsetTop - target.offsetHeight / 2
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
    getOffset(el) {
      let _x = 0
      let _y = 0
      while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        _x += el.offsetLeft - el.scrollLeft
        _y += el.offsetTop - el.scrollTop
        el = el.offsetParent
      }
      return { top: _y, left: _x }
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

.card-wrap {
  position: relative;
  width: 100%;
  padding-top: 62.5%;
  &:hover {
    .card {
      transition: 0.4s @hoverEasing, box-shadow 0.4s @hoverEasing;
      box-shadow: @ele3; //rgba(255, 255, 255, 0.2) 0 0 40px 5px, white 0 0 0 1px, rgba(0, 0, 0, 0.66) 0 30px 60px 0, inset #333 0 0 0 5px, inset white 0 0 0 6px;
    }
    .card-bg {
      transition: 0.4s @hoverEasing, opacity 0.4s @hoverEasing;
      transform: scale(1.02, 1.02) translateX(var(--translate-x, 0)) translateY(var(--translate-y, 0));
      border-radius: 4px;
      // transform: scale(1.02, 1.02) translateX(var(--translate-x, 0)) translateY(var(--translate-y, 0));
      opacity: 0.8;
    }
  }
}
.card {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  flex: 0 0 240px;
  background-color: #333;
  overflow: hidden;
  border-radius: 4px;
  box-shadow: @ele2; //rgba(0, 0, 0, 0.66) 0 px 60px 0, inset #333 0 0 0 5px, inset rgba(255, 255, 255, 0.5) 0 0 0 6px;
  transition: 0.4s @returnEasing;
  &:active {
    transform: scale(0.98, 0.98);
  }
  padding: 16px;
  .card-overlay {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    background-image: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
    background-blend-mode: overlay;
    cursor: default;
  }
  .card-bg {
    opacity: 0.5;
    position: absolute;
    top: -@card-background-gutter;
    left: -@card-background-gutter;
    width: 100%;
    height: 100%;
    padding: @card-background-gutter;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    transition: 0.2s @returnEasing, opacity 0.4s @returnEasing;
    pointer-events: none;
    box-sizing: unset;
  }

  display: flex;
  flex-direction: column;
  .card-top {
    color: #fff;
    * {
      position: relative;
      z-index: 1;
    }
  }
  .card-bottom {
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    min-height: 0; // Without this, the container won't narrow past the implied height of the texts
    color: white;
    .info-text {
      flex-grow: 1;
      min-width: 0; // To make the texts shrink
      pointer-events: none;
      .artist {
        color: rgba(255, 255, 255, 0.7);
        font-size: 12px;
        margin-bottom: 8px;
        line-height: 1.1;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        text-shadow: @text-ele;
        user-select: none;
      }

      .title {
        font-size: 20px;
        font-weight: 300;
        color: white;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        margin-left: -1px;
        margin-bottom: 4px;
        line-height: 1.1;
        text-shadow: @text-ele;
        user-select: none;
      }

      .title-localized {
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 0;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        text-shadow: @text-ele;
        user-select: none;
      }

      .profile-link {
        pointer-events: auto;
        margin-top: 8px;
        color: white;
        display: block;
        width: fit-content;

        & > span {
          text-shadow: @text-ele;
          vertical-align: middle;
        }
      }
    }
    * {
      z-index: 1;
      position: relative;
    }
  }
}
</style>
