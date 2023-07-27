<script setup lang="ts">
import { Howl } from 'howler'

const ctdPage = useCytoidPage()
const pagePreview = computed(() => ctdPage.value?.preview)

const { previewState, updatePreviewState, updatePreviewCurrent, resetPreviewState } = usePreviewState()
const { previewOrder } = usePreviewOrder()

const player = ref<Howl | null>(null)

const nowPlaying = ref<string>('')

const timer = useRafFn(() => {
  if (player.value && player.value.playing() === true) {
    updatePreviewCurrent(player.value.seek())
  }
})

const progress = computed(() => {
  if (previewState.value.state === 'playing' || previewState.value.state === 'paused') {
    return previewState.value.currentTime / previewState.value.duration * 100
  }
  return 0
})

watch(previewOrder, (val) => {
  if (val) {
    if (val === nowPlaying.value) {
      reset()
    }
    else {
      readyAndPlay(val)
    }
    previewOrder.value = null
  }
})

async function readyAndPlay(url: string) {
  await ready(url)
  await play()
}

function ready(url: string) {
  return new Promise<void>((resolve) => {
    reset()
    updatePreviewState({
      state: 'loading',
      url,
    })
    nowPlaying.value = url
    player.value = new Howl({
      src: [nowPlaying.value],
    })
    player.value.once('end', () => {
      reset()
    })
    player.value.on('play', () => {
      timer.resume()
    })
    player.value.once('load', () => {
      updatePreviewState({
        state: 'paused',
        url: nowPlaying.value,
        duration: player.value?.duration() ?? 0,
        currentTime: player.value?.seek() ?? 0,
      })
      resolve()
    })
    if (player.value.state() === 'loaded') {
      resolve()
    }
  })
}

async function play() {
  if (player.value) {
    player.value.play()
  }
  updatePreviewState({
    state: 'playing',
    url: nowPlaying.value,
    duration: player.value?.duration() ?? 0,
    currentTime: player.value?.seek() ?? 0,
  })
}

async function pause() {
  if (player.value) {
    player.value.pause()
  }
  updatePreviewState({
    state: 'paused',
    url: nowPlaying.value,
    duration: player.value?.duration() ?? 0,
    currentTime: player.value?.seek() ?? 0,
  })
  timer.pause()
  if (pagePreview.value && pagePreview.value !== nowPlaying.value) {
    reset()
  }
}

function reset() {
  if (player.value) {
    player.value.off()
    player.value.stop()
    // remove player
    player.value = null
  }
  nowPlaying.value = ''
  resetPreviewState()
  timer.pause()
}

function onClick() {
  if (previewState.value.state === 'loading') {
    return
  }

  if (previewState.value.state === 'playing') {
    pause()
  }
  else if (previewState.value.state === 'paused') {
    play()
  }
  else if (pagePreview.value) {
    readyAndPlay(pagePreview.value)
  }
}
</script>

<template>
  <ClientOnly>
    <div v-if="pagePreview || previewState.state !== 'ended'" class="fixed bottom-6 right-6">
      <button class="btn btn-secondary btn-lg btn btn-circle" @click="onClick()">
        <Icon v-if="previewState.state === 'loading'" name="mdi:loading" size="32" class="animate-spin" />
        <div v-else-if="progress" class="radial-progress" :style="`--value:${progress}; --size:3.5rem; --thickness: 0.3rem;`">
          <Icon v-if="previewState.state === 'playing'" name="mdi:pause" size="32" />
          <Icon v-else name="mdi:play" size="32" />
        </div>
        <Icon v-else name="mdi:play" size="32" />
      </button>
      <audio />
    </div>
  </ClientOnly>
</template>
