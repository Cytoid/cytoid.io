// @ts-expect-error types lost https://github.com/apexcharts/vue3-apexcharts/issues/95
import VueApexCharts from 'vue3-apexcharts'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueApexCharts)
})
