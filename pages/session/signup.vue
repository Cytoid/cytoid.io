<script setup lang="ts">
const router = useRouter()
const route = useRoute()

const { t } = useLocales()
const { updateUser } = useWriteableAuth()

const linkMutation = gql(`
  mutation LinkExternalAccount($token: String!) {
    result: addExternalAccount(token: $token)
  }
`)

const loading = ref(false)
const form = ref({
  username: '',
  email: '',
  password: '',
  passwordAgain: '',
})
const tos = ref(false)

// auto fill uid
if (route.query.username) {
  form.value.username = route.query.username.toString()
}

const ctdIdVerify = computed(() => {
  if (
    form.value.username === ''
    || form.value.username.length < 3
    || form.value.username.length > 16
    || !/^[a-z0-9_-]+$/.test(form.value.username)
  ) {
    return t('signup.id_requirement')
  }

  return null
})

const emailVerify = computed(() => {
  if (form.value.email === '') {
    return t('signup.email_field_error_required')
  }

  return isValidEmail(form.value.email) ? null : t('signup.email_field_error_invalid')
})

const passwordVerify = computed(() => {
  const password = form.value.password
  if (password === '') {
    return t('signup.password_field_error_required')
  }

  if (password.length < 9) {
    return t('general.password_requirement_length')
  }

  if (!/\d/.test(password)) {
    return t('general.password_requirement_number')
  }

  if (!/[a-z]/i.test(password)) {
    return t('general.password_requirement_letter')
  }

  return null
})

const passwordAgainVerify = computed(() => {
  return form.value.password === form.value.passwordAgain
    ? null
    : t('general.password_confirmation_mismatch')
})

const verified = computed(() => {
  return tos.value
    && ctdIdVerify.value === null
    && emailVerify.value === null
    && passwordVerify.value === null
    && passwordAgainVerify.value === null
})

async function signUp(verify: () => Promise<string>) {
  loading.value = true

  try {
    const captchaToken = await verify()

    const response = await useServiceFetch<SessionResponse>('/session', {
      method: 'PUT',
      body: {
        uid: form.value.username,
        email: form.value.email,
        password: form.value.password,
        captcha: captchaToken,
      },
    })
    const { data, error } = response
    if (error.value || !data.value?.user) {
      if (error.value?.data.message) {
        handleErrorToast(new Error(error.value.data.message))
      }
      else {
        handleErrorToast(error.value ?? new Error('Unknown error'))
      }

      loading.value = false
      return
    }

    const userData = data.value?.user

    if (route.query.token) {
      const token = route.query.token.toString()
      // Bind account if register by third party
      await useMutation(linkMutation, {
        token,
      })
    }

    updateUser(userData)
    successAlert('Sign up successfully!')
    loginNext()
  }
  catch (error) {
    handleErrorToast(error as Error)
  }
  loading.value = false
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
  title: 'Sign Up',
  background: '/images/session.jpg',
})
</script>

<template>
  <LayoutSession>
    <div class="my-2">
      <div class="card w-full max-w-sm shrink-0 bg-base-100 shadow-2xl">
        <div class="card-body">
          <h2 class="card-title">
            {{ t('signup.title') }}
          </h2>

          <!-- Cytoid ID -->
          <div class="form-control">
            <div class="join w-full">
              <label for="login-username" class="btn join-item btn-neutral">
                <Icon name="ph:user-bold" size="18" />
              </label>
              <input
                id="login-username" v-model="form.username" type="text" :placeholder="t('signup.id_placeholder')"
                :class="{
                  'input-error': ctdIdVerify !== null,
                }" class="input join-item input-bordered w-full flex-1"
              >
            </div>
            <label class="label">
              <span class="label-text-alt">{{ t('signup.id_requirement') }}</span>
            </label>
          </div>

          <!-- Email -->
          <div class="form-control">
            <div class="join w-full">
              <label for="reset-mail" class="btn join-item btn-neutral">
                <Icon name="mdi:email-outline" size="18" />
              </label>
              <input
                id="reset-mail" v-model="form.email" type="email" :placeholder="t('signup.email_placeholder')" :class="{
                  'input-error': emailVerify !== null,
                }" class="input join-item input-bordered w-full flex-1"
              >
            </div>
            <label class="label">
              <span class="label-text-alt" />
              <span class="label-text-alt">{{ emailVerify }}</span>
            </label>
          </div>

          <!-- Password -->
          <div class="form-control">
            <div class="join w-full">
              <label for="reset-password" class="btn join-item btn-neutral">
                <Icon name="material-symbols:key" size="18" />
              </label>
              <input
                id="reset-password" v-model="form.password" type="password"
                :placeholder="t('signup.password_field_placeholder')" :class="{
                  'input-error': passwordVerify !== null,
                }" class="input join-item input-bordered w-full flex-1"
              >
            </div>
            <label class="label">
              <span class="label-text-alt" />
              <span class="label-text-alt">{{ passwordVerify }}</span>
            </label>
          </div>
          <div class="form-control">
            <div class="join w-full">
              <label for="reset-password-again" class="btn join-item btn-neutral">
                <Icon name="material-symbols:key" size="18" />
              </label>
              <input
                id="reset-password-again" v-model="form.passwordAgain" type="password"
                :placeholder="t('signup.password_confirm_field_placeholder')" :class="{
                  'input-error': passwordAgainVerify !== null,
                }" class="input join-item input-bordered w-full flex-1"
              >
            </div>
            <label class="label">
              <span class="label-text-alt" />
              <span class="label-text-alt">{{ passwordAgainVerify }}</span>
            </label>
          </div>

          <!-- TOS -->
          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text">{{ t('signup.tos_field_title', [t('general.tos')]) }}</span>
              <input v-model="tos" type="checkbox" class="checkbox-primary checkbox">
            </label>
          </div>

          <div class="form-control tooltip mt-2" :data-tip="t('signup.tos_field_error_required')">
            <Captcha v-slot="{ verify }">
              <button :disabled="loading || !verified" class="btn btn-secondary w-full" @click="signUp(verify)">
                {{ t('signup.join_btn') }}
              </button>
            </Captcha>
          </div>

          <div class="divider">
            OR
          </div>
          <h2 class="card-title">
            {{ t('signup.existing_user_title') }}
          </h2>
          <p>{{ t('signup.existing_user_content') }}</p>
          <div class="form-control mt-2">
            <NuxtLink class="btn btn-primary" :to="{ name: 'session-login' }">
              {{ t('general.login_btn') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </LayoutSession>
</template>
