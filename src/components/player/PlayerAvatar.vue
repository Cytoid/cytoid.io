<template lang="pug">
  nuxt-link.player-avatar(:to="{ name: 'profile-id', params: { id: player.uid || player.id } }")
    avatar(:size="64" :src="player.avatarURL" fixed)
    span(v-text="player.name || player.uid" class="player-avatar-name")
</template>

<script>
export default {
  props: {
    player: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style scoped>
.player-avatar {
  display: inline-block;
  transition: 0.2s cubic-bezier(0.23, 1, 0.32, 1);
}
.player-avatar:hover {
  transform: scale(0.98, 0.98);
}
.player-avatar:active {
  transform: scale(0.95, 0.95);
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
