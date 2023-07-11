export const defineCytoidPage = (data:PageData) => {
  const pageData = useState<PageData>('pageData')
  pageData.value = {
    ...data
  }
}

export const useCytoidPage = () => {
  const pageData = useState<PageData>('pageData')
  return pageData
}

interface PageData {
  background: string
  title: string
}