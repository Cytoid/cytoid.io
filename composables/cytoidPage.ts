export const defineCytoidPage = (data:IPageData) => {
  const pageData = useState<PageData>('pageData')
  pageData.value = {
    ...getDefault(),
    ...data
  }
}

// Should only be used in /index
export const resetCytoidPage = () => {
  const pageData = useState<PageData>('pageData')
  pageData.value = getDefault()
}

export const useCytoidPage = () => {
  const pageData = useState<PageData>('pageData', getDefault)
  return pageData
}

function getDefault () {
  return {
    background: '',
    title: ''
  }
}

interface IPageData {
  background?: string
  title: string
}

interface PageData {
  background: string
  title: string
}