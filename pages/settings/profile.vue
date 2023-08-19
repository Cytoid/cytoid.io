<script setup lang="ts">
const { user } = useAuth()
</script>

<template>
  <div v-if="user" class="flex flex-col gap-5">
    <UserHeaderUploader :user-id="user.id" />
    <ProfileEditor />
  </div>
  <div v-else class="alert alert-info">
    <Icon name="mdi:loading" size="24" class="animate-spin" />
    <span>Loading...</span>
  </div>
</template>
