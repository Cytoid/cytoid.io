<script setup lang="ts">
const { alerts } = useAlert()
</script>

<template>
  <div class="fixed top-0 z-20 h-0 w-screen overflow-visible pointer-events-none">
    <div class="flex flex-col-reverse">
      <!-- Alert -->
      <AlertItem v-for="msg, i in alerts" :key="i" :message="msg.message" :type="msg.type" :icon="msg.icon" :details="msg.details" />
    </div>
  </div>
</template>
