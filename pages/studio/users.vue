<script setup lang="ts">
import type { StudioLookupUserQuery } from '~/gql/graphql'

const route = useRoute()
const router = useRouter()
const { user, ready } = useAuth()

const query = gql(`
  query StudioLookupUser($uid: String, $id: ID) {
    user(id: $id, uid: $uid) {
      id
      uid
      name
      emails {
        address
        verified
      }
      registrationDate
      role
      avatar {
        large
      }
      active
    }
  }
`)
const activeMutation = gql(`
  mutation StudioSetUserActive($id: ID!, $active: Boolean!) {
    setUserActive(id: $id, active: $active)
  }
`)
const grantMutation = gql(`
  mutation StudioGrantUserBadge($id: ID!, $badge: String!) {
    grantUserBadge(id: $id, badge: $badge)
  }
`)
const banMutation = gql(`
  mutation StudioBanUser($id: ID!, $reason: String!) {
    banUser(id: $id, reason: $reason)
  }
`)

const userId = ref(route.hash.slice(1) ?? '')
const data = ref<StudioLookupUserQuery | undefined>(undefined)
const notFound = ref<string | null>()

const badge = ref('')

const loading = ref(false)
const mutationLoading = ref(false)

const pendingBanUser = ref<string | null>(null)
const pendingBanReason = ref('')
function setBanReason(reason: string) {
  pendingBanReason.value = reason
}
const exampleBanReasons = [
  'Cheating',
  'Other',
]

onMounted(() => {
  nextTick(async () => {
    try {
      await until(ready).toBeTruthy({ timeout: 1000, throwOnTimeout: true })
      if (!['admin', 'moderator'].includes(user.value?.role ?? '')) {
        throw new Error('Permission denied')
      }
      else {
        if (userId.value) {
          await findUser(userId.value)
        }
      }
    }
    catch (error) {
      console.error(error)
      router.push({
        name: 'studio',
      })
    }
  })
})

async function findUser(id: string) {
  loading.value = true

  router.push({
    hash: `#${id}`,
  })
  const ans = await useQuery(query, isUUID(id)
    ? { id }
    : { uid: id })
  if (!ans?.user?.id) {
    notFound.value = id
  }
  else {
    data.value = ans
  }

  loading.value = false
}

function banUser() {
  if (!data.value?.user?.id || pendingBanUser.value !== data.value.user.uid) {
    return
  }
  mutationLoading.value = true
  useMutation(banMutation, {
    id: data.value.user.id,
    reason: pendingBanReason.value,
  }).then(() => {
    mutationLoading.value = false
    data.value!.user!.active = false
  })
  pendingBanReason.value = ''
  pendingBanUser.value = null
}
async function grantBadge() {
  if (!data.value?.user?.id) {
    return
  }
  mutationLoading.value = true
  try {
    await useMutation(grantMutation, {
      id: data.value.user.id,
      badge: badge.value,
    })
  }
  catch (error) {
    handleErrorToast(error as Error)
  }
  mutationLoading.value = false
}
async function setActive(active: boolean) {
  if (!data.value?.user?.id) {
    return
  }
  mutationLoading.value = true
  try {
    await useMutation(activeMutation, {
      id: data.value.user.id,
      active,
    })
  }
  catch (error) {
    console.error(error)
  }
  data.value!.user!.active = active
  mutationLoading.value = false
}
</script>

<template>
  <div v-if="user && ['admin', 'moderator'].includes(user.role)" class="w-full flex flex-col gap-5">
    <div class="card overflow-hidden bg-base-100 w-full shadow-xl">
      <div class="card-body gap-4">
        <div class="flex flex-col gap-2">
          <h2 class="card-subtitle">
            User ID or UUID
          </h2>
          <div class="join">
            <input v-model="userId" class="input w-full input-bordered join-item">
            <button class="btn btn-primary join-item" @click="findUser(userId)">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="alert alert-info">
      <Icon name="mdi:loading" size="24" class="animate-spin" />
      <span>loading...</span>
    </div>

    <div v-if="notFound" class="alert alert-error">
      <span>The user ({{ notFound }}) not found.</span>
    </div>

    <div v-if="data?.user" class="card overflow-hidden bg-base-100 w-full shadow-xl">
      <div class="card-body gap-4">
        <div class="flex flex-col gap-2">
          <h2 class="card-subtitle">
            Profile
          </h2>

          <div class="flex w-full m-4">
            <div class="avatar">
              <div class="w-16 h-16 rounded-full">
                <img v-if="data.user.avatar.large" :src="data.user.avatar.large">
              </div>
            </div>
            <div class="flex flex-col justify-center gap-1 flex-1 px-4 w-0">
              <div>
                <NuxtLink :to="{ name: 'profile-id', params: { id: data.user.uid } }" class="card-title break-all">
                  {{ data.user.name ?? data.user.uid }}
                </NuxtLink>
              </div>

              <p class="flex gap-2">
                <span class="select-none font-bold">
                  ID:
                </span>
                <span>
                  {{ data.user.id }}
                </span>
              </p>

              <p class="flex gap-2">
                <span class="select-none font-bold">
                  UID:
                </span>
                <span>
                  {{ data.user.uid }}
                </span>
              </p>

              <p v-if="data.user.name" class="flex gap-2">
                <span class="select-none font-bold">
                  Name:
                </span>
                <span>
                  {{ data.user.name }}
                </span>
              </p>

              <p class="flex gap-2">
                <span class="select-none font-bold">
                  Emails:
                </span>
              </p>
              <ul class="list-inside list-disc">
                <li v-for="email in data.user.emails" :key="email.address">
                  {{ email.address }}
                  <div v-if="!email.verified" class="badge badge-warning badge-outline badge-sm">
                    Unverified
                  </div>
                  <div v-else class="badge badge-success badge-outline badge-sm">
                    <Icon name="mdi:check-bold" size="10" class="text-success" />
                  </div>
                </li>
              </ul>

              <p class="flex gap-2">
                <span class="select-none font-bold">
                  Registration Date:
                </span>
                <span>
                  {{
                    dateFormatCalendar(data.user.registrationDate)
                  }}, {{
                    dateFromNow(data.user.registrationDate)
                  }}
                </span>
              </p>

              <p class="flex gap-2">
                <span class="select-none font-bold">
                  Role:
                </span>
                <span>
                  {{ data.user.role }}
                </span>
              </p>

              <p class="flex gap-2">
                <span class="select-none font-bold">
                  Can Login:
                </span>
                <span>
                  {{ data.user.active }}
                </span>
              </p>
            </div>
          </div>

          <h2 class="card-subtitle">
            Records
          </h2>
          <div class="flex gap-2">
            <NuxtLink
              class="btn btn-neutral"
              :to="{ name: 'records', query: { owner: data.user.uid } }"
            >
              View All Records
            </NuxtLink>
          </div>

          <h2 class="card-subtitle">
            Disable User
          </h2>
          <div class="flex gap-2">
            <button
              v-if="data.user.active"
              :disabled="mutationLoading"
              class="btn btn-warning"
              @click="setActive(false)"
            >
              Disable
            </button>
            <button
              v-else
              :disabled="mutationLoading"
              class="btn btn-success"
              @click="setActive(true)"
            >
              Enable
            </button>
          </div>

          <h2 class="card-subtitle">
            Grant Badge
          </h2>
          <div class="join">
            <input v-model="badge" class="input w-full input-bordered join-item">
            <button
              :disabled="mutationLoading || !badge"
              class="btn btn-primary join-item"
              @click="grantBadge()"
            >
              Grant
            </button>
          </div>

          <h2 class="card-subtitle">
            Cheater Mode
          </h2>
          <div class="flex gap-2">
            <button
              :disabled="mutationLoading"
              class="btn btn-error"
              @click="pendingBanUser = data.user.uid ?? ''"
            >
              Ban User
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="alert alert-info">
    <Icon name="mdi:loading" size="24" class="animate-spin" />
    <span>Loading...</span>
  </div>

  <BaseConfirmDialog
    v-if="data?.user"
    :open="!!pendingBanUser"
    :confirm="(pendingBanReason ? pendingBanUser : null) ?? ''"
    :on-confirm="() => { banUser() }"
    :on-cancel="() => { pendingBanUser = null; pendingBanReason = '' }"

    type="error"
  >
    <template #title>
      Nuke {{ data.user.name || data.user.uid }}'s account?
    </template>

    <template #default="{ quickConfirm }">
      <div class="w-full flex flex-col gap-4">
        <p>
          This is going to delete all his playing records, make the user inactive, and give the user a cheater badge.
        </p>
        <div class="flex flex-col gap-1">
          <strong>Reason:</strong>
          <div class="flex gap-1 my-1">
            <button v-for="r in exampleBanReasons" :key="r" class="badge badge-accent" @click="setBanReason(r)">
              {{ r }}
            </button>
          </div>
          <div class="join w-full">
            <label for="pending-ban-reason" class="join-item btn btn-neutral">
              <Icon name="mdi:account-question-outline" size="18" />
            </label>
            <input
              id="pending-ban-reason"
              v-model="pendingBanReason"
              placeholder="e.g. Cheating"
              class="join-item input input-bordered flex-1 w-full"
            >
          </div>
        </div>
        <p>
          To continue, please input the uid of the user <button class="font-bold text-error" @dblclick="quickConfirm">
            {{ data.user.uid }}
          </button> to proceed. (or double tap the red uid.)
        </p>
      </div>
    </template>

    <template #buttonContext>
      Ban
    </template>
  </BaseConfirmDialog>
</template>
