<template>
  <div class="card-container">
    <a href="/levels/">
      <div
        ref="card"
        class="card-wrap"
        @mousemove="handleMouseMove"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        <div
          class="card"
          :style="cardStyle"
        >
          <div class="card-bg" :style="[cardBgTransform, cardBgImage]" />
          <div class="card-info">
            <h1 style="margin-bottom: 4px;" v-text="level.title" />
            <p>This is the subtitle</p>
            <a-row type="flex" align="middle">
              <a-col :span="20" style="display: flex; align-items: center;">
                <span style="display: flex; align-items: center;">
                  <a-avatar :size="24" icon="user" style="margin-right: 8px;" />
                  <a href="/profile/" style="color: white;" v-text="'ddd'" />
                </span>
              </a-col>
              <a-col :span="4" style="display: flex; align-items: center; justify-content: flex-end;">
                <a-icon type="caret-right" style="font-size: 24px;" />
              </a-col>
            </a-row>
          </div>
        </div>
      </div>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    level: {
      type: Object,
      required: true
    },
  },

  data: () => ({
    width: 0,
    height: 0,
    mouseX: 0,
    mouseY: 0,
    mouseLeaveDelay: null,
  }),

  computed: {
    mousePX() {
      return this.mouseX / this.width
    },
    mousePY() {
      return this.mouseY / this.height
    },
    cardStyle() {
      const rX = this.mousePX * 6
      const rY = this.mousePY * -6
      return {
        transform: `rotateY(${rX}deg) rotateX(${rY}deg)`,
      }
    },
    cardBgTransform() {
      const tX = this.mousePX * -10
      const tY = this.mousePY * -10
      return {
        transform: `translateX(${tX}px) translateY(${tY}px) scale(${this.mouseX * this.mouseY === 0 ? 1.00 : 1.02}, ${this.mouseX * this.mouseY === 0 ? 1.00 : 1.02})`,
      }
    },
    cardBgImage() {
      return {
        backgroundImage: `url(${this.level.bundle.background})`,
      }
    },
  },

  mounted() {
    this.width = this.$refs.card.offsetWidth
    this.height = this.$refs.card.offsetHeight
  },

  methods: {
    handleMouseMove(e) {
      this.mouseX = e.pageX - this.$refs.card.offsetLeft - this.width / 2
      this.mouseY = e.pageY - this.$refs.card.offsetTop - this.height / 2
    },
    handleMouseEnter() {
      clearTimeout(this.mouseLeaveDelay)
    },
    handleMouseLeave() {
      this.mouseLeaveDelay = setTimeout(() => {
        this.mouseX = 0
        this.mouseY = 0
      }, 200)
    },
  },
}
</script>

<style scoped>
  h1 {
    margin-bottom: 0;
  }
  p {
    margin-bottom: 0;
  }
</style>
