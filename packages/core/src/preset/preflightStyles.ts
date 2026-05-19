import type { CSSObject } from '@emotion/css/create-instance'

/**
 * Preflight 全局 CSS reset 的 single source（修 R4 漂移）。
 *
 * 同时被 `src/preflight.ts`（全局版）和 `createIcssInstance` 的 `injectPreflight`（instance 版）
 * 引用，确保两份实现内容一致。
 *
 * 设计哲学（Plan §决策 D11）：
 * - **不抢用户 CSS reset 选择权**
 * - 只覆盖"几乎所有项目都需要"的零争议条目
 * - 不参数化，1 行调用就 OK
 */
/**
 * 深 freeze：让 `PREFLIGHT_STYLES` 及其所有嵌套 CSSObject 都不可被外部 mutation（S5）。
 *
 * 用户可能拿到引用并改 `PREFLIGHT_STYLES.body.margin = 10`，会污染后续 inject 结果。
 * 深 freeze 后任何写入静默失败（严格模式抛 TypeError）。
 */
function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const v of Object.values(value)) {
      if (v && typeof v === 'object') deepFreeze(v)
    }
    Object.freeze(value)
  }
  return value
}

export const PREFLIGHT_STYLES: CSSObject = deepFreeze({
  '*, *::before, *::after': { boxSizing: 'border-box' },
  body: {
    margin: 0,
    lineHeight: 1.5,
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    textRendering: 'optimizeLegibility',
  },
  'h1, h2, h3, h4, h5, h6, p, blockquote, dl, dd, figure, pre': { margin: 0 },
  'button, input, textarea, select, optgroup': {
    font: 'inherit',
    color: 'inherit',
    margin: 0,
  },
  'button, [role="button"]': { cursor: 'pointer' },
  'img, svg, video, canvas, audio, iframe, embed, object': {
    display: 'block',
    maxWidth: '100%',
  },
  'ul, ol': { listStyle: 'none', padding: 0, margin: 0 },
  a: { color: 'inherit', textDecoration: 'inherit' },
})
