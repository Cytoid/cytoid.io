<script setup lang="ts">
import type { PostInput } from '#build/urql-client/codegen/default/graphql'
import { PostType } from '#build/urql-client/codegen/default/graphql'

definePageMeta({
  middleware: ['auth'],
})

const mutation = gql(`
  mutation StudioUpdatePost($id: ID!, $data: PostInput!) {
    updatePost(id: $id, input: $data) {
      id
    }
  }
`)

const route = useRoute()
const postId = route.params.id as string

const { user } = useAuth()

const query = gql(`
  query FetchPostForEditing($uid: String!) {
    post: getPost(uid: $uid) {
      id
      type
      uid
      title
      slogan
      content
      startDate
      endDate
      state
      locked
      epicId
      level {
        id
        uid
        title
      }
      collection {
        id
        uid
        title
      }
      cover {
        original
      }
      logo {
        original
      }
      metadata {
        cover {
          name
          localized_name
          url
        }
      }
    }
    }
`)

const { data, error } = await useAsyncQuery(query, {
  uid: postId,
})

const hasPermission = computed(() => {
  return ['admin', 'moderator'].includes(user.value?.role ?? '')
})
if (postId && !data.value?.post) {
  showError(error.value?.message ?? createError({
    statusCode: 404,
    statusMessage: `Post not found: ${postId}`,
  }))
}
else if (!hasPermission.value) {
  showError(createError({
    statusCode: 403,
    statusMessage: 'You do not have permission to manage posts',
  }))
}

if (route.name === 'posts-id-manage') {
  navigateTo({ name: 'posts-id-manage-listing', params: { id: postId } }, {
    replace: true,
  })
}

async function submit(
  input: PostInput,
  levelData?: { id: number, uid: string, title: string },
  collectionData?: { id: string, uid: string, title: string },
) {
  if (!data.value?.post?.id) {
    return
  }

  await useMutation(mutation, {
    id: data.value?.post?.id ?? '',
    data: input,
  })
  successAlert('Collection Saved')

  // update post cache
  // listing
  data.value.post.title = input.title ?? data.value.post.title
  data.value.post.slogan = input.slogan ?? data.value.post.slogan
  data.value.post.content = input.content ?? data.value.post.content
  data.value.post.state = input.state ?? data.value.post.state
  data.value.post.type = input.type ?? data.value.post.type
  data.value.post.locked = input.locked ?? data.value.post.locked

  // cover meta
  if (input.metadata?.cover) {
    data.value.post.metadata = {
      ...data.value.post.metadata,
      cover: input.metadata.cover,
    }
  }
  // cover
  if (input.coverPath) {
    data.value.post.cover = {
      original: input.coverPath,
    }
  }
  // logo
  if (input.logoPath) {
    data.value.post.logo = {
      original: input.logoPath,
    }
  }

  // event
  data.value.post.startDate = input.startDate ?? data.value.post.startDate
  data.value.post.endDate = input.endDate ?? data.value.post.endDate
  data.value.post.level = levelData ?? null
  data.value.post.collection = collectionData ?? null
}

function updateCover(cover: string) {
  if (!data.value?.post?.id) {
    return
  }
  data.value.post.cover = {
    original: cover,
  }
}

function updateLogo(logo: string) {
  if (!data.value?.post?.id) {
    return
  }
  data.value.post.logo = {
    original: logo,
  }
}

defineCytoidPage({
  title: `Manage ${data.value?.post?.title}`,
  background: data.value?.post?.cover?.original ?? undefined,
})
</script>

<template>
  <LayoutStudio v-if="data?.post && hasPermission">
    <template #StudioMenu>
      <StudioMenu
        :active="route.name as string ?? undefined"
        :context="[
          'Post Manage',
          { title: 'Edit Listing', icon: 'mdi:text-box-edit-outline', id: 'posts-id-manage-listing', to: { name: 'posts-id-manage-listing', params: { id: postId } } },
          { disabled: data.post.type === PostType.Page, title: 'Edit Cover / Logo', icon: 'mdi:image-edit-outline', id: 'posts-id-manage-cover', to: { name: 'posts-id-manage-cover', params: { id: postId } } },
          { disabled: data.post.type !== PostType.Event, title: 'Edit Event', icon: 'mdi:folder-edit-outline', id: 'posts-id-manage-event', to: { name: 'posts-id-manage-event', params: { id: postId } } },
        ]"
      />
    </template>

    <NuxtPage v-if="data?.post" v-model="data" :submit="submit" :update-cover="updateCover" :update-logo="updateLogo" />
  </LayoutStudio>
</template>
