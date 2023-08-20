<script setup lang="ts">
const { user } = useAuth()
</script>

<template>
  <div v-if="user" class="flex flex-col gap-5">
    <UserAvatarUploader :user-id="user.uid" />
    <UserEmailsManager :user-id="user.uid" />
  </div>
  <div v-else class="alert alert-info">
    <Icon name="mdi:loading" size="24" class="animate-spin" />
    <span>Loading...</span>
  </div>
</template>
