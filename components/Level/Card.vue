<script setup lang="ts">
const props = defineProps<{
  level: LevelData
  cover?: string
}>()

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
    title_localized: string
    artist: {
      url: string
      name: string
    }
  }
  cover: CoverData | string
  owner: {
    name: string
    uid: string
    avatar: {
      original: string
      small: string
      medium: string
      large: string
    }
  }
  charts: {
    type: string
    difficulty: number
    name?: string
    notesCount: number
  }[]
  musicPreview: string
  category: string[]
}
interface CoverData {
  original?: string
  thumbnail?: string
  cover?: string
  stripe?: string
}
</script>

<template>
  <div class="card min-w-84 max-h-60 h-60 bg-base-100 overflow-auto shadow-xl flex flex-col">
    <NuxtLink :to="{ name: 'levels-id', params: { id: level.uid } }" class="flex-1 flex bg-image-loading">
      <div class="w-full flex-1 bg-cover bg-center" :style="`background-image: url('${coverUrl}')`">
        <div class="h-full w-full bg-black/20">
          <div class="h-full w-full bg-black/40 hover:bg-black/0 transition-colors p-3 flex flex-col">
            <div class="w-full flex flex-row">
              <UserAvatar
                v-if="level.owner" :avatar="level.owner.avatar.small" :name="level.owner.name || level.owner.uid" :uid="level.owner.uid"
                :transparent="true"
                class="h-8 clickable bg-transparent"
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
            <div class="w-full flex flex-row">
              <div class="w-[95%]">
                <h2 class="card-title block truncate">
                  {{ level.metadata.title }}
                </h2>
                <h2 class="block truncate opacity-80">
                  {{ level.metadata.title_localized }}
                </h2>
                <h2 class="text-neutral-content opacity-80 truncate">
                  {{ level.metadata.artist.name }}
                </h2>
              </div>
              <div class="flex-1" />
              <div />
            </div>
          </div>
        </div>
      </div>
    </NuxtLink>
    <div class="py-4 px-2 card-body flex-none">
      <div class="w-full flex flex-row">
        <div class="flex items-center">
          <LevelDiffBadgeSmall
            v-for="chart in level.charts" :key="chart.type"
            :type="chart.type" :difficulty="chart.difficulty" :notes-count="chart.notesCount" class="mx-1"
          />
        </div>
        <div class="flex-1" />
        <button v-if="level.musicPreview" class="btn btn-circle btn-sm btn-ghost">
          <Icon name="material-symbols:play-arrow" size="24" />
        </button>
      </div>
    </div>
  </div>
</template>
