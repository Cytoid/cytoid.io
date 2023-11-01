<script setup lang="ts">
const { root, execute: _execute, onVerify, onExpired, onError, reset } = useChallengeV2({
  options: {
    size: 'invisible',
    badge: 'bottomleft',
  },
})

async function execute(): Promise<string> {
  const response = await new Promise<string>((resolve, reject) => {
    reset()
    onVerify((response) => {
      resolve(response)
      reset()
    })
    onExpired(() => {
      reject(new Error('token expired'))
      reset()
    })
    onError(() => {
      reject(new Error('error'))
      reset()
    })
    _execute()

    // timeout: 60s
    setTimeout(() => {
      reject(new Error('timeout'))
      reset()
    }, 60000)
  })
  return response
}

onMounted(() => {
  useRecaptchaProvider()
})
</script>

<template>
  <slot :verify="execute" />
  <ClientOnly>
    <Teleport to="body">
      <div class="google-captcha">
        <div ref="root" />
      </div>
    </Teleport>
  </ClientOnly>
</template>
