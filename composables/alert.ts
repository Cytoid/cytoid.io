import type { Ref } from 'vue'

export function useAlert() {
  const alerts: Ref<alertData[]> = useState(() => [])

  const addAlert = (alert: alertData) => {
    alerts.value.push({
      ...alert,
      loading: useState(() => null),
    })
  }

  const addLoadingAlert = (alert: alertData) => {
    const loading = useState(() => true)
    alerts.value.push({
      ...alert,
      loading,
    })
    return () => {
      loading.value = false
    }
  }

  return { alerts, addAlert, addLoadingAlert }
}

export function log(msg: any, opts?: alertOptions) {
  if (process.client) {
    const { addAlert } = useAlert()
    addAlert({
      message: typeof msg === 'string' ? msg : JSON.stringify(msg),
      type: 'none',
      ...opts,
    })
  }
  else {
    // eslint-disable-next-line no-console
    console.log(msg)
  }
}

export function infoAlert(msg: any, opts?: alertOptions) {
  log(msg, {
    type: 'info',
    ...opts,
  })
}

export function successAlert(msg: any, opts?: alertOptions) {
  log(msg, {
    type: 'success',
    icon: 'material-symbols:check-small-rounded',
    ...opts,
  })
}

export function warningAlert(msg: any, opts?: alertOptions) {
  log(msg, {
    type: 'warning',
    ...opts,
  })
}

export function errorAlert(msg: any, opts?: alertOptions) {
  log(msg, {
    type: 'error',
    ...opts,
  })
}

export function handleErrorToast(error: Error) {
  errorAlert(getMessage(error))
}

function getMessage(err: any) {
  if (err.response?.status === 404)
    return 'Resource Not Found'

  return err.response?.data.message
    || err.response?.data.name
    || err.response?.data
    || err.message || 'Unknown Error'
}

type alertType = 'info' | 'success' | 'warning' | 'error' | 'none'

interface alertOptions {
  type?: alertType
  icon?: string
  details?: string
  loading?: Ref<boolean | null>
}

interface alertData {
  message: string
  type?: alertType
  icon?: string
  details?: string
  loading?: Ref<boolean | null>
}
