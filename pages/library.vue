<script setup lang="ts">
const { toLogin } = useAuth()

const query = gql(`
  query FetchUserLibrary {
    my {
      grantedLevels: library(granted: true) {
        ...LibraryLevelCardFragment
      }
      levels: library(granted: false) {
        ...LibraryLevelCardFragment
      }
    }
  }
  fragment LibraryLevelCardFragment on Level {
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
`)

const { data } = await useAsyncQuery(query)

if (!data.value?.my) {
  toLogin('/library')
}

const ownedLevel = computed(() => data.value?.my?.grantedLevels ?? [])
const lovedLevel = computed(() => data.value?.my?.levels ?? [])

defineCytoidPage({
  title: 'Library',
})
</script>

<template>
  <div class="max-w-5xl mx-auto">
    <div class="h-24 relative">
      <div id="contentTitle" class="absolute bottom-0 left-0">
        <h1 class="text-4xl font-bold">
          {{ $t('general.library') }}
        </h1>
      </div>
    </div>
    <div class="mt-4">
      <div class="mt-4 md:mt-0 flex flex-col gap-4">
        <div v-if="ownedLevel.length > 0" class="card w-full bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-subtitle">
              {{ $t('general.owned_levels') }}
            </h2>
            <!-- Owned -->
            <div
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <LevelCard
                v-for="level, index in ownedLevel" :key="index"
                class="h-48"
                :trim="true"
                :level="level"
              />
            </div>
          </div>
        </div>
        <div class="card w-full bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-subtitle">
              {{ $t('general.favorites') }}
            </h2>
            <!-- Favorites -->
            <div
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <LevelCard
                v-for="level, index in lovedLevel" :key="index"
                class="h-48"
                :trim="true"
                :level="level"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
