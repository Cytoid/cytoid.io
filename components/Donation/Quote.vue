<script setup lang="ts">
const props = defineProps<{
  userUid: string
  name: string
  externals: string[]
  quote: string
}>()

const { t } = useLocales()

const avatar = computed(() => avatarURL(props.userUid))
const otherExternals = computed(() => [
  'afdian',
])
const externals = computed(() => props.externals.filter(external => otherExternals.value.includes(external)))

const quote = ref(props.quote)

const loading = ref(false)

async function updateQuote() {
  loading.value = true

  try {
    await useServiceFetch('/membership', {
      method: 'POST',
      body: JSON.stringify({
        quote: quote.value,
      }),
    })
    successAlert(t('settings.quote_updated'))
  }
  catch (error) {
    handleErrorToast(error as Error)
  }
  loading.value = false
}
</script>

<template>
  <div class="card w-full overflow-hidden bg-base-100 shadow-xl">
    <div class="card card-body bg-secondary/25">
      <div class="alert border-0 bg-secondary/25">
        <Icon name="mdi:heart" size="24" />
        <span>
          {{ $t('settings.patreon_linked_prompt') }}
        </span>
        <div v-if="externals.length > 0">
          <div v-for="external in externals" :key="external" class="badge badge-info">
            {{ external }}
          </div>
        </div>
      </div>
      <h2 class="card-subtitle mt-2">
        {{ $t('general.sponsorship') }}
      </h2>
      <div class="m-4 mt-0 flex w-full">
        <div class="avatar">
          <div class="mt-4 size-16 rounded-full">
            <img :src="avatar">
          </div>
        </div>
        <div class="flex w-0 flex-1 flex-col justify-center gap-1 px-4 pt-6">
          <div>
            <p class="card-title break-all">
              {{ name }}
            </p>
          </div>
          <div class="badge badge-warning flex gap-2">
            <Icon name="mdi:crown" />
            {{ $t('general.sponsor_name') }}
          </div>
        </div>
      </div>
      <h2 class="card-subtitle mt-2">
        {{ $t('general.sponsorship_quote') }}
      </h2>
      <div class="join flex">
        <input v-model="quote" class="input join-item input-bordered input-secondary flex-1 bg-base-100">
        <button class="btn btn-secondary join-item" @click="updateQuote">
          {{ $t('general.save_btn') }}
        </button>
      </div>
      <div class="alert border-0 bg-secondary/25">
        <Icon name="mdi:lightbulb-on-outline" size="24" />
        <span>
          {{ $t('settings.quote_question_mark_button') }}
        </span>
        <NuxtLink class="btn btn-ghost btn-xs" :to="{ name: 'credits' }">
          {{ $t('general.credits') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
