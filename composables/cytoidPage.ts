export function defineCytoidPage(data: IPageData) {
  const pageData = useState<PageData>('pageData')
  pageData.value = {
    ...getDefault(),
    ...data,
  }
  useHead({
    title: pageData.value.title,
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
    title: '',
  }
}

interface IPageData {
  background?: string
  title?: string
}

interface PageData {
  background: string
  title: string
}
