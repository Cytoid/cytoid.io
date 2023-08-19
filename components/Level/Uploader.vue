<script setup lang="ts">
const props = defineProps<{
  replace?: string
}>()
const router = useRouter()

const file = ref<File | null>(null)
const started = ref(false)

const mutation = gql(/* GraphQL */`
  mutation UnpackLevel($token: String!, $replace: String) {
    package: unpackLevelPackage(token: $token, replace: $replace) {
      id
      uid
      title
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
    token: data.token,
    replace: props.replace,
  })
  if (!res?.package) {
    throw new Error('Failed when unpacking')
  }
  const uid = res.package.uid
  const title = res.package.title

  successAlert(`${title} (${uid}) Uploaded`)
  router.push({
    name: 'levels-id-manage-listing',
    params: {
      id: uid,
    },
  })
}
</script>

<template>
  <BaseUploader
    v-model="file"
    type="levels/packages"
    accept=".cytoidlevel,.zip"
    :callback="afterUpload"
  >
    <template
      #dropZone="{ upload, reset, isOverDropZone, openDialog }"
    >
      <div class="card w-full bg-base-100 shadow-xl overflow-hidden">
        <div
          class="card-body card flex flex-col"
          :class="{
            'bg-secondary/25': replace,
            'bg-primary/25': !replace,
          }"
        >
          <h2 class="card-subtitle">
            {{
              replace
                ? $t('level_details.manage.replace_title')
                : 'Upload'
            }}
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
            <Icon name="mdi:file-upload-outline" size="48" />
            <div v-if="file" class="flex gap-1">
              <Icon name="mdi:file-outline" size="20" />
              <p>
                {{ file.name }} ({{ formatBytes(file.size) }})
              </p>
            </div>
            <div v-else>
              <p>
                {{ $t('level_details.manage.replace_upload_title') }}
              </p>
            </div>
          </div>
          <div class="card-actions">
            <button v-show="file" class="btn btn-ghost" :disabled="started" @click="reset()">
              Cancel
            </button>
            <div class="flex-1" />
            <button
              class="btn"
              :class="{
                'btn-secondary': replace,
                'btn-primary': !replace,
              }"
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
            {{ (progress * 100).toFixed(2) }}%
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
      <div v-else>
        <div v-if="replace" class="alert alert-info">
          <Icon name="mdi:lightbulb-on-outline" size="24" />
          <span>
            {{ $t('level_details.manage.replace_upload_subtitle') }} ({{ replace }})
          </span>
        </div>
        <div v-else class="alert alert-info">
          <Icon name="mdi:lightbulb-on-outline" size="24" />
          <span>
            Don't know how to create one? Read our wiki
          </span>
          <a
            class="btn btn-sm btn-ghost"
            href="https://github.com/Cytoid/Cytoid/wiki/a.-Creating-a-level" target="_blank"
          >
            See
          </a>
        </div>
      </div>
    </template>
  </BaseUploader>
</template>
