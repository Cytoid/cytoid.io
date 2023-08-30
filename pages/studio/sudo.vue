<script setup lang="ts">
const router = useRouter()
const { user, ready } = useAuth()

const superuserDialog = ref<HTMLDialogElement | null>(null)

const superuserUid = 'cytoid'

const command = ref('')
const argument = ref('')

const loading = ref(false)

onMounted(async () => {
  try {
    await until(ready).toBeTruthy({ timeout: 1000, throwOnTimeout: true })
    if (!['admin', 'moderator'].includes(user.value?.role ?? '')) {
      throw new Error('Permission denied')
    }
  }
  catch (error) {
    console.error(error)
    router.push({
      name: 'studio',
    })
  }
})

async function beSuperUser() {
  try {
    await $fetch(useServiceUrl('/session/sudo'), {
      method: 'POST',
    })
    reloadNuxtApp({
      path: '/studio/sudo',
      persistState: false,
    })
  }
  catch (error) {
    handleErrorToast(error as Error)
  }
}

async function sendWorkerCommand(type?: string) {
  await $fetch(useServiceUrl(
    type
      ? `/workers/${type}`
      : '/workers',
  ), {
    method: 'POST',
    body: {
      command: command.value,
      argument: argument.value,
    },
  })
  successAlert('Command sent')
}
</script>

<template>
  <div v-if="user?.uid === superuserUid" class="alert alert-warning">
    <Icon name="ph:hash-bold" size="24" />
    <span>You're the superuser now!</span>
  </div>
  <div v-else-if="user && ['admin', 'moderator'].includes(user.role)" class="w-full flex flex-col gap-5">
    <div class="card overflow-hidden bg-base-100 w-full shadow-xl">
      <div class="card-body gap-4 bg-secondary/25">
        <div class="flex flex-col gap-2">
          <h2 class="card-subtitle">
            Superuser
          </h2>
          <p>
            Do you want to be a superuser?
          </p>
          <button class="btn btn-secondary" @click="superuserDialog?.showModal()">
            Be a superuser
          </button>
        </div>
      </div>
    </div>

    <div class="card overflow-hidden bg-base-100 w-full shadow-xl">
      <div class="card-body gap-4">
        <div class="flex flex-col gap-2">
          <h2 class="card-subtitle">
            Worker Command
          </h2>

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">Command</span>
            </label>
            <input v-model="command" type="text" class="input input-bordered w-full">
          </div>

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">Argument</span>
            </label>
            <input v-model="argument" type="text" class="input input-bordered w-full">
          </div>
        </div>

        <div class="card-actions justify-end">
          <button class="btn btn-neutral" @click="sendWorkerCommand('level')">
            Emit Level
          </button>
          <button class="btn btn-neutral" @click="sendWorkerCommand('user')">
            Emit User
          </button>
          <button class="btn btn-neutral" @click="sendWorkerCommand('record')">
            Emit Record
          </button>
          <button class="btn btn-primary" @click="sendWorkerCommand()">
            Emit
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="alert alert-info">
    <Icon name="mdi:loading" size="24" class="animate-spin" />
    <span>Loading...</span>
  </div>

  <dialog ref="superuserDialog" class="modal">
    <form method="dialog" class="modal-box">
      <h3 class="font-bold text-lg">
        Be a superuser
      </h3>
      <p class="py-4">
        Do you want to be a superuser?
      </p>
      <div class="modal-action">
        <button :disabled="loading" class="btn btn-neutral" value="cancel" formmethod="dialog">
          Cancel
        </button>
        <button :disabled="loading" class="btn btn-secondary" value="default" @click="(e) => { e.preventDefault(); beSuperUser() }">
          OK
        </button>
      </div>
    </form>
  </dialog>
</template>
