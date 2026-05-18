import { injectGlobal as emotionInjectGlobal } from '@emotion/css'

/**
 * W5.5 — `@property` 注册 helper（D12）。
 *
 * 把 CSS Houdini 的 `@property` 通过 emotion `injectGlobal` 注入全局样式表，
 * 让自定义属性可参与 CSS animation（无 `@property` 时 custom property 不可动画）。
 *
 * @example
 * registerCustomProperty('--grad-angle', {
 *   syntax: '<angle>',
 *   inherits: false,
 *   initialValue: '0deg',
 * })
 *
 * // 之后可以用 transition / animation 动画化 --grad-angle
 */
export interface CustomPropertyOptions {
  /** CSS Values 3 syntax 描述，如 `<color>`, `<length>`, `<angle>`, `*` 等。 */
  syntax: string
  /** 是否继承到子元素。 */
  inherits: boolean
  /** 初始值（必须符合 syntax）。 */
  initialValue: string | number
}

export function registerCustomProperty(
  name: `--${string}`,
  options: CustomPropertyOptions,
): void {
  const block = `@property ${name} {
  syntax: '${options.syntax}';
  inherits: ${options.inherits};
  initial-value: ${options.initialValue};
}`
  // emotion injectGlobal 接 string；at-rule 形式直接传字符串
  emotionInjectGlobal(block as never)
}
