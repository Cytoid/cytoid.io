<script setup lang="ts">
defineProps<{
  close: () => void
}>()
const { logout: _logout } = useWriteableAuth()
const { user } = useAuth()

const query = gql(`
  query FetchNavCard($id: ID!) {
    profile(id: $id) {
      id
      exp {
        totalExp
        currentLevelExp
        nextLevelExp
        currentLevel
      }
      rating
      header {
        thumbnail
      }
      user {
        id
        avatar {
          original
        }
      }
    }
  }
`)
const { data } = await useAsyncQuery(query, {
  id: user.value?.id ?? '',
})
const profile = computed(() => data.value?.profile)

async function logout() {
  await _logout()
  reloadNuxtApp({
    path: '/',
    persistState: false,
  })
}
</script>

<template>
  <div v-if="profile" class="fixed right-4 top-12 p-2 sm:absolute sm:-right-4 sm:top-8">
    <div class="card w-72 bg-base-100 shadow-xl">
      <div class="max-h-30 card image-full aspect-video w-full bg-base-100 shadow-xl">
        <figure><img v-if="profile.header?.thumbnail" :src="profile.header.thumbnail"></figure>
        <div class="card-body select-none px-6 py-2">
          <div class="mt-4 flex w-full">
            <div class="avatar">
              <NuxtLink class="mt-4 size-16" :to="{ name: 'profile-id', params: { id: user?.uid || user?.id } }" @click="close">
                <img v-if="profile.user?.avatar.original" :src="profile.user.avatar.original" class="rounded-full">
              </NuxtLink>
            </div>
            <div class="flex w-0 flex-1 flex-col justify-center gap-1 px-4 pt-4">
              <div>
                <NuxtLink class="card-title break-all" :to="{ name: 'profile-id', params: { id: user?.uid || user?.id } }" @click="close">
                  {{ user?.name || user?.uid }}
                </NuxtLink>
              </div>
              <div v-if="profile.rating" class="flex gap-2">
                <NuxtLink :to="{ name: 'studio-analytics' }" @click="close">
                  <UserRatingBadge :rating="profile.rating" />
                </NuxtLink>
              </div>
            </div>
          </div>
          <div class="flex-1" />
          <div class="flex h-12 items-center gap-2">
            <div
              class="tooltip flex flex-1 items-center"
              :data-tip="`${profile.exp.totalExp - profile.exp.currentLevelExp} / ${profile.exp.nextLevelExp - profile.exp.currentLevelExp}`"
            >
              <progress
                class="progress progress-primary h-3 bg-base-100/60"
                :value="profile.exp.totalExp - profile.exp.currentLevelExp"
                :max="profile.exp.nextLevelExp - profile.exp.currentLevelExp"
              />
            </div>
            <div class="badge badge-primary">
              Lv. {{ profile.exp.currentLevel }}
            </div>
          </div>
        </div>
      </div>

      <div class="card-body p-4">
        <ul class="menu w-full bg-base-100 p-0">
          <li class="hover-bordered">
            <NuxtLink :to="{ name: 'profile-id', params: { id: user?.uid || user?.id } }" @click="close">
              <Icon name="mdi:account" size="24" /> {{ $t('general.profile') }}
            </NuxtLink>
          </li>
          <li class="hover-bordered">
            <NuxtLink :to="{ name: 'studio' }" @click="close">
              <Icon name="carbon:media-library-filled" size="24" /> {{ $t('general.studio') }}
            </NuxtLink>
          </li>
          <li class="hover-bordered">
            <NuxtLink :to="{ name: 'library' }" @click="close">
              <Icon name="mdi:puzzle" size="24" /> {{ $t('general.library') }}
            </NuxtLink>
          </li>
          <li class="hover-bordered">
            <NuxtLink :to="{ name: 'settings' }" @click="close">
              <Icon name="ic:baseline-settings" size="24" /> {{ $t('general.settings') }}
            </NuxtLink>
          </li>
        </ul>
        <div class="card-actions justify-end pt-2">
          <button class="btn btn-primary btn-block" @click="logout">
            {{ $t('general.signout_btn') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
