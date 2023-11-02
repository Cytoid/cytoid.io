export function log(data: ToastOptions) {
  if (process.client) {
    const { addToast } = useToast()
    addToast(data)
  }
  else {
    // eslint-disable-next-line no-console
    console.log(data.message)
  }
}

type LogOptions = Omit<ToastOptions, 'message'>

export function infoAlert(msg: any, opts?: LogOptions) {
  log({
    message: msg,
    type: 'info',
    icon: 'material-symbols:check-small-rounded',
    ...opts,
  })
}

export function successAlert(msg: any, opts?: LogOptions) {
  log({
    message: msg,
    type: 'success',
    ...opts,
  })
}

export function warningAlert(msg: any, opts?: LogOptions) {
  log({
    message: msg,
    type: 'warning',
    ...opts,
  })
}

export function errorAlert(msg: any, opts?: LogOptions) {
  log({
    message: msg,
    type: 'error',
    ...opts,
  })
}

export function handleErrorToast(error: Error) {
  errorAlert(getMessage(error))
}

function getMessage(err: any) {
  if (err?.response?.status === 404) {
    return 'Resource Not Found'
  }

  return err?.response?.data?.message
    || err?.response?.data?.name
    || err?.response?.data
    || err?.message || 'Unknown Error'
}
