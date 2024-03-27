<script setup lang="ts">
import type { CollectionInput } from '#build/urql-client/codegen/default/graphql'

definePageMeta({
  middleware: ['auth'],
})

const mutation = gql(`
  mutation StudioUpdateCollection($id: ID!, $data: CollectionInput!) {
    updateCollection(id: $id, input: $data) {
      id
    }
  }
`)

const route = useRoute()
const collectionId = route.params.id as string

const { user } = useAuth()

const query = gql(`
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

const { data, error } = await useAsyncQuery(query, {
  uid: collectionId,
})

const hasPermission = computed(() => {
  return data.value?.collection?.owner?.id === data.value?.my?.user?.id
    || ['admin', 'moderator'].includes(user.value?.role ?? '')
})
if (collectionId && !data.value?.collection) {
  showError(error.value?.message ?? createError({
    statusCode: 404,
    statusMessage: `Collection not found: ${collectionId}`,
  }))
}
else if (!hasPermission.value) {
  showError(createError({
    statusCode: 403,
    statusMessage: `You do not have permission to manage this collection: ${collectionId}`,
  }))
}

if (route.name === 'collections-id-manage') {
  navigateTo({ name: 'collections-id-manage-listing', params: { id: collectionId } }, {
    replace: true,
  })
}

async function submit(input: CollectionInput, levelCache?: { id: number, uid: string, title: string }[]) {
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
          { title: 'Edit Listing', icon: 'mdi:text-box-edit-outline', id: 'collections-id-manage-listing', to: { name: 'collections-id-manage-listing', params: { id: collectionId } } },
          { title: 'Edit Cover', icon: 'mdi:image-edit-outline', id: 'collections-id-manage-cover', to: { name: 'collections-id-manage-cover', params: { id: collectionId } } },
          { title: 'Edit Levels', icon: 'mdi:folder-edit-outline', id: 'collections-id-manage-levels', to: { name: 'collections-id-manage-levels', params: { id: collectionId } } },
        ]"
      />
    </template>

    <NuxtPage v-if="data?.collection" v-model="data" :submit="submit" :update-cover="updateCover" />
  </LayoutStudio>
</template>
