<template>
  <div class="container" style="margin-top: 256px;">
    <h1 style="margin-bottom: 0;" v-text="level.metadata.title" />
    <p style="font-size: 16px; margin-bottom: 16px;" v-text="level.metadata.artist.name" />
    <div style="margin-bottom: 48px;">
      <difficulty-badge :difficulty="{ type: 'easy', name: 'Easy', level: 6 }" />
      <difficulty-badge :difficulty="{ type: 'hard', name: 'Hard', level: 12 }" />
      <difficulty-badge :difficulty="{ type: 'extreme', name: 'EX', level: 17 }" />
    </div>
    <div style="margin-bottom: 32px;">
      <a-button type="primary" icon="download" size="large">Download (10.2MB)</a-button>
    </div>
    <div style="margin-bottom: 32px;">
      <a-rate :defaultValue="4.5" allowHalf />
      4.5 (273)
    </div>
    <div>
      <a-tag v-for="tag in level.tags" :key="tag">
        {{ tag }}
      </a-tag>
    </div>
  </div>
</template>

<script>
import DifficultyBadge from '@/components/level/DifficultyBadge'
export default {
  components: { DifficultyBadge },
  props: {
    level: {
      type: Object,
      required: true,
      default: () => {
        return JSON.parse('{"version":1,"title":"Cross Fire","metadata":{"title":"Cross Fire","artist":{"url":"https://twitter.com/uno_roughsketch","name":"Hommar ju vs RoughSketch"},"charter":{"name":"tigertiger"},"illustrator":{"name":"和魂を以て癒しみ、荒魂と闇を以て世界を試そう-{月夜見尊)-暮麗簾∞球Q"}},"duration":0,"description":"","tags":["tigertiger", "bms", "bofu2018"],"id":6,"uid":"tigertiger.crossfire","published":true,"creationDate":"2019-03-14T05:54:10.531Z","modificationDate":"2019-03-14T05:54:10.531Z","bundle":{"music":"https://assets.cytoid.io/levels/bundles/uyOBTeCPMQ7kpbuyHEF7sSDkWHTH6X8Y1pJHmh/bgm.mp3","background":"https://assets.cytoid.io/levels/bundles/uyOBTeCPMQ7kpbuyHEF7sSDkWHTH6X8Y1pJHmh/songcover.png","music_preview":"https://assets.cytoid.io/levels/bundles/uyOBTeCPMQ7kpbuyHEF7sSDkWHTH6X8Y1pJHmh/pv.mp3"}}')
      }
    },
    defaultDifficulty: {
      type: Object,
      required: true,
      default: () => {
        return JSON.parse('{"type": "extreme", "name": "EX"}')
      }
    }
  },
}
</script>
