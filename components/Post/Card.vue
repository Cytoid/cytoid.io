<script setup lang="ts">
const props = defineProps<{
  post: FragmentType<typeof PostCardData>
}>()

const PostCardData = gql(`
  fragment PostCardData on Post {
    id
    uid
    title
    slogan
    cover {
      stripe
    }
    creationDate
  }
`)

const post = computed(() => getFragmentData(PostCardData, props.post))
</script>

<template>
  <BaseCard
    :to="{ name: 'posts-id', params: { id: post.uid } }"
    :cover="post.cover?.stripe"
    class="h-44"
  >
    <div v-if="post.creationDate" class="flex w-full flex-row items-center px-2 py-1">
      {{ dateFromNow(post.creationDate) }}
    </div>
    <div class="flex-1" />
    <div class="flex w-full flex-row items-center px-2 py-1">
      <div class="w-full">
        <h2 class="card-title block truncate">
          {{ post.title }}
        </h2>
        <h2 v-if="post.slogan" class="truncate text-neutral-content opacity-80">
          {{ post.slogan }}
        </h2>
      </div>
    </div>
  </BaseCard>
</template>
