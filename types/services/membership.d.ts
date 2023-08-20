type MembershipResponse = {
  id: string
  channel: string
  contribution: number
  quote: string
} | ''

type MembershipPatchResponse = {
  id: string
  provider: string
  uid: string
  token?: string
} | null

