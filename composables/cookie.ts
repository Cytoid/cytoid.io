import type { CookieOptions, CookieRef } from '#app'

export function useSavedCookie<T = string | null | undefined>(
  name: string,
  _opts?: CookieOptions<T> & { readonly?: false },
): CookieRef<T>
export function useSavedCookie<T = string | null | undefined>(
  name: string,
  _opts?: CookieOptions<T> & { readonly: true },
): Readonly<CookieRef<T>>
export function useSavedCookie<T = string | null | undefined>(
  name: string,
  _opts?: CookieOptions<T>,
) {
  return useCookie(name, {
    maxAge: 7 * 24 * 60 * 60, // 7 days
    ..._opts,
  } as any)
}
