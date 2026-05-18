import type { Chain } from './chain/Chain'

/** Chain → emotion className。 */
export function toClassName(chain: Chain<never>): string {
  return chain.toString()
}
