<script setup lang="ts">
defineProps({
  avatar: {
    type: String,
    default: 'https://artifacts.cytoid.io/avatar.jpg',
  },
  uid: {
    type: String,
    default: null,
  },
  size: {
    type: Number,
    default: 8,
  },
})
const [DefineAvatarIconBody, AvatarIconBody] = createReusableTemplate()
</script>

<template>
  <DefineAvatarIconBody>
    <div class="avatar">
      <div class="rounded-full" :class="`h-${size}`">
        <img :src="avatar">
      </div>
    </div>
  </DefineAvatarIconBody>

  <AvatarIconBody v-if="!uid" />

  <NuxtLink v-else :to="{ name: 'profile-id', params: { id: uid } }">
    <AvatarIconBody />
  </NuxtLink>
</template>
