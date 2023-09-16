<script setup lang="ts">
defineProps<{
  close: () => void
}>()
const { user, logout: _logout } = useAuth()

const query = graphql(/* GraphQL */`
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
const { data } = await useAsyncData(() => useQuery(query, {
  id: user.value?.id ?? '',
}))
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
  <div v-if="profile" class="fixed right-4 top-12 p-2 sm:absolute sm:top-8 sm:-right-4">
    <div class="card bg-base-100 shadow-xl w-72">
      <div class="card w-full bg-base-100 max-h-30 shadow-xl image-full aspect-video">
        <figure><img v-if="profile.header?.thumbnail" :src="profile.header.thumbnail"></figure>
        <div class="card-body px-6 py-2 select-none">
          <div class="flex w-full mt-4">
            <div class="avatar">
              <div class="w-16 h-16 mt-4 rounded-full">
                <img v-if="profile.user?.avatar.original" :src="profile.user.avatar.original">
              </div>
            </div>
            <div class="flex flex-col justify-center gap-1 flex-1 pt-4 px-4 w-0">
              <div>
                <p class="card-title break-all">
                  {{ user?.name || user?.uid }}
                </p>
              </div>
              <div v-if="profile.rating" class="flex gap-2">
                <UserRatingBadge :rating="profile.rating" />
              </div>
            </div>
          </div>
          <div class="flex-1" />
          <div class="flex h-12 items-center gap-2">
            <div
              class="tooltip flex-1 flex items-center"
              :data-tip="`${profile.exp.totalExp - profile.exp.currentLevelExp} / ${profile.exp.nextLevelExp - profile.exp.currentLevelExp}`"
            >
              <progress
                class="progress progress-primary bg-base-100/60 h-3"
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
        <ul class="menu bg-base-100 w-full p-0">
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
