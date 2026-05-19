import type { Chain } from './Chain'
import { darken, desaturate, lighten, mix, saturate, setAlpha } from './color'
import { ENHANCED_PROPS } from './enhanced-props'
import { GLOBAL_KEYWORDS, KEYWORD_TO_CSS } from './keywords'
import { getUnitList, withUnit, type UnitClass } from './units'

/**
 * 给一个属性名返回一个 callable Proxy（PropCarrier / ColorPropCarrier 形态）。
 *
 * 形态：
 *   1. fn(value)            -> 直接 set
 *   2. _tokenIdent          -> 查 keymap → 取 theme 值（颜色 token 返回 ColorTokenValue
 *      暴露 .alpha(n)；其它 token 返回 chain）
 *   3. cssKeyword           -> 查 KEYWORD_TO_CSS（命中 ENHANCED_PROPS.keywords 白名单或
 *      全局关键字才生效）
 *   4. .px(n) / .rem(n) / .ms(n) / .deg(n)... -> withUnit
 *
 * 结果按 prop 缓存到 `chain._carriers`，避免重复建 Proxy。
 *
 * 闭包陷阱：carrier 内部所有对 `_node` 的读写都走 `chain._node`（不要在闭包里快照
 * `_node` 引用，否则 `_hover` 嵌套切换后写到错位置）。
 */
export function getOrCreateCarrier(chain: Chain<never>, prop: string): unknown {
  const internal = chain as unknown as ChainInternal
  const cached = internal._carriers.get(prop)
  if (cached !== undefined) return cached

  const carrier = buildCarrier(chain, prop)
  internal._carriers.set(prop, carrier)
  return carrier
}

function buildCarrier(chain: Chain<never>, prop: string): unknown {
  const cfg = ENHANCED_PROPS[prop]
  const internal = chain as unknown as ChainInternal

  // callable: target 是函数（fn(value) 形态）
  const target = function (value: unknown) {
    internal._node[prop] = value
    return chain
  }

  return new Proxy(target, {
    get(_t, key) {
      if (typeof key !== 'string') return undefined

      // unit 方法（.px / .rem / .ms / .deg ...）
      if (cfg?.unitClass && isUnitMethod(key, cfg.unitClass)) {
        return (n: number) => {
          internal._node[prop] = withUnit(n, key)
          return chain
        }
      }

      // 主题 token（`_` 前缀）
      if (cfg?.tokenCat && key.startsWith('_')) {
        const catMap = internal._keymap.get(cfg.tokenCat)
        const origKey = catMap?.get(key)
        if (origKey !== undefined) {
          const slot = (internal._theme as Record<string, Record<string, string | number>>)[cfg.tokenCat]
          const value = slot?.[origKey]
          internal._node[prop] = value

          // 颜色 token：返回 ColorTokenValue（含 .alpha(n)）；非颜色直接返回 chain
          if (cfg.tokenCat === 'color' && typeof value === 'string') {
            return makeColorTokenValue(chain, prop, value)
          }
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

/**
 * 颜色 token 命中后返回的 helper —— 暴露 alpha / darken / lighten / mix / saturate / desaturate。
 *
 * 闭包持有 `value`（token 原值）：所有 modifier 基于原值计算并覆盖写入，
 * 多次调用同 modifier 不累积（每次都用原 token 重新算）。
 */
interface ColorTokenValueRuntime {
  alpha(n: number): unknown
  darken(n: number): unknown
  lighten(n: number): unknown
  mix(other: string, n: number): unknown
  saturate(n: number): unknown
  desaturate(n: number): unknown
}

function makeColorTokenValue(chain: Chain<never>, prop: string, value: string): ColorTokenValueRuntime {
  const internal = chain as unknown as ChainInternal
  return {
    alpha(n: number) {
      internal._node[prop] = setAlpha(value, n / 100)
      return chain
    },
    darken(n: number) {
      internal._node[prop] = darken(value, n)
      return chain
    },
    lighten(n: number) {
      internal._node[prop] = lighten(value, n)
      return chain
    },
    mix(other: string, n: number) {
      internal._node[prop] = mix(value, other, n)
      return chain
    },
    saturate(n: number) {
      internal._node[prop] = saturate(value, n)
      return chain
    },
    desaturate(n: number) {
      internal._node[prop] = desaturate(value, n)
      return chain
    },
  }
}

/**
 * 判断 `key` 是否是 `cls` 单位族里的有效 unit 方法。
 *
 * 直接走 `units.ts` 的 single source（LENGTH_UNITS / TIME_UNITS / ANGLE_UNITS），
 * 避免硬编码漂移。修 R1：之前手写 16 个长度单位，漏掉 W1.7 补的 14 个现代单位
 * （svw/lvw/dvw/cqw/cqi/... 等）导致 `s.padding.cqw(10)` 运行时静默失败。
 */
function isUnitMethod(key: string, cls: UnitClass): boolean {
  return (getUnitList(cls) as readonly string[]).includes(key)
}

/**
 * 全局 CSS 关键字（inherit / unset / initial / revert / revertLayer）。
 *
 * 走 `keywords.ts` 的 `GLOBAL_KEYWORDS` single source（修 R2：避免与硬编码漂移）。
 */
function isGlobalKeyword(key: string): boolean {
  return (GLOBAL_KEYWORDS as readonly string[]).includes(key)
}

interface ChainInternal {
  _node: Record<string, unknown>
  _theme: Record<string, Record<string, string | number>>
  _keymap: Map<string, Map<string, string>>
  _carriers: Map<string, unknown>
}
