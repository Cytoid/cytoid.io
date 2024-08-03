<script setup lang="ts">
const route = useRoute()
const ownerId = route.query.owner as string | undefined
const limit = 24

const query = gql(`
  query FetchCollections($cursor: ID, $limit: Int!, $ownerId: String){
    collections(limit: $limit, cursor: $cursor, ownerId: $ownerId) {
      id
      uid
      cover {
        thumbnail
      }
      owner {
        id
        uid
        name
        avatar {
          small
        }
      }
      title
      slogan
      levelCount
      creationDate
    }
  }
`)

const { data } = await useAsyncQuery(query, {
  limit,
  cursor: null,
  ownerId,
})

const collections = ref(data.value?.collections ?? [])

const loading = ref(false)
const noMore = ref(collections.value.length < limit)

async function loadMore() {
  loading.value = true
  const newCollections = await useQuery(query, {
    limit,
    cursor: collections.value.length > 0 ? collections.value[collections.value.length - 1].id : null,
    ownerId,
  })
  const oldLength = collections.value.length
  if (newCollections?.collections && newCollections.collections.length > 0) {
    for (const collection of newCollections.collections) {
      // if the collection is not in the list
      if (collections.value.findIndex(c => c.id === collection.id) === -1) {
        collections.value.push(collection)
      }
    }
  }
  if (newCollections && (oldLength + limit > collections.value.length + newCollections.collections.length)) {
    noMore.value = true
  }
  loading.value = false
}
defineCytoidPage({
  title: 'Collections',
})
</script>

<template>
  <div class="flex flex-col gap-5">
    <div
      class="mt-8 grid gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 xl:gap-8"
    >
      <CollectionCard
        v-for="collection in collections" :key="collection.id"
        :collection="collection"
        class="h-56 shadow-xl"
      />
    </div>

    <button v-if="!noMore" class="btn btn-primary btn-block" @click="loadMore">
      {{ $t('general.more_btn') }}
    </button>
    <progress v-if="loading" class="progress progress-info w-full" />
  </div>
</template>
