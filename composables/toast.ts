import { randomUUID } from 'uncrypto'

export function useToast() {
  const toasts: Ref<Array<Toast>> = useState(() => [])

  function add(data: ToastOptions) {
    const id = randomUUID()
    const type: ToastType = data.type ?? 'none'
    const defaultIcon = {
      none: 'material-symbols:error-circle-rounded-outline',
      info: 'material-symbols:error-circle-rounded-outline',
      success: 'material-symbols:check-small-rounded',
      warning: 'material-symbols:error-circle-rounded-outline',
      error: 'material-symbols:error-circle-rounded-outline',
    }[type]
    const toast: Toast = {
      id,
      state: 'active',
      type,
      icon: defaultIcon,
      closeIcon: 'mdi:close',
      timeout: 6000,
      ...data,
    }
    toasts.value.push(toast)
    return id
  }

  // close toast, will hit onTimeout
  function close(id: string) {
    const toast = toasts.value.find(t => t.id === id)
    if (toast) {
      toast.state = 'hidden'
    }
  }

  return { toasts, addToast: add, closeToast: close }
}

export type Toast = {
  id: string
  button?: ToastButton
  state: 'active' | 'hidden'
} & Omit<Required<ToastData>, 'description'> & { description?: string } & ToastListener

export type ToastOptions = ToastData & ToastListener

interface ToastData {
  message: string
  type?: ToastType
  description?: string
  icon?: string
  closeIcon?: string

  // if timeout is 0, toast will not timeout
  timeout?: number
}

interface ToastListener {
  onClick?: () => void
  onTimeout?: () => void
}

interface ToastButton {
  label: string
  callback: () => void
}

type ToastType = 'info' | 'success' | 'warning' | 'error' | 'none'
