<script setup lang="ts">
const count = ref(0)
function hw() {
  infoAlert(`Hello World ${count.value++}!`)
}

const mdText = ref('# Hello World')

resetCytoidPage()
</script>

<template>
  <div class="flex gap-2">
    <button class="btn btn-neutral" @click="hw()">
      {{ $t('general.nav_home') }}: Hello World {{ count }}
    </button>
    <button class="btn btn-neutral" @click="successAlert(`Success ${count}`)">
      {{ $t('general.nav_home') }}: Success {{ count }}
    </button>
    <button class="btn btn-neutral" @click="warningAlert(`Warning ${count}`)">
      {{ $t('general.nav_home') }}: Warning {{ count }}
    </button>
    <button class="btn btn-neutral" @click="errorAlert(`Error ${count}`)">
      {{ $t('general.nav_home') }}: Error {{ count }}
    </button>
  </div>
  <div class="prose" v-html="useMarked(mdText)" />
  <Editor v-model="mdText" />
</template>
