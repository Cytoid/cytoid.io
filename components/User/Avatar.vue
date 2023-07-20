<script setup lang="ts">
defineProps({
  avatar: {
    type: String,
    default: 'https://artifacts.cytoid.io/avatar.jpg',
  },
  name: {
    type: String,
    required: true,
  },
  uid: {
    type: String,
    default: null,
  },
  transparent: {
    type: Boolean,
    default: false,
  },
  reverse: {
    type: Boolean,
    default: false,
  },
})

const [DefineAvatarBody, AvatarBody] = createReusableTemplate()
</script>

<template>
  <DefineAvatarBody>
    <div
      class="badge border-0 badge-lg py-4 px-2 clickable flex" :class="{
        'bg-transparent': transparent,
        'pl-0': !reverse,
        'flex-row-reverse pr-0': reverse,
      }"
    >
      <UserAvatarIcon :avatar="avatar" />
      <p class="px-2">
        {{ name }}
      </p>
    </div>
  </DefineAvatarBody>

  <a v-if="!uid" v-bind="$attrs">
    <AvatarBody />
  </a>

  <NuxtLink v-else v-bind="$attrs" :to="{ name: 'profile-id', params: { id: uid } }">
    <AvatarBody />
  </NuxtLink>
</template>
