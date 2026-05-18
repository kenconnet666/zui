import type { Chain } from './Chain'
import { getOrCreateCarrier } from './carrier'

/** Chain 实例上的非属性键白名单（直接放行，不走 carrier 分派）。 */
const INTERNAL_KEYS = new Set([
  '_node',
  '_theme',
  '_keymap',
  '_resolved',
  '_nest',
  'constructor',
  'toString',
  'toCSSObject',
])

/**
 * Chain 实例构造完成后，包一层 Proxy：
 * - 内部字段、内建方法（`_hover`/`label`/`toString`...）直接走原对象
 * - 否则按属性名走 `getOrCreateCarrier`
 */
export function makeChainProxy<C extends Chain<never>>(chain: C): C {
  return new Proxy(chain, {
    get(target, prop, receiver) {
      if (typeof prop !== 'string') {
        return Reflect.get(target, prop, receiver)
      }
      if (INTERNAL_KEYS.has(prop)) {
        const v = Reflect.get(target, prop, receiver)
        return typeof v === 'function' ? v.bind(target) : v
      }
      // 类原型上的方法（内建 _hover / _media / label / _truncate ...）
      const fromProto = Reflect.get(target, prop, receiver)
      if (typeof fromProto === 'function') {
        return fromProto.bind(target)
      }
      // 其余视为 CSS 属性，走 carrier
      return getOrCreateCarrier(target as unknown as Chain<never>, prop)
    },
  }) as C
}
