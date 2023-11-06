interface LoginPayload {
  username: string
  password: string
  remember: boolean
  captcha: string
}

interface SessionResponse {
  token: string
  user: UserData
}

interface UserData {
  id: string
  uid: string
  name?: string
  email: string
  role: string
}
