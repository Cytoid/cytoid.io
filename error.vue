<script setup lang="ts">
import Layout from '~/app.vue'

const { $sentryCaptureException } = useNuxtApp()

const config = useRuntimeConfig()

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

function showFeedbackDialog() {
  $sentryCaptureException(error.value)
}

defineCytoidPage({
  title: 'Error',
})
</script>

<template>
  <Layout>
    <div class="hero h-full my-auto p-0">
      <div class="hero-content p-0 flex-col sm:flex-row-reverse">
        <img src="/images/sayakacry.png" class="max-w-screen sm:max-w-sm w-64" @click="showDetail += 1">
        <div class="flex-1" />
        <div>
          <h1 class="text-5xl font-bold">
            {{ $t('general.error_page_title') }}
          </h1>
          <p class="py-6">
            {{ $t('general.error_page_subtitle', { error: errorMsg ?? $t('general.error_page_default_message') }) }}
          </p>
          <div class="flex gap-2">
            <NuxtLink class="btn btn-primary" to="/">
              {{ $t('general.nav_home') }}
            </NuxtLink>
            <button class="flex-1 btn btn-secondary" @click="showFeedbackDialog">
              <!-- {{ $t('general.error_page_report') }} -->
              Feedback
            </button>
          </div>
        </div>
      </div>
    </div>

    <dialog ref="detailDom" class="modal">
      <form method="dialog" class="modal-box">
        <h3 class="font-bold text-lg">
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
