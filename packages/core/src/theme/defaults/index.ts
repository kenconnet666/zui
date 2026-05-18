export { defaultLight } from './light'
export { defaultDark } from './dark'
export type { DefaultSchema } from './schema'
export { palette } from './palette'

// 注：不再导出 `const DefaultSchema = defaultLight.schema`。
// `DefaultSchema` 仅作类型存在，运行时入口是 `defaultLight` / `defaultDark`。
// `class Chain<T extends ThemeSchema = DefaultSchema>` 的默认实参是**类型层**的，
// 不需要运行时值参与（必传 theme 决策见 Plan §11.5）。
