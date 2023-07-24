import type { Meta } from './utils'

export function defineCytoidPage(data: PageDataWithTitle, meta?: Meta) {
  const pageData = useState<PageData>('pageData')
  pageData.value = {
    ...getDefault(),
    ...data,
  }
  useHead({
    title: pageData.value.title,
    ...meta,
  })
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
  }
}

interface PageData {
  background?: string
  title?: string
}
interface PageDataWithTitle {
  background?: string
  title: string
}
