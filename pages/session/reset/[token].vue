<script setup lang="ts">
const route = useRoute()

const { t } = useLocales()

const token = computed(() => route.params.token as string)

const loading = ref(false)
const form = ref({
  password: '',
  passwordAgain: '',
})

enum ResetStatus {
  Nature,
  Success,
  WrongToken,
}
const status = ref(ResetStatus.Nature)

const passwordVerify = computed(() => {
  const password = form.value.password
  if (password === '') {
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
  return form.value.password === form.value.passwordAgain
    ? null
    : t('general.password_confirmation_mismatch')
})

const verified = computed(() => {
  return passwordVerify.value === null && passwordAgainVerify.value === null
})

const mutation = graphql(/* GraphQL */`
  mutation ChangePasswordWithToken($password: String!, $token: String!) {
    success: changePasswordWithToken(password: $password, token: $token)
  }
`)

async function submit() {
  const password = form.value.password

  loading.value = true
  useTimeoutFn(() => {
    loading.value = false
  }, 1000)

  const response = await useMutation(mutation, {
    password,
    token: token.value,
  }).catch((e) => {
    handleErrorToast(e)
  })
  if (response?.success) {
    status.value = ResetStatus.Success
  }
  else {
    status.value = ResetStatus.WrongToken
  }

  loading.value = false
}

defineCytoidPage({
  title: 'Confirm - Reset Password',
  background: '/images/session.jpg',
})
</script>

<template>
  <LayoutSession>
    <div class="my-2">
      <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <div v-if="status === ResetStatus.Nature" class="card-body">
          <h2 class="card-title">
            {{ 'Reset your password' }}
          </h2>

          <div class="form-control">
            <div class="join w-full">
              <label for="reset-password" class="join-item btn btn-neutral">
                <Icon name="material-symbols:key" size="18" />
              </label>
              <input
                id="reset-password" v-model="form.password" type="password" :placeholder="t('general.new_password_field_label')"
                :class="{
                  'input-error': passwordVerify !== null,
                }" class="join-item input input-bordered flex-1 w-full"
              >
            </div>
            <label class="label">
              <span class="label-text-alt" />
              <span class="label-text-alt">{{ passwordVerify }}</span>
            </label>
          </div>
          <div class="form-control">
            <div class="join w-full">
              <label for="reset-password-again" class="join-item btn btn-neutral">
                <Icon name="material-symbols:key" size="18" />
              </label>
              <input
                id="reset-password-again" v-model="form.passwordAgain" type="password" :placeholder="t('general.password_confirm_field_label')"
                :class="{
                  'input-error': passwordAgainVerify !== null,
                }" class="join-item input input-bordered flex-1 w-full"
              >
            </div>
            <label class="label">
              <span class="label-text-alt" />
              <span class="label-text-alt">{{ passwordAgainVerify }}</span>
            </label>
          </div>

          <div class="form-control mt-2">
            <button :disabled="loading || !verified" class="btn btn-primary" @click="submit()">
              {{ t('general.submit_btn') }}
            </button>
          </div>
        </div>

        <div v-else-if="status === ResetStatus.Success" class="card-body">
          <h2 class="card-title">
            {{ 'Success!' }}
          </h2>
          <p>{{ 'Welcome back to Cytoid!' }}</p>
          <div class="form-control mt-2">
            <NuxtLink class="btn btn-success" :to="{ name: 'session-login' }">
              {{ t('general.login_btn') }}
            </NuxtLink>
          </div>
        </div>

        <div v-else class="card-body">
          <h2 class="card-title">
            {{ 'Oops...' }}
          </h2>
          <p>{{ 'This is a bit awkward, but the link expired.' }}</p>
          <div class="form-control mt-2">
            <NuxtLink class="btn btn-secondary" :to="{ name: 'session-reset' }">
              {{ 'Try Again' }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </LayoutSession>
</template>
