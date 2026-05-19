import { injectGlobal } from './injectGlobal'
import { PREFLIGHT_STYLES } from './preset/preflightStyles'

/**
 * W5.4 — 仅 normalize 风格的全局 CSS reset（**不**等同 Tailwind 完整 preflight）。
 *
 * 设计哲学（D11）：
 *  - 不抢用户 CSS reset 选择权
 *  - 只做"几乎所有项目都需要"的零争议条目
 *  - 1 行调用就 OK，不参数化
 *
 * 内容定义在 `preset/preflightStyles.ts`，与 `createIcssInstance.injectPreflight()`
 * 共用同一份 single source（修 R4：避免两边实现漂移）。
 *
 * @example
 * import { injectPreflight } from '@kenconnet666/zui-core'
 * injectPreflight()
 */
export function injectPreflight(): void {
  injectGlobal(PREFLIGHT_STYLES)
}
