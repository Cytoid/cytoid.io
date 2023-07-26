<script setup lang="ts">
defineProps<{
  collection: CollectionData
}>()

interface CollectionData {
  id: string
  uid: string
  title: string
  slogan: string
  levelCount: number
  creationDate: any
  cover?: {
    __typename?: 'Image'
    thumbnail?: string | null
  } | null
  owner?: {
    id: string
    uid: string
    name?: string | null
    avatar?: {
      small: string | null
    }
  } | null
}
</script>

<template>
  <BaseCard
    :to="{ name: 'collections-id', params: { id: collection.uid } }"
    :cover="collection.cover?.thumbnail ?? undefined"
  >
    <div class="px-2 w-full flex flex-row">
      <UserAvatar
        v-if="collection.owner"
        :avatar="collection.owner.avatar?.small ?? undefined"
        :name="collection.owner.name || collection.owner.uid"
        :uid="collection.owner.uid"
        :transparent="true"
        class="h-8"
      />
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
      <div />
    </div>
  </BaseCard>
</template>
