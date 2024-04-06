<script setup lang="ts">
const { logout: _logout } = useWriteableAuth()
const profileDialog = ref(false)

const { user, ready, toLogin, isLogin, isAdmin, isModerator } = useAuth()

const profileDialogDom = ref()
onClickOutside(profileDialogDom, () => {
  profileDialog.value = false
})

async function logout() {
  await _logout()
  reloadNuxtApp({
    path: '/',
    persistState: false,
  })
}
</script>

<template>
  <div class="navbar m-auto max-w-screen-2xl sm:px-12">
    <div class="flex flex-1 gap-0">
      <div class="hidden sm:block">
        <NuxtLink class="btn btn-ghost btn-sm font-medium tracking-wider text-base-content hover:bg-transparent hover:text-primary" :to="{ name: 'index' }">
          {{ $t('general.nav_home') }}
        </NuxtLink>
        <NuxtLink class="btn btn-ghost btn-sm font-medium tracking-wider text-base-content hover:bg-transparent hover:text-primary" :to="{ name: 'levels' }">
          {{ $t('general.nav_levels') }}
        </NuxtLink>
        <NuxtLink class="btn btn-ghost btn-sm font-medium tracking-wider text-base-content hover:bg-transparent hover:text-primary" to="https://cytoid.wiki">
          {{ $t('general.nav_wiki') }}
        </NuxtLink>
      </div>

      <div class="flex flex-1 sm:hidden">
        <div class="flex-none">
          <div class="dropdown">
            <label tabindex="0" class="btn btn-circle btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                class="inline-block size-5 stroke-current"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
            <ul tabindex="0" class="menu-compact menu dropdown-content mt-3 w-52 rounded-box bg-base-100 p-2 shadow">
              <li>
                <NuxtLink :to="{ name: 'index' }">
                  {{ $t('general.nav_home') }}
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="{ name: 'levels' }">
                  {{ $t('general.nav_levels') }}
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="https://cytoid.wiki">
                  {{ $t('general.nav_wiki') }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
        <div class="flex-1" />
      </div>
    </div>

    <!-- User Profile -->
    <ClientOnly>
      <div v-if="!ready">
        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-neutral btn-sm">
            <Icon name="mdi:loading" size="18" class="animate-spin" />
          </label>
          <ul tabindex="0" class="menu dropdown-content w-52 rounded-box bg-base-100 p-2 shadow">
            <li>
              <button @click="logout">
                {{ $t('general.signout_btn') }}
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div v-else-if="isLogin && user" class="flex-none px-2 sm:px-0">
        <div v-if="isAdmin" class="tooltip tooltip-bottom px-2" data-tip="Cytoid Admin">
          <button class="not-clickable btn btn-circle btn-primary btn-sm">
            <Icon name="clarity:administrator-solid" size="18" />
          </button>
        </div>
        <div v-else-if="isModerator" class="tooltip tooltip-bottom px-2" data-tip="Cytoid Moderator">
          <button class="not-clickable btn btn-circle btn-primary btn-sm">
            <Icon name="pajamas:admin" size="18" />
          </button>
        </div>
        <UserAvatar
          :avatar="avatarURL(user?.id)"
          :name="user.name || user.uid"
          :reverse="true"
          class="select-none"
          @click="profileDialog = !profileDialog"
        />
        <Transition>
          <div v-show="profileDialog" class="relative size-0">
            <UserProfileDialog ref="profileDialogDom" :close="() => profileDialog = !profileDialog" />
          </div>
        </Transition>
      </div>
      <div v-else class="flex-none px-2 sm:px-0">
        <button class="btn btn-neutral btn-sm" @click="toLogin()">
          {{ $t('general.login_btn') }}
        </button>
      </div>
    </ClientOnly>
  </div>
</template>
