import { useSavedCookie } from "./utils"

export const useAuth = () => {
  const user : Ref<UserData | null> = useState('user')
  const cookie = useSavedCookie<String | null>("cyt:sess")

  const _ready = useState(() => false)
  const ready = computed<boolean>(() => _ready.value)
  const isLogin = computed<boolean | null>(() => {
    if (ready.value) {
      return user.value != null
    }
    return null
  })

  const logout = async () => {
    user.value = null
    cookie.value = null
    return await useServiceFetch<SessionResponse>('session', {
      method: 'DELETE'
    })
  }

  const init = async () => {
    _ready.value = false
    const response = await useServiceFetch<SessionResponse>('session')
    if (response.status.value == 'success') {
      const userData = response.data.value?.user ?? null
      user.value = userData
    } else {
      user.value = null
    }
    _ready.value = true
    return user.value
  }

  const login = async (payload: LoginPayload) => {
    const response = await useServiceFetch<SessionResponse>('session', {
      method: 'POST',
      body: payload
    })
    const userData = response.data.value?.user ?? null
    user.value = userData
    return userData
  }

  const toLogin = async (back?: string) => {
    const route = useRoute()
    const router = useRouter()
    const origin = back ?? route.path
    return await router.push({path: '/session/login', query: {
      origin: origin != '/' ? encodeURIComponent(origin) : undefined
    }})
  }

  return { user, login, init, logout, isLogin, ready, toLogin }
}