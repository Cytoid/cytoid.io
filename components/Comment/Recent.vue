<script setup lang="ts">
import type { RouteLocationRaw } from '#vue-router'

defineProps<{
  comment: CommentData
}>()

interface CommentData {
  content: string
  date?: string
  owner?: {
    uid: string
    name?: string | null
    avatar?: {
      small: string
    }
  } | null
  metadata?: {
    path: RouteLocationRaw
    title: string
  }
}
</script>

<template>
  <div class="card-compact">
    <div class="recent-comment-reset-px card-body">
      <NuxtLink v-if="comment.metadata" :to="comment.metadata.path">
        {{ comment.metadata.title }}
      </NuxtLink>
      <p> {{ comment.content }}</p>
      <div class="flex-warp flex w-full flex-row items-center gap-2">
        <UserAvatar
          v-if="comment.owner"
          :avatar="comment.owner.avatar?.small ?? undefined"
          :name="comment.owner.name || comment.owner.uid"
          :uid="comment.owner.uid"
          :size="6"
          :transparent="true"
        />
        <div class="flex-1" />
        <p v-if="comment.date" class="w-fit flex-none grow-0 text-xs">
          {{ dateFromNow(comment.date) }}
        </p>
      </div>
    </div>
  </div>
</template>

<style>
.card-compact > .card-body.recent-comment-reset-px {
  padding-left: 0;
  padding-right: 0;
}
</style>
