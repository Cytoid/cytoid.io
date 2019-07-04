import Vue from 'vue'
import VueSimplemde from 'vue-easymde'
import Chart from 'chart.js'

Vue.use(VueSimplemde)

Chart.defaults.global.responsive = true
Chart.defaults.global.maintainAspectRatio = false
Chart.defaults.global.defaultFontColor = 'rgba(255, 255, 255, 0.3)'
Chart.defaults.global.defaultFontFamily = 'Nunito'
Chart.defaults.global.defaultFontSize = 12
