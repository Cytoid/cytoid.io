interface LevelCommentMetadata {
	path: {
    name: "level-id"
    params: {
      id: string
    }
  }
	level: {
    id: number
    uid: string
    title: string
  }
	title: string
}

interface ProfileCommentMetadata {
	path: {
    name: "profile-id"
    params: {
      id: string
    }
  }
	user: {
    id: number
    uid: string
    name?: string
  }
	title: string
}

interface CollectionCommentMetadata {
	path: {
    name: 'collections-id'
    params: {
      id: string
    }
  }
	title: string
}

type CommentMetadata = LevelCommentMetadata | ProfileCommentMetadata | CollectionCommentMetadata

interface CommentResponse {
	id: number
	content: string
	date: string
	anonymous: boolean
	metadata: CommentMetadata
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
	count: number
}