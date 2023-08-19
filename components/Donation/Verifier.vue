<script setup lang="ts">
</script>

<template>
  <div
    class="card w-full bg-base-100 shadow-xl overflow-hidden"
  >
    <div
      class="card-body card bg-secondary/25"
    >
      <div class="flex flex-col sm:flex-row">
        <div class="flex-1 flex flex-col justify-between">
          <h2 class="card-subtitle mb-2">
            <img src="/images/patreon.png" class="h-8">
          </h2>
          <p>
            {{ $t('settings.patreon_link_prompt') }}
          </p>
          <NuxtLink to="https://cytoid.io/settings/donation" class="btn btn-secondary mt-4">
            {{ $t('general.link_btn') }} (Cytoid.io)
          </NuxtLink>
        </div>
        <div class="divider sm:divider-horizontal">
          OR
        </div>
        <div class="flex-1 flex flex-col justify-end">
          <p>
            {{ $t('homepage.connect_patreon_content') }}
          </p>
          <NuxtLink to="https://www.patreon.com/tigerhix" class="btn btn-secondary mt-4">
            Become a patron!
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
