import { useSavedCookie } from './cookie'

function useAuthCookie() {
  return useSavedCookie<string | null>('cyt:sess')
}

function useUserState() {
  return useState<UserData | null>('user')
}

function useAuthReady() {
  return useState('auth-ready', () => false)
}

export function useWriteableAuth() {
  const user = useUserState()
  const ready = useAuthReady()

  const logout = async () => {
    user.value = null
    return await useServiceFetch<SessionResponse>('session', {
      method: 'DELETE',
    })
  }

  const init = async () => {
    if (ready.value) {
      return user.value
    }

    ready.value = false
    const response = await useServiceFetch<SessionResponse>('session')
    if (response.status.value === 'success') {
      const userData = response.data.value?.user ?? null
      user.value = userData
    }
    else {
      user.value = null
    }
    ready.value = true
    return user.value
  }

  const updateUser = (data: UserData) => {
    user.value = data
  }

  const login = async (payload: LoginPayload) => {
    const response = await useServiceFetch<SessionResponse>('session', {
      method: 'POST',
      body: payload,
    })
    const userData = response.data.value?.user ?? null
    user.value = userData
    return response
  }

  return { login, init, logout, updateUser }
}

export function useReadonlyAuth() {
  const user = useUserState()
  const cookie = useAuthCookie()
  const ready = useAuthReady()

  const isLogin = computed<boolean | null>(() => {
    if (ready.value) {
      return user.value !== null
    }

    return null
  })

  const toLogin = async (back?: string) => {
    const route = useRoute()
    const router = useRouter()
    const origin = back ?? route.path
    return await router.push({
      path: '/session/login',
      query: {
        origin: origin !== '/' ? encodeURIComponent(origin) : undefined,
      },
    })
  }

  const readonlyReady = readonly(ready)
  const readonlyUser = readonly(user)

  const hasAuthToken = computed(() => !!cookie.value)
  const isModerator = computed(() => ['admin', 'moderator'].includes(user.value?.role ?? 'user'))
  const isAdmin = computed(() => user.value?.role === 'admin')

  return { user: readonlyUser, isLogin, ready: readonlyReady, toLogin, hasAuthToken, isModerator, isAdmin }
}

export const useAuth = useReadonlyAuth
