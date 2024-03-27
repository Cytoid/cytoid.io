<script setup lang="ts">
const token = useState<string>('turnstileToken', () => '')
const error = useState<string>('turnstileError', () => '')
const lock = useState<boolean>('turnstileLock', () => false)

const loaded = useState<boolean>('turnstileLoaded', () => false)
const isMain = ref(false)

const turnstile = ref()

if (import.meta.client && loaded.value === false) {
  loaded.value = true
  isMain.value = true
}
if (isMain.value) {
  onBeforeUnmount(() => {
    isMain.value = false
    loaded.value = false
  })
  watch(token, (value) => {
    if (value === '') {
      turnstile.value?.reset()
    }
  })
}

async function execute(): Promise<string> {
  await until(lock).toMatch(value => value === false)
  const response = await new Promise<string>((resolve, reject) => {
    lock.value = true
    until(token).toMatch(value => value !== '').then(() => {
      resolve(token.value)
      token.value = ''
      lock.value = false
    })
    until(error).toMatch(value => value !== '').then(() => {
      reject(new Error(error.value === '' ? 'Turnstile timeout' : error.value))
      error.value = ''
      lock.value = false
    })
  })
  return response
}

function onErrorFn(errorStr: string) {
  return () => {
    error.value = errorStr
  }
}
</script>

<template>
  <slot :verify="execute" />
  <ClientOnly v-if="isMain">
    <Teleport to="body">
      <dialog
        class="modal"
        :class="{
          'modal-open': lock && token === '',
        }"
      >
        <div class="modal-box w-fit flex flex-col gap-4">
          <h3 class="font-bold text-lg">
            Turnstile
          </h3>
          <div class="w-fit">
            <NuxtTurnstile
              ref="turnstile"
              v-model="token"
              class="rounded-xl overflow-hidden bg-image-loading"
              style="width: 300px; height: 65px;"
              data-appearance="interaction-only"
              :options="{
                'error-callback': onErrorFn('Failed to verify'),
                'expired-callback': onErrorFn('Token expired'),
              }"
            />
          </div>
        </div>
        <div class="modal-backdrop">
          <button @click="onErrorFn('User canceled')()">
            Cancel
          </button>
        </div>
      </dialog>
    </Teleport>
  </ClientOnly>
</template>
