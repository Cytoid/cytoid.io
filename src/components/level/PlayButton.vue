<template>
  <button class="play-button" @click.stop="play">
    <a-icon :type="playing ? 'pause' : 'caret-right'" class="icon" />
    <a-progress v-if="playing" type="circle" :percent="progress * 100" :show-info="false" :width="48" />
    <audio ref="audio" :src="src" />
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
    const player = this.$refs.audio
    player.addEventListener('timeupdate', this.playbackUpdate)
    player.addEventListener('ended', this.playbackEnded)
    Bus.$on('play', this.playbackInterrupted)
  },
  beforeDestroy() {
    const player = this.$refs.audio
    player.removeEventListener('timeupdate', this.playbackUpdate)
    player.removeEventListener('ended', this.playbackEnded)
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
      this.progress = player.currentTime / player.duration
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
@play-button-size: 24px;
.play-button {
  background: none;
  font-size: @play-button-size;
  padding: @play-button-size/2;
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
     color: @primary-color;
   }
  transition: 0.6s cubic-bezier(0.23, 1, 0.32, 1);

  .ant-progress {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
