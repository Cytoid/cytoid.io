<script setup lang="ts">
import type { FetchLevelForEditingQuery } from '#build/urql-client/codegen/default/graphql'

const data = defineModel<FetchLevelForEditingQuery>({ required: true })
const level = computed(() => data.value.level)
</script>

<template>
  <div class="flex w-full flex-col gap-5">
    <div class="card w-full overflow-hidden bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-subtitle">
          Rating
        </h2>
        <BackToOld />
      </div>
    </div>
    <div class="card w-full overflow-hidden bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-subtitle">
          Plays & Downloads
        </h2>
        <BackToOld />
      </div>
    </div>
    <div class="card w-full overflow-hidden bg-base-100 shadow-xl">
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
