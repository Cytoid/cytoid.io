import type { AnyVariables, CombinedError, DocumentInput, OperationContext, OperationResult } from '@urql/core'
import type { Subscription } from 'wonka'
import { cacheExchange, createClient, fetchExchange } from '@urql/core'
import { graphql as _graphql } from '~/gql'

export const gql = _graphql
export const graphql = _graphql

export function useUrql() {
  const app = useNuxtApp()
  const client = app.$urql

  return { client }
}

export async function useQuery<Data = any, Variables extends AnyVariables = AnyVariables>(
  query: DocumentInput<Data, Variables>,
  variables?: Variables,
  context?: Partial<OperationContext>,
) {
  // const { client } = useUrql()
  const config = useRuntimeConfig()
  const url = config.public.graphqlURL

  const client = createClient({
    url,
    exchanges: [
      cacheExchange,
      fetchExchange,
    ],
    fetchOptions: () => ({
      headers: {
        cookie: cookieFiLter(['cyt:sess']),
      },
    }),
  })
  const ans = await client.query(query, variables, context).toPromise()
  if (ans.error) {
    throw new Error(ans.error.message)
  }

  return ans.data
}

export async function useMutation<Data = any, Variables extends AnyVariables = AnyVariables>(
  query: DocumentInput<Data, Variables>,
  variables?: Variables,
  context?: Partial<OperationContext>,
) {
  const { client } = useUrql()
  const ans = await client.mutation(query, variables, context).toPromise()
  if (ans.error) {
    throw new Error(ans.error.message)
  }

  return ans.data
}

// Not tested
export async function useSubscription<Data = any, Variables extends AnyVariables = AnyVariables>(
  query: MaybeRef<DocumentInput<Data, Variables>>,
  variables: MaybeRef<Variables>,
  context?: MaybeRef<Partial<OperationContext>>,
) {
  const { client } = useUrql()

  const result = useState<OperationResult<Data, Variables>>()
  let sub: Subscription | null = null
  let error: CombinedError | undefined

  // update when query/variables/context changes
  watch([query, variables, context], async () => {
    const _query = unref(query)
    const _variables = unref(variables)
    const _context = unref(context)

    const req = client.subscription(_query, _variables, _context)
    sub = req.subscribe((newResult) => {
      result.value = newResult
    })

    const ans = await req.toPromise()
    error = ans.error
  })

  return { result, error, unsubscribe: () => sub?.unsubscribe() }
}

function cookieFiLter(names: string[]) {
  return names.map((name) => {
    const cookie = useCookie(name)
    if (cookie.value) {
      return `${name}=${encodeURIComponent(cookie.value)}`
    }
    return undefined
  }).filter(v => v !== undefined).join('; ')
}
