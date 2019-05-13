<template>
  <div class="player-avatar">
    <nuxt-link :to="'/profile/' + player.name">
      <a-avatar :size="64" :src="player.image" />
      <span v-text="player.name" class="player-avatar-name"></span>
    </nuxt-link>
  </div>
</template>

<script>
export default {
  props: {
    player: {
      type: Object,
      required: true,
      default: () => {
        return {
          name: 'tigerhix',
          image: 'https://cytoid.io/api/avatar.php?size=256&id=tigerhix'
        }
      }
    },
  }
}
</script>

<style scoped>
.player-avatar {
  display: inline-block;
  transition: 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}
.player-avatar:hover {
  transform: scale(1.04, 1.04);
}
.player-avatar:active {
  transform: scale(0.98, 0.98);
}
.player-avatar a {
  color: white;
  text-decoration: none !important;
}
.player-avatar-name {
  margin-left: 8px;
  font-size: 16px;
}
</style>
