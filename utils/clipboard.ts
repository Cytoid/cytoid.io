export function copyToClipboard(text: string, name?: string) {
  const { copy, isSupported } = useClipboard()
  if (isSupported.value) {
    copy(text)
    successAlert(`Copied ${name || 'text'} to clipboard`)
  }
}
