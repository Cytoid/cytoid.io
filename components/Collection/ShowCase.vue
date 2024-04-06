<script setup lang="ts">
const props = defineProps<{
  collection: MaybeFragmentType<typeof CollectionShowCaseData>
}>()

const CollectionShowCaseData = gql(`
  fragment CollectionShowCaseData on Collection {
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
    levels(limit: 5) {
      ...LevelCardData
    }
  }
`)

const collection = computed(() => parseFragment(CollectionShowCaseData, props.collection))
</script>

<template>
  <BaseShowCase
    :cover="collection.cover?.thumbnail"
    :more="{ name: 'collections-id', params: { id: collection.uid } }"
    class="mt-4"
  >
    <template #desperation>
      <div class="flex w-full flex-row items-center px-2 py-1">
        <div class="w-full">
          <h2 class="card-title block truncate">
            <NuxtLink :to="{ name: 'collections-id', params: { id: collection.uid } }">
              {{ collection.title }}
            </NuxtLink>
          </h2>
          <h2 class="truncate text-neutral-content opacity-80">
            {{ collection.slogan }}
          </h2>
        </div>
      </div>
    </template>

    <template #subDesperation>
      <div class="flex w-full flex-row items-center px-2">
        <div>
          <UserAvatar
            v-if="collection.owner"
            :avatar="collection.owner.avatar?.small ?? undefined"
            :name="collection.owner.name ?? collection.owner.uid ?? undefined"
            :uid="collection.owner.uid ?? undefined"
            :transparent="true"
            class="h-8"
          />
        </div>
      </div>
    </template>
    <LevelCard
      v-for="level in collection.levels" :key="fid(level)"
      class="h-48"
      :trim="true"
      :level="level"
    />
  </BaseShowCase>
</template>
