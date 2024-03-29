import { useSavedCookie } from './cookie'

export function useAuth() {
  const user: Ref<UserData | null> = useState('user')
  const cookie = useSavedCookie<string | null>('cyt:sess')

  const _ready = useState(() => false)
  const ready = computed<boolean>(() => _ready.value)
  const isLogin = computed<boolean | null>(() => {
    if (ready.value) {
      return user.value !== null
    }

    return null
  })

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

    _ready.value = false
    const response = await useServiceFetch<SessionResponse>('session')
    if (response.status.value === 'success') {
      const userData = response.data.value?.user ?? null
      user.value = userData
    }
    else {
      user.value = null
    }
    _ready.value = true
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

  const hasAuthToken = computed(() => !!cookie.value)
  const isModerator = computed(() => ['admin', 'moderator'].includes(user.value?.role ?? 'user'))
  const isAdmin = computed(() => user.value?.role === 'admin')

  return { user, login, init, logout, isLogin, ready, toLogin, hasAuthToken, updateUser, isModerator, isAdmin }
}
