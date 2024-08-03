<script setup lang="ts">
const props = defineProps<{
  record: MaybeFragmentType<typeof RecordCardData>
}>()

const RecordCardData = gql(`
  fragment RecordCardData on Record {
    id
    date
    owner {
      id
      uid
      name
      avatar {
        small
      }
    }
    chart {
      id
      difficulty
      name
      type
      notesCount
      level {
        uid
        title
        bundle {
          backgroundImage {
            stripe
          }
        }
      }
    }
    score
    accuracy
    recentRating
  }
`)

const record = computed(() => parseFragment(RecordCardData, props.record))
</script>

<template>
  <BaseCard
    v-if="record.chart"
    :to="{ name: 'records-chartId-id', params: { id: record.id, chartId: record.chart.id } }"
    :cover="record.chart.level?.bundle?.backgroundImage?.stripe ?? undefined"
    class="h-28"
  >
    <div class="flex w-full flex-row gap-1">
      <UserAvatar
        v-if="record.owner" :avatar="record.owner.avatar?.small ?? undefined"
        :name="record.owner.name || record.owner.uid || undefined"
        :uid="record.owner.uid || undefined"
        :size="6"
        :transparent="true"
      />
    </div>
    <div class="flex-1" />
    <NestedLink :to="{ name: 'levels-id', params: { id: record.chart.level?.uid } }" class="flex w-fit max-w-full flex-row">
      <h3 class="card-title block truncate py-1 text-lg">
        {{ record.chart.level?.title }}
      </h3>
    </NestedLink>
    <div class="flex-warp flex w-full flex-row items-center gap-2">
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
      <span v-if="record.date" class="size-fit flex-none grow-0 text-xs">
        {{ dateFromNow(record.date) }}
      </span>
    </div>
  </BaseCard>
</template>
