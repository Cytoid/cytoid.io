import Vue from 'vue'
import Buefy, { DialogProgrammatic as Dialog } from 'buefy'

export default function ({ app, store }) {
  Vue.use(Buefy, {
    defaultIconPack: 'fas',
    defaultIconComponent: 'font-awesome-icon'
  })
  if (process.client && store.state.country === 'CN') {
    const t = app.i18n.t.bind(app.i18n)
    Dialog.confirm({
      type: 'is-warning',
      title: t('region_unavailable'),
      message: t('region_unavailable_content'),
      hasIcon: true,
      icon: 'chimney',
      size: 'is-small',
      confirmText: 'Cytoid.cn',
      cancelText: 'Continue Browsing',
      canCancel: true,
      onConfirm: () => {
        window.location.replace('https://cytoid.cn')
      }
    })
  }
}
