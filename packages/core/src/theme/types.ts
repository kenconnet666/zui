/**
 * 主题 schema 的基础形状：每个 category 是 `Record<string, ThemeValue>`。
 *
 * **不再有 `[customCategory: string]` 索引签名**（旧 0.10 之前的设计）：
 * 该签名强制所有字段的"任意 string key 访问"都必须返回 `Record<string, ThemeValue> | undefined`，
 * 但实际 schema 字段往往用 `Record<LiteralUnion, V>` 形式（如 `spacing: Record<Size5Keys, string>`），
 * 任意 key 访问得不到 ThemeValue —— 与索引签名冲突，导致：
 *  - 子接口（DefaultSchema 等）的字段被迫违反 base 约束（实测放宽是隐式的）
 *  - 用户 module augmentation 时同名字段无法 narrow 类型（早期 docs 试过都失败）
 *
 * 用户加 **自定义 category**（如 `customSize`）走 declaration merging 添加新字段即可：
 *
 * @example
 * declare module '@kenconnet666/zui-core' {
 *   interface ThemeSchema {
 *     customSize?: Record<string, ThemeValue>
 *   }
 * }
 */
export interface ThemeSchema {
  color?: Record<string, ThemeValue>
  spacing?: Record<string, ThemeValue>
  radius?: Record<string, ThemeValue>
  shadow?: Record<string, ThemeValue>
  fontSize?: Record<string, ThemeValue>
  fontWeight?: Record<string, ThemeValue>
  lineHeight?: Record<string, ThemeValue>
  letterSpacing?: Record<string, ThemeValue>
  fonts?: Record<string, ThemeValue>
  borders?: Record<string, ThemeValue>
  zIndex?: Record<string, ThemeValue>
  duration?: Record<string, ThemeValue>
  easing?: Record<string, ThemeValue>
  opacity?: Record<string, ThemeValue>
  aspectRatio?: Record<string, ThemeValue>
  breakpoint?: Record<string, ThemeValue>
  sizes?: Record<string, ThemeValue>
  cursor?: Record<string, ThemeValue>
  blur?: Record<string, ThemeValue>
  transitionProperty?: Record<string, ThemeValue>
}

/** Theme 单格值：字面量或 function token（function token 可访问其它已解析值）。 */
export type ThemeValue = string | number | ((ctx: ResolvedThemeContext) => string | number)

/** function token 求值时拿到的上下文（已解析的其它 category）。 */
export type ResolvedThemeContext = Record<string, Record<string, string | number>>

/** 解析后的主题（function token 已展开）。 */
export type ResolvedTheme<T extends ThemeSchema> = {
  [Cat in keyof T]: T[Cat] extends Record<string, ThemeValue>
    ? { [K in keyof T[Cat]]: string | number }
    : never
}

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

/**
 * 深合并两个 schema 的类型 —— `Theme.extend()` 的返回类型计算。
 *
 * **规则**：
 * - 同 key 在 A 和 B 都是对象 → 两者的 intersection（B 新字段叠加到 A 上）
 * - 同 key 在 B 是非对象 → 用 B 的类型（覆盖）
 * - A 独有的 key → 沿用 A
 * - B 独有的 key → 沿用 B
 *
 * 与 `DeepPartial` / `mergeTheme` 不同：DeepPartial 用于"改值不改类型"的 merge；
 * DeepMergeSchema 用于"加新 token 扩展类型"的 extend。
 *
 * @example
 * type A = { color: { primary: string }; spacing: { tiny: string } }
 * type B = { color: { brandRoyal: string }; radius: { full: string } }
 * type C = DeepMergeSchema<A, B>
 * // = {
 * //   color: { primary: string; brandRoyal: string }   // 同 key 对象 intersection
 * //   spacing: { tiny: string }                          // A 独有保留
 * //   radius: { full: string }                           // B 独有保留
 * // }
 */
export type DeepMergeSchema<A, B> = {
  [K in keyof A | keyof B]: K extends keyof B
    ? K extends keyof A
      ? A[K] extends object
        ? B[K] extends object
          ? A[K] & B[K]
          : B[K]
        : B[K]
      : B[K]
    : K extends keyof A
      ? A[K]
      : never
}

/**
 * 从 `Theme<T>` 反推 schema 类型 T。
 *
 * 用户调用 `Theme.extend()` 后，类型自动推断为 `Theme<推断的 schema>`；
 * 业务侧消费时用 `SchemaOf<typeof myLight>` 拿到 schema 类型，传给 `Chain<S>` 等。
 *
 * @example
 * const myLight = zuiLight.extend({ color: { brandRoyal: '#1a3a8f' } })
 * type MySchema = SchemaOf<typeof myLight>
 * // → ZuiSchema & { color: { brandRoyal: string } }
 *
 * const c = new Chain<MySchema>(myLight)
 * c.color._brandRoyal  // ✓
 */
export type SchemaOf<TH> = TH extends { schema: infer S } ? S : never
