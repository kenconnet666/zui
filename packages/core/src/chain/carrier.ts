import type { Chain } from './Chain'
import { ENHANCED_PROPS } from './enhanced-props'
import { KEYWORD_TO_CSS } from './keywords'
import { withUnit, type UnitClass } from './units'

/**
 * 给一个属性名返回一个 callable Proxy（PropCarrier 形态）。
 * 形态四态：
 *   1. fn(value)           -> 直接 set
 *   2. _tokenIdent         -> 查 keymap → 取 theme 值
 *   3. cssKeyword          -> 查 KEYWORD_TO_CSS
 *   4. .px(n) / .rem(n)... -> withUnit
 *
 * Phase 1 Day 3 会替换为完整实现（含 carrier 实例缓存）。这里给一个能跑的最小版本。
 */
export function getOrCreateCarrier(chain: Chain<never>, prop: string): unknown {
  const cfg = ENHANCED_PROPS[prop]
  const internal = chain as unknown as ChainInternal

  // callable: target 是函数
  const target = function (value: unknown) {
    internal._node[prop] = value
    return chain
  }

  return new Proxy(target, {
    get(_t, key) {
      if (typeof key !== 'string') return undefined

      // unit 方法
      if (cfg?.unitClass && isUnitMethod(key, cfg.unitClass)) {
        return (n: number) => {
          internal._node[prop] = withUnit(n, key)
          return chain
        }
      }

      // 主题 token (_ 前缀)
      if (cfg?.tokenCat && key.startsWith('_')) {
        const ident = key
        const catMap = internal._keymap.get(cfg.tokenCat)
        const origKey = catMap?.get(ident)
        if (origKey !== undefined) {
          const slot = (internal._theme as Record<string, Record<string, string | number>>)[cfg.tokenCat]
          internal._node[prop] = slot?.[origKey]
          return chain
        }
      }

      // CSS keyword
      const cssValue = KEYWORD_TO_CSS[key]
      if (cssValue !== undefined && (cfg?.keywords === null || cfg?.keywords?.includes(key) || isGlobalKeyword(key))) {
        internal._node[prop] = cssValue
        return chain
      }

      return undefined
    },
  })
}

function isUnitMethod(key: string, cls: UnitClass): boolean {
  if (cls === 'length') {
    return ['px', 'rem', 'em', 'ch', 'ex', 'vw', 'vh', 'vmin', 'vmax', 'pct', 'cm', 'mm', 'in', 'pt', 'pc', 'fr'].includes(key)
  }
  if (cls === 'time') return key === 'ms' || key === 's'
  return ['deg', 'rad', 'grad', 'turn'].includes(key)
}

function isGlobalKeyword(key: string): boolean {
  return key === 'inherit' || key === 'unset' || key === 'initial' || key === 'revert' || key === 'revertLayer'
}

interface ChainInternal {
  _node: Record<string, unknown>
  _theme: Record<string, Record<string, string | number>>
  _keymap: Map<string, Map<string, string>>
}
