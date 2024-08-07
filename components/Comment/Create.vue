<script setup lang="ts">
const props = defineProps<{
  parentId?: number
  category: string
  thread: string
  verify: () => Promise<string>
  afterPost: (newPost: CommentResponse) => void
}>()

const { user, isLogin, toLogin } = useAuth()

const small = computed(() => {
  return props.parentId !== undefined
})

const url = computed(() => {
  return props.parentId ? `/comments/${props.parentId}` : '/comments'
})

const post = ref('')
const loading = ref(false)

async function sendPost() {
  loading.value = true
  try {
    const res = await useServiceFetch<CommentResponse>(url.value, {
      method: 'POST',
      body: {
        captcha: await props.verify(),
        content: post.value,
        category: props.category,
        key: props.thread,
      },
    })
    if (res.data.value && user.value) {
      res.data.value.owner = {
        id: user.value.id,
        uid: user.value.uid,
        name: user.value.name,
        avatar: {
          small: avatarURL(user.value.id),
          original: avatarURL(user.value.id),
          medium: avatarURL(user.value.id),
          large: avatarURL(user.value.id),
        },
      }
      props.afterPost(res.data.value)
      post.value = ''
      successAlert('Comment Added')
    }
  }
  catch (error) {
    handleErrorToast(error as Error)
  }
  loading.value = false
}
</script>

<template>
  <div class="flex gap-x-4">
    <div v-if="!small">
      <UserAuthor :size="12" :avatar="user ? avatarURL(user.id) : undefined" :uid="user?.uid" class="h-12" />
    </div>
    <div
      class="card min-h-16 flex-1 overflow-hidden bg-base-100"
      :class="{
        'shadow-xl': !small,
      }"
    >
      <div class="card-body p-6">
        <div v-if="isLogin && user && small" class="mb-1 flex justify-start text-sm font-bold">
          <UserAvatar :avatar="avatarURL(user.id)" :uid="user.uid" :name="user.name ?? user.uid" :transparent="true" />
        </div>
        <textarea v-model="post" class="textarea textarea-primary h-48" :disabled="!isLogin" />
        <div class="card-actions justify-end pt-2">
          <button v-if="isLogin" class="btn btn-secondary btn-sm" :disabled="post.length === 0 || loading" @click="sendPost">
            {{ $t('general.comment_post') }}
          </button>
          <button v-else class="btn btn-warning btn-sm" @click="toLogin()">
            {{ $t('general.login_btn') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
