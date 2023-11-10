interface CreditMeta {
  content: {
    title: string
    members: string[]
  }[]
  patrons: {
    id: string
    channel: string
    contribution: number
    quote: string
    owner: {
      id: string
      uid: string
      name?: any
      avatar: {
        original: string
        small: string
        medium: string
        large: string
      }
    }
  }[]
  patronsCount: number
}
