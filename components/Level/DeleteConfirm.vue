<script setup lang="ts">
defineProps<{
  open?: boolean
  level: ConfirmLevelData
  onConfirm: () => void
  onCancel: () => void
}>()
interface ConfirmLevelData {
  id: number
  uid: string
  title: string
}
</script>

<template>
  <BaseConfirmDialog
    :open="open"
    :confirm="level.uid"
    :on-confirm="onConfirm"
    :on-cancel="onCancel"
    type="error"
  >
    <template #title>
      {{ $t('studio.level_delete_confirm_title', { name: level.title }) }}
    </template>

    <div class="flex w-full flex-col gap-2">
      <I18nT keypath="studio.level_delete_confirm_content1" tag="p">
        <strong class="font-bold"> {{ level.title }} </strong>
      </I18nT>
      <p>
        {{ $t('studio.level_delete_confirm_content2', { count: '-' }) }}
      </p>
      <I18nT keypath="studio.level_delete_confirm_content3" tag="p">
        <strong class="font-bold text-error"> {{ level.uid }} </strong>
      </I18nT>
    </div>

    <template #buttonContext>
      {{ $t('general.delete_btn') }}
    </template>
  </BaseConfirmDialog>
</template>
