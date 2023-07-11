<template>
  <DefineAvatarBody>
    <div :class="{
      'badge border-0 badge-lg py-5 pl-0': true,
      'bg-transparent': transparent,
    }">
      <UserAvatarIcon :avatar="avatar" />
      <p class="px-2">
        {{ name }}
      </p>
    </div>
  </DefineAvatarBody>

  <a v-if="!uid">
    <AvatarBody />
  </a>

  <NuxtLink v-else :to="{name: 'profile-id', params: { id: uid }}">
    <AvatarBody />
  </NuxtLink>
</template>

<script setup lang="ts">
const [DefineAvatarBody, AvatarBody] = createReusableTemplate()

defineProps({
  avatar: {
    type: String,
    default: 'https://artifacts.cytoid.io/avatar.jpg'
  },
  name: {
    type: String,
    required: true
  },
  uid: {
    type: String,
    default: null
  },
  transparent: {
    type: Boolean,
    default: false
  }
})
</script>