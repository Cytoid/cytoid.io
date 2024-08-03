<script setup lang="ts">
// import type { FetchHomePageLateQuery } from '#build/urql-client/codegen/default/graphql'

const query = gql(`
  query FetchHomePage {
    discordOnlineCount
    collectionsCount
    posts: getActivePosts(limit: 10) {
      ...PostCardData
    }
    gettingStarted: collection(uid: "getting-started") {
      ...CollectionCardData
    }
    hitech: collection(uid: "hi-tech") {
      ...CollectionShowCaseData
    }
    latestFeaturedLevels: levels(category: "featured", limit:1, sort: CREATION_DATE, order:DESC) {
      ...LevelCardData
    }
    levelsCount
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

  <div v-if="data" class="mt-4 md:grid md:grid-flow-col md:grid-cols-12 md:gap-4">
    <div class="col-span-7 mt-4 md:mt-0 lg:col-span-8">
      <!-- News -->
      <div class="card mb-5 w-full overflow-hidden bg-base-100 shadow-xl">
        <div class="card-body bg-primary/25">
          <h2 class="card-subtitle">
            {{ $t('homepage.news_title') }}
          </h2>

          <PostCard v-for="post in data.posts" :key="fid(post)" :post="post" />

          <NuxtLink :to="{ name: 'posts' }" class="btn btn-primary mt-4">
            {{ $t('homepage.news_previous') }}
          </NuxtLink>
        </div>
      </div>
    </div>
    <div class="col-span-5 lg:col-span-4">
      <!-- Getting Start -->
      <div
        class="card mb-4 w-full overflow-hidden bg-base-100 shadow-xl"
      >
        <div
          class="card card-body bg-secondary/25"
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
        class="card w-full overflow-hidden bg-base-100 shadow-xl"
      >
        <div
          class="bg-featured/25 card card-body"
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
              :hide-category="true"
            />
          </div>
          <NuxtLink :to="{ name: 'levels' }" class="btn btn-secondary mt-4">
            {{ $t('homepage.level_all_btn', { count: data.levelsCount }) }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>

  <CollectionShowCase
    v-if="data?.hitech"
    :collection="data.hitech"
  />

  <div v-if="dataDynamic" class="mt-4 md:grid md:grid-flow-col md:grid-cols-12 md:gap-4">
    <div class="col-span-7 mt-4 md:col-span-6 md:mt-0 lg:col-span-4">
      <div class="card mb-5 w-full bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-subtitle">
            {{ $t('profile.recent_ranks_title') }}
          </h2>
          <RecordCard
            v-for="record in dataDynamic.recentRecords" :key="record.id" :record="{
              ...record,
            }"
          />
        </div>
      </div>
    </div>

    <div class="md:col-span-6 lg:col-span-8 lg:grid lg:grid-cols-8 lg:gap-4">
      <div class="mb-4 lg:col-span-4">
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
          class="card mb-4 w-full overflow-hidden bg-base-100 shadow-xl"
        >
          <div
            class="card card-body bg-primary/25"
          >
            <h2 class="card-subtitle">
              <img src="/images/discord.webp" class="my-2 h-6 px-1">
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
          class="card mb-4 w-full overflow-hidden bg-base-100 shadow-xl"
        >
          <div
            class="card card-body bg-secondary/25"
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
