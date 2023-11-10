import type { AnyVariables, CombinedError, DocumentInput, OperationContext, OperationResult } from '@urql/core'
import type { Subscription } from 'wonka'
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
  const { client } = useUrql()
  const ans = await client.query(query, variables, context).toPromise()
  if (ans.error) {
    throw createUrqlError(ans.error)
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
    throw createUrqlError(ans.error)
  }

  return ans.data
}

function createUrqlError(error: CombinedError) {
  const graphqlErrors = error.graphQLErrors.map(e => e.message)
  const networkError = error.networkError?.message
  const message = [
    ...graphqlErrors,
    ...(networkError ? [`Network error: ${networkError}`] : []),
  ].join('; ')
  return new Error(message)
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
