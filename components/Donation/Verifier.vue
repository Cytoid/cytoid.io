<script setup lang="ts">
defineProps<{
  externals: string[]
}>()
const { updateUser } = useWriteableAuth()
const { user } = useAuth()

const linkMutation = gql(`
  mutation LinkExternalAccountDonation($token: String!) {
    result: addExternalAccount(token: $token)
  }
`)

const loading = ref<string | null>(null)
function link(provider: string) {
  loading.value = provider

  loading.value = provider
  window.open(useServiceUrl(`/session/external/${provider}`))
  useEventListener('message', async (event) => {
    if (event.data.user) {
      updateUser(event.data.user)
      infoAlert(`You're now logged in as ${user.value?.name ?? user.value?.uid}.`)
    }
    else if (event.data.token && event.data.provider) {
      try {
        await useMutation(linkMutation, {
          token: event.data.token,
        })
        successAlert(`You have linked your ${event.data.provider} account`)
        await syncMembershipStatus(provider)
      }
      catch (error) {
        handleErrorToast(error as Error)
      }
    }
    else {
      errorAlert('Incomplete information returned from OAuth service')
    }
    loading.value = null
  }, { once: true })
}

async function syncMembershipStatus(provider: string) {
  loading.value = provider

  try {
    await $fetch(useServiceUrl(`/membership/${provider}`), {
      method: 'PATCH',
    })
    reloadNuxtApp()
  }
  catch (error) {
    handleErrorToast(error as Error)
  }

  loading.value = null
}
</script>

<template>
  <div
    class="card w-full overflow-hidden bg-base-100 shadow-xl"
  >
    <div
      class="card card-body bg-secondary/25"
    >
      <div class="flex flex-col sm:flex-row">
        <div class="flex flex-1 flex-col justify-between">
          <h2 class="card-subtitle mb-2">
            <img src="/images/patreon.webp" class="h-8">
          </h2>

          <p v-if="externals.includes('patreon')">
            {{ $t('settings.patreon_linked_prompt') }}
          </p>
          <p v-else>
            {{ $t('settings.patreon_link_prompt') }}
          </p>

          <button v-if="externals.includes('patreon')" class="btn btn-secondary mt-4" @click="syncMembershipStatus('patreon')">
            {{ $t('general.sync_btn') }}
          </button>
          <button v-else class="btn btn-secondary mt-4" @click="link('patreon')">
            {{ $t('general.link_btn') }}
          </button>
        </div>
        <div class="divider sm:divider-horizontal">
          OR
        </div>
        <div class="flex flex-1 flex-col justify-end">
          <p>
            {{ $t('homepage.connect_patreon_content') }}
          </p>
          <NuxtLink to="https://www.patreon.com/tigerhix" class="btn btn-secondary mt-4">
            Become a patron!
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
