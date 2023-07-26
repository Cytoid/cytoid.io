<script setup lang="ts">
const props = defineProps({
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
const sizeClassName = computed(() => {
  switch (props.size) {
    case 4:
      return 'h-4'
    case 6:
      return 'h-6'
    case 10:
      return 'h-10'
    case 12:
      return 'h-12'
    case 16:
      return 'h-16'
  }
  return 'h-8'
})
const [DefineAvatarIconBody, AvatarIconBody] = createReusableTemplate()
</script>

<template>
  <DefineAvatarIconBody>
    <div class="avatar">
      <div class="rounded-full" :class="sizeClassName">
        <img :src="avatar">
      </div>
    </div>
  </DefineAvatarIconBody>

  <AvatarIconBody v-if="!uid" />

  <NuxtLink v-else :to="{ name: 'profile-id', params: { id: uid } }">
    <AvatarIconBody />
  </NuxtLink>
</template>
