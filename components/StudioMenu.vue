<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  active?: string
  context?: Array<string | MenuLink>
  back?: RouteLocationRaw
}>()
interface MenuLink {
  title: string
  id: string
  to?: RouteLocationRaw
  icon?: string
  disabled?: boolean
}
</script>

<template>
  <ul class="menu w-full gap-2 rounded-box bg-base-100 p-6 pt-4">
    <li v-if="back">
      <NuxtLink class="btn btn-neutral btn-block my-2 content-center" :to="back">
        <Icon name="material-symbols:arrow-back" size="20" />
      </NuxtLink>
    </li>
    <template v-if="context">
      <template v-for="item, index in context" :key="index">
        <li v-if="(typeof item === 'string')" class="menu-title">
          {{ item }}
        </li>
        <li v-else>
          <NuxtLink
            :to="item.disabled ? undefined : item.to" :class="{
              'active': active === item.id,
              'opacity-50': item.disabled,
            }"
          >
            <Icon v-if="item.icon" :name="item.icon" size="20" />
            {{ item.title || item }}
          </NuxtLink>
        </li>
      </template>
    </template>
  </ul>
</template>
