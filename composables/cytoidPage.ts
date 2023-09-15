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
      markedDescription = markedDescription.substring(0, 250)
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
      twitterCard: 'summary_large_image',
    })
  }
  else {
    useSeoMeta(getDefaultMeta())
  }
}

// Should only be used in /index
export function resetCytoidPage() {
  const pageData = useState<PageData>('pageData')
  pageData.value = getDefault()
  useSeoMeta(getDefaultMeta())
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

function getDefaultMeta(): Parameters<typeof useSeoMeta>[0] {
  const config = useRuntimeConfig()
  const { t } = useI18n()

  const webUrl = config.public.webURL
  const staticURL = config.public.staticURL
  const title = 'Cytoid'
  const imageUrl = `${staticURL}/img/session.jpg`
  const description = t('homepage.slogan')
  return {
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogUrl: webUrl,
    ogImage: imageUrl,
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: imageUrl,
    twitterCard: 'summary',
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
