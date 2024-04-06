<script setup lang="ts">
const props = defineProps<{
  collection: MaybeFragmentType<typeof CollectionCardData>
}>()

const CollectionCardData = gql(`
  fragment CollectionCardData on Collection {
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

const collection = computed(() => parseFragment(CollectionCardData, props.collection))
</script>

<template>
  <BaseCard
    :to="{ name: 'collections-id', params: { id: collection.uid } }"
    :cover="collection.cover?.thumbnail ?? undefined"
  >
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
      <div class="flex-1" />
      <div class="badge badge-neutral">
        {{ $t('general.collection_card_levels_count_tag', { count: collection.levelCount }) }}
      </div>
    </div>
    <div class="flex-1" />

    <div class="flex w-full flex-row px-2">
      <div class="w-full">
        <h2 class="card-title block truncate">
          {{ collection.title }}
        </h2>
        <h2 v-if="collection.slogan" class="truncate text-neutral-content opacity-80">
          {{ collection.slogan }}
        </h2>
      </div>
    </div>
  </BaseCard>
</template>
