<script setup lang="ts">
import type { RouteLocationRaw } from '#vue-router'

const { locale, locales, setLocale, t } = useLocales()
const langSelect = ref(null)
const keepShowLangSelectBox = ref(false)
onClickOutside(langSelect, () => keepShowLangSelectBox.value = false)

const links: {
  name: () => string
  to: RouteLocationRaw
}[] = [
  {
    name: () => t('general.dmca'),
    to: { name: 'pages-id', params: { id: 'dmca' } },
  },
  {
    name: () => t('general.tos'),
    to: { name: 'pages-id', params: { id: 'terms' } },
  },
  {
    name: () => t('general.status'),
    to: 'https://github.com/Cytoid/',
  },
  {
    name: () => 'GitHub',
    to: 'https://github.com/Cytoid/',
  },
  {
    name: () => t('general.credits'),
    to: { name: 'credits' },
  },
]
</script>

<template>
  <footer class="footer footer-center my-10 text-base-content rounded">
    <div>
      <div class="footer-item-box">
        <span
          v-for="link in links" :key="link.name"
        >
          <NuxtLink
            class="clickable select-none py-2"
            :to="link.to"
          >
            {{ link.name() }}
          </NuxtLink>
        </span>
        <div
          ref="langSelect" class="dropdown dropdown-top dropdown-hover dropdown-end" :class="{
            'dropdown-open': keepShowLangSelectBox,
          }"
        >
          <button class="clickable select-none py-2" @click="keepShowLangSelectBox = !keepShowLangSelectBox">
            <Icon name="mdi:translate" size="16" /> {{ $t('general.language') }}
          </button>
          <ul tabindex="0" class="dropdown-content menu menu-compact p-2 shadow bg-base-100 shadow-2xl rounded-box w-44">
            <li v-for="available in locales" :key="available.code">
              <button :class="{ active: locale === available.code }" @click="setLocale(available.code)">
                <span class="mx-auto" v-text="available.name" />
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div>
        <p>
          Cytoid built by <a href="https://cytoid.io/profile/tigerhix" class="link link-hover">TigerHix</a>, <a href="https://cytoid.io/profile/neo" class="link link-hover">Neo</a> and <a href="https://cytoid.io/profile/teages_0v0" class="link link-hover">Teages</a>. All rights
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
