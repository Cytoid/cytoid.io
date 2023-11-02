<script setup lang="ts">
import type { FetchLevelForEditingQuery } from '~/gql/graphql'

const props = defineProps<{
  data: FetchLevelForEditingQuery
}>()

const isFreezed = computed(() => !!props.data.level?.category.includes('freeze'))
const isQualified = computed(() => !!props.data.level?.category.includes('qualified'))
</script>

<template>
  <div class="w-full flex flex-col gap-5">
    <div v-if="isFreezed" class="alert alert-error">
      <Icon name="material-symbols:error-circle-rounded-outline" size="24" />
      <span>
        {{ $t('level_details.manage.replace_upload_freeze') }}
      </span>
    </div>
    <template v-else>
      <div v-if="isQualified" class="alert alert-warning">
        <Icon name="material-symbols:error-circle-rounded-outline" size="24" />
        <span>
          {{ $t('level_details.manage.replace_upload_qualified') }}
        </span>
      </div>
      <LevelUploader :replace="data.level?.uid" />
      <!-- TODO: level metadata edit -->
    </template>
  </div>
</template>
