<script setup lang="ts">
const router = useRouter()
const route = useRoute()

const { t } = useLocales()

const { login: _loginWithPayload, user } = useAuth()

const loading = ref(false)

const loginForm = {
  username: '',
  password: '',
  remember: false,
}

async function loginWithPayload(verify: () => Promise<string>) {
  if (loginForm.username === '') {
    return
  }

  if (loginForm.password === '') {
    return
  }

  loading.value = true

  try {
    const captchaToken = await verify()
    const response = await _loginWithPayload({
      ...loginForm,
      username: loginForm.username.toLowerCase(),
      captcha: captchaToken,
    })

    if (response.error.value) {
      const error = response.error.value
      const code = error.statusCode
      if (code === 401) {
        errorAlert(t('general.login_password_error'))
      }
      else if (code === 403) {
        warningAlert(t('general.login_inactive_error'))
      }
      else if (code === 404) {
        errorAlert(t('general.login_username_error'))
      }
      else {
        handleErrorToast(error)
      }
      return
    }

    if (user.value) {
      successAlert(t('general.login_snack_bar', { name: user.value.name || user.value.uid }))
      loginNext()
    }
  } catch (error) {
    handleErrorToast(error as Error)
  }

  loading.value = false
}
function loginWithProvider(provider: string) {
  if (process.client) {
    window.addEventListener('message', providerResponded)
    window.open(useServiceUrl(`/session/external/${provider}`))
  }

  function providerResponded(event: MessageEvent) {
    if (event.origin !== 'https://services.cytoid.io') {
      return
    }

    window.removeEventListener('message', providerResponded)
    if (event.data.user) {
      user.value = event.data.user
      successAlert(t('general.login_snack_bar', { name: event.data.user.name || event.data.user.uid }))
      loginNext()
    }
    else if (event.data.token && event.data.provider) {
      router.replace({
        name: 'session-link',
        query: {
          token: event.data.token,
          provider: event.data.provider,
          origin: route.query.origin || null,
        },
      })
    }
  }
}

function loginNext() {
  if (route.query.origin) {
    router.replace({ path: decodeURIComponent(route.query.origin.toString()) })
  }
  else {
    router.replace({ name: 'settings-account' })
  }
}

defineCytoidPage({
  title: 'Login',
  background: '/images/session.jpg',
})
</script>

<template>
  <LayoutSession>
    <div class="my-2">
      <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <div class="card-body">
          <h2 class="card-title">
            {{ t('login.title') }}
          </h2>
          <p>{{ t('login.subtitle') }}</p>
          <div class="mt-2" />
          <div class="form-control">
            <div class="join w-full">
              <label for="login-username" class="join-item btn btn-neutral">
                <Icon name="ph:user-bold" size="18" />
              </label>
              <input
                id="login-username" v-model="loginForm.username" type="text" :placeholder="t('login.username_field_placeholder')"
                class="join-item input input-bordered flex-1 w-full"
              >
            </div>
          </div>
          <div class="form-control">
            <div class="join w-full">
              <label for="login-password" class="join-item btn btn-neutral">
                <Icon name="material-symbols:key" size="18" />
              </label>
              <input
                id="login-password" v-model="loginForm.password" type="password" :placeholder="t('login.password_field_placeholder')"
                class="join-item input input-bordered flex-1 w-full"
              >
            </div>
            <label class="label">
              <NuxtLink :to="{ name: 'session-reset' }" class="label-text-alt link link-hover ml-auto">{{ t('general.forgot_password_link_title') }}</NuxtLink>
            </label>
          </div>
          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text">{{ t('login.remember_me_checkbox_title') }}</span>
              <input type="checkbox" :checked="loginForm.remember" class="checkbox checkbox-primary">
            </label>
          </div>
          <div class="form-control mt-2">
            <Captcha v-slot="{ verify }">
              <button :disabled="loading" class="btn btn-primary" @click="loginWithPayload(verify)">
                {{ t('general.login_btn') }}
              </button>
            </Captcha>
          </div>
          <div class="flex w-full justify-around">
            <button :disabled="loading" class="btn btn-link" @click="loginWithProvider('google')">
              <Icon name="bi:google" size="20" />
            </button>
            <button :disabled="loading" class="btn btn-link">
              <Icon name="bi:facebook" size="20" @click="loginWithProvider('facebook')" />
            </button>
            <button :disabled="loading" class="btn btn-link">
              <Icon name="bi:discord" size="20" @click="loginWithProvider('discord')" />
            </button>
          </div>
          <div class="divider">
            OR
          </div>
          <h2 class="card-title">
            {{ t('login.new_user_welcome_title') }}
          </h2>
          <p>{{ t('login.new_user_welcome_content') }}</p>
          <div class="form-control mt-2">
            <NuxtLink class="btn btn-secondary" :to="{ name: 'session-signup' }">
              {{ t('general.signup_btn') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </LayoutSession>
</template>
