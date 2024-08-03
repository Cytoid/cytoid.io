<script setup lang="ts">
const route = useRoute()
const postId = route.params.id as string

const { isModerator } = useAuth()

const query = gql(`
  query GetPost($uid: String!) {
    post: getPost(uid: $uid) {
      id
      uid
      title
      type
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
      level {
        ...LevelCardData
      }
      collection {
        ...CollectionShowCaseData
      }
    }
  }
`)

const { data, error } = await useAsyncQuery(query, {
  uid: postId,
})
const post = computed(() => data.value?.post)
if (postId && !post.value) {
  showError(error.value?.message ?? createError({
    statusCode: 404,
    statusMessage: `Post not found: ${postId}`,
  }))
}
else {
  useSWR()
}

defineCytoidPage({
  title: post.value?.title ?? 'Post',
  background: post.value?.cover?.original ?? undefined,
})
</script>

<template>
  <LayoutContent v-if="post">
    <template #contentTitle>
      <h1 class="text-5xl font-bold">
        {{ post.title }}
      </h1>
      <p v-if="post.slogan" class="pt-6 text-xl">
        {{ post.slogan }}
      </p>
      <div
        v-if="isModerator"
        class="mt-6 flex max-w-xl flex-wrap gap-3"
      >
        <NuxtLink
          class="btn btn-neutral"
          :to="{ name: 'posts-id-manage', params: { id: post.uid } }"
        >
          <Icon name="mdi:briefcase" size="24" class="mr-2" />
          {{ $t('general.manage_btn') }}
        </NuxtLink>
      </div>
    </template>

    <template #additionContent>
      <div v-if="post.state === 'UNLISTED'" class="alert alert-info mt-6 shadow-lg">
        <Icon name="mdi:eye-off-outline" size="24" />
        <span> This post has expired </span>
      </div>
      <div v-else-if="post.state === 'PRIVATE'" class="alert alert-warning mt-6 shadow-lg">
        <Icon name="mdi:lock-outline" size="24" />
        <span> This post is not published </span>
      </div>

      <!-- Post Collection -->
      <template
        v-if="post.collection"
      >
        <div class="h-6" />
        <CollectionShowCase
          :collection="post.collection"
          class="mt-4"
        />
      </template>
    </template>

    <template #subContent>
      <div class="flex flex-col gap-5">
        <!-- Post Level -->
        <div v-if="post.level" class="card w-full bg-base-100 shadow-xl">
          <div class="card-body gap-6">
            <h2 class="card-subtitle">
              Level
            </h2>
            <LevelCard :level="post.level" class="h-48" :trim="true" />
          </div>
        </div>
        <div class="card w-full bg-base-100 shadow-xl">
          <div class="card-body gap-6">
            <div class="flex flex-col gap-2">
              <p class="card-subtitle">
                {{ $t('collection_details.modification_date_title') }}
              </p>
              <p>
                {{
                  dateFormatCalendar(post.modificationDate)
                }}, {{
                  dateFromNow(post.modificationDate)
                }}
              </p>
            </div>

            <div class="flex flex-col gap-2">
              <p class="card-subtitle">
                {{ $t('collection_details.creation_date_title') }}
              </p>
              <p>
                {{
                  dateFormatCalendar(post.creationDate)
                }}, {{
                  dateFromNow(post.creationDate)
                }}
              </p>
            </div>
          </div>
        </div>
        <div class="card w-full bg-base-100 shadow-xl">
          <div class="card-body">
            <MetaBox v-if="post.metadata" :metadata="post.metadata" />
          </div>
        </div>
      </div>
    </template>

    <div class="card w-full bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="prose max-w-none lg:prose-lg" v-html="useSafeMarked(post?.content ?? '')" />
      </div>
    </div>
  </LayoutContent>
</template>
