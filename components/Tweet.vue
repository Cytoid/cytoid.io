<script setup lang="ts">
defineProps<{
  conversation?: 'none'
}>()

onMounted(() => {
  nextTick(async () => {
    try {
      // @ts-expect-error cdn
      window?.twttr.widgets.load()
    }
    catch (error) {
      console.error(error)
    }
  })
})

useHead({
  script: [
    {
      src: 'https://platform.twitter.com/widgets.js',
      async: true,
    },
  ],
})
</script>

<template>
  <div class="card bg-base-100 overflow-hidden border-solid border-gray-500">
    <div class="p-8 pb-2">
      <h2 class="card-subtitle">
        {{ $t('homepage.latest_tweet_title') }}
      </h2>
    </div>
    <div class="p-4 pt-0 mb-8 max-h-96 overflow-y-auto">
      <a
        class="twitter-timeline"
        data-dnt="true"
        data-theme="dark"
        data-tweet-limit="4"
        data-chrome="transparent noborders nofooter noheader noscrollbar"
        href="https://twitter.com/cytoidio"
      >
        Loading Tweets...
      </a>
    </div>
  </div>
</template>

<style>
.twitter-timeline > iframe {
  color-scheme: light;
}
</style>
