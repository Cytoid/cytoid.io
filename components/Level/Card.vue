<script setup lang="ts">
const props = withDefaults(defineProps<{
  level: MaybeFragmentType<typeof LevelCardData>
  cover?: string
  trim?: boolean
  hideCategory?: boolean
}>(), {
  trim: false,
})

const LevelCardData = gql(`
  fragment LevelCardData on Level {
    id
    uid
    title
    category
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

const level = computed(() => parseFragment(LevelCardData, props.level))
</script>

<template>
  <BaseCard :to="{ name: 'levels-id', params: { id: level.uid } }" :cover="level.bundle?.backgroundImage?.thumbnail">
    <div class="flex w-full flex-row px-2">
      <slot name="top">
        <div>
          <UserAvatar
            v-if="level.owner" :avatar="level.owner.avatar.small ?? undefined" :name="level.owner.name ?? level.owner.uid ?? undefined" :uid="level.owner.uid ?? undefined"
            :transparent="true"
          />
        </div>
        <div class="flex-1" />
        <div v-if="!hideCategory" class="grid grid-flow-row gap-2">
          <div v-if="level.category.includes('featured')" class="category-badge-featured badge badge-lg h-8">
            Featured
          </div>
          <div v-if="level.category.includes('qualified')" class="category-badge-qualified badge badge-lg h-8">
            Qualified
          </div>
        </div>
      </slot>
    </div>
    <div class="flex-1" />
    <div class="flex w-full flex-row px-2">
      <div class="w-[95%]">
        <h2 class="card-title block truncate">
          {{ level.title }}
        </h2>
        <h2 v-if="level.metadata.title_localized" class="block truncate opacity-80">
          {{ level.metadata.title_localized }}
        </h2>
        <h2 v-if="level.metadata.artist?.name" class="truncate text-neutral-content opacity-80">
          {{ level.metadata.artist.name }}
        </h2>
      </div>
      <div class="flex-1" />
      <div />
    </div>
    <div class="mt-2 flex w-full flex-row">
      <div v-if="level.charts" class="flex items-center">
        <LevelDiffBadgeSmall
          v-for="chart in level.charts" :key="chart.type"
          :type="chart.type" :difficulty="chart.difficulty" :notes-count="chart.notesCount" class="badge-lg mx-1 h-8"
          :trim="trim"
        />
      </div>
      <div class="flex-1" />
      <PreviewButton v-if="level.bundle?.musicPreview" :preview-url="level.bundle?.musicPreview" class="h-8" />
    </div>
  </BaseCard>
</template>
