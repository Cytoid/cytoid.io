import Vue from 'vue'
import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/pro-solid-svg-icons'

config.autoAddCss = false
library.add(fas)
Vue.component('font-awesome-icon', FontAwesomeIcon)
