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
    <div class="px-2 w-full flex flex-row items-center">
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

    <div class="px-2 w-full flex flex-row">
      <div class="w-full">
        <h2 class="card-title block truncate">
          {{ collection.title }}
        </h2>
        <h2 v-if="collection.slogan" class="text-neutral-content opacity-80 truncate">
          {{ collection.slogan }}
        </h2>
      </div>
    </div>
  </BaseCard>
</template>
