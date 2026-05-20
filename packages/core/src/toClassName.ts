import type { Chain } from './chain/Chain'
import type { ThemeSchema } from './theme/types'

/**
 * Chain → emotion className。
 *
 * 泛型参数让 `Chain<BaseSchema>` / `Chain<MySchema>` 等任何具体 T 都能传入；
 * `Chain<never>` 因 T 不变性会拒绝其他实例化。
 */
export function toClassName<T extends ThemeSchema>(chain: Chain<T>): string {
  return chain.toString()
}
