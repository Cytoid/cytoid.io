<script setup lang="ts">
const { t } = useLocales()

const { updateUser } = useWriteableAuth()
const { user } = useAuth()

const query = gql(`
  query GetUserSecuritySettings {
    my {
      externals: externalAccountProviders
    }
  }
`)
const changePassowordMutation = gql(`
  mutation ChangePassword($old: String!, $new: String!) {
    result: changePassword(oldPassword: $old, newPassword: $new)
  }
`)
const unLinkMutation = gql(`
  mutation RemoveExternalAccount($provider: String!) {
    result: removeExternalAccount(provider: $provider)
  }        
`)
const linkMutation = gql(`
  mutation LinkExternalAccount($token: String!) {
    result: addExternalAccount(token: $token)
  }
`)

const providers = computed<{
  id: string
  icon: string
  title: string
}[]>(() => [
  { id: 'facebook', icon: 'ion:logo-facebook', title: 'Facebook' },
  { id: 'google', icon: 'ion:logo-google', title: 'Google' },
  { id: 'discord', icon: 'ion:logo-discord', title: 'Discord' },
])

const loading = ref(false)

// Change Password
const password = ref('')
const newPassword = ref('')
const newPasswordConfirm = ref('')

const newPasswordVerify = computed(() => {
  if (newPassword.value === '') {
    return t('signup.password_field_error_required')
  }

  if (newPassword.value.length < 9) {
    return t('general.password_requirement_length')
  }

  if (!/[0-9]/.test(newPassword.value)) {
    return t('general.password_requirement_number')
  }

  if (!/[a-zA-Z]/.test(newPassword.value)) {
    return t('general.password_requirement_letter')
  }

  return null
})
const newPasswordConfirmVerify = computed(() => {
  return newPassword.value === newPasswordConfirm.value
    ? null
    : t('general.password_confirmation_mismatch')
})

async function changePassword() {
  loading.value = true

  try {
    const res = await useMutation(changePassowordMutation, {
      old: password.value,
      new: newPassword.value,
    })
    if (res?.result) {
      successAlert('Password Changed Successfully!')
      password.value = ''
      newPassword.value = ''
      newPasswordConfirm.value = ''
    }
    else {
      throw new Error('The old password is incorrect')
    }
  }
  catch (e) {
    handleErrorToast(e as Error)
  }
  loading.value = false
}

// External Accounts

const { data } = useAsyncQuery(query)
const providersLoading = ref<string | null>(null)

function isLinked(provider: string) {
  return data.value?.my?.externals.includes(provider)
}

function link(provider: string) {
  providersLoading.value = provider

  providersLoading.value = provider
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
        data.value?.my?.externals.push(event.data.provider)
        successAlert(`You have linked your ${event.data.provider} account`)
      }
      catch (error) {
        handleErrorToast(error as Error)
      }
    }
    else {
      errorAlert('Incomplete information returned from OAuth service')
    }
    providersLoading.value = null
  }, { once: true })
}
async function unLink(provider: string) {
  providersLoading.value = provider

  await useMutation(unLinkMutation, {
    provider,
  })
  data.value?.my?.externals.splice(
    data.value?.my?.externals.findIndex(e => e === provider),
    1,
  )
  warningAlert(`You have unlinked your ${provider} account`)

  providersLoading.value = null
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <div class="card w-full overflow-hidden bg-base-100 shadow-xl">
      <div class="card card-body flex flex-col gap-2">
        <h2 class="card-subtitle mb-2">
          {{ $t('general.password_field_label') }}
        </h2>

        <div class="form-control">
          <div class="join w-full">
            <label for="password" class="btn join-item btn-neutral">
              <Icon name="material-symbols:key" size="18" />
            </label>
            <input
              id="password" v-model="password" type="password"
              :placeholder="t('signup.password_field_placeholder')"
              class="input join-item input-bordered w-full flex-1"
            >
          </div>
          <label class="label">
            <span class="label-text-alt" />
          </label>
        </div>

        <div class="form-control">
          <div class="join w-full">
            <label for="reset-password" class="btn join-item btn-neutral">
              <Icon name="material-symbols:key" size="18" />
            </label>
            <input
              id="reset-password" v-model="newPassword" type="password"
              :placeholder="t('general.new_password_field_label')" :class="{
                'input-error': newPasswordVerify !== null && newPassword !== '',
              }" class="input join-item input-bordered w-full flex-1"
            >
          </div>
          <label class="label">
            <span v-if="newPassword !== ''" class="label-text-alt">{{ newPasswordVerify }}</span>
          </label>
        </div>

        <div class="form-control">
          <div class="join w-full">
            <label for="reset-password-again" class="btn join-item btn-neutral">
              <Icon name="material-symbols:key" size="18" />
            </label>
            <input
              id="reset-password-again" v-model="newPasswordConfirm" type="password"
              :placeholder="t('signup.password_confirm_field_placeholder')" :class="{
                'input-error': newPasswordConfirmVerify !== null,
              }" class="input join-item input-bordered w-full flex-1"
            >
          </div>
          <label class="label">
            <span class="label-text-alt">{{ newPasswordConfirmVerify }}</span>
            <span class="label-text-alt" />
          </label>
        </div>

        <div class="card-actions justify-end">
          <button
            :disabled="loading || password === '' || newPasswordVerify !== null || newPasswordConfirmVerify !== null"
            class="btn btn-primary"
            @click="changePassword"
          >
            {{ $t('general.submit_btn') }}
          </button>
        </div>
      </div>
    </div>

    <div class="card w-full overflow-hidden bg-base-100 shadow-xl">
      <div class="card card-body flex flex-col gap-2">
        <h2 class="card-subtitle mb-2">
          {{ $t('general.third_party_sign_on') }}
        </h2>
        <div class="overflow-x-auto">
          <table class="table">
            <tbody>
              <tr v-for="provider in providers" :key="provider.id">
                <td>
                  <div class="flex items-center space-x-3">
                    <div class="avatar">
                      <Icon :name="provider.icon" size="36" />
                    </div>
                    <div>
                      <div class="font-bold">
                        {{ provider.title }}
                      </div>
                      <div class="text-sm opacity-50">
                        {{
                          isLinked(provider.id)
                            ? 'Connected'
                            : 'Not Connected'
                        }}
                      </div>
                    </div>
                  </div>
                </td>
                <th class="flex justify-end">
                  <button v-if="isLinked(provider.id)" class="btn btn-error" @click="unLink(provider.id)">
                    Unlink
                  </button>
                  <button v-else class="btn btn-neutral" @click="link(provider.id)">
                    Link
                  </button>
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
