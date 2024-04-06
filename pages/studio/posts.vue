<script setup lang="ts">
import type { PostType, ResourceState } from '#build/urql-client/codegen/default/graphql'

const router = useRouter()
const { ready, isModerator } = useAuth()

const query = gql(`
  query StudioGetPosts {
    posts: getPosts(limit: 100, all: true) {
      id
      type
      uid
      title
      slogan
      creationDate
      state
      cover {
        sized(height: 90, width: 160)
      }
    }
  }
`)
const mutationCreate = gql(`
  mutation StudioCreatePost($data: PostInput!) {
    post: createPost(post: $data) {
      id
      uid
    }
  }
`)
const mutationDelete = gql(`
  mutation StudioDeletePost($id: ID!) {
    deletePost(id: $id) {
      id
    }
  }
`)

const posts = ref<StudioPostData[]>([])

const newPostTitle = ref('')
const newPostUid = ref('')

const creatingPost = ref(false)
const loading = ref(false)
const mutationLoading = ref(false)

const willDeletePostUid = ref<string | null>(null)
const willDeletePost = computed(() => posts.value.find(post => post.uid === willDeletePostUid.value) ?? null)

onMounted(() => {
  nextTick(async () => {
    try {
      await until(ready).toBeTruthy({ timeout: 1000, throwOnTimeout: true })
      if (!isModerator) {
        throw new Error('Permission denied')
      }
      else {
        await loadPosts()
      }
    }
    catch (error) {
      console.error(error)
      router.push({
        name: 'studio',
      })
    }
  })
})

async function loadPosts() {
  loading.value = true
  const data = await useQuery(query)
  if (!data?.posts) {
    errorAlert('Failed to load posts')
    return
  }
  posts.value = data.posts
  loading.value = false
}

async function createPost() {
  mutationLoading.value = true
  try {
    await useMutation(mutationCreate, {
      data: {
        title: newPostTitle.value,
        uid: newPostUid.value,
      },
    })
    router.push({
      name: 'posts-id-manage',
      params: {
        id: newPostUid.value,
      },
    })
  }
  catch (error) {
    handleErrorToast(error as Error)
  }
  mutationLoading.value = false
}
async function deletePost() {
  if (!willDeletePost.value?.id) {
    return
  }
  mutationLoading.value = true
  try {
    await useMutation(mutationDelete, {
      id: willDeletePost.value?.id.toString(),
    })
    posts.value = posts.value.filter(post => post.uid !== willDeletePostUid.value)
    warningAlert('Post deleted')
    willDeletePostUid.value = null
  }
  catch (error) {
    handleErrorToast(error as Error)
  }
  mutationLoading.value = false
}

interface StudioPostData {
  id: string
  type: PostType
  uid: string
  title?: Maybe<string>
  slogan?: Maybe<string>
  creationDate?: Maybe<string>
  state: ResourceState
  cover?: Maybe<{
    sized?: Maybe<string>
  }>
}
</script>

<template>
  <div v-if="isModerator" class="flex w-full flex-col gap-5">
    <div class="card w-full overflow-hidden bg-base-100 shadow-xl">
      <div class="card-body gap-4">
        <h2 class="card-subtitle">
          Create a new post
        </h2>

        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">Title</span>
          </label>
          <input v-model="newPostTitle" type="text" class="input input-bordered w-full">
        </div>

        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">Uid</span>
          </label>
          <input v-model="newPostUid" type="text" class="input input-bordered w-full">
        </div>

        <div class="flex flex-col items-end gap-2">
          <button
            class="btn btn-primary"
            :disabled="!newPostUid || !newPostTitle || creatingPost"
            @click="createPost"
          >
            <span v-if="loading" class="loading loading-spinner" />
            Create
          </button>
        </div>
      </div>
    </div>

    <div class="card w-full overflow-hidden bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-subtitle">
          Manage
        </h2>
        <!-- Post List -->
        <div class="overflow-x-auto">
          <table class="table w-full">
            <!-- head -->
            <thead>
              <tr>
                <th>Post</th>
                <th>Type</th>
                <th>State</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="post in posts" :key="post.id">
                <!-- Post Content -->
                <td class="flex items-center space-x-3">
                  <div class="flex gap-4">
                    <div
                      class="aspect-video h-12 rounded-lg bg-cover sm:h-20"
                      :style="`background-image: url(&quot;${post.cover?.sized}&quot;)`"
                    >
                      <NuxtLink
                        :to="{ name: 'posts-id', params: { id: post.uid } }"
                        class="block size-full bg-base-200 opacity-0 transition-opacity duration-200 hover:opacity-25"
                      />
                    </div>
                    <div class="flex max-w-64 flex-col justify-center">
                      <div class="truncate font-bold">
                        {{ post.title }}
                      </div>
                      <div class="truncate text-sm opacity-50">
                        {{ post.uid }}
                      </div>
                      <div class="flex-warp flex gap-1">
                        <div class="flex gap-1">
                          <NuxtLink
                            class="btn btn-circle btn-ghost btn-sm"
                            :to="{ name: 'posts-id-manage', params: { id: post.uid } }"
                          >
                            <Icon name="mdi:briefcase-outline" size="18" />
                          </NuxtLink>
                          <button
                            class="btn btn-circle btn-ghost btn-sm"
                            :disabled="!!willDeletePostUid"
                            @click="willDeletePostUid = post.uid"
                          >
                            <Icon v-if="willDeletePostUid === post.uid" name="mdi:loading" size="18" class="animate-spin" />
                            <Icon v-else name="mdi:delete-outline" size="18" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Type -->
                <td>
                  <div class="flex flex-col">
                    <span class="flex whitespace-nowrap">
                      {{ post.type }}
                    </span>
                  </div>
                </td>

                <!-- State -->
                <td>
                  <div class="flex flex-col">
                    <span class="flex whitespace-nowrap">
                      {{ post.state }}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="loading" class="alert alert-info">
      <Icon name="mdi:loading" size="24" class="animate-spin" />
      <span>loading...</span>
    </div>
  </div>
  <div v-else class="alert alert-info">
    <Icon name="mdi:loading" size="24" class="animate-spin" />
    <span>Loading...</span>
  </div>

  <BaseConfirmDialog
    v-if="willDeletePostUid"
    type="error"
    :open="!!willDeletePost"
    :confirm="willDeletePostUid"
    :on-confirm="deletePost"
    :on-cancel="() => willDeletePostUid = null"
  >
    <template #title>
      Deleting {{ willDeletePost?.title || willDeletePostUid }}
    </template>

    <div class="flex w-full flex-col gap-4">
      <p>
        Are you sure you want to delete this post?
      </p>
      <p>
        To continue, please input the uid of the post <strong class="font-bold text-error">{{ willDeletePostUid }}</strong> to proceed.
      </p>
    </div>

    <template #buttonContext>
      {{ $t('general.delete_btn') }}
    </template>
  </BaseConfirmDialog>
</template>
