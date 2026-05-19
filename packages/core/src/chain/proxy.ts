import type { Chain } from './Chain'
import { getOrCreateCarrier } from './carrier'

/**
 * Chain 实例字段名白名单（不在 prototype 上，必须显式列出）。
 *
 * **B2 改造**：Chain.prototype 上的内建方法（`_hover` / `label` / `_truncate` / 等）
 * 不再硬编码 —— 改为构造时自动从 prototype 链上扫描。新增内建方法无需同步白名单。
 */
const INSTANCE_FIELDS = new Set<string>([
  '_node',
  '_theme',
  '_keymap',
  '_carriers',
  '_cssFn',
  '_resolved',
  'constructor',
])

/**
 * prototype 上所有键名的缓存。key 是 prototype 对象（用 WeakMap 防止内存泄漏），
 * value 是该 prototype 链上的所有 own property names 合集。
 *
 * 同一个类的所有实例共享一个 prototype，所以这里命中率几乎 100%。
 */
const prototypeKeysCache = new WeakMap<object, Set<string>>()

function getPrototypeKeys(target: object): Set<string> {
  const proto = Object.getPrototypeOf(target) as object | null
  if (!proto) return new Set()
  const cached = prototypeKeysCache.get(proto)
  if (cached) return cached

  const keys = new Set<string>()
  let p: object | null = proto
  while (p && p !== Object.prototype) {
    for (const k of Object.getOwnPropertyNames(p)) {
      keys.add(k)
    }
    p = Object.getPrototypeOf(p) as object | null
  }
  prototypeKeysCache.set(proto, keys)
  return keys
}

/** 测试用：清空 prototype 键缓存（继承场景下让 stub 实例重新扫描）。 */
export function _resetPrototypeKeysCache(): void {
  // WeakMap 不支持 clear；用替换大法
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(prototypeKeysCache as any) = new WeakMap()
}

/**
 * Chain 实例构造完成后，包一层 Proxy：
 * - 内部字段、内建方法（`_hover`/`label`/`toString`...）直接走原对象
 * - 否则按属性名走 `getOrCreateCarrier`
 *
 * 关键陷阱：方法 bind 到 **receiver（proxy）**，不是 target。否则 `_when` / `_apply` /
 * `_nest` 内部 `fn(this)` 传出 target（无 carrier），后续 `s.color._primary` 触发不了
 * Proxy → TypeError。详见 Plan §3.4。
 */
export function makeChainProxy<C extends Chain<never>>(chain: C): C {
  return new Proxy(chain, {
    get(target, prop, receiver) {
      if (typeof prop !== 'string') {
        return Reflect.get(target, prop, receiver)
      }

      // 1. 实例字段（_node / _theme / _keymap / _carriers / _cssFn / constructor）
      if (INSTANCE_FIELDS.has(prop)) {
        const v = Reflect.get(target, prop, receiver)
        return typeof v === 'function' ? v.bind(receiver) : v
      }

      // 2. prototype 上自动扫描的内建方法（_hover / label / _truncate / toString / 等）
      if (getPrototypeKeys(target).has(prop)) {
        const v = Reflect.get(target, prop, receiver)
        return typeof v === 'function' ? v.bind(receiver) : v
      }

      // 3. 其余视为 CSS 属性，走 carrier
      return getOrCreateCarrier(target as unknown as Chain<never>, prop)
    },
  }) as C
}
