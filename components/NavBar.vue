<script setup lang="ts">
const { logout: _logout, ready, toLogin, isLogin } = useAuth()
const router = useRouter()
const profileDialog = ref(false)

const { user } = useAuth()

const profileDialogDom = ref()
onClickOutside(profileDialogDom, () => {
  profileDialog.value = false
})

async function logout() {
  await _logout()
  router.push({ path: '/' })
}
</script>

<template>
  <div class="navbar max-w-screen-2xl m-auto sm:px-12">
    <div class="flex flex-1 gap-0">
      <div class="hidden sm:block">
        <NuxtLink class="btn btn-sm btn-ghost text-base-content font-medium tracking-wider hover:bg-transparent hover:text-primary" to="/">
          {{ $t('general.nav_home') }}
        </NuxtLink>
        <NuxtLink class="btn btn-sm btn-ghost text-base-content font-medium tracking-wider hover:bg-transparent hover:text-primary" to="/levels">
          {{ $t('general.nav_levels') }}
        </NuxtLink>
        <NuxtLink class="btn btn-sm btn-ghost text-base-content font-medium tracking-wider hover:bg-transparent hover:text-primary" to="https://cytoid.wiki">
          {{ $t('general.nav_wiki') }}
        </NuxtLink>
      </div>

      <div class="flex flex-1 sm:hidden">
        <div class="flex-none">
          <div class="dropdown">
            <label tabindex="0" class="btn btn-ghost btn-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                class="inline-block w-5 h-5 stroke-current"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
            <ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <NuxtLink to="/">
                  {{ $t('general.nav_home') }}
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/levels">
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
          <label tabindex="0" class="btn btn-sm btn-neutral">
            <Icon name="mdi:loading" size="18" class="animate-spin" />
          </label>
          <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
            <li><a @click="logout">{{ $t('general.signout_btn') }}</a></li>
          </ul>
        </div>
      </div>
      <div v-else-if="isLogin && user" class="flex-none px-2 sm:px-0">
        <div v-if="user.role === 'admin'" class="px-2 tooltip tooltip-bottom" data-tip="Cytoid Admin">
          <button class="btn btn-circle btn-sm not-clickable btn-primary">
            <Icon name="clarity:administrator-solid" size="18" />
          </button>
        </div>
        <div v-else-if="user.role === 'moderator'" class="px-2 tooltip tooltip-bottom" data-tip="Cytoid Moderator">
          <button class="btn btn-circle btn-sm not-clickable btn-primary">
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
          <div v-show="profileDialog" class="w-0 h-0 relative">
            <UserProfileDialog ref="profileDialogDom" :close="() => profileDialog = !profileDialog" />
          </div>
        </Transition>
      </div>
      <div v-else class="flex-none px-2 sm:px-0">
        <button class="btn btn-sm btn-neutral" @click="toLogin()">
          {{ $t('general.login_btn') }}
        </button>
      </div>
    </ClientOnly>
  </div>
</template>
