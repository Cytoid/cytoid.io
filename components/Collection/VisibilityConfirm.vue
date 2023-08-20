<script setup lang="ts">
import { ResourceState } from '~/gql/graphql'

defineProps<{
  open?: boolean
  collection: ConfirmCollectionData
  onConfirm: () => void
  onCancel: () => void
  type: ResourceState
}>()

const typeMap: {
  [key in ResourceState]: 'success' | 'error' | 'warning'
} = {
  [ResourceState.Public]: 'success',
  [ResourceState.Unlisted]: 'warning',
  [ResourceState.Private]: 'error',
}

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
    :type="typeMap[type]"
  >
    <template #title>
      <template v-if="type === ResourceState.Public">
        {{ $t('studio.level_visibility_title_public', { title: collection.title }) }}
      </template>
      <template v-else-if="type === ResourceState.Unlisted">
        {{ $t('studio.level_visibility_title_unlisted', { title: collection.title }) }}
      </template>
      <template v-else-if="type === ResourceState.Private">
        {{ $t('studio.level_visibility_title_private', { title: collection.title }) }}
      </template>
    </template>

    <div class="w-full flex flex-col gap-2">
      <template v-if="type === ResourceState.Public">
        <p>
          {{ $t('studio.level_visibility_public_title') }}
        </p>
        <I18nT keypath="studio.level_visibility_public_content" tag="p">
          <NuxtLink
            :to="{ name: 'pages-id', params: { id: 'dmca' } }"
            class="font-bold text-primary"
          >
            {{ $t('general.dmca') }}
          </NuxtLink>
          <NuxtLink
            :to="{ name: 'pages-id', params: { id: 'terms' } }"
            class="font-bold text-primary"
          >
            {{ $t('general.tos') }}
          </NuxtLink>
        </I18nT>
      </template>

      <template v-else-if="type === ResourceState.Unlisted">
        <p>
          {{ $t('studio.level_visibility_unlisted_title') }}
        </p>
        <I18nT keypath="studio.level_visibility_public_content" tag="p">
          <NuxtLink
            :to="{ name: 'pages-id', params: { id: 'dmca' } }"
            class="font-bold text-primary"
          >
            {{ $t('general.dmca') }}
          </NuxtLink>
          <NuxtLink
            :to="{ name: 'pages-id', params: { id: 'terms' } }"
            class="font-bold text-primary"
          >
            {{ $t('general.tos') }}
          </NuxtLink>
        </I18nT>
      </template>

      <template v-else-if="type === ResourceState.Private">
        <p>
          {{ $t('studio.level_visibility_private_title') }}
        </p>
        <I18nT keypath="studio.level_visibility_private_content" tag="p">
          <strong class="font-bold"> {{ collection.title }} </strong>
        </I18nT>
      </template>

      <I18nT keypath="studio.level_visibility_content" tag="p">
        <strong
          class="font-bold"
          :class="{
            'text-success': type === ResourceState.Public,
            'text-error': type === ResourceState.Private,
            'text-warning': type === ResourceState.Unlisted,
          }"
        > {{ collection.uid }} </strong>
      </I18nT>
    </div>

    <template #buttonContext>
      <template v-if="type === ResourceState.Public">
        {{ $t('general.visibility_action_publish') }}
      </template>
      <template v-else-if="type === ResourceState.Unlisted">
        {{ $t('general.visibility_action_unlist') }}
      </template>
      <template v-else-if="type === ResourceState.Private">
        {{ $t('general.visibility_action_private') }}
      </template>
    </template>
  </BaseConfirmDialog>
</template>
