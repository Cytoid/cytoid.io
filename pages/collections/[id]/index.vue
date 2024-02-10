<script setup lang="ts">
const route = useRoute()
const collectionId = route.params.id as string

const { user } = useAuth()

const query = gql(`
  query FetchCollection($uid: String!) {
    collection(uid: $uid) {
      id
      uid
      title
      slogan
      description
      creationDate
      modificationDate
      tags
      state
      cover {
        original
      }
      owner {
        id
        uid
        name
        avatar {
          large
        }
      }
      levels {
        id
        uid
        title
        owner {
          id
          uid
          name
          avatar {
            small
          }
        }
        metadata {
          title_localized
          artist {
            name
          }
        }
        bundle {
          backgroundImage {
            thumbnail
          }
          musicPreview
        }
        charts {
          type
          difficulty
          name
          notesCount
        }
      }
      metadata {
        cover {
          name
          url
        }
      }
    }
  }
`)

const { data, error } = await useAsyncData(() => useQuery(query, {
  uid: collectionId,
}))
const collection = computed(() => data.value?.collection)
if (collectionId && !collection.value) {
  showError(error.value?.message ?? createError({
    statusCode: 404,
    message: `Collection not found: ${collectionId}`,
  }))
}
else {
  useSWR()
}

defineCytoidPage({
  title: collection.value?.title ?? 'Collection',
  background: collection.value?.cover?.original ?? undefined,
}, {
  unsafeDescription: collection.value?.description,
  author: collection.value?.owner?.name ?? collection.value?.owner?.uid ?? undefined,
})
</script>

<template>
  <LayoutContent v-if="collection">
    <template #contentTitle>
      <h1 class="text-5xl font-bold">
        {{ collection.title }}
      </h1>
      <p v-if="collection.slogan" class="text-xl pt-6">
        {{ collection.slogan }}
      </p>
      <div
        v-if="user && (['admin', 'moderator'].includes(user.role) || user.id === collection.owner?.id)"
        class="mt-6 flex gap-3 flex-wrap max-w-xl"
      >
        <NuxtLink
          class="btn btn-neutral"
          :to="{ name: 'collections-id-manage', params: { id: collection.uid } }"
        >
          <Icon name="mdi:briefcase" size="24" class="mr-2" />
          {{ $t('general.manage_btn') }}
        </NuxtLink>
      </div>
    </template>

    <template #additionContent>
      <div v-if="collection.state === 'UNLISTED'" class="alert alert-info shadow-lg mt-6">
        <Icon name="mdi:eye-off-outline" size="24" />
        <span> {{ $t('collection_details.message_unlisted') }} </span>
      </div>
      <div v-else-if="collection.state === 'PRIVATE'" class="alert alert-warning shadow-lg mt-6">
        <Icon name="mdi:lock-outline" size="24" />
        <span> {{ $t('collection_details.message_private') }} </span>
      </div>
    </template>

    <template #subContent>
      <div class="flex flex-col gap-5">
        <div class="card w-full bg-base-100 shadow-xl">
          <div class="card-body flex flex-col gap-4">
            <UserAuthor
              v-if="collection.owner"
              :avatar="collection.owner.avatar.large ?? undefined"
              :name="collection.owner.name || collection.owner.uid || 'Unknown'"
              :uid="collection.owner.uid ?? undefined"
            />
            <div class="prose prose-sm max-w-none" v-html="useMarked(collection.description ?? '')" />
            <div class="flex flex-col gap-2">
              <p class="card-subtitle pt-6">
                {{ $t('level_details.details_card_tags_title') }}
              </p>
              <div v-if="collection.tags.length && collection.tags.length > 0">
                <NuxtLink
                  v-for="tag in collection.tags"
                  :key="tag"
                  class="badge badge-neutral select-none mr-2 my-1 max-w-full"
                  :href="`/levels?tags=${tag.toLowerCase()}`"
                >
                  <span class="truncate" v-text="tag" />
                </NuxtLink>
              </div>
              <div v-else class="opacity-60 select-none">
                None
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <p class="card-subtitle">
                {{ $t('collection_details.modification_date_title') }}
              </p>
              <p>
                {{
                  dateFormatCalendar(collection.modificationDate)
                }}, {{
                  dateFromNow(collection.modificationDate)
                }}
              </p>
            </div>
            <div class="flex flex-col gap-2">
              <p class="card-subtitle">
                {{ $t('collection_details.creation_date_title') }}
              </p>
              <p>
                {{
                  dateFormatCalendar(collection.creationDate)
                }}, {{
                  dateFromNow(collection.creationDate)
                }}
              </p>
            </div>
          </div>
        </div>
        <div class="card w-full bg-base-100 shadow-xl">
          <div class="card-body">
            <MetaBox v-if="collection.metadata" :metadata="collection.metadata" />
          </div>
        </div>
      </div>
    </template>

    <div class="card w-full bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-subtitle">
          Levels
        </h2>
        <div
          class="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          <LevelCard
            v-for="level, index in collection.levels" :key="index"
            class="h-48"
            :trim="true"
            :level="level"
          />
        </div>
      </div>
    </div>
  </LayoutContent>
</template>
