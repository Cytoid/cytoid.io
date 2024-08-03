<script setup lang="ts">
import type { FetchLevelForEditingQuery } from '#build/urql-client/codegen/default/graphql'

const data = defineModel<FetchLevelForEditingQuery>({ required: true })

const mutation = gql(`
  mutation editLevelMetadata(
    $id: String!,
    $metadata: PartialMetadata
  ) {
    editLevelMetadata(id: $id, metadata: $metadata) {
      title
      metadata {
        title_localized
        artist {
          name
          localized_name
          url
        }
        illustrator {
          name
          url
        }
        charter {
          name
        }
        storyboarder {
          name
        }
      }
    }
  }
`)

const isFreezed = computed(() => !!data.value.level?.category.includes('freeze'))
const isQualified = computed(() => !!data.value.level?.category.includes('qualified'))

const title = ref(data.value.level?.title ?? '')
const titleLocalized = ref(data.value.level?.metadata.title_localized ?? '')
const artist = ref(data.value.level?.metadata.artist?.name ?? '')
const artistLocalized = ref(data.value.level?.metadata.artist?.localized_name ?? '')
const artistUrl = ref(data.value.level?.metadata.artist?.url ?? '')
const illustrator = ref(data.value.level?.metadata.illustrator?.name ?? '')
const illustratorUrl = ref(data.value.level?.metadata.illustrator?.url ?? '')
const charter = ref(data.value.level?.metadata.charter?.name ?? '')
const storyboarder = ref(data.value.level?.metadata.storyboarder?.name ?? '')

const charts = ref(data.value.level?.charts.map(chart => ({
  type: chart.type,
  difficulty: chart.difficulty.toString(),
  name: chart.name ?? '',
})).sort((a, b) => {
  const typeOrder = ['extreme', 'hard', 'easy']
  return typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type)
}) ?? [])

const isSubmitting = ref(false)

const canSubmit = computed(() => {
  if (isSubmitting.value) {
    return false
  }

  if (title.value === '') {
    return false
  }
  if (artist.value === '') {
    return false
  }
  if (illustrator.value === '') {
    return false
  }
  if (charter.value === '') {
    return false
  }

  return true
})

async function submit(verify: () => Promise<string>) {
  if (data.value.level?.id === undefined) {
    return
  }
  isSubmitting.value = true

  const updatedCharts: {
    type: string
    difficulty?: number
    name?: string
  }[] = []

  for (const chart of charts.value) {
    let changed = false
    const chartData: {
      type: string
      difficulty?: number
      name?: string
    } = {
      type: chart.type,
    }
    const originalChart = data.value.level?.charts.find(item => item.type === chart.type)
    if (!originalChart) {
      continue
    }
    if ((originalChart?.name ?? '') !== chart.name) {
      changed = true
      chartData.name = chart.name
    }
    if (!Number.isNaN(Number.parseInt(chart.difficulty)) && originalChart?.difficulty.toString() !== chart.difficulty) {
      changed = true
      chartData.difficulty = Number.parseInt(chart.difficulty)
    }
    if (changed) {
      updatedCharts.push(chartData)
    }
  }
  const metadata = {
    title: editedOrUndefined(title.value, data.value.level?.title ?? ''),
    title_localized: editedOrUndefined(titleLocalized.value, data.value.level?.metadata.title_localized ?? ''),
    artist: editedOrUndefined(artist.value, data.value.level?.metadata.artist?.name ?? ''),
    artist_localized: editedOrUndefined(artistLocalized.value, data.value.level?.metadata.artist?.localized_name ?? ''),
    artist_source: editedOrUndefined(artistUrl.value, data.value.level?.metadata.artist?.url ?? ''),
    illustrator: editedOrUndefined(illustrator.value, data.value.level?.metadata.illustrator?.name ?? ''),
    illustrator_source: editedOrUndefined(illustratorUrl.value, data.value.level?.metadata.illustrator?.url ?? ''),
    charter: editedOrUndefined(charter.value, data.value.level?.metadata.charter?.name ?? ''),
    storyboarder: editedOrUndefined(storyboarder.value, data.value.level?.metadata.storyboarder?.name ?? ''),
    charts: updatedCharts,
  }

  try {
    const captcha = await verify()
    const res = await useMutation(mutation, {
      id: data.value.level.uid,
      metadata,
      captcha,
    })

    if (res?.editLevelMetadata) {
      successAlert('Level Metadata Saved')
      data.value.level.title = res.editLevelMetadata.title
      data.value.level.metadata = res.editLevelMetadata.metadata
      data.value.level.charts.forEach((chart) => {
        const updatedChart = updatedCharts.find(item => item.type === chart.type)
        if (updatedChart) {
          chart.name = updatedChart.name ?? chart.name
          chart.difficulty = updatedChart.difficulty ?? chart.difficulty
        }
      })
    }
  }
  catch (error) {
    handleErrorToast(error as Error)
  }
  isSubmitting.value = false
}

function getDefaultChartName(type: string) {
  switch (type.toLowerCase()) {
    case 'easy':
      return 'Easy'
    case 'hard':
      return 'Hard'
    case 'extreme':
      return 'Extreme'
  }
}

function reset() {
  title.value = data.value.level?.title ?? ''
  titleLocalized.value = data.value.level?.metadata.title_localized ?? ''
  artist.value = data.value.level?.metadata.artist?.name ?? ''
  artistLocalized.value = data.value.level?.metadata.artist?.localized_name ?? ''
  artistUrl.value = data.value.level?.metadata.artist?.url ?? ''
  illustrator.value = data.value.level?.metadata.illustrator?.name ?? ''
  illustratorUrl.value = data.value.level?.metadata.illustrator?.url ?? ''
  charter.value = data.value.level?.metadata.charter?.name ?? ''
  storyboarder.value = data.value.level?.metadata.storyboarder?.name ?? ''
  charts.value = data.value.level?.charts.map(chart => ({
    type: chart.type,
    difficulty: chart.difficulty.toString(),
    name: chart.name ?? '',
  })).sort((a, b) => {
    const typeOrder = ['extreme', 'hard', 'easy']
    return typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type)
  }) ?? []
}

function editedOrUndefined<T>(newVal: T, oldVal: T | undefined) {
  if (newVal === oldVal) {
    return undefined
  }
  return newVal
}
</script>

<template>
  <div class="flex w-full flex-col gap-5">
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

      <div class="card w-full overflow-hidden bg-base-100 shadow-xl">
        <div class="card-body">
          <div class="flex flex-col gap-2">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="flex flex-col gap-2">
                <h2 class="card-subtitle">
                  {{ $t('level_details.manage.metadata.title_field') }}
                </h2>
                <div class="form-control w-full">
                  <input
                    v-model="title"
                    class="input input-bordered"
                    :class="{
                      'input-error': title === '',
                    }"
                  >
                  <label class="label opacity-80">
                    <span class="label-text-alt">
                      {{ $t('level_details.manage.metadata.title_hint') }}
                    </span>
                  </label>
                </div>
              </div>

              <div class="flex flex-col gap-2">
                <h2 class="card-subtitle">
                  {{ $t('level_details.manage.metadata.localized_title_field') }}
                </h2>
                <div class="form-control w-full">
                  <input
                    v-model="titleLocalized"
                    class="input input-bordered"
                  >
                  <label class="label opacity-80">
                    <span class="label-text-alt">
                      {{ $t('level_details.manage.metadata.localized_title_hint') }}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <h2 class="card-subtitle">
                {{ $t('level_details.manage.metadata.music_url_field') }}
              </h2>
              <div class="form-control w-full">
                <input
                  v-model="artistUrl"
                  class="input input-bordered"
                >
                <label class="label opacity-80">
                  <span class="label-text-alt">
                    {{ $t('level_details.manage.metadata.music_url_hint') }}
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div class="divider my-2" />

          <div class="flex flex-col gap-2">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="flex flex-col gap-2">
                <h2 class="card-subtitle">
                  {{ $t('level_details.manage.metadata.artist_field') }}
                </h2>
                <div class="form-control w-full">
                  <input
                    v-model="artist"
                    class="input input-bordered"
                    :class="{
                      'input-error': artist === '',
                    }"
                  >
                  <label class="label opacity-80">
                    <span class="label-text-alt">
                      {{ $t('level_details.manage.metadata.artist_hint') }}
                    </span>
                  </label>
                </div>
              </div>

              <div class="flex flex-col gap-2">
                <h2 class="card-subtitle">
                  {{ $t('level_details.manage.metadata.localized_artist_field') }}
                </h2>
                <div class="form-control w-full">
                  <input
                    v-model="artistLocalized"
                    class="input input-bordered"
                  >
                  <label class="label opacity-80">
                    <span class="label-text-alt">
                      {{ $t('level_details.manage.metadata.localized_artist_hint') }}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="divider my-2" />

          <div class="flex flex-col gap-2">
            <div class="flex flex-col gap-2">
              <h2 class="card-subtitle">
                {{ $t('level_details.manage.metadata.cover_art_field') }}
              </h2>
              <div class="form-control w-full">
                <input
                  v-model="illustrator"
                  class="input input-bordered"
                  :class="{
                    'input-error': illustrator === '',
                  }"
                >
                <label class="label opacity-80">
                  <span class="label-text-alt">
                    {{ $t('level_details.manage.metadata.cover_art_hint') }}
                  </span>
                </label>
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <h2 class="card-subtitle">
                {{ $t('level_details.manage.metadata.cover_art_url_field') }}
              </h2>
              <div class="form-control w-full">
                <input
                  v-model="illustratorUrl"
                  class="input input-bordered"
                >
                <label class="label opacity-80">
                  <span class="label-text-alt">
                    {{ $t('level_details.manage.metadata.cover_art_url_hint') }}
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div class="divider my-2" />

          <div class="flex flex-col gap-2">
            <div class="flex flex-col gap-2">
              <h2 class="card-subtitle">
                Charter
              </h2>
              <div class="form-control w-full">
                <input
                  v-model="charter"
                  class="input input-bordered"
                  :class="{
                    'input-error': charter === '',
                  }"
                >
                <label class="label opacity-80">
                  <span class="label-text-alt">
                    The name of who made the chart.
                  </span>
                </label>
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <h2 class="card-subtitle">
                Storyboarder
              </h2>
              <div class="form-control w-full">
                <input
                  v-model="storyboarder"
                  class="input input-bordered"
                >
                <label class="label opacity-80">
                  <span class="label-text-alt">
                    The name of who made the storyboard for this level.
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div class="divider my-2" />

          <div class="alert alert-info mb-2">
            <Icon name="mdi:information-variant-circle-outline" size="24" />
            <span>
              Please follow the difficulty rating guidelines when rating your charts.
            </span>

            <NuxtLink class="btn btn-ghost btn-sm" to="/posts/difficulty-v2">
              <Icon name="ic:sharp-chevron-right" size="24" />
            </NuxtLink>
          </div>
          <div class="flex flex-col gap-4">
            <div v-for="chart in charts" :key="chart.type" class="flex gap-4">
              <div
                class="w-2 rounded-full" :class="{
                  'diff-bg-easy': chart.type === 'easy',
                  'diff-bg-hard': chart.type === 'hard',
                  'diff-bg-extreme': chart.type === 'extreme',
                }"
              />
              <div class="flex flex-1 flex-col gap-2 overflow-x-hidden">
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div class="flex flex-col gap-2">
                    <h2 class="card-subtitle">
                      {{ `${chart.type} Difficulty Name` }}
                    </h2>
                    <div class="form-control w-full">
                      <input
                        v-model="chart.name"
                        :placeholder="getDefaultChartName(chart.type)"
                        class="input input-bordered"
                      >
                      <label class="label opacity-80">
                        <span class="label-text-alt">
                          Custom name for this difficulty.
                        </span>
                      </label>
                    </div>
                  </div>

                  <div class="flex flex-col gap-2">
                    <h2 class="card-subtitle">
                      {{ `${chart.type} Difficulty Rating` }}
                    </h2>
                    <div class="form-control w-full">
                      <input
                        v-model="chart.difficulty"
                        type="number"
                        max="16" min="0"
                        :placeholder="chart.difficulty.toString()"
                        class="input input-bordered"
                      >
                      <label class="label opacity-80">
                        <span class="label-text-alt">
                          Difficulty rating for this chart. Allowed: 0-16.
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card-actions justify-between">
            <button
              class="btn btn-ghost"
              @click="reset"
            >
              Reset
            </button>
            <Captcha v-slot="{ verify }">
              <button
                class="btn btn-primary"
                :disabled="!canSubmit"
                @click="submit(verify)"
              >
                <span v-if="isSubmitting" class="loading loading-spinner" />
                {{ $t('general.save_btn') }}
              </button>
            </Captcha>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
