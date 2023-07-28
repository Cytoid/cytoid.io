<script setup lang="ts">
const props = withDefaults(defineProps<{
  level: LevelData
  cover?: string
  trim?: boolean
}>(), {
  trim: false,
})

const coverUrl = computed(() => {
  if (props.cover) {
    return props.cover
  }
  const cover = props.level.cover
  if (typeof cover === 'string') {
    return cover
  }
  return cover.thumbnail ?? cover.original ?? cover.cover ?? cover.stripe ?? ''
})

interface LevelData {
  uid: string
  metadata: {
    title: string
    title_localized?: string
    artist: {
      name?: string
    }
  }
  cover: CoverData | string
  owner?: {
    name?: string | null
    uid: string
    avatar: {
      small: string
    }
  }
  charts: {
    type: string
    difficulty: number
    name?: string
    notesCount: number
  }[]
  musicPreview?: string
  category?: string[]
}
interface CoverData {
  original?: string
  thumbnail?: string
  cover?: string
  stripe?: string
}
</script>

<template>
  <BaseCard :to="{ name: 'levels-id', params: { id: level.uid } }" :cover="coverUrl">
    <div class="px-2 w-full flex flex-row">
      <UserAvatar
        v-if="level.owner" :avatar="level.owner.avatar.small" :name="level.owner.name || level.owner.uid" :uid="level.owner.uid"
        :transparent="true"
      />
      <div class="flex-1" />
      <div v-if="level.category" class="grid grid-flow-row gap-2">
        <div v-if="level.category.includes('featured')" class="badge badge-lg h-8 category-badge-featured">
          Featured
        </div>
        <div v-if="level.category.includes('qualified')" class="badge badge-lg h-8 category-badge-qualified">
          Qualified
        </div>
      </div>
    </div>
    <div class="flex-1" />
    <div class="px-2 w-full flex flex-row">
      <div class="w-[95%]">
        <h2 class="card-title block truncate">
          {{ level.metadata.title }}
        </h2>
        <h2 v-if="level.metadata.title_localized" class="block truncate opacity-80">
          {{ level.metadata.title_localized }}
        </h2>
        <h2 v-if="level.metadata.artist.name" class="text-neutral-content opacity-80 truncate">
          {{ level.metadata.artist.name }}
        </h2>
      </div>
      <div class="flex-1" />
      <div />
    </div>
    <div class="mt-2 w-full flex flex-row">
      <div class="flex items-center">
        <LevelDiffBadgeSmall
          v-for="chart in level.charts" :key="chart.type"
          :type="chart.type" :difficulty="chart.difficulty" :notes-count="chart.notesCount" class="mx-1 h-8 badge-lg"
          :trim="trim"
        />
      </div>
      <div class="flex-1" />
      <PreviewButton v-if="level.musicPreview" :preview-url="level.musicPreview" class="h-8" />
    </div>
  </BaseCard>
</template>
