<script setup lang="ts">
import { ResourceState } from '#build/urql-client/codegen/default/graphql'
import type { CollectionInput, FetchCollectionForEditingQuery } from '#build/urql-client/codegen/default/graphql'

const props = defineProps<{
  submit: (data: CollectionInput) => Promise<void>
}>()
const data = defineModel<FetchCollectionForEditingQuery>({ required: true })

const title = ref(data.value.collection?.title ?? '')
const slogan = ref(data.value.collection?.slogan ?? '')
const description = ref(data.value.collection?.description ?? '')
const tags = ref(data.value.collection?.tags ?? [])
const visibility = ref<ResourceState>(data.value.collection?.state ?? ResourceState.Private)

const loading = ref(false)

async function submit() {
  await props.submit({
    title: title.value,
    slogan: slogan.value,
    description: description.value,
    tags: tags.value,
    state: visibility.value,
  })
}
</script>

<template>
  <div class="w-full flex flex-col gap-5">
    <div class="card bg-base-100 w-full shadow-xl">
      <div class="card-body gap-4">
        <!-- Title -->
        <div class="flex flex-col gap-2">
          <h2 class="card-subtitle">
            Title
          </h2>
          <input
            v-model="title"
            class="input input-bordered"
          >
        </div>

        <!-- Slogan -->
        <div class="flex flex-col gap-2">
          <h2 class="card-subtitle">
            Slogan
          </h2>
          <input
            v-model="slogan"
            class="input input-bordered"
          >
        </div>

        <div class="flex flex-col gap-2">
          <h2 class="card-subtitle">
            Description
          </h2>

          <Editor v-model="description" />
        </div>

        <div class="flex flex-col gap-2">
          <h2 class="card-subtitle">
            {{ $t('level_details.manage.tags_field') }}
          </h2>
          <TagItemInput v-model="tags" />
        </div>

        <div class="flex flex-col gap-2">
          <h2 class="card-subtitle">
            Visibility
          </h2>
          <div class="w-fit">
            <Selector
              v-model="visibility"
              :items="[
                { value: ResourceState.Public, label: $t('general.visibility_status_public'), icon: 'mdi:earth' },
                { value: ResourceState.Unlisted, label: $t('general.visibility_status_unlisted'), icon: 'mdi:eye-off-outline' },
                { value: ResourceState.Private, label: $t('general.visibility_status_private'), icon: 'mdi:lock-outline' },
              ]"
            />
          </div>
        </div>

        <div class="flex flex-col gap-2 items-end">
          <button class="btn btn-primary" :disabled="loading" @click="submit">
            <span v-if="loading" class="loading loading-spinner" />
            {{ $t('general.save_btn') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
