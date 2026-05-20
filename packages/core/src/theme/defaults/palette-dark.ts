import { Theme } from '../Theme'
import { FLAT_PALETTE } from './palette'
import type { BaseSchema } from './schema'

/**
 * 内置 palette 主题 —— 深色 root。
 *
 * 与 `paletteLight` 的差异：当前仅 palette 层级，**palette 本身在 light/dark 下值相同**
 * （Tailwind palette 是绝对色，不随主题切换）。`paletteDark` 与 `paletteLight` 此刻
 * 完全等价 —— 之所以分两个 entry，是为了语义上保留"我会消费 dark"的接口位，让
 * `zuiDark` / 用户自定义 dark theme 有清晰的 base 来 fork。
 *
 * 上层主题语义差异（bg 反色、text 反色等）由 `zuiDark` 决策。
 */
export const paletteDark = new Theme<BaseSchema>({
  color: {
    ...FLAT_PALETTE,
  },
})
