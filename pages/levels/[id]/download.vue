<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const levelId = route.params.id.toString()

const { ready, isLogin, toLogin } = useAuth()

const callback = computed(() => {
  if (route.query.callback) {
    try {
      const url = new URL(route.query.callback.toString())
      // only allow localhost to use http
      if (url.protocol === 'http:' && url.hostname !== 'localhost') {
        throw new Error(`remote http is not allowed`)
      }
      return url
    }
    catch (e) { console.error(e) }
  }
  return null
})
const callbackName = computed(() => {
  if (!callback.value?.hostname) {
    return 'Unknown Service'
  }
  if (callback.value.hostname === 'localhost') {
    return 'Local Application'
  }
  if (/^(?:\d{1,3}\.){3}\d{1,3}$/.test(callback.value.hostname)) {
    return 'Unknown Service'
  }

  return callback.value.hostname.toUpperCase()
})

const isTrusted = computed(() => {
  const whitelist = [
    'cytoid.io',
    'player.cytusol.xyz',
  ]

  return whitelist.includes(callbackName.value.toLowerCase())
})

const query = gql(`
  query FetchLevelForDownload($uid: String!) {
    level(uid: $uid) {
      title
      ...LevelCardData
    }
  }
`)

const { data, error } = await useAsyncQuery(query, {
  uid: levelId,
})
if (levelId && !data.value?.level) {
  showError(error.value?.message ?? createError({
    statusCode: 404,
    statusMessage: `Level not found: ${levelId}`,
  }))
}

const downloadLink = ref<string | null>(null)
async function getDownloadLink(verify: () => Promise<string>) {
  if (!isLogin.value) {
    toLogin()
    return
  }

  if (!downloadLink.value) {
    try {
      const token = await verify()
      const { data: res } = await useServiceFetch<levelDownloadResponse>(`/levels/${levelId}/resources`, {
        method: 'POST',
        body: {
          captcha: token,
        },
      })
      downloadLink.value = res.value?.package ?? ''
    }
    catch (e: unknown) {
      errorAlert((e as Error).message)
    }
  }

  return downloadLink.value
}

const downloadCtl = ref<HTMLDivElement | null>(null)
async function downloadLevel(verify: () => Promise<string>) {
  const link = await getDownloadLink(verify)
  if (!link) {
    errorAlert('Failed to get download link')
    return
  }
  const downloadDom = document.createElement('a')
  downloadDom.href = link
  downloadDom.download = `${levelId}.cytoidlevel`
  downloadCtl.value?.appendChild(downloadDom)
  downloadDom.click()
  downloadCtl.value?.removeChild(downloadDom)
}
async function sendCallback(verify: () => Promise<string>) {
  const link = await getDownloadLink(verify)
  if (!link) {
    errorAlert('Failed to get download link')
    return
  }

  const callbackUrl = new URL(callback.value!)
  callbackUrl.searchParams.append('direct', link)
  callbackUrl.searchParams.append('levelId', levelId)
  if (data.value?.level?.title) {
    callbackUrl.searchParams.append('title', data.value.level.title)
  }

  location.href = callbackUrl.toString()
}

const downloadCytoidDialog = ref<HTMLDialogElement | null>(null)
const { isIos, isAndroid, isMacOS, isApple } = useDevice()
const isMobile = computed(() => {
  return isAndroid || isIos || isMacOS || isApple
})
async function openWithCytoid() {
  const url = `cytoid://levels/${levelId}`
  if (import.meta.client && window?.location) {
    window.location.href = url
  }
  downloadCytoidDialog.value?.showModal()
}

function cancel() {
  if (import.meta.client) {
    window.close()
    setTimeout(() => router.push(`/levels/${levelId}`), 1000)
  }
}
</script>

<template>
  <div v-if="data?.level" class="mx-auto max-w-5xl">
    <div class="relative h-24">
      <div id="contentTitle" class="absolute bottom-0 left-0">
        <h1 class="text-4xl font-bold">
          Download Level
        </h1>
      </div>
    </div>

    <div class="card mt-4 bg-base-100">
      <div class="card-body">
        <div class="grid grid-cols-1 items-center gap-4 sm:grid-flow-dense sm:grid-cols-12 sm:gap-6">
          <LevelCard v-if="data.level" class="min-h-48 sm:col-span-7 sm:h-full" :level="data.level" />

          <Captcha v-slot="{ verify }">
            <div class="flex h-full flex-col gap-2 sm:col-span-5">
              <div v-if="!ready" />

              <div v-else-if="!isLogin" class="flex h-full flex-wrap content-between gap-2">
                <div role="alert" class="alert alert-warning">
                  <Icon name="mdi:alert-circle-outline" size="24" />
                  <span>You need to login your Cytoid account to download this level!</span>
                </div>

                <div class="flex w-full flex-col gap-2">
                  <button v-if="callback" class="btn btn-neutral btn-block" @click="cancel()">
                    Cancel
                  </button>
                  <button class="btn btn-primary btn-block" @click="toLogin()">
                    Login
                  </button>
                </div>
              </div>

              <div v-else-if="callback" class="flex h-full flex-wrap content-between gap-2">
                <div class="flex flex-col gap-2">
                  <h2 class="card-title">
                    Approve {{ callbackName }} to download {{ data.level.title }}
                  </h2>
                  <div v-if="!isTrusted" role="alert" class="alert alert-warning">
                    <Icon name="mdi:alert-circle-outline" size="24" />
                    <span><b>{{ callbackName }}</b> wants to download this level as you. Make sure you trust the site.</span>
                  </div>
                </div>

                <div class="flex w-full flex-col gap-2">
                  <button class="btn btn-neutral btn-block" @click="cancel()">
                    Cancel
                  </button>
                  <button class="btn btn-primary btn-block" @click="sendCallback(verify)">
                    Redirect to {{ callbackName }}
                  </button>
                </div>
              </div>

              <div v-else class="flex h-full flex-wrap content-between gap-2">
                <div>
                  <h2 class="card-title">
                    Download {{ data.level.title }}
                  </h2>
                </div>

                <div class="flex w-full flex-col gap-2">
                  <button v-if="isMobile" class="btn btn-neutral btn-block" @click="openWithCytoid()">
                    Open with Cytoid
                  </button>
                  <button class="btn btn-primary btn-block" @click="downloadLevel(verify)">
                    Download
                  </button>
                </div>
              </div>
            </div>
          </Captcha>
        </div>
      </div>
    </div>
    <div ref="downloadCtl" class="hidden" />
  </div>

  <dialog ref="downloadCytoidDialog" class="modal">
    <form method="dialog" class="modal-box">
      <h3 class="text-lg font-bold">
        Launching Cytoid...
      </h3>
      <p class="py-4">
        Don't have Cytoid on your device yet? Download Cytoid now!
      </p>
      <div class="modal-action">
        <button class="btn btn-square btn-neutral">
          <Icon name="mdi:close" size="18" />
        </button>
        <NuxtLink class="btn btn-primary flex-1" :to="{ name: 'download' }">
          Download Cytoid
        </NuxtLink>
      </div>
    </form>
  </dialog>
</template>
