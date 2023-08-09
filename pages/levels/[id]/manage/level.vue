<script setup lang="ts">
import type { FetchLevelForEditingQuery } from 'gql/graphql'

const props = defineProps<{
  data: FetchLevelForEditingQuery
}>()
const route = useRoute()
</script>

<template>
  <LevelUploader :replace="data.level?.uid" />
</template>
