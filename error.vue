<script setup lang="ts">
import Layout from '~/app.vue'

const error = useError()

const detailDom = ref<HTMLDialogElement | null>(null)

const errorMsg = computed<string | undefined>(() => error.value?.message)
errorAlert(errorMsg.value)

const showDetail = ref(0)
watch(showDetail, (val) => {
  if (val > 9) {
    detailDom.value?.showModal()
  }
})

defineCytoidPage({
  title: 'Error',
})
</script>

<template>
  <Layout>
    <div class="hero my-auto h-full p-0">
      <div class="hero-content flex-col p-0 sm:flex-row-reverse">
        <img src="/images/sayakacry.webp" class="max-w-screen w-64 sm:max-w-sm" @click="showDetail += 1">
        <div class="flex-1" />
        <div>
          <h1 class="text-5xl font-bold">
            {{ $t('general.error_page_title') }}
          </h1>
          <p class="py-6">
            {{ $t('general.error_page_subtitle', { error: errorMsg ?? $t('general.error_page_default_message') }) }}
          </p>
          <NuxtLink class="btn btn-primary" :to="{ name: 'index' }">
            {{ $t('general.nav_home') }}
          </NuxtLink>
        </div>
      </div>
    </div>

    <dialog ref="detailDom" class="modal">
      <form method="dialog" class="modal-box">
        <h3 class="text-lg font-bold">
          Error Details
        </h3>
        <p class="py-4">
          {{ error }}
        </p>
        <div class="modal-action">
          <button class="btn">
            Close
          </button>
        </div>
      </form>
    </dialog>
  </Layout>
</template>
