<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
})

const route = useRoute()

const { user, isModerator } = useAuth()

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
          { title: $t('studio.menu_analytics'), icon: 'ion:analytics-sharp', id: 'studio-analytics', to: { name: 'studio-analytics' } },
          { title: $t('studio.menu_levels'), icon: 'mdi:folder-edit-outline', id: 'studio-levels', to: { name: 'studio-levels' } },
          { title: $t('studio.menu_collections'), icon: 'mdi:database-edit-outline', id: 'studio-collections', to: { name: 'studio-collections' } },
          ...(isModerator ? [
            'Admin',
            { title: $t('studio.menu_posts'), icon: 'mdi:file-document', id: 'studio-posts', to: { name: 'studio-posts' } },
            { title: $t('studio.menu_users'), icon: 'mdi:account', id: 'studio-users', to: { name: 'studio-users' } },
            { title: 'SUDO', icon: 'mdi:account-cog', id: 'studio-sudo', to: { name: 'studio-sudo' } },
          ] : []),
        ]"
      />
    </template>

    <NuxtPage />
  </LayoutStudio>
</template>
