<script setup lang="ts">
const props = defineProps<{
  category: 'level' | 'profile' | 'collections'
  thread: string
}>()
const loading = ref(true)
const data = ref<CommentResponse[]>([])

onMounted(() => {
  nextTick(async () => {
    const res = await useServiceFetch<CommentResponse[]>(`threads/${props.category}/${props.thread}`)
    if (res.data.value) {
      data.value.push(...res.data.value)
    }
    loading.value = false
  })
})

function afterPost(newPost: CommentResponse) {
  data.value.push(newPost)
}
</script>

<template>
  <ClientOnly>
    <div class="space-y-4 mt-8 p-1">
      <Captcha v-slot="{ verify }">
        <CommentCreate :category="category" :thread="thread" :verify="verify" :after-post="afterPost" />
        <progress v-if="loading" class="progress progress-info w-full" />
        <CommentContent v-for="post in data" :key="post.id" :post="post" :category="category" :thread="thread" :verify="verify" />
      </Captcha>
    </div>
  </ClientOnly>
</template>
