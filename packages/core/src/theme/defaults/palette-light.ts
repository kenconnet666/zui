import { Theme } from '../Theme'
import { FLAT_PALETTE } from './palette'
import type { BaseSchema } from './schema'

/**
 * 内置 palette 主题 —— 浅色 root（含 22×11=242 色 Tailwind palette）。
 *
 * **仅 palette**，不含 semantic 色 / 5 阶 size scale / easing 等设计系统 token。
 * 那些放在 ui-vue 的 `zuiLight` / `zuiDark` 里。
 *
 * 直接用 `paletteLight` 时：
 * - ✅ 能 `s.color._blue500 / _red600` 等访问 palette token
 * - ❌ 无 `_primary / _danger`（这是 ZuiSchema 才有的）
 * - ❌ 无 `spacing.middle / radius.large`（同上）
 *
 * 业务/组件库消费方应该用 `zuiLight`（来自 @kenconnet666/zui-vue）。
 */
export const paletteLight = new Theme<BaseSchema>({
  color: {
    ...FLAT_PALETTE,
  },
})
