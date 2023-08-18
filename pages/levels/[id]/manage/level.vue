<script setup lang="ts">
import type { FetchLevelForEditingQuery } from 'gql/graphql'

defineProps<{
  data: FetchLevelForEditingQuery
}>()
</script>

<template>
  <div class="w-full flex flex-col gap-5">
    <LevelUploader :replace="data.level?.uid" />
  </div>
</template>
