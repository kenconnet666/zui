import type { ThemeSchema } from '../types'
import type { PaletteToken } from './palette'
import type { FlattenComponentTokens } from '../../types/components'

/**
 * `BaseSchema` —— core 层的最小默认 schema。
 *
 * **设计哲学**：core 只承载 **通用 CSS 原语 + Tailwind palette**。所有"设计系统语义"
 * （semantic 色、5 阶 size scale、easing 曲线、UI 角色 zIndex 等）由上层（ui-vue 的
 * `ZuiSchema`）补全。
 *
 * 这样 core 可以被任意 UI 框架/设计系统复用 —— Tailwind palette 是通用资产，而
 * `primary='#2563eb'`、`spacing.middle='16px'` 等都是 zui 的设计决策。
 *
 * **color 字段**：
 * - Tailwind 完整 palette（242 色，22 色相 × 11 shade）
 * - 用户通过 `ComponentTokenRegistry` 注册的组件级 flatten token（W1.2 / 0.7.0+）
 *
 * 其余 category（spacing/radius/...）走 base `ThemeSchema` 的 `?: Record<string, ThemeValue>`
 * —— 字段存在但**不预填**，需要时由 ZuiSchema 层补完。
 */
export interface BaseSchema extends ThemeSchema {
  /**
   * Tailwind 242 色 palette + component token registry 派生的 flatten 字段。
   *
   * 不含 semantic 色（primary / danger / 等） —— 那些在 `ZuiSchema` 里加。
   */
  color: Record<PaletteToken, string> & Partial<Record<FlattenComponentTokens, string>>
}
