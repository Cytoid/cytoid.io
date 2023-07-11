<template>
  <slot :verify="execute" />
  <ClientOnly>
    <Teleport to="body">    
      <div ref="root" />
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
const { root, execute: _execute, onVerify, onExpired, onError, reset } = useChallengeV2({
  options: {
    size: 'invisible',
    badge: 'bottomleft',
  }
})

const execute = async () : Promise<string> => {
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
  })
  return response
}
useRecaptchaProvider()
</script>