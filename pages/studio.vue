<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
})

const route = useRoute()

const { user } = useAuth()

if (route.name === 'studio') {
  navigateTo({ name: 'studio-levels' }, {
    replace: true,
  })
}
defineCytoidPage({
  title: user.value ? `${user.value.name ?? user.value.uid}'s Studio` : 'Studio',
})
</script>

<template>
  <LayoutStudio>
    <template #StudioMenu>
      <StudioMenu
        :active="route.name as string ?? undefined"
        :context="[
          'Studio',
          { title: $t('studio.menu_analytics'), id: 'studio-analytics', to: { name: 'studio-analytics' } },
          { title: $t('studio.menu_levels'), id: 'studio-levels', to: { name: 'studio-levels' } },
          { title: $t('studio.menu_collections'), id: 'studio-collections', to: { name: 'studio-collections' } },
          ...(['admin', 'moderator'].includes(user?.role ?? '') ? [
            'Admin',
            { title: $t('studio.menu_posts'), id: 'studio-posts', to: { name: 'studio-posts' } },
            { title: $t('studio.menu_users'), id: 'studio-users', to: { name: 'studio-users' } },
            { title: 'SUDO', id: 'studio-sudo', to: { name: 'studio-sudo' } },
          ] : []),
        ]"
      />
    </template>

    <NuxtPage />
  </LayoutStudio>
</template>
