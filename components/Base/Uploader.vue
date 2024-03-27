<script setup lang="ts">
const props = withDefaults(defineProps<{
  type: string
  value?: any
  disabled?: boolean
  accept?: string
  callback?: (data: FilePostResponse) => Promise<void>
}>(), {
  disabled: false,
})
const file = defineModel<File | null>({ required: true })

function updateFile(f: File | null) {
  const accepts = props.accept?.split(',') ?? []
  if (accepts.length > 0) {
    const accept = accepts.find(a => f?.name.toLowerCase().endsWith(a.trim().toLowerCase()))
    if (!accept) {
      errorAlert(`Please select a file with extension ${accepts.join(', ')}`)
      return
    }
  }
  file.value = f
}

const state = ref<UploadState | null>(null)
const error = ref<string>('')

// number: progress, null: loading, undefined: not started
const progress = ref<number | null | undefined>(undefined)

enum UploadState {
  error,
  verifying,
  creating,
  uploading,
  checking,
  posting,
}

const stateMessage = computed(() => {
  switch (state.value) {
    case UploadState.verifying:
      return 'Verifying request'
    case UploadState.creating:
      return 'Creating file entry'
    case UploadState.uploading:
      return 'Uploading file'
    case UploadState.checking:
      return 'Checking file'
    case UploadState.posting:
      return 'Post-processing'
    case UploadState.error:
      return error.value
  }
  return ''
})

const dropZoneRef = ref<HTMLDivElement>()
const fileRef = ref<HTMLInputElement>()
const { isOverDropZone } = useDropZone(dropZoneRef, (files: File[] | null) => {
  if (state.value !== null || state.value === UploadState.error) {
    return
  }
  if (files && files.length === 1) {
    updateFile(files[0])
  }
  else {
    errorAlert('Please select only one file')
  }
})

function uploadFnBuilder(verify: () => Promise<string>) {
  return async () => {
    if (file.value === null) {
      return
    }
    return uploadFile(file.value, verify)
  }
}

function reset() {
  file.value = null
}

function openFileSelector() {
  fileRef.value?.click()
}
function onSelected() {
  const selected = fileRef.value?.files?.[0] ?? null
  if (file.value !== selected) {
    updateFile(selected)
  }
}

async function uploadFile(file: File, verify: () => Promise<string>) {
  try {
    state.value = UploadState.verifying
    const token = await verify()

    state.value = UploadState.creating
    const res = await useServiceFetch<FilePostResponse>(`/files/${props.type}`, {
      method: 'POST',
      body: {
        filename: file.name,
        contentType: file.type,
        captcha: token,
      },
    })
    if (!res.data.value?.uploadURL) {
      throw new Error('Unknown error: uploadURL not found')
    }

    state.value = UploadState.uploading
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      if (!res.data.value?.uploadURL) {
        reject(new Error('Unknown error: uploadURL not found'))
        return
      }
      xhr.open('PUT', res.data.value.uploadURL, true)
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          progress.value = e.loaded / e.total
        }
      }
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            progress.value = undefined
            resolve()
          }
        }
      }
      xhr.send(file)
    })

    state.value = UploadState.checking
    await useServiceFetch(`/files/${res.data.value.path}`, {
      method: 'PUT',
      body: {
        token: res.data.value.token,
      },
    })

    if (props.callback) {
      state.value = UploadState.posting
      await props.callback(res.data.value)
    }
    state.value = null

    return res.data.value
  }
  catch (e) {
    const message = (e as Error).message
    state.value = UploadState.error
    progress.value = undefined
    error.value = message
    errorAlert(message)
  }

  return null
}
</script>

<template>
  <Captcha v-slot="{ verify }">
    <div ref="dropZoneRef">
      <slot
        name="dropZone"
        :is-over-drop-zone="isOverDropZone"
        :open-dialog="openFileSelector"
        :upload="uploadFnBuilder(verify)"
        :reset="reset"
      />
      <input
        ref="fileRef"
        type="file" :accept="accept"
        style="display: none;"
        @change="onSelected"
      >
    </div>
    <slot
      :upload="uploadFnBuilder(verify)"
      :reset="reset"
      :message="stateMessage"
      :error="state === UploadState.error ? error : null"
      :progress="progress"
    />
  </Captcha>
</template>
