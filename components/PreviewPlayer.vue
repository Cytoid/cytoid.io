<script setup lang="ts">
import { Howl } from 'howler'

const ctdPage = useCytoidPage()
const pagePreview = computed(() => ctdPage.value?.preview)

const { previewState, updatePreviewState, updatePreviewCurrent, resetPreviewState } = usePreviewState()
const { previewOrder } = usePreviewOrder()

const player = ref<Howl | null>(null)

const nowPlaying = ref<string>('')

const fadeInTime = 500 // ms
const fadeOutTime = 800 // ms

const timer = useRafFn(() => {
  if (player.value && player.value.playing() === true) {
    updatePreviewCurrent(player.value.seek())
    // fade out
    if (player.value?.duration() - player.value?.seek() < fadeOutTime / 1000) {
      player.value.volume(Math.max(0, player.value.volume() - 1 / fadeOutTime * 1000 / 60))
    }
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
      if (previewState.value.state === 'playing') {
        reset()
      }
      else {
        play()
      }
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

async function ready(url: string) {
  reset()
  updatePreviewState({
    state: 'loading',
    url,
  })
  nowPlaying.value = url
  player.value = new Howl({
    src: [await preDecodeAudio(nowPlaying.value)],
  })
  player.value.once('end', () => {
    reset()
  })
  player.value.on('play', () => {
    timer.resume()
  })
  await new Promise<void>((resolve) => {
    player.value!.once('load', () => {
      updatePreviewState({
        state: 'paused',
        url: nowPlaying.value,
        duration: player.value?.duration() ?? 0,
        currentTime: player.value?.seek() ?? 0,
      })
      resolve()
    })
    if (player.value!.state() === 'loaded') {
      resolve()
    }
  })
}

async function play() {
  if (player.value) {
    player.value.fade(0, 1, fadeInTime).play()
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
          <Icon v-if="pagePreview && pagePreview !== nowPlaying" name="mdi:stop" size="32" />
          <Icon v-else-if="previewState.state === 'playing'" name="mdi:pause" size="32" />
          <Icon v-else name="mdi:play" size="32" />
        </div>
        <Icon v-else name="mdi:play" size="32" />
      </button>
      <audio />
    </div>
  </ClientOnly>
</template>
