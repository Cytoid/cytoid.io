<script setup lang="ts">
defineProps<{
  record: RecordData
}>()

interface RecordData {
  id: number
  date: any
  score: number
  accuracy: number
  chart?: {
    id: number
    difficulty: number
    name?: string | null
    type: string
    notesCount: number
    level?: {
      uid: string
      title: string
      bundle?: {
        backgroundImage?: {
          stripe?: string | null
        } | null
      } | null
    } | null
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
    v-if="record.chart"
    :cover="record.chart.level?.bundle?.backgroundImage?.stripe ?? undefined"
    class="h-28"
  >
    <div class="w-full flex flex-row gap-1">
      <UserAvatar
        v-if="record.owner" :avatar="record.owner.avatar?.small ?? undefined"
        :name="record.owner.name || record.owner.uid"
        :uid="record.owner.uid"
        :size="6"
        :transparent="true"
      />
    </div>
    <div class="flex-1" />
    <NuxtLink :to="{ name: 'levels-id', params: { id: record.chart.level?.uid } }" class="max-w-full w-fit flex flex-row">
      <h3 class="card-title text-lg block truncate">
        {{ record.chart.level?.title }}
      </h3>
    </NuxtLink>
    <div class="w-full flex flex-warp flex-row gap-2">
      <div class="min-w-0">
        <LevelDiffBadgeSmall
          :type="record.chart.type"
          :difficulty="record.chart.difficulty"
          :name="record.chart.name || record.chart.type"
          :notes-count="record.chart.notesCount"
          class="badge-md w-auto"
        />
      </div>
      <RecordScoreBadge class="badge-md flex-none" :score="record.score" />
      <div class="flex-1" />
      <p v-if="record.date" class="w-fit grow-0 text-xs flex-none">
        {{ dateFromNow(record.date) }}
      </p>
    </div>
  </BaseCard>
</template>
