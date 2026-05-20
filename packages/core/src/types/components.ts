/**
 * W1.2 — 组件级 token 注册表（D14 内部 use）。
 *
 * 通过 declaration merging 让第三方组件库或用户注册自己的组件 token namespace，
 * 自动出现在 `DefaultSchema['color']` 的 keyof（intersection），从而在 chain 上
 * 出现 `c.color._buttonPrimary` 等强类型补全。
 *
 * @example
 * declare module '@kenconnet666/zui-core' {
 *   interface ComponentTokenRegistry {
 *     button: {
 *       primary: string
 *       primaryHover: string
 *       bg: string
 *     }
 *     input: {
 *       borderFocus: string
 *     }
 *   }
 * }
 */
// 故意保留空 interface —— 这是 declaration merging 的 anchor，让用户工程通过
// `declare module '@kenconnet666/zui-core' { interface ComponentTokenRegistry { ... } }`
// 注入自家组件 token namespace。改成 `Record<string, never>` 或 `type` 别名会破坏 merging。
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ComponentTokenRegistry {}

/**
 * 把 registry `{ button: { primary, hover } }` 转 flatten union：
 * `'buttonPrimary' | 'buttonHover'`（用作 `theme.color` 字段 key）。
 */
export type FlattenComponentTokens<R = ComponentTokenRegistry> = {
  [C in keyof R]: R[C] extends Record<string, unknown>
    ? { [K in keyof R[C]]: `${C & string}${Capitalize<K & string>}` }[keyof R[C]]
    : never
}[keyof R]

/**
 * 拿到某 component namespace 下所有 token 的 ident 形（带 `_` 前缀）。
 *
 * 用于组件 props 类型：`color?: ComponentTokenNames<'button'> | ColorTokens<T>`
 *
 * @example
 * type ButtonColor = ComponentTokenNames<'button'>
 * // = `_buttonPrimary` | `_buttonPrimaryHover` | `_buttonBg`
 */
export type ComponentTokenNames<C extends keyof ComponentTokenRegistry> =
  ComponentTokenRegistry[C] extends Record<string, unknown>
    ? `_${C & string}${Capitalize<keyof ComponentTokenRegistry[C] & string>}`
    : never
