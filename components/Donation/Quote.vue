<script setup lang="ts">
const props = defineProps<{
  userUid: string
  name: string
  externals: string[]
  quote: string
}>()

const { t } = useI18n()

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
  <div class="card w-full bg-base-100 shadow-xl overflow-hidden">
    <div class="card-body card bg-secondary/25">
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
      <div class="flex w-full m-4 mt-0">
        <div class="avatar">
          <div class="w-16 h-16 mt-4 rounded-full">
            <img :src="avatar">
          </div>
        </div>
        <div class="flex flex-col justify-center gap-1 flex-1 pt-6 px-4 w-0">
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
        <input v-model="quote" class="flex-1 input input-bordered input-secondary bg-base-100 join-item">
        <button class="btn btn-secondary join-item" @click="updateQuote">
          {{ $t('general.save_btn') }}
        </button>
      </div>
    </div>
  </div>
</template>
