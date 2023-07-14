<template>
  <div class="flex gap-2">
    <button class="btn btn-neutral" @click="hw()">
      {{ $t('general.nav_home') }}: Hello World {{ count }}
    </button>
    <button class="btn btn-neutral" @click="successAlert(`Success ${ count }`)">
      {{ $t('general.nav_home') }}: Success {{ count }}
    </button>
    <button class="btn btn-neutral" @click="warningAlert(`Warning ${ count }`)">
      {{ $t('general.nav_home') }}: Warning {{ count }}
    </button>
    <button class="btn btn-neutral" @click="errorAlert(`Error ${ count }`)">
      {{ $t('general.nav_home') }}: Error {{ count }}
    </button>
  </div>
</template>

<script setup lang="ts">
const count = ref(0)
const hw = () => {
  infoAlert(`Hello World ${count.value++}!`)
}

resetCytoidPage()
</script>