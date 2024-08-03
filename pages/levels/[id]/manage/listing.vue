<script setup lang="ts">
import { type FetchLevelForEditingQuery, ResourceState } from '#build/urql-client/codegen/default/graphql'

const data = defineModel<FetchLevelForEditingQuery>({ required: true })

const level = computed(() => data.value.level)

const mutation = gql(`
  mutation UpdateLevel($id: ID!, $input: UpdateLevelInput!) {
    updateLevel(id: $id, input: $input)
  }
`)
const isSubmitting = ref(false)

const { isModerator } = useAuth()

const description = ref(level?.value?.description ?? '')
const tags = ref(level.value?.tags ?? [])
const visibility = ref<ResourceState>(level.value?.state ?? ResourceState.Private)

const form = computed(() => ({
  tags: tags.value,
  description: description.value,
  state: visibility.value,
}))

// Admin
const censored = ref(!!level.value?.censored)
const censorReason = ref(level.value?.censored ?? '')
const category = ref<string[]>(level.value?.category ?? [])

watch(censored, (val) => {
  if (!val) {
    censorReason.value = ''
  }
})

const adminForm = computed(() => ({
  censored: censored.value && censorReason.value !== '' ? censorReason.value : null,
  category: category.value,
}))

async function submit() {
  if (level.value?.id === undefined) {
    return
  }
  isSubmitting.value = true
  try {
    await useMutation(mutation, {
      id: level.value.id.toString(),
      input: {
        ...form.value,
        ...(isModerator
          ? adminForm.value
          : {}
        ),
      },
    })
    successAlert('Level Listing Saved')

    // update level cache
    level.value.state = form.value.state
    level.value.tags = form.value.tags
    level.value.description = form.value.description
    if (isModerator) {
      level.value.censored = adminForm.value.censored
      level.value.category = adminForm.value.category
    }
  }
  catch (error) {
    handleErrorToast(error as Error)
  }
  isSubmitting.value = false
}
</script>

<template>
  <div class="flex w-full flex-col gap-5">
    <div class="card w-full bg-base-100 shadow-xl">
      <div class="card-body gap-4">
        <div class="flex flex-col gap-2">
          <h2 class="card-subtitle">
            {{ $t('level_details.manage.description_field') }}
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
            {{ $t('level_details.manage.visibility_field') }}
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

        <div class="flex flex-col items-end gap-2">
          <button class="btn btn-primary" :disabled="isSubmitting" @click="submit">
            <span v-if="isSubmitting" class="loading loading-spinner" />
            {{ $t('general.save_btn') }}
          </button>
        </div>
      </div>
    </div>
    <div
      v-if="isModerator"
      class="card w-full bg-base-100 shadow-xl"
    >
      <div class="card-body gap-4">
        <div class="flex flex-col gap-2 sm:flex-row sm:gap-8">
          <div class="flex flex-col gap-2">
            <h2 class="card-subtitle">
              {{ $t('level_details.manage.admin.censorship_title') }}
            </h2>
            <label class="label flex cursor-pointer gap-2 sm:flex-row-reverse">
              <span class="label-text">
                {{ $t('level_details.manage.admin.censorship_checkbox_title') }}
              </span>
              <input v-model="censored" type="checkbox" class="toggle" :class="{ 'toggle-error': censored }">
            </label>
          </div>
          <div class="flex flex-1 flex-col gap-2">
            <h2 class="card-subtitle">
              {{ $t('level_details.manage.admin.censorship_reason_field') }}
            </h2>
            <div class="form-control w-full">
              <input v-model="censorReason" type="text" :disabled="!censored" class="input input-bordered w-full">
              <label class="label">
                <span class="label-text-alt">
                  {{ $t('level_details.manage.admin.censorship_reason_hint') }}
                </span>
              </label>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <h2 class="card-subtitle">
            {{ $t('level_details.manage.admin.category_title') }}
          </h2>
          <BaseItemInput
            v-model="category"
            :suggestion="['featured', 'qualified', 'freeze']"
            :allow-advanced="false"
            :verified="{
              featured: 'featured',
              qualified: 'qualified',
              freeze: 'freeze',
            }"
            :limited="true"
          />
        </div>

        <div class="flex flex-col items-end gap-2">
          <button class="btn btn-secondary" :disabled="isSubmitting" @click="submit">
            <span v-if="isSubmitting" class="loading loading-spinner" />
            {{ $t('general.save_btn') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
