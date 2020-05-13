<template functional lang="pug">
  nuxt-link.player-avatar(
    :to="{ name: 'profile-id', params: { id: props.player.uid || props.player.id } }")
    avatar(:size="64" :source="props.player.avatar.large" fixed)
    span.player-avatar-name(v-text="props.player.name || props.player.uid")
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

<style lang="scss">
.player-avatar {
  display: flex;
  flex-direction: row;
  transition: 0.2s cubic-bezier(0.23, 1, 0.32, 1);
  align-items: center;
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
  &:hover {
    transform: scale(0.98, 0.98);
  }
  &:active {
    transform: scale(0.95, 0.95);
  }
  .player-avatar-name {
    margin-left: 8px;
    font-size: 1rem;
  }
}
</style>
