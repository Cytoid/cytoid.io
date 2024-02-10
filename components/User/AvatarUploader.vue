<script setup lang="ts">
const props = defineProps<{
  userId: string
}>()

const file = ref<File | null>(null)
const started = ref(false)

const userOnlineAvatar = ref<string>(avatarURL(props.userId))

const mutation = gql(`
  mutation UpdateAvatar($path: String) {
    result: setAvatar(path: $path) {
      large
    }
  }
`)

async function uploadHook(upload: () => Promise<FilePostResponse | null | undefined>) {
  started.value = true
  await upload()
}

async function afterUpload(data: FilePostResponse | null | undefined) {
  if (!data) {
    throw new Error('Failed when posting')
  }
  const res = await useMutation(mutation, {
    path: data.path,
  })

  started.value = false
  file.value = null

  if (!res?.result?.large) {
    throw new Error('Failed when updating')
  }
  userOnlineAvatar.value = res.result.large

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
    type="avatar"
    accept=".jpg, .jpeg, .png, .gif, .webp, .svg, .bmp"
    :callback="afterUpload"
  >
    <template
      #dropZone="{ upload, reset, isOverDropZone, openDialog }"
    >
      <div class="card w-full bg-base-100 shadow-xl overflow-hidden">
        <div
          class="card-body card flex flex-col bg-primary/25"
        >
          <h2 class="card-subtitle">
            {{ $t('settings.avatar_title') }}
          </h2>
          <div
            class="flex-1 border-4 border-dashed p-6 my-2 rounded-2xl flex flex-col items-center justify-between select-none gap-2"
            :class="{
              'border-neutral-content': isOverDropZone,
              'border-neutral-content/25': !isOverDropZone,
              'clickable': !started,
            }"
            @click="openDialog"
          >
            <div class="w-full flex justify-center gap-2">
              <div
                class="w-[40%] max-w-[10rem] aspect-square bg-cover bg-center rounded-full"
                :style="{
                  'background-image': `url(${userOnlineAvatar})`,
                }"
              />
              <template v-if="file">
                <div class="flex flex-col justify-center items-center px-4">
                  <Icon name="mdi:arrow-right" size="40" />
                </div>
                <div
                  class="w-[40%] max-w-[10rem] aspect-square bg-cover bg-center rounded-full"
                  :style="{
                    'background-image': `url(${getSelectFileUrl(file)})`,
                  }"
                />
              </template>
            </div>
          </div>
          <div class="card-actions">
            <button v-show="file" class="btn btn-ghost" :disabled="started" @click="reset()">
              Cancel
            </button>
            <div class="flex-1" />
            <button
              class="btn btn-primary"
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
