<script setup lang="ts">
const sent = ref('')

const loading = ref(false)
const email = ref('')

const time = ref(0)

const mutation = gql(`
  mutation SendPasswordResetEmail($email: String!){
    sendResetPasswordEmail(email: $email)
  }
`)

async function sendResetRequest(verify: () => Promise<string>) {
  if (sent.value !== '') {
    return await resend(verify)
  }

  if (email.value === '') {
    return
  }

  loading.value = true

  try {
    const captchaToken = await verify()
    const response = await useMutation(mutation, {
      email: email.value,
      captcha: captchaToken,
    }).catch((e) => {
      handleErrorToast(e)
    })
    const success = response?.sendResetPasswordEmail ?? false
    if (!success) {
      errorAlert('The email was never registered / confirmed!')
    }
    else {
      sent.value = email.value
      startTimer()
    }
  }
  catch (error) {
    handleErrorToast(error as Error)
  }

  loading.value = false
}

async function resend(verify: () => Promise<string>) {
  loading.value = true
  try {
    const captchaToken = await verify()
    await Promise.race([
      useTimeoutFn(() => {
        throw new Error('Timeout')
      }, 10000),
      useMutation(mutation, {
        email: sent.value,
        captcha: captchaToken,
      }),
    ])
  }
  catch (error) {
    handleErrorToast(error as Error)
  }
  loading.value = false
}

function startTimer() {
  time.value = 60
  const timer = setInterval(() => {
    time.value--
    if (time.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

defineCytoidPage({
  title: 'Reset Password',
  background: '/images/session.jpg',
})
</script>

<template>
  <LayoutSession>
    <div class="my-2">
      <div class="card w-full max-w-sm shrink-0 bg-base-100 shadow-2xl">
        <div class="card-body">
          <template v-if="sent !== ''">
            <h2 class="card-title">
              <Icon name="ion:md-paper-plane" size="18" />
              {{ 'Sent' }}
            </h2>
            <p>Please check your inbox to continue.</p>
            <div class="mt-2" />
          </template>

          <template v-else>
            <h2 class="card-title">
              <Icon name="🤔" size="18" />
              {{ 'Reset your password' }}
            </h2>
            <p>Enter your email address and we will send you a link to reset your password.</p>
            <div class="mt-2" />
            <div class="form-control">
              <div class="join w-full">
                <label for="reset-mail" class="btn join-item btn-neutral">
                  <Icon name="mdi:email-outline" size="18" />
                </label>
                <input
                  id="reset-mail" v-model="email" type="text" placeholder="Email Address"
                  class="input join-item input-bordered w-full flex-1"
                >
              </div>
            </div>
          </template>

          <div class="form-control mt-2">
            <Captcha v-slot="{ verify }">
              <button :disabled="loading || time > 0" class="btn btn-primary" @click="sendResetRequest(verify)">
                {{ sent ? (
                  time > 0 ? `Resend in ${time} seconds` : 'Resend'
                ) : 'Send' }}
              </button>
            </Captcha>
          </div>
        </div>
      </div>
    </div>
  </LayoutSession>
</template>
