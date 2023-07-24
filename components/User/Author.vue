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
      class="badge h-16 border-0 badge-lg py-4 px-2 clickable flex bg-transparent" :class="{
        'pl-0': !reverse,
        'flex-row-reverse pr-0': reverse,
      }"
    >
      <UserAvatarIcon :avatar="avatar" :size="16" />
      <p
        class="px-4"
        :class="{
          'pr-0': !reverse,
          'pl-0': reverse,
        }"
      >
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
