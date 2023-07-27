export function usePreviewState() {
  const previewState = useState<PreviewStateData>('preview', getDefault)

  const updatePreviewState = (state: PreviewStateData) => {
    previewState.value = {
      ...state,
    }
  }

  const updatePreviewCurrent = (time: number) => {
    if (previewState.value.state !== 'playing') {
      return
    }
    previewState.value.currentTime = time
  }

  const resetPreviewState = () => {
    previewState.value = getDefault()
  }

  return { previewState, updatePreviewState, updatePreviewCurrent, resetPreviewState }
}

export function orderPreview(url: string) {
  const previewOrder = useState<string | null>('previewOrder', () => null)
  previewOrder.value = url
}

export function usePreviewOrder() {
  const previewOrder = useState<string | null>('previewOrder', () => null)
  return { previewOrder }
}

function getDefault(): PreviewStateData {
  return {
    state: 'ended',
  }
}

type PreviewStateData = {
  state: 'ended'
} | {
  state: 'loading'
  url: string
} | {
  state: 'playing' | 'paused'
  url: string
  currentTime: number
  duration: number
}
