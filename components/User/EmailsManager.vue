<script setup lang="ts">
const query = gql(/* GraphQL */`
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

const mutationAdd = gql(/* GraphQL */`
  mutation AddEmail($email: String!) {
    addEmail(email: $email)
  }
`)
const mutationRemove = gql(/* GraphQL */`
  mutation DeleteEmail($email: String!) {
    deleteEmail(email: $email)
  }
`)
const mutationMakePrimary = gql(/* GraphQL */`
  mutation MakeEmailPrimary($email: String!) {
    makeEmailPrimary(email: $email)
  }
`)
const mutationVerify = gql(/* GraphQL */`
  mutation SendConfirmationEmail($email: String!) {
    sendVerificationEmail(email: $email)
  }
`)

const { t } = useI18n()

const { data } = await useAsyncData(() => useQuery(query))

const loading = ref(false)

const newEmail = ref('')
const emailVerify = computed(() => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  if (newEmail.value === '') {
    return t('signup.email_field_error_required')
  }

  return emailRegex.test(newEmail.value) ? null : t('signup.email_field_error_invalid')
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
    <div class="card w-full bg-base-100 shadow-xl overflow-hidden">
      <div
        class="card-body card flex flex-col gap-2"
      >
        <h2 class="card-subtitle">
          {{ $t('settings.email_title') }}
        </h2>
        <div v-if="!hasVerifiedEmail" class="alert alert-warning">
          <Icon name="mdi:alert-circle-outline" size="24" />
          <span>You have no verified email! You will not be able to access your Cytoid account if you lost your password!</span>
        </div>
        <div class="overflow-x-hidden mb-4">
          <table class="table">
            <tbody>
              <tr
                v-for="email in data?.my?.emails" :key="email.address"
              >
                <td class="flex-1">
                  <div class="flex gap-2">
                    {{ email.address }}
                    <div v-if="email.primary" class="badge badge-secondary badge-outline">
                      Primary
                    </div>
                    <div v-if="!email.verified" class="badge badge-warning badge-outline">
                      Not verified
                    </div>
                  </div>
                </td>
                <td class="flex gap-2 justify-end">
                  <button
                    v-if="!email.primary && email.verified"
                    :disabled="loading"
                    class="btn btn-sm btn-secondary"
                    @click="makePrimary(email.address)"
                  >
                    {{ $t('settings.email_make_primary') }}
                  </button>
                  <button
                    v-if="!email.verified"
                    :disabled="loading"
                    class="btn btn-sm btn-warning"
                    @click="verifyEmail(email.address, verify)"
                  >
                    {{ $t('settings.email_verify') }}
                  </button>
                  <button
                    :disabled="loading"
                    class="btn btn-sm btn-error"
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
            <div class="join w-full max-w-[24rem]">
              <label for="reset-mail" class="join-item btn btn-neutral">
                <Icon name="mdi:email-outline" size="18" />
              </label>
              <input
                id="reset-mail" v-model="newEmail" type="email" :class="{
                  'input-error': emailVerify !== null,
                }" class="join-item input input-bordered flex-1 w-full"
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
