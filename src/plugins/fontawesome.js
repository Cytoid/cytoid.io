import Vue from 'vue'
import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/pro-solid-svg-icons'

export default function () {
  config.autoAddCss = false
  Vue.component('font-awesome-icon', FontAwesomeIcon)
  library.add(fas)
}
