import type { CSSObject } from '@emotion/css/create-instance'
import { injectGlobal } from './injectGlobal'

/**
 * W8.1 — `@layer` 注入。
 *
 * CSS Cascade Layers（baseline 2022+）：用 `@layer base, components, utilities` 控制
 * 全局 CSS 的优先级层级，让"晚加载"的 layer 优先于"早加载"的，**与 selector 特异性解耦**。
 *
 * 全 helper 走全局 `injectGlobal`（内置内存去重，修 S1 一致性）。
 *
 * @example
 * injectLayerOrder(['reset', 'base', 'components', 'utilities'])
 *
 * injectLayer('components', {
 *   '.btn': { padding: '8px 16px' },
 * })
 */

/** 声明 layer 顺序（应在所有 injectLayer 之前调用一次）。 */
export function injectLayerOrder(layers: readonly string[]): void {
  if (layers.length === 0) return
  injectGlobal(`@layer ${layers.join(', ')};`)
}

/** 把 styles 包进 `@layer <name> { ... }` 注入全局样式表。 */
export function injectLayer(name: string, styles: CSSObject): void {
  injectGlobal({ [`@layer ${name}`]: styles })
}
