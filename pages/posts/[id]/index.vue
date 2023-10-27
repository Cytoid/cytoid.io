<script setup lang="ts">
const route = useRoute()
const postId = route.params.id as string

const { user } = useAuth()

const query = gql(/* GraphQL */`
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
        ...PostLevelCardFragment
      }
      collection {
        ...PostCollectionInfoFragment
        levels(limit: 5) {
          ...PostLevelCardFragment
        }
      }
    }
  }
  fragment PostLevelCardFragment on Level {
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
      music
      musicPreview
    }
    charts {
      type
      difficulty
      name
      notesCount
    }
  }
  fragment PostCollectionInfoFragment on Collection {
    id
    uid
    title
    slogan
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
  }
`)

const { data, error } = await useAsyncData(() => useQuery(query, {
  uid: postId,
}))
const post = computed(() => data.value?.post)
if (postId && !post) {
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
      <p v-if="post.slogan" class="text-xl pt-6">
        {{ post.slogan }}
      </p>
      <div
        v-if="user && ['admin', 'moderator'].includes(user.role)"
        class="mt-6 flex gap-3 flex-wrap max-w-xl"
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
      <div v-if="post.state === 'UNLISTED'" class="alert alert-info shadow-lg mt-6">
        <Icon name="mdi:eye-off-outline" size="24" />
        <span> This post has expired </span>
      </div>
      <div v-else-if="post.state === 'PRIVATE'" class="alert alert-warning shadow-lg mt-6">
        <Icon name="mdi:lock-outline" size="24" />
        <span> This post is not published </span>
      </div>

      <!-- Post Collection -->
      <template
        v-if="post.collection"
      >
        <div class="h-6" />
        <ShowCase
          :cover="post.collection.cover?.thumbnail"
          class="mt-4"
        >
          <template #desperation>
            <div class="px-2 py-1 w-full flex flex-row items-center">
              <div class="w-full">
                <h2 class="card-title block truncate">
                  {{ post.collection.title }}
                </h2>
                <h2 class="text-neutral-content opacity-80 truncate">
                  {{ post.collection.slogan }}
                </h2>
              </div>
            </div>
          </template>

          <template #subDesperation>
            <div class="px-2 w-full flex flex-row items-center">
              <div>
                <UserAvatar
                  v-if="post.collection.owner"
                  :avatar="post.collection.owner.avatar?.small ?? undefined"
                  :name="post.collection.owner.name ?? post.collection.owner.uid ?? undefined"
                  :uid="post.collection.owner.uid ?? undefined"
                  :transparent="true"
                  class="h-8"
                />
              </div>
            </div>
          </template>
          <LevelCard
            v-for="level, index in post.collection.levels" :key="index"
            class="h-48"
            :trim="true"
            :level="level"
          />
        </ShowCase>
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
        <div class="prose lg:prose-lg max-w-none" v-html="useSafeMarked(post?.content ?? '')" />
      </div>
    </div>
  </LayoutContent>
</template>
