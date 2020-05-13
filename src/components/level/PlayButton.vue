<script>
import Vue from 'vue'
export const Bus = new Vue()

function draw(size, progress) {
  const margin = size * 0.025
  const radius = (size / 2) - margin
  const angle = progress * 2 * Math.PI - Math.PI / 2 // breakpoint angle in unit circle
  return `\
  M ${size / 2},${margin}\
  A ${radius},${radius} 0 ${progress > 0.5 ? '1' : '0'} 1 ${size / 2 + radius * Math.cos(angle)}, ${size / 2 + radius * Math.sin(angle)}\
  `
}

export default {
  props: {
    src: {
      required: true,
      type: String,
    },
    embedded: {
      type: Boolean,
      default: false
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
  },
  render(h) {
    return <button class="play-button" vOn:click_stop={this.play}>
      <font-awesome-icon icon={this.playing ? 'pause' : 'play'} fixed-width />
      {this.playing && <svg class="play-button-progress" viewBox="0 0 36 36">
        <path class="trail" d={draw(36, this.progress)}/>
      </svg>}
      <audio ref="audio" src={this.src} preload="none" vOn:timeupdate={this.playbackUpdate} vOn:ended={this.playbackEnded} />
    </button>
  },
}
</script>

<style lang="scss">
$play-button-size: 16px;
.play-button {
  background: none;
  font-size: $play-button-size;
  padding: 0;
  border: none;
  outline: none;
  user-select: none;
  position: relative;
  &:hover {
     transform: scale(1.1, 1.1);
   }
  &:active {
     transform: scale(0.95, 0.95);
   }
  transition: 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  .play-button-progress {
    position: absolute;
    width: 36px;
    height: 36px;
    left: -8px;
    top: -7px;
    path.trail {
      stroke-width: 2px;
      stroke-linecap: round;
      fill-opacity: 0;
      stroke: white;
    }
  }
}
</style>
