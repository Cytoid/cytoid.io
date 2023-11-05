<script setup lang="ts">
import type { FetchLevelForEditingQuery } from '~/gql/graphql'

const props = defineProps<{
  modelValue: FetchLevelForEditingQuery
}>()

const emit = defineEmits(['update:modelValue'])
const data = useVModel(props, 'modelValue', emit)

const level = computed(() => data.value.level)
</script>

<template>
  <div class="w-full flex flex-col gap-5">
    <div class="card overflow-hidden bg-base-100 w-full shadow-xl">
      <div class="card-body">
        <h2 class="card-subtitle">
          Rating
        </h2>
        <BackToOld />
      </div>
    </div>
    <div class="card overflow-hidden bg-base-100 w-full shadow-xl">
      <div class="card-body">
        <h2 class="card-subtitle">
          Plays & Downloads
        </h2>
        <BackToOld />
      </div>
    </div>
    <div class="card overflow-hidden bg-base-100 w-full shadow-xl">
      <div class="card-body">
        <h2 class="card-subtitle">
          Rankings
        </h2>
        <LevelLeaderboard
          v-if="level?.uid"
          :level-id="level?.uid"
          :charts="level.charts.map(item => {
            return {
              difficulty: item.difficulty,
              type: item.type,
              name: item.name ?? undefined,
              notesCount: item.notesCount,
            }
          })"
        />
      </div>
    </div>
    <LazyCommentThread
      v-if="level?.uid"
      category="level"
      :thread="level.uid"
    />
  </div>
</template>
