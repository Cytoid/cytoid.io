<template>
  <LayoutSession>
    <div class="my-2">
      <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <div class="card-body">
          <h2 class="card-title">{{ t('signup.title') }}</h2>

          <!-- Cytoid ID -->
          <div class="form-control">
            <div class="join w-full">
              <label for="login-username" class="join-item btn btn-neutral">
                <Icon name="ph:user-bold" size="18" />
              </label>
              <input id="login-username" v-model="form.username" type="text" :placeholder="t('signup.id_placeholder')"
                :class="{
                  'input-error': ctdIdVerify != null
                }" class="join-item input input-bordered flex-1 w-full" />
            </div>
            <label class="label">
              <span class="label-text-alt">{{ t('signup.id_requirement') }}</span>
            </label>
          </div>

          <!-- Email -->
          <div class="form-control">
            <div class="join w-full">
              <label for="reset-mail" class="join-item btn btn-neutral">
                <Icon name="mdi:email-outline" size="18" />
              </label>
              <input id="reset-mail" v-model="form.email" type="email" :placeholder="t('signup.email_placeholder')" :class="{
                'input-error': emailVerify != null
              }" class="join-item input input-bordered flex-1 w-full" />
            </div>
            <label class="label">
              <span class="label-text-alt"></span>
              <span class="label-text-alt">{{ emailVerify }}</span>
            </label>
          </div>

          <!-- Password -->
          <div class="form-control">
            <div class="join w-full">
              <label for="reset-password" class="join-item btn btn-neutral">
                <Icon name="material-symbols:key" size="18" />
              </label>
              <input id="reset-password" v-model="form.password" type="password"
                :placeholder="t('signup.password_field_placeholder')" :class="{
                  'input-error': passwordVerify != null
                }" class="join-item input input-bordered flex-1 w-full" />
            </div>
            <label class="label">
              <span class="label-text-alt"></span>
              <span class="label-text-alt">{{ passwordVerify }}</span>
            </label>
          </div>
          <div class="form-control">
            <div class="join w-full">
              <label for="reset-password-again" class="join-item btn btn-neutral">
                <Icon name="material-symbols:key" size="18" />
              </label>
              <input id="reset-password-again" v-model="form.passwordAgain" type="password"
                :placeholder="t('signup.password_confirm_field_placeholder')" :class="{
                  'input-error': passwordAgainVerify != null
                }" class="join-item input input-bordered flex-1 w-full" />
            </div>
            <label class="label">
              <span class="label-text-alt"></span>
              <span class="label-text-alt">{{ passwordAgainVerify }}</span>
            </label>
          </div>

          <!-- TOS -->
          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text">{{ t('signup.tos_field_title', [t('general.tos')]) }}</span>
              <input type="checkbox" v-model="tos" class="checkbox checkbox-primary" />
            </label>
          </div>

          <div class="form-control mt-2 tooltip" :data-tip="t('signup.tos_field_error_required')">
            <Captcha v-slot="{ verify }">
              <button :disabled="loading || !verified" class="btn btn-secondary w-full" @click="signUp(verify)">
                {{ t('signup.join_btn') }}</button>
            </Captcha>
          </div>

          <div class="divider">OR</div>
          <h2 class="card-title">{{ t('signup.existing_user_title') }}</h2>
          <p>{{ t('signup.existing_user_content') }}</p>
          <div class="form-control mt-2">
            <NuxtLink class="btn btn-primary" to="/session/login">{{ t('general.login_btn') }}</NuxtLink>
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
const { user } = useAuth()

const linkMutation = graphql(/* GraphQL */`
  mutation LinkExternalAccount($token: String!) {
    result: addExternalAccount(token: $token)
  }
`)

const loading = ref(false)
const form = ref({
  username: '',
  email: '',
  password: '',
  passwordAgain: ''
})
const tos = ref(false)

// auto fill uid
if (route.query.username) {
  form.value.username = route.query.username.toString()
}

const ctdIdVerify = computed(() => {
  // Cytoid ID 只能包含小写字母, 数字,下划线 (_), 连字号 (-), 且长度为 3 到 16 个字符
  if (
    form.value.username == ''
    || form.value.username.length < 3
    || form.value.username.length > 16
    || !/^[a-z0-9_-]+$/.test(form.value.username)
  ) {
    return t('signup.id_requirement')
  }
  return null
})

const emailVerify = computed(() => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  if (form.value.email == '') {
    return t('signup.email_field_error_required')
  }
  return emailRegex.test(form.value.email) ? null : t('signup.email_field_error_invalid')
})

const passwordVerify = computed(() => {
  const password = form.value.password
  if (password == '') {
    return t('signup.password_field_error_required')
  }
  if (password.length < 9) {
    return t('general.password_requirement_length')
  }
  if (!/[0-9]/.test(password)) {
    return t('general.password_requirement_number')
  }
  if (!/[a-zA-Z]/.test(password)) {
    return t('general.password_requirement_letter')
  }
  return null
})

const passwordAgainVerify = computed(() => {
  return form.value.password === form.value.passwordAgain ? null
    : t('general.password_confirmation_mismatch')
})

const verified = computed(() => {
  return tos.value
    && ctdIdVerify.value == null
    && emailVerify.value == null
    && passwordVerify.value == null
    && passwordAgainVerify.value == null
})

const signUp = async (verify: () => Promise<string>) => {
  loading.value = true

  const captchaToken = await verify()

  const response = await useServiceFetch<SessionResponse>('/session', {
    method: 'PUT',
    body: {
      uid: form.value.username,
      email: form.value.email,
      password: form.value.password,
      captcha: captchaToken
    }
  })
  const { data, error } = response
  if (error.value || !data.value?.user) {
    if (error.value?.message) {
      handleErrorToast(new Error(error.value.message))
    } else {
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
      token: token
    })
  }

  user.value = userData

  successAlert('Sign up successfully!')

  loading.value = false
  loginNext()
}

function loginNext() {
  if (route.query.origin) {
    router.replace({ path: decodeURIComponent(route.query.origin.toString()) })
  } else {
    router.replace({ name: 'settings-account' })
  }
}

defineCytoidPage({
  title: 'Sign Up',
  background: '/images/session.jpg'
})
</script>
