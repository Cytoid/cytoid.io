<script setup lang="ts">
import type { RouteLocationRaw } from '#vue-router'

const { locale, locales, t } = useLocales()
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
  <footer class="footer footer-center my-10 rounded text-base-content">
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
          ref="langSelect" class="dropdown dropdown-end dropdown-top dropdown-hover" :class="{
            'dropdown-open': keepShowLangSelectBox,
          }"
        >
          <button class="clickable select-none py-2" @click="keepShowLangSelectBox = !keepShowLangSelectBox">
            <Icon name="mdi:translate" size="16" /> {{ $t('general.language') }}
          </button>
          <ul tabindex="0" class="menu-compact menu dropdown-content w-44 rounded-box bg-base-100 p-2 shadow-2xl">
            <li v-for="available in locales" :key="available.code">
              <button :class="{ active: locale === available.code }" @click="locale = available.code">
                <span class="mx-auto" v-text="available.name" />
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div>
        <p>
          Cytoid built by <a href="https://cytoid.io/profile/tigerhix" class="link-hover link">TigerHix</a>, <a href="https://cytoid.io/profile/neo" class="link-hover link">Neo</a> and <a href="https://cytoid.io/profile/teages_0v0" class="link-hover link">Teages</a>. All rights
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
