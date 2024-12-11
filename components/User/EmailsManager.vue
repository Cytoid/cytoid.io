<script setup lang="ts">
const query = gql(`
  query GetUserEmails {
    my {
      emails {
        address
        verified
        primary
      }
    }
  }
`)

const mutationAdd = gql(`
  mutation AddEmail($email: String!) {
    addEmail(email: $email)
  }
`)
const mutationRemove = gql(`
  mutation DeleteEmail($email: String!) {
    deleteEmail(email: $email)
  }
`)
const mutationMakePrimary = gql(`
  mutation MakeEmailPrimary($email: String!) {
    makeEmailPrimary(email: $email)
  }
`)
const mutationVerify = gql(`
  mutation SendConfirmationEmail($email: String!) {
    sendVerificationEmail(email: $email)
  }
`)

const { t } = useLocales()

const { data } = await useAsyncQuery(query)

const loading = ref(false)

const newEmail = ref('')
const emailVerify = computed(() => {
  if (newEmail.value === '') {
    return t('signup.email_field_error_required')
  }

  return isValidEmail(newEmail.value) ? null : t('signup.email_field_error_invalid')
})

const hasVerifiedEmail = computed(() => {
  return data.value?.my?.emails.some(e => e.verified) ?? false
})

async function addEmail() {
  if (emailVerify.value !== null) {
    loading.value = false
    return
  }
  loading.value = true

  try {
    await useMutation(mutationAdd, {
      email: newEmail.value,
    })

    data.value?.my?.emails.push({
      address: newEmail.value,
      verified: false,
      primary: false,
    })
  }
  catch (error) {
    handleErrorToast(error as Error)
  }

  loading.value = false
}
async function removeEmail(email: string) {
  loading.value = true

  try {
    await useMutation(mutationRemove, {
      email,
    })
    data.value?.my?.emails.splice(
      data.value?.my?.emails.findIndex(e => e.address === email),
      1,
    )
  }
  catch (error) {
    handleErrorToast(error as Error)
  }

  loading.value = false
}
async function makePrimary(email: string) {
  loading.value = true

  try {
    await useMutation(mutationMakePrimary, {
      email,
    })
    data.value?.my?.emails.forEach((e) => {
      e.primary = e.address === email
    })
    successAlert(`${email} is now your primary email address`)
  }
  catch (error) {
    handleErrorToast(error as Error)
  }

  loading.value = false
}
async function verifyEmail(email: string, verify: () => Promise<string>) {
  loading.value = true

  try {
    const captchaToken = await verify()
    await useMutation(mutationVerify, {
      email,
      captcha: captchaToken,
    })
    successAlert(`Verification email sent to ${email}`)
  }
  catch (error) {
    handleErrorToast(error as Error)
  }

  loading.value = false
}
</script>

<template>
  <Captcha v-slot="{ verify }">
    <div class="card w-full overflow-hidden bg-base-100 shadow-xl">
      <div
        class="card card-body flex flex-col gap-2"
      >
        <h2 class="card-subtitle">
          {{ $t('settings.email_title') }}
        </h2>
        <div v-if="!hasVerifiedEmail" class="alert alert-warning">
          <Icon name="mdi:alert-circle-outline" size="24" />
          <span>
            {{ $t('settings.email_verify_warning') }}
          </span>
        </div>
        <div class="mb-4 overflow-x-auto">
          <table class="table">
            <tbody>
              <tr
                v-for="email in data?.my?.emails" :key="email.address"
              >
                <td class="flex-1 pr-8">
                  <div class="flex gap-2">
                    {{ email.address }}
                    <div v-if="email.primary" class="badge badge-secondary badge-outline">
                      Primary
                    </div>
                    <div v-if="!email.verified" class="badge badge-warning badge-outline">
                      Unverified
                    </div>
                  </div>
                </td>
                <td class="flex justify-end gap-2">
                  <button
                    v-if="!email.primary && email.verified"
                    :disabled="loading"
                    class="btn btn-secondary btn-sm"
                    @click="makePrimary(email.address)"
                  >
                    {{ $t('settings.email_make_primary') }}
                  </button>
                  <button
                    v-if="!email.verified"
                    :disabled="loading"
                    class="btn btn-warning btn-sm"
                    @click="verifyEmail(email.address, verify)"
                  >
                    {{ $t('settings.email_verify') }}
                  </button>
                  <button
                    :disabled="loading"
                    class="btn btn-error btn-sm"
                    @click="removeEmail(email.address)"
                  >
                    {{ $t('settings.email_delete') }}
                  </button>
                </td>
              </tr>
              <tr />
            </tbody>
          </table>
        </div>

        <h2 class="card-subtitle">
          {{ $t('settings.email_add') }}
        </h2>
        <div>
          <div>
            <div class="join w-full max-w-sm">
              <label for="reset-mail" class="btn join-item btn-neutral">
                <Icon name="mdi:email-outline" size="18" />
              </label>
              <input
                id="reset-mail" v-model="newEmail" type="email" :class="{
                  'input-error': emailVerify !== null,
                }" class="input join-item input-bordered w-full flex-1"
              >
            </div>
            <label class="label">
              <span class="label-text-alt">{{ emailVerify }}</span>
            </label>
          </div>
          <div class="card-actions justify-end">
            <button
              :disabled="loading || !!emailVerify"
              class="btn btn-primary"
              @click="addEmail"
            >
              {{ $t('settings.email_add_btn') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Captcha>
</template>
