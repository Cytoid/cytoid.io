<script setup lang="ts">
// import type { FetchHomePageLateQuery } from '#build/urql-client/codegen/default/graphql'

const query = gql(`
  query FetchHomePage {
    discordOnlineCount
    collectionsCount
    posts: getActivePosts(limit: 10) {
      id
      uid
      title
      slogan
      cover {
        stripe
      }
      creationDate
    }
    gettingStarted: collection(uid: "getting-started") {
      ...CollectionInfoFragment
    }
    hitech: collection(uid: "hi-tech") {
      ...CollectionInfoFragment
      levels(limit: 5) {
        ...HomeLevelCardFragment
      }
    }
    latestFeaturedLevels: levels(category: "featured", limit:1, sort: CREATION_DATE, order:DESC) {
      ...HomeLevelCardFragment
    }
    levelsCount
  }
  fragment HomeLevelCardFragment on Level {
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
    charts {
      type
      difficulty
      name
      notesCount
    }
    bundle {
      backgroundImage {
        thumbnail
      }
      music
      musicPreview
    }
  }
  fragment CollectionInfoFragment on Collection {
    id
    uid
    title
    slogan
    levelCount
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
const queryDynamic = gql(`
  query FetchHomePageLate {
    comments: recentComments(limit: 5) {
      id
      category
      key
      content
      date
      owner {
        id
        uid
        name
        avatar {
          small
        }
      }
      metadata
    }
    recentRecords(ranked:true, limit:10) {
      id
      date
      owner {
        id
        uid
        name
        avatar {
          small
        }
      }
      chart {
        id
        difficulty
        name
        type
        notesCount
        level {
          uid
          title
          bundle {
            backgroundImage {
            stripe
            }
          }
        }
      }
      score
      accuracy
      rank
    }
  }
`)
const { data } = await useAsyncQuery(query)
// const dataDynamic = ref<FetchHomePageLateQuery | undefined>(undefined)
const { data: dataDynamic } = await useAsyncQuery(queryDynamic)

const hitechMetaData = computed(() => data?.value?.hitech)
const hitechLevels = computed(() => data?.value?.hitech?.levels)
const latestFeaturedLevels = computed(() => data?.value?.latestFeaturedLevels)

// onMounted(() => {
//   nextTick(async () => {
//     dataDynamic.value = await useQuery(queryDynamic)
//   })
// })

useSWR(60)
resetCytoidPage()
</script>

<template>
  <Hero />

  <div v-if="data" class="mt-4 md:grid md:grid-cols-12 md:grid-flow-col md:gap-4">
    <div class="col-span-7 lg:col-span-8 mt-4 md:mt-0">
      <!-- News -->
      <div class="card overflow-hidden bg-base-100 w-full shadow-xl mb-5">
        <div class="card-body bg-primary/25">
          <h2 class="card-subtitle">
            {{ $t('homepage.news_title') }}
          </h2>

          <PostCard v-for="post in data.posts" :key="post.id" :post="post" />

          <NuxtLink :to="{ name: 'posts' }" class="btn btn-primary mt-4">
            {{ $t('homepage.news_previous') }}
          </NuxtLink>
        </div>
      </div>
    </div>
    <div class="col-span-5 lg:col-span-4">
      <!-- Getting Start -->
      <div
        class="card w-full bg-base-100 shadow-xl overflow-hidden mb-4"
      >
        <div
          class="card-body card bg-secondary/25"
        >
          <h2 class="card-subtitle">
            {{ $t('homepage.featured_collection_title') }}
          </h2>
          <div
            class="grid grid-cols-1 gap-4"
          >
            <CollectionCard
              v-if="data.gettingStarted"
              class="h-48"
              :collection="data.gettingStarted"
            />
          </div>
          <NuxtLink :to="{ name: 'collections' }" class="btn btn-secondary mt-4">
            {{ $t('homepage.collection_all_btn', { count: data.collectionsCount }) }}
          </NuxtLink>
        </div>
      </div>

      <!-- Level -->
      <div
        class="card w-full bg-base-100 shadow-xl overflow-hidden"
      >
        <div
          class="card-body card bg-featured/25"
        >
          <h2 class="card-subtitle">
            {{ $t('homepage.featured_level_title') }}
          </h2>
          <div
            class="grid grid-cols-1 gap-4"
          >
            <LevelCard
              v-for="level, index in latestFeaturedLevels" :key="index"
              class="h-48"
              :trim="true"
              :level="level"
            />
          </div>
          <NuxtLink :to="{ name: 'levels' }" class="btn btn-secondary mt-4">
            {{ $t('homepage.level_all_btn', { count: data.levelsCount }) }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>

  <ShowCase
    v-if="hitechMetaData"
    :cover="hitechMetaData.cover?.thumbnail"
    :more="{ name: 'collections-id', params: { id: hitechMetaData.uid } }"
    class="mt-4"
  >
    <template #desperation>
      <div class="px-2 py-1 w-full flex flex-row items-center">
        <div class="w-full">
          <h2 class="card-title block truncate">
            <NuxtLink :to="{ name: 'collections-id', params: { id: hitechMetaData.uid } }">
              {{ hitechMetaData.title }}
            </NuxtLink>
          </h2>
          <h2 class="text-neutral-content opacity-80 truncate">
            {{ hitechMetaData.slogan }}
          </h2>
        </div>
      </div>
    </template>

    <template #subDesperation>
      <div class="px-2 w-full flex flex-row items-center">
        <div>
          <UserAvatar
            v-if="hitechMetaData.owner"
            :avatar="hitechMetaData.owner.avatar?.small ?? undefined"
            :name="hitechMetaData.owner.name ?? hitechMetaData.owner.uid ?? undefined"
            :uid="hitechMetaData.owner.uid ?? undefined"
            :transparent="true"
            class="h-8"
          />
        </div>
      </div>
    </template>
    <LevelCard
      v-for="level, index in hitechLevels" :key="index"
      class="h-48"
      :trim="true"
      :level="level"
    />
  </ShowCase>

  <div v-if="dataDynamic" class="mt-4 md:grid md:grid-cols-12 md:grid-flow-col md:gap-4">
    <div class="col-span-7 md:col-span-6 lg:col-span-4 mt-4 md:mt-0">
      <div class="card w-full bg-base-100 shadow-xl mb-5">
        <div class="card-body">
          <h2 class="card-subtitle">
            {{ $t('profile.recent_ranks_title') }}
          </h2>
          <RecordCard
            v-for="record in dataDynamic.recentRecords" :key="record.id" :record="{
              ...record,
              owner: (record.owner?.uid && record.owner.avatar.small) ? {
                uid: record.owner.uid,
                name: record.owner.name ?? record.owner.uid,
                avatar: {
                  small: record.owner.avatar.small,
                },
              } : undefined,
            }"
          />
        </div>
      </div>
    </div>

    <div class="md:col-span-6 lg:col-span-8 lg:grid lg:grid-cols-8 lg:gap-4">
      <div class="lg:col-span-4 mb-4">
        <!-- Tweets -->
        <Tweet class="mb-4" />

        <!-- Comments -->
        <div class="card bg-base-100">
          <div class="card-body">
            <h2 class="card-subtitle">
              {{ $t('homepage.new_comments_title') }}
            </h2>
            <div class="divide-y divide-solid divide-neutral-content/25">
              <CommentRecent
                v-for="comment in dataDynamic.comments" :key="comment.id" :comment="{
                  ...comment,
                  owner: (comment.owner?.uid && comment.owner.avatar.small) ? {
                    uid: comment.owner.uid,
                    name: comment.owner.name ?? comment.owner.uid,
                    avatar: {
                      small: comment.owner.avatar.small,
                    },
                  } : undefined,
                }"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="lg:col-span-4">
        <!-- Discord -->
        <div
          class="card w-full bg-base-100 shadow-xl overflow-hidden mb-4"
        >
          <div
            class="card-body card bg-primary/25"
          >
            <h2 class="card-subtitle">
              <img src="/images/discord.webp" class="h-6 my-2 px-1">
            </h2>
            <p>
              {{ $t('homepage.connect_discord_content') }}
            </p>
            <NuxtLink to="https://discord.gg/cytoid" class="btn btn-primary mt-4">
              {{ $t('homepage.connect_discord_btn') }}
            </NuxtLink>
          </div>
        </div>

        <!-- Patreon -->
        <div
          class="card w-full bg-base-100 shadow-xl overflow-hidden mb-4"
        >
          <div
            class="card-body card bg-secondary/25"
          >
            <h2 class="card-subtitle">
              <img src="/images/patreon.webp" class="h-8">
            </h2>
            <p>
              {{ $t('homepage.connect_patreon_content') }}
            </p>
            <NuxtLink to="https://www.patreon.com/tigerhix" class="btn btn-secondary mt-4">
              Become a patron!
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
