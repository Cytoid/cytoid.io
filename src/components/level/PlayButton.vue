<template>
  <button class="play-button" @click.stop="play">
    <font-awesome-icon :icon="playing ? 'pause' : 'play'" fixed-width />
    <a-progress
      v-if="playing"
      type="circle"
      :percent="progress * 100"
      :show-info="false"
      :width="36"
      stroke-line-cap="square"
      stroke-color="#fff"
    />
    <audio ref="audio" :src="src" preload="none" @timeupdate="playbackUpdate" @ended="playbackEnded" />
  </button>
</template>

<script>
import Vue from 'vue'
export const Bus = new Vue()

export default {
  props: {
    src: {
      required: true,
      type: String,
    }
  },
  data: () => ({
    playing: false,
    progress: 0,
  }),
  mounted() {
    Bus.$on('play', this.playbackInterrupted)
  },
  beforeDestroy() {
    Bus.$off('play', this.playbackInterrupted)
  },
  methods: {
    play() {
      if (this.playing) {
        this.playing = false
        this.$refs.audio.pause()
      } else {
        this.playing = true
        this.$refs.audio.play()
        Bus.$emit('play', this.src)
      }
    },
    playbackUpdate() {
      const player = this.$refs.audio
      if (player) {
        this.progress = player.currentTime / player.duration
      }
    },
    playbackEnded() {
      this.progress = 0
      this.playing = false
    },
    playbackInterrupted(id) {
      if (id === this.src) {
        return
      }
      this.$refs.audio.pause()
      this.playing = false
    }
  }
}
</script>

<style lang="less">
@play-button-size: 16px;
.play-button {
  background: none;
  font-size: @play-button-size;
  padding: 0;
  border: none;
  outline: none;
  user-select: none;
  .anticon {
    display: block;
  }
  &:hover {
     transform: scale(1.1, 1.1);
   }
  &:active {
     transform: scale(0.95, 0.95);
   }
  transition: 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  .ant-progress {
    display: block;
    position: absolute;
    top: -7px;
    left: -8px;
  }
  .ant-progress-circle-trail {
    stroke: transparent;
  }
}
</style>
