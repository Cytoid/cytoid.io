import Vue from 'vue'
import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { far } from '@fortawesome/pro-regular-svg-icons'
import { fas } from '@fortawesome/pro-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

export default function () {
  config.autoAddCss = false
  Vue.component('font-awesome-icon', FontAwesomeIcon)
  library.add(far)
  library.add(fas)
  library.add(fab)
}
