<script setup lang="ts">
import type { CollectionInput, FetchCollectionForEditingQuery } from '#build/urql-client/codegen/default/graphql'

const props = defineProps<{
  modelValue: FetchCollectionForEditingQuery
  submit: (data: CollectionInput) => Promise<void>
  updateCover: (coverUrl: string) => Promise<void>
}>()
const emit = defineEmits(['update:modelValue'])
const data = useVModel(props, 'modelValue', emit)

const metadata = ref({
  name: data.value.collection?.metadata.cover?.name ?? '',
  localized_name: data.value.collection?.metadata.cover?.localized_name ?? '',
  url: data.value.collection?.metadata.cover?.url ?? '',
})

async function submit() {
  await props.submit({
    metadata: {
      cover: metadata.value,
    },
  })
}

async function coverUploaded(newData: FilePostResponse | null | undefined) {
  const coverPath = newData?.path
  if (!coverPath) {
    return
  }
  await props.submit({
    coverPath,
  })
  await props.updateCover(coverPath)
}
</script>

<template>
  <div class="w-full flex flex-col gap-5">
    <div class="card bg-base-100 w-full shadow-xl">
      <div class="card-body gap-4">
        <div class="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div class="flex flex-col gap-2">
            <h2 class="card-subtitle">
              Artist Name
            </h2>
            <input
              v-model="metadata.name"
              class="input input-bordered"
            >
          </div>

          <div class="flex flex-col gap-2">
            <h2 class="card-subtitle">
              Artist Localized Name
            </h2>
            <input
              v-model="metadata.localized_name"
              class="input input-bordered"
            >
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <h2 class="card-subtitle">
            Source Url
          </h2>
          <input
            v-model="metadata.url"
            class="input input-bordered"
          >
        </div>

        <div class="card-actions justify-end">
          <button
            class="btn btn-primary"
            @click="submit"
          >
            {{ $t('general.save_btn') }}
          </button>
        </div>
      </div>
    </div>

    <CoverUploader
      :cover="data.collection?.cover?.original ?? ''"
      :after-upload="coverUploaded"
    />
  </div>
</template>
