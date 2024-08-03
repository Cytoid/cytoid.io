<script setup lang="ts">
const route = useRoute()

const pageId = route.params.id as string

const query = gql(`
  query GetPosts($uid: String!) {
    page: getPost(uid: $uid) {
      id
      uid
      title
      slogan
      content
      state
      creationDate
      modificationDate
      startDate
      endDate
      cover {
        original
      }
    }
  }
`)

const { data, error } = await useAsyncQuery(query, {
  uid: pageId,
})
if (pageId && !data.value?.page) {
  showError(error.value?.message ?? createError({
    statusCode: 404,
    statusMessage: `Page not found: ${pageId}`,
  }))
}
else {
  useSWR()
}

if (data.value?.page?.title) {
  defineCytoidPage({
    title: data.value?.page?.title,
  })
}
else {
  resetCytoidPage()
}
</script>

<template>
  <div v-if="data?.page" class="mx-auto max-w-4xl">
    <div class="relative h-24">
      <div id="contentTitle" class="absolute bottom-0 left-0">
        <h1 class="text-4xl font-bold">
          {{ data.page.title }}
        </h1>
      </div>
    </div>
    <div v-if="data.page.content" class="mt-4">
      <div class="mt-4 md:mt-0">
        <div class="card w-full bg-base-100 shadow-xl">
          <div class="card-body">
            <div class="prose max-w-none lg:prose-lg" v-html="useSafeMarked(data.page.content)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
