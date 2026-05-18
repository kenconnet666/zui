import { keyframes } from '@emotion/css'
import type { CSSObject } from '@emotion/css/create-instance'

/** keyframes builder：累积一个 { '0%': {...}, '100%': {...} } 对象。 */
export interface KeyframesBuilder {
  /** 在指定 stop（如 `'0%'`、`'from'`、`'50%'`）追加样式。 */
  at(stop: string, styles: CSSObject): KeyframesBuilder
  /** `from` 简写。 */
  from(styles: CSSObject): KeyframesBuilder
  /** `to` 简写。 */
  to(styles: CSSObject): KeyframesBuilder
}

/**
 * 创建一个 emotion `keyframes` 名称。
 *
 * ```ts
 * const fadeIn = ikeyframes(k => {
 *   k.from({ opacity: 0 })
 *   k.to({ opacity: 1 })
 * })
 * ```
 */
export function ikeyframes(factory: (k: KeyframesBuilder) => void): string {
  const stops: Record<string, CSSObject> = {}
  const builder: KeyframesBuilder = {
    at(stop, styles) {
      stops[stop] = { ...(stops[stop] ?? {}), ...styles }
      return builder
    },
    from(styles) {
      return builder.at('from', styles)
    },
    to(styles) {
      return builder.at('to', styles)
    },
  }
  factory(builder)
  return keyframes(stops)
}
