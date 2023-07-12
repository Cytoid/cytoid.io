<template>
  <div>
    <button class="btn btn-neutral" @click="hw()">
      {{ $t('general.nav_home') }}: Hello World {{ count }}
    </button>
  </div>
</template>

<script setup lang="ts">
const count = ref(0)
const hw = () => {
  successAlert(`Hello World ${count.value++}!`)
}

resetCytoidPage()
</script>