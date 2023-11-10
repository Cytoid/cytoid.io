interface levelDownloadResponse {
  package: string
}
interface RatingResponse {
  average?: number
  total: number
  distribution: number[]
  rating?: number
}

interface levelQueryResponse {
  id: number
  version: number
  uid: string
  title: string
  metadata: {
    title: string
    title_localized: string
    artist: {
      url: string
      name: string
    }
    charter: {
      name: string
    }

    illustrator: {
      url: string
      name: string
    }
  }
  category: any[]
  creationDate: string
  modificationDate: string
  owner: {
    id: string
    uid: string
    name: string
    avatar: {
      original: string
      small: string
      medium: string
      large: string
    }
  }
  state: string
  cover: {
    original: string
    thumbnail: string
    cover: string
    stripe: string
  }
  music: string
  musicPreview: string
  charts: {
    id: number
    difficulty: number
    name?: string
    notesCount: number
    type: string
  }[]
}
