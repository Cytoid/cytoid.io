<script setup lang="ts">
defineProps<{
  post: PostData
}>()

interface PostData {
  uid: string
  title?: string | null
  slogan?: string | null
  cover?: {
    stripe?: string | null
  } | null
  creationDate?: string | null
}
</script>

<template>
  <BaseCard
    :to="{ name: 'posts-id', params: { id: post.uid } }"
    :cover="post.cover?.stripe ?? undefined"
    class="h-44"
  >
    <div v-if="post.creationDate" class="px-2 py-1 w-full flex flex-row items-center">
      {{ dateFromNow(post.creationDate) }}
    </div>
    <div class="flex-1" />
    <div class="px-2 py-1 w-full flex flex-row items-center">
      <div class="w-full">
        <h2 class="card-title block truncate">
          {{ post.title }}
        </h2>
        <h2 v-if="post.slogan" class="text-neutral-content opacity-80 truncate">
          {{ post.slogan }}
        </h2>
      </div>
    </div>
  </BaseCard>
</template>
