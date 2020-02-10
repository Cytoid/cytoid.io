import Vue from 'vue'
import Buefy from 'buefy'

export default function () {
  Vue.use(Buefy, {
    defaultIconPack: 'fas',
    defaultIconComponent: 'font-awesome-icon'
  })
}
