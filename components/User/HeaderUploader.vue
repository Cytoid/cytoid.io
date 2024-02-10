<script setup lang="ts">
const props = defineProps<{
  userId: string
}>()

const file = ref<File | null>(null)
const started = ref(false)

const query = gql(`
  query GetSettingsProfileHeader($id: ID!) {
    profile(id: $id) {
      header {
        stripe
      }
    }
  }
`)

const mutation = gql(`
  mutation UpdateProfileHeader($path: String!) {
    result: updateProfileHeader(path: $path) {
      stripe
    }
  }
`)

const { data } = await useAsyncData(() => useQuery(query, {
  id: props.userId,
}))

const userOnlineCover = ref(data.value?.profile?.header?.stripe ?? '')

async function uploadHook(upload: () => Promise<FilePostResponse | null | undefined>) {
  started.value = true
  await upload()
}

async function afterUpload(newData: FilePostResponse | null | undefined) {
  if (!newData) {
    throw new Error('Failed when posting')
  }
  const res = await useMutation(mutation, {
    path: newData.path,
  })

  started.value = false
  file.value = null

  if (!res?.result?.stripe) {
    throw new Error('Failed when updating')
  }
  userOnlineCover.value = res.result.stripe

  successAlert('Avatar Updated')
}

function getSelectFileUrl(file: File) {
  if (process.client) {
    return URL.createObjectURL(file)
  }
  else {
    return ''
  }
}
</script>

<template>
  <BaseUploader
    v-model="file"
    type="headers"
    accept=".jpg, .jpeg, .png, .gif, .webp, .svg, .bmp"
    :callback="afterUpload"
  >
    <template
      #dropZone="{ upload, reset, isOverDropZone, openDialog }"
    >
      <div class="card w-full shadow-xl overflow-hidden bg-base-100">
        <div
          class="card-body card flex flex-col bg-secondary/25"
        >
          <!-- Background -->
          <div
            v-if="userOnlineCover || file" class="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-25 blur-3xl pointer-events-none"
            :style="{
              backgroundImage: `url(&quot;${file ? getSelectFileUrl(file) : userOnlineCover}&quot;)`,
            }"
          />
          <h2 class="card-subtitle">
            {{ $t('settings.profile_header_title') }}
          </h2>
          <div
            class="w-full"
            :class="{
              clickable: !started,
            }"
          >
            <div
              class="flex-1 border-4 border-dashed p-0 my-2 rounded-2xl flex flex-col items-center justify-between select-none gap-2"
              :class="{
                'border-neutral-content': isOverDropZone,
                'border-neutral-content/25': !isOverDropZone,
              }"
              @click="openDialog"
            >
              <div
                class="aspect-[768/180] w-full rounded-2xl bg-cover bg-center"
                :style="{
                  backgroundImage: `url(&quot;${file ? getSelectFileUrl(file) : userOnlineCover}&quot;)`,
                }"
              />
            </div>
            <div
              class="alert bg-base-100/50 border-0"
              @click="openDialog"
            >
              <Icon name="mdi:lightbulb-on-outline" size="24" />
              <span>
                <strong class="font-blod pr-2">{{ $t('general.file_upload_default_title') }}</strong>{{ $t('general.file_upload_default_subtitle') }}
              </span>
            </div>
          </div>

          <div class="card-actions">
            <button v-show="file" class="btn btn-ghost" :disabled="started" @click="reset()">
              Cancel
            </button>
            <div class="flex-1" />
            <button
              class="btn btn-secondary"
              :disabled="started || !file"
              @click="uploadHook(upload)"
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </template>
    <template
      #default="{ message, progress, error }"
    >
      <div v-if="started">
        <div v-if="error" class="alert alert-error">
          <Icon name="material-symbols:error-circle-rounded-outline" size="24" />
          <span>{{ error }}</span>
        </div>
        <div v-else class="alert bg-neutral border-0 shadow-lg">
          <Icon name="mdi:upload" size="24" />
          <div>
            <h3 class="font-bold">
              Uploading...
            </h3>
            <div class="text-xs">
              {{ message }}
            </div>
          </div>
          <div v-if="progress" class="flex gap-2">
            {{ truncateNum(progress * 100) }}%
            <div
              class="radial-progress"
              :style="`--value:${progress * 100}; --size: 1.5rem; --thickness: 0.15rem;`"
            />
          </div>
          <div v-else>
            <Icon name="mdi:loading" size="24" class="animate-spin" />
          </div>
        </div>
      </div>
    </template>
  </BaseUploader>
</template>
