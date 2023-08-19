<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
})

const route = useRoute()

if (route.name === 'settings') {
  navigateTo({ name: 'settings-account' }, {
    replace: true,
  })
}
defineCytoidPage({
  title: 'Setting',
})
</script>

<template>
  <LayoutStudio>
    <template #StudioMenu>
      <StudioMenu
        :active="route.name as string ?? undefined"
        :context="[
          $t('general.settings'),
          { title: $t('settings.account_menu'), icon: 'mdi:account', id: 'settings-account', to: { name: 'settings-account' } },
          { title: $t('settings.security_menu'), icon: 'mdi:security', id: 'settings-security', to: { name: 'settings-security' } },
          { title: $t('settings.profile_menu'), icon: 'mdi:account-box-outline', id: 'settings-profile', to: { name: 'settings-profile' } },
          { title: $t('settings.donation_menu'), icon: 'mdi:crown', id: 'settings-donation', to: { name: 'settings-donation' } },
        ]"
      />
    </template>

    <NuxtPage />
  </LayoutStudio>
</template>
