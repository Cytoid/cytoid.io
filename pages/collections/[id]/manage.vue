<script setup lang="ts">
import type { CollectionInput } from '~/gql/graphql'

definePageMeta({
  middleware: ['auth'],
})

const mutation = gql(/* GraphQL */`
  mutation StudioUpdateCollection($id: ID!, $data: CollectionInput!) {
    updateCollection(id: $id, input: $data) {
      id
    }
  }
`)

const route = useRoute()
const CollectionId = route.params.id as string

const { user } = useAuth()

const query = gql(/* GraphQL */`
  query FetchCollectionForEditing($uid: String!) {
    collection(uid: $uid) {
      id
      uid
      title
      slogan
      description
      tags
      state
      cover {
        original
      }
      owner {
        id
      }
      levels {
        id
        uid
        title
      }
      metadata {
        cover {
          name
          localized_name
          url
        }
      }
    }
    my {
      user {
        id
      }
    }
  }
`)

const { data, error } = await useAsyncData(() => useQuery(query, {
  uid: CollectionId,
}))

const hasPermission = computed(() => {
  return data.value?.collection?.owner?.id === data.value?.my?.user?.id
    || ['admin', 'moderator'].includes(user.value?.role ?? '')
})
if (CollectionId && !data.value?.collection) {
  showError(error.value?.message ?? createError({
    statusCode: 404,
    statusMessage: `Level not found: ${CollectionId}`,
  }))
}
else if (!hasPermission) {
  showError(createError({
    statusCode: 403,
    statusMessage: `You do not have permission to manage this collection: ${CollectionId}`,
  }))
}

if (route.name === 'collections-id-manage') {
  navigateTo({ name: 'collections-id-manage-listing', params: { id: CollectionId } }, {
    replace: true,
  })
}

async function submit(input: CollectionInput, levelCache?: { id: number; uid: string; title: string }[]) {
  if (!data.value?.collection?.id) {
    return
  }

  await useMutation(mutation, {
    id: data.value?.collection?.id ?? '',
    data: input,
  })
  successAlert('Collection Saved')

  // update collection cache
  // listing
  data.value.collection.title = input.title ?? data.value.collection.title
  data.value.collection.slogan = input.slogan ?? data.value.collection.slogan
  data.value.collection.description = input.description ?? data.value.collection.description
  data.value.collection.tags = input.tags ?? data.value.collection.tags
  data.value.collection.state = input.state ?? data.value.collection.state

  // cover metadata
  if (input.metadata?.cover) {
    data.value.collection.metadata.cover = input.metadata.cover
  }
  // cover
  if (input.coverPath) {
    data.value.collection.cover = {
      original: input.coverPath,
    }
  }

  // levels
  if (levelCache) {
    data.value.collection.levels = levelCache.map(level => ({
      id: level.id,
      uid: level.uid,
      title: level.title,
    }))
  }
}

function updateCover(cover: string) {
  if (!data.value?.collection?.id) {
    return
  }
  data.value.collection.cover = {
    original: cover,
  }
}

defineCytoidPage({
  title: `Manage ${data.value?.collection?.title}`,
  background: data.value?.collection?.cover?.original ?? undefined,
})
</script>

<template>
  <LayoutStudio v-if="data?.collection && hasPermission">
    <template #StudioMenu>
      <StudioMenu
        :active="route.name as string ?? undefined"
        :context="[
          'Collection Manage',
          { title: 'Edit Listing', icon: 'mdi:text-box-edit-outline', id: 'collections-id-manage-listing', to: { name: 'collections-id-manage-listing', params: { id: CollectionId } } },
          { title: 'Edit Cover', icon: 'mdi:image-edit-outline', id: 'collections-id-manage-cover', to: { name: 'collections-id-manage-cover', params: { id: CollectionId } } },
          { title: 'Edit Levels', icon: 'mdi:folder-edit-outline', id: 'collections-id-manage-levels', to: { name: 'collections-id-manage-levels', params: { id: CollectionId } } },
        ]"
      />
    </template>

    <NuxtPage v-if="data?.collection" v-model="data" :submit="submit" :update-cover="updateCover" />
  </LayoutStudio>
</template>
