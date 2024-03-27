import type { TypedDocumentNode } from '@graphql-typed-document-node/core'

export function fid(item: unknown): string | number {
  if (
    item
    && typeof item === 'object'
    && 'id' in item
  ) {
    if (typeof item.id === 'string' || typeof item.id === 'number') {
      return item.id
    }
  }
  // return random id
  return Math.random().toString(36).substring(8)
}

// make ' $fragmentName' and '__typename' to be any
type CleanFragmentData<T> = T & { ' $fragmentName'?: any, '__typename'?: any }

// FragmentType<TypedDocumentNode<PostCardDataFragment, unknown>> to PostCardDataFragment
export type FragmentData<TD> = TD extends TypedDocumentNode<infer U, unknown> ? CleanFragmentData<U> : never

export type MaybeFragmentType<TD extends TypedDocumentNode<any, any>> = FragmentType<TD> | FragmentData<TD>

// export function parseFragment<
//   TD extends TypedDocumentNode<any, any>,
// >(
//   _documentNode: TD,
//   fragmentType: MaybeFragmentType<TD>,
// ): FragmentData<TD> {
//   return fragmentType as any
// }
// return non-nullable if `fragmentType` is non-nullable
export function parseFragment<
  TD extends TypedDocumentNode<any, any>,
>(
  _documentNode: TD,
  fragmentType: MaybeFragmentType<TD>
): FragmentData<TD>
// return nullable if `fragmentType` is nullable
export function parseFragment<
  TD extends TypedDocumentNode<any, any>,
>(
  _documentNode: TD,
  fragmentType: MaybeFragmentType<TD> | null | undefined
): FragmentData<TD> | null | undefined
// return array of non-nullable if `fragmentType` is array of non-nullable
export function parseFragment<
  TD extends TypedDocumentNode<any, any>,
>(
  _documentNode: TD,
  fragmentType: ReadonlyArray<MaybeFragmentType<TD>>
): ReadonlyArray<FragmentData<TD>>
// return array of nullable if `fragmentType` is array of nullable
export function parseFragment<
  TD extends TypedDocumentNode<any, any>,
>(
  _documentNode: TD,
  fragmentType: ReadonlyArray<MaybeFragmentType<TD>> | null | undefined
): ReadonlyArray<FragmentData<TD>> | null | undefined
export function parseFragment<
  TD extends TypedDocumentNode<any, any>,
>(
  _documentNode: TD,
  fragmentType: MaybeFragmentType<TD> | ReadonlyArray<MaybeFragmentType<TD>> | null | undefined,
): FragmentData<TD> | ReadonlyArray<FragmentData<TD>> | null | undefined {
  return fragmentType as any
}
