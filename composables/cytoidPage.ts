import sanitizeHtml from 'sanitize-html'

export function defineCytoidPage(data: PageDataWithTitle, meta?: PageMeta) {
  const pageData = useState<PageData>('pageData')

  const title = titleBuilder(data.title)

  pageData.value = {
    ...getDefault(),
    ...data,
  }
  useHead({
    title: pageData.value.title,
  })

  // SEO
  if (meta) {
    const route = useRoute()
    const config = useRuntimeConfig()
    const webURL = config.public.webURL

    const url = `${webURL}/${route.path}`

    let markedDescription: string | undefined = sanitizeHtml(useMarked(meta?.unsafeDescription ?? ''), { allowedTags: [] })
    if (markedDescription.length > 100) {
      markedDescription = markedDescription.substring(0, 100)
    }
    if (markedDescription === '') {
      markedDescription = undefined
    }

    useSeoMeta({
      title,
      author: meta?.author,
      description: markedDescription,
      ogTitle: title,
      ogDescription: markedDescription,
      ogUrl: url,
      ogImage: data.background,
      twitterTitle: title,
      twitterDescription: markedDescription,
      twitterImage: data.background,
      twitterCard: 'summary',
    })
  }
}

// Should only be used in /index
export function resetCytoidPage() {
  const pageData = useState<PageData>('pageData')
  pageData.value = getDefault()
}

export function useCytoidPage() {
  const pageData = useState<PageData>('pageData', getDefault)
  return pageData
}

function getDefault() {
  return {
    background: '',
    title: undefined,
    preview: undefined,
  }
}

function titleBuilder(title: string) {
  return title
    ? `${title} - Cytoid`
    : 'Cytoid'
}

interface PageData {
  background?: string
  title?: string
  preview?: string
}
interface PageDataWithTitle {
  background?: string
  title: string
  preview?: string
}
interface PageMeta {
  unsafeDescription?: string
  author?: string
}
