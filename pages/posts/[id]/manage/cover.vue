<script setup lang="ts">
import type { FetchPostForEditingQuery, PostInput } from '#build/urql-client/codegen/default/graphql'

const props = defineProps<{
  modelValue: FetchPostForEditingQuery
  submit: (data: PostInput) => Promise<void>
  updateCover: (coverUrl: string) => Promise<void>
  updateLogo: (logoUrl: string) => Promise<void>
}>()
const emit = defineEmits(['update:modelValue'])
const data = useVModel(props, 'modelValue', emit)

const metadata = ref({
  name: data.value.post?.metadata?.cover?.name ?? '',
  localized_name: data.value.post?.metadata?.cover?.localized_name ?? '',
  url: data.value.post?.metadata?.cover?.url ?? '',
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

async function logoUploaded(newData: FilePostResponse | null | undefined) {
  const logoPath = newData?.path
  if (!logoPath) {
    return
  }
  await props.submit({
    logoPath,
  })
  await props.updateLogo(logoPath)
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

    <!-- Cover -->
    <CoverUploader
      :cover="data.post?.cover?.original ?? ''"
      :after-upload="coverUploaded"
    />

    <!-- Logo -->
    <LogoUploader
      v-if="data.post?.type === 'EVENT'"
      :cover="data.post?.logo?.original ?? ''"
      :after-upload="logoUploaded"
    />
  </div>
</template>
