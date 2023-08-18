<script setup lang="ts">
const { availableLocales, locale, setLocale } = useLocales()
const langSelect = ref(null)
const keepShowLangSelectBox = ref(false)
onClickOutside(langSelect, () => keepShowLangSelectBox.value = false)
</script>

<template>
  <footer class="footer footer-center my-10 text-base-content rounded">
    <div>
      <div class="footer-item-box">
        <NuxtLink class="clickable select-none" to="/pages/dmca">
          {{ $t('general.dmca') }}
        </NuxtLink>
        <NuxtLink class="clickable select-none" to="/pages/terms">
          {{ $t('general.tos') }}
        </NuxtLink>
        <NuxtLink class="clickable select-none" to="https://github.com/Cytoid/">
          {{ $t('general.status') }}
        </NuxtLink>
        <NuxtLink class="clickable select-none" to="https://github.com/Cytoid/">
          GitHub
        </NuxtLink>
        <NuxtLink class="clickable select-none" to="/credits">
          {{ $t('general.credits') }}
        </NuxtLink>
        <div
          ref="langSelect" class="dropdown dropdown-top dropdown-hover dropdown-end" :class="{
            'dropdown-open': keepShowLangSelectBox,
          }"
        >
          <a class="clickable select-none" @click="keepShowLangSelectBox = !keepShowLangSelectBox">
            <Icon name="mdi:translate" size="16" /> {{ $t('general.language') }}
          </a>
          <ul tabindex="0" class="dropdown-content menu menu-compact p-2 shadow bg-base-100 shadow-2xl rounded-box w-44">
            <li v-for="code in availableLocales" :key="code">
              <a :key="code" :class="{ active: code === locale }" @click="setLocale(code)">
                <span v-t="{ path: 'general.self', locale: code }" class="mx-auto" />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div>
        <p>
          Cytoid built by <a href="https://cytoid.io/profile/tigerhix" class="link link-hover">TigerHix</a> and <a href="https://cytoid.io/profile/neo" class="link link-hover">Neo</a>. All rights
          reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-item-box > :not(:last-child)::after {
  content: '|';
  @apply mx-1 sm:mx-3
}
</style>
