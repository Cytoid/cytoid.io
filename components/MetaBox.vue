<script setup lang="ts">
const props = defineProps({
  metadata: {
    type: Object,
    required: true,
  },
})

const metadata = props.metadata
const metaAllowTypes = ['artist', 'illustrator', 'charter', 'storyboarder', 'cover']

const metaTypes = Object.keys(metadata).filter(v =>
  metaAllowTypes.includes(v)
  && metadata[v] !== null
  && metadata[v] !== undefined,
)
</script>

<template>
  <div v-for="metaType in metaTypes" :key="metaType" class="flex flex-col gap-2">
    <p class="card-subtitle">
      {{ metaType }}
    </p>
    <NuxtLink v-if="metadata[metaType].url" :href="metadata[metaType].url" class="text-2xl hover:underline underline-offset-4 decoration-primary/80" target="_blank">
      {{ metadata[metaType].name }}<Icon name="mdi:link-variant" size="18" class="ml-2" />
    </NuxtLink>
    <p v-else class="text-2xl">
      {{ metadata[metaType].name }}
    </p>
    <p v-if="metadata[metaType].localized_name" class="opacity-60">
      {{ metadata[metaType].localized_name }}
    </p>
  </div>
</template>
