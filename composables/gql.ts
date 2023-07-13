import { graphql as _graphql } from '~/gql';
import { Client, AnyVariables, DocumentInput, OperationContext, OperationResult, CombinedError } from '@urql/core'
import { Subscription } from 'wonka'

export const gql = _graphql
export const graphql = _graphql

export function useUrql() {
  const app = useNuxtApp()
  const client = app.$urql

  return { client }
}

export function useAsyncQuery<Data = any, Variables extends AnyVariables = AnyVariables>(
  query: DocumentInput<Data, Variables>,
  variables?: Variables,
  context?: Partial<OperationContext>
) {
  return useAsyncData(async () => useQuery(query, variables, context))
}

export function useLazyAsyncQuery<Data = any, Variables extends AnyVariables = AnyVariables>(
  query: DocumentInput<Data, Variables>,
  variables?: Variables,
  context?: Partial<OperationContext>
) {
  return useAsyncData(async () => useQuery(query, variables, context), { lazy: true })
}

export async function useQuery<Data = any, Variables extends AnyVariables = AnyVariables>(
  query: DocumentInput<Data, Variables>,
  variables?: Variables,
  context?: Partial<OperationContext>
) {
  const { client } = useUrql()
  const ans = await client.query(query, variables, context).toPromise()
  if (ans.error) {
    throw new Error(ans.error.message)
  }
  return ans.data
}

export async function useMutation<Data = any, Variables extends AnyVariables = AnyVariables>(
  query: DocumentInput<Data, Variables>,
  variables?: Variables,
  context?: Partial<OperationContext>
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
  context?: MaybeRef<Partial<OperationContext>>
) {
  const { client } = useUrql()

  const result = useState<OperationResult<Data, Variables>>()
  let sub : Subscription | null = null
  let error : CombinedError | undefined

  // update when query/variables/context changes
  watch([query, variables, context], async () => {
    const _query = unref(query)
    const _variables = unref(variables)
    const _context = unref(context)
  
    const req = client.subscription(_query, _variables, _context)
    sub = req.subscribe(newResult => {
      result.value = newResult
    })
    
    const ans = await req.toPromise()
    error = ans.error
  })

  
  return { result, error, unsubscribe: () => sub?.unsubscribe() }
}
