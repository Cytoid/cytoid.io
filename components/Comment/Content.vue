<script setup lang="ts">
const props = withDefaults(defineProps<{
  category: string
  thread: string
  post: CommentResponse
  verify: () => Promise<string>
  lite?: boolean
}>(), {
  lite: false,
})

const showReply = ref(false)
const showMore = ref(false)
const loading = ref(true)
const data = ref<CommentResponse[]>([])

const replyCount = ref(props.post.count ?? 0)

watch(showMore, async (val) => {
  if (data.value.length === 0 && val) {
    const res = await useServiceFetch<CommentResponse[]>(`comments/${props.post.id}`)
    if (res.data.value) {
      data.value.push(...res.data.value)
    }
    loading.value = false
  }
})

function afterPost(newPost: CommentResponse) {
  data.value.push(newPost)
  replyCount.value += 1
}
</script>

<template>
  <div class="flex gap-x-4">
    <div v-if="!lite">
      <UserAuthor :size="12" :avatar="post.owner.avatar.small" :uid="post.owner.uid" class="h-12" />
    </div>
    <div
      class="card min-h-16 flex-1 overflow-hidden bg-base-100" :class="{
        'shadow-xl': !lite,
      }"
    >
      <div class="card-body p-6">
        <div class="flex items-center justify-start text-sm font-bold">
          <UserAvatar
            v-if="lite" :avatar="post.owner.avatar.small" :uid="post.owner.uid" :name="post.owner.name ?? post.owner.uid"
            :transparent="true"
          />
          <NuxtLink v-else :to="{ name: 'profile-id', params: { id: post.owner.uid } }">
            {{ post.owner.name || post.owner.uid }}
          </NuxtLink>
          <span class="pl-3 font-normal opacity-60">
            <span v-if="!lite" class="hidden sm:inline">
              {{ dateFormatCalendar(post.date) }},
            </span>
            {{ dateFromNow(post.date) }}
          </span>
        </div>
        <p class="prose break-words pl-4" v-html="useMarked(post.content)" />
        <div class="card-actions flex">
          <template v-if="replyCount">
            <button v-if="!showMore" class="btn btn-ghost btn-sm" @click="showMore = true">
              <Icon name="material-symbols:keyboard-arrow-down" class="mr-4" size="24" />
              {{ $t('general.comment_see_replies', replyCount) }}
            </button>
            <button v-else class="btn btn-ghost btn-sm" @click="showMore = false">
              <Icon name="material-symbols:keyboard-arrow-up" class="mr-4" size="24" />
              {{ $t('general.comment_hide_replies', replyCount) }}
            </button>
          </template>
          <div class="flex-1" />
          <button class="btn btn-primary btn-sm" @click="showReply = !showReply">
            {{ $t('general.comment_reply') }}
          </button>
        </div>
        <template v-if="showReply">
          <CommentCreate :parent-id="post.id" :category="category" :thread="thread" :verify="verify" :after-post="afterPost" />
        </template>
        <template v-if="showMore">
          <div class="border-l-8 border-solid border-gray-600" />
          <CommentContent v-for="_post in data" :key="_post.id" :category="category" :thread="thread" :post="_post" :verify="verify" :lite="true" class="border-l-2 border-solid border-gray-600" />
        </template>
      </div>
    </div>
  </div>
</template>
