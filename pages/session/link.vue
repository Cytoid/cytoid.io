<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { t } = useLocales()

const { login: _loginWithPayload } = useWriteableAuth()
const { user } = useAuth()

const token = computed(() => route.query.token as string | undefined)
const provider = computed(() => route.query.provider as string | undefined)
const origin = computed(() => route.query.origin as string | undefined)

const loading = ref(false)
const linkForm = {
  username: '',
  password: '',
  confirm: '',
}

const mutation = gql(`
  mutation LinkExternalAccount($token: String!) {
    result: addExternalAccount(token: $token)
  }
`)

async function linkAccount(verify: () => Promise<string>) {
  if (linkForm.username === '') {
    return
  }

  if (linkForm.password === '') {
    return
  }

  if (!token.value) {
    return
  }

  if (!provider.value) {
    return
  }

  loading.value = true

  try {
    const captchaToken = await verify()
    // try to login
    const response = await _loginWithPayload({
      ...linkForm,
      remember: false,
      captcha: captchaToken,
    })
    if (response.error.value) {
      const error = response.error.value
      const code = error.statusCode
      if (code === 401) {
        errorAlert(t('general.login_password_error'))
        return
      }
      else if (code === 403) {
        warningAlert(t('general.login_inactive_error'))
        return
      }
      else if (code === 404) {
        // Account does not exist.
        router.replace({
          name: 'session-signup',
          query: {
            token: token.value,
            provider: provider.value,
            username: linkForm.username,
            origin: origin.value,
          },
        })
      }
      else {
        handleErrorToast(error)
      }
    }
    else {
      if (user.value) {
        // link Account
        await useMutation(mutation, {
          token: token.value,
        })

        successAlert(t('general.login_snack_bar', { name: user.value.name || user.value.uid }))
        // loginNext()
        if (route.query.origin) {
          router.replace({ path: decodeURIComponent(route.query.origin.toString()) })
        }
        else { router.replace({ name: 'settings-account' }) }
      }
    }
  }
  catch (error) {
    handleErrorToast(error as Error)
  }
  loading.value = false
}

defineCytoidPage({
  title: 'Link',
  background: '/images/session.jpg',
})
</script>

<template>
  <LayoutSession>
    <div class="my-2">
      <div class="card w-full max-w-sm shrink-0 bg-base-100 shadow-2xl">
        <div class="card-body">
          <h2 class="card-title">
            {{ t('link.title', { provider }) }}
          </h2>
          <p>{{ t('link.subtitle') }}</p>
          <div class="mt-2" />
          <div class="form-control">
            <div class="join w-full">
              <label for="link-username" class="btn join-item btn-neutral">
                <Icon name="ph:user-bold" size="18" />
              </label>
              <input
                id="link-username" v-model="linkForm.username" type="text" :placeholder="t('login.username_field_placeholder')"
                class="input join-item input-bordered w-full flex-1"
              >
            </div>
          </div>
          <div class="form-control">
            <div class="join w-full">
              <label for="link-password" class="btn join-item btn-neutral">
                <Icon name="material-symbols:key" size="18" />
              </label>
              <input
                id="link-password" v-model="linkForm.password" type="password" :placeholder="t('login.password_field_placeholder')"
                class="input join-item input-bordered w-full flex-1"
              >
            </div>
          </div>
          <div class="form-control mt-2">
            <Captcha v-slot="{ verify }">
              <button :disabled="loading" class="btn btn-primary" @click="linkAccount(verify)">
                {{ t('general.login_btn') }}
              </button>
            </Captcha>
          </div>
        </div>
      </div>
    </div>
  </LayoutSession>
</template>
