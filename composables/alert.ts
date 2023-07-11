import { Ref } from "vue"

export const useAlert = () => {
  const alerts:Ref<alertData[]> = useState(() => [])

  const addAlert = (alert:alertData) => {
    alerts.value.push({
      ...alert,
      loading: useState(() => null)
    })
  }

  const addLoadingAlert = (alert:alertData) => {
    const loading = useState(() => true)
    alerts.value.push({
      ...alert,
      loading: loading
    })
    return () => {
      loading.value = false
    }
  }

  return { alerts, addAlert, addLoadingAlert }
}

export const log = (msg:any, opts?:alertOptions) => {
  if (process.client) {
    const { addAlert } = useAlert()
    addAlert({
      message: typeof msg === 'string' ? msg : JSON.stringify(msg),
      type: 'none',
      ...opts
    })
  } else {
    console.log(msg)
  }
}

export const infoAlert = (msg:any, opts?:alertOptions) => {
  log(msg, {
    type: 'info',
    ...opts
  })
}

export const successAlert = (msg:any, opts?:alertOptions) => {
  log(msg, {
    type: 'success',
    icon: 'material-symbols:check-small-rounded',
    ...opts
  })
}

export const warningAlert = (msg:any, opts?:alertOptions) => {
  log(msg, {
    type: 'warning',
    ...opts
  })
}

export const errorAlert = (msg:any, opts?:alertOptions) => {
  log(msg, {
    type: 'error',
    ...opts
  })
}

export const handleErrorToast = (error:Error) => {
  errorAlert(getMessage(error))
}

function getMessage (err:any) {
  if (err.response?.status === 404) {
    return 'Resource Not Found'
  }
  return err.response?.data.message ||
    err.response?.data.name ||
    err.response?.data ||
    err.message || 'Unknown Error'
}

type alertType = 'info' | 'success' | 'warning' | 'error' | 'none'

interface alertOptions {
  type?: alertType,
  icon?: string,
  details?: string,
  loading?: Ref<boolean | null>
}

interface alertData {
  message: string,
  type?: alertType,
  icon?: string,
  details?: string,
  loading?: Ref<boolean | null>
}
