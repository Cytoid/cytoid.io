export async function useSWR(
  maxAge: number = 3600,
) {
  if (import.meta.server) {
    const headerName = import.meta.env.NODE_ENV === 'development'
      ? 'X-Dev-Cache-Control'
      : 'Cache-Control'
    const event = useRequestEvent()
    event?.node.res.setHeader(headerName, `max-age=${maxAge}`)
  }
}
