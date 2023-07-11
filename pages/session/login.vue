<template>
  <LayoutSession>
    <div class="my-2">
      <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <div class="card-body">
          <h2 class="card-title">{{ t('login.title') }}</h2>
          <p>{{ t('login.subtitle') }}</p>
          <div class="mt-2" />
          <div class="form-control">
            <div class="join w-full">
              <span class="join-item btn btn-neutral">
                <Icon name="ph:user-bold" size="18" />
              </span>
              <input v-model="loginForm.username" type="text" :placeholder="t('login.username_field_placeholder')"
                class="join-item input input-bordered flex-1 w-full" />
            </div>
          </div>
          <div class="form-control">
            <div class="join w-full">
              <span class="join-item btn btn-neutral">
                <Icon name="material-symbols:key" size="18" />
              </span>
              <input v-model="loginForm.password" type="password" :placeholder="t('login.password_field_placeholder')"
                class="join-item input input-bordered flex-1 w-full" />
            </div>
            <label class="label">
              <a href="#" class="label-text-alt link link-hover ml-auto">{{ t('general.forgot_password_link_title')
              }}</a>
            </label>
          </div>
          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text">{{ t('login.remember_me_checkbox_title') }}</span>
              <input type="checkbox" :checked="loginForm.remember" class="checkbox checkbox-primary" />
            </label>
          </div>
          <div class="form-control mt-2">
            <Captcha v-slot="{ verify }">
              <button class="btn btn-primary" @click="loginWithPayload(verify)">{{ t('general.login_btn') }}</button>
            </Captcha>
          </div>
          <div class="flex w-full justify-around">
            <button class="btn btn-link" @click="loginWithProvider('google')">
              <Icon name="bi:google" size="20" />
            </button>
            <button class="btn btn-link">
              <Icon name="bi:facebook" size="20" @click="loginWithProvider('facebook')" />
            </button>
            <button class="btn btn-link">
              <Icon name="bi:discord" size="20" @click="loginWithProvider('discord')" />
            </button>
          </div>
          <div class="divider">OR</div>
          <h2 class="card-title">{{ t('login.new_user_welcome_title') }}</h2>
          <p>{{ t('login.new_user_welcome_content') }}</p>
          <div class="form-control mt-2">
            <NuxtLink class="btn btn-primary" to="/session/signup">{{ t('general.signup_btn') }}</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </LayoutSession>
</template>

<script setup lang="ts">
const router = useRouter()
const route = useRoute()

const { t } = useI18n()

const { login: _loginWithPayload, user } = useAuth()

const loginForm = {
  username: "",
  password: "",
  remember: false
}

const loginWithPayload = async (verify: () => any) => {
  if (loginForm.username === '') {
    return
  }
  if (loginForm.password === '') {
    return
  }

  const captchaToken = await verify()
  // console.log(captchaToken)
  const userData = await _loginWithPayload({
    ...loginForm,
    captcha: captchaToken
  }).catch((error) => {
    const code = error.response?.status ?? 0
    if (code == 401) {
      errorAlert(t('general.login_password_error'))
      return
    } else if (code == 403) {
      warningAlert(t('general.login_inactive_error'))
      return
    } else if (code == 404) {
      errorAlert(t('general.login_username_error'))
      return
    } else {
      console.log(`Unknown error(${code}): `, error)
    }
  })
  // console.log(userData)
  if (userData) {
    successAlert(t('general.login_snack_bar', {name: userData.name || userData.uid}))
    loginNext()
  }
}
const loginWithProvider = (provider: string) => {
  if (process.client) {
    window.addEventListener('message', providerResponded)
    window.open(useServiceUrl('/session/external/' + provider))
  }

  function providerResponded(event: MessageEvent) {
    console.log(event.data)
    console.log(event.origin)
    if (event.origin !== 'https://services.cytoid.io') {
      return
    }
    window.removeEventListener('message', providerResponded)
    if (event.data.user) {
      user.value = event.data.user
      successAlert(t('general.login_snack_bar', {name: event.data.user.name || event.data.user.uid}))
      loginNext()
    } else if (event.data.token && event.data.provider) {
      router.replace({
        name: 'session-link',
        query: {
          token: event.data.token,
          provider: event.data.provider,
          origin: route.query.origin || null,
        }
      })
    }
  }
}


function loginNext() {
  if (route.query.origin) {
    router.replace({ path: decodeURIComponent(route.query.origin.toString()) })
  } else {
    router.replace({ name: 'settings-account' })
  }
}
</script>
