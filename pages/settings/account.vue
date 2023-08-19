<script setup lang="ts">
const { user } = useAuth()
</script>

<template>
  <div class="flex flex-col gap-5">
    <UserAvatarUploader v-if="user" :user-id="user.uid" />
    <UserEmailsManager v-if="user" :user-id="user.uid" />
  </div>
</template>
