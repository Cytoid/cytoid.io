<script setup lang="ts">
withDefaults(defineProps<{
  avatar: string
  name?: string
  uid?: string
  transparent?: boolean
  reverse?: boolean
  size?: number
}>(), {
  avatar: 'https://artifacts.cytoid.io/avatar.jpg',
  transparent: false,
  reverse: false,
  size: 8,
})

const [DefineAvatarBody, AvatarBody] = createReusableTemplate()
</script>

<template>
  <DefineAvatarBody>
    <div
      class="badge border-0 badge-lg py-4 clickable flex" :class="{
        'bg-transparent': transparent,
        'pl-0': !reverse,
        'flex-row-reverse pr-0': reverse,
        'px-2': name,
        'px-0': !name,
      }"
    >
      <UserAvatarIcon :avatar="avatar" :size="size" />
      <p
        v-if="name"
        class="px-2"
        :class="{
          'pr-0': transparent && !reverse,
          'pl-0': transparent && reverse,
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
