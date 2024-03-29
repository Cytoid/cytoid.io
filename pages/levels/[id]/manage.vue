<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
})

const route = useRoute()
const levelId = route.params.id as string

const query = gql(`
  query FetchLevelForEditing($uid: String!) {
    level(uid: $uid) {
      id
      uid
      title
      description
      state
      censored
      size
      tags
      creationDate
      modificationDate
      category
      owner {
        id
        uid
        name
        avatar { large }
      }
      charts {
        difficulty
        type
        name
        notesCount
      }
      metadata {
        title_localized
        artist {
          name
          localized_name
          url
        }
        illustrator {
          name
          url
        }
        charter {
          name
        }
        storyboarder {
          name
        }
      }
      rating {
        average
        total
        distribution
        rating
      }
      bundle {
        musicPreview
        backgroundImage {
          original
        }
      }
    }
    my {
      user {
        id
        role
      }
    }
  }
`)

const { data, error } = await useAsyncQuery(query, {
  uid: levelId,
})

const hasPermission = computed(() => {
  return data.value?.level?.owner?.id === data.value?.my?.user?.id
    || ['admin', 'moderator'].includes((data.value?.my?.user?.role ?? '').toLowerCase())
})
if (levelId && !data.value?.level) {
  showError(error.value?.message ?? createError({
    statusCode: 404,
    statusMessage: `Level not found: ${levelId}`,
  }))
}
else if (!hasPermission.value) {
  showError(createError({
    statusCode: 403,
    statusMessage: `You do not have permission to manage this level: ${levelId}`,
  }))
}

if (/^\/levels\/(.+)\/manage$/.exec(route.fullPath)) {
  navigateTo({ name: 'levels-id-manage-listing', params: { id: levelId } }, {
    replace: true,
  })
}

defineCytoidPage({
  title: `Manage ${data.value?.level?.title}`,
  background: data.value?.level?.bundle?.backgroundImage?.original ?? undefined,
})
</script>

<template>
  <LayoutStudio v-if="data?.level && hasPermission">
    <template #StudioMenu>
      <StudioMenu
        :active="route.name as string ?? undefined"
        :context="[
          'Level Manage',
          { title: 'Analytics', icon: 'ion:analytics-sharp', id: 'levels-id-manage-analytics', to: { name: 'levels-id-manage-analytics', params: { id: levelId } } },
          { title: 'Edit Listing', icon: 'mdi:text-box-edit-outline', id: 'levels-id-manage-listing', to: { name: 'levels-id-manage-listing', params: { id: levelId } } },
          { title: 'Edit Level', icon: 'mdi:folder-edit-outline', id: 'levels-id-manage-level', to: { name: 'levels-id-manage-level', params: { id: levelId } } },
        ]"
      />
    </template>

    <NuxtPage v-if="data?.level" v-model="data" />
  </LayoutStudio>
</template>
