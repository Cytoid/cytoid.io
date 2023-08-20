<script setup lang="ts">
defineProps<{
  open?: boolean
  collection: ConfirmCollectionData
  onConfirm: () => void
  onCancel: () => void
}>()
interface ConfirmCollectionData {
  id: string
  uid: string
  title: string
}
</script>

<template>
  <!-- TODO: fix l10n -->
  <BaseConfirmDialog
    :open="open"
    :confirm="collection.uid"
    :on-confirm="onConfirm"
    :on-cancel="onCancel"
    type="error"
  >
    <template #title>
      {{ $t('studio.level_delete_confirm_title', { name: collection.title }) }}
    </template>

    <div class="w-full flex flex-col gap-2">
      <I18nT keypath="studio.level_delete_confirm_content1" tag="p">
        <strong class="font-bold"> {{ collection.title }} </strong>
      </I18nT>
      <p>
        {{ $t('studio.level_delete_confirm_content2', { count: '-' }) }}
      </p>
      <I18nT keypath="studio.level_delete_confirm_content3" tag="p">
        <strong class="font-bold text-error"> {{ collection.uid }} </strong>
      </I18nT>
    </div>

    <template #buttonContext>
      {{ $t('general.delete_btn') }}
    </template>
  </BaseConfirmDialog>
</template>
